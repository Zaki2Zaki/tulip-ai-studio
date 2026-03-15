import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle, XCircle, ExternalLink, X, FileText, Eye,
  ChevronDown, ChevronUp, Sparkles,
} from "lucide-react";

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

interface Collection {
  id: string;
  name: string;
  paperIds: string[];
}

interface BulkReviewPanelProps {
  papers: Paper[];
  collections: Collection[];
  onApprove: (paperId: string, paperTitle: string, collectionId: string) => void;
  onReject: (paperId: string) => void;
  onOpenFull: (paper: Paper) => void;
  onClose: () => void;
  onClearSelection: () => void;
}

/** Compute a simple match score based on abstract & citation presence */
function getMatchScore(paper: Paper): number {
  let score = 50;
  if (paper.abstract && paper.abstract.length > 100) score += 25;
  if ((paper.citationCount || 0) > 10) score += 15;
  if (paper.year && paper.year >= 2020) score += 10;
  return Math.min(score, 99);
}

const BulkReviewPanel = ({
  papers,
  collections,
  onApprove,
  onReject,
  onOpenFull,
  onClose,
  onClearSelection,
}: BulkReviewPanelProps) => {
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [defaultCollection, setDefaultCollection] = useState(collections[0]?.id || "");

  const pendingCount = papers.length - reviewed.size;

  const handleApprove = (paper: Paper) => {
    if (!defaultCollection) return;
    onApprove(paper.paperId, paper.title, defaultCollection);
    setReviewed((prev) => new Set(prev).add(paper.paperId));
  };

  const handleReject = (paper: Paper) => {
    onReject(paper.paperId);
    setReviewed((prev) => new Set(prev).add(paper.paperId));
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
        <div className="flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-accent" />
          <h3 className="text-base font-display font-semibold text-foreground">
            Bulk Review
          </h3>
          <span className="text-sm font-body text-foreground">
            {pendingCount} of {papers.length} pending
          </span>
        </div>
        <div className="flex items-center gap-3">
          {collections.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-body text-foreground uppercase tracking-wider">Approve to:</span>
              <select
                value={defaultCollection}
                onChange={(e) => setDefaultCollection(e.target.value)}
                className="h-7 appearance-none bg-card border border-accent/30 rounded-md px-2 pr-6 text-xs font-body text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent/30"
              >
                {collections.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button
            onClick={() => { onClearSelection(); onClose(); }}
            className="p-1.5 rounded-md hover:bg-muted/30 text-foreground hover:text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable review cards */}
      <div className="max-h-[520px] overflow-y-auto library-scroll p-4 space-y-3">
        {papers.map((paper) => {
          const isReviewed = reviewed.has(paper.paperId);
          const isExpanded = expandedId === paper.paperId;
          const matchScore = getMatchScore(paper);
          const snippet = paper.abstract
            ? paper.abstract.length > 180
              ? paper.abstract.slice(0, 180) + "…"
              : paper.abstract
            : "No abstract available.";

          return (
            <motion.div
              key={paper.paperId}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isReviewed ? 0.4 : 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`border rounded-xl p-4 transition-all ${
                isReviewed
                  ? "border-border/50 bg-muted/10"
                  : "border-border bg-card/40 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5"
              }`}
            >
              {/* Title row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-display text-sm font-semibold text-foreground leading-snug line-clamp-2">
                    {paper.title}
                  </h4>
                  <p className="text-xs text-foreground font-body mt-1">
                    {paper.authors?.slice(0, 3).map((a) => a.name).join(", ")}
                    {(paper.authors?.length || 0) > 3 && " et al."}
                  </p>
                </div>

                {/* Match score pill */}
                <div className="shrink-0 flex flex-col items-center gap-0.5">
                  <div className="w-10 h-10 rounded-full border-2 border-primary/30 flex items-center justify-center">
                    <span className="text-xs font-body font-bold text-primary">{matchScore}%</span>
                  </div>
                  <span className="text-[9px] font-body text-muted-foreground">match</span>
                </div>
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-3 mt-2">
                {paper.year && (
                  <span className="text-xs font-body text-accent">{paper.year}</span>
                )}
                {paper.venue && (
                  <span className="text-xs font-body text-foreground truncate max-w-[200px]">{paper.venue}</span>
                )}
                {paper.citationCount != null && (
                  <span className="text-xs font-body text-foreground">{paper.citationCount} citations</span>
                )}
              </div>

              {/* Abstract snippet / expandable */}
              <div className="mt-2">
                <p className="text-xs font-body text-foreground/90 leading-relaxed">
                  {isExpanded ? paper.abstract || snippet : snippet}
                </p>
                {paper.abstract && paper.abstract.length > 180 && (
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : paper.paperId)}
                    className="flex items-center gap-1 mt-1 text-[11px] font-body text-primary hover:underline"
                  >
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {isExpanded ? "Show less" : "Read more"}
                  </button>
                )}
              </div>

              {/* Action buttons */}
              {!isReviewed && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                  <button
                    onClick={() => handleApprove(paper)}
                    disabled={!defaultCollection}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-body font-semibold hover:bg-green-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(paper)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs font-body font-semibold hover:bg-destructive/20 transition-all"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                  <button
                    onClick={() => onOpenFull(paper)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-body text-foreground hover:text-primary hover:border-primary/20 transition-all ml-auto"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Open Full View
                  </button>
                  {paper.url && (
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2 py-2 rounded-lg border border-border text-xs font-body text-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}

              {/* Reviewed state */}
              {isReviewed && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/30">
                  <FileText className="w-3 h-3 text-foreground/50" />
                  <span className="text-[11px] font-body text-foreground/60 italic">Reviewed</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Footer summary */}
      <div className="px-5 py-3 border-t border-border bg-muted/10 flex items-center justify-between">
        <span className="text-xs font-body text-foreground">
          {reviewed.size} reviewed · {pendingCount} remaining
        </span>
        {reviewed.size === papers.length && papers.length > 0 && (
          <button
            onClick={() => { onClearSelection(); onClose(); }}
            className="text-xs font-body font-semibold text-primary hover:underline"
          >
            Done — Close Review
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default BulkReviewPanel;
