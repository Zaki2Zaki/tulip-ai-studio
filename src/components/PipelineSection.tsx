import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { AlertTriangle, CheckCircle2, ArrowRight, Zap, TrendingUp, Clock, DollarSign, Layers, Rocket, Target, BarChart3 } from "lucide-react";
import pipelineBg from "@/assets/pipeline-bg.jpg";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import currentWorkflow from "@/assets/current-workflow.jpg";
import genaiWorkflow from "@/assets/genai-workflow.png";

/* ── Problem statements (Current Workflow) ───────────────────────── */
const problems = [
  {
    stat: "78%",
    icon: AlertTriangle,
    highlight: "pipelines issues weekly",
    text: "Of Game Dev & 3D + VFX animation studios face version control & pipeline issues weekly — driving delays from tool mismatches and integration failures.",
  },
  {
    stat: "45%",
    icon: Clock,
    highlight: "1-hour per week lost",
    text: "Teams lose an average of 1 hour per week troubleshooting, wasting integration time & asset creation in unoptimized, siloed pipelines.",
  },
  {
    stat: "$350K",
    icon: DollarSign,
    highlight: "per major rework cycle",
    text: "Per major rework/iteration cycle — asset pipeline fixes or build overhauls affecting 10–30 devs for 3–7 days.",
    sub: "AA Studios $100K–$400K  •  AAA Studios $500K–$3M+",
  },
];

/* ── Solution outcomes (GenAI Workflow) ───────────────────────────── */
const solutions = [
  { icon: Target, label: "Integrated AI Pipelines", desc: "Replace isolated tool experiments with production-grade AI systems embedded in your existing DCC stack." },
  { icon: Zap, label: "Automated Production Workflows", desc: "From concept art to game-ready assets — automated handoffs between Houdini, Unreal, Blender & AI models." },
  { icon: TrendingUp, label: "Rapid Iteration Systems", desc: "Generative environments for ICVFX cut iteration cycles from weeks to days with real-time AI feedback loops." },
  { icon: BarChart3, label: "Clear Value + ROI", desc: "Quantified benchmarks: 40-60% reduction in asset creation time, 3× faster environment prototyping." },
  { icon: Layers, label: "Scalable Infrastructure", desc: "End-to-end pipelines (Hunyuan3D, Sora-class models) that scale from indie teams to AAA studios." },
];

const pipelineSteps = [
  { num: 1, label: "Discover", desc: "Identify high-impact AI opportunities inside your existing pipeline." },
  { num: 2, label: "Prototype", desc: "Rapidly test ideas under real-world production constraints." },
  { num: 3, label: "Validate", desc: "Confirm what actually works (and what doesn't) before scaling." },
  { num: 4, label: "Integrate", desc: "Embed into industry tools like Unreal, Houdini, Blender, and Unity." },
  { num: 5, label: "Scale", desc: "Enable teams, optimize workflows, and drive long-term adoption." },
];

const PipelineSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [sliderPos, setSliderPos] = useState(50);

  const handlePositionChange = useCallback((pos: number) => {
    setSliderPos(pos);
  }, []);

  // Show problems when slider reveals Current Workflow (right), solutions when GenAI (left)
  const showProblems = sliderPos > 55;
  const showSolutions = sliderPos < 45;

  return (
    <section id="pipeline" className="relative py-16 overflow-hidden">
      <div className="absolute inset-0">
        <img src={pipelineBg} alt="" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      </div>

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto section-padding">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-sm tracking-[0.3em] uppercase text-primary font-body mb-4 text-center"
        >
          3D Production Pipeline
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-display text-4xl md:text-6xl font-bold text-center mb-6"
        >
          AI across <span className="text-gradient-gold">every stage</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="text-center max-w-2xl mx-auto mb-20 text-foreground font-sans text-lg"
        >
          We identify where generative AI creates the most impact in your content production pipelines — from pre-production through final output.
        </motion.p>

        {/* Before/After Slider */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <BeforeAfterSlider
            beforeImage={genaiWorkflow}
            afterImage={currentWorkflow}
            beforeLabel="GenAI Tools + Workflow"
            afterLabel="Current Workflow"
            onPositionChange={handlePositionChange}
          />
          <p className="max-w-2xl mx-auto mt-8 text-sm text-foreground/90 font-body text-left font-normal md:text-lg">
            Startup AI tools are reshaping every stage of the pipeline — we help integrate the explosion of AI tools into production pipelines for creative studios, replacing fragmented workflows with scalable systems.
          </p>
        </motion.div>

        {/* ── Dynamic Content Panels ─────────────────────────────── */}
        <div className="mt-12 min-h-[320px]">
          <AnimatePresence mode="wait">
            {/* ── PROBLEMS PANEL (Current Workflow) ──────────────── */}
            {showProblems && (
              <motion.div
                key="problems"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-5xl mx-auto"
              >
                <div className="flex items-center gap-3 mb-8">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <span className="text-xs tracking-[0.3em] uppercase font-body font-semibold text-destructive">
                    The Experimentation Gap
                  </span>
                </div>

                <div className="space-y-8">
                  {problems.map((p, i) => (
                    <motion.div
                      key={p.stat}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15, duration: 0.5 }}
                      className="flex flex-col md:flex-row items-start gap-4 md:gap-8 p-6 rounded-2xl bg-card/40 border border-border/40 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-3 shrink-0">
                        <p.icon className="w-5 h-5 text-destructive/70" />
                        <span className="font-display text-4xl md:text-6xl font-bold text-gradient-gold">
                          {p.stat}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-base md:text-lg text-foreground font-body leading-relaxed">
                          {p.text.split(p.highlight).map((part, j, arr) => (
                            <span key={j}>
                              {part}
                              {j < arr.length - 1 && (
                                <strong className="text-destructive font-semibold">{p.highlight}</strong>
                              )}
                            </span>
                          ))}
                        </p>
                        {p.sub && (
                          <p className="text-sm text-muted-foreground font-body">
                            {p.sub}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 text-xs text-muted-foreground font-body text-center"
                >
                  Source: An Empirical Study of Delayed Games on Steam, arXiv:2204.11191
                </motion.p>
              </motion.div>
            )}

            {/* ── SOLUTIONS PANEL (GenAI Workflow) ──────────────── */}
            {showSolutions && (
              <motion.div
                key="solutions"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-5xl mx-auto"
              >
                {/* Section header */}
                <div className="flex items-center gap-3 mb-8">
                  <Rocket className="w-5 h-5 text-primary" />
                  <span className="text-xs tracking-[0.3em] uppercase font-body font-semibold text-primary">
                    The Execution Reality
                  </span>
                </div>

                {/* From Experimentation → Execution */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="mb-10 p-8 rounded-2xl bg-card/40 border border-border/40 backdrop-blur-sm"
                >
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                    From Experimentation <span className="text-gradient-gold">→ Execution</span>
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground font-body">
                    Transitioning from "AI as a toy" to "AI as a tool."
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {solutions.map((s, i) => (
                      <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                        className="flex items-start gap-3"
                      >
                        <div className="mt-0.5 p-1.5 rounded-lg bg-primary/10 border border-primary/20">
                          <s.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-base font-body font-semibold text-foreground">{s.label}</p>
                          <p className="text-sm text-muted-foreground font-body leading-relaxed mt-0.5">{s.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* R&D Pipeline Steps */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="p-8 rounded-2xl bg-card/40 border border-border/40 backdrop-blur-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                    <div>
                      <h3 className="font-display text-xl md:text-2xl font-bold text-foreground">
                        The Tulip R&D Pipeline™
                      </h3>
                      <p className="text-sm text-muted-foreground font-body mt-1">
                        From idea <ArrowRight className="inline w-3 h-3 mx-1" /> to working system <ArrowRight className="inline w-3 h-3 mx-1" /> to team adoption
                      </p>
                    </div>
                    <span className="text-[10px] tracking-[0.2em] uppercase font-body text-muted-foreground border border-border/50 rounded-full px-3 py-1 self-start">
                      System Architecture v4.2
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {pipelineSteps.map((step, i) => (
                      <motion.div
                        key={step.num}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.08, duration: 0.3 }}
                        className="flex flex-col items-center text-center gap-2"
                      >
                        <div className="w-12 h-12 rounded-xl border border-border/60 bg-background/60 flex items-center justify-center text-primary font-display text-lg font-bold">
                          {step.num}
                        </div>
                        <p className="text-sm font-body font-semibold text-foreground">{step.label}</p>
                        <p className="text-xs text-muted-foreground font-body leading-snug">{step.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Quantitative proof */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/15 backdrop-blur-sm"
                >
                  <p className="text-xs tracking-[0.2em] uppercase font-body font-semibold text-primary mb-4">
                    Proven Results
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="text-center">
                      <span className="font-display text-3xl md:text-4xl font-bold text-gradient-gold">40–60%</span>
                      <p className="text-sm text-foreground font-body mt-1">Reduction in asset creation time</p>
                    </div>
                    <div className="text-center">
                      <span className="font-display text-3xl md:text-4xl font-bold text-gradient-gold">3×</span>
                      <p className="text-sm text-foreground font-body mt-1">Faster environment prototyping</p>
                    </div>
                    <div className="text-center">
                      <span className="font-display text-3xl md:text-4xl font-bold text-gradient-gold">85%</span>
                      <p className="text-sm text-foreground font-body mt-1">Fewer pipeline integration failures</p>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground font-body text-center">
                    Sources: Generative Environments for ICVFX (SP Studios) • Hunyuan3D End-to-End Pipeline (Tencent) • Democratization of VFX via GenAI (UWL Research)
                  </p>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6 text-center"
                >
                  <span className="text-gradient-gold font-body text-sm font-semibold italic">
                    "We don't add more tools. We make them work — together."
                  </span>
                </motion.p>
              </motion.div>
            )}

            {/* ── Neutral state (slider ~centered) ─────────────── */}
            {!showProblems && !showSolutions && (
              <motion.div
                key="neutral"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center py-12"
              >
                <p className="text-sm text-muted-foreground font-body">
                  ← Drag the slider to explore problems & solutions →
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default PipelineSection;
