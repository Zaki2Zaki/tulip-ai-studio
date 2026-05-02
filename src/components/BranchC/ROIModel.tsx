import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import type { BudgetBreakdown } from "./RiskScan";
import { getScenario } from "./personalisationData";
import { useNotionCapture } from "@/hooks/useNotionCapture";

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

// ── iframe param helpers ──────────────────────────────────────────────────────

function mapStudioType(studioScale: string, outputType: string): string {
  if (outputType === "animation") return "animation";
  if (outputType === "vfx")       return "vfx";
  if (studioScale === "indie")    return "indie";
  if (studioScale === "aaa" || studioScale === "publisher") return "aaa";
  return "aa";
}

function mapTeamSize(studioScale: string): string {
  if (studioScale === "indie")     return "25";
  if (studioScale === "midsize")   return "100";
  if (studioScale === "aaa")       return "350";
  if (studioScale === "publisher") return "750";
  return "100";
}

function mapBudgetRange(budgetRange: string): string {
  const map: Record<string, string> = {
    "Under $1M":         "750000",
    "$1M to $10M":       "2500000",
    "$10M to $50M":      "10000000",
    "$50M to $200M":     "40000000",
    "$200M+":            "120000000",
    "Prefer not to say": "10000000",
  };
  return map[budgetRange] || "10000000";
}

function derivePainPoints(artPct: number, qaPct: number, reworkCycles: string, outsourcePct: string): string {
  const points: string[] = [];
  if (artPct >= 30) points.push("texturing");
  if (Number(reworkCycles) >= 4) points.push("rework");
  if (qaPct >= 10) points.push("qa");
  if (parseFloat(outsourcePct) > 0.2) points.push("outsource");
  return points.length > 0 ? points.join(",") : "texturing,rework";
}

// ── Inline calc helpers ───────────────────────────────────────────────────────

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

// ── Styles ────────────────────────────────────────────────────────────────────

const ACCENT_STYLE: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: 700,
  background: "linear-gradient(to right, #a78bfa, #c084fc, #e879a0)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  textAlign: "right" as const,
  fontFamily: "inherit",
  lineHeight: 1.4,
};

const VALUE_STYLE: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: 700,
  color: "#fff",
  textAlign: "right" as const,
  fontFamily: "inherit",
  lineHeight: 1.4,
};

const LABEL_STYLE: React.CSSProperties = {
  fontSize: "13px",
  color: "rgba(255,255,255,0.6)",
  fontFamily: "inherit",
  lineHeight: 1.4,
  maxWidth: "60%",
};

const NOTE_STYLE: React.CSSProperties = {
  fontSize: "11px",
  color: "rgba(255,255,255,0.4)",
  marginTop: "4px",
  fontFamily: "inherit",
  lineHeight: 1.5,
};

const ROW_STYLE: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  padding: "12px 0",
  borderBottom: "1px solid rgba(255,255,255,0.07)",
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function ROIModel({
  studioScale, outputType, budgetRange, outsourcePct, rdBudget, breakdown, onNext, onBack,
}: ROIModelProps) {
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const { capture } = useNotionCapture();

  // iframe src
  const calcSrc = useMemo(() => {
    const params = new URLSearchParams({
      auto:           "1",
      studioType:     mapStudioType(studioScale, outputType),
      teamSize:       mapTeamSize(studioScale),
      budgetRangeVal: mapBudgetRange(budgetRange),
      outsourcePct,
      rdBudget,
      artPct:         String(breakdown.artPct),
      engPct:         String(breakdown.engPct),
      qaPct:          String(breakdown.qaPct),
      reworkCycles:   breakdown.reworkCycles,
      deliveryTime:   breakdown.deliveryTime,
      aiUsage:        breakdown.aiUsage,
      painPoints:     derivePainPoints(breakdown.artPct, breakdown.qaPct, breakdown.reworkCycles, outsourcePct),
    });
    return `/pipeline-calculator.html?${params.toString()}`;
  }, [studioScale, outputType, budgetRange, outsourcePct, rdBudget, breakdown]);

  // auto-resize iframe from postMessage
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "roiCalcHeight") {
        const frame = document.getElementById("roiCalcFrame") as HTMLIFrameElement;
        if (frame) frame.style.height = e.data.height + "px";
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // inline calc
  const scenario = getScenario(studioScale, outputType);
  const recommendedTierId = scenario.getRecommendedTierId(budgetRange);
  const recommendedTier = TIERS.find((t) => t.id === recommendedTierId)!;

  const calc = useMemo(() => {
    const budgetMidpoint    = BUDGET_MIDPOINTS[budgetRange] ?? null;
    const efficiencyRate    = EFFICIENCY_RATES[outputType] ?? 0.20;
    const engagementMidpoint = TIER_MIDPOINTS[recommendedTierId] ?? 105000;

    if (budgetMidpoint === null) {
      return { hasDollarFigures: false as const, efficiencyRate, engagementMidpoint };
    }

    const labourBase         = budgetMidpoint * 0.68;
    const grossOpportunity   = labourBase * efficiencyRate;
    const yearOneCapture     = grossOpportunity * 0.40;
    const realisedValue      = yearOneCapture * 0.70;
    const upperRealisedValue = grossOpportunity * 0.50 * 0.70;
    const lowerMultiple      = realisedValue / engagementMidpoint;
    const upperMultiple      = upperRealisedValue / engagementMidpoint;
    const monthlyValue       = realisedValue / 12;
    const timeToValueMonths  = Math.ceil(engagementMidpoint / monthlyValue);

    return {
      hasDollarFigures: true as const,
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

      {/* ── Pipeline calculator iframe ── */}
      <iframe
        key={calcSrc}
        src={calcSrc}
        id="roiCalcFrame"
        className="w-full rounded-xl border-none mb-6"
        style={{ minHeight: 600 }}
        scrolling="no"
      />

      {/* ── Inline summary card ── */}
      <div
        className="rounded-2xl border border-border/40 bg-card/50 mb-4"
        style={{ padding: "20px 24px" }}
      >
        {/* Row 1 — Gross Efficiency Opportunity (accent) */}
        <div style={{ ...ROW_STYLE, flexDirection: "column" as const, gap: "4px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", width: "100%" }}>
            <span style={LABEL_STYLE}>Estimated annual efficiency opportunity</span>
            <span style={ACCENT_STYLE}>
              {calc.hasDollarFigures
                ? formatCurrency(calc.grossOpportunity)
                : `${Math.round(calc.efficiencyRate * 100)}% of labour base`}
            </span>
          </div>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", marginTop: "4px", fontFamily: "inherit", lineHeight: 1.55 }}>
            Modelled from 68% labour cost baseline across studios your size. Actual results depend on pipeline structure and adoption rate.
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

        {/* Row 4 — Return Multiple (accent) */}
        <div style={ROW_STYLE}>
          <span style={LABEL_STYLE}>Indicative return multiple</span>
          <span style={ACCENT_STYLE}>
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

      {/* ── Methodology dropdown ── */}
      <div className="rounded-2xl border border-border/30 bg-card/30 mb-6 overflow-hidden">
        <button
          onClick={() => setMethodologyOpen((o) => !o)}
          className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-white/5 transition-colors"
        >
          <span className="text-[11px] font-body font-semibold uppercase tracking-widest text-white">
            Methodology — How these figures are calculated
          </span>
          {methodologyOpen
            ? <ChevronUp className="w-4 h-4 text-white shrink-0" />
            : <ChevronDown className="w-4 h-4 text-white shrink-0" />}
        </button>
        {methodologyOpen && (
          <div className="px-5 pb-4 border-t border-border/20">
            <p
              className="font-body leading-relaxed pt-3"
              style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}
            >
              Estimates apply a 30% risk adjustment and 40% year-one adoption rate to published
              efficiency benchmarks. Labour base is calculated as 68% of annual production budget
              (ESAC/Nordicity 2021, 937-studio sample). Efficiency rates: 20% for games and VFX
              (a16z Games Survey 2024 lower bound; Roland Berger lower bound), 30% for animation
              (Morgan Stanley 2024). Year-one capture rate sourced from Forrester TEI methodology.
              Return multiple range uses 40% to 50% capture bounds. Engagement cost is the midpoint
              of your recommended tier. Your actual results depend on pipeline complexity and team
              adoption rate.
            </p>
          </div>
        )}
      </div>

      {/* ── CTA buttons ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <button
          onClick={() => {
            capture({
              source: 'Strategic Briefing — ROI Model',
              ctaLabel: '30 Mins Validate Meeting',
              studioScale,
              outputType,
              budgetRange,
              efficiencyOpportunity: calc.hasDollarFigures ? formatCurrency(calc.grossOpportunity) : `${Math.round(calc.efficiencyRate * 100)}% of labour base`,
              yearOneValue: calc.hasDollarFigures ? formatCurrency(calc.realisedValue) : 'Requires budget input',
              returnMultiple: calc.hasDollarFigures ? formatMultiple(calc.lowerMultiple, calc.upperMultiple) : '—',
              timeToValue: calc.hasDollarFigures ? formatTimeToValue(calc.timeToValueMonths) : '—',
              recommendedTier: recommendedTier.name,
            });
            window.open('https://calendly.com/youki-harada/30min', '_blank');
          }}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-display font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          30 Mins Validate Meeting <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            capture({
              source: 'Strategic Briefing — ROI Model',
              ctaLabel: 'Book Discovery Call',
              studioScale,
              outputType,
              budgetRange,
              efficiencyOpportunity: calc.hasDollarFigures ? formatCurrency(calc.grossOpportunity) : `${Math.round(calc.efficiencyRate * 100)}% of labour base`,
              yearOneValue: calc.hasDollarFigures ? formatCurrency(calc.realisedValue) : 'Requires budget input',
              returnMultiple: calc.hasDollarFigures ? formatMultiple(calc.lowerMultiple, calc.upperMultiple) : '—',
              timeToValue: calc.hasDollarFigures ? formatTimeToValue(calc.timeToValueMonths) : '—',
              recommendedTier: recommendedTier.name,
            });
            window.open('https://calendly.com/youki-harada/30min', '_blank');
          }}
          className="inline-flex items-center gap-2 btn-chrome-outline px-5 py-2.5 rounded-full font-display font-semibold text-sm transition-all min-h-[44px]"
        >
          Book Discovery Call
        </button>
        <button
          onClick={() => {
            const efficiencyOpportunity = calc.hasDollarFigures ? formatCurrency(calc.grossOpportunity) : `${Math.round(calc.efficiencyRate * 100)}% of labour base`;
            capture({
              source: 'Strategic Briefing — ROI Model',
              ctaLabel: 'Email Results',
              studioScale,
              outputType,
              budgetRange,
              efficiencyOpportunity,
              yearOneValue: calc.hasDollarFigures ? formatCurrency(calc.realisedValue) : 'Requires budget input',
              returnMultiple: calc.hasDollarFigures ? formatMultiple(calc.lowerMultiple, calc.upperMultiple) : '—',
              timeToValue: calc.hasDollarFigures ? formatTimeToValue(calc.timeToValueMonths) : '—',
              recommendedTier: recommendedTier.name,
            });
            window.location.href = `mailto:?subject=${encodeURIComponent('Tulip Tech Pipeline Assessment Results')}&body=${encodeURIComponent('Your efficiency opportunity is ' + efficiencyOpportunity)}`;
          }}
          className="inline-flex items-center gap-2 btn-chrome-outline px-5 py-2.5 rounded-full font-display font-semibold text-sm transition-all min-h-[44px]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          Email Results
        </button>
      </div>
    </div>
  );
}
