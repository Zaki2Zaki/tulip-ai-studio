import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ThumbsUp, ThumbsDown, Download, FolderPlus, ExternalLink,
  FileText, X, Loader2, Send, MessageSquare, Bot,
} from "lucide-react";
import { streamPaperChat } from "@/lib/api/papers";
import { toast } from "sonner";

interface ArticleSearchProps {
  collections: { id: string; name: string }[];
  onAddToCollection: (paperId: string, paperTitle: string, collectionId: string) => void;
}

interface ArxivPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  published: string;
  pdfUrl: string;
  categories: string[];
}

type ChatMsg = { role: "user" | "assistant"; content: string };

const parseArxivXml = (xml: string): ArxivPaper[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  const entries = doc.querySelectorAll("entry");
  const papers: ArxivPaper[] = [];

  entries.forEach((entry) => {
    const id = entry.querySelector("id")?.textContent?.replace("http://arxiv.org/abs/", "") || "";
    const title = entry.querySelector("title")?.textContent?.replace(/\s+/g, " ").trim() || "";
    const abstract = entry.querySelector("summary")?.textContent?.replace(/\s+/g, " ").trim() || "";
    const published = entry.querySelector("published")?.textContent || "";
    const authors = Array.from(entry.querySelectorAll("author name")).map((n) => n.textContent || "");
    const pdfLink = Array.from(entry.querySelectorAll("link")).find(
      (l) => l.getAttribute("title") === "pdf"
    );
    const pdfUrl = pdfLink?.getAttribute("href") || `https://arxiv.org/pdf/${id}`;
    const categories = Array.from(entry.querySelectorAll("category")).map(
      (c) => c.getAttribute("term") || ""
    );

    if (title) papers.push({ id, title, authors, abstract, published, pdfUrl, categories });
  });

  return papers;
};

const ArticleSearch = ({ collections, onAddToCollection }: ArticleSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ArxivPaper[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<ArxivPaper | null>(null);
  const [votes, setVotes] = useState<Record<string, "up" | "down">>({});
  const [showCollectionMenu, setShowCollectionMenu] = useState<string | null>(null);

  // AI Chat state
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Reset chat when paper changes
  useEffect(() => {
    setChatMessages([]);
    setChatInput("");
  }, [selectedPaper?.id]);

  const searchArxiv = async (searchQuery: string) => {
    setLoading(true);
    try {
      const isId = /^\d{4}\.\d{4,5}(v\d+)?$/.test(searchQuery.trim());
      const url = isId
        ? `https://export.arxiv.org/api/query?id_list=${searchQuery.trim()}&max_results=1`
        : `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(searchQuery)}&start=0&max_results=10&sortBy=relevance&sortOrder=descending`;

      const res = await fetch(url);
      const xml = await res.text();
      const papers = parseArxivXml(xml);
      setResults(papers);

      if (isId && papers.length === 1) {
        setSelectedPaper(papers[0]);
      }
    } catch (err) {
      console.error("arXiv search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) searchArxiv(query.trim());
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || !selectedPaper || chatLoading) return;

    const userMsg: ChatMsg = { role: "user", content: chatInput.trim() };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    let assistantSoFar = "";
    const allMessages = [...chatMessages, userMsg];

    try {
      await streamPaperChat({
        messages: allMessages,
        paperContext: {
          title: selectedPaper.title,
          authors: selectedPaper.authors,
          year: parseInt(selectedPaper.published.slice(0, 4)) || undefined,
          abstract: selectedPaper.abstract,
          source: "arxiv",
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
      console.error("Chat error:", err);
      toast.error(err.message || "Chat failed");
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="border border-border rounded-xl bg-card/30 p-4 space-y-3">
        <h3 className="text-sm font-display font-semibold text-foreground flex items-center gap-2">
          <FileText className="w-4 h-4 text-accent" />
          Article Search
        </h3>
        <form onSubmit={handleSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter paper title or arXiv ID (e.g. 2503.03576)…"
            className="w-full bg-muted/30 border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-foreground font-body placeholder:text-white focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
          />
        </form>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
        )}

        {!loading && results.length > 0 && !selectedPaper && (
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {results.map((paper) => (
              <button
                key={paper.id}
                onClick={() => setSelectedPaper(paper)}
                className="w-full text-left p-3 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-border"
              >
                <p className="text-sm font-display font-semibold text-foreground line-clamp-1">{paper.title}</p>
                <p className="text-xs text-white font-body mt-0.5">
                  {paper.authors.slice(0, 3).join(", ")}
                  {paper.authors.length > 3 && " et al."} · {paper.published.slice(0, 4)}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Paper Preview + AI Chat */}
      <AnimatePresence>
        {selectedPaper && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border border-border rounded-xl bg-card/30 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-sm font-display font-semibold text-foreground">Paper Preview</h3>
              <button
                onClick={() => setSelectedPaper(null)}
                className="p-1 rounded-md hover:bg-muted/30 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row">
              {/* PDF Preview */}
              <div className="flex-1 bg-muted/10 min-h-[400px]">
                <iframe
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedPaper.pdfUrl)}&embedded=true`}
                  className="w-full h-[400px] lg:h-[500px]"
                  title={selectedPaper.title}
                />
              </div>

              {/* Info + Chat panel */}
              <div className="w-full lg:w-96 flex flex-col border-t lg:border-t-0 lg:border-l border-border">
                {/* Paper info */}
                <div className="p-4 space-y-3 border-b border-border">
                  <h4 className="font-display text-sm font-bold text-foreground leading-tight">
                    {selectedPaper.title}
                  </h4>
                  <p className="text-xs text-white font-body">
                    {selectedPaper.authors.slice(0, 4).join(", ")}
                    {selectedPaper.authors.length > 4 && " et al."}
                  </p>
                  <p className="text-xs text-accent font-body">
                    {selectedPaper.published.slice(0, 10)} · {selectedPaper.categories.slice(0, 2).join(", ")}
                  </p>

                  {/* Vote + Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setVotes((v) => ({ ...v, [selectedPaper.id]: "up" }))}
                      className={`p-1.5 rounded-lg border transition-all ${
                        votes[selectedPaper.id] === "up"
                          ? "bg-green-500/10 border-green-500/30 text-green-400"
                          : "border-border text-white hover:text-foreground"
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setVotes((v) => ({ ...v, [selectedPaper.id]: "down" }))}
                      className={`p-1.5 rounded-lg border transition-all ${
                        votes[selectedPaper.id] === "down"
                          ? "bg-destructive/10 border-destructive/30 text-destructive"
                          : "border-border text-white hover:text-foreground"
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={selectedPaper.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-body font-semibold hover:opacity-90 transition-opacity"
                    >
                      <Download className="w-3.5 h-3.5" />
                      PDF
                    </a>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowCollectionMenu(showCollectionMenu === selectedPaper.id ? null : selectedPaper.id)
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-accent/30 bg-accent/5 text-accent text-xs font-body font-semibold hover:bg-accent/10 transition-all"
                      >
                        <FolderPlus className="w-3.5 h-3.5" />
                        Save
                      </button>

                      {showCollectionMenu === selectedPaper.id && (
                        <div className="absolute bottom-full left-0 right-0 mb-1 bg-card border border-border rounded-lg shadow-lg z-10 p-1 min-w-[160px]">
                          {collections.length === 0 ? (
                            <p className="text-xs text-white p-2 font-body">No collections yet.</p>
                          ) : (
                            collections.map((col) => (
                              <button
                                key={col.id}
                                onClick={() => {
                                  onAddToCollection(selectedPaper.id, selectedPaper.title, col.id);
                                  setShowCollectionMenu(null);
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

                    <a
                      href={`https://arxiv.org/abs/${selectedPaper.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2 py-1.5 text-xs text-white hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      arXiv
                    </a>
                  </div>
                </div>

                {/* AI Chat */}
                <div className="flex flex-col flex-1 min-h-[250px] max-h-[350px]">
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/10">
                    <Bot className="w-4 h-4 text-accent" />
                    <span className="text-xs font-display font-semibold text-foreground">AI Deep Dive</span>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {chatMessages.length === 0 && (
                      <div className="text-center py-6">
                        <MessageSquare className="w-8 h-8 text-white/30 mx-auto mb-2" />
                        <p className="text-xs text-white font-body">
                          Ask anything about this paper
                        </p>
                        <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                          {["Summarize this paper", "Key findings?", "Methodology?"].map((q) => (
                            <button
                              key={q}
                              onClick={() => {
                                setChatInput(q);
                              }}
                              className="px-2 py-1 text-xs font-body rounded-md border border-border text-white hover:text-foreground hover:border-primary/20 transition-all"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] px-3 py-2 rounded-xl text-xs font-body leading-relaxed ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/30 text-foreground border border-border"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}

                    {chatLoading && chatMessages[chatMessages.length - 1]?.role !== "assistant" && (
                      <div className="flex justify-start">
                        <div className="bg-muted/30 border border-border rounded-xl px-3 py-2">
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
                        className="flex-1 bg-muted/20 border border-border rounded-lg px-3 py-2 text-xs text-foreground font-body placeholder:text-white focus:outline-none focus:ring-1 focus:ring-accent/30"
                        disabled={chatLoading}
                      />
                      <button
                        onClick={handleSendChat}
                        disabled={chatLoading || !chatInput.trim()}
                        className="p-2 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArticleSearch;
