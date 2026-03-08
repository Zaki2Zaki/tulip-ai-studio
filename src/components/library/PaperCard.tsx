import { CheckCircle, AlertTriangle, MinusCircle, GripVertical } from "lucide-react";

interface Paper {
  paperId: string;
  title: string;
  abstract: string | null;
  year: number | null;
  citationCount: number | null;
  url: string;
  authors: { name: string }[];
  venue: string | null;
  matchRate?: number;
}

interface PaperCardProps {
  paper: Paper & { matchRate: number };
  isSelected: boolean;
  isActive: boolean;
  isLocked: boolean;
  onToggleSelect: (id: string) => void;
  onClick: (paper: Paper) => void;
  onUnlockClick: () => void;
  onDragStart?: (paper: Paper) => void;
}

const getAIFlag = (paper: Paper): { label: string; color: string; icon: React.ReactNode } => {
  const hasAbstract = paper.abstract && paper.abstract.length > 50;
  const hasCitations = (paper.citationCount || 0) > 5;
  if (hasAbstract && hasCitations) return { label: "Verified", color: "text-green-400", icon: <CheckCircle className="w-3 h-3" /> };
  if (hasAbstract || hasCitations) return { label: "Partial", color: "text-yellow-400", icon: <AlertTriangle className="w-3 h-3" /> };
  return { label: "Unverified", color: "text-muted-foreground", icon: <MinusCircle className="w-3 h-3" /> };
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

const PaperCard = ({ paper, isSelected, isActive, isLocked, onToggleSelect, onClick, onUnlockClick, onDragStart }: PaperCardProps) => {
  const aiFlag = getAIFlag(paper);
  const aiLabel = getAILabel(paper.title);
  const snippet = paper.abstract
    ? paper.abstract.length > 140 ? paper.abstract.slice(0, 140) + "…" : paper.abstract
    : "No abstract available.";

  return (
    <div
      draggable={!isLocked}
      onDragStart={(e) => {
        if (isLocked) return;
        onDragStart?.(paper);
        e.dataTransfer.setData("application/json", JSON.stringify({ paperId: paper.paperId, title: paper.title }));
        e.dataTransfer.effectAllowed = "copy";
      }}
      onClick={() => !isLocked && onClick(paper)}
      className={`group relative flex flex-col p-4 rounded-xl border transition-all cursor-pointer ${
        isLocked
          ? "opacity-40 blur-[1px] border-border"
          : isActive
          ? "border-primary/40 bg-primary/5 shadow-md shadow-primary/5"
          : isSelected
          ? "border-accent/30 bg-accent/5"
          : "border-border bg-card/30 hover:border-primary/20 hover:bg-card/50 hover:shadow-lg hover:shadow-black/10"
      }`}
    >
      {/* Top row: badge + grip */}
      <div className="flex items-start justify-between mb-2">
        <span className="inline-block px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-body text-accent">
          {aiLabel}
        </span>
        {!isLocked && (
          <GripVertical className="w-3.5 h-3.5 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing" />
        )}
      </div>

      {/* Title */}
      <h4 className="font-display text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-1.5">
        {paper.title}
      </h4>

      {/* Authors */}
      <p className="text-[11px] text-muted-foreground font-body mb-2">
        {paper.authors?.slice(0, 2).map((a) => a.name).join(", ")}
        {(paper.authors?.length || 0) > 2 && " et al."}
      </p>

      {/* Snippet */}
      <p className="text-xs text-muted-foreground/70 font-body leading-relaxed line-clamp-3 mb-3 flex-1">
        {snippet}
      </p>

      {/* Bottom row */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-2">
          {paper.year && <span className="text-[11px] font-body text-muted-foreground">{paper.year}</span>}
          <span className={`inline-flex items-center gap-1 text-[10px] font-body ${aiFlag.color}`}>
            {aiFlag.icon} {aiFlag.label}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${paper.matchRate}%`,
                background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))`,
              }}
            />
          </div>
          <span className="text-[10px] font-body text-muted-foreground tabular-nums">{paper.matchRate}%</span>
        </div>
      </div>

      {/* Checkbox */}
      {!isLocked && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(paper.paperId)}
            className="rounded border-border accent-primary"
          />
        </div>
      )}
    </div>
  );
};

export default PaperCard;
