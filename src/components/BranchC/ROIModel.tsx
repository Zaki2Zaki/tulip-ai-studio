import { useEffect, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import type { BudgetBreakdown } from "@/pages/PipelineLabPage";

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

// Keep TIERS export so ExecutiveSummary can import it if needed
export const TIERS = [
  { id: "starter",    name: "Starter",    price: "$15K to $45K",   detail: "Pipeline audit and tool benchmarking. Indie to mid-size studios. Payback period: 2 to 4 months." },
  { id: "studio",     name: "Studio",     price: "$45K to $165K",  detail: "Full adoption, integration, and workshops. Mid-size to AAA studios. Payback period: 4 to 8 months." },
  { id: "enterprise", name: "Enterprise", price: "$165K to $395K", detail: "Architecture blueprint and multi-studio rollout. AAA to publisher scale. Payback period: 6 to 12 months." },
];

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
    "Under $1M":      "750000",
    "$1M to $10M":    "2500000",
    "$10M to $50M":   "10000000",
    "$50M to $200M":  "40000000",
    "$200M+":         "120000000",
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

export default function ROIModel({
  studioScale, outputType, budgetRange, outsourcePct, rdBudget, breakdown, onNext, onBack,
}: ROIModelProps) {

  const calcSrc = useMemo(() => {
    const params = new URLSearchParams({
      auto:          "1",
      studioType:    mapStudioType(studioScale, outputType),
      teamSize:      mapTeamSize(studioScale),
      budgetRangeVal: mapBudgetRange(budgetRange),
      outsourcePct,
      rdBudget,
      artPct:        String(breakdown.artPct),
      engPct:        String(breakdown.engPct),
      qaPct:         String(breakdown.qaPct),
      reworkCycles:  breakdown.reworkCycles,
      deliveryTime:  breakdown.deliveryTime,
      aiUsage:       breakdown.aiUsage,
      painPoints:    derivePainPoints(breakdown.artPct, breakdown.qaPct, breakdown.reworkCycles, outsourcePct),
    });
    return `/pipeline-calculator.html?${params.toString()}`;
  }, [studioScale, outputType, budgetRange, outsourcePct, rdBudget, breakdown]);

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

      {/* Efficiency Opportunity — inline calculator results */}
      <iframe
        key={calcSrc}
        src={calcSrc}
        id="roiCalcFrame"
        className="w-full rounded-xl border-none mb-6"
        style={{ minHeight: 600 }}
        scrolling="no"
      />

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
