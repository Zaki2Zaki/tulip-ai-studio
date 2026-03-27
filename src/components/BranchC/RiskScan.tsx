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
    exposure: "$500K to $3M+",
    stat: "Estimated $500K to $3M per rework cycle at AAA scale. Ten to thirty developers offline for three to seven days. Every time it happens.",
    sources: [
      { label: "Bloomberg / Jason Schreier, March 2026", url: "https://www.google.com/search?q=Jason+Schreier+Bloomberg+AAA+game+development+costs+2026" },
      { label: "BCG Video Gaming Report 2026", url: "https://www.google.com/search?q=BCG+Video+Gaming+Report+2026" },
    ],
  },
  {
    id: 2,
    impact: "High" as const,
    title: "Your competitors are already shipping more",
    exposure: "30 to 50% content gap",
    stat: "Studios with integrated AI workflows are already shipping significantly more content per release cycle. BCG estimates approximately 50% of studios now use AI — double the adoption rate of a year ago.",
    sources: [
      { label: "BCG Video Gaming Report 2026", url: "https://www.google.com/search?q=BCG+Video+Gaming+Report+2026" },
      { label: "Steam metadata analysis, BCG 2025", url: "https://www.google.com/search?q=BCG+Steam+metadata+analysis+gaming+AI+2025" },
    ],
  },
  {
    id: 3,
    impact: "High" as const,
    title: "Manual texturing and rigging are your biggest budget sink",
    exposure: "70% of modeling budget",
    stat: "68% of total studio expenditure is labour. The majority of that cost sits in asset creation workflows — the stages most directly compressible by AI integration. Your senior artists are spending most of their time on work that should be automated.",
    sources: [
      { label: "ESAC / Nordicity — The Canadian Video Game Industry 2021", url: "https://www.google.com/search?q=ESAC+Nordicity+Canadian+Video+Game+Industry+2021" },
      { label: "BCG Video Gaming Report 2026", url: "https://www.google.com/search?q=BCG+Video+Gaming+Report+2026" },
    ],
  },
  {
    id: 4,
    impact: "Medium" as const,
    title: "Unvetted AI tools break live services",
    exposure: "Live service outage risk",
    stat: "An AI tool failure in a live service pipeline can trigger a player-facing outage within hours of deployment. Live service outages cost studios $50K to $500K per hour in lost revenue and goodwill, plus $800 to $2,000 per hour in emergency engineering response — with no budget provision for either.",
    sources: [
      { label: "EA CTO technology strategy remit", url: "https://www.google.com/search?q=EA+CTO+technology+strategy+AI+integration+live+service" },
      { label: "Diversion.dev Version Control Survey 2024", url: "https://diversion.dev" },
    ],
  },
  {
    id: 5,
    impact: "Medium" as const,
    title: "Fragmented adoption creates expensive dependencies",
    exposure: "Vendor exit costs",
    stat: "Studios that adopt AI tools without a strategy pay twice: once to implement, once to exit. Vendor switching costs average 15 to 30% of total contract value. For a studio spending $200K per year on AI tooling, that is $30K to $60K in exit costs per vendor — before new implementation begins.",
    sources: [
      { label: "Third Point Ventures AI Impact on Gaming and Media Tooling 2025", url: "https://www.google.com/search?q=Third+Point+Ventures+AI+Impact+Gaming+Media+Tooling+2025" },
    ],
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

  // Fix 2: Risk 3 always expanded for animation/VFX output types
  if (outputType === "VFX / Virtual Production") {
    expanded.add(3);
    expanded.add(4);
  }
  if (outputType === "3D Animation / Film") {
    expanded.add(2);
    expanded.add(3);
  }

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
                  <p className="text-xs font-body text-white/40 italic">
                    {risk.sources.map((s, i) => (
                      <span key={i}>
                        {i > 0 && " · "}
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-white/70 underline underline-offset-2 transition-colors"
                        >
                          {s.label}
                        </a>
                      </span>
                    ))}
                  </p>
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
