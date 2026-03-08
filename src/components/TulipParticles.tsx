import { useEffect, useRef } from "react";

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  maxOpacity: number;
  hue: number;
  life: number;
  maxLife: number;
  twinkleSpeed: number;
  twinklePhase: number;
  drift: number;
}

const SPARK_COUNT = 120;

const TulipParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const sparksRef = useRef<Spark[]>([]);

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

    const createSpark = (w: number, h: number): Spark => {
      // Spawn from lower-center area where the tulip image is
      const spawnX = w * 0.3 + Math.random() * w * 0.4;
      const spawnY = h * 0.3 + Math.random() * h * 0.5;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.15 + Math.random() * 0.4;
      const maxLife = 300 + Math.random() * 500;

      return {
        x: spawnX,
        y: spawnY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.1, // slight upward bias
        size: 0.8 + Math.random() * 2.5,
        opacity: 0,
        maxOpacity: 0.3 + Math.random() * 0.6,
        hue: Math.random() < 0.6
          ? 25 + Math.random() * 30   // gold/amber
          : 15 + Math.random() * 15,  // warm orange
        life: 0,
        maxLife,
        twinkleSpeed: 0.02 + Math.random() * 0.04,
        twinklePhase: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.002,
      };
    };

    // Initialize sparks
    for (let i = 0; i < SPARK_COUNT; i++) {
      const spark = createSpark(canvas.width, canvas.height);
      spark.life = Math.random() * spark.maxLife; // stagger
      sparksRef.current.push(spark);
    }

    const loop = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < sparksRef.current.length; i++) {
        const s = sparksRef.current[i];
        s.life++;

        // Respawn when life ends
        if (s.life > s.maxLife) {
          sparksRef.current[i] = createSpark(w, h);
          continue;
        }

        // Slow-motion drift
        s.vx += s.drift;
        s.x += s.vx;
        s.y += s.vy;

        // Fade in/out lifecycle
        const lifeRatio = s.life / s.maxLife;
        let fadeEnvelope: number;
        if (lifeRatio < 0.15) {
          fadeEnvelope = lifeRatio / 0.15;
        } else if (lifeRatio > 0.7) {
          fadeEnvelope = (1 - lifeRatio) / 0.3;
        } else {
          fadeEnvelope = 1;
        }

        // Twinkle/sparkle effect
        const twinkle = 0.5 + 0.5 * Math.sin(s.life * s.twinkleSpeed + s.twinklePhase);
        s.opacity = s.maxOpacity * fadeEnvelope * twinkle;

        if (s.opacity < 0.01) continue;

        // Draw sparkle core
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 80%, 65%, ${s.opacity})`;
        ctx.fill();

        // Draw soft glow
        if (s.size > 1) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${s.hue}, 85%, 55%, ${s.opacity * 0.1})`;
          ctx.fill();
        }

        // Cross sparkle for brighter particles
        if (s.opacity > 0.4 && s.size > 1.5) {
          const sparkLen = s.size * 3 * twinkle;
          ctx.strokeStyle = `hsla(${s.hue}, 90%, 75%, ${s.opacity * 0.4})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(s.x - sparkLen, s.y);
          ctx.lineTo(s.x + sparkLen, s.y);
          ctx.moveTo(s.x, s.y - sparkLen);
          ctx.lineTo(s.x, s.y + sparkLen);
          ctx.stroke();
        }
      }

      animRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      sparksRef.current = [];
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
