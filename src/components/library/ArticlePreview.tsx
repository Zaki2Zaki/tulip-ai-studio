import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ThumbsUp, ThumbsDown, Trash2, X, Bot, Send, MessageSquare, Loader2,
  ExternalLink, Download, FolderPlus, CheckCircle, XCircle, AlertTriangle,
  ChevronLeft, ChevronRight, FileText, Sparkles,
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
  /** All selectable papers for carousel navigation */
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
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    setChatMessages([]);
    setChatInput("");
    setExecutiveSummary("");
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

  const generateSummary = async () => {
    if (summaryLoading || executiveSummary) return;
    setSummaryLoading(true);
    let summary = "";
    try {
      await streamPaperChat({
        messages: [{ role: "user", content: "Write a concise executive summary of this paper in 3-4 sentences. Focus on the problem, approach, and key results." }],
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
    return <p className="text-xs font-body leading-relaxed whitespace-pre-wrap">{content}</p>;
  };

  // Build arXiv PDF URL if possible
  const pdfUrl = paper.pdfUrl || (paper.url?.includes("arxiv.org") ? paper.url.replace("/abs/", "/pdf/") + ".pdf" : null);

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
          <h3 className="text-sm font-display font-semibold text-foreground">Deep Dive</h3>
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
            <h4 className="font-display text-base font-bold text-foreground leading-tight">{paper.title}</h4>
            <p className="text-xs text-muted-foreground font-body">
              {paper.authors?.slice(0, 5).map((a) => a.name).join(", ")}
              {(paper.authors?.length || 0) > 5 && " et al."}
            </p>
            <div className="flex items-center gap-3">
              {paper.year && <span className="text-xs text-accent font-body">{paper.year}</span>}
              {paper.venue && <span className="text-xs text-muted-foreground font-body">{paper.venue}</span>}
              {paper.citationCount != null && (
                <span className="text-xs text-muted-foreground font-body">{paper.citationCount} citations</span>
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
                  <button
                    onClick={() => handleNavigate("prev")}
                    disabled={!hasPrev}
                    className="p-2 rounded-lg border border-border transition-all disabled:opacity-20 hover:border-transparent hover:shadow-[0_0_12px_-2px_hsl(260_85%_75%_/_0.4)] group"
                  >
                    <ChevronLeft className="w-4 h-4 text-gradient-chrome-animated group-hover:animate-none" style={{
                      background: "linear-gradient(135deg, hsl(200 90% 75%), hsl(260 85% 75%), hsl(320 80% 72%), hsl(40 95% 70%), hsl(160 80% 65%))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }} />
                  </button>
                  <button
                    onClick={() => handleNavigate("next")}
                    disabled={!hasNext}
                    className="p-2 rounded-lg border border-border transition-all disabled:opacity-20 hover:border-transparent hover:shadow-[0_0_12px_-2px_hsl(260_85%_75%_/_0.4)] group"
                  >
                    <ChevronRight className="w-4 h-4" style={{
                      background: "linear-gradient(135deg, hsl(200 90% 75%), hsl(260 85% 75%), hsl(320 80% 72%), hsl(40 95% 70%), hsl(160 80% 65%))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }} />
                  </button>
                </div>
              )}
                {/* Download */}
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

                {/* Save to collection */}
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

          {/* PDF Preview area */}
          <div className="p-5 border-b border-border">
            {pdfUrl ? (
              <div className="rounded-lg overflow-hidden border border-border bg-background">
                <iframe
                  src={pdfUrl}
                  className="w-full h-[400px]"
                  title={`PDF preview: ${paper.title}`}
                />
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-muted/10 p-8 text-center">
                <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground font-body">No PDF preview available</p>
                {paper.url && (
                  <a href={paper.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline font-body mt-1 inline-block">
                    View on source →
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Executive Summary */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-xs font-body font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
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
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
                Generating summary…
              </div>
            )}
            {executiveSummary ? (
              <p className="text-sm font-body text-foreground/80 leading-relaxed">{executiveSummary}</p>
            ) : !summaryLoading && paper.abstract ? (
              <p className="text-sm font-body text-foreground/60 leading-relaxed italic">{paper.abstract}</p>
            ) : null}
          </div>
        </div>

        {/* Right: AI Chat — "Chat about this paper" */}
        <div className="w-full lg:w-[380px] flex flex-col min-h-[350px] max-h-[700px] border-l border-border">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/10">
            <Bot className="w-4 h-4 text-accent" />
            <span className="text-xs font-display font-semibold text-foreground">Chat about this paper</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 library-scroll">
            {chatMessages.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-xs text-muted-foreground font-body mb-4">
                  What would you like to know?
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSendChat(q)}
                      className="px-2.5 py-1.5 text-xs font-body rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-accent/30 hover:bg-accent/5 transition-all"
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
