import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CARDS = [
  {
    id: "ai-pipeline-integration",
    image: "/images/fragmented-tools.png",
    problem: "40% Pipeline Time Wasted",
    service: "AI Pipeline Integration",
    price: "$50K–$200K",
    cta: "/services/ai-pipeline-integration",
    from: "#ffffff",
    to: "#ede6f5",
  },
  {
    id: "studio-style-training",
    image: "/images/style-consistency.png",
    problem: "Visual Identity Crisis",
    service: "Studio Style Training",
    price: "$25K–$350K",
    cta: "/services/studio-style-training",
    from: "#ede6f5",
    to: "#e0cce7",
  },
  {
    id: "motion-capture-integration",
    image: "/images/motion-capture.png",
    problem: "$350K Per Rework Cycle",
    service: "Motion Capture Integration",
    price: "$40K–$150K",
    cta: "/services/motion-capture-integration",
    from: "#e0cce7",
    to: "#cac1e7",
  },
  {
    id: "tool-benchmarking",
    image: "/images/tool-paralysis.png",
    problem: "Tool Selection Paralysis",
    service: "GenAI Tool Benchmarking",
    price: "$15K–$50K",
    cta: "/services/tool-benchmarking",
    from: "#cac1e7",
    to: "#b0cced",
  },
  {
    id: "infrastructure-planning",
    image: "/images/budget-overruns.png",
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

  const card = CARDS[index];

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
              className="rounded-2xl overflow-hidden flex flex-col md:flex-row"
              style={{
                background: `linear-gradient(135deg, ${card.from}, ${card.to})`,
                willChange: "transform",
                // Responsive heights via min-height
                minHeight: "clamp(200px, 30vw, 280px)",
              }}
            >
              {/* Image column */}
              <div className="relative shrink-0 w-full md:w-[42%] h-48 md:h-auto overflow-hidden">
                <img
                  src={card.image}
                  alt={card.problem}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0 mix-blend-multiply opacity-40"
                  style={{
                    background: `linear-gradient(to bottom, ${card.from}, ${card.to})`,
                  }}
                />
              </div>

              {/* Content column */}
              <div className="flex-1 px-6 py-6 md:px-8 md:py-7 flex flex-col justify-between">
                <div>
                  <p
                    className="text-[10px] tracking-[0.18em] uppercase font-body font-semibold mb-2"
                    style={{ color: "rgba(0,0,0,0.4)" }}
                  >
                    Pain Point
                  </p>
                  <p
                    className="font-display font-bold leading-tight mb-4"
                    style={{
                      color: "#1a1a2e",
                      fontSize: "clamp(20px, 3vw, 28px)",
                    }}
                  >
                    {card.problem}
                  </p>
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
                    {card.service}
                  </p>
                  <p
                    className="font-body text-sm mt-0.5 mb-5"
                    style={{ color: "rgba(0,0,0,0.5)" }}
                  >
                    {card.price}
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href={card.cta}
                    className="inline-flex items-center gap-2 px-5 py-2.5 font-display font-bold text-xs uppercase tracking-wide transition-colors hover:opacity-80"
                    style={{
                      background: "#2B5BA6",
                      color: "#fff",
                      borderRadius: "4px",
                    }}
                  >
                    Explore Solution <ArrowRight style={{ width: "13px", height: "13px" }} />
                  </a>
                  <a
                    href="https://calendly.com/youki-harada/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 font-display font-bold text-xs uppercase tracking-wide transition-colors hover:bg-[#2B5BA6] hover:text-white"
                    style={{
                      border: "2px solid #2B5BA6",
                      color: "#2B5BA6",
                      borderRadius: "4px",
                      background: "transparent",
                    }}
                  >
                    Book Consultation
                  </a>
                </div>
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
