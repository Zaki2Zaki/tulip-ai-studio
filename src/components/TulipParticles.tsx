import { useEffect, useRef } from "react";

interface Particle {
  torusAngle: number;
  tubeAngle: number;
  speed: number;
  tubeSpeed: number;
  tubeRadius: number;
  size: number;
  maxOpacity: number;
  hue: number;
  twinkleSpeed: number;
  twinklePhase: number;
  trail: { x: number; y: number; opacity: number }[];
}

const PARTICLE_COUNT = 450;
const TRAIL_LENGTH = 6;

const TulipParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);
  const initialized = useRef(false);
  const scrollY = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initParticles = () => {
      const particles: Particle[] = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          torusAngle: Math.random() * Math.PI * 2,
          tubeAngle: Math.random() * Math.PI * 2,
          speed: 0.0004 + Math.random() * 0.001,
          tubeSpeed: 0.001 + Math.random() * 0.002,
          tubeRadius: 10 + Math.random() * 70,
          size: 0.5 + Math.random() * 2.2,
          maxOpacity: 0.2 + Math.random() * 0.65,
          hue: Math.random() < 0.7
            ? 25 + Math.random() * 30
            : 10 + Math.random() * 15,
          twinkleSpeed: 0.008 + Math.random() * 0.018,
          twinklePhase: Math.random() * Math.PI * 2,
          trail: [],
        });
      }
      particlesRef.current = particles;
      initialized.current = true;
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      if (!initialized.current) initParticles();
    };
    resize();
    window.addEventListener("resize", resize);

    const onScroll = () => { scrollY.current = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    const loop = () => {
      const w = canvas.width;
      const h = canvas.height;
      timeRef.current += 1;
      const t = timeRef.current;

      ctx.clearRect(0, 0, w, h);

      const parallaxY = scrollY.current * 0.15;
      const parallaxX = Math.sin(scrollY.current * 0.003) * 12;

      const cx = w / 2 + parallaxX;
      const cy = h * 0.42 - parallaxY;
      const majorRx = Math.min(w * 0.38, 340);
      const majorRy = majorRx * 1.4;

      for (const p of particlesRef.current) {
        p.torusAngle += p.speed;
        p.tubeAngle += p.tubeSpeed;

        const cosT = Math.cos(p.torusAngle);
        const sinT = Math.sin(p.torusAngle);
        const cosU = Math.cos(p.tubeAngle);
        const sinU = Math.sin(p.tubeAngle);

        const ringX = cosT * majorRx;
        const ringY = sinT * majorRy;
        const tubeOffX = cosU * p.tubeRadius * cosT;
        const tubeOffY = cosU * p.tubeRadius * sinT * 1.4;
        const tubeOffZ = sinU * p.tubeRadius;

        const x = cx + ringX + tubeOffX + tubeOffZ * 0.25;
        const y = cy + ringY + tubeOffY;

        const depth = 0.55 + (sinU * 0.45);
        const drawSize = p.size * depth;
        const twinkle = 0.4 + 0.6 * Math.sin(t * p.twinkleSpeed + p.twinklePhase);
        const opacity = p.maxOpacity * depth * twinkle;

        // Update trail
        if (t % 3 === 0) {
          p.trail.push({ x, y, opacity });
          if (p.trail.length > TRAIL_LENGTH) p.trail.shift();
        }

        if (opacity < 0.01) continue;

        // Draw comet trail
        if (p.trail.length > 1 && drawSize > 0.8) {
          for (let i = 0; i < p.trail.length - 1; i++) {
            const trailPoint = p.trail[i];
            const progress = i / p.trail.length;
            const trailOpacity = opacity * progress * 0.3;
            const trailSize = drawSize * progress * 0.6;
            if (trailOpacity < 0.005) continue;

            ctx.beginPath();
            ctx.arc(trailPoint.x, trailPoint.y, trailSize, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 75%, 58%, ${trailOpacity})`;
            ctx.fill();
          }
        }

        // Core dot
        ctx.beginPath();
        ctx.arc(x, y, drawSize, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 82%, 62%, ${opacity})`;
        ctx.fill();

        // Soft glow halo
        if (drawSize > 1) {
          ctx.beginPath();
          ctx.arc(x, y, drawSize * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 88%, 55%, ${opacity * 0.08})`;
          ctx.fill();
        }

        // Cross sparkle
        if (opacity > 0.35 && drawSize > 1.3) {
          const sparkLen = drawSize * 3.5 * twinkle;
          ctx.strokeStyle = `hsla(${p.hue}, 90%, 75%, ${opacity * 0.35})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(x - sparkLen, y);
          ctx.lineTo(x + sparkLen, y);
          ctx.moveTo(x, y - sparkLen);
          ctx.lineTo(x, y + sparkLen);
          ctx.stroke();
        }
      }

      // Warm central glow
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, majorRx * 1.3);
      grad.addColorStop(0, "hsla(32, 90%, 52%, 0.05)");
      grad.addColorStop(0.4, "hsla(28, 85%, 48%, 0.02)");
      grad.addColorStop(1, "hsla(25, 80%, 45%, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      animRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      particlesRef.current = [];
      initialized.current = false;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default TulipParticles;
