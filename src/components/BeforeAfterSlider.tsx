import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  onPositionChange?: (position: number) => void;
  /** 0–100: vertical position of the handle, driven by page scroll */
  handleY?: number;
}

const BeforeAfterSlider = ({
  beforeImage,
  afterImage,
  beforeLabel = "Current Workflow",
  afterLabel = "GenAI Tools + Workflow",
  onPositionChange,
  handleY = 90,
}: BeforeAfterSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(35);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    onPositionChange?.(position);
  }, [position, onPositionChange]);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    let pos = ((clientX - rect.left) / rect.width) * 100;
    pos = Math.max(0, Math.min(100, pos));
    setPosition(pos);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    },
    [isDragging, updatePosition]
  );

  const handlePointerUp = useCallback(() => setIsDragging(false), []);

  const ombreGradient =
    "linear-gradient(180deg, hsl(200 90% 75%), hsl(260 85% 75%), hsl(320 80% 72%), hsl(40 95% 70%), hsl(160 80% 65%), hsl(200 90% 75%))";

  // Clamp handle between 10%–90% so it never clips outside the image
  const clampedHandleY = Math.max(10, Math.min(93, handleY));

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-6xl mx-auto rounded-2xl overflow-hidden border border-border/50 select-none touch-none cursor-col-resize"
      style={{ aspectRatio: "16 / 10" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Bottom layer — GenAI workflow */}
      <img
        src={afterImage}
        alt="GenAI tools workflow development"
        className="absolute inset-0 w-full h-full object-contain bg-black"
        draggable={false}
        loading="lazy"
      />

      {/* Clipped top layer — Current Workflow (revealed from right) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      >
        <img
          src={beforeImage}
          alt="Current 3D production workflow"
          className="absolute inset-0 w-full h-full object-contain bg-black"
          draggable={false}
          loading="lazy"
        />
      </div>

      {/* ── "Current Workflow" label — right side, warm white ── */}
      <div
        className="absolute top-4 right-4 z-10 transition-opacity duration-300"
        style={{ opacity: position > 75 ? 0 : 1 }}
      >
        <div
          className="px-3 py-1.5 rounded-full backdrop-blur-md"
          style={{
            background: "rgba(0,0,0,0.65)",
            border: "1.5px solid rgba(255,255,255,0.25)",
            boxShadow: "0 0 12px rgba(255,255,255,0.06)",
          }}
        >
          <span className="text-[11px] font-body font-bold text-white/90 tracking-[0.12em] uppercase">
            {beforeLabel}
          </span>
        </div>
      </div>

      {/* ── "GenAI Tools + Workflow" label — left side, white text ── */}
      <div
        className="absolute top-3 left-3 z-10 transition-opacity duration-300"
        style={{ opacity: position < 25 ? 0 : 1 }}
      >
        <div
          className="px-2 py-1 rounded-full backdrop-blur-md"
          style={{
            background: "rgba(0,0,0,0.65)",
            border: "1.5px solid rgba(255,255,255,0.25)",
            boxShadow: "0 0 12px rgba(255,255,255,0.06)",
          }}
        >
          <span className="text-[9px] font-body font-bold text-white/80 tracking-[0.12em] uppercase">
            {afterLabel}
          </span>
        </div>
      </div>

      {/* ── Slider divider: full-height line + scroll-linked handle ── */}
      <div
        className="absolute top-0 bottom-0 z-20 w-0"
        style={{ left: `${position}%` }}
      >
        {/* Rainbow ombre line — always full height */}
        <div
          className="absolute top-0 bottom-0 w-[4px] rounded-full -translate-x-1/2"
          style={{
            background: ombreGradient,
            boxShadow:
              "0 0 20px hsl(260 85% 75% / 0.7), 0 0 40px hsl(200 90% 75% / 0.4), 0 0 60px hsl(320 80% 72% / 0.3)",
          }}
        />

        {/* Handle — slides vertically with page scroll */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 transition-[top] duration-150 ease-out"
          style={{ top: `${clampedHandleY}%` }}
        >
          {/* Outer glow */}
          <div
            className="relative w-14 h-14"
            style={{
              filter: "drop-shadow(0 0 12px hsl(260 85% 75% / 0.7)) drop-shadow(0 0 24px hsl(200 90% 75% / 0.4))",
            }}
          >
            {/* Rotating rainbow ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              style={{ background: ombreGradient, padding: "3px" }}
            >
              <div className="w-full h-full rounded-full" style={{ background: "hsl(var(--background))" }} />
            </motion.div>

            {/* Static arrows centred over the ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                <defs>
                  <linearGradient id="ombre-arrow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(200 90% 75%)" />
                    <stop offset="33%" stopColor="hsl(260 85% 75%)" />
                    <stop offset="66%" stopColor="hsl(320 80% 72%)" />
                    <stop offset="100%" stopColor="hsl(40 95% 70%)" />
                  </linearGradient>
                </defs>
                <path d="M7 4L3 10L7 16" stroke="url(#ombre-arrow)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13 4L17 10L13 16" stroke="url(#ombre-arrow)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default BeforeAfterSlider;
