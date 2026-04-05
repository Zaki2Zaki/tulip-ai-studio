import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { getScenario, getTopRisks } from "./personalisationData";
import type { BudgetBreakdown } from "@/pages/PipelineLabPage";

export { getTopRisks };

interface RiskScanProps {
  studioScale: string;
  outputType: string;
  breakdown: BudgetBreakdown;
  onBreakdownChange: (b: BudgetBreakdown) => void;
  onNext: () => void;
  onBack: () => void;
}

const HINT_ARROW = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 7h10M8 4l4 3-4 3" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SLIDER_STYLE: React.CSSProperties = {
  width: "100%",
  appearance: "none" as const,
  height: 4,
  borderRadius: 2,
  outline: "none",
  cursor: "pointer",
  background: "linear-gradient(90deg,#a78bfa,#c4b5fd,#e9d5ff)",
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

export default function RiskScan({ studioScale, outputType, breakdown, onBreakdownChange, onNext, onBack }: RiskScanProps) {
  const scenario = getScenario(studioScale, outputType);
  const [expanded, setExpanded] = useState<number[]>(scenario.defaultExpandedIds);
  const [showRisks, setShowRisks] = useState(false);
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const touch = (id: string) => setTouched((p) => new Set([...p, id]));

  const set = <K extends keyof BudgetBreakdown>(key: K, val: BudgetBreakdown[K]) =>
    onBreakdownChange({ ...breakdown, [key]: val });

  const toggle = (id: number) =>
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );

  const handleAnalyse = () => setShowRisks(true);

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
        className="font-display text-2xl md:text-3xl font-bold text-white mb-6"
        style={{ letterSpacing: "-0.02em" }}
      >
        How does your budget break down?
      </h2>

      {/* ── Budget breakdown form ── */}
      <div className="rounded-xl border border-border/30 bg-card/40 px-5 py-5 mb-6">
        <p className="text-[11px] font-body font-bold uppercase tracking-wider text-white/60 mb-5">
          Pipeline cost breakdown — approximate is fine
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
          {/* Art % */}
          <div>
            <p className="text-[11px] font-body font-bold uppercase tracking-wider text-white mb-2">
              Art and asset creation (%)
            </p>
            {!touched.has("artPct") && (
              <p className="flex items-center gap-1.5 text-[11px] font-medium text-primary/80 mb-1">
                {HINT_ARROW} Drag to adjust
              </p>
            )}
            <div
              className="text-center font-bold mb-1"
              style={{ fontSize: 17, background: "linear-gradient(90deg,#a78bfa,#c4b5fd,#e9d5ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              {breakdown.artPct}%
            </div>
            <input
              type="range" min={5} max={70} value={breakdown.artPct}
              style={SLIDER_STYLE}
              onChange={(e) => { set("artPct", Number(e.target.value)); touch("artPct"); }}
            />
            <div className="flex justify-between text-[11px] text-white/40 mt-1"><span>5%</span><span>70%</span></div>
          </div>

          {/* Eng % */}
          <div>
            <p className="text-[11px] font-body font-bold uppercase tracking-wider text-white mb-2">
              Engineering and tech (%)
            </p>
            {!touched.has("engPct") && (
              <p className="flex items-center gap-1.5 text-[11px] font-medium text-primary/80 mb-1">
                {HINT_ARROW} Drag to adjust
              </p>
            )}
            <div
              className="text-center font-bold mb-1"
              style={{ fontSize: 17, background: "linear-gradient(90deg,#a78bfa,#c4b5fd,#e9d5ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              {breakdown.engPct}%
            </div>
            <input
              type="range" min={5} max={60} value={breakdown.engPct}
              style={SLIDER_STYLE}
              onChange={(e) => { set("engPct", Number(e.target.value)); touch("engPct"); }}
            />
            <div className="flex justify-between text-[11px] text-white/40 mt-1"><span>5%</span><span>60%</span></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
          {/* QA % */}
          <div>
            <p className="text-[11px] font-body font-bold uppercase tracking-wider text-white mb-2">
              QA and testing (%)
            </p>
            {!touched.has("qaPct") && (
              <p className="flex items-center gap-1.5 text-[11px] font-medium text-primary/80 mb-1">
                {HINT_ARROW} Drag to adjust
              </p>
            )}
            <div
              className="text-center font-bold mb-1"
              style={{ fontSize: 17, background: "linear-gradient(90deg,#a78bfa,#c4b5fd,#e9d5ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              {breakdown.qaPct}%
            </div>
            <input
              type="range" min={2} max={30} value={breakdown.qaPct}
              style={SLIDER_STYLE}
              onChange={(e) => { set("qaPct", Number(e.target.value)); touch("qaPct"); }}
            />
            <div className="flex justify-between text-[11px] text-white/40 mt-1"><span>2%</span><span>30%</span></div>
          </div>

          {/* Rework cycles */}
          <div>
            <p className="text-[11px] font-body font-bold uppercase tracking-wider text-white mb-2">
              Rework or revision cycles per project
            </p>
            <select
              value={breakdown.reworkCycles}
              onChange={(e) => set("reworkCycles", e.target.value)}
              style={SELECT_STYLE}
            >
              <option value="2">1 to 2 cycles</option>
              <option value="4">3 to 5 cycles</option>
              <option value="8">6 to 10 cycles</option>
              <option value="14">10+ cycles</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
          {/* Delivery time */}
          <div>
            <p className="text-[11px] font-body font-bold uppercase tracking-wider text-white mb-2">
              Average project delivery time
            </p>
            <select
              value={breakdown.deliveryTime}
              onChange={(e) => set("deliveryTime", e.target.value)}
              style={SELECT_STYLE}
            >
              <option value="3">Under 6 months</option>
              <option value="12">6 to 18 months</option>
              <option value="24">18 to 36 months</option>
              <option value="42">36+ months</option>
            </select>
          </div>

          {/* AI usage */}
          <div>
            <p className="text-[11px] font-body font-bold uppercase tracking-wider text-white mb-2">
              Current AI tool usage
            </p>
            <select
              value={breakdown.aiUsage}
              onChange={(e) => set("aiUsage", e.target.value)}
              style={SELECT_STYLE}
            >
              <option value="none">No AI tools yet</option>
              <option value="experimental">Experimental only</option>
              <option value="partial">Some workflows integrated</option>
              <option value="governed">Governed pipeline strategy</option>
            </select>
          </div>
        </div>

        {!showRisks && (
          <button
            onClick={handleAnalyse}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-display font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Analyse my pipeline risk profile <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ── Risk results (shown after analysis) ── */}
      {showRisks && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/50 font-body font-semibold">
              Based on your pipeline breakdown
            </p>
          </div>

          <h3
            className="font-display text-xl font-bold text-white mb-2"
            style={{ letterSpacing: "-0.02em" }}
          >
            {scenario.screen2Headline}
          </h3>

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
                      <span className="text-[15px] font-body font-semibold text-white">{risk.title}</span>
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
                      <span className="text-white text-[10px]">{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </div>
                  {isOpen && (
                    <div className="mt-3 pl-7 text-left">
                      <p className="text-[15px] font-body text-white leading-relaxed mb-2">{risk.stat}</p>
                      <p className="text-[15px] font-body text-white italic">
                        {risk.sources.map((s, i) => (
                          <span key={i}>
                            {i > 0 && " · "}
                            {s.url ? (
                              <a
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
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
            <button onClick={onBack} className="text-xs text-white hover:text-white font-body transition-colors">
              ← Back
            </button>
          </div>
          <p className="text-[15px] text-white font-body mt-2">Based on your studio scale and the risks above</p>
        </>
      )}

      {!showRisks && (
        <button onClick={onBack} className="text-xs text-white hover:text-white font-body transition-colors mt-2">
          ← Back
        </button>
      )}
    </div>
  );
}
