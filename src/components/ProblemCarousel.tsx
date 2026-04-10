import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Clock, DollarSign } from "lucide-react";

const PROBLEMS = [
  {
    stat: "78%",
    icon: AlertTriangle,
    highlight: "pipeline issues weekly",
    text: "Of Game Dev & 3D + VFX animation studios face version control & pipeline issues weekly — driving delays from tool mismatches and integration failures.",
    sub: null,
  },
  {
    stat: "45%",
    icon: Clock,
    highlight: "1 hour per week lost",
    text: "Teams lose an average of 1 hour per week troubleshooting, wasting integration time & asset creation in unoptimized, siloed pipelines.",
    sub: null,
  },
  {
    stat: "$350K",
    icon: DollarSign,
    highlight: "per major rework cycle",
    text: "Per major rework/iteration cycle — asset pipeline fixes or build overhauls affecting 10–30 devs for 3–7 days.",
    sub: "AA Studios $100K–$400K  •  AAA Studios $500K–$3M+ per major rework/iteration cycle",
  },
];

const INTERVAL = 4000;

export default function ProblemCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % PROBLEMS.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, [paused]);

  const p = PROBLEMS[index];

  return (
    <section className="w-full bg-background border-y border-border/20 py-10 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <AlertTriangle className="w-4 h-4 text-destructive" />
          <span className="text-[11px] tracking-[0.2em] uppercase font-body font-semibold text-destructive">
            The Experimentation Gap
          </span>
        </div>

        {/* Slide */}
        <div
          className="relative min-h-[120px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col md:flex-row items-start gap-4 md:gap-6 p-5 rounded-2xl bg-card/30 border border-border/30 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2.5 shrink-0">
                <p.icon className="w-4 h-4 text-destructive/60" />
                <span className="font-display text-3xl md:text-4xl font-bold text-gradient-gold">
                  {p.stat}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-white/90 font-body leading-relaxed">
                  {p.text.split(p.highlight).map((part, j, arr) => (
                    <span key={j}>
                      {part}
                      {j < arr.length - 1 && (
                        <strong className="text-destructive font-semibold">
                          {p.highlight}
                        </strong>
                      )}
                    </span>
                  ))}
                </p>
                {p.sub && (
                  <p className="text-sm text-white/60 font-body">{p.sub}</p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex items-center gap-2 mt-5">
          {PROBLEMS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setIndex(i); setPaused(true); }}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === index ? "20px" : "6px",
                height: "6px",
                background: i === index ? "hsl(var(--primary))" : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
          {/* Progress bar */}
          <div className="ml-auto flex items-center gap-2">
            <div className="w-24 h-0.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                key={index}
                className="h-full bg-primary/60 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: INTERVAL / 1000, ease: "linear" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
