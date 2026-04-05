import { ArrowRight } from "lucide-react";

interface StudioProfileProps {
  studioScale: string;
  outputType: string;
  budgetRange: string;
  outsourcePct: string;
  rdBudget: string;
  onStudioScaleChange: (v: string) => void;
  onOutputTypeChange: (v: string) => void;
  onBudgetRangeChange: (v: string) => void;
  onOutsourcePctChange: (v: string) => void;
  onRdBudgetChange: (v: string) => void;
  onNext: () => void;
}

const SCALE_OPTIONS = [
  { key: "indie", label: "Indie / Small Studio", sub: "1 to 20 people" },
  { key: "midsize", label: "Mid-Size Studio", sub: "20 to 100 people" },
  { key: "aaa", label: "AAA / Enterprise", sub: "100+ people" },
  { key: "publisher", label: "Publisher / Multi-Studio", sub: "500+ people" },
];

const OUTPUT_OPTIONS = [
  { key: "games", label: "Games (Console / PC / Mobile)" },
  { key: "animation", label: "3D Animation / Film" },
  { key: "vfx", label: "VFX / Visual Effects" },
  { key: "virtualproduction", label: "Virtual Production" },
  { key: "mixed", label: "Mixed / All of the above" },
];

const BUDGET_OPTIONS = [
  "Under $1M", "$1M to $10M", "$10M to $50M",
  "$50M to $200M", "$200M+", "Prefer not to say",
];

const SELECTED_STYLE = {
  border: "2px solid transparent",
  background:
    "linear-gradient(hsl(0 0% 6%), hsl(0 0% 6%)) padding-box, " +
    "linear-gradient(to right, #a78bfa, #c4b5fd, #e9d5ff) border-box",
  borderRadius: "12px",
};

const SELECT_STYLE: React.CSSProperties = {
  background: "hsl(0 0% 9%)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  color: "#fff",
  padding: "10px 14px",
  fontSize: "14px",
  width: "100%",
  appearance: "none" as const,
  outline: "none",
  fontFamily: "inherit",
};

export default function StudioProfile({
  studioScale,
  outputType,
  budgetRange,
  outsourcePct,
  rdBudget,
  onStudioScaleChange,
  onOutputTypeChange,
  onBudgetRangeChange,
  onOutsourcePctChange,
  onRdBudgetChange,
  onNext,
}: StudioProfileProps) {
  const canProceed = studioScale && outputType && budgetRange;

  return (
    <div className="max-w-2xl" style={{ color: "white", fontSize: "14px" }}>
      <p className="text-[10px] tracking-[0.2em] uppercase text-primary font-body font-semibold mb-3">
        Strategic Briefing
      </p>
      <h2
        className="font-display text-2xl md:text-3xl font-bold text-white mb-2"
        style={{ letterSpacing: "-0.02em" }}
      >
        <span style={{ background: "linear-gradient(90deg,#f472b6 0%,#c084fc 35%,#22d3ee 70%,#2dd4bf 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Five</span> questions. Then we show you the numbers.
      </h2>
      <p className="text-[15px] text-white font-body mb-8 leading-relaxed">
        Your answers personalise the risk data and ROI model to your studio size and output type.
      </p>

      {/* Q1 — Studio scale */}
      <div className="mb-7">
        <p className="text-sm font-body font-semibold uppercase tracking-wider text-white mb-3">
          Studio scale
        </p>
        <div className="space-y-2">
          {SCALE_OPTIONS.map((opt) => {
            const active = studioScale === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => onStudioScaleChange(opt.key)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center gap-3 ${
                  active ? "" : "border-border/40 hover:border-border/60"
                }`}
                style={active ? SELECTED_STYLE : undefined}
              >
                <span
                  className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                  style={{
                    borderColor: active ? "#c084fc" : "#555",
                    background: active ? "#c084fc" : "transparent",
                  }}
                >
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
                <span>
                  <span className="text-[15px] font-body font-semibold text-white">{opt.label}</span>
                  <span className="text-[15px] font-body text-white ml-2">{opt.sub}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Q2 — Output type */}
      <div className="mb-7">
        <p className="text-sm font-body font-semibold uppercase tracking-wider text-white mb-3">
          Primary output type
        </p>
        <div className="space-y-2">
          {OUTPUT_OPTIONS.map((opt) => {
            const active = outputType === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => onOutputTypeChange(opt.key)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center gap-3 ${
                  active ? "" : "border-border/40 hover:border-border/60"
                }`}
                style={active ? SELECTED_STYLE : undefined}
              >
                <span
                  className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                  style={{
                    borderColor: active ? "#c084fc" : "#555",
                    background: active ? "#c084fc" : "transparent",
                  }}
                >
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
                <span className="text-[15px] font-body font-semibold text-white">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Q3 — Budget range */}
      <div className="mb-7">
        <p className="text-sm font-body font-semibold uppercase tracking-wider text-white mb-3">
          Annual production budget range
        </p>
        <div className="flex flex-wrap gap-2">
          {BUDGET_OPTIONS.map((opt) => {
            const active = budgetRange === opt;
            return (
              <button
                key={opt}
                onClick={() => onBudgetRangeChange(opt)}
                className={`px-4 py-2 rounded-full border text-[15px] font-body transition-all ${
                  active
                    ? "text-white font-semibold"
                    : "border-border/40 text-white hover:border-border/60"
                }`}
                style={active ? {
                  border: "2px solid transparent",
                  background:
                    "linear-gradient(hsl(0 0% 6%), hsl(0 0% 6%)) padding-box, " +
                    "linear-gradient(to right, #a78bfa, #c4b5fd, #e9d5ff) border-box",
                  borderRadius: "9999px",
                } : undefined}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Q4 — Outsource % + R&D budget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <p className="text-[11px] font-body font-bold uppercase tracking-wider text-white mb-2">
            What percentage is outsourced?
          </p>
          <select
            value={outsourcePct}
            onChange={(e) => onOutsourcePctChange(e.target.value)}
            style={SELECT_STYLE}
          >
            <option value="0">We do not outsource</option>
            <option value="0.10">Under 20% outsourced</option>
            <option value="0.20">20 to 40% outsourced</option>
            <option value="0.40">40 to 60% outsourced</option>
            <option value="0.60">Over 60% outsourced</option>
          </select>
        </div>
        <div>
          <p className="text-[11px] font-body font-bold uppercase tracking-wider text-white mb-2">
            Pipeline or R&amp;D budget
          </p>
          <select
            value={rdBudget}
            onChange={(e) => onRdBudgetChange(e.target.value)}
            style={SELECT_STYLE}
          >
            <option value="none">No dedicated R&amp;D budget</option>
            <option value="0.03">Under 3% of production</option>
            <option value="0.07">3 to 10% of production</option>
            <option value="0.12">Over 10% of production</option>
          </select>
        </div>
      </div>

      <p className="text-[15px] font-body text-white mb-6 leading-relaxed max-w-md">
        Your answers are used only to personalise this session. We do not store or share them without your permission.
      </p>

      <button
        disabled={!canProceed}
        onClick={onNext}
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-display font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Generate My Risk Scan <ArrowRight className="w-3.5 h-3.5" />
      </button>
      <p className="text-[15px] text-white font-body mt-2">Takes under 10 seconds</p>
    </div>
  );
}
