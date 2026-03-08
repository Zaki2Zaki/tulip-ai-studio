import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const PRESETS = [
  { label: "All Years", min: 0, max: 9999 },
  { label: "2020–2026", min: 2020, max: 2026 },
  { label: "2015–2019", min: 2015, max: 2019 },
  { label: "2005–2014", min: 2005, max: 2014 },
  { label: "1995–2004", min: 1995, max: 2004 },
  { label: "Before 1995", min: 0, max: 1994 },
];

interface YearFilterProps {
  yearRange: [number, number];
  onChange: (range: [number, number]) => void;
}

const YearFilter = ({ yearRange, onChange }: YearFilterProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeLabel =
    PRESETS.find((p) => p.min === yearRange[0] && p.max === yearRange[1])?.label || `${yearRange[0]}–${yearRange[1]}`;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-muted/20 text-xs font-body text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
      >
        {activeLabel}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-20 min-w-[160px] bg-card border border-border rounded-lg shadow-xl p-1 animate-in fade-in slide-in-from-top-1 duration-150">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                onChange([preset.min, preset.max]);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-body rounded-md transition-colors ${
                yearRange[0] === preset.min && yearRange[1] === preset.max
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default YearFilter;
