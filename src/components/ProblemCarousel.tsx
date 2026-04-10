import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  const prev = () => setIndex((i) => (i - 1 + CARDS.length) % CARDS.length);
  const next = () => setIndex((i) => (i + 1) % CARDS.length);

  const card = CARDS[index];

  return (
    <section className="w-full px-4 py-10 bg-white">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map((c, i) => (
          <a
            key={c.id}
            href={c.cta}
            className="group relative rounded-2xl overflow-hidden cursor-pointer"
            style={{ height: "360px" }}
          >
            {/* Full-height gradient background */}
            <div
              className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
              style={{
                background: `linear-gradient(160deg, ${c.gradientColors.start} 0%, ${c.gradientColors.mid} 50%, ${c.gradientColors.end} 100%)`,
              }}
            />

            {/* Stat overlay — top left */}
            <div className="absolute top-5 left-5">
              <span
                className="font-display font-black"
                style={{ fontSize: "clamp(28px, 3vw, 38px)", color: "rgba(255,255,255,0.85)", lineHeight: 1 }}
              >
                {c.stat}
              </span>
            </div>

            {/* Bottom dark bar */}
            <div
              className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-3"
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 60%, transparent 100%)",
                padding: "24px 20px 18px",
              }}
            >
              <div className="flex-1 min-w-0">
                <p
                  className="font-display font-black text-white leading-tight"
                  style={{ fontSize: "clamp(14px, 1.6vw, 17px)", marginBottom: "3px" }}
                >
                  {c.problem}
                </p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
                  {c.service}
                </p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", marginTop: "2px" }}>
                  {c.price}
                </p>
              </div>

              {/* Dual arrow SVGs */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={(e) => { e.preventDefault(); setIndex((i - 1 + CARDS.length) % CARDS.length); }}
                  className="flex items-center justify-center rounded-full transition-colors hover:bg-white/20"
                  style={{ width: "28px", height: "28px", border: "1.5px solid rgba(255,255,255,0.4)" }}
                  aria-label="Previous"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M6.5 2L3.5 5L6.5 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); setIndex((i + 1) % CARDS.length); }}
                  className="flex items-center justify-center rounded-full transition-colors hover:bg-white/20"
                  style={{ width: "28px", height: "28px", border: "1.5px solid rgba(255,255,255,0.4)" }}
                  aria-label="Next"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M3.5 2L6.5 5L3.5 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
