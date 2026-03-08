import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ThumbsUp, ThumbsDown, Download, FolderPlus, ExternalLink, FileText, X, Loader2 } from "lucide-react";

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

  const searchArxiv = async (searchQuery: string) => {
    setLoading(true);
    try {
      // arXiv supports search by ID or keyword
      const isId = /^\d{4}\.\d{4,5}(v\d+)?$/.test(searchQuery.trim());
      const url = isId
        ? `https://export.arxiv.org/api/query?id_list=${searchQuery.trim()}&max_results=1`
        : `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(searchQuery)}&start=0&max_results=10&sortBy=relevance&sortOrder=descending`;

      const res = await fetch(url);
      const xml = await res.text();
      const papers = parseArxivXml(xml);
      setResults(papers);

      // Auto-select if single result (ID search)
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

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="border border-border rounded-xl bg-card/30 p-4 space-y-3">
        <h3 className="text-sm font-display font-semibold text-foreground flex items-center gap-2">
          <FileText className="w-4 h-4 text-accent" />
          Article Search
        </h3>
        <form onSubmit={handleSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter paper title or arXiv ID (e.g. 2503.03576)…"
            className="w-full bg-muted/30 border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
          />
        </form>

        {/* Results list */}
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
                <p className="text-xs text-muted-foreground font-body mt-0.5">
                  {paper.authors.slice(0, 3).join(", ")}
                  {paper.authors.length > 3 && " et al."} · {paper.published.slice(0, 4)}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Paper Preview */}
      <AnimatePresence>
        {selectedPaper && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border border-border rounded-xl bg-card/30 overflow-hidden"
          >
            {/* Header with actions */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-sm font-display font-semibold text-foreground">Paper Preview</h3>
              <button
                onClick={() => setSelectedPaper(null)}
                className="p-1 rounded-md hover:bg-muted/30 text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row">
              {/* PDF Preview */}
              <div className="flex-1 bg-muted/10 min-h-[400px]">
                <iframe
                  src={selectedPaper.pdfUrl}
                  className="w-full h-[400px] lg:h-[500px]"
                  title={selectedPaper.title}
                />
              </div>

              {/* Paper info + actions */}
              <div className="w-full lg:w-80 p-4 space-y-4 border-t lg:border-t-0 lg:border-l border-border">
                <div>
                  <h4 className="font-display text-sm font-bold text-foreground leading-tight">
                    {selectedPaper.title}
                  </h4>
                  <p className="text-xs text-muted-foreground font-body mt-1">
                    {selectedPaper.authors.slice(0, 4).join(", ")}
                    {selectedPaper.authors.length > 4 && " et al."}
                  </p>
                  <p className="text-xs text-accent font-body mt-1">
                    {selectedPaper.published.slice(0, 10)} · {selectedPaper.categories.slice(0, 2).join(", ")}
                  </p>
                </div>

                <p className="text-xs text-muted-foreground font-body leading-relaxed line-clamp-6">
                  {selectedPaper.abstract}
                </p>

                {/* Vote buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-body text-muted-foreground mr-1">Is this the right paper?</span>
                  <button
                    onClick={() => setVotes((v) => ({ ...v, [selectedPaper.id]: "up" }))}
                    className={`p-2 rounded-lg border transition-all ${
                      votes[selectedPaper.id] === "up"
                        ? "bg-green-500/10 border-green-500/30 text-green-400"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setVotes((v) => ({ ...v, [selectedPaper.id]: "down" }))}
                    className={`p-2 rounded-lg border transition-all ${
                      votes[selectedPaper.id] === "down"
                        ? "bg-destructive/10 border-destructive/30 text-destructive"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Action buttons */}
                <div className="space-y-2">
                  <a
                    href={selectedPaper.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-body font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </a>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowCollectionMenu(showCollectionMenu === selectedPaper.id ? null : selectedPaper.id)
                      }
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-accent/30 bg-accent/5 text-accent text-sm font-body font-semibold hover:bg-accent/10 transition-all"
                    >
                      <FolderPlus className="w-4 h-4" />
                      Add to Collection
                    </button>

                    {showCollectionMenu === selectedPaper.id && (
                      <div className="absolute bottom-full left-0 right-0 mb-1 bg-card border border-border rounded-lg shadow-lg z-10 p-1">
                        {collections.length === 0 ? (
                          <p className="text-xs text-muted-foreground p-2 font-body">No collections yet. Create one in the sidebar.</p>
                        ) : (
                          collections.map((col) => (
                            <button
                              key={col.id}
                              onClick={() => {
                                onAddToCollection(selectedPaper.id, selectedPaper.title, col.id);
                                setShowCollectionMenu(null);
                              }}
                              className="w-full text-left px-3 py-2 text-sm font-body text-foreground hover:bg-muted/30 rounded-md transition-colors"
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
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-muted-foreground text-sm font-body hover:text-foreground hover:border-primary/20 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on arXiv
                  </a>
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
