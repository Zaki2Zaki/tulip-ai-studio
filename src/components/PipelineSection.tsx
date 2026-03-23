import { motion, useInView, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { AlertTriangle, CheckCircle2, ArrowRight, Zap, TrendingUp, Clock, DollarSign, Layers, Rocket, Target, BarChart3, Compass, FlaskConical, ClipboardCheck, GitMerge } from "lucide-react";
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
  const [handleY, setHandleY] = useState(50);

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
      const pct = Math.max(10, Math.min(90, ((-rect.top) / scrollable) * 100));
      setHandleY(pct);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
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
          className="text-center max-w-xl mx-auto mb-10 text-muted-foreground font-body text-sm"
        >
          We identify where generative AI creates the most impact in your content production pipelines — from pre-production through final output.
        </motion.p>

        {/* Drag hint — above slider */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.7 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mb-4 text-sm font-body text-muted-foreground"
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
                      <h3 className="font-display text-lg md:text-xl font-bold text-foreground">The Tulip R&D Pipeline™</h3>
                      <p className="text-xs text-muted-foreground font-body mt-0.5">
                        From idea <ArrowRight className="inline w-3 h-3 mx-0.5" /> to working system <ArrowRight className="inline w-3 h-3 mx-0.5" /> to team adoption
                      </p>
                    </div>
                    <span className="text-[9px] tracking-[0.15em] uppercase font-body text-muted-foreground border border-border/40 rounded-full px-2.5 py-1 self-start">v4.2</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {pipelineSteps.map((step, i) => (
                      <motion.div key={step.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.06 }} className="flex flex-col items-center text-center gap-1.5">
                        <div className="w-10 h-10 rounded-xl border border-primary/30 bg-primary/8 flex items-center justify-center">
                          <step.icon className="w-4.5 h-4.5 text-primary" size={18} />
                        </div>
                        <p className="text-xs font-body font-semibold text-foreground">{step.label}</p>
                        <p className="text-[10px] text-muted-foreground font-body leading-snug">{step.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

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

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-5 text-center">
                  <span className="text-gradient-gold font-body text-sm font-semibold italic">"We don't add more tools. We make them work — together."</span>
                </motion.p>
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
