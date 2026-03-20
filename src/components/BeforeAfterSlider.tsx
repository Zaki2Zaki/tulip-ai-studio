import { useRef, useState, useCallback, useEffect } from "react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  onPositionChange?: (position: number) => void;
}

const BeforeAfterSlider = ({
  beforeImage,
  afterImage,
  beforeLabel = "Current Workflow",
  afterLabel = "GenAI Tools + Workflow",
  onPositionChange,
}: BeforeAfterSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
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

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  /* Ombre gradient matching TECH nav logo */
  const ombreGradient = "linear-gradient(180deg, hsl(200 40% 82%), hsl(260 30% 78%), hsl(320 25% 75%), hsl(200 35% 70%))";

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden border border-border/50 select-none touch-none cursor-col-resize"
      style={{ aspectRatio: "16 / 9" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Bottom layer — GenAI workflow (visible on left) */}
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

      {/* Current Workflow label (right side) */}
      <div
        className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 transition-opacity duration-300"
        style={{ opacity: position > 75 ? 0 : 1 }}
      >
        <span className="text-xs font-body font-semibold text-muted-foreground tracking-wide uppercase">
          {beforeLabel}
        </span>
      </div>

      {/* GenAI label (left side) */}
      <div
        className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 transition-opacity duration-300"
        style={{ opacity: position < 25 ? 0 : 1 }}
      >
        <span className="text-xs font-body font-semibold text-primary tracking-wide uppercase">
          {afterLabel}
        </span>
      </div>

      {/* Slider handle — ombre rainbow line + handle */}
      <div
        className="absolute top-0 bottom-0 z-20 flex items-center justify-center"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        {/* Rainbow ombre line */}
        <div
          className="absolute top-0 bottom-0 w-[3px] rounded-full"
          style={{
            background: ombreGradient,
            boxShadow: "0 0 12px hsl(260 30% 78% / 0.6), 0 0 24px hsl(320 25% 75% / 0.3)",
          }}
        />
        {/* Rainbow ombre handle */}
        <div
          className="relative w-10 h-10 rounded-full shadow-lg flex items-center justify-center"
          style={{
            background: `hsl(var(--background))`,
            border: "2.5px solid transparent",
            backgroundImage: `linear-gradient(hsl(var(--background)), hsl(var(--background))), ${ombreGradient}`,
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
            boxShadow: "0 0 16px hsl(260 30% 78% / 0.5), 0 4px 12px hsl(0 0% 0% / 0.4)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <defs>
              <linearGradient id="ombre-arrow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(200 40% 82%)" />
                <stop offset="50%" stopColor="hsl(260 30% 78%)" />
                <stop offset="100%" stopColor="hsl(320 25% 75%)" />
              </linearGradient>
            </defs>
            <path d="M7 4L3 10L7 16" stroke="url(#ombre-arrow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13 4L17 10L13 16" stroke="url(#ombre-arrow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
