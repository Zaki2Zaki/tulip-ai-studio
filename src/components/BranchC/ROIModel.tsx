import { ArrowRight } from "lucide-react";

interface ROIModelProps {
  studioScale: string;
  outputType: string;
  budgetRange: string;
  onNext: () => void;
  onBack: () => void;
}

const METRICS = [
  {
    name: "Annual rework cost exposure",
    detail:
      "AAA development budgets in the US and Canada now start at $300M per title, confirmed by Bloomberg reporting in March 2026. The lion's share goes to developer salaries and overhead — not executive compensation. AI integration compresses the rework triggers that drive overruns. That is not a productivity gain. That is budget recovered.",
  },
  {
    name: "Developer velocity",
    detail:
      "Some vendors report up to 90% acceleration in development cycles through AI pipeline integration. BCG's 2026 gaming report cites this figure in the context of game-generating tools now entering production use. Asset creation time compresses substantially. Your team produces more without growing the roster.",
  },
  {
    name: "Production cost structure",
    detail:
      "Texturing and rigging currently consume over 70% of your modeling budget. Both are compressible. Freeing that capacity redirects your senior artists toward work that actually requires them.",
  },
  {
    name: "Competitive window",
    detail:
      "BCG projects cloud gaming revenues will grow from $1.4B in 2025 to $18.3B by 2030 — a CAGR above 50%. Studios without AI-integrated pipelines will not be able to support the content cadence that platform-agnostic, cloud-native distribution demands. There is roughly 18 months before this gap becomes structurally difficult to close.",
  },
];

const TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: "$15K to $45K",
    detail: "Pipeline audit and tool benchmarking. Indie to mid-size studios. Payback period: 2 to 4 months.",
    recommended: false,
  },
  {
    id: "studio",
    name: "Studio",
    price: "$45K to $165K",
    detail: "Full adoption, integration, and workshops. Mid-size to AAA studios. Payback period: 4 to 8 months.",
    recommended: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$165K to $395K",
    detail: "Architecture blueprint and multi-studio rollout. AAA to publisher scale. Payback period: 6 to 12 months.",
    recommended: false,
  },
];

export { TIERS, METRICS };

const GRADIENT_BORDER = {
  border: "2px solid transparent",
  background:
    "linear-gradient(hsl(0 0% 6%), hsl(0 0% 6%)) padding-box, " +
    "linear-gradient(to right, #a78bfa, #c4b5fd, #e9d5ff) border-box",
  borderRadius: "12px",
};

export default function ROIModel({ onNext, onBack }: ROIModelProps) {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 mb-3">
        <p className="text-[10px] tracking-[0.2em] uppercase text-primary font-body font-semibold">
          ROI Model
        </p>
        <span className="px-2 py-0.5 rounded-full bg-orange-400/15 border border-orange-400/30 text-[9px] font-display font-bold uppercase tracking-wider text-orange-400">
          Demo Only
        </span>
      </div>
      <h2
        className="font-display text-2xl md:text-3xl font-bold text-white mb-6"
        style={{ letterSpacing: "-0.02em" }}
      >
        What this is worth at your scale.
      </h2>

      {/* Metrics */}
      <div className="space-y-3 mb-8">
        {METRICS.map((m) => (
          <div key={m.name} className="px-4 py-4 rounded-xl bg-card/40 border border-border/30">
            <p className="text-sm font-display font-bold text-white mb-1.5">{m.name}</p>
            <p className="text-sm font-body text-white/80 leading-relaxed">{m.detail}</p>
          </div>
        ))}
      </div>

      {/* Investment Tiers */}
      <p className="text-xs font-body font-semibold uppercase tracking-wider text-white/50 mb-3">
        Investment tiers
      </p>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            className={`p-4 rounded-xl ${!tier.recommended ? "border border-border/30 bg-card/40" : ""}`}
            style={tier.recommended ? GRADIENT_BORDER : undefined}
          >
            <div className="flex items-start justify-between gap-1 mb-2">
              <p className="text-xs font-display font-bold text-white">{tier.name}</p>
              {tier.recommended && (
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
                  style={{
                    background: "linear-gradient(to right, #a78bfa, #c4b5fd)",
                    color: "#0a0a0a",
                  }}
                >
                  Rec.
                </span>
              )}
            </div>
            <p className="text-sm font-display font-bold text-white mb-2">{tier.price}</p>
            <p className="text-xs font-body text-white/60 leading-relaxed">{tier.detail}</p>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="px-4 py-4 rounded-xl bg-orange-400/5 border border-orange-400/20 mb-6">
        <div className="flex items-start gap-2">
          <span className="text-base shrink-0 mt-0.5">⚠️</span>
          <p className="text-sm font-body text-white/70 leading-relaxed">
            These figures draw on published research from BCG, Bloomberg, ESAC/Nordicity, GDC, and
            Morgan Stanley among others. Where vendor data is used, it is attributed. Your actual
            numbers depend on your pipeline, team size, and how integration is scoped. A 30-minute
            conversation is all it takes to make these numbers specific to your studio.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-display font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Build My Executive Summary <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button onClick={onBack} className="text-xs text-white/50 hover:text-white font-body transition-colors">
          ← Back
        </button>
      </div>
      <p className="text-xs text-white/35 font-body mt-2">
        A one-page brief you can share with your leadership team
      </p>
    </div>
  );
}
