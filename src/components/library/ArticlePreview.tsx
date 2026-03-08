import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ThumbsUp, ThumbsDown, Trash2, X, Bot, Send, MessageSquare, Loader2,
  ExternalLink, Download, FolderPlus, CheckCircle, XCircle, AlertTriangle,
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
}: ArticlePreviewProps) => {
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [showCollectionMenu, setShowCollectionMenu] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    setChatMessages([]);
    setChatInput("");
  }, [paper.paperId]);

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
    // Check for quick validation patterns
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

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="border border-border rounded-xl bg-card/30 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/10">
        <h3 className="text-sm font-display font-semibold text-foreground">Article Preview</h3>
        <button onClick={onClose} className="p-1 rounded-md hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left: Paper details */}
        <div className="flex-1 p-5 space-y-4 border-r border-border min-w-0">
          <div>
            <h4 className="font-display text-base font-bold text-foreground leading-tight mb-2">{paper.title}</h4>
            <p className="text-xs text-muted-foreground font-body">
              {paper.authors?.slice(0, 5).map((a) => a.name).join(", ")}
              {(paper.authors?.length || 0) > 5 && " et al."}
            </p>
            <div className="flex items-center gap-3 mt-2">
              {paper.year && <span className="text-xs text-accent font-body">{paper.year}</span>}
              {paper.venue && <span className="text-xs text-muted-foreground font-body">{paper.venue}</span>}
              {paper.citationCount != null && (
                <span className="text-xs text-muted-foreground font-body">{paper.citationCount} citations</span>
              )}
            </div>
          </div>

          {/* Abstract */}
          {paper.abstract && (
            <div>
              <h5 className="text-xs font-body font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Abstract</h5>
              <p className="text-sm font-body text-foreground/80 leading-relaxed">{paper.abstract}</p>
            </div>
          )}

          {/* Key highlights placeholder */}
          <div>
            <h5 className="text-xs font-body font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Metadata</h5>
            <div className="flex flex-wrap gap-2">
              {paper.venue && (
                <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-body text-accent">
                  {paper.venue}
                </span>
              )}
              <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-body text-primary">
                {paper.citationCount || 0} cited
              </span>
            </div>
          </div>

          {/* Evaluation controls */}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
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
              Remove
            </button>

            <div className="ml-auto flex items-center gap-2">
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
              {paper.pdfUrl && (
                <a
                  href={paper.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-body font-semibold hover:opacity-90 transition-opacity"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF
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

        {/* Right: AI Assistant */}
        <div className="w-full lg:w-[380px] flex flex-col min-h-[350px] max-h-[500px]">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/10">
            <Bot className="w-4 h-4 text-accent" />
            <span className="text-xs font-display font-semibold text-foreground">Ask About This Paper</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 library-scroll">
            {chatMessages.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-xs text-muted-foreground font-body mb-4">
                  What would you like to know about this article?
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
                placeholder="What would you like to know about this article?"
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
