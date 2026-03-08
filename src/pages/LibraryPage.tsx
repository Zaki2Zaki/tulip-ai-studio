import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Lock, BookOpen, Filter, ExternalLink, Star, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingModal from "@/components/PricingModal";

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
  const [isSubscribed] = useState(false); // Mock state
  const [showPricing, setShowPricing] = useState(false);
  const [searchCount, setSearchCount] = useState(0);

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
        abstract: item.abstract?.replace(/<[^>]*>/g, '') || null,
        year: item.published?.["date-parts"]?.[0]?.[0] || null,
        citationCount: item["is-referenced-by-count"] || null,
        url: item.URL || `https://doi.org/${item.DOI}`,
        authors: (item.author || []).map((a: any) => ({ name: `${a.given || ''} ${a.family || ''}`.trim() })),
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

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto section-padding text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/50 mb-6">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-xs font-body tracking-widest uppercase text-muted-foreground">Research Library</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
              <span className="text-gradient-lavender">Library</span> R&D
            </h1>
            <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
              Discover university thesis papers and cutting-edge research across 3D, animation, rigging, lighting, and world-building.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="pb-8">
        <div className="max-w-6xl mx-auto section-padding">
          <form onSubmit={handleSearch} className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search research papers, authors, or topics…"
              className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-4 text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </form>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-body transition-all ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Free tier banner */}
          {!isSubscribed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between p-4 rounded-xl bg-card border border-primary/20 mb-8"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-primary" />
                <p className="text-sm font-body text-muted-foreground">
                  <span className="text-foreground font-semibold">{Math.max(0, FREE_SEARCH_LIMIT - searchCount)}</span> free searches remaining.
                  Upgrade for unlimited access.
                </p>
              </div>
              <button
                onClick={() => setShowPricing(true)}
                className="text-sm font-body font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
              >
                View Plans
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="pb-32">
        <div className="max-w-6xl mx-auto section-padding">
          {loading ? (
            <div className="grid gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-card border border-border rounded-xl animate-pulse" />
              ))}
            </div>
          ) : papers.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground font-body">
              No papers found. Try adjusting your search or category.
            </div>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence mode="popLayout">
                {papers.map((paper, i) => {
                  const isLocked = !isSubscribed && i >= 5;
                  return (
                    <motion.div
                      key={paper.paperId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                      className={`relative p-5 rounded-xl border transition-colors ${
                        isLocked
                          ? "bg-card/30 border-border/50"
                          : "bg-card border-border hover:border-primary/20"
                      }`}
                    >
                      {isLocked && (
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                          <button
                            onClick={() => setShowPricing(true)}
                            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-body font-semibold text-sm hover:opacity-90 transition-opacity"
                          >
                            <Lock className="w-4 h-4" /> Unlock with Subscription
                          </button>
                        </div>
                      )}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display text-base font-semibold text-foreground mb-1 line-clamp-2">
                            {paper.title}
                          </h3>
                          <p className="text-xs text-muted-foreground font-body mb-2">
                            {paper.authors?.slice(0, 3).map((a) => a.name).join(", ")}
                            {paper.authors?.length > 3 && " et al."}
                            {paper.year && ` · ${paper.year}`}
                            {paper.venue && ` · ${paper.venue}`}
                          </p>
                          {paper.abstract && (
                            <p className="text-sm text-muted-foreground font-body line-clamp-2 leading-relaxed">
                              {paper.abstract}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          {paper.citationCount != null && (
                            <span className="text-xs text-muted-foreground font-body flex items-center gap-1">
                              <Star className="w-3 h-3" /> {paper.citationCount} citations
                            </span>
                          )}
                          {!isLocked && paper.url && (
                            <a
                              href={paper.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline font-body flex items-center gap-1"
                            >
                              View Paper <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      <PricingModal open={showPricing} onClose={() => setShowPricing(false)} />
      <Footer />
    </main>
  );
};

export default LibraryPage;
