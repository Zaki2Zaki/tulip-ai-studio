import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Lock, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingModal from "@/components/PricingModal";
import LibrarySidebar from "@/components/library/LibrarySidebar";
import type { Collection } from "@/components/library/LibrarySidebar";
import PapersTable from "@/components/library/PapersTable";
import SearchResultsCount from "@/components/library/SearchResultsCount";
import ArticlePreview from "@/components/library/ArticlePreview";
import StatsRow from "@/components/library/StatsRow";
import ViewToggle from "@/components/library/ViewToggle";
import type { ViewMode } from "@/components/library/ViewToggle";
import { searchPapers } from "@/lib/api/papers";
import type { Paper } from "@/lib/api/papers";
import { DEFAULT_ENABLED_KEYS } from "@/components/library/DataSources";
import { toast } from "sonner";

const CATEGORIES = [
  { id: "3d-modeling", label: "3D Assets Modeling", query: "3D modeling computer graphics mesh" },
  { id: "animation", label: "Animation", query: "computer animation motion synthesis" },
  { id: "rigging", label: "Rigging", query: "character rigging skeletal animation" },
  { id: "lighting", label: "Light", query: "physically based rendering lighting global illumination" },
  { id: "world-building", label: "World Scale Building", query: "procedural world generation large scale environment" },
];

const LibraryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubscribed] = useState(true);
  const [showPricing, setShowPricing] = useState(false);
  const [searchCount, setSearchCount] = useState(0);
  const [selectedPapers, setSelectedPapers] = useState<Set<string>>(new Set());
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [sourceCounts, setSourceCounts] = useState<Record<string, number>>({});
  const [previewPaper, setPreviewPaper] = useState<Paper | null>(null);
  const [votes, setVotes] = useState<Record<string, "up" | "down">>({});
  const [trashedPapers, setTrashedPapers] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [enabledSources, setEnabledSources] = useState<Set<string>>(new Set(DEFAULT_ENABLED_KEYS));

  const FREE_SEARCH_LIMIT = 3;
  const needsPaywall = !isSubscribed && searchCount >= FREE_SEARCH_LIMIT;

  const fetchPapers = async (query: string) => {
    if (needsPaywall) {
      setShowPricing(true);
      return;
    }
    setLoading(true);
    setLastSearchQuery(query);
    try {
      const activeSrcKeys = Array.from(enabledSources).filter(k => ["crossref", "arxiv", "openalex", "nvidia"].includes(k));
      const result = await searchPapers(query, activeSrcKeys.length > 0 ? activeSrcKeys : undefined);
      setPapers(result.papers);
      setSourceCounts(result.counts);
      setSearchCount((c) => c + 1);
    } catch (err) {
      console.error("Search failed:", err);
      try {
        const res = await fetch(
          `https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=20&sort=relevance&order=desc`
        );
        const data = await res.json();
        const items = (data.message?.items || []).map((item: any) => ({
          paperId: item.DOI || Math.random().toString(),
          title: Array.isArray(item.title) ? item.title[0] : item.title || "Untitled",
          abstract: item.abstract?.replace(/<[^>]*>/g, "") || null,
          year: item.published?.["date-parts"]?.[0]?.[0] || null,
          citationCount: item["is-referenced-by-count"] || null,
          url: item.URL || `https://doi.org/${item.DOI}`,
          authors: (item.author || []).map((a: any) => ({ name: `${a.given || ""} ${a.family || ""}`.trim() })),
          venue: item["container-title"]?.[0] || null,
          source: "crossref",
        }));
        setPapers(items);
        setSourceCounts({ crossref: items.length });
        setSearchCount((c) => c + 1);
      } catch {
        setPapers([]);
        setSourceCounts({});
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cat = CATEGORIES.find((c) => c.id === activeCategory);
    if (cat) fetchPapers(cat.query);
  }, [activeCategory, enabledSources]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) fetchPapers(searchQuery.trim());
  };

  const handleToggleSelect = (id: string) => {
    setSelectedPapers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedPapers.size === papers.length) {
      setSelectedPapers(new Set());
    } else {
      setSelectedPapers(new Set(papers.filter((_, i) => isSubscribed || i < 5).map((p) => p.paperId)));
    }
  };

  const handleCreateCollection = (name: string) => {
    setCollections((prev) => [...prev, { id: crypto.randomUUID(), name, paperIds: [] }]);
    toast.success(`Collection "${name}" created`);
  };

  const handleDeleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
    toast.info("Collection removed");
  };

  const handleAddToCollection = (paperId: string, paperTitle: string, collectionId: string) => {
    setCollections((prev) =>
      prev.map((c) =>
        c.id === collectionId && !c.paperIds.includes(paperId)
          ? { ...c, paperIds: [...c.paperIds, paperId] }
          : c
      )
    );
    const col = collections.find((c) => c.id === collectionId);
    toast.success(`Added to "${col?.name}"`);
  };

  const handleVote = (paperId: string, voteType: "up" | "down") => {
    setVotes((prev) => ({ ...prev, [paperId]: voteType }));
    if (voteType === "up") {
      toast.success("Marked as relevant — floated to top");
    } else {
      toast.info("Noted as not useful — preferences updated");
    }
  };

  const handleTrash = (paperId: string) => {
    setTrashedPapers((prev) => new Set(prev).add(paperId));
    setPreviewPaper(null);
    toast("Paper removed from results", {
      action: {
        label: "Undo",
        onClick: () => setTrashedPapers((prev) => {
          const next = new Set(prev);
          next.delete(paperId);
          return next;
        }),
      },
    });
  };

  // Sort upvoted papers to the top
  const visiblePapers = useMemo(() => {
    const filtered = papers.filter((p) => !trashedPapers.has(p.paperId));
    return filtered.sort((a, b) => {
      const aUp = votes[a.paperId] === "up" ? 1 : 0;
      const bUp = votes[b.paperId] === "up" ? 1 : 0;
      return bUp - aUp;
    });
  }, [papers, trashedPapers, votes]);

  const sourcesList = Object.entries(sourceCounts).map(([name, count]) => ({ name, count }));

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/50 mb-4">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-xs font-body tracking-widest uppercase text-muted-foreground">Research Library</span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-3">
              <span className="text-gradient-lavender">Library</span> R&D
            </h1>
            <p className="text-base text-muted-foreground font-body max-w-2xl mx-auto">
              Discover and organize university thesis papers across 3D, animation, rigging, lighting, and world-building.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <StatsRow
            papersCount={papers.length}
            processedCount={Math.round(papers.length * 0.83)}
            lastScrapeMinutes={45}
            audioCount={Math.round(papers.length * 0.15)}
          />
        </div>
      </section>

      {/* Main layout */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-0 border border-border rounded-xl overflow-hidden bg-card/20 min-h-[600px]">
            <LibrarySidebar
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              categories={CATEGORIES}
              onUploadClick={() => toast.info("Upload feature coming soon.")}
              onAILabelClick={() => toast.info("AI Labeling feature coming soon.")}
              onBulkProcessClick={() => toast.info("Bulk Processing feature coming soon.")}
              collections={collections}
              onCreateCollection={handleCreateCollection}
              onDeleteCollection={handleDeleteCollection}
              onDropToCollection={handleAddToCollection}
              enabledSources={enabledSources}
              onToggleSource={(key) => {
                setEnabledSources((prev) => {
                  const next = new Set(prev);
                  if (next.has(key)) next.delete(key);
                  else next.add(key);
                  return next;
                });
              }}
            />

            <div className="flex-1 p-5 space-y-4 overflow-hidden flex flex-col min-w-0">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search papers, authors, or topics…"
                  className="w-full bg-muted/30 border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </form>

              {!isSubscribed && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-primary/20">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    <p className="text-xs font-body text-muted-foreground">
                      <span className="text-foreground font-semibold">{Math.max(0, FREE_SEARCH_LIMIT - searchCount)}</span> free searches remaining.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPricing(true)}
                    className="text-xs font-body font-semibold bg-primary text-primary-foreground px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity"
                  >
                    Upgrade
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <SearchResultsCount
                    totalResults={visiblePapers.length}
                    searchQuery={lastSearchQuery}
                    sources={sourcesList.length > 0 ? sourcesList : [{ name: "CrossRef", count: 0 }, { name: "arXiv", count: 0 }, { name: "OpenAlex", count: 0 }]}
                  />
                </div>
                <ViewToggle mode={viewMode} onChange={setViewMode} />
              </div>

              {selectedPapers.size > 0 && (
                <div className="flex items-center gap-3 text-xs font-body text-muted-foreground">
                  <span className="text-foreground font-semibold">{selectedPapers.size}</span> paper(s) selected
                  <button onClick={() => setSelectedPapers(new Set())} className="text-primary hover:underline">
                    Clear
                  </button>
                </div>
              )}

              {/* Scrollable results */}
              <div className="flex-1 min-h-0">
                <PapersTable
                  papers={visiblePapers}
                  loading={loading}
                  isSubscribed={isSubscribed}
                  selectedPapers={selectedPapers}
                  onToggleSelect={handleToggleSelect}
                  onSelectAll={handleSelectAll}
                  onUnlockClick={() => setShowPricing(true)}
                  searchQuery={searchQuery}
                  onPaperClick={(p) => setPreviewPaper(p)}
                  activePaperId={previewPaper?.paperId}
                  viewMode={viewMode}
                  votes={votes}
                />
              </div>
            </div>
          </div>

          {/* Article Deep Dive Panel — outside overflow-hidden container */}
          <AnimatePresence>
            {previewPaper && (
              <div className="mt-4">
                <ArticlePreview
                  paper={previewPaper}
                  onClose={() => setPreviewPaper(null)}
                  onVote={handleVote}
                  onTrash={handleTrash}
                  vote={votes[previewPaper.paperId]}
                  collections={collections}
                  onAddToCollection={handleAddToCollection}
                  allPapers={visiblePapers}
                  onNavigate={(p) => setPreviewPaper(p)}
                />
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <PricingModal open={showPricing} onClose={() => setShowPricing(false)} />
      <Footer />
    </main>
  );
};

export default LibraryPage;
