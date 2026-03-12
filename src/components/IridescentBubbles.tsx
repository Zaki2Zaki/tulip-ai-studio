import { useEffect, useRef } from "react";

interface Bubble {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  hue: number;
  hueSpeed: number;
  opacity: number;
  phase: number;
}

const BUBBLE_COUNT = 18;

const IridescentBubbles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const bubblesRef = useRef<Bubble[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Init bubbles
    const initBubbles = () => {
      const bubbles: Bubble[] = [];
      for (let i = 0; i < BUBBLE_COUNT; i++) {
        bubbles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: 30 + Math.random() * 120,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -0.15 - Math.random() * 0.35,
          hue: Math.random() * 360,
          hueSpeed: 0.3 + Math.random() * 0.8,
          opacity: 0.04 + Math.random() * 0.08,
          phase: Math.random() * Math.PI * 2,
        });
      }
      bubblesRef.current = bubbles;
    };
    initBubbles();

    const loop = () => {
      const w = canvas.width;
      const h = canvas.height;
      timeRef.current += 1;
      const t = timeRef.current;

      ctx.clearRect(0, 0, w, h);

      for (const b of bubblesRef.current) {
        b.x += b.vx + Math.sin(t * 0.008 + b.phase) * 0.2;
        b.y += b.vy;
        b.hue = (b.hue + b.hueSpeed) % 360;

        // Wrap around
        if (b.y + b.r < 0) b.y = h + b.r;
        if (b.x < -b.r) b.x = w + b.r;
        if (b.x > w + b.r) b.x = -b.r;

        // Iridescent gradient
        const grad = ctx.createRadialGradient(
          b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.1,
          b.x, b.y, b.r
        );
        const pulse = 0.7 + 0.3 * Math.sin(t * 0.015 + b.phase);
        const alpha = b.opacity * pulse;

        grad.addColorStop(0, `hsla(${b.hue}, 80%, 75%, ${alpha * 1.5})`);
        grad.addColorStop(0.4, `hsla(${(b.hue + 60) % 360}, 70%, 65%, ${alpha})`);
        grad.addColorStop(0.7, `hsla(${(b.hue + 120) % 360}, 60%, 60%, ${alpha * 0.6})`);
        grad.addColorStop(1, `hsla(${(b.hue + 180) % 360}, 50%, 55%, 0)`);

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Specular highlight
        const specGrad = ctx.createRadialGradient(
          b.x - b.r * 0.25, b.y - b.r * 0.3, b.r * 0.05,
          b.x - b.r * 0.2, b.y - b.r * 0.2, b.r * 0.4
        );
        specGrad.addColorStop(0, `hsla(0, 0%, 100%, ${alpha * 0.8})`);
        specGrad.addColorStop(1, `hsla(0, 0%, 100%, 0)`);
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = specGrad;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2 }}
    />
  );
};

export default IridescentBubbles;
