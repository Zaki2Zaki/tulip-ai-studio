import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CARDS = [
  {
    id: "ai-pipeline-integration",
    stat: "40%",
    problem: "Pipeline Time Wasted",
    service: "AI Pipeline Integration",
    price: "$50K–$200K",
    cta: "/services/ai-pipeline-integration",
    gradientColors: { start: "#c8b8f0", mid: "#a89fd8", end: "#7b8ed4" },
  },
  {
    id: "studio-style-training",
    stat: "↓",
    problem: "Visual Identity Crisis",
    service: "Studio Style Training",
    price: "$25K–$350K",
    cta: "/services/studio-style-training",
    gradientColors: { start: "#e0b8d8", mid: "#c89ec8", end: "#9b7ab8" },
  },
  {
    id: "motion-capture-integration",
    stat: "$350K",
    problem: "Per Major Rework Cycle",
    service: "Motion Capture Integration",
    price: "$40K–$150K",
    cta: "/services/motion-capture-integration",
    gradientColors: { start: "#b8c8f0", mid: "#8faad8", end: "#6080c0" },
  },
  {
    id: "tool-benchmarking",
    stat: "↑",
    problem: "Tool Selection Paralysis",
    service: "GenAI Tool Benchmarking",
    price: "$15K–$50K",
    cta: "/services/tool-benchmarking",
    gradientColors: { start: "#b8e0e8", mid: "#7ec0d0", end: "#4a9ab0" },
  },
  {
    id: "infrastructure-planning",
    stat: "50%",
    problem: "Studios Exceed Budget",
    service: "Cost-Optimal Infrastructure Planning",
    price: "$20K–$75K",
    cta: "/services/infrastructure-planning",
    gradientColors: { start: "#c0e8c8", mid: "#88c8a0", end: "#4a9870" },
  },
];

export default function ProblemCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const prev = () => {
    setDirection(-1);
    setIndex((i) => (i - 1 + CARDS.length) % CARDS.length);
  };
  const next = () => {
    setDirection(1);
    setIndex((i) => (i + 1) % CARDS.length);
  };

  const card = CARDS[index];

  return (
    <section className="w-full overflow-hidden" style={{ height: "480px", position: "relative" }}>
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={card.id}
          custom={direction}
          initial={{ opacity: 0, x: direction * 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -60 }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
          style={{
            background: `linear-gradient(160deg, ${card.gradientColors.start} 0%, ${card.gradientColors.mid} 50%, ${card.gradientColors.end} 100%)`,
          }}
        >
          {/* Stat — top left */}
          <div className="absolute top-8 left-8 md:top-12 md:left-12">
            <p
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
                marginBottom: "6px",
              }}
            >
              Pain Point
            </p>
            <span
              className="font-display font-black"
              style={{ fontSize: "clamp(52px, 8vw, 90px)", color: "rgba(255,255,255,0.9)", lineHeight: 1 }}
            >
              {card.stat}
            </span>
          </div>

          {/* Bottom dark bar */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)",
              padding: "56px 32px 28px",
            }}
          >
            <div className="max-w-5xl mx-auto flex items-end justify-between gap-6">
              {/* Text */}
              <div>
                <p
                  className="font-display font-black text-white"
                  style={{ fontSize: "clamp(18px, 2.5vw, 26px)", lineHeight: 1.2, marginBottom: "6px" }}
                >
                  {card.problem}
                </p>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>
                  {card.service}
                </p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
                  {card.price}
                </p>
              </div>

              {/* Dual arrows + counter */}
              <div className="flex items-center gap-3 shrink-0">
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: 500, minWidth: "36px", textAlign: "right" }}>
                  {index + 1} / {CARDS.length}
                </span>
                <button
                  onClick={prev}
                  className="flex items-center justify-center rounded-full transition-colors hover:bg-white/20"
                  style={{ width: "36px", height: "36px", border: "1.5px solid rgba(255,255,255,0.35)" }}
                  aria-label="Previous"
                >
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M7 2L4 5.5L7 9" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={next}
                  className="flex items-center justify-center rounded-full transition-colors hover:bg-white/20"
                  style={{ width: "36px", height: "36px", border: "1.5px solid rgba(255,255,255,0.35)" }}
                  aria-label="Next"
                >
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M4 2L7 5.5L4 9" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <a
                  href={card.cta}
                  className="inline-flex items-center font-display font-bold uppercase tracking-wide transition-opacity hover:opacity-80 whitespace-nowrap"
                  style={{
                    background: "#fff",
                    color: "#1a1a2e",
                    borderRadius: "6px",
                    padding: "9px 18px",
                    fontSize: "11px",
                    marginLeft: "4px",
                  }}
                >
                  Explore →
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
