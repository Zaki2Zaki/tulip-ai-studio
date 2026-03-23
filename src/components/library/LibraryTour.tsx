import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ListFilter, Search, MousePointerClick, Bot, ThumbsUp, FolderPlus, Download, Sparkles, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

const TOUR_STEPS = [
  {
    target: "[data-tour='category']",
    number: 1,
    title: "Choose a Category",
    tip: "Pick VFX, Game Dev, 3D Animation etc. to focus your hunt!",
    icon: ListFilter,
    position: "bottom" as const,
  },
  {
    target: "[data-tour='search']",
    number: 2,
    title: "Search or Browse",
    tip: "Type keywords like 'character motion synthesis rigging' — or just browse fresh results!",
    icon: Search,
    position: "bottom" as const,
  },
  {
    target: "[data-tour='results']",
    number: 3,
    title: "Review Results",
    tip: "Scan Match Rate % and AI Labels — slide to filter by year or relevance!",
    icon: MousePointerClick,
    position: "top" as const,
  },
  {
    target: "[data-tour='paper-row']",
    number: 4,
    title: "Deep Dive into Papers",
    tip: "Click any title → inline Deep Dive opens below: abstract, PDF preview, AI summary + chat!",
    icon: Bot,
    position: "bottom" as const,
  },
  {
    target: "[data-tour='vote']",
    number: 5,
    title: "Mark as Relevant or Not Useful",
    tip: "Thumbs up to save → auto-adds to Bulk Review for batch magic!",
    icon: ThumbsUp,
    position: "bottom" as const,
  },
  {
    target: "[data-tour='collections']",
    number: 6,
    title: "Organize into Collections",
    tip: "Drag papers here or bulk-add — create custom packs for pipelines!",
    icon: FolderPlus,
    position: "right" as const,
  },
  {
    target: "[data-tour='export']",
    number: 7,
    title: "Export & Download",
    tip: "Grab PDFs, ZIP collections, Google Drive soon — ready for production gates!",
    icon: Download,
    position: "bottom" as const,
  },
];

const STORAGE_KEY = "tulip-library-tour-seen";
const AUTO_ADVANCE_MS = 5000;

interface LibraryTourProps {
  triggerOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const LibraryTour = ({ triggerOpen, onOpenChange }: LibraryTourProps) => {
  const [isActive, setIsActive] = useState(false);
  const [step, setStep] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const [finished, setFinished] = useState(false);

  // Auto-open on first visit
  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      const timer = setTimeout(() => startTour(), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // External trigger
  useEffect(() => {
    if (triggerOpen) startTour();
  }, [triggerOpen]);

  const startTour = () => {
    setStep(0);
    setFinished(false);
    setIsActive(true);
    onOpenChange?.(true);
  };

  const endTour = useCallback(() => {
    clearTimeout(timerRef.current);
    setIsActive(false);
    setSpotlightRect(null);
    localStorage.setItem(STORAGE_KEY, "true");
    onOpenChange?.(false);
  }, [onOpenChange]);

  const finishWithConfetti = useCallback(() => {
    clearTimeout(timerRef.current);
    setFinished(true);

    // Fire confetti
    const end = Date.now() + 1500;
    const colors = ["#67e8f9", "#818cf8", "#c084fc", "#f472b6", "#34d399"];
    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    setTimeout(() => {
      endTour();
      setFinished(false);
    }, 2500);
  }, [endTour]);

  // Position spotlight on current element
  useEffect(() => {
    if (!isActive || finished) return;

    const updateRect = () => {
      const el = document.querySelector(TOUR_STEPS[step].target);
      if (el) {
        const rect = el.getBoundingClientRect();
        setSpotlightRect(rect);
        // Scroll element into view
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        setSpotlightRect(null);
      }
    };

    // Small delay for scroll to settle
    const t = setTimeout(updateRect, 300);
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);

    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [isActive, step, finished]);

  // Auto-advance timer
  useEffect(() => {
    if (!isActive || finished) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (step < TOUR_STEPS.length - 1) {
        setStep((s) => s + 1);
      } else {
        finishWithConfetti();
      }
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(timerRef.current);
  }, [isActive, step, finished, finishWithConfetti]);

  const goNext = () => {
    clearTimeout(timerRef.current);
    if (step < TOUR_STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      finishWithConfetti();
    }
  };

  const currentStep = TOUR_STEPS[step];
  const Icon = currentStep.icon;

  // Calculate label position relative to spotlight
  const getLabelStyle = (): React.CSSProperties => {
    if (!spotlightRect) return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

    const pad = 16;
    const pos = currentStep.position;

    if (pos === "bottom") {
      return {
        top: spotlightRect.bottom + pad,
        left: spotlightRect.left + spotlightRect.width / 2,
        transform: "translateX(-50%)",
      };
    }
    if (pos === "top") {
      return {
        top: spotlightRect.top - pad,
        left: spotlightRect.left + spotlightRect.width / 2,
        transform: "translate(-50%, -100%)",
      };
    }
    // right
    return {
      top: spotlightRect.top + spotlightRect.height / 2,
      left: spotlightRect.right + pad,
      transform: "translateY(-50%)",
    };
  };

  // SVG overlay with cutout
  const renderOverlay = () => {
    if (!spotlightRect) return null;
    const pad = 12;
    const x = spotlightRect.left - pad;
    const y = spotlightRect.top - pad;
    const w = spotlightRect.width + pad * 2;
    const h = spotlightRect.height + pad * 2;
    const r = 16;

    return (
      <svg className="fixed inset-0 w-full h-full z-[9998] pointer-events-none" style={{ width: "100vw", height: "100vh" }}>
        <defs>
          <mask id="tour-mask">
            <rect width="100%" height="100%" fill="white" />
            <rect x={x} y={y} width={w} height={h} rx={r} ry={r} fill="black" />
          </mask>
          <filter id="tour-glow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Dim overlay */}
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.65)" mask="url(#tour-mask)" />
        {/* Glow ring around cutout */}
        <rect
          x={x - 2}
          y={y - 2}
          width={w + 4}
          height={h + 4}
          rx={r + 2}
          ry={r + 2}
          fill="none"
          stroke="hsl(185, 80%, 55%)"
          strokeWidth="2"
          opacity="0.7"
          filter="url(#tour-glow)"
          className="tour-glow-pulse"
        />
      </svg>
    );
  };

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Click-capture overlay */}
          <div className="fixed inset-0 z-[9997]" onClick={goNext} />

          {/* SVG spotlight overlay */}
          {renderOverlay()}

          {/* Skip button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={endTour}
            className="fixed top-6 right-6 z-[10000] flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-md border border-border text-sm font-body text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
          >
            <X className="w-4 h-4" />
            Skip tour
          </motion.button>

          {/* Step progress dots */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] flex items-center gap-2 px-4 py-2.5 rounded-full bg-card/80 backdrop-blur-md border border-border"
          >
            {TOUR_STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => { clearTimeout(timerRef.current); setStep(i); }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === step
                    ? "bg-[hsl(185,80%,55%)] shadow-[0_0_10px_hsl(185,80%,55%/0.6)] scale-125"
                    : i < step
                    ? "bg-primary/60"
                    : "bg-muted-foreground/30"
                }`}
              />
            ))}
            <span className="ml-2 text-xs font-body text-muted-foreground">
              {step + 1}/{TOUR_STEPS.length}
            </span>
          </motion.div>

          {/* Floating label near spotlight */}
          {!finished && (
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 10 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              style={getLabelStyle()}
              className="fixed z-[10000] max-w-xs pointer-events-none"
            >
              <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-card/90 backdrop-blur-xl border border-[hsl(185,60%,50%/0.3)] shadow-[0_0_30px_-5px_hsl(185,80%,55%/0.3),0_0_60px_-10px_hsl(260,60%,65%/0.15)]">
                {/* Number badge */}
                <div className="tour-number-badge shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-display font-bold text-primary-foreground">
                  {currentStep.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className="w-4 h-4 text-[hsl(185,80%,55%)]" />
                    <span className="font-display font-bold text-sm text-foreground">{currentStep.title}</span>
                  </div>
                  <p className="text-xs font-body text-muted-foreground leading-relaxed">{currentStep.tip}</p>
                </div>
              </div>
              {/* Arrow pointing to element */}
              {currentStep.position === "bottom" && (
                <div className="flex justify-center -mt-1">
                  <div className="w-3 h-3 rotate-45 bg-card/90 border-t border-l border-[hsl(185,60%,50%/0.3)] -translate-y-[18px]" />
                </div>
              )}
            </motion.div>
          )}

          {/* Finish overlay */}
          {finished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed inset-0 z-[10001] flex items-center justify-center"
            >
              <div className="text-center px-8 py-10 rounded-3xl bg-card/90 backdrop-blur-xl border border-[hsl(185,60%,50%/0.3)] shadow-[0_0_60px_-10px_hsl(185,80%,55%/0.4)]">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10, delay: 0.2 }}
                >
                  <Sparkles className="w-12 h-12 text-[hsl(185,80%,55%)] mx-auto mb-4" />
                </motion.div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">You're all set!</h2>
                <p className="font-body text-muted-foreground mb-6">Dive into research — your library awaits.</p>
                <button
                  onClick={endTour}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full hero-btn-explore hero-btn-bloom font-body font-semibold text-base transition-all"
                >
                  Got it! Dive in
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Bubble sparkle particles */}
          {spotlightRect && !finished && (
            <div className="fixed z-[9999] pointer-events-none" style={{
              left: spotlightRect.left + spotlightRect.width / 2,
              top: spotlightRect.top,
            }}>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`${step}-${i}`}
                  className="absolute w-1.5 h-1.5 rounded-full bg-[hsl(185,80%,55%)]"
                  initial={{
                    opacity: 0.8,
                    x: (Math.random() - 0.5) * 60,
                    y: (Math.random() - 0.5) * 40,
                    scale: 0,
                  }}
                  animate={{
                    opacity: [0.8, 0.4, 0],
                    y: [(Math.random() - 0.5) * 40, -30 - Math.random() * 50],
                    scale: [0, 1, 0.5],
                  }}
                  transition={{
                    duration: 2 + Math.random(),
                    delay: i * 0.3,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default LibraryTour;
