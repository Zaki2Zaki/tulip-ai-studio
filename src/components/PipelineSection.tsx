import { motion, useInView, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { AlertTriangle, CheckCircle2, ArrowRight, Zap, TrendingUp, Clock, DollarSign, Layers, Rocket, Target, BarChart3, Compass, FlaskConical, ClipboardCheck, GitMerge, ChevronDown, Play } from "lucide-react";
import pipelineBg from "@/assets/pipeline-bg.jpg";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import currentWorkflow from "@/assets/current-workflow.jpg";
import genaiWorkflow from "@/assets/genai-workflow.png";

const problems = [
  { stat: "78%", icon: AlertTriangle, highlight: "pipelines issues weekly", text: "Of Game Dev & 3D + VFX animation studios face version control & pipeline issues weekly — driving delays from tool mismatches and integration failures." },
  { stat: "45%", icon: Clock, highlight: "1-hour per week lost", text: "Teams lose an average of 1 hour per week troubleshooting, wasting integration time & asset creation in unoptimized, siloed pipelines." },
  { stat: "$350K", icon: DollarSign, highlight: "per major rework cycle", text: "Per major rework/iteration cycle — asset pipeline fixes or build overhauls affecting 10–30 devs for 3–7 days.", sub: "AA Studios $100K–$400K  •  AAA Studios $500K–$3M+ per major rework/iteration cycle" },
];

const solutions = [
  { icon: Target, label: "Integrated AI Pipelines", desc: "Replace isolated tool experiments with production-grade AI systems embedded in your existing DCC stack." },
  { icon: Zap, label: "Automated Production Workflows", desc: "From concept art to game-ready assets — automated handoffs between Houdini, Unreal, Blender & AI models." },
  { icon: TrendingUp, label: "Rapid Iteration Systems", desc: "Generative environments for ICVFX cut iteration cycles from weeks to days with real-time AI feedback loops." },
  { icon: BarChart3, label: "Clear Value + ROI", desc: "Quantified benchmarks: 40-60% reduction in asset creation time, 3× faster environment prototyping." },
  { icon: Layers, label: "Scalable Infrastructure", desc: "End-to-end pipelines (Hunyuan3D, Sora-class models) that scale from indie teams to AAA studios." },
];

const pipelineSteps = [
  { icon: Compass, label: "Discover", desc: "Identify high-impact AI opportunities inside your existing pipeline." },
  { icon: FlaskConical, label: "Prototype", desc: "Rapidly test ideas under real-world production constraints." },
  { icon: ClipboardCheck, label: "Validate", desc: "Confirm what actually works (and what doesn't) before scaling." },
  { icon: GitMerge, label: "Integrate", desc: "Embed into industry tools like Unreal, Houdini, Blender, and Unity." },
  { icon: TrendingUp, label: "Scale", desc: "Enable teams, optimize workflows, and drive long-term adoption." },
];

const PAIN_POINTS = [
  "Version control conflicts",
  "Tool integration failures",
  "Slow asset iteration cycles",
  "Manual review bottlenecks",
  "No AI tooling in pipeline",
  "Siloed team workflows",
];

const PAIN_POINT_META: Record<string, { category: "A" | "B" | "C"; impact: "High" | "Medium" | "Low"; impactLevel: number }> = {
  "Version control conflicts":   { category: "B", impact: "Medium", impactLevel: 1 },
  "Tool integration failures":   { category: "A", impact: "High",   impactLevel: 0 },
  "Slow asset iteration cycles": { category: "B", impact: "Medium", impactLevel: 1 },
  "Manual review bottlenecks":   { category: "B", impact: "Low",    impactLevel: 2 },
  "No AI tooling in pipeline":   { category: "C", impact: "High",   impactLevel: 0 },
  "Siloed team workflows":       { category: "B", impact: "Medium", impactLevel: 1 },
};

const CATEGORY_META = {
  A: { label: "Tool Issues",          color: "text-red-400",   bg: "bg-red-400/10",   border: "border-red-400/30" },
  B: { label: "Workflow Restructure", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/30" },
  C: { label: "Learning Your Tools",  color: "text-blue-400",  bg: "bg-blue-400/10",  border: "border-blue-400/30" },
};

const CURRENT_TOOLS = [
  "Blender", "DaVinci Resolve", "ElevenLabs", "Houdini",
  "Kling AI", "Maya", "Midjourney", "Nuke",
  "Runway ML", "Stable Diffusion", "Unity", "Unreal Engine",
];

const WISHLIST_TOOLS = [
  "Adobe Firefly", "Claude AI", "ComfyUI", "Flux",
  "GPT-4o", "Hunyuan3D", "Leonardo AI", "Luma Dream Machine",
  "Meshy", "Pika", "Sora", "TripoSG",
];

const WorkflowBuilderPanel = ({
  stage,
  onStageChange,
  selected,
  onSelectedChange,
  tools,
  onToolsChange,
  deepDive,
  onDeepDiveChange,
  workshopAdded,
  onWorkshopAdd,
}: {
  stage: number;
  onStageChange: (s: number) => void;
  selected: string[];
  onSelectedChange: (v: string[]) => void;
  tools: string[];
  onToolsChange: (v: string[]) => void;
  deepDive: string[];
  onDeepDiveChange: (v: string[]) => void;
  workshopAdded: boolean;
  onWorkshopAdd: () => void;
}) => {
  const toggle = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const [otherTool, setOtherTool] = useState("");
  const otherToolTrim = otherTool.trim();

  const BackBtn = ({ to }: { to: number }) => (
    <button onClick={() => onStageChange(to)}
      className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors font-body mt-3">
      ← Back
    </button>
  );

  /* ── Stage –1: Intro ── */
  if (stage === -1) return (
    <div className="text-center py-4">
      <p className="text-[10px] tracking-[0.2em] uppercase text-primary font-body font-semibold mb-3">Interactive Demo</p>
      <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
        Build Production-Ready <span className="text-gradient-gold">Agentic Workflow</span>
      </h3>
      <p className="text-sm text-muted-foreground font-body mb-6 max-w-sm mx-auto">
        Walk through the Tulip R&D Pipeline™ and simulate building your own AI production system.
      </p>
      <button
        onClick={() => onStageChange(0)}
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-display font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        <Play className="w-3.5 h-3.5" /> Start Building →
      </button>
    </div>
  );

  /* ── Stage 0: Current Workflow ── */
  if (stage === 0) return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
        <span className="text-[10px] tracking-[0.2em] uppercase font-body font-semibold text-orange-400">Your Current Workflow</span>
      </div>
      <p className="font-display text-lg font-bold text-white mb-1">What's slowing your production pipeline?</p>
      <p className="text-xs text-muted-foreground font-body mb-4">Select all that apply — we'll map your bottlenecks.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-5">
        {PAIN_POINTS.map((pt) => {
          const on = selected.includes(pt);
          return (
            <button key={pt} onClick={() => onSelectedChange(toggle(selected, pt))}
              className={`text-left px-3 py-2.5 rounded-xl border text-xs font-body transition-all ${on ? "border-orange-400/60 bg-orange-400/10 text-orange-200" : "border-border/40 text-muted-foreground hover:border-border/70"}`}>
              <span className={`mr-1.5 ${on ? "text-orange-400" : "text-muted-foreground/30"}`}>{on ? "✕" : "○"}</span>
              {pt}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-4">
        <button disabled={selected.length === 0} onClick={() => onStageChange(1)}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-display font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed">
          Map the Problems <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <BackBtn to={-1} />
      </div>
    </div>
  );

  /* ── Stage 1: Discover ── */
  if (stage === 1) {
    const categorized: Record<"A" | "B" | "C", string[]> = { A: [], B: [], C: [] };
    const sortedSelected = [...selected].sort(
      // Low -> Medium -> High (impactLevel: High=0, Medium=1, Low=2)
      (a, b) => (PAIN_POINT_META[b]?.impactLevel ?? 1) - (PAIN_POINT_META[a]?.impactLevel ?? 1)
    );
    sortedSelected.forEach((pt) => {
      const cat = PAIN_POINT_META[pt]?.category ?? "B";
      categorized[cat].push(pt);
    });
    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
          <span className="text-[10px] tracking-[0.2em] uppercase font-body font-semibold text-primary">Discovery: Pain Points Mapped</span>
        </div>
        <p className="font-display text-lg font-bold text-white mb-1">
          AI identified <span className="text-gradient-gold">{selected.length} friction point{selected.length !== 1 ? "s" : ""}</span> in your pipeline
        </p>
        <p className="text-xs text-white/80 font-body mb-4">Select which to deep-dive — ordered Low → Highest impact.</p>

        {(["A", "B", "C"] as const).map((catKey) => {
          if (categorized[catKey].length === 0) return null;
          const cat = CATEGORY_META[catKey];
          return (
            <div key={catKey} className="mb-3">
              <div className="flex items-center gap-1.5 mb-2">
                <span className={`text-[9px] font-display font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${cat.bg} ${cat.border} ${cat.color}`}>
                  {cat.label}
                </span>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-3 mb-2 text-[9px] font-display font-bold tracking-wider uppercase">
                <span className="text-white/80">Friction Pain Points</span>
                <span className="text-white/80 text-right">Impact level</span>
              </div>
              <div className="space-y-1.5">
                {categorized[catKey].map((pt) => {
                  const meta = PAIN_POINT_META[pt];
                  const isSel = deepDive.includes(pt);
                  return (
                    <button key={pt} onClick={() => onDeepDiveChange(toggle(deepDive, pt))}
                      className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-body transition-all grid grid-cols-[1fr_auto] items-center gap-3 ${isSel ? "border-primary/50 bg-primary/10 text-foreground" : "border-border/30 text-white/80 hover:border-border/60"}`}>
                      <div className="flex items-center gap-2 min-w-0">
                        <AlertTriangle className={`w-3 h-3 shrink-0 ${isSel ? "text-orange-400" : "text-white/40"}`} />
                        <span className="truncate">{pt}</span>
                      </div>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded shrink-0 text-right ${meta?.impact === "High"
                        ? "text-red-400 bg-red-400/10"
                        : meta?.impact === "Medium"
                          ? "text-amber-400 bg-amber-400/10"
                          : "text-white/90 bg-white/10"
                      }`}>
                        {meta?.impact ?? "Medium"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        <p className="text-[10px] text-white/80 font-body mb-4 mt-1">
          {deepDive.length === 0 ? "Select friction points to deep-dive, or continue." : `${deepDive.length} selected for deep-dive`}
        </p>
        <div className="flex items-center gap-4">
          <button onClick={() => onStageChange(2)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-display font-semibold text-sm hover:opacity-90 transition-opacity">
            Start Prototyping <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <BackBtn to={0} />
        </div>
      </div>
    );
  }

  /* ── Stage 2: Prototype ── */
  if (stage === 2) return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
        <span className="text-[10px] tracking-[0.2em] uppercase font-body font-semibold text-primary">Prototype: Select AI Tools</span>
      </div>
      <p className="font-display text-lg font-bold text-white mb-1">Which tools will we test?</p>
      <p className="text-xs text-white/80 font-body mb-4">Select from your current pipeline or add to your wishlist.</p>

      <p className="text-[20px] font-display font-semibold uppercase tracking-wider text-white mb-2">Current Tools</p>
      <div className="grid grid-cols-2 gap-1.5 mb-4">
        {CURRENT_TOOLS.map((label) => {
          const on = tools.includes(label);
          return (
            <button key={label} onClick={() => onToolsChange(toggle(tools, label))}
              className={`text-left px-3 py-2 rounded-lg border text-xs font-body transition-all flex items-center gap-2 ${on ? "border-primary/60 bg-primary/10 text-foreground" : "border-border/30 text-white/80 hover:border-border/50"}`}>
              <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 text-[9px] font-bold leading-none ${on ? "bg-primary border-primary text-primary-foreground" : "border-border/50"}`}>
                {on ? "✓" : ""}
              </span>
              {label}
            </button>
          );
        })}
      </div>

      <p className="text-[20px] font-display font-semibold uppercase tracking-wider text-white mb-2">Wishlist</p>
      <div className="grid grid-cols-2 gap-1.5 mb-5">
        {WISHLIST_TOOLS.map((label) => {
          const on = tools.includes(label);
          return (
            <button key={label} onClick={() => onToolsChange(toggle(tools, label))}
              className={`text-left px-3 py-2 rounded-lg border text-xs font-body transition-all flex items-center gap-2 ${on ? "border-amber-400/60 bg-amber-400/10 text-foreground" : "border-border/30 text-white/80 hover:border-border/50"}`}>
              <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 text-[9px] font-bold leading-none ${on ? "bg-amber-400 border-amber-400 text-black" : "border-border/50"}`}>
                {on ? "✓" : ""}
              </span>
              {label}
            </button>
          );
        })}
      </div>

      {/* Other tool name */}
      <div className="px-4 py-3 rounded-xl bg-card/40 border border-border/30 mb-5">
        <p className="text-[20px] font-display font-semibold uppercase tracking-wider text-white mb-2">Other</p>
        <div className="flex items-center gap-2">
          <input
            value={otherTool}
            onChange={(e) => setOtherTool(e.target.value)}
            placeholder="Enter your tool name"
            className="flex-1 bg-secondary border border-border/40 rounded-lg px-3 py-2 text-sm font-body text-white placeholder:text-white/60 focus:outline-none focus:border-primary"
          />
          {otherToolTrim && tools.includes(otherToolTrim) ? (
            <button
              onClick={() => onToolsChange(tools.filter((t) => t !== otherToolTrim))}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/40 bg-secondary/40 text-xs font-display font-semibold text-white hover:bg-secondary/60 transition-colors"
            >
              Remove
            </button>
          ) : (
            <button
              disabled={!otherToolTrim}
              onClick={() => {
                if (!otherToolTrim) return;
                onToolsChange([...tools, otherToolTrim]);
                setOtherTool("");
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 bg-primary/10 text-xs font-display font-semibold text-white hover:bg-primary/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Add
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button disabled={tools.length === 0} onClick={() => onStageChange(3)}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-display font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed">
          Validate Results <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <BackBtn to={1} />
      </div>
    </div>
  );

  /* ── Stage 3: Validate ── */
  if (stage === 3) {
    const metrics = [
      { label: "Asset creation speed", value: 60, color: "hsl(var(--primary))" },
      { label: "Pipeline failure reduction", value: 85, color: "hsl(40 95% 70%)" },
      { label: "Iteration speed gain", value: 75, color: "hsl(160 70% 60%)" },
    ];
    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
          <span className="text-[10px] tracking-[0.2em] uppercase font-body font-semibold text-green-400">Validate: Benchmark Results</span>
        </div>
        <p className="font-display text-lg font-bold text-white mb-4">Simulated results for your configuration</p>
        <div className="space-y-4 mb-5">
          {metrics.map((m, i) => (
            <div key={m.label}>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs font-body text-foreground/80">{m.label}</span>
                <span className="text-xs font-body font-semibold" style={{ color: m.color }}>{m.value}% improvement</span>
              </div>
              <div className="h-1.5 rounded-full bg-border/30 overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ background: m.color }}
                  initial={{ width: 0 }} animate={{ width: `${m.value}%` }}
                  transition={{ duration: 1.2, delay: i * 0.2, ease: "easeOut" }} />
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 rounded-xl bg-green-400/5 border border-green-400/20 mb-4">
          <p className="text-xs font-body text-green-300">✓ Results confirmed for {tools.length > 0 ? tools.join(", ") : "your selected tools"}</p>
        </div>
        <div className="px-4 py-3 rounded-xl bg-black/70 border border-orange-400/25 mb-5 backdrop-blur-sm">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-orange-400 mb-1">Demonstration Only</p>
              <p className="text-xs font-body text-foreground/70">These are simulated benchmarks. An initial <strong className="text-foreground/90">1:1 Consultation</strong> is required for a deep-dive analysis and aligned expectations before any real integration begins.</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => onStageChange(4)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-display font-semibold text-sm hover:opacity-90 transition-opacity">
            Begin Integration <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <BackBtn to={2} />
        </div>
      </div>
    );
  }

  /* ── Stage 4: Integrate ── */
  if (stage === 4) {
    const checks = [
      "DCC tool connectors configured",
      "Asset handoff pipelines active",
      "Team access provisioned",
      "Running integration tests...",
    ];
    return (
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
          <span className="text-[10px] tracking-[0.2em] uppercase font-body font-semibold text-primary">Integrate: Embedding Into Your Stack</span>
          <span className="ml-1 px-2 py-0.5 rounded-full bg-orange-400/15 border border-orange-400/30 text-[9px] font-display font-bold uppercase tracking-wider text-orange-400">Demo Only</span>
        </div>
        <p className="text-[10px] font-body text-muted-foreground mb-3">This is a simulated walkthrough — real integration requires a scoped engagement.</p>
        <p className="font-display text-lg font-bold text-white mb-4">Connecting AI into your production tools</p>
        <div className="space-y-2 mb-5">
          {checks.map((c, i) => (
            <motion.div key={c} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.25 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-card/40 border border-border/30">
              {i < 3 ? (
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              ) : (
                <motion.div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent shrink-0"
                  animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
              )}
              <span className={`text-xs font-body ${i < 3 ? "text-foreground/90" : "text-primary"}`}>{c}</span>
            </motion.div>
          ))}
        </div>

        {/* Workshops CTA */}
        <div className={`px-4 py-3 rounded-xl border mb-5 transition-all duration-300 ${workshopAdded ? "bg-green-500/10 border-green-500/30" : "bg-primary/5 border-primary/20"}`}>
          {workshopAdded ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              <div>
                <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-green-400 mb-0.5">Added to Estimate</p>
                <p className="text-xs font-body text-foreground/70">Workshops &amp; Education has been added to your estimate builder below.</p>
              </div>
            </div>
          ) : (
            <>
              <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-primary mb-1">Empower Your Team</p>
              <p className="text-xs font-body text-foreground/75 mb-2.5">
                Workshops &amp; Education — certified training led by Unreal Educators &amp; VFX/Game-Developers to build AI creative skills across your team.
              </p>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("tulip:select-service", { detail: { id: "workshops" } }));
                  onWorkshopAdd();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-xs font-display font-semibold text-primary hover:bg-primary/20 transition-colors"
              >
                Add Workshops to Estimate <ArrowRight className="w-3 h-3" />
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => onStageChange(5)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-display font-semibold text-sm hover:opacity-90 transition-opacity">
            Scale Up <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <BackBtn to={3} />
        </div>
      </div>
    );
  }

  /* ── Stage 5: Scale / Complete ── */
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-green-400" />
        <span className="text-[10px] tracking-[0.2em] uppercase font-body font-semibold text-green-400">Scale: Production Ready</span>
      </div>
      <p className="font-display text-2xl md:text-3xl font-bold text-white mb-1">
        Your AI pipeline is <span className="text-gradient-gold">production‑ready.</span>
      </p>
      <p className="text-xs text-muted-foreground font-body mb-4">You've completed the Tulip R&D Pipeline™ demo.</p>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[["40–60%", "Faster asset creation"], ["3×", "Faster prototyping"], ["85%", "Fewer failures"]].map(([stat, lbl]) => (
          <div key={stat} className="p-3 rounded-xl bg-primary/5 border border-primary/10">
            <div className="font-display text-xl font-bold text-gradient-gold">{stat}</div>
            <div className="text-[10px] text-foreground/70 font-body mt-0.5">{lbl}</div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 rounded-xl bg-orange-400/5 border border-orange-400/20 text-left mb-5">
        <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-orange-400 mb-1">This was a simulation</p>
        <p className="text-xs font-body text-foreground/70">
          Real-world scaling requires a scoped discovery, team onboarding, and ongoing support.
          A <strong className="text-foreground/90">1:1 Consultation</strong> aligns expectations before any commitment.
        </p>
      </div>

      <div className="flex flex-col gap-2 items-center">
        <a href="#estimator"
          onClick={() => window.dispatchEvent(new CustomEvent("tulip:open-calendly"))}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-display font-semibold text-sm hover:opacity-90 transition-opacity">
          Book Discovery Call <ArrowRight className="w-3.5 h-3.5" />
        </a>
        <a href="#estimator"
          className="text-xs text-muted-foreground hover:text-foreground font-body transition-colors underline underline-offset-2">
          Or build your estimate first →
        </a>
      </div>
    </div>
  );
};

const ProvenStat = ({
  icon: Icon,
  target,
  suffix = "",
  prefix = "",
  label,
  delay = 0,
}: {
  icon: React.ElementType;
  target: number;
  suffix?: string;
  prefix?: string;
  label: string;
  delay?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, target, { duration: 1.6, delay, ease: "easeOut" });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [inView, target, delay, count, rounded]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center gap-2">
      <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <span className="font-display text-2xl md:text-3xl font-bold text-gradient-gold">
        {prefix}{display}{suffix}
      </span>
      <p className="text-xs text-foreground/80 font-body leading-snug">{label}</p>
    </div>
  );
};

const PipelineSection = () => {
  const ref = useRef(null);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [sliderPos, setSliderPos] = useState(50);
  const [handleY, setHandleY] = useState(80);

  const [workflowStage, setWorkflowStage] = useState(-1);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const workflowShownRef = useRef(false);
  const [workflowSelected, setWorkflowSelected] = useState<string[]>([]);
  const [workflowTools, setWorkflowTools] = useState<string[]>([]);
  const [workflowDeepDive, setWorkflowDeepDive] = useState<string[]>([]);
  const [workshopAdded, setWorkshopAdded] = useState(false);

  const handlePositionChange = useCallback((pos: number) => {
    setSliderPos(pos);
  }, []);

  // Drive handle Y position from page scroll within this section
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) { setHandleY(50); return; }
      // Only start driving handle once user has scrolled into the section
      if (rect.top > 0) return;
      const pct = Math.max(10, Math.min(93, ((-rect.top) / scrollable) * 100));
      setHandleY(pct);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Show workflow builder 3s after proven results finish animating (~6s after solutions panel appears)
  const showSolutionsRef = useRef(false);
  useEffect(() => {
    const showSolutions = sliderPos < 45;
    if (!showSolutions || workflowShownRef.current) return;
    showSolutionsRef.current = true;
    const t = setTimeout(() => {
      setShowWorkflow(true);
      workflowShownRef.current = true;
    }, 5500);
    return () => clearTimeout(t);
  }, [sliderPos]);

  const showProblems = sliderPos > 55;
  const showSolutions = sliderPos < 45;

  return (
    <section id="pipeline" ref={sectionRef} className="relative pt-6 pb-24 md:pb-32 overflow-hidden">
      <div className="absolute inset-0">
        <img src={pipelineBg} alt="" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      </div>

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto section-padding">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-[11px] tracking-[0.2em] uppercase text-primary font-body mb-3 text-center font-medium"
        >
          3D Production Pipeline
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-display text-3xl md:text-5xl font-bold text-center mb-4"
        >
          AI across <span className="text-gradient-gold">every stage</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="text-center max-w-xl mx-auto mb-10 text-muted-foreground font-body text-sm"
        >
          We identify where generative AI creates the most impact in your content production pipelines — from pre-production through final output.
        </motion.p>

        {/* Drag hint — above slider */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mb-4 text-sm font-body text-white"
        >
          ← Drag to explore problems &amp; solutions →
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <BeforeAfterSlider
            beforeImage={genaiWorkflow}
            afterImage={currentWorkflow}
            beforeLabel="GenAI Tools + Workflow"
            afterLabel="Current Workflow"
            onPositionChange={handlePositionChange}
            handleY={handleY}
          />
          <p className="max-w-xl mx-auto mt-6 text-sm text-muted-foreground font-body text-center leading-relaxed">
            Startup AI tools are reshaping every stage of the pipeline — we help integrate the explosion of AI tools into production pipelines for creative studios.
          </p>
        </motion.div>

        {/* Dynamic Content Panels */}
        <div className="mt-12 min-h-[280px]">
          <AnimatePresence mode="wait">
            {showProblems && (
              <motion.div key="problems" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }} className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2.5 mb-6">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <span className="text-[11px] tracking-[0.2em] uppercase font-body font-semibold text-destructive">The Experimentation Gap</span>
                </div>
                <div className="space-y-4">
                  {problems.map((p, i) => (
                    <motion.div key={p.stat} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1, duration: 0.4 }} className="flex flex-col md:flex-row items-start gap-4 md:gap-6 p-5 rounded-2xl bg-card/30 border border-border/30 backdrop-blur-sm">
                      <div className="flex items-center gap-2.5 shrink-0">
                        <p.icon className="w-4 h-4 text-destructive/60" />
                        <span className="font-display text-3xl md:text-4xl font-bold text-gradient-gold">{p.stat}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-foreground/90 font-body leading-relaxed">
                          {p.text.split(p.highlight).map((part, j, arr) => (
                            <span key={j}>{part}{j < arr.length - 1 && <strong className="text-destructive font-semibold">{p.highlight}</strong>}</span>
                          ))}
                        </p>
                        {p.sub && <p className="text-base md:text-lg text-white font-body font-medium">{p.sub}</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-4 text-xs text-muted-foreground font-body text-center">
                  Source:{" "}
                  <a href="https://arxiv.org/abs/2204.11191" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground transition-colors">
                    An Empirical Study of Delayed Games on Steam, arXiv:2204.11191
                  </a>
                </motion.p>
              </motion.div>
            )}

            {showSolutions && (
              <motion.div key="solutions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }} className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2.5 mb-6">
                  <Rocket className="w-4 h-4 text-primary" />
                  <span className="text-[11px] tracking-[0.2em] uppercase font-body font-semibold text-primary">The Execution Reality</span>
                </div>

                {/* Solutions */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8 p-6 rounded-2xl bg-card/30 border border-border/30 backdrop-blur-sm">
                  <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-1">
                    From Experimentation <span className="text-gradient-gold">→ Execution</span>
                  </h3>
                  <p className="text-xs text-muted-foreground font-body mb-5">Transitioning from "AI as a toy" to "AI as a tool."</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {solutions.map((s, i) => (
                      <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }} className="flex items-start gap-3">
                        <div className="mt-0.5 p-1.5 rounded-lg bg-primary/8 border border-primary/15">
                          <s.icon className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-body font-semibold text-foreground">{s.label}</p>
                          <p className="text-xs text-muted-foreground font-body leading-relaxed mt-0.5">{s.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* R&D Pipeline Steps */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 rounded-2xl bg-card/30 border border-border/30 backdrop-blur-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-2">
                    <div>
                      <h3 className="font-display text-2xl md:text-4xl font-bold text-white leading-tight">
                        The Tulip R&D <span className="text-gradient-gold">Pipeline™</span> <ArrowRight className="inline w-5 h-5 text-primary ml-1" />
                      </h3>
                      <p className="text-xs text-muted-foreground font-body mt-1">
                        From idea to working system to team adoption
                      </p>
                    </div>
                    <span className="text-[9px] tracking-[0.15em] uppercase font-body text-muted-foreground border border-border/40 rounded-full px-2.5 py-1 self-start shrink-0">v4.2</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {pipelineSteps.map((step, i) => {
                      const activeIdx = workflowStage >= 1 ? workflowStage - 1 : -1;
                      const isActive = activeIdx === i;
                      const isCompleted = workflowStage > 1 && i < workflowStage - 1;
                      return (
                        <motion.div key={step.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.06 }} className="flex flex-col items-center text-center gap-1.5">
                          <div className={`relative w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-500 ${isActive ? "border-primary bg-primary/20 shadow-[0_0_18px_hsl(var(--primary)/0.55)]" : isCompleted ? "border-green-500/50 bg-green-500/10" : "border-primary/30 bg-primary/8"}`}>
                            {isCompleted ? (
                              <CheckCircle2 className="text-green-400" size={18} />
                            ) : (
                              <step.icon className={`transition-colors duration-300 ${isActive ? "text-primary" : "text-primary/60"}`} size={18} />
                            )}
                          </div>
                          {isActive && (
                            <motion.div animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.1 }}>
                              <ChevronDown className="w-3 h-3 text-primary -mt-1" />
                            </motion.div>
                          )}
                          <p className={`text-xs font-body font-semibold transition-colors ${isActive ? "text-primary" : isCompleted ? "text-green-400" : "text-foreground"}`}>{step.label}</p>
                          <p className="text-[10px] text-muted-foreground font-body leading-snug">{step.desc}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Workflow Builder — appears 3s after Proven Results completes */}
                <AnimatePresence>
                  {showWorkflow && (
                    <motion.div
                      key="workflow-builder"
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="mt-6 p-6 rounded-2xl bg-card/30 border border-primary/20 backdrop-blur-sm"
                      style={{ boxShadow: "0 0 40px hsl(var(--primary) / 0.08)" }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div key={workflowStage} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
                          <WorkflowBuilderPanel
                            stage={workflowStage}
                            onStageChange={setWorkflowStage}
                            selected={workflowSelected}
                            onSelectedChange={setWorkflowSelected}
                            tools={workflowTools}
                            onToolsChange={setWorkflowTools}
                            deepDive={workflowDeepDive}
                            onDeepDiveChange={setWorkflowDeepDive}
                            workshopAdded={workshopAdded}
                            onWorkshopAdd={() => setWorkshopAdded(true)}
                          />
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quantitative proof */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-6 p-5 rounded-2xl bg-primary/5 border border-primary/10 backdrop-blur-sm">
                  <p className="text-[10px] tracking-[0.15em] uppercase font-body font-semibold text-primary mb-4">Proven Results</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <ProvenStat icon={Clock} target={60} suffix="%" prefix="Up to " label="Reduction in asset creation time" delay={0.65} />
                    <ProvenStat icon={Rocket} target={3} suffix="×" label="Faster environment prototyping" delay={0.75} />
                    <ProvenStat icon={CheckCircle2} target={85} suffix="%" label="Fewer pipeline integration failures" delay={0.85} />
                  </div>
                  <p className="mt-4 text-[10px] text-muted-foreground font-body text-center">
                    Sources: Generative Environments for ICVFX (SP Studios) • Hunyuan3D Pipeline (Tencent) • Democratization of VFX via GenAI (UWL Research)
                  </p>
                </motion.div>
              </motion.div>
            )}

            {!showProblems && !showSolutions && (
              <motion.div key="neutral" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="text-center py-12">
                <p className="text-sm text-muted-foreground font-body">Drag the slider left or right to explore</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default PipelineSection;
