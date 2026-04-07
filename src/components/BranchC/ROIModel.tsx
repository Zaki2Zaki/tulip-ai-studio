import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import type { BudgetBreakdown } from "./RiskScan";
import { getScenario } from "./personalisationData";

interface ROIModelProps {
  studioScale: string;
  outputType: string;
  budgetRange: string;
  outsourcePct: string;
  rdBudget: string;
  breakdown: BudgetBreakdown;
  onNext: () => void;
  onBack: () => void;
}

export const TIERS = [
  { id: "starter",    name: "Starter",    price: "$15K to $45K",   detail: "Pipeline audit and tool benchmarking. Indie to mid-size studios. Payback period: 2 to 4 months." },
  { id: "studio",     name: "Studio",     price: "$45K to $165K",  detail: "Full adoption, integration, and workshops. Mid-size to AAA studios. Payback period: 4 to 8 months." },
  { id: "enterprise", name: "Enterprise", price: "$165K to $395K", detail: "Architecture blueprint and multi-studio rollout. AAA to publisher scale. Payback period: 6 to 12 months." },
];

const BUDGET_MIDPOINTS: Record<string, number | null> = {
  "Under $1M":         500000,
  "$1M to $10M":       5000000,
  "$10M to $50M":      30000000,
  "$50M to $200M":     100000000,
  "$200M+":            300000000,
  "Prefer not to say": null,
};

const EFFICIENCY_RATES: Record<string, number> = {
  games:     0.20,
  animation: 0.30,
  vfx:       0.20,
  mixed:     0.20,
};

const TIER_MIDPOINTS: Record<string, number> = {
  starter:    30000,
  studio:     105000,
  enterprise: 280000,
};

const PIPELINE_EFFICIENCY: Record<string, string> = {
  games:     "15 to 25% faster on asset-heavy pipeline stages",
  animation: "20 to 40% faster on mechanical production tasks",
  vfx:       "20 to 65% faster on rotoscoping and cleanup",
  mixed:     "15 to 30% faster on asset creation workflows",
};

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  return `$${(value / 1_000).toFixed(0)}K`;
}

function formatMultiple(lower: number, upper: number): string {
  const lo = Math.round(lower * 10) / 10;
  const hi = Math.round(upper * 10) / 10;
  if (lo >= 20) return "20x+ in year one";
  const hiStr = hi > 20 ? "20+" : `${hi}`;
  return `${lo}x to ${hiStr}x in year one`;
}

function formatTimeToValue(months: number): string {
  if (months < 1) return "Under 1 month";
  if (months > 24) return "18 to 24 months";
  return `${months} month${months === 1 ? "" : "s"}`;
}

const ROW_STYLE: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  padding: "12px 0",
  borderBottom: "1px solid rgba(255,255,255,0.07)",
};

const LABEL_STYLE: React.CSSProperties = {
  fontSize: "13px",
  color: "rgba(255,255,255,0.6)",
  fontFamily: "inherit",
  lineHeight: 1.4,
  maxWidth: "60%",
};

const VALUE_STYLE: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: 700,
  color: "#fff",
  textAlign: "right" as const,
  fontFamily: "inherit",
  lineHeight: 1.4,
};

const NOTE_STYLE: React.CSSProperties = {
  fontSize: "11px",
  color: "rgba(255,255,255,0.4)",
  marginTop: "4px",
  fontFamily: "inherit",
  lineHeight: 1.5,
};

export default function ROIModel({
  studioScale, outputType, budgetRange, onNext, onBack,
}: ROIModelProps) {
  const scenario = getScenario(studioScale, outputType);
  const recommendedTierId = scenario.getRecommendedTierId(budgetRange);
  const recommendedTier = TIERS.find((t) => t.id === recommendedTierId)!;

  const calc = useMemo(() => {
    const budgetMidpoint = BUDGET_MIDPOINTS[budgetRange] ?? null;
    const efficiencyRate = EFFICIENCY_RATES[outputType] ?? 0.20;
    const engagementMidpoint = TIER_MIDPOINTS[recommendedTierId] ?? 105000;

    if (budgetMidpoint === null) {
      return { hasDollarFigures: false as const, efficiencyRate, engagementMidpoint };
    }

    const labourBase       = budgetMidpoint * 0.68;
    const grossOpportunity = labourBase * efficiencyRate;
    const yearOneCapture   = grossOpportunity * 0.40;
    const realisedValue    = yearOneCapture * 0.70;

    // Upper bound uses 50% capture rate instead of 40%
    const upperRealisedValue = grossOpportunity * 0.50 * 0.70;
    const lowerMultiple = realisedValue / engagementMidpoint;
    const upperMultiple = upperRealisedValue / engagementMidpoint;

    const monthlyValue       = realisedValue / 12;
    const timeToValueMonths  = Math.ceil(engagementMidpoint / monthlyValue);

    return {
      hasDollarFigures: true as const,
      budgetMidpoint,
      grossOpportunity,
      realisedValue,
      lowerMultiple,
      upperMultiple,
      timeToValueMonths,
      engagementMidpoint,
      efficiencyRate,
    };
  }, [budgetRange, outputType, recommendedTierId]);

  const pipelineEfficiency = PIPELINE_EFFICIENCY[outputType] ?? PIPELINE_EFFICIENCY["mixed"];

  return (
    <div className="max-w-2xl" style={{ color: "white", fontSize: "14px" }}>
      <div className="flex items-center gap-2 mb-3">
        <p className="text-[10px] tracking-[0.2em] uppercase text-primary font-body font-semibold">
          ROI Model
        </p>
        <span className="px-2 py-0.5 rounded-full bg-orange-400/15 border border-orange-400/30 text-[9px] font-display font-bold uppercase tracking-wider text-orange-400">
          Indicative Estimates
        </span>
      </div>
      <h2
        className="font-display text-2xl md:text-3xl font-bold text-white mb-6"
        style={{ letterSpacing: "-0.02em" }}
      >
        What this is worth at your scale.
      </h2>

      <div
        className="rounded-2xl border border-border/40 bg-card/50 mb-6"
        style={{ padding: "20px 24px" }}
      >
        {/* Row 1 — Gross Efficiency Opportunity */}
        <div style={ROW_STYLE}>
          <span style={LABEL_STYLE}>Estimated annual efficiency opportunity</span>
          <span style={VALUE_STYLE}>
            {calc.hasDollarFigures
              ? formatCurrency(calc.grossOpportunity)
              : `${Math.round(calc.efficiencyRate * 100)}% of labour base`}
          </span>
        </div>

        {/* Row 2 — Year One Realised Value */}
        <div style={{ ...ROW_STYLE, flexDirection: "column" as const, gap: "4px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", width: "100%" }}>
            <span style={LABEL_STYLE}>Year one realised value</span>
            <span style={VALUE_STYLE}>
              {calc.hasDollarFigures
                ? formatCurrency(calc.realisedValue)
                : "Requires budget input"}
            </span>
          </div>
          <span style={NOTE_STYLE}>After 40% adoption rate and 30% risk adjustment</span>
        </div>

        {/* Row 3 — Engagement Cost */}
        <div style={ROW_STYLE}>
          <span style={LABEL_STYLE}>Engagement cost</span>
          <span style={VALUE_STYLE}>
            {recommendedTier.price} ({recommendedTier.name})
          </span>
        </div>

        {/* Row 4 — Return Multiple */}
        <div style={ROW_STYLE}>
          <span style={LABEL_STYLE}>Indicative return multiple</span>
          <span style={VALUE_STYLE}>
            {calc.hasDollarFigures
              ? formatMultiple(calc.lowerMultiple, calc.upperMultiple)
              : "—"}
          </span>
        </div>

        {/* Row 5 — Pipeline Efficiency Gain */}
        <div style={ROW_STYLE}>
          <span style={LABEL_STYLE}>Pipeline efficiency gain</span>
          <span style={{ ...VALUE_STYLE, fontSize: "13px", fontWeight: 600 }}>
            {pipelineEfficiency}
          </span>
        </div>

        {/* Row 6 — Time to Value */}
        <div style={{ ...ROW_STYLE, borderBottom: "none" }}>
          <span style={LABEL_STYLE}>Time to value</span>
          <span style={VALUE_STYLE}>
            {calc.hasDollarFigures
              ? formatTimeToValue(calc.timeToValueMonths)
              : "—"}
          </span>
        </div>
      </div>

      {/* Methodology Note */}
      <p
        className="font-body mb-6 leading-relaxed"
        style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", lineHeight: 1.6 }}
      >
        Estimates apply a 30% risk adjustment and 40% year-one adoption rate to published efficiency
        benchmarks. Sources: ESAC/Nordicity 2021 (labour cost baseline) · a16z Games Survey 2024 /
        Morgan Stanley 2024 / Roland Berger (efficiency rates) · Forrester TEI methodology (adoption
        curve). Your actual results depend on pipeline complexity and team adoption rate.
      </p>

      <div className="flex items-center gap-4">
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-display font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Build My Executive Summary <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button onClick={onBack} className="text-xs text-white hover:text-white font-body transition-colors">
          ← Back
        </button>
      </div>
      <p className="text-[15px] text-white font-body mt-2">
        A one-page brief you can share with your leadership team
      </p>
    </div>
  );
}
