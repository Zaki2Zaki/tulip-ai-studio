import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Lock, BookOpen, FolderPlus, ChevronDown, ArrowLeft, Folder, CreditCard, Settings, Loader2 } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";

const CATEGORIES = [
  { id: "3d-modeling", label: "3D Assets Modeling", query: "3D modeling computer graphics mesh" },
  { id: "ai-ml", label: "Artificial Intelligence and Machine Learning", query: "artificial intelligence machine learning deep learning" },
  { id: "algorithms", label: "Algorithms and Numerical Methods", query: "algorithms numerical methods optimization computational" },
  { id: "animation", label: "Animation", query: "computer animation motion synthesis" },
  { id: "applied-perception", label: "Applied Perception", query: "applied perception visual cognition psychophysics" },
  { id: "comp-arch", label: "Computer Architecture", query: "computer architecture GPU hardware accelerator" },
  { id: "comp-graphics", label: "Computer Graphics", query: "computer graphics rendering shading geometry" },
  { id: "comp-photo", label: "Computational Photography and Imaging", query: "computational photography imaging reconstruction" },
  { id: "comp-vision", label: "Computer Vision", query: "computer vision object detection segmentation recognition" },
  { id: "esports", label: "Esports", query: "esports competitive gaming performance analytics" },
  { id: "generative-ai", label: "Generative AI", query: "generative AI diffusion models image synthesis" },
  { id: "hci", label: "Human Computer Interaction", query: "human computer interaction user interface UX" },
  { id: "hpc", label: "High Performance Computing", query: "high performance computing parallel processing GPU computing" },
  { id: "hyperscale", label: "Hyperscale Graphics", query: "hyperscale graphics large scale rendering cloud graphics" },
  { id: "lighting", label: "Light", query: "physically based rendering lighting global illumination" },
  { id: "networking", label: "Networking", query: "network protocols latency streaming distributed systems" },
  { id: "physical-ai", label: "Physical AI", query: "physical AI embodied intelligence physics simulation" },
  { id: "prog-lang", label: "Programming Languages, Systems and Tools", query: "programming languages compilers systems tools" },
  { id: "realtime-rendering", label: "Real-Time Rendering", query: "real-time rendering rasterization ray tracing GPU" },
  { id: "rigging", label: "Rigging", query: "character rigging skeletal animation" },
  { id: "robotics", label: "Robotics", query: "robotics manipulation locomotion autonomous systems" },
  { id: "sfx", label: "SFX", query: "sound effects audio design spatial audio synthesis" },
  { id: "vfx", label: "VFX", query: "visual effects compositing simulation particle systems" },
  { id: "vr-ar", label: "VR, AR and Display Technology", query: "virtual reality augmented reality mixed reality display" },
  { id: "world-building", label: "World Scale Building", query: "procedural world generation large scale environment" },
  { id: "world-simulation", label: "World Simulation", query: "world simulation physics engine digital twin" },
];

const ManageSubscriptionButton = () => {
  const [loading, setLoading] = useState(false);

  const handleManage = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in first.");
        return;
      }
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast.error(err?.message?.includes("No Stripe customer")
        ? "No subscription found. Subscribe first!"
        : "Failed to open subscription manager.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleManage}
      disabled={loading}
      className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-border bg-card/50 text-sm font-body text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-60"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Settings className="w-4 h-4" />}
      Manage Subscription
    </button>
  );
};

const LibraryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubscribed] = useState(false);
  const [viewedPapers, setViewedPapers] = useState<Set<string>>(new Set());
  const [showPricing, setShowPricing] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
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

  const FREE_PAPER_LIMIT = 3;
  const needsPaywall = !isSubscribed && viewedPapers.size >= FREE_PAPER_LIMIT;

  const fetchPapers = async (query: string) => {
    // Check cache first
    const cacheKey = `${query}__${Array.from(enabledSources).sort().join(",")}`;
    const cached = searchCache.get(cacheKey);
    if (cached) {
      setPapers(cached.papers);
      setSourceCounts(cached.counts);
      setLastSearchQuery(query);
      return;
    }
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

  // Active collection info
  const activeCollection = activeCollectionId ? collections.find(c => c.id === activeCollectionId) : null;

  // Sort upvoted papers to the top, optionally filter by collection
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

  // Auto-select first paper so Deep Dive always shows
  useEffect(() => {
    if (visiblePapers.length > 0 && !previewPaper) {
      setPreviewPaper(visiblePapers[0]);
    }
  }, [visiblePapers]);

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
            <p className="text-base text-muted-foreground font-body max-w-2xl mx-auto mb-5">
              Discover and organize university thesis papers across 3D, animation, rigging, lighting, and world-building.
            </p>
            {!isSubscribed ? (
              <div className="inline-flex items-center gap-3">
                <span
                  onClick={() => { setBillingPeriod("monthly"); setShowPricing(true); }}
                  className="text-sm font-body font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
                >
                  Subscribe
                </span>
                <div className="inline-flex items-center rounded-full border border-border bg-card/60 p-0.5">
                  <button
                    onClick={() => { setBillingPeriod("monthly"); setShowPricing(true); }}
                    className={`px-4 py-1.5 rounded-full text-xs font-body font-semibold transition-all ${
                      billingPeriod === "monthly"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => { setBillingPeriod("annual"); setShowPricing(true); }}
                    className={`px-4 py-1.5 rounded-full text-xs font-body font-semibold transition-all ${
                      billingPeriod === "annual"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Annual
                  </button>
                </div>
              </div>
            ) : (
              <ManageSubscriptionButton />
            )}
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
          <div className="flex gap-0 border border-border rounded-xl overflow-hidden bg-card/20 items-stretch min-h-[720px]">
            <LibrarySidebar
              onUploadClick={() => toast.info("Upload feature coming soon.")}
              onAILabelClick={() => toast.info("AI Labeling feature coming soon.")}
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
              {/* Unified Search + Subject bar */}
              <form onSubmit={handleSearch} className="flex items-stretch gap-0 rounded-xl border-2 border-primary/20 bg-card/40 overflow-hidden focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all shadow-sm">
                {/* Subject selector */}
                <div className="relative shrink-0 border-r border-primary/15">
                  <select
                    value={activeCategory}
                    onChange={(e) => { setActiveCollectionId(null); setActiveCategory(e.target.value); }}
                    className="h-full appearance-none bg-primary/5 hover:bg-primary/10 pl-4 pr-10 py-3 text-sm font-body font-semibold text-foreground cursor-pointer focus:outline-none transition-colors min-w-[180px]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
                {/* Search input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search papers, authors, or topics…"
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

              {!isSubscribed && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-primary/20">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    <p className="text-xs font-body text-muted-foreground">
                      <span className="text-foreground font-semibold">{Math.max(0, FREE_PAPER_LIMIT - viewedPapers.size)}</span> free papers remaining.
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
                    <div className="relative ml-auto group">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/30 text-accent text-xs font-body font-semibold hover:bg-accent/20 transition-all">
                        <FolderPlus className="w-3.5 h-3.5" />
                        Add to Collection
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-xl z-20 p-1 min-w-[200px] hidden group-hover:block">
                        {collections.map((col) => (
                          <button
                            key={col.id}
                            onClick={() => {
                              selectedPapers.forEach((paperId) => {
                                const p = visiblePapers.find((vp) => vp.paperId === paperId);
                                if (p) handleAddToCollection(paperId, p.title, col.id);
                              });
                              setSelectedPapers(new Set());
                              toast.success(`Added ${selectedPapers.size} paper(s) to "${col.name}"`);
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-body text-foreground hover:bg-muted/30 rounded-md flex items-center gap-2"
                          >
                            <FolderPlus className="w-3 h-3 text-accent/60" />
                            {col.name}
                            <span className="ml-auto text-muted-foreground">{col.paperIds.length}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <span className="ml-auto text-[10px] font-body text-muted-foreground italic">Create a collection in the sidebar first</span>
                  )}

                  <button onClick={() => setSelectedPapers(new Set())} className="text-xs font-body text-muted-foreground hover:text-foreground transition-colors">
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
                  onPaperClick={(p) => {
                    if (!isSubscribed && !viewedPapers.has(p.paperId) && viewedPapers.size >= FREE_PAPER_LIMIT) {
                      setShowPricing(true);
                      toast.info("You've used your 3 free papers. Subscribe to continue.");
                      return;
                    }
                    setViewedPapers((prev) => new Set(prev).add(p.paperId));
                    setPreviewPaper(p);
                  }}
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

      <PricingModal open={showPricing} onClose={() => setShowPricing(false)} defaultPeriod={billingPeriod} />
      <Footer />
    </main>
  );
};

export default LibraryPage;
