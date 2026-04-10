import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CARDS = [
  {
    problem: "40% Pipeline Time Wasted",
    service: "AI Pipeline Integration",
    price: "$50K–$200K",
    cta: "/services/ai-pipeline-integration",
    from: "#ffffff",
    to: "#ede6f5",
  },
  {
    problem: "Visual Identity Crisis",
    service: "Studio Style Training",
    price: "$25K–$350K",
    cta: "/services/studio-style-training",
    from: "#ede6f5",
    to: "#e0cce7",
  },
  {
    problem: "$350K Per Rework Cycle",
    service: "Motion Capture Integration",
    price: "$40K–$150K",
    cta: "/services/motion-capture-integration",
    from: "#e0cce7",
    to: "#cac1e7",
  },
  {
    problem: "Tool Selection Paralysis",
    service: "GenAI Tool Benchmarking",
    price: "$15K–$50K",
    cta: "/services/tool-benchmarking",
    from: "#cac1e7",
    to: "#b0cced",
  },
  {
    problem: "50% Budget Overruns",
    service: "Cost-Optimal Infrastructure Planning",
    price: "$20K–$75K",
    cta: "/services/infrastructure-planning",
    from: "#b0cced",
    to: "#a2d5e5",
  },
];

const INTERVAL = 4500;

export default function ProblemCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % CARDS.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <section className="w-full py-8 overflow-hidden bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="rounded-2xl px-7 py-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-8"
              style={{
                background: `linear-gradient(135deg, ${CARDS[index].from}, ${CARDS[index].to})`,
                willChange: "transform",
              }}
            >
              {/* Problem */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-[10px] tracking-[0.18em] uppercase font-body font-semibold mb-1"
                  style={{ color: "rgba(0,0,0,0.4)" }}
                >
                  Pain Point
                </p>
                <p
                  className="font-display text-2xl md:text-3xl font-bold leading-tight"
                  style={{ color: "#1a1a2e" }}
                >
                  {CARDS[index].problem}
                </p>
              </div>

              {/* Arrow */}
              <ArrowRight
                className="hidden md:block shrink-0"
                style={{ color: "rgba(0,0,0,0.25)", width: "20px", height: "20px" }}
              />

              {/* Service + CTA */}
              <div className="flex-1 min-w-0 flex flex-col gap-3">
                <div>
                  <p
                    className="text-[10px] tracking-[0.18em] uppercase font-body font-semibold mb-1"
                    style={{ color: "rgba(0,0,0,0.4)" }}
                  >
                    Service
                  </p>
                  <p
                    className="font-display text-base font-bold"
                    style={{ color: "#1a1a2e" }}
                  >
                    {CARDS[index].service}
                  </p>
                  <p
                    className="font-body text-sm mt-0.5"
                    style={{ color: "rgba(0,0,0,0.5)" }}
                  >
                    {CARDS[index].price}
                  </p>
                </div>
                <a
                  href={CARDS[index].cta}
                  className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-full font-display font-semibold text-xs transition-all hover:opacity-80"
                  style={{
                    background: "rgba(0,0,0,0.08)",
                    color: "#1a1a2e",
                    border: "1px solid rgba(0,0,0,0.12)",
                  }}
                >
                  Learn more <ArrowRight style={{ width: "12px", height: "12px" }} />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots + progress */}
          <div className="flex items-center gap-2 mt-4">
            {CARDS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setIndex(i); setPaused(true); }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === index ? "20px" : "6px",
                  height: "6px",
                  background: i === index ? "hsl(var(--primary))" : "rgba(255,255,255,0.18)",
                }}
              />
            ))}
            <div className="ml-auto w-20 h-0.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                key={index}
                className="h-full rounded-full"
                style={{ background: "hsl(var(--primary) / 0.5)", willChange: "transform" }}
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
