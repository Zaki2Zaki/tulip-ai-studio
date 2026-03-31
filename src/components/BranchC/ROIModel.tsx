import { ArrowRight } from "lucide-react";
import { getScenario } from "./personalisationData";

interface ROIModelProps {
  studioScale: string;
  outputType: string;
  budgetRange: string;
  onNext: () => void;
  onBack: () => void;
}

export const TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: "$15K to $45K",
    detail: "Pipeline audit and tool benchmarking. Indie to mid-size studios. Payback period: 2 to 4 months.",
  },
  {
    id: "studio",
    name: "Studio",
    price: "$45K to $165K",
    detail: "Full adoption, integration, and workshops. Mid-size to AAA studios. Payback period: 4 to 8 months.",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$165K to $395K",
    detail: "Architecture blueprint and multi-studio rollout. AAA to publisher scale. Payback period: 6 to 12 months.",
  },
];

const GRADIENT_BORDER = {
  border: "2px solid transparent",
  background:
    "linear-gradient(hsl(0 0% 6%), hsl(0 0% 6%)) padding-box, " +
    "linear-gradient(to right, #a78bfa, #c4b5fd, #e9d5ff) border-box",
  borderRadius: "12px",
};

export default function ROIModel({ studioScale, outputType, budgetRange, onNext, onBack }: ROIModelProps) {
  const scenario = getScenario(studioScale, outputType);
  const recommendedTierId = scenario.getRecommendedTierId(budgetRange);

  return (
    <div className="max-w-2xl" style={{ color: "white", fontSize: "14px" }}>
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

      {/* Metrics — 2-column grid on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {scenario.roiMetrics.map((m) => (
          <div
            key={m.name}
            className="px-4 py-4 rounded-xl bg-card/40 border border-border/30"
            style={{ boxShadow: "0 0 0 1px rgba(167,139,250,0.2), 0 0 20px rgba(167,139,250,0.1)" }}
          >
            <p className="text-base font-display font-bold text-white mb-1.5">{m.name}</p>
            <p className="text-base font-body text-white leading-relaxed">{m.detail}</p>
            {m.sources && m.sources.length > 0 && (
              <p className="text-[13px] font-body text-white italic mt-2">
                {m.sources.map((s, i) => (
                  <span key={i}>
                    {i > 0 && " · "}
                    {s.url ? (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white underline underline-offset-2 transition-colors"
                      >
                        {s.label}
                      </a>
                    ) : (
                      s.label
                    )}
                  </span>
                ))}
              </p>
            )}
          </div>
        ))}
      </div>

      {scenario.reworkCostNote && (
        <p className="text-sm font-body text-white italic mb-4 -mt-4">{scenario.reworkCostNote}</p>
      )}

      {/* Investment Tiers */}
      <p className="text-sm font-body font-semibold uppercase tracking-wider text-white mb-3">
        Investment tiers
      </p>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {TIERS.map((tier) => {
          const recommended = tier.id === recommendedTierId;
          return (
            <div
              key={tier.id}
              className={`p-4 rounded-xl ${!recommended ? "border border-border/30 bg-card/40" : ""}`}
              style={recommended ? GRADIENT_BORDER : undefined}
            >
              <div className="flex items-start justify-between gap-1 mb-2">
                <p className="text-sm font-display font-bold text-white">{tier.name}</p>
                {recommended && (
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
              <p className="text-[15px] font-body text-white leading-relaxed">{tier.detail}</p>
            </div>
          );
        })}
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
