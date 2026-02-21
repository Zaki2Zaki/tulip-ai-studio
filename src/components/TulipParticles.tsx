import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  hue: number;
  life: number;
  maxLife: number;
}

interface Petal {
  x: number;
  y: number;
  angle: number;
  rotSpeed: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  hue: number;
}

const TulipParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const petalsRef = useRef<Petal[]>([]);
  const timeRef = useRef(0);

  const init = useCallback((w: number, h: number) => {
    // Floating particles
    particlesRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 2.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 0.4 - 0.1,
      opacity: Math.random() * 0.5 + 0.1,
      hue: 200 + Math.random() * 160, // chrome range 200-360
      life: 0,
      maxLife: 300 + Math.random() * 400,
    }));

    // Tulip petals floating gently
    petalsRef.current = Array.from({ length: 12 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      angle: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.008,
      size: Math.random() * 14 + 6,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: Math.random() * 0.2 + 0.05,
      opacity: Math.random() * 0.12 + 0.03,
      hue: 260 + Math.random() * 100,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      if (particlesRef.current.length === 0) init(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const drawPetal = (ctx: CanvasRenderingContext2D, p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      // Tulip petal shape
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.6, p.size * 0.5, p.size * 0.3, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.5, p.size * 0.3, -p.size * 0.6, -p.size * 0.6, 0, -p.size);
      ctx.fillStyle = `hsla(${p.hue}, 25%, 75%, ${p.opacity})`;
      ctx.fill();
      ctx.restore();
    };

    const loop = () => {
      const w = canvas.width;
      const h = canvas.height;
      timeRef.current += 0.01;
      ctx.clearRect(0, 0, w, h);

      // Update & draw particles
      for (const p of particlesRef.current) {
        p.x += p.speedX + Math.sin(timeRef.current + p.y * 0.01) * 0.15;
        p.y += p.speedY;
        p.life++;
        if (p.life > p.maxLife || p.y < -10 || p.x < -10 || p.x > w + 10) {
          p.x = Math.random() * w;
          p.y = h + 10;
          p.life = 0;
          p.hue = 200 + Math.random() * 160;
        }
        const fadeFactor = p.life < 40 ? p.life / 40 : p.life > p.maxLife - 40 ? (p.maxLife - p.life) / 40 : 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 30%, 78%, ${p.opacity * fadeFactor})`;
        ctx.fill();
      }

      // Update & draw petals
      for (const p of petalsRef.current) {
        p.x += p.speedX + Math.sin(timeRef.current * 0.5 + p.y * 0.005) * 0.3;
        p.y += p.speedY;
        p.angle += p.rotSpeed;
        if (p.y > h + 30) {
          p.y = -30;
          p.x = Math.random() * w;
        }
        if (p.x < -30) p.x = w + 30;
        if (p.x > w + 30) p.x = -30;
        drawPetal(ctx, p);
      }

      animRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default TulipParticles;
