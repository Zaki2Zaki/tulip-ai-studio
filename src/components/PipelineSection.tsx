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
  "GenAI adoption & team resistance",
  "High rendering & production costs",
];

const PAIN_POINT_META: Record<string, { category: "A" | "B" | "C" | "D" | "E"; impact: "High" | "Medium" | "Low"; impactLevel: number }> = {
  "Version control conflicts":          { category: "B", impact: "Medium", impactLevel: 1 },
  "Tool integration failures":          { category: "A", impact: "High",   impactLevel: 0 },
  "Slow asset iteration cycles":        { category: "B", impact: "Medium", impactLevel: 1 },
  "Manual review bottlenecks":          { category: "B", impact: "Low",    impactLevel: 2 },
  "No AI tooling in pipeline":          { category: "C", impact: "High",   impactLevel: 0 },
  "Siloed team workflows":              { category: "B", impact: "Medium", impactLevel: 1 },
  "GenAI adoption & team resistance":   { category: "D", impact: "High",   impactLevel: 0 },
  "High rendering & production costs":  { category: "E", impact: "High",   impactLevel: 0 },
};

const CATEGORY_META = {
  A: { label: "Tool Issues",          color: "text-red-400",    bg: "bg-red-400/10",    border: "border-red-400/30"    },
  B: { label: "Workflow Restructure", color: "text-amber-400",  bg: "bg-amber-400/10",  border: "border-amber-400/30"  },
  C: { label: "Learning Your Tools",  color: "text-blue-400",   bg: "bg-blue-400/10",   border: "border-blue-400/30"   },
  D: { label: "Adoption & Training",  color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/30" },
  E: { label: "Cost Optimisation",    color: "text-green-400",  bg: "bg-green-400/10",  border: "border-green-400/30"  },
};

const CURRENT_TOOLS = [
  "Blender", "DaVinci Resolve", "ElevenLabs", "Houdini",
  "Kling AI", "Maya", "Nuke",
  "Runway ML", "Stable Diffusion", "Unity", "Unreal Engine",
];

const WISHLIST_TOOLS = [
  "Adobe Firefly", "Claude AI", "ComfyUI",
  "GPT-4o", "Grok", "Hunyuan3D", "Leonardo AI", "Luma Dream Machine",
  "Meshy", "Pika", "TripoSG",
];

// Maps each pain point → recommended service IDs + reason shown on Validate screen
const DEEP_DIVE_SERVICE_MAP: Record<string, { serviceIds: string[]; tags: string[]; reason: string }> = {
  "No AI tooling in pipeline":   { serviceIds: ["research", "benchmarking", "workshops"], tags: ["GenAI Research", "Tool Benchmarking", "Workshops & Education"], reason: "Identify the right tools to adopt, then train your team" },
  "Tool integration failures":   { serviceIds: ["benchmarking", "demos", "integration"],  tags: ["Tool Benchmarking", "Demos & Sandboxes", "Adoption & Integration"], reason: "Test & validate the right tool connections for your stack" },
  "Manual review bottlenecks":   { serviceIds: ["research", "integration"],               tags: ["GenAI Research", "Adoption & Integration"],                    reason: "AI-assisted review workflows reduce approval delays" },
  "Version control conflicts":   { serviceIds: ["architecture", "integration"],           tags: ["Architecture Blueprint", "Adoption & Integration"],            reason: "Design a pipeline architecture that prevents conflicts" },
  "Slow asset iteration cycles":        { serviceIds: ["integration", "architecture", "demos"],    tags: ["Adoption & Integration", "Architecture Blueprint", "Demos & Sandboxes"],    reason: "Automate handoffs to compress iteration loops" },
  "Siloed team workflows":              { serviceIds: ["architecture", "workshops", "demos"],       tags: ["Architecture Blueprint", "Workshops & Education", "Demos & Sandboxes"],       reason: "Unified pipeline design and team-wide enablement" },
  "Siloed teams and slow approvals":    { serviceIds: ["architecture", "workshops", "demos"],       tags: ["Architecture Blueprint", "Workshops & Education", "Demos & Sandboxes"],       reason: "Unified pipeline design and team-wide enablement" },
  "GenAI adoption & team resistance":   { serviceIds: ["workshops", "research", "integration"],    tags: ["Workshops & Education", "GenAI Research", "Adoption & Integration"],           reason: "Build team confidence and embed GenAI into daily practice" },
  "High rendering & production costs":  { serviceIds: ["architecture", "benchmarking", "research"], tags: ["Architecture Blueprint", "Tool Benchmarking", "GenAI Research"],              reason: "Identify cost-cutting AI substitutions across your render pipeline" },
};

const DISCOVER_SOURCES = [
  { id: 1, label: "Third Point Ventures", title: "AI Impact on Gaming and Media Tooling", year: "2025", url: "https://www.thirdpointventures.com/currents/AI-impact-on-gaming-and-media-tooling/" },
  { id: 2, label: "Diversion.dev", title: "Version Control Survey for Game Dev & Creative Industries", year: "2024", url: "https://www.diversion.dev/blog/survey-results-2024-version-control-for-game-dev-creative-industries---virtualproduction-archviz-xr" },
  { id: 3, label: "Griffin GP", title: "2023 Game Development Report", year: "2023", url: "https://griffingp.com/wp-content/uploads/2024/02/2023-Game-Development-Report.pdf" },
  { id: 4, label: "GameDev Reports", title: "Video Game Insights: The Big Game Engine Report of 2025", year: "February 10, 2025", url: "" },
];

const FRICTION_POINTS: { title: string; category: string; impact: "High" | "Medium" | "Low"; costStat: string | null; savingStat: string | null; cite: string }[] = [
  { title: "Tool integration failures",       category: "Tool Issues",          impact: "High",   costStat: "AA studios lose $100K–$400K per rework cycle",                      savingStat: null,                                                   cite: "[2,3]" },
  { title: "No AI tooling in pipeline",       category: "Learning Your Tools",  impact: "High",   costStat: "40–50% of workflow time lost to exports & manual fixes",            savingStat: "GenAI compresses asset pipeline: 100 hrs → 15–30 min*",  cite: "[1,3]" },
  { title: "GenAI adoption & team resistance",category: "Adoption & Training",  impact: "High",   costStat: "Only 16% of studios actively using GenAI in pipelines",             savingStat: null,                                                   cite: "[1]"   },
  { title: "High rendering & production costs",category: "Cost Optimisation",   impact: "High",   costStat: "Production stage = 40–60% of total project budget",                 savingStat: "Real-time rendering engines drastically reduce revision overhead", cite: "[1]" },
  { title: "Version control conflicts",       category: "Workflow Restructure", impact: "Medium", costStat: "78% of studios face version control & pipeline issues weekly",       savingStat: null,                                                   cite: "[2]"   },
  { title: "Slow asset iteration cycles",     category: "Workflow Restructure", impact: "Medium", costStat: "$350K avg per rework cycle — 10–30 devs over 3–7 days",             savingStat: "GenAI reduces iteration from 100 hrs → 15–30 min*",      cite: "[3]"   },
  { title: "Siloed teams and slow approvals", category: "Workflow Restructure", impact: "Medium", costStat: "45% of devs lose 1+ hr/week to silo troubleshooting",               savingStat: null,                                                   cite: "[2,3]" },
  { title: "Manual review bottlenecks",       category: "Workflow Restructure", impact: "Low",    costStat: "AAA studios: $500K–$3M+ per major pipeline overhaul",               savingStat: null,                                                   cite: "[3]"   },
];

const getRecommendedServiceIds = (deepDive: string[]): string[] => {
  const ids = new Set<string>();
  deepDive.forEach((pt) => {
    DEEP_DIVE_SERVICE_MAP[pt]?.serviceIds.forEach((id) => ids.add(id));
  });
  if (ids.size === 0) ids.add("research"); // sensible default
  return Array.from(ids);
};

// Simple Icons CDN: cdn.simpleicons.org/{slug}/{hex} — brand color used when specified, else white
// url: direct brand asset URL; invert: true flips black logos to white on dark bg
// Initials badge fallback for tools not covered by any public logo source
type LogoEntry =
  | { icon: string; color?: string }   // color overrides the default white
  | { url: string; invert?: boolean }
  | { initials: string; color: string };

const TOOL_LOGOS: Record<string, LogoEntry> = {
  // ── Current Tools ──
  "Blender":            { icon: "blender",       color: "E87D0D" }, // Blender orange
  "DaVinci Resolve":    { icon: "davinciresolve" },                  // white — brand dark blue too dark
  "ElevenLabs":         { icon: "elevenlabs",    color: "F97316" }, // orange
  "Houdini":            { icon: "houdini",       color: "FF6B35" }, // Houdini orange
  "Kling AI":           { initials: "K",  color: "#8B5CF6" },
  "Maya":               { icon: "autodeskmaya",  color: "0696D7" }, // Autodesk Maya blue
  "Nuke":               { icon: "nuke",          color: "64D2FF" }, // Nuke cyan
  "Runway ML":          { icon: "runway" },                          // white — Runway's brand
  "Stable Diffusion":   { icon: "stabilityai",   color: "A78BFA" }, // Stability purple
  "Unity":              { icon: "unity" },                           // white
  "Unreal Engine":      { icon: "unrealengine" },                    // white — brand near-black too dark
  // ── Wishlist Tools ──
  "Adobe Firefly":      { url: "https://commons.wikimedia.org/w/index.php?title=Special:FilePath&file=Adobe_Firefly_wordmark.svg", invert: false },
  "Claude AI":          { url: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Claude_AI_logo.svg" },
  "ComfyUI":            { url: "https://framerusercontent.com/images/3cNQMWKzIhIrQ5KErBm7dSmbd2w.png" },
  "GPT-4o":             { icon: "openai" },
  "Grok":               { icon: "xai" },                             // white
  "Hunyuan3D":          { url: "https://cdn-avatars.huggingface.co/v1/production/uploads/5dd96eb166059660ed1ee413/Lp3m-XLpjQGwBItlvn69q.png" },
  "Leonardo AI":        { icon: "leonardo",      color: "F9A03F" },
  "Luma Dream Machine": { url: "https://lumalabs.ai/images/brand/luma-ai/logo-black.svg", invert: true },
  "Meshy":              { url: "https://www.meshy.ai/meshy-avatar.png" },
  "Pika":               { url: "https://pika.art/favicon.ico", invert: true },
  "TripoSG":            { url: "https://cdn-web.tripo3d.ai/tripo-web/logo/tripo-logo1.webp", invert: true },
};

const ToolLogo = ({ label }: { label: string }) => {
  const logo = TOOL_LOGOS[label];
  if (!logo) return null;
  if ("icon" in logo) {
    return (
      <img
        src={`https://cdn.simpleicons.org/${logo.icon}/${logo.color ?? "ffffff"}`}
        alt=""
        width={16}
        height={16}
        className="w-4 h-4 shrink-0 object-contain opacity-90"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    );
  }
  if ("url" in logo) {
    return (
      <img
        src={logo.url}
        alt=""
        width={16}
        height={16}
        className="w-4 h-4 shrink-0 object-contain opacity-90"
        style={logo.invert ? { filter: "brightness(0) invert(1)" } : undefined}
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    );
  }
  return (
    <span
      className="w-5 h-5 rounded text-[8px] font-bold shrink-0 flex items-center justify-center"
      style={{ background: logo.color + "25", color: logo.color, border: `1px solid ${logo.color}50` }}
    >
      {logo.initials}
    </span>
  );
};

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
      <p className="text-sm text-white font-body mb-6 max-w-sm mx-auto">
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
      <p className="text-xs text-white font-body mb-4">Select all that apply — we'll map your bottlenecks.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        {PAIN_POINTS.map((pt) => {
          const on = selected.includes(pt);
          return (
            <button key={pt} onClick={() => onSelectedChange(toggle(selected, pt))}
              className={`text-left px-3 py-3 rounded-xl border text-xs font-body transition-all flex items-start gap-1.5 ${on ? "border-orange-400/60 bg-orange-400/10 text-orange-200" : "border-border/40 text-white hover:border-border/70"}`}>
              <span className={`shrink-0 mt-0.5 ${on ? "text-orange-400" : "text-white/30"}`}>{on ? "✕" : "○"}</span>
              <span>{pt}</span>
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
    const catColor: Record<string, string> = {
      "Tool Issues":          "text-red-400",
      "Learning Your Tools":  "text-blue-400",
      "Adoption & Training":  "text-purple-400",
      "Cost Optimisation":    "text-green-400",
      "Workflow Restructure": "text-amber-400",
    };
    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
          <span className="text-[10px] tracking-[0.2em] uppercase font-body font-semibold text-primary">Discovery: Pain Points Mapped</span>
        </div>
        <p className="font-display text-lg font-bold text-white mb-1">
          We mapped <span className="text-gradient-gold">{FRICTION_POINTS.length} friction points</span> in your pipeline
        </p>
        <p className="text-xs text-white/70 font-body mb-4">Select rows to flag for deep-dive — click any row to mark it.</p>

        {/* Friction points list */}
        <div className="rounded-xl border border-border/30 overflow-hidden mb-3">
          <div className="grid grid-cols-[1fr_auto] items-center px-3 py-2 bg-white/5 border-b border-border/30">
            <span className="text-xs font-display font-bold tracking-wider uppercase text-white">Friction Pain Point</span>
            <span className="text-xs font-display font-bold tracking-wider uppercase text-white">Impact</span>
          </div>
          {FRICTION_POINTS.map((point, i) => {
            const isSel = deepDive.includes(point.title);
            return (
              <button key={point.title} onClick={() => onDeepDiveChange(toggle(deepDive, point.title))}
                className={`w-full text-left px-3 py-3 flex items-start gap-3 transition-all ${i < FRICTION_POINTS.length - 1 ? "border-b border-border/20" : ""} ${isSel ? "bg-primary/10" : "hover:bg-white/5"}`}>
                <span className="text-base shrink-0 mt-0.5">⚠️</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-body text-white font-semibold block">{point.title}</span>
                  <span className={`text-xs font-display font-semibold ${catColor[point.category] ?? "text-amber-400"}`}>{point.category}</span>
                  {point.costStat && (
                    <p className="text-xs text-white/60 font-body mt-1">
                      {point.costStat}
                      <span className="text-white/35 ml-1">{point.cite}</span>
                    </p>
                  )}
                  {point.savingStat && (
                    <p className="text-xs text-green-400/80 font-body mt-0.5">✦ {point.savingStat}</p>
                  )}
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded shrink-0 border mt-0.5 ${
                  point.impact === "High"   ? "text-red-400 bg-red-400/15 border-red-400/30" :
                  point.impact === "Medium" ? "text-amber-400 bg-amber-400/15 border-amber-400/30" :
                                              "text-white/70 bg-white/10 border-white/20"
                }`}>
                  {point.impact}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footnote */}
        <p className="text-[10px] text-white/35 font-body mb-4 px-1 leading-relaxed">
          * Based on AI-assisted production pipelines. Sources: Autodesk Redshift (2022), MASV "The Ultimate Guide to VFX Pipelines" (2023), Epic Games "Virtual Production Field Guide" (2021), Foundry VFX Pipeline Insights.
        </p>

        {/* Budget-at-risk box */}
        <div className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 mb-3">
          <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-red-400 mb-1">Estimated Budget at Risk</p>
          <p className="text-xs font-body text-white/80 mb-1">
            Studios with these friction points lose{" "}
            <span className="text-red-400 font-semibold">$350K–$3M+</span> per major rework cycle.
          </p>
          <p className="text-xs font-body text-green-400/80">
            ✦ Integrating GenAI across your pipeline can recover up to 60–85% of that loss.
          </p>
        </div>

        {/* Sources strip */}
        <div className="rounded-xl border border-border/20 bg-white/[0.02] px-4 py-3 mb-5">
          <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-white/35 mb-2">Sources</p>
          <div className="space-y-1">
            {DISCOVER_SOURCES.map((s) => (
              <p key={s.id} className="text-[10px] font-body text-white/40 leading-relaxed">
                <span className="text-white/55 font-semibold">[{s.id}]</span>{" "}
                <strong className="text-white/50">{s.label}</strong> — {s.title}, {s.year}.
                {s.url && (
                  <a href={s.url} target="_blank" rel="noopener noreferrer"
                    className="text-primary/60 hover:text-primary ml-1 transition-colors">↗</a>
                )}
              </p>
            ))}
          </div>
        </div>

        <p className="text-sm text-white font-body mb-4">
          {deepDive.length === 0 ? "Select rows to flag for deep-dive, or continue." : `${deepDive.length} flagged for deep-dive`}
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
      <p className="font-display text-lg font-bold text-white mb-1">Which tools are in your pipeline?</p>
      <p className="text-xs text-white/80 font-body mb-4">Select from your current pipeline or add to your wishlist.</p>

      <p className="text-[20px] font-display font-semibold uppercase tracking-wider text-white mb-2">Current Tools</p>
      <div className="grid grid-cols-2 gap-1.5 mb-4">
        {CURRENT_TOOLS.map((label) => {
          const on = tools.includes(label);
          return (
            <button key={label} onClick={() => onToolsChange(toggle(tools, label))}
              className={`text-left px-3 py-2 rounded-lg border text-xs font-body transition-all flex items-center justify-between gap-2 ${on ? "border-primary/60 bg-primary/10 text-foreground" : "border-border/30 text-white/80 hover:border-border/50"}`}>
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 text-[9px] font-bold leading-none ${on ? "bg-primary border-primary text-primary-foreground" : "border-border/50"}`}>
                  {on ? "✓" : ""}
                </span>
                <span className="truncate">{label}</span>
              </div>
              <ToolLogo label={label} />
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
              className={`text-left px-3 py-2 rounded-lg border text-xs font-body transition-all flex items-center justify-between gap-2 ${on ? "border-amber-400/60 bg-amber-400/10 text-foreground" : "border-border/30 text-white/80 hover:border-border/50"}`}>
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 text-[9px] font-bold leading-none ${on ? "bg-amber-400 border-amber-400 text-black" : "border-border/50"}`}>
                  {on ? "✓" : ""}
                </span>
                <span className="truncate">{label}</span>
              </div>
              <ToolLogo label={label} />
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
    const allPresets = [...CURRENT_TOOLS, ...WISHLIST_TOOLS];
    const customTools = tools.filter((t) => !allPresets.includes(t));
    const selectedCurrentTools = tools.filter((t) => CURRENT_TOOLS.includes(t));
    const selectedWishlistTools = tools.filter((t) => WISHLIST_TOOLS.includes(t));
    const metrics = [
      { label: "Asset creation speed", value: 60, color: "hsl(var(--primary))" },
      { label: "Pipeline failure reduction", value: 85, color: "hsl(40 95% 70%)" },
      { label: "Iteration speed gain", value: 75, color: "hsl(160 70% 60%)" },
    ];
    const recommendedIds = getRecommendedServiceIds(deepDive);
    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
          <span className="text-[10px] tracking-[0.2em] uppercase font-body font-semibold text-green-400">Validate: Benchmark Results</span>
          <span className="ml-1 px-2 py-0.5 rounded-full bg-orange-400/15 border border-orange-400/30 text-[9px] font-display font-bold uppercase tracking-wider text-orange-400">Demo Only</span>
        </div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <p className="font-display text-lg font-bold text-white">Simulated results for your configuration</p>
          <a href="/benchmark-methodology.html" target="_blank" rel="noopener noreferrer"
            className="shrink-0 text-xs font-body font-medium text-green-400 border border-green-400/40 bg-green-400/8 hover:bg-green-400/15 px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors">
            View Methodology ↗
          </a>
        </div>
        <div className="space-y-4 mb-5">
          {metrics.map((m, i) => (
            <div key={m.label}>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs font-body text-white/80">{m.label}</span>
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

        {/* Selected tools recap */}
        {(selectedCurrentTools.length > 0 || selectedWishlistTools.length > 0) && (
          <div className="rounded-xl border border-border/30 bg-card/30 mb-4 overflow-hidden">
            {selectedCurrentTools.length > 0 && (
              <div className="p-4">
                <p className="text-xs font-body font-semibold tracking-widest text-white uppercase mb-3">Current Tools</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {selectedCurrentTools.map((label) => (
                    <div key={label} className="flex items-center justify-between border border-white/20 rounded-md px-3 py-2 bg-white/5">
                      <span className="text-sm font-body text-white truncate mr-2">{label}</span>
                      <ToolLogo label={label} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedWishlistTools.length > 0 && (
              <div className={`p-4 ${selectedCurrentTools.length > 0 ? "border-t border-border/20" : ""}`}>
                <p className="text-xs font-body font-semibold tracking-widest text-white uppercase mb-3">Wishlist</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {selectedWishlistTools.map((label) => (
                    <div key={label} className="flex items-center justify-between border border-amber-400/40 rounded-md px-3 py-2 bg-amber-900/10">
                      <span className="text-sm font-body text-white truncate mr-2">{label}</span>
                      <ToolLogo label={label} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Custom tools */}
        {customTools.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-4">
            <p className="text-xs font-body font-semibold tracking-widest text-white uppercase mb-3">Also Testing — Your Tools</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {customTools.map((t) => (
                <span key={t} className="rounded-full border border-white/20 px-3 py-1 text-sm font-body font-medium text-white bg-white/5">{t}</span>
              ))}
            </div>
            <p className="text-sm text-white font-body">Custom tool{customTools.length > 1 ? "s" : ""} added by you — included in this configuration.</p>
          </div>
        )}

        {/* Deep-Dive Focus */}
        {deepDive.length > 0 && (
          <div className="rounded-xl border border-primary/25 bg-primary/5 mb-4 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-primary/15 flex items-center justify-between">
              <p className="text-xs font-body font-semibold tracking-widest text-white uppercase">Your {deepDive.length} Deep-Dive Focus</p>
              <span className="text-xs font-body font-semibold text-white">Service Recommendations</span>
            </div>
            <div className="divide-y divide-border/15">
              {deepDive.map((pt) => {
                const entry = DEEP_DIVE_SERVICE_MAP[pt];
                if (!entry) return null;
                return (
                  <div key={pt} className="px-4 py-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-body text-white font-semibold">{pt}</p>
                      <p className="text-xs text-white font-body mt-0.5">{entry.reason}</p>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-end shrink-0 max-w-[45%]">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="text-sm font-display font-semibold text-white bg-primary/20 border border-primary/35 px-3 py-1 rounded whitespace-nowrap">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-4 py-3 border-t border-primary/15 bg-primary/5">
              <p className="text-sm text-white font-body">
                These services will be pre-selected in your estimate when you reach the{" "}
                <button
                  onClick={() => {
                    recommendedIds.forEach((id) => window.dispatchEvent(new CustomEvent("tulip:select-service", { detail: { id } })));
                    onStageChange(5);
                  }}
                  className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity font-semibold"
                >
                  Cost Estimator — Build your quote
                </button>
                .
              </p>
            </div>
          </div>
        )}

        <div className="px-4 py-3 rounded-xl bg-black/70 border border-orange-400/25 mb-5 backdrop-blur-sm">
          <div className="flex items-start gap-2">
            <span className="text-lg shrink-0 mt-0.5">⚠️</span>
            <div>
              <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-orange-400 mb-1">Demonstration Only</p>
              <p className="text-xs font-body text-white/70">This was a simulation. Real-world scaling requires a scoped discovery, team onboarding, and ongoing support. A <strong className="text-white/90">1:1 Consultation</strong> aligns expectations before any commitment.</p>
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
        <p className="text-[10px] font-body text-white mb-3">This is a simulated walkthrough — real integration requires a scoped engagement.</p>
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
              <span className={`text-xs font-body ${i < 3 ? "text-white/90" : "text-primary"}`}>{c}</span>
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
                <p className="text-xs font-body text-white/70">Workshops &amp; Education has been added to your estimate builder below.</p>
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
      <p className="text-xs text-white font-body mb-4">You've completed the Tulip R&D Pipeline™ demo.</p>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[["Up to 50%", "reduction in asset pipeline time*"], ["Significantly", "faster creative iteration"], ["85%", "fewer integration failures & rework cycles"]].map(([stat, lbl]) => (
          <div key={stat} className="p-3 rounded-xl bg-primary/5 border border-primary/10">
            <div className="font-display text-xl font-bold text-gradient-gold">{stat}</div>
            <div className="text-[10px] text-white/70 font-body mt-0.5">{lbl}</div>
          </div>
        ))}

      </div>

      <div className="px-4 py-3 rounded-xl bg-orange-400/5 border border-orange-400/20 text-left mb-5">
        <div className="flex items-start gap-2">
          <span className="text-base shrink-0 mt-0.5">⚠️</span>
          <div>
            <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-orange-400 mb-1">This was a simulation</p>
            <p className="text-xs font-body text-white/70">
              Real-world scaling requires a scoped discovery, team onboarding, and ongoing support.
              A <strong className="text-white/90">1:1 Consultation</strong> aligns expectations before any commitment.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 items-center">
        <a href="#estimator"
          onClick={() => {
            const ids = getRecommendedServiceIds(deepDive);
            ids.forEach((id) => window.dispatchEvent(new CustomEvent("tulip:select-service", { detail: { id } })));
            window.dispatchEvent(new CustomEvent("tulip:open-calendly"));
          }}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-display font-semibold text-sm hover:opacity-90 transition-opacity">
          Book Discovery Call <ArrowRight className="w-3.5 h-3.5" />
        </a>
        <a href="#estimator"
          onClick={() => {
            const ids = getRecommendedServiceIds(deepDive);
            ids.forEach((id) => window.dispatchEvent(new CustomEvent("tulip:select-service", { detail: { id } })));
          }}
          className="text-xs text-white hover:text-foreground font-body transition-colors underline underline-offset-2">
          Or build your estimate first →
        </a>
      </div>

      {/* Download / Email results */}
      <div className="mt-6 pt-5 border-t border-border/20 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => {
            const rows = deepDive.length > 0
              ? deepDive.map((pt) => {
                  const e = DEEP_DIVE_SERVICE_MAP[pt];
                  return `<tr><td style="padding:8px 12px;border-bottom:1px solid #333;font-weight:600">${pt}</td><td style="padding:8px 12px;border-bottom:1px solid #333;color:#aaa">${e?.reason ?? ""}</td><td style="padding:8px 12px;border-bottom:1px solid #333;color:#c084fc">${(e?.tags ?? []).join(", ")}</td></tr>`;
                }).join("")
              : `<tr><td colspan="3" style="padding:12px;color:#aaa;text-align:center">No pain points flagged</td></tr>`;
            const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Tulip R&D Pipeline Report</title>
              <style>body{font-family:system-ui,sans-serif;background:#0a0a0a;color:#fff;padding:40px;max-width:800px;margin:auto}
              h1{font-size:28px;margin-bottom:4px}h2{font-size:16px;color:#aaa;font-weight:400;margin-bottom:32px}
              table{width:100%;border-collapse:collapse;margin-bottom:32px}th{text-align:left;padding:8px 12px;border-bottom:2px solid #333;color:#c084fc;font-size:12px;text-transform:uppercase;letter-spacing:.08em}
              .stat{display:inline-block;margin-right:32px;margin-bottom:16px}.stat-val{font-size:32px;font-weight:700;color:#c084fc}.stat-lbl{font-size:12px;color:#aaa}
              footer{margin-top:40px;font-size:11px;color:#555;border-top:1px solid #222;padding-top:16px}
              @media print{body{background:#fff;color:#000}th{color:#7c3aed}.stat-val{color:#7c3aed}footer{color:#999}}</style>
            </head><body>
              <h1>Tulip R&D Pipeline™ Report</h1>
              <h2>AI Pipeline Demo Summary</h2>
              <div class="stat"><div class="stat-val">Up to 50%</div><div class="stat-lbl">Reduction in asset pipeline time</div></div>
              <div class="stat"><div class="stat-val">Significantly</div><div class="stat-lbl">Faster creative iteration</div></div>
              <div class="stat"><div class="stat-val">85%</div><div class="stat-lbl">Fewer integration failures</div></div>
              <h2 style="margin-top:32px;margin-bottom:8px;color:#c084fc;font-weight:600;font-size:14px;text-transform:uppercase;letter-spacing:.08em">Your Deep-Dive Focus</h2>
              <table><thead><tr><th>Pain Point</th><th>Recommendation</th><th>Suggested Service</th></tr></thead><tbody>${rows}</tbody></table>
              <footer>*Based on industry benchmarks. Results vary by studio size and pipeline maturity.<br>Sources: Generative Environments for ICVFX (SP Studios) • Hunyuan3D Pipeline (Tencent) • Democratization of VFX via GenAI (UWL Research)<br>Generated by Tulip Technology R&D™ — tuliptechnology.ca</footer>
            </body></html>`;
            const blob = new Blob([html], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            const w = window.open(url, "_blank");
            if (w) { w.addEventListener("load", () => { w.focus(); w.print(); URL.revokeObjectURL(url); }); }
          }}
          className="inline-flex items-center gap-2 btn-chrome-outline px-5 py-2.5 rounded-full font-display font-semibold text-sm transition-all min-h-[40px]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download PDF Summary
        </button>
        <button
          onClick={() => {
            const body = deepDive.length > 0
              ? deepDive.map((pt) => {
                  const e = DEEP_DIVE_SERVICE_MAP[pt];
                  return `• ${pt}\n  → ${(e?.tags ?? []).join(", ")}: ${e?.reason ?? ""}`;
                }).join("\n")
              : "No pain points flagged.";
            const subject = encodeURIComponent("My Tulip R&D Pipeline Report");
            const bodyEnc = encodeURIComponent(`Tulip R&D Pipeline™ Report\n\nBenchmark Results:\n• Up to 50% reduction in asset pipeline time\n• Significantly faster creative iteration\n• 85% fewer integration failures\n\nDeep-Dive Focus:\n${body}\n\n*Based on industry benchmarks. Results vary by studio size.\ntuliptechnology.ca`);
            window.location.href = `mailto:?subject=${subject}&body=${bodyEnc}`;
          }}
          className="inline-flex items-center gap-2 btn-chrome-outline px-5 py-2.5 rounded-full font-display font-semibold text-sm transition-all min-h-[40px]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          Email Results
        </button>
      </div>

      {/* Back button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => onStageChange(4)}
          className="text-xs text-white/50 hover:text-white font-body transition-colors flex items-center gap-1"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Integrate
        </button>
      </div>
    </div>
  );
};

const ProvenStat = ({
  icon: Icon,
  target,
  suffix = "",
  prefix = "",
  staticDisplay,
  label,
  delay = 0,
}: {
  icon: React.ElementType;
  target?: number;
  suffix?: string;
  prefix?: string;
  staticDisplay?: string;
  label: string;
  delay?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || staticDisplay || target === undefined) return;
    const controls = animate(count, target, { duration: 1.6, delay, ease: "easeOut" });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [inView, target, delay, count, rounded, staticDisplay]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center gap-2">
      <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <span className="font-display text-2xl md:text-3xl font-bold text-gradient-gold">
        {staticDisplay ?? `${prefix}${display}${suffix}`}
      </span>
      <p className="text-xs text-white/80 font-body leading-snug">{label}</p>
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
  const [workflowSelected, setWorkflowSelected] = useState<string[]>([...PAIN_POINTS]);
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

  // Open demo instantly when triggered from navbar button
  useEffect(() => {
    const handler = () => {
      setWorkflowStage(-1);
      document.getElementById("interactive-demo")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("tulip:open-demo", handler);
    return () => window.removeEventListener("tulip:open-demo", handler);
  }, []);

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
          className="text-center max-w-xl mx-auto mb-10 text-white font-body text-sm"
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
          className="relative"
        >
          <BeforeAfterSlider
            beforeImage={genaiWorkflow}
            afterImage={currentWorkflow}
            beforeLabel="GenAI Tools + Workflow"
            afterLabel="Current Workflow"
            onPositionChange={handlePositionChange}
            handleY={handleY}
          />
          <p className="max-w-xl mx-auto mt-6 text-sm text-white font-body text-center leading-relaxed">
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
                        <p className="text-sm text-white/90 font-body leading-relaxed">
                          {p.text.split(p.highlight).map((part, j, arr) => (
                            <span key={j}>{part}{j < arr.length - 1 && <strong className="text-destructive font-semibold">{p.highlight}</strong>}</span>
                          ))}
                        </p>
                        {p.sub && <p className="text-base md:text-lg text-white font-body font-medium">{p.sub}</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-4 text-xs text-white font-body text-center">
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
                  <p className="text-xs text-white font-body mb-5">Transitioning from "AI as a toy" to "AI as a tool."</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {solutions.map((s, i) => (
                      <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }} className="flex items-start gap-3">
                        <div className="mt-0.5 p-1.5 rounded-lg bg-primary/8 border border-primary/15">
                          <s.icon className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-body font-semibold text-foreground">{s.label}</p>
                          <p className="text-xs text-white font-body leading-relaxed mt-0.5">{s.desc}</p>
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
                      <p className="text-xs text-white font-body mt-1">
                        From idea to working system to team adoption
                      </p>
                    </div>
                    <span className="text-[9px] tracking-[0.15em] uppercase font-body text-white border border-border/40 rounded-full px-2.5 py-1 self-start shrink-0">v4.2</span>
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
                          <p className={`text-sm font-body font-semibold transition-colors ${isActive ? "text-primary" : isCompleted ? "text-green-400" : "text-white"}`}>{step.label}</p>
                          <p className="text-xs text-white/80 font-body leading-snug">{step.desc}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>


                {/* Quantitative proof */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-6 p-5 rounded-2xl bg-primary/5 border border-primary/10 backdrop-blur-sm">
                  <p className="text-[10px] tracking-[0.15em] uppercase font-body font-semibold text-primary mb-4">Proven Results</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <ProvenStat icon={Clock} target={50} suffix="%" prefix="Up to " label="reduction in asset pipeline time" delay={0.65} />
                    <ProvenStat icon={Rocket} staticDisplay="Significantly" label="faster creative iteration" delay={0.75} />
                    <ProvenStat icon={CheckCircle2} target={85} suffix="%" label="fewer integration failures & rework cycles" delay={0.85} />
                  </div>
                  <p className="mt-5 text-xs text-white font-body text-center leading-relaxed">
                    *Based on industry benchmarks. Results vary by studio size and pipeline maturity. Our aim is to make it 1–3× better production workflow for you.
                  </p>
                  <p className="mt-3 text-xs text-white font-body text-center">
                    Sources: Generative Environments for ICVFX (SP Studios) • Hunyuan3D Pipeline (Tencent) • Democratization of VFX via GenAI (UWL Research)
                  </p>
                  <p className="mt-3 text-xs text-white font-body text-center">
                    Findings informed by peer-reviewed research.{" "}
                    <a href="/library" className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity">
                      Explore our R&D Library →
                    </a>
                  </p>
                </motion.div>
              </motion.div>
            )}

            {!showProblems && !showSolutions && (
              <motion.div key="neutral" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="text-center py-12">
                <p className="text-sm text-white font-body">Drag the slider left or right to explore</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Interactive Demo — always visible, no entrance animation ── */}
        <div id="interactive-demo" className="mt-10 rounded-2xl bg-card/30 border border-primary/20 backdrop-blur-sm overflow-hidden flex" style={{ boxShadow: "0 0 40px hsl(var(--primary) / 0.08)" }}>
          {/* Left Journey Sidebar */}
          <div className="hidden md:flex flex-col w-48 shrink-0 border-r border-primary/15 bg-black/20 p-4 gap-1">
            <p className="font-display font-bold text-sm text-white mb-0.5">Workflow</p>
            <p className="text-[10px] font-body text-white/50 mb-4">Pipeline N→1</p>
            {pipelineSteps.map((step, i) => {
              const stageNum = i + 1;
              const isActive = workflowStage === stageNum;
              const isCompleted = workflowStage > stageNum;
              return (
                <button
                  key={step.label}
                  onClick={() => isCompleted || isActive ? setWorkflowStage(stageNum) : undefined}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                    isActive ? "bg-primary/15 border-l-2 border-primary text-primary"
                    : isCompleted ? "text-green-400 hover:bg-green-400/5 cursor-pointer"
                    : "text-white/35 cursor-default"
                  }`}
                >
                  {isCompleted
                    ? <CheckCircle2 size={14} className="shrink-0 text-green-400" />
                    : <step.icon size={14} className={`shrink-0 ${isActive ? "text-primary" : "text-white/30"}`} />
                  }
                  <span className={`text-xs font-display font-semibold ${isActive ? "text-primary" : isCompleted ? "text-green-400" : "text-white/35"}`}>
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Stage Content */}
          <div className="flex-1 min-w-0 p-6">
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
          </div>
        </div>

      </div>
    </section>
  );
};

export default PipelineSection;
