import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { getScenario, getTopRisks } from "./personalisationData";

export { getTopRisks };

interface RiskScanProps {
  studioScale: string;
  outputType: string;
  onNext: () => void;
  onBack: () => void;
}

export default function RiskScan({ studioScale, outputType, onNext, onBack }: RiskScanProps) {
  const scenario = getScenario(studioScale, outputType);
  const [expanded, setExpanded] = useState<number[]>(scenario.defaultExpandedIds);

  const toggle = (id: number) =>
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );

  return (
    <div className="max-w-2xl" style={{ color: "white", fontSize: "14px" }}>
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
        {scenario.screen2Headline}
      </h2>
      <p className="text-sm text-white/70 font-body mb-6 leading-relaxed">
        Based on published data from studios your size. Click any risk to expand it, or keep going.
      </p>

      <div className="space-y-2 mb-8">
        {scenario.risks.map((risk) => {
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
                        {s.url ? (
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-white/70 underline underline-offset-2 transition-colors"
                          >
                            {s.label}
                          </a>
                        ) : (
                          s.label
                        )}
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
