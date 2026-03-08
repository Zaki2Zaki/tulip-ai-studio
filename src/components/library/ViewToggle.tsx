import { LayoutGrid, List, AlignJustify } from "lucide-react";

type ViewMode = "table" | "cards" | "compact";

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const views: { mode: ViewMode; icon: typeof List; label: string }[] = [
  { mode: "table", icon: AlignJustify, label: "Table" },
  { mode: "cards", icon: LayoutGrid, label: "Cards" },
  { mode: "compact", icon: List, label: "Compact" },
];

const ViewToggle = ({ mode, onChange }: ViewToggleProps) => (
  <div className="inline-flex items-center rounded-lg border border-border bg-card/40 p-0.5">
    {views.map((v) => (
      <button
        key={v.mode}
        onClick={() => onChange(v.mode)}
        title={v.label}
        className={`p-1.5 rounded-md transition-all ${
          mode === v.mode
            ? "bg-primary/15 text-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
        }`}
      >
        <v.icon className="w-3.5 h-3.5" />
      </button>
    ))}
  </div>
);

export default ViewToggle;
export type { ViewMode };
