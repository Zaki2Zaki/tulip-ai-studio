import { useState, useEffect, useMemo, useCallback } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, FolderPlus, ChevronDown, ArrowLeft, Folder, Loader2, CalendarCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LibrarySidebar from "@/components/library/LibrarySidebar";
import type { Collection } from "@/components/library/LibrarySidebar";
import PapersTable from "@/components/library/PapersTable";
import SearchResultsCount from "@/components/library/SearchResultsCount";
import ArticlePreview from "@/components/library/ArticlePreview";
import BulkReviewPanel from "@/components/library/BulkReviewPanel";
import StatsRow from "@/components/library/StatsRow";
import ViewToggle from "@/components/library/ViewToggle";
import type { ViewMode } from "@/components/library/ViewToggle";
import { searchPapers } from "@/lib/api/papers";
import type { Paper } from "@/lib/api/papers";
import { DEFAULT_ENABLED_KEYS } from "@/components/library/DataSources";
import { toast } from "sonner";

const CATEGORIES = [
  { id: "3d-animation", label: "3D Animation", query: "3D animation character motion synthesis rigging" },
  { id: "ai-tools", label: "AI Tools", query: "AI tools generative artificial intelligence creative pipeline" },
  { id: "comp-graphics", label: "Computer Graphics", query: "computer graphics rendering shading geometry" },
  { id: "exec-mgmt", label: "Executive Management", query: "executive management leadership strategy organizational decision-making" },
  { id: "game-dev", label: "Game Dev", query: "game development interactive simulation real-time rendering" },
  { id: "generative-ai", label: "Generative AI", query: "generative AI diffusion models image synthesis" },
  { id: "lighting", label: "Lighting", query: "physically based rendering lighting global illumination" },
  { id: "physical-ai", label: "Physical AI", query: "physical AI embodied intelligence physics simulation" },
  { id: "product", label: "Product", query: "product management development lifecycle user research roadmap" },
  { id: "production-mgmt", label: "Production Management", query: "production pipeline management scheduling VFX studio" },
  { id: "realtime-rendering", label: "Real-Time Rendering", query: "real-time rendering rasterization ray tracing GPU" },
  { id: "research", label: "Research", query: "research methodology academic scientific analysis survey" },
  { id: "rigging", label: "Rigging", query: "character rigging skeletal animation" },
  { id: "sfx", label: "SFX", query: "sound effects audio design spatial audio synthesis" },
  { id: "storyboarding", label: "Storyboarding", query: "storyboarding previsualization visual storytelling shot planning" },
  { id: "vfx", label: "VFX", query: "visual effects compositing simulation particle systems" },
  { id: "vr-ar", label: "VR / AR", query: "virtual reality augmented reality mixed reality display" },
  { id: "world-simulation", label: "World Simulation", query: "world simulation physics engine digital twin" },
];

const LibraryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewedPapers, setViewedPapers] = useState<Set<string>>(new Set());
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
  const [searchCache, setSearchCache] = useState<Map<string, { papers: Paper[]; counts: Record<string, number> }>>(new Map());
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
  const [targetCollectionId, setTargetCollectionId] = useState<string>("");
  const [deepDiveMode, setDeepDiveMode] = useState(false);

  const fetchPapers = async (query: string) => {
    const cacheKey = `${query}__${Array.from(enabledSources).sort().join(",")}`;
    const cached = searchCache.get(cacheKey);
    if (cached) {
      setPapers(cached.papers);
      setSourceCounts(cached.counts);
      setLastSearchQuery(query);
      return;
    }
    setLoading(true);
    setLastSearchQuery(query);
    try {
      const activeSrcKeys = Array.from(enabledSources).filter(k => ["crossref", "arxiv", "openalex", "nvidia"].includes(k));
      const result = await searchPapers(query, activeSrcKeys.length > 0 ? activeSrcKeys : undefined);
      setPapers(result.papers);
      setSourceCounts(result.counts);
      setSearchCache((prev) => new Map(prev).set(cacheKey, { papers: result.papers, counts: result.counts }));
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

  const activeCollection = activeCollectionId ? collections.find(c => c.id === activeCollectionId) : null;

  const visiblePapers = useMemo(() => {
    let filtered = papers.filter((p) => !trashedPapers.has(p.paperId));
    if (activeCollection) {
      filtered = filtered.filter((p) => activeCollection.paperIds.includes(p.paperId));
    }
    return filtered.sort((a, b) => {
      const aUp = votes[a.paperId] === "up" ? 1 : 0;
      const bUp = votes[b.paperId] === "up" ? 1 : 0;
      return bUp - aUp;
    });
  }, [papers, trashedPapers, votes, activeCollection]);

  useEffect(() => {
    const cat = CATEGORIES.find((c) => c.id === activeCategory);
    if (cat) fetchPapers(cat.query);
  }, [activeCategory, enabledSources]);

  useEffect(() => {
    if (visiblePapers.length > 0 && !previewPaper) {
      setPreviewPaper(visiblePapers[0]);
    }
  }, [visiblePapers]);

  // Enter Deep Dive when a paper is selected via click
  const enterDeepDive = (paper: Paper) => {
    setViewedPapers((prev) => new Set(prev).add(paper.paperId));
    setPreviewPaper(paper);
    setDeepDiveMode(true);
  };

  // Exit Deep Dive
  const exitDeepDive = () => {
    setDeepDiveMode(false);
  };

  // Escape key to exit Deep Dive
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && deepDiveMode) exitDeepDive();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [deepDiveMode]);

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
      setSelectedPapers(new Set(papers.map((p) => p.paperId)));
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
    if (previewPaper?.paperId === paperId) {
      setPreviewPaper(null);
      setDeepDiveMode(false);
    }
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
              <span className="text-gradient-lavender">Library</span>{" "}
              <span className="text-gradient-chrome-animated">R&D</span>
            </h1>
            <p className="text-base text-muted-foreground font-body max-w-3xl mx-auto mb-5">
              Search research papers, 3D and VFX workflows, case studies, production tools, and executive management papers. Cross-references and extracts from CrossRef, arXiv, OpenAlex, Google Scholar Labs, Nvidia Publications, Scholar Inbox, ACM Digital Library, Substack, Academia.edu, and Elsevier.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full hero-btn-explore hero-btn-bloom font-body font-semibold text-sm transition-all"
            >
              <CalendarCheck className="w-4 h-4" />
              Book Consultation
            </a>
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

      {/* Deep Dive Immersive Mode */}
      <AnimatePresence>
        {deepDiveMode && previewPaper && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex flex-col deep-dive-bg overflow-hidden"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-border/30 bg-background/60 backdrop-blur-xl shrink-0">
              <button
                onClick={exitDeepDive}
                className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Results
              </button>
              <h2 className="font-display text-sm font-bold text-foreground hidden md:block">
                <span className="text-gradient-chrome-animated">Deep Dive</span>
              </h2>
              <span className="text-xs font-body text-muted-foreground">
                Press <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted/30 text-[10px]">ESC</kbd> to exit
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto library-scroll">
              <div className="max-w-7xl mx-auto px-4 py-6">
                <ArticlePreview
                  paper={previewPaper}
                  onClose={exitDeepDive}
                  onVote={handleVote}
                  onTrash={handleTrash}
                  vote={votes[previewPaper.paperId]}
                  collections={collections}
                  onAddToCollection={handleAddToCollection}
                  allPapers={visiblePapers}
                  onNavigate={(p) => setPreviewPaper(p)}
                />
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Main layout */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-0 border border-border rounded-xl overflow-hidden bg-card/20 items-stretch min-h-[720px]">
            <LibrarySidebar
              onUploadClick={() => toast.info("Upload feature coming soon.")}
              onAILabelClick={() => toast.info("Manual AI Label — Coming Soon", { description: "Manually tag and categorize individual papers with AI-generated labels, keywords, and metadata for better organization and searchability.", duration: 6000 })}
              onBulkProcessClick={() => toast.info("Bulk Process — Coming Soon", { description: "Batch-process multiple papers at once: AI labeling, categorization, and metadata extraction across your entire collection in one click.", duration: 6000 })}
              collections={collections}
              onCreateCollection={handleCreateCollection}
              onDeleteCollection={(id) => { if (activeCollectionId === id) setActiveCollectionId(null); handleDeleteCollection(id); }}
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
              activeCollectionId={activeCollectionId}
              onCollectionClick={setActiveCollectionId}
            />

            <div className="flex-1 p-5 space-y-4 overflow-hidden flex flex-col min-w-0">
              {/* Search bar */}
              <form onSubmit={handleSearch} className="flex items-stretch gap-0 rounded-xl border-2 border-primary/20 bg-card/40 overflow-hidden focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all shadow-sm">
                <div className="relative shrink-0 border-r border-primary/15">
                  <select
                    value={activeCategory}
                    onChange={(e) => { setActiveCollectionId(null); setActiveCategory(e.target.value); }}
                    className="h-full appearance-none bg-primary/5 hover:bg-primary/10 pl-4 pr-10 py-3 text-sm font-body font-semibold text-foreground cursor-pointer focus:outline-none transition-colors min-w-[160px]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search research papers, 3D and VFX workflows, case studies, production tools, and executive management papers..."
                    className="w-full h-full bg-transparent pl-11 pr-4 py-3 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="shrink-0 px-6 bg-primary text-primary-foreground font-body font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  Search
                </button>
              </form>

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  {activeCollection ? (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <Folder className="w-4 h-4 text-primary" />
                      <span className="text-sm font-body text-foreground font-semibold">{activeCollection.name}</span>
                      <span className="text-xs font-body text-muted-foreground">{visiblePapers.length} paper(s)</span>
                      <button
                        onClick={() => setActiveCollectionId(null)}
                        className="ml-auto flex items-center gap-1 text-xs font-body text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        Back to results
                      </button>
                    </div>
                  ) : (
                    <SearchResultsCount
                      totalResults={visiblePapers.length}
                      searchQuery={lastSearchQuery}
                      sources={sourcesList.length > 0 ? sourcesList : [{ name: "CrossRef", count: 0 }, { name: "arXiv", count: 0 }, { name: "OpenAlex", count: 0 }]}
                    />
                  )}
                </div>
                <ViewToggle mode={viewMode} onChange={setViewMode} />
              </div>

              {selectedPapers.size > 0 && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <FolderPlus className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-xs font-body text-foreground font-semibold">{selectedPapers.size}</span>
                  <span className="text-xs font-body text-muted-foreground">paper(s) selected</span>

                  {collections.length > 0 ? (
                    <div className="ml-auto flex items-center gap-2">
                      <Select value={targetCollectionId} onValueChange={setTargetCollectionId}>
                        <SelectTrigger className="h-8 w-[200px] bg-card border-accent/30 text-xs font-body font-semibold">
                          <SelectValue placeholder="Select collection…" />
                        </SelectTrigger>
                        <SelectContent>
                          {collections.map((col) => (
                            <SelectItem key={col.id} value={col.id}>
                              {col.name} ({col.paperIds.length})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <button
                        onClick={() => {
                          if (!targetCollectionId) {
                            toast.error("Please select a collection first");
                            return;
                          }
                          selectedPapers.forEach((paperId) => {
                            const p = visiblePapers.find((vp) => vp.paperId === paperId);
                            if (p) handleAddToCollection(paperId, p.title, targetCollectionId);
                          });
                          const col = collections.find((c) => c.id === targetCollectionId);
                          toast.success(`Added ${selectedPapers.size} paper(s) to "${col?.name}"`);
                          setSelectedPapers(new Set());
                          setTargetCollectionId("");
                        }}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-body font-semibold hover:bg-primary/90 transition-all"
                      >
                        <FolderPlus className="w-3.5 h-3.5" />
                        Add
                      </button>
                    </div>
                  ) : (
                    <span className="ml-auto text-[10px] font-body text-muted-foreground italic">Create a collection in the sidebar first</span>
                  )}

                  <button onClick={() => setSelectedPapers(new Set())} className="text-xs font-body text-muted-foreground hover:text-foreground transition-colors">
                    Clear
                  </button>
                </div>
              )}

              {/* Results grid */}
              <div className="flex-1 min-h-0">
                <PapersTable
                  papers={visiblePapers}
                  loading={loading}
                  isSubscribed={true}
                  selectedPapers={selectedPapers}
                  onToggleSelect={handleToggleSelect}
                  onSelectAll={handleSelectAll}
                  onUnlockClick={() => {}}
                  searchQuery={searchQuery}
                  onPaperClick={enterDeepDive}
                  activePaperId={previewPaper?.paperId}
                  viewMode={viewMode}
                  votes={votes}
                />
              </div>
            </div>
          </div>

          {/* Bulk Review Panel */}
          <AnimatePresence>
            {selectedPapers.size >= 2 && !deepDiveMode && (
              <div className="mt-4">
                <BulkReviewPanel
                  papers={visiblePapers.filter((p) => selectedPapers.has(p.paperId))}
                  collections={collections}
                  onApprove={handleAddToCollection}
                  onReject={(paperId) => {
                    handleToggleSelect(paperId);
                    handleTrash(paperId);
                  }}
                  onOpenFull={(p) => {
                    enterDeepDive(p);
                    setSelectedPapers(new Set());
                  }}
                  onClose={() => {}}
                  onClearSelection={() => setSelectedPapers(new Set())}
                />
              </div>
            )}
          </AnimatePresence>

          {/* Inline Deep Dive (non-immersive, below grid) — only when not in full immersive mode */}
          <AnimatePresence>
            {previewPaper && selectedPapers.size < 2 && !deepDiveMode && (
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

      <Footer />
    </main>
  );
};

export default LibraryPage;
