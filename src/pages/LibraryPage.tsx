import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Lock, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingModal from "@/components/PricingModal";
import LibrarySidebar from "@/components/library/LibrarySidebar";
import PapersTable from "@/components/library/PapersTable";
import { toast } from "sonner";

const CATEGORIES = [
  { id: "3d-modeling", label: "3D Assets Modeling", query: "3D modeling computer graphics mesh" },
  { id: "animation", label: "Animation", query: "computer animation motion synthesis" },
  { id: "rigging", label: "Rigging", query: "character rigging skeletal animation" },
  { id: "lighting", label: "Light", query: "physically based rendering lighting global illumination" },
  { id: "world-building", label: "World Scale Building", query: "procedural world generation large scale environment" },
];

interface Paper {
  paperId: string;
  title: string;
  abstract: string | null;
  year: number | null;
  citationCount: number | null;
  url: string;
  authors: { name: string }[];
  venue: string | null;
}

const LibraryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubscribed] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [searchCount, setSearchCount] = useState(0);
  const [selectedPapers, setSelectedPapers] = useState<Set<string>>(new Set());

  const FREE_SEARCH_LIMIT = 3;
  const needsPaywall = !isSubscribed && searchCount >= FREE_SEARCH_LIMIT;

  const fetchPapers = async (query: string) => {
    if (needsPaywall) {
      setShowPricing(true);
      return;
    }
    setLoading(true);
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
      }));
      setPapers(items);
      setSearchCount((c) => c + 1);
    } catch (err) {
      console.error("Search failed:", err);
      setPapers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cat = CATEGORIES.find((c) => c.id === activeCategory);
    if (cat) fetchPapers(cat.query);
  }, [activeCategory]);

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

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-8 relative overflow-hidden">
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

      {/* Main layout: sidebar + content */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-0 border border-border rounded-xl overflow-hidden bg-card/20 min-h-[600px]">
            {/* Left Sidebar */}
            <LibrarySidebar
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              categories={CATEGORIES}
              onUploadClick={() => toast.info("Upload feature coming soon — requires subscription.")}
              onAILabelClick={() => toast.info("AI Labeling feature coming soon — requires subscription.")}
              onBulkProcessClick={() => toast.info("Bulk Processing feature coming soon — requires subscription.")}
            />

            {/* Right Content */}
            <div className="flex-1 p-5 space-y-4 overflow-hidden">
              {/* Search bar */}
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

              {/* Free tier banner */}
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

              {/* Selected count */}
              {selectedPapers.size > 0 && (
                <div className="flex items-center gap-3 text-xs font-body text-muted-foreground">
                  <span className="text-foreground font-semibold">{selectedPapers.size}</span> paper(s) selected
                  <button
                    onClick={() => setSelectedPapers(new Set())}
                    className="text-primary hover:underline"
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* Papers Table */}
              <PapersTable
                papers={papers}
                loading={loading}
                isSubscribed={isSubscribed}
                selectedPapers={selectedPapers}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
                onUnlockClick={() => setShowPricing(true)}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        </div>
      </section>

      <PricingModal open={showPricing} onClose={() => setShowPricing(false)} />
      <Footer />
    </main>
  );
};

export default LibraryPage;
