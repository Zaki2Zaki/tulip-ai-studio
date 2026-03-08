import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Lock, AlertTriangle, CheckCircle, MinusCircle, Star } from "lucide-react";

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

const PapersTable = ({
  papers,
  loading,
  isSubscribed,
  selectedPapers,
  onToggleSelect,
  onSelectAll,
  onUnlockClick,
  searchQuery,
}: PapersTableProps) => {
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

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              <th className="w-10 px-3 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedPapers.size === papers.length && papers.length > 0}
                  onChange={onSelectAll}
                  className="rounded border-border accent-primary"
                />
              </th>
              <th className="px-3 py-3 text-left font-body font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Title
              </th>
              <th className="px-3 py-3 text-left font-body font-semibold text-muted-foreground text-xs uppercase tracking-wider min-w-[200px]">
                TLDR
              </th>
              <th className="px-3 py-3 text-center font-body font-semibold text-muted-foreground text-xs uppercase tracking-wider w-24">
                AI Flag
              </th>
              <th className="px-3 py-3 text-center font-body font-semibold text-muted-foreground text-xs uppercase tracking-wider w-28">
                AI Label
              </th>
              <th className="px-3 py-3 text-center font-body font-semibold text-muted-foreground text-xs uppercase tracking-wider w-16">
                Year
              </th>
              <th className="px-3 py-3 text-center font-body font-semibold text-muted-foreground text-xs uppercase tracking-wider w-28">
                Match Rate
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {papers.map((paper, i) => {
                const isLocked = !isSubscribed && i >= 5;
                const aiFlag = getAIFlag(paper);
                const aiLabel = getAILabel(paper.title);
                const successRate = getSuccessRate(paper, searchQuery);
                const tldr = generateTLDR(paper.title, paper.abstract);

                return (
                  <motion.tr
                    key={paper.paperId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    className={`border-b border-border/50 transition-colors ${
                      isLocked ? "opacity-40 blur-[1px]" : "hover:bg-muted/20"
                    } ${selectedPapers.has(paper.paperId) ? "bg-primary/5" : ""}`}
                  >
                    <td className="px-3 py-3">
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
                    <td className="px-3 py-3">
                      <div className="flex items-start gap-2">
                        <div className="min-w-0">
                          {!isLocked && paper.url ? (
                            <a
                              href={paper.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-display text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-2"
                            >
                              {paper.title}
                              <ExternalLink className="w-3 h-3 inline ml-1 opacity-50" />
                            </a>
                          ) : (
                            <span className="font-display text-sm font-semibold text-foreground line-clamp-2">
                              {paper.title}
                            </span>
                          )}
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {paper.authors?.slice(0, 2).map((a) => a.name).join(", ")}
                            {(paper.authors?.length || 0) > 2 && " et al."}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-xs text-muted-foreground font-body leading-relaxed line-clamp-2">
                        {tldr}
                      </p>
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
                    <td className="px-3 py-3 text-center text-xs font-body text-muted-foreground">
                      {paper.year || "—"}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${successRate}%` }}
                          />
                        </div>
                        <span className="text-xs font-body text-muted-foreground">{successRate}%</span>
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
  );
};

export default PapersTable;
