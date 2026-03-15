import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  ThumbsUp, ThumbsDown, Trash2, X, Bot, Send, MessageSquare, Loader2,
  ExternalLink, Download, FolderPlus, CheckCircle, XCircle, AlertTriangle,
  ChevronLeft, ChevronRight, FileText, Sparkles, List, Link2,
} from "lucide-react";
import { streamPaperChat } from "@/lib/api/papers";
import { toast } from "sonner";

interface Paper {
  paperId: string;
  title: string;
  abstract: string | null;
  year: number | null;
  citationCount: number | null;
  url: string;
  authors: { name: string }[];
  venue: string | null;
  pdfUrl?: string;
}

type ChatMsg = { role: "user" | "assistant"; content: string };

interface ArticlePreviewProps {
  paper: Paper;
  onClose: () => void;
  onVote: (paperId: string, vote: "up" | "down") => void;
  onTrash: (paperId: string) => void;
  vote?: "up" | "down" | null;
  collections: { id: string; name: string }[];
  onAddToCollection: (paperId: string, paperTitle: string, collectionId: string) => void;
  allPapers?: Paper[];
  onNavigate?: (paper: Paper) => void;
}

const QUICK_QUESTIONS = [
  "Summarize this paper",
  "Key methodology?",
  "Is this real-time?",
  "Training datasets used?",
  "Does it use neural rendering?",
];

/** Extract key takeaway bullets from abstract text */
function extractKeyTakeaways(text: string): string[] {
  const sentences = text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 15);

  if (sentences.length <= 3) return sentences;

  const points: string[] = [];
  const chunkSize = Math.ceil(sentences.length / Math.min(5, Math.max(3, Math.ceil(sentences.length / 2))));
  for (let i = 0; i < sentences.length; i += chunkSize) {
    const chunk = sentences.slice(i, i + chunkSize).join(" ");
    if (chunk) points.push(chunk);
  }
  return points.slice(0, 5);
}

/** Find related papers by keyword overlap in title + abstract */
function findRelatedPapers(current: Paper, all: Paper[], max = 5): Paper[] {
  const stopWords = new Set(["the","a","an","of","in","for","and","to","with","on","is","by","from","at","this","that","we","our","its","are","as","be","or","it","was","has","have","not","but","can","using","based","via"]);
  const extractWords = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));

  const currentWords = new Set([
    ...extractWords(current.title),
    ...(current.abstract ? extractWords(current.abstract) : []),
  ]);

  const scored = all
    .filter(p => p.paperId !== current.paperId)
    .map(p => {
      const pWords = [...extractWords(p.title), ...(p.abstract ? extractWords(p.abstract) : [])];
      const overlap = pWords.filter(w => currentWords.has(w)).length;
      return { paper: p, score: overlap };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, max).map(s => s.paper);
}

const ArticlePreview = ({
  paper, onClose, onVote, onTrash, vote, collections, onAddToCollection,
  allPapers = [], onNavigate,
}: ArticlePreviewProps) => {
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [showCollectionMenu, setShowCollectionMenu] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [executiveSummary, setExecutiveSummary] = useState("");
  const [pdfStatus, setPdfStatus] = useState<"loading" | "loaded" | "error">("loading");
  const pdfTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    setChatMessages([]);
    setChatInput("");
    setExecutiveSummary("");
    setPdfStatus("loading");
    if (pdfTimeoutRef.current) clearTimeout(pdfTimeoutRef.current);
    // Set a timeout — if iframe hasn't signaled load after 12s, show fallback
    pdfTimeoutRef.current = setTimeout(() => {
      setPdfStatus((prev) => (prev === "loading" ? "error" : prev));
    }, 12000);
    return () => {
      if (pdfTimeoutRef.current) clearTimeout(pdfTimeoutRef.current);
    };
  }, [paper.paperId]);

  // Carousel index
  const currentIndex = allPapers.findIndex((p) => p.paperId === paper.paperId);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allPapers.length - 1 && currentIndex >= 0;

  const handleNavigate = (dir: "prev" | "next") => {
    if (!onNavigate) return;
    const idx = dir === "prev" ? currentIndex - 1 : currentIndex + 1;
    if (allPapers[idx]) onNavigate(allPapers[idx]);
  };

  const relatedPapers = useMemo(
    () => findRelatedPapers(paper, allPapers),
    [paper.paperId, allPapers]
  );

  const abstractTakeaways = useMemo(
    () => (paper.abstract ? extractKeyTakeaways(paper.abstract) : []),
    [paper.abstract]
  );

  const generateSummary = async () => {
    if (summaryLoading || executiveSummary) return;
    setSummaryLoading(true);
    let summary = "";
    try {
      await streamPaperChat({
        messages: [{ role: "user", content: "Write a concise executive summary of this paper as 3-5 bullet points using markdown bullet list format (- ). Each bullet should cover one key aspect: problem, approach, key results, implications. Be specific and concise." }],
        paperContext: {
          title: paper.title,
          authors: paper.authors?.map((a) => a.name),
          year: paper.year || undefined,
          abstract: paper.abstract || undefined,
          source: "search",
        },
        onDelta: (chunk) => {
          summary += chunk;
          setExecutiveSummary(summary);
        },
        onDone: () => setSummaryLoading(false),
      });
    } catch {
      toast.error("Failed to generate summary");
      setSummaryLoading(false);
    }
  };

  const handleSendChat = async (overrideInput?: string) => {
    const input = overrideInput || chatInput.trim();
    if (!input || chatLoading) return;

    const userMsg: ChatMsg = { role: "user", content: input };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    let assistantSoFar = "";
    const allMessages = [...chatMessages, userMsg];

    try {
      await streamPaperChat({
        messages: allMessages,
        paperContext: {
          title: paper.title,
          authors: paper.authors?.map((a) => a.name),
          year: paper.year || undefined,
          abstract: paper.abstract || undefined,
          source: "search",
        },
        onDelta: (chunk) => {
          assistantSoFar += chunk;
          setChatMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant") {
              return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
            }
            return [...prev, { role: "assistant", content: assistantSoFar }];
          });
        },
        onDone: () => setChatLoading(false),
      });
    } catch (err: any) {
      toast.error(err.message || "Chat failed");
      setChatLoading(false);
    }
  };

  const renderResponse = (content: string) => {
    const lower = content.trim().toLowerCase();
    if (lower.startsWith("yes") && content.length < 200) {
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-green-400">
            <CheckCircle className="w-3.5 h-3.5" />
            <span className="text-xs font-body font-semibold">Yes</span>
          </div>
          {content.length > 4 && <p className="text-xs font-body text-muted-foreground leading-relaxed">{content.slice(4).trim()}</p>}
        </div>
      );
    }
    if (lower.startsWith("no") && content.length < 200) {
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-destructive">
            <XCircle className="w-3.5 h-3.5" />
            <span className="text-xs font-body font-semibold">No</span>
          </div>
          {content.length > 3 && <p className="text-xs font-body text-muted-foreground leading-relaxed">{content.slice(3).trim()}</p>}
        </div>
      );
    }
    if (lower.startsWith("partial") && content.length < 200) {
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-yellow-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="text-xs font-body font-semibold">Partial</span>
          </div>
          <p className="text-xs font-body text-muted-foreground leading-relaxed">{content.slice(7).trim()}</p>
        </div>
      );
    }
    // Render markdown for longer/complex responses
    return (
      <div className="text-xs font-body leading-relaxed prose prose-invert prose-xs max-w-none [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:my-0.5 [&_p]:my-1 [&_code]:bg-muted/50 [&_code]:px-1 [&_code]:rounded [&_h1]:text-sm [&_h2]:text-sm [&_h3]:text-xs">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    );
  };

  // Build PDF URL: prefer explicit pdfUrl, then try arXiv pattern, then Unpaywall via DOI
  const pdfUrl = paper.pdfUrl
    || (paper.url?.includes("arxiv.org") ? paper.url.replace("/abs/", "/pdf/") + ".pdf" : null);

  // Google Docs viewer for better PDF rendering
  const pdfViewerUrl = pdfUrl
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="border border-border rounded-xl bg-card/30 overflow-hidden"
    >
      {/* Header with carousel nav */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/10">
        <div className="flex items-center gap-3">
          <FileText className="w-4 h-4 text-primary" />
          <h3 className="text-base font-display font-semibold text-foreground">Deep Dive</h3>
          {allPapers.length > 1 && (
            <span className="text-xs font-body text-muted-foreground">
              {currentIndex + 1} / {allPapers.length}
            </span>
          )}
        </div>
        <button onClick={onClose} className="p-1.5 rounded-md hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left: Paper preview + Deep Dive */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Paper header + actions */}
          <div className="p-5 space-y-3 border-b border-border">
            <h4 className="font-display text-xl font-bold text-foreground leading-tight">{paper.title}</h4>
            <p className="text-base text-foreground font-body">
              {paper.authors?.slice(0, 5).map((a) => a.name).join(", ")}
              {(paper.authors?.length || 0) > 5 && " et al."}
            </p>
            <div className="flex items-center gap-3">
              {paper.year && <span className="text-base text-accent font-body">{paper.year}</span>}
              {paper.venue && <span className="text-base text-foreground font-body">{paper.venue}</span>}
              {paper.citationCount != null && (
                <span className="text-base text-foreground font-body">{paper.citationCount} citations</span>
              )}
            </div>

            {/* Action buttons row */}
            <div className="flex items-center gap-2 pt-2 flex-wrap">
              <button
                onClick={() => onVote(paper.paperId, "up")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-body font-semibold transition-all ${
                  vote === "up"
                    ? "bg-green-500/10 border-green-500/30 text-green-400"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-green-500/20"
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                Relevant
              </button>
              <button
                onClick={() => onVote(paper.paperId, "down")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-body font-semibold transition-all ${
                  vote === "down"
                    ? "bg-destructive/10 border-destructive/30 text-destructive"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-destructive/20"
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                Not Useful
              </button>
              <button
                onClick={() => onTrash(paper.paperId)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-body text-muted-foreground hover:text-destructive hover:border-destructive/20 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* Carousel nav — rainbow chrome */}
              {allPapers.length > 1 && (
                <div className="flex items-center gap-1">
                  <svg width="0" height="0" className="absolute">
                    <defs>
                      <linearGradient id="chrome-arrow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(200, 100%, 70%)" />
                        <stop offset="25%" stopColor="hsl(280, 100%, 75%)" />
                        <stop offset="50%" stopColor="hsl(320, 100%, 72%)" />
                        <stop offset="75%" stopColor="hsl(40, 100%, 68%)" />
                        <stop offset="100%" stopColor="hsl(160, 100%, 65%)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <button
                    onClick={() => handleNavigate("prev")}
                    disabled={!hasPrev}
                    className="p-2 rounded-lg border border-border transition-all disabled:opacity-20 hover:border-transparent hover:shadow-[0_0_16px_-2px_hsl(280_100%_75%_/_0.5)]"
                  >
                    <ChevronLeft className="w-5 h-5" style={{ stroke: "url(#chrome-arrow-grad)" }} />
                  </button>
                  <button
                    onClick={() => handleNavigate("next")}
                    disabled={!hasNext}
                    className="p-2 rounded-lg border border-border transition-all disabled:opacity-20 hover:border-transparent hover:shadow-[0_0_16px_-2px_hsl(280_100%_75%_/_0.5)]"
                  >
                    <ChevronRight className="w-5 h-5" style={{ stroke: "url(#chrome-arrow-grad)" }} />
                  </button>
                </div>
              )}

              <div className="ml-auto flex items-center gap-2">
                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-body font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PDF
                  </a>
                )}
                {paper.url && (
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-xs font-body text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Source
                  </a>
                )}
                <div className="relative">
                  <button
                    onClick={() => setShowCollectionMenu(!showCollectionMenu)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-accent/30 bg-accent/5 text-accent text-xs font-body font-semibold hover:bg-accent/10 transition-all"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    Save
                  </button>
                  {showCollectionMenu && (
                    <div className="absolute bottom-full right-0 mb-1 bg-card border border-border rounded-lg shadow-xl z-20 p-1 min-w-[160px]">
                      {collections.length === 0 ? (
                        <p className="text-xs text-muted-foreground p-2 font-body">No collections yet.</p>
                      ) : (
                        collections.map((col) => (
                          <button
                            key={col.id}
                            onClick={() => {
                              onAddToCollection(paper.paperId, paper.title, col.id);
                              setShowCollectionMenu(false);
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-body text-foreground hover:bg-muted/30 rounded-md"
                          >
                            {col.name}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Abstract — Key Takeaways */}
          {paper.abstract && (
            <div className="p-5 border-b border-border">
              <h5 className="text-sm font-body font-semibold uppercase tracking-wider text-foreground mb-3 flex items-center gap-1.5">
                <List className="w-4 h-4 text-primary" />
                Key Takeaways
              </h5>
              <ul className="space-y-2">
                {abstractTakeaways.map((point, i) => (
                  <li key={i} className="flex gap-2.5 text-base font-body text-foreground leading-relaxed">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary/60" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* PDF Preview — embedded viewer */}
          <div className="p-5 border-b border-border">
            <h5 className="text-sm font-body font-semibold uppercase tracking-wider text-foreground mb-3 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-primary" />
              Paper Preview
            </h5>
            {pdfViewerUrl ? (
              <div className="rounded-lg overflow-hidden border border-border bg-background shadow-inner">
                {pdfStatus === "loading" && (
                  <div className="w-full h-[500px] flex flex-col items-center justify-center gap-3 bg-muted/10">
                    <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
                    <p className="text-xs text-foreground font-body">Loading PDF preview…</p>
                  </div>
                )}
                {pdfStatus === "error" && (
                  <div className="w-full h-[300px] flex flex-col items-center justify-center gap-3 bg-muted/10 p-8">
                    <FileText className="w-10 h-10 text-foreground/30" />
                    <p className="text-sm text-foreground font-body">PDF preview couldn't load</p>
                    <p className="text-xs text-foreground/80 font-body max-w-sm text-center">
                      The document may be behind a paywall or the viewer timed out.
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <a
                        href={pdfUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-body font-semibold hover:opacity-90 transition-opacity"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download PDF
                      </a>
                      {paper.url && (
                        <a
                          href={paper.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-body text-foreground hover:text-primary transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View source
                        </a>
                      )}
                      <button
                        onClick={() => {
                          setPdfStatus("loading");
                          pdfTimeoutRef.current = setTimeout(() => {
                            setPdfStatus((prev) => (prev === "loading" ? "error" : prev));
                          }, 12000);
                        }}
                        className="text-xs font-body text-primary hover:underline"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                )}
                <iframe
                  key={`${paper.paperId}-${pdfStatus}`}
                  src={pdfViewerUrl}
                  className={`w-full h-[500px] ${pdfStatus !== "loaded" ? "hidden" : ""}`}
                  title={`PDF preview: ${paper.title}`}
                  style={{ border: "none" }}
                  allow="autoplay"
                  onLoad={() => {
                    setPdfStatus("loaded");
                    if (pdfTimeoutRef.current) clearTimeout(pdfTimeoutRef.current);
                  }}
                />
                {pdfStatus === "loaded" && (
                  <div className="flex items-center justify-between px-3 py-2 bg-muted/20 border-t border-border">
                    <span className="text-[10px] text-foreground/70 font-body">Powered by Google Docs Viewer</span>
                    <a
                      href={pdfUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-primary hover:underline font-body flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> Open PDF directly
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-muted/10 p-8 text-center">
                <FileText className="w-10 h-10 text-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-foreground font-body">No PDF preview available</p>
                <p className="text-xs text-foreground/80 font-body mt-2 max-w-sm mx-auto">
                  This paper may not have a publicly accessible PDF. Use the links below to access it.
                </p>
                {paper.url && (
                  <a 
                    href={paper.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1.5 px-4 py-2 mt-4 rounded-lg bg-primary text-primary-foreground text-xs font-body font-semibold hover:opacity-90 transition-opacity"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View on source
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Executive Summary — bullet points */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-body font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-accent" />
                Executive Summary
              </h5>
              {!executiveSummary && !summaryLoading && (
                <button
                  onClick={generateSummary}
                  className="text-xs font-body text-primary hover:underline"
                >
                  Generate with AI
                </button>
              )}
            </div>
            {summaryLoading && !executiveSummary && (
              <div className="flex items-center gap-2 text-xs text-foreground font-body">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
                Generating summary…
              </div>
            )}
            {executiveSummary ? (
              <div className="text-sm font-body text-foreground leading-relaxed prose prose-invert prose-sm max-w-none [&_ul]:list-disc [&_ul]:pl-4 [&_li]:my-1 [&_p]:my-1">
                <ReactMarkdown>{executiveSummary}</ReactMarkdown>
              </div>
            ) : !summaryLoading && paper.abstract ? (
              <p className="text-xs font-body text-foreground/80 italic">Click "Generate with AI" for a structured summary of key findings.</p>
            ) : null}
          </div>
          {/* Related Papers */}
          {relatedPapers.length > 0 && (
            <div className="p-5 border-t border-border">
              <h5 className="text-sm font-body font-semibold uppercase tracking-wider text-foreground mb-3 flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-primary" />
                Related Papers
              </h5>
              <div className="space-y-2">
                {relatedPapers.map((rp) => (
                  <button
                    key={rp.paperId}
                    onClick={() => onNavigate?.(rp)}
                    className="w-full text-left p-3 rounded-lg border border-border bg-muted/10 hover:bg-muted/25 hover:border-primary/20 transition-all group"
                  >
                    <p className="text-sm font-body font-medium text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {rp.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      {rp.year && <span className="text-[11px] text-accent font-body">{rp.year}</span>}
                      {rp.authors?.length > 0 && (
                        <span className="text-[11px] text-foreground font-body truncate">
                          {rp.authors.slice(0, 2).map(a => a.name).join(", ")}
                          {rp.authors.length > 2 && " et al."}
                        </span>
                      )}
                      {rp.citationCount != null && rp.citationCount > 0 && (
                        <span className="text-[11px] text-foreground font-body">{rp.citationCount} cit.</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: AI Chat */}
        <div className="w-full lg:w-[380px] flex flex-col min-h-[350px] max-h-[700px] border-l border-border">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/10">
            <Bot className="w-4 h-4 text-accent" />
            <span className="text-sm font-display font-semibold text-foreground">Chat about this paper</span>
            {chatMessages.length > 0 && (
              <button
                onClick={() => setChatMessages([])}
                className="ml-auto text-[10px] font-body text-foreground hover:text-primary transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 library-scroll">
            {chatMessages.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="w-8 h-8 text-foreground/20 mx-auto mb-3" />
                <p className="text-xs text-foreground font-body mb-4">
                  What would you like to know?
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSendChat(q)}
                      className="px-2.5 py-1.5 text-xs font-body rounded-lg border border-border text-foreground hover:text-primary hover:border-accent/30 hover:bg-accent/5 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[90%] px-3 py-2.5 rounded-xl ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground text-xs font-body"
                      : "bg-muted/30 text-foreground border border-border"
                  }`}
                >
                  {msg.role === "assistant" ? renderResponse(msg.content) : (
                    <p className="text-xs font-body">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}

            {chatLoading && chatMessages[chatMessages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div className="bg-muted/30 border border-border rounded-xl px-3 py-2.5">
                  <Loader2 className="w-3.5 h-3.5 text-accent animate-spin" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendChat()}
                placeholder="What would you like to know?"
                className="flex-1 bg-muted/20 border border-border rounded-lg px-3 py-2.5 text-xs text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all"
                disabled={chatLoading}
              />
              <button
                onClick={() => handleSendChat()}
                disabled={chatLoading || !chatInput.trim()}
                className="p-2.5 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ArticlePreview;
