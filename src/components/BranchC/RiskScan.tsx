import { useState } from "react";
import { ArrowRight } from "lucide-react";

interface RiskScanProps {
  studioScale: string;
  outputType: string;
  onNext: () => void;
  onBack: () => void;
}

export const RISKS = [
  {
    id: 1,
    impact: "High" as const,
    title: "Disconnected pipelines",
    stat: "$500K to $3M per rework cycle at AAA scale. Ten to thirty developers offline for three to seven days. Every time it happens.",
    source: "The True Cost of Rework in VFX 2022 · Griffin GP Game Development Report 2023",
  },
  {
    id: 2,
    impact: "High" as const,
    title: "Your competitors are already shipping more",
    stat: "Studios with integrated AI workflows produce 30 to 50% more content variation per release cycle. No additional headcount. Just a better pipeline.",
    source: "Tencent Hunyuan3D Pipeline Report 2024 · SP Studios Generative Environments 2024",
  },
  {
    id: 3,
    impact: "High" as const,
    title: "Manual texturing and rigging are your biggest budget sink",
    stat: "Over 70% of modeling budget goes to two stages that AI can compress by 40 to 70%. Your senior artists are spending most of their time on work that should be automated.",
    source: "Autodesk Redshift 2022 · MASV VFX Pipeline Guide 2023",
  },
  {
    id: 4,
    impact: "Medium" as const,
    title: "Unvetted AI tools break live services",
    stat: "An AI tool that fails in a development pipeline is an inconvenience. The same failure in a live service pipeline is a player-facing outage. The difference is an integration strategy.",
    source: "EA CTO technology strategy remit · Diversion.dev Version Control Survey 2024",
  },
  {
    id: 5,
    impact: "Medium" as const,
    title: "Fragmented adoption creates expensive dependencies",
    stat: "Adopting AI tools without a strategy does not save money. It creates vendor dependencies your team will pay to exit. Studios that move fast without a plan spend more fixing it than building it right the first time.",
    source: "Third Point Ventures AI Impact on Gaming and Media Tooling 2025",
  },
];

export function getDefaultExpanded(studioScale: string, outputType: string): number[] {
  const expanded = new Set<number>();

  if (studioScale === "Publisher / Multi-Studio") {
    [1, 2, 3, 4, 5].forEach((n) => expanded.add(n));
  } else if (studioScale === "AAA / Enterprise") {
    [1, 2, 4].forEach((n) => expanded.add(n));
  } else if (studioScale === "Mid-Size Studio") {
    [1, 3, 5].forEach((n) => expanded.add(n));
  } else if (studioScale === "Indie / Small Studio") {
    [3, 5].forEach((n) => expanded.add(n));
  }

  if (outputType === "VFX / Virtual Production") expanded.add(4);
  if (outputType === "3D Animation / Film") expanded.add(2);

  return Array.from(expanded);
}

export function getTopRisks(studioScale: string, outputType: string): typeof RISKS {
  const ids = getDefaultExpanded(studioScale, outputType);
  const topIds = ids.slice(0, 3);
  if (topIds.length === 0) return RISKS.slice(0, 3);
  return topIds.map((id) => RISKS.find((r) => r.id === id)!).filter(Boolean);
}

export default function RiskScan({ studioScale, outputType, onNext, onBack }: RiskScanProps) {
  const [expanded, setExpanded] = useState<number[]>(
    getDefaultExpanded(studioScale, outputType)
  );

  const toggle = (id: number) =>
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 mb-3">
        <p className="text-[10px] tracking-[0.2em] uppercase text-primary font-body font-semibold">
          Risk Scan
        </p>
        <span className="px-2 py-0.5 rounded-full bg-orange-400/15 border border-orange-400/30 text-[9px] font-display font-bold uppercase tracking-wider text-orange-400">
          Demo Only
        </span>
      </div>
      <h2
        className="font-display text-2xl md:text-3xl font-bold text-white mb-2"
        style={{ letterSpacing: "-0.02em" }}
      >
        From custom dev startups to indie and AAA studios, this is where the money is going.
      </h2>
      <p className="text-sm text-white/70 font-body mb-6 leading-relaxed">
        Based on published data from studios your size. Click any risk to expand it, or keep going.
      </p>

      <div className="space-y-2 mb-8">
        {RISKS.map((risk) => {
          const isOpen = expanded.includes(risk.id);
          return (
            <button
              key={risk.id}
              onClick={() => toggle(risk.id)}
              className="w-full text-left px-4 py-3 rounded-xl border border-border/30 bg-card/40 hover:border-border/50 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="text-base shrink-0 mt-0.5">⚠️</span>
                  <span className="text-sm font-body font-semibold text-white">{risk.title}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 mt-0.5">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded border ${
                      risk.impact === "High"
                        ? "text-red-400 bg-red-400/15 border-red-400/30"
                        : "text-amber-400 bg-amber-400/15 border-amber-400/30"
                    }`}
                  >
                    {risk.impact}
                  </span>
                  <span className="text-white/40 text-[10px]">{isOpen ? "▲" : "▼"}</span>
                </div>
              </div>
              {isOpen && (
                <div className="mt-3 pl-7 text-left">
                  <p className="text-sm font-body text-white leading-relaxed mb-2">{risk.stat}</p>
                  <p className="text-xs font-body text-white/40 italic">{risk.source}</p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-display font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          See My ROI Model <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button onClick={onBack} className="text-xs text-white/50 hover:text-white font-body transition-colors">
          ← Back
        </button>
      </div>
      <p className="text-xs text-white/35 font-body mt-2">Based on your studio scale and the risks above</p>
    </div>
  );
}
