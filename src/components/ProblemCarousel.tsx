import { useRef, useState } from "react";

const CARDS = [
  {
    id: "ai-pipeline-integration",
    stat: "40%",
    headline: "Pipeline Time Wasted",
    description: "Disconnected tools and manual handoffs eat nearly half your production time before a single frame ships.",
    cta: "/services/ai-pipeline-integration",
    gradient: "linear-gradient(160deg, #c4b5f4 0%, #9b8de0 45%, #6a6fc8 100%)",
  },
  {
    id: "studio-style-training",
    stat: "↓",
    headline: "Visual Identity Crisis",
    description: "AI-generated assets erode your studio's distinctive look, forcing expensive rework or brand dilution.",
    cta: "/services/studio-style-training",
    gradient: "linear-gradient(160deg, #e8b4d8 0%, #c48ab8 45%, #9060a0 100%)",
  },
  {
    id: "motion-capture-integration",
    stat: "$350K",
    headline: "Per Major Rework Cycle",
    description: "Late-stage motion data errors compound into six-figure budget overruns and missed release windows.",
    cta: "/services/motion-capture-integration",
    gradient: "linear-gradient(160deg, #a8c8f4 0%, #7098d8 45%, #3860b8 100%)",
  },
  {
    id: "tool-benchmarking",
    stat: "↑",
    headline: "Tool Selection Paralysis",
    description: "Rapidly multiplying GenAI options stall decision-making while competitors lock in production advantages.",
    cta: "/services/tool-benchmarking",
    gradient: "linear-gradient(160deg, #a8e4ec 0%, #60b8cc 45%, #2888a8 100%)",
  },
  {
    id: "infrastructure-planning",
    stat: "50%",
    headline: "Studios Exceed Budget",
    description: "Poorly scoped GPU infrastructure and cloud costs routinely double initial estimates on AI-heavy projects.",
    cta: "/services/infrastructure-planning",
    gradient: "linear-gradient(160deg, #b0e8c0 0%, #70c090 45%, #309060 100%)",
  },
];

export default function ProblemCarousel() {
  const [active, setActive] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: -1 | 1) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-white py-10 overflow-hidden">
      {/* Scrollable card row */}
      <div
        ref={scrollRef}
        className="flex gap-4 px-6 md:px-12 overflow-x-auto scrollbar-none snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {CARDS.map((card, i) => (
          <a
            key={card.id}
            href={card.cta}
            className="group relative flex-shrink-0 snap-start rounded-2xl overflow-hidden"
            style={{
              width: "clamp(260px, 28vw, 320px)",
              height: "clamp(340px, 40vw, 420px)",
              textDecoration: "none",
            }}
          >
            {/* Full-height gradient */}
            <div
              className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              style={{ background: card.gradient }}
            />

            {/* Stat — top */}
            <div className="absolute top-6 left-6 right-6">
              <p
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: "4px",
                }}
              >
                Pain Point
              </p>
              <span
                className="font-display font-black"
                style={{
                  fontSize: "clamp(44px, 6vw, 64px)",
                  color: "rgba(255,255,255,0.88)",
                  lineHeight: 1,
                  display: "block",
                }}
              >
                {card.stat}
              </span>
            </div>

            {/* Bottom dark bar */}
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.65) 55%, transparent 100%)",
                padding: "44px 20px 20px",
              }}
            >
              <p
                className="font-display font-black text-white"
                style={{ fontSize: "clamp(14px, 1.8vw, 17px)", lineHeight: 1.25, marginBottom: "6px" }}
              >
                {card.headline}
              </p>
              <p
                style={{
                  fontSize: "11.5px",
                  color: "rgba(255,255,255,0.58)",
                  lineHeight: 1.5,
                  marginBottom: "14px",
                }}
              >
                {card.description}
              </p>

              {/* Dual arrow SVGs */}
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    scrollBy(-1);
                  }}
                  className="flex items-center justify-center rounded-full transition-colors hover:bg-white/20"
                  style={{
                    width: "30px",
                    height: "30px",
                    border: "1.5px solid rgba(255,255,255,0.3)",
                    background: "transparent",
                  }}
                  aria-label="Scroll left"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M6.5 2L3.5 5L6.5 8" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    scrollBy(1);
                  }}
                  className="flex items-center justify-center rounded-full transition-colors hover:bg-white/20"
                  style={{
                    width: "30px",
                    height: "30px",
                    border: "1.5px solid rgba(255,255,255,0.3)",
                    background: "transparent",
                  }}
                  aria-label="Scroll right"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M3.5 2L6.5 5L3.5 8" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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
