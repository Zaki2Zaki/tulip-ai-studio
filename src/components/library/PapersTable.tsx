import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Lock, AlertTriangle, CheckCircle, MinusCircle, ArrowUp, ArrowDown, ArrowUpDown, GripVertical } from "lucide-react";
import YearFilter from "./YearFilter";
import MatchRateSlider from "./MatchRateSlider";
import PaperCard from "./PaperCard";
import type { ViewMode } from "./ViewToggle";

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

interface PapersTableProps {
  papers: Paper[];
  loading: boolean;
  isSubscribed: boolean;
  selectedPapers: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onUnlockClick: () => void;
  searchQuery: string;
  onPaperClick: (paper: Paper) => void;
  activePaperId?: string;
  onDragStart?: (paper: Paper) => void;
  viewMode?: ViewMode;
  votes?: Record<string, "up" | "down">;
}

const generateTLDR = (title: string, abstract: string | null): string => {
  if (abstract && abstract.length > 20) {
    return abstract.length > 120 ? abstract.slice(0, 120) + "…" : abstract;
  }
  return title.length > 80 ? title.slice(0, 80) + "…" : title;
};

const getAIFlag = (paper: Paper): { label: string; color: string; icon: React.ReactNode } => {
  const hasAbstract = paper.abstract && paper.abstract.length > 50;
  const hasCitations = (paper.citationCount || 0) > 5;
  if (hasAbstract && hasCitations) return { label: "Verified", color: "text-green-400", icon: <CheckCircle className="w-3.5 h-3.5" /> };
  if (hasAbstract || hasCitations) return { label: "Partial", color: "text-yellow-400", icon: <AlertTriangle className="w-3.5 h-3.5" /> };
  return { label: "Unverified", color: "text-muted-foreground", icon: <MinusCircle className="w-3.5 h-3.5" /> };
};

const getAILabel = (title: string): string => {
  const t = title.toLowerCase();
  if (t.includes("neural") || t.includes("deep learning") || t.includes("network")) return "Deep Learning";
  if (t.includes("render") || t.includes("ray") || t.includes("light")) return "Rendering";
  if (t.includes("motion") || t.includes("anim")) return "Motion Synthesis";
  if (t.includes("mesh") || t.includes("3d") || t.includes("model")) return "3D Modeling";
  if (t.includes("rig") || t.includes("skeleton")) return "Rigging";
  if (t.includes("procedural") || t.includes("terrain") || t.includes("world")) return "Procedural Gen";
  if (t.includes("texture") || t.includes("material")) return "Materials";
  return "General";
};

const getSuccessRate = (paper: Paper, searchQuery: string): number => {
  if (!searchQuery) return Math.min(95, Math.max(20, (paper.citationCount || 0) * 2 + 30));
  const terms = searchQuery.toLowerCase().split(/\s+/);
  const text = `${paper.title} ${paper.abstract || ""}`.toLowerCase();
  const hits = terms.filter((t) => text.includes(t)).length;
  return Math.min(99, Math.round((hits / Math.max(terms.length, 1)) * 80 + 15));
};

type SortField = "year" | "matchRate" | null;
type SortDir = "asc" | "desc";

const SortIcon = ({ field, activeField, dir }: { field: SortField; activeField: SortField; dir: SortDir }) => {
  if (activeField !== field) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
  return dir === "asc" ? <ArrowUp className="w-3 h-3 text-primary" /> : <ArrowDown className="w-3 h-3 text-primary" />;
};

const PapersTable = ({
  papers,
  loading,
  isSubscribed,
  selectedPapers,
  onToggleSelect,
  onSelectAll,
  onUnlockClick,
  searchQuery,
  onPaperClick,
  activePaperId,
  onDragStart,
  viewMode = "table",
  votes = {},
}: PapersTableProps) => {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [yearRange, setYearRange] = useState<[number, number]>([0, 9999]);
  const [matchRange, setMatchRange] = useState<[number, number]>([0, 100]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const processedPapers = useMemo(() => {
    let result = papers.map((p) => ({
      ...p,
      matchRate: getSuccessRate(p, searchQuery),
    }));

    // Year filter
    if (yearRange[0] !== 0 || yearRange[1] !== 9999) {
      result = result.filter((p) => {
        if (!p.year) return false;
        return p.year >= yearRange[0] && p.year <= yearRange[1];
      });
    }

    // Match rate filter
    result = result.filter((p) => p.matchRate >= matchRange[0] && p.matchRate <= matchRange[1]);

    // Sort
    if (sortField === "year") {
      result.sort((a, b) => {
        const av = a.year || 0;
        const bv = b.year || 0;
        return sortDir === "asc" ? av - bv : bv - av;
      });
    } else if (sortField === "matchRate") {
      result.sort((a, b) => (sortDir === "asc" ? a.matchRate - b.matchRate : b.matchRate - a.matchRate));
    }

    return result;
  }, [papers, searchQuery, sortField, sortDir, yearRange, matchRange]);

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-14 bg-card border border-border rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (papers.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground font-body">
        No papers found. Try adjusting your search or category.
      </div>
    );
  }

  // Card grid view
  if (viewMode === "cards") {
    return (
      <div className="space-y-3">
        <MatchRateSlider range={matchRange} onChange={setMatchRange} />
        <div className="library-scroll overflow-y-auto max-h-[520px] pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {processedPapers.map((paper, i) => {
              const isLocked = !isSubscribed && i >= 5;
              return (
                <PaperCard
                  key={paper.paperId}
                  paper={paper}
                  isSelected={selectedPapers.has(paper.paperId)}
                  isActive={activePaperId === paper.paperId}
                  isLocked={isLocked}
                  onToggleSelect={onToggleSelect}
                  onClick={onPaperClick}
                  onUnlockClick={onUnlockClick}
                  onDragStart={onDragStart}
                />
              );
            })}
          </div>
        </div>
        <p className="text-xs text-muted-foreground font-body text-right">
          Showing {processedPapers.length} of {papers.length} papers
        </p>
      </div>
    );
  }

  // Compact list view
  if (viewMode === "compact") {
    return (
      <div className="space-y-3">
        <MatchRateSlider range={matchRange} onChange={setMatchRange} />
        <div className="library-scroll overflow-y-auto max-h-[520px] border border-border rounded-xl divide-y divide-border/50">
          {processedPapers.map((paper, i) => {
            const isLocked = !isSubscribed && i >= 5;
            return (
              <div
                key={paper.paperId}
                draggable={!isLocked}
                onDragStart={(e) => {
                  if (isLocked) return;
                  onDragStart?.(paper);
                  e.dataTransfer.setData("application/json", JSON.stringify({ paperId: paper.paperId, title: paper.title }));
                }}
                onClick={() => !isLocked && onPaperClick(paper)}
                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all ${
                  isLocked ? "opacity-40 blur-[1px]" : "hover:bg-muted/20"
                } ${activePaperId === paper.paperId ? "bg-primary/8" : ""}`}
              >
                <span className="font-display text-sm text-foreground line-clamp-1 flex-1">{paper.title}</span>
                <span className="text-xs text-muted-foreground font-body shrink-0">{paper.year || "—"}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <div className="w-10 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${paper.matchRate}%`, background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))` }} />
                  </div>
                  <span className="text-[11px] text-muted-foreground tabular-nums">{paper.matchRate}%</span>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground font-body text-right">
          Showing {processedPapers.length} of {papers.length} papers
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Match Rate Slider */}
      <MatchRateSlider range={matchRange} onChange={setMatchRange} />

      {/* Table */}
      <div className="border border-border rounded-xl overflow-hidden">
        <div className="library-scroll overflow-y-auto max-h-[520px]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="bg-card border-b border-border">
                <th className="w-10 px-3 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedPapers.size === processedPapers.length && processedPapers.length > 0}
                    onChange={onSelectAll}
                    className="rounded border-border accent-primary"
                  />
                </th>
                <th className="w-8 px-1 py-3" />
                <th className="px-3 py-3 text-left font-body font-semibold text-muted-foreground text-sm uppercase tracking-wider">
                  Title
                </th>
                <th className="px-3 py-3 text-left font-body font-semibold text-muted-foreground text-sm uppercase tracking-wider min-w-[180px]">
                  TLDR
                </th>
                <th className="px-3 py-3 text-center font-body font-semibold text-muted-foreground text-sm uppercase tracking-wider w-24">
                  AI Flag
                </th>
                <th className="px-3 py-3 text-center font-body font-semibold text-muted-foreground text-sm uppercase tracking-wider w-28">
                  AI Label
                </th>
                <th className="px-3 py-3 text-center w-32">
                  <button
                    onClick={() => handleSort("year")}
                    className="inline-flex items-center gap-1.5 font-body font-semibold text-muted-foreground text-xs uppercase tracking-wider hover:text-foreground transition-colors"
                  >
                    Year
                    <SortIcon field="year" activeField={sortField} dir={sortDir} />
                  </button>
                  <div className="mt-1">
                    <YearFilter yearRange={yearRange} onChange={setYearRange} />
                  </div>
                </th>
                <th className="px-3 py-3 text-center w-32">
                  <button
                    onClick={() => handleSort("matchRate")}
                    className="inline-flex items-center gap-1.5 font-body font-semibold text-muted-foreground text-xs uppercase tracking-wider hover:text-foreground transition-colors"
                  >
                    Match Rate
                    <SortIcon field="matchRate" activeField={sortField} dir={sortDir} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {processedPapers.map((paper, i) => {
                  const isLocked = !isSubscribed && i >= 5;
                  const aiFlag = getAIFlag(paper);
                  const aiLabel = getAILabel(paper.title);
                  const tldr = generateTLDR(paper.title, paper.abstract);
                  const isActive = activePaperId === paper.paperId;

                  return (
                    <motion.tr
                      key={paper.paperId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15, delay: i * 0.015 }}
                      draggable={!isLocked}
                      onDragStart={(e) => {
                        if (isLocked) return;
                        onDragStart?.(paper);
                        // Set drag data for HTML5 DnD
                        const dragEvent = e as unknown as React.DragEvent;
                        if (dragEvent.dataTransfer) {
                          dragEvent.dataTransfer.setData("application/json", JSON.stringify({ paperId: paper.paperId, title: paper.title }));
                          dragEvent.dataTransfer.effectAllowed = "copy";
                        }
                      }}
                      onClick={() => !isLocked && onPaperClick(paper)}
                      className={`border-b border-border/50 transition-all cursor-pointer ${
                        isLocked ? "opacity-40 blur-[1px]" : "hover:bg-muted/20"
                      } ${isActive ? "bg-primary/8 border-l-2 border-l-primary" : ""} ${
                        selectedPapers.has(paper.paperId) ? "bg-primary/5" : ""
                      }`}
                    >
                      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        {isLocked ? (
                          <button onClick={onUnlockClick}>
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          </button>
                        ) : (
                          <input
                            type="checkbox"
                            checked={selectedPapers.has(paper.paperId)}
                            onChange={() => onToggleSelect(paper.paperId)}
                            className="rounded border-border accent-primary"
                          />
                        )}
                      </td>
                      <td className="px-1 py-3">
                        {!isLocked && (
                          <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 cursor-grab active:cursor-grabbing" />
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <div className="min-w-0">
                          {!isLocked && paper.url ? (
                            <span className="font-display text-base font-semibold text-foreground line-clamp-2">
                              {paper.title}
                            </span>
                          ) : (
                            <span className="font-display text-base font-semibold text-foreground line-clamp-2">
                              {paper.title}
                            </span>
                          )}
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {paper.authors?.slice(0, 2).map((a) => a.name).join(", ")}
                            {(paper.authors?.length || 0) > 2 && " et al."}
                          </p>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-xs text-muted-foreground font-body leading-relaxed line-clamp-2">{tldr}</p>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 text-xs font-body ${aiFlag.color}`}>
                          {aiFlag.icon}
                          {aiFlag.label}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-body text-accent">
                          {aiLabel}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center text-sm font-body text-muted-foreground">
                        {paper.year || "—"}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${paper.matchRate}%`,
                                background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-body text-muted-foreground tabular-nums">{paper.matchRate}%</span>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-muted-foreground font-body text-right">
        Showing {processedPapers.length} of {papers.length} papers
      </p>
    </div>
  );
};

export default PapersTable;
