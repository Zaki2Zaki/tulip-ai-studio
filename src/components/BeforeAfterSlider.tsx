import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  onPositionChange?: (position: number) => void;
  handleY?: number;
}

/* ── Sketch arrow — always in DOM, opacity driven by drag direction ── */
const SketchArrow = ({
  side,
  active,
}: {
  side: "left" | "right";
  active: boolean;
}) => {
  const isLeft = side === "left";
  return (
    <motion.div
      className="pointer-events-none absolute z-10"
      style={{ bottom: "4px", [isLeft ? "left" : "right"]: "28px" }}
      animate={{ opacity: active ? 0.9 : 0.22 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.div
        animate={active ? { x: isLeft ? [-5, 1, -5] : [5, -1, 5] } : { x: 0 }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          width="40"
          height="60"
          viewBox="0 0 40 60"
          fill="none"
          /* Mirror the SVG for the right side */
          style={{ transform: isLeft ? "none" : "scaleX(-1)" }}
        >
          {/* Curved shaft */}
          <path
            d="M22 5 C18 14, 24 26, 20 42"
            stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"
          />
          {/* Sketch shadow */}
          <path
            d="M23 6 C19 15, 25 27, 21 43"
            stroke="white" strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.35"
          />
          {/* Arrowhead — pointing left */}
          <path
            d="M20 42 L10 34"
            stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"
          />
          <path
            d="M20 42 L23 53"
            stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"
          />
          {/* Sketch wobble */}
          <path
            d="M21 41 L11 33"
            stroke="white" strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.3"
          />
          {/* Faint echo above */}
          <path
            d="M26 2 C23 7, 27 13, 25 18"
            stroke="white" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.22"
          />
          <path d="M25 18 L18 13" stroke="white" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.22" />
          <path d="M25 18 L27 24" stroke="white" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.22" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

const BeforeAfterSlider = ({
  beforeImage,
  afterImage,
  beforeLabel = "Current Workflow",
  afterLabel = "GenAI Tools + Workflow",
  onPositionChange,
  handleY = 82,
}: BeforeAfterSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [internalY, setInternalY] = useState(handleY);
  const [dragDir, setDragDir] = useState<"left" | "right" | null>(null);
  const lastXRef = useRef<number | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isDragging) setInternalY(Math.max(10, Math.min(93, handleY)));
  }, [handleY, isDragging]);

  useEffect(() => {
    onPositionChange?.(position);
  }, [position, onPositionChange]);

  const scheduleClear = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => setDragDir(null), 700);
  }, []);

  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();

      let posX = ((clientX - rect.left) / rect.width) * 100;
      posX = Math.max(0, Math.min(100, posX));
      setPosition(posX);

      let posY = ((clientY - rect.top) / rect.height) * 100;
      posY = Math.max(10, Math.min(93, posY));
      setInternalY(posY);

      if (lastXRef.current !== null) {
        const delta = clientX - lastXRef.current;
        if (Math.abs(delta) > 2) {
          setDragDir(delta < 0 ? "left" : "right");
          scheduleClear();
        }
      }
      lastXRef.current = clientX;
    },
    [scheduleClear]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      lastXRef.current = e.clientX;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updatePosition(e.clientX, e.clientY);
    },
    [updatePosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX, e.clientY);
    },
    [isDragging, updatePosition]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    lastXRef.current = null;
    scheduleClear();
  }, [scheduleClear]);

  const ombreGradient =
    "linear-gradient(180deg, hsl(200 90% 75%), hsl(260 85% 75%), hsl(320 80% 72%), hsl(40 95% 70%), hsl(160 80% 65%), hsl(200 90% 75%))";

  return (
    <div className="relative w-full max-w-6xl mx-auto" style={{ paddingBottom: "72px" }}>
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden border border-border/50 select-none touch-none cursor-crosshair"
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

      {/* Clipped top layer — Current Workflow */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
        <img
          src={beforeImage}
          alt="Current 3D production workflow"
          className="absolute inset-0 w-full h-full object-contain bg-black"
          draggable={false}
          loading="lazy"
        />
      </div>

      {/* Labels */}
      <div
        className="absolute top-4 right-4 z-10 transition-opacity duration-300"
        style={{ opacity: position > 75 ? 0 : 1 }}
      >
        <div className="px-3 py-1.5 rounded-full backdrop-blur-md"
          style={{ background: "rgba(0,0,0,0.65)", border: "1.5px solid rgba(255,255,255,0.25)" }}>
          <span className="text-[11px] font-body font-bold text-white/90 tracking-[0.12em] uppercase">{beforeLabel}</span>
        </div>
      </div>

      <div
        className="absolute top-3 left-3 z-10 transition-opacity duration-300"
        style={{ opacity: position < 25 ? 0 : 1 }}
      >
        <div className="px-2 py-1 rounded-full backdrop-blur-md"
          style={{ background: "rgba(0,0,0,0.65)", border: "1.5px solid rgba(255,255,255,0.25)" }}>
          <span className="text-[9px] font-body font-bold text-white/80 tracking-[0.12em] uppercase">{afterLabel}</span>
        </div>
      </div>


      {/* Slider divider + handle */}
      <div className="absolute top-0 bottom-0 z-20 w-0" style={{ left: `${position}%` }}>
        <div
          className="absolute top-0 bottom-0 w-[4px] rounded-full -translate-x-1/2"
          style={{
            background: ombreGradient,
            boxShadow: "0 0 20px hsl(260 85% 75% / 0.7), 0 0 40px hsl(200 90% 75% / 0.4)",
          }}
        />
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 transition-[top] duration-100 ease-out"
          style={{ top: `${internalY}%` }}
        >
          <div
            className="relative w-14 h-14"
            style={{ filter: "drop-shadow(0 0 12px hsl(260 85% 75% / 0.7)) drop-shadow(0 0 24px hsl(200 90% 75% / 0.4))" }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              style={{ background: ombreGradient, padding: "3px" }}
            >
              <div className="w-full h-full rounded-full" style={{ background: "hsl(var(--background))" }} />
            </motion.div>
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

    {/* ── Sketch arrows outside the frame, in the padding strip below ── */}
    <SketchArrow side="left"  active={dragDir === "left"} />
    <SketchArrow side="right" active={dragDir === "right"} />
    </div>
  );
};

export default BeforeAfterSlider;
