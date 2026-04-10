import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CARDS = [
  {
    id: "ai-pipeline-integration",
    stat: "40%",
    problem: "Pipeline Time Wasted",
    service: "AI Pipeline Integration",
    price: "$50K–$200K",
    cta: "/services/ai-pipeline-integration",
    gradientColors: { start: "#f5f0ff", end: "#ede6f5" },
  },
  {
    id: "studio-style-training",
    stat: "↓",
    problem: "Visual Identity Crisis",
    service: "Studio Style Training",
    price: "$25K–$350K",
    cta: "/services/studio-style-training",
    gradientColors: { start: "#ede6f5", end: "#e0cce7" },
  },
  {
    id: "motion-capture-integration",
    stat: "$350K",
    problem: "Per Major Rework Cycle",
    service: "Motion Capture Integration",
    price: "$40K–$150K",
    cta: "/services/motion-capture-integration",
    gradientColors: { start: "#e0cce7", end: "#cac1e7" },
  },
  {
    id: "tool-benchmarking",
    stat: "↑",
    problem: "Tool Selection Paralysis",
    service: "GenAI Tool Benchmarking",
    price: "$15K–$50K",
    cta: "/services/tool-benchmarking",
    gradientColors: { start: "#cac1e7", end: "#b0cced" },
  },
  {
    id: "infrastructure-planning",
    stat: "50%",
    problem: "Studios Exceed Budget",
    service: "Cost-Optimal Infrastructure Planning",
    price: "$20K–$75K",
    cta: "/services/infrastructure-planning",
    gradientColors: { start: "#b0cced", end: "#a2d5e5" },
  },
];

const INTERVAL = 5000;

export default function ProblemCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % CARDS.length), INTERVAL);
    return () => clearInterval(timer);
  }, [paused]);

  const challenge = CARDS[index];

  return (
    <section
      className="w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            background: `linear-gradient(135deg, ${challenge.gradientColors.start}, ${challenge.gradientColors.end})`,
            willChange: "transform",
          }}
        >
          <div className="max-w-5xl mx-auto px-8 py-8 flex flex-col md:flex-row md:items-center gap-6 md:gap-0">

            {/* Left — stat + problem */}
            <div className="flex-1 min-w-0 md:pr-8 md:border-r md:border-black/10">
              <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(0,0,0,0.38)", marginBottom: "6px" }}>
                Pain Point
              </p>
              <div className="flex items-baseline gap-3">
                <span
                  className="font-display font-black shrink-0"
                  style={{ fontSize: "clamp(36px, 5vw, 52px)", color: "#1a1a2e", lineHeight: 1 }}
                >
                  {challenge.stat}
                </span>
                <span
                  className="font-display font-bold"
                  style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#1a1a2e", lineHeight: 1.25 }}
                >
                  {challenge.problem}
                </span>
              </div>
            </div>

            {/* Middle — service */}
            <div className="flex-1 min-w-0 md:px-8 md:border-r md:border-black/10">
              <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(0,0,0,0.38)", marginBottom: "6px" }}>
                Service
              </p>
              <p className="font-display font-bold" style={{ fontSize: "clamp(14px, 1.8vw, 16px)", color: "#1a1a2e", lineHeight: 1.3, marginBottom: "2px" }}>
                {challenge.service}
              </p>
              <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.45)" }}>
                {challenge.price}
              </p>
            </div>

            {/* Right — CTAs */}
            <div className="flex items-center gap-2 md:pl-8 shrink-0">
              <a
                href={challenge.cta}
                className="inline-flex items-center gap-1.5 font-display font-bold uppercase tracking-wide transition-opacity hover:opacity-80 whitespace-nowrap"
                style={{ background: "#2B5BA6", color: "#fff", borderRadius: "6px", padding: "9px 18px", fontSize: "11px" }}
              >
                Explore <ArrowRight style={{ width: "11px", height: "11px" }} />
              </a>
              <a
                href="https://calendly.com/youki-harada/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center font-display font-bold uppercase tracking-wide transition-all hover:bg-[#2B5BA6] hover:text-white whitespace-nowrap"
                style={{ border: "1.5px solid #2B5BA6", color: "#2B5BA6", borderRadius: "6px", padding: "9px 18px", fontSize: "11px", background: "transparent" }}
              >
                Book a Call
              </a>
            </div>
          </div>

          {/* Dots + progress */}
          <div className="max-w-5xl mx-auto px-8 pb-4 flex items-center gap-1.5">
            {CARDS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setIndex(i); setPaused(true); }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === index ? "16px" : "5px",
                  height: "5px",
                  background: i === index ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.15)",
                }}
              />
            ))}
            <div className="ml-auto w-14 h-px rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.1)" }}>
              <motion.div
                key={index}
                className="h-full"
                style={{ background: "rgba(0,0,0,0.35)", willChange: "transform" }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: INTERVAL / 1000, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
