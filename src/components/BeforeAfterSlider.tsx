import { useRef, useState, useCallback } from "react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

const BeforeAfterSlider = ({
  beforeImage,
  afterImage,
  beforeLabel = "Current Workflow",
  afterLabel = "GenAI Tools + Workflow",
}: BeforeAfterSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

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

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden border border-border/50 select-none touch-none cursor-col-resize"
      style={{ aspectRatio: "16 / 9" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Bottom layer — Current Workflow (visible on left) */}
      <img
        src={beforeImage}
        alt="Current 3D production workflow"
        className="absolute inset-0 w-full h-full object-contain bg-black"
        draggable={false}
        loading="lazy"
      />

      {/* Clipped top layer — GenAI workflow (revealed from right) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={afterImage}
          alt="GenAI tools workflow development"
          className="absolute inset-0 w-full h-full object-contain bg-black"
          draggable={false}
          loading="lazy"
        />
      </div>

      {/* Current Workflow label (left side) — hides when slider < 25% */}
      <div
        className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 transition-opacity duration-300"
        style={{ opacity: position < 25 ? 0 : 1 }}
      >
        <span className="text-xs font-body font-semibold text-muted-foreground tracking-wide uppercase">
          {beforeLabel}
        </span>
      </div>

      {/* GenAI label (right side) — hides when slider > 75% */}
      <div
        className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 transition-opacity duration-300"
        style={{ opacity: position > 75 ? 0 : 1 }}
      >
        <span className="text-xs font-body font-semibold text-primary tracking-wide uppercase">
          {afterLabel}
        </span>
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 z-20 flex items-center justify-center"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
        <div className="relative w-10 h-10 rounded-full bg-background border-2 border-primary shadow-lg flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 4L3 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
            <path d="M13 4L17 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
