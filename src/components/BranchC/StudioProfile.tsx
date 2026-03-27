import { ArrowRight } from "lucide-react";

interface StudioProfileProps {
  studioScale: string;
  outputType: string;
  budgetRange: string;
  onStudioScaleChange: (v: string) => void;
  onOutputTypeChange: (v: string) => void;
  onBudgetRangeChange: (v: string) => void;
  onNext: () => void;
}

const SCALE_OPTIONS = [
  { value: "Indie / Small Studio", sub: "1 to 20 people" },
  { value: "Mid-Size Studio", sub: "20 to 100 people" },
  { value: "AAA / Enterprise", sub: "100+ people" },
  { value: "Publisher / Multi-Studio", sub: "500+ people" },
];

const OUTPUT_OPTIONS = [
  "Games (Console / PC / Mobile)",
  "3D Animation / Film",
  "VFX / Virtual Production",
  "Mixed / All of the above",
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

export default function StudioProfile({
  studioScale,
  outputType,
  budgetRange,
  onStudioScaleChange,
  onOutputTypeChange,
  onBudgetRangeChange,
  onNext,
}: StudioProfileProps) {
  const canProceed = studioScale && outputType && budgetRange;

  return (
    <div className="max-w-2xl">
      <p className="text-[10px] tracking-[0.2em] uppercase text-primary font-body font-semibold mb-3">
        Strategic Briefing
      </p>
      <h2
        className="font-display text-2xl md:text-3xl font-bold text-white mb-2"
        style={{ letterSpacing: "-0.02em" }}
      >
        Three questions. Then we show you the numbers.
      </h2>
      <p className="text-sm text-white/70 font-body mb-8 leading-relaxed">
        Your answers personalise the risk data and ROI model to your studio size and output type.
      </p>

      {/* Q1 — Studio scale */}
      <div className="mb-7">
        <p className="text-xs font-body font-semibold uppercase tracking-wider text-white/50 mb-3">
          Studio scale
        </p>
        <div className="space-y-2">
          {SCALE_OPTIONS.map((opt) => {
            const active = studioScale === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onStudioScaleChange(opt.value)}
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
                  <span className="text-sm font-body font-semibold text-white">{opt.value}</span>
                  <span className="text-xs font-body text-white/50 ml-2">{opt.sub}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Q2 — Output type */}
      <div className="mb-7">
        <p className="text-xs font-body font-semibold uppercase tracking-wider text-white/50 mb-3">
          Primary output type
        </p>
        <div className="space-y-2">
          {OUTPUT_OPTIONS.map((opt) => {
            const active = outputType === opt;
            return (
              <button
                key={opt}
                onClick={() => onOutputTypeChange(opt)}
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
                <span className="text-sm font-body font-semibold text-white">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Q3 — Budget range */}
      <div className="mb-8">
        <p className="text-xs font-body font-semibold uppercase tracking-wider text-white/50 mb-3">
          Annual production budget range
        </p>
        <div className="flex flex-wrap gap-2">
          {BUDGET_OPTIONS.map((opt) => {
            const active = budgetRange === opt;
            return (
              <button
                key={opt}
                onClick={() => onBudgetRangeChange(opt)}
                className={`px-4 py-2 rounded-full border text-sm font-body transition-all ${
                  active
                    ? "text-white font-semibold"
                    : "border-border/40 text-white/70 hover:border-border/60 hover:text-white"
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

      <p className="text-xs font-body text-white/30 mb-6 leading-relaxed max-w-md">
        Your answers are used only to personalise this session. We do not store or share them without your permission.
      </p>

      <button
        disabled={!canProceed}
        onClick={onNext}
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-display font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Generate My Risk Scan <ArrowRight className="w-3.5 h-3.5" />
      </button>
      <p className="text-xs text-white/35 font-body mt-2">Takes under 10 seconds</p>
    </div>
  );
}
