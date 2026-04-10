import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CARDS = [
  {
    id: "ai-pipeline-integration",
    problem: "40% of pipeline time is wasted",
    service: "AI Pipeline Integration",
    price: "$50K–$200K",
    cta: "/services/ai-pipeline-integration",
    gradientColors: { start: "#f5f0ff", end: "#ede6f5" },
  },
  {
    id: "studio-style-training",
    problem: "Visual identity inconsistency across assets",
    service: "Studio Style Training",
    price: "$25K–$350K",
    cta: "/services/studio-style-training",
    gradientColors: { start: "#ede6f5", end: "#e0cce7" },
  },
  {
    id: "motion-capture-integration",
    problem: "$350K lost per major rework cycle",
    service: "Motion Capture Integration",
    price: "$40K–$150K",
    cta: "/services/motion-capture-integration",
    gradientColors: { start: "#e0cce7", end: "#cac1e7" },
  },
  {
    id: "tool-benchmarking",
    problem: "Tool selection paralysis slows adoption",
    service: "GenAI Tool Benchmarking",
    price: "$15K–$50K",
    cta: "/services/tool-benchmarking",
    gradientColors: { start: "#cac1e7", end: "#b0cced" },
  },
  {
    id: "infrastructure-planning",
    problem: "50% of studios exceed production budget",
    service: "Cost-Optimal Infrastructure Planning",
    price: "$20K–$75K",
    cta: "/services/infrastructure-planning",
    gradientColors: { start: "#b0cced", end: "#a2d5e5" },
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
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            background: `linear-gradient(to bottom, ${challenge.gradientColors.start}, ${challenge.gradientColors.end})`,
            willChange: "transform",
          }}
        >
          <div className="max-w-5xl mx-auto px-6 py-7 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            {/* Pain point */}
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: "4px" }}>
                Pain Point
              </p>
              <p className="font-display font-bold" style={{ fontSize: "clamp(17px, 2.5vw, 22px)", color: "#1a1a2e", lineHeight: 1.25 }}>
                {challenge.problem}
              </p>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px self-stretch" style={{ background: "rgba(0,0,0,0.1)" }} />

            {/* Service */}
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: "4px" }}>
                Service
              </p>
              <p className="font-display font-bold" style={{ fontSize: "15px", color: "#1a1a2e", lineHeight: 1.3 }}>
                {challenge.service}
              </p>
              <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.45)", marginTop: "2px" }}>
                {challenge.price}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={challenge.cta}
                className="inline-flex items-center gap-1.5 font-display font-bold text-xs uppercase tracking-wide transition-opacity hover:opacity-80 whitespace-nowrap"
                style={{ background: "#2B5BA6", color: "#fff", borderRadius: "6px", padding: "8px 16px" }}
              >
                Explore <ArrowRight style={{ width: "12px", height: "12px" }} />
              </a>
              <a
                href="https://calendly.com/youki-harada/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center font-display font-bold text-xs uppercase tracking-wide transition-all hover:bg-[#2B5BA6] hover:text-white whitespace-nowrap"
                style={{ border: "1.5px solid #2B5BA6", color: "#2B5BA6", borderRadius: "6px", padding: "8px 16px", background: "transparent" }}
              >
                Book a Call
              </a>
            </div>
          </div>

          {/* Progress bar */}
          <div className="max-w-5xl mx-auto px-6 pb-3 flex items-center gap-2">
            {CARDS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setIndex(i); setPaused(true); }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === index ? "18px" : "5px",
                  height: "5px",
                  background: i === index ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.15)",
                }}
              />
            ))}
            <div className="ml-auto w-16 h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.1)" }}>
              <motion.div
                key={index}
                className="h-full rounded-full"
                style={{ background: "rgba(0,0,0,0.3)", willChange: "transform" }}
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
