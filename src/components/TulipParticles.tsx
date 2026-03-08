import { useEffect, useRef } from "react";

interface Particle {
  torusAngle: number;   // position along the major ring
  tubeAngle: number;    // position along the tube cross-section
  speed: number;        // angular speed along major ring
  tubeSpeed: number;    // angular speed along tube
  tubeRadius: number;   // distance from tube center
  size: number;
  maxOpacity: number;
  hue: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

const PARTICLE_COUNT = 260;

const TulipParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);
  const initialized = useRef(false);

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
          speed: 0.001 + Math.random() * 0.003,
          tubeSpeed: 0.003 + Math.random() * 0.006,
          tubeRadius: 15 + Math.random() * 65,
          size: 0.6 + Math.random() * 2.2,
          maxOpacity: 0.2 + Math.random() * 0.6,
          hue: Math.random() < 0.7
            ? 25 + Math.random() * 30    // gold/amber
            : 10 + Math.random() * 15,   // warm orange
          twinkleSpeed: 0.015 + Math.random() * 0.035,
          twinklePhase: Math.random() * Math.PI * 2,
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

    const loop = () => {
      const w = canvas.width;
      const h = canvas.height;
      timeRef.current += 1;
      const t = timeRef.current;

      ctx.clearRect(0, 0, w, h);

      // Torus centered on the title area
      const cx = w / 2;
      const cy = h * 0.42;
      // Major radius scales with viewport — wraps around the title
      const majorRx = Math.min(w * 0.38, 340);
      const majorRy = majorRx * 1.4; // vertical stretch for upright torus

      for (const p of particlesRef.current) {
        // Advance along torus
        p.torusAngle += p.speed;
        p.tubeAngle += p.tubeSpeed;

        // Major ring position (vertical torus — particles rise up center, cascade down sides)
        const cosT = Math.cos(p.torusAngle);
        const sinT = Math.sin(p.torusAngle);

        // Tube cross-section offset — perpendicular to the ring surface
        const cosU = Math.cos(p.tubeAngle);
        const sinU = Math.sin(p.tubeAngle);

        // 3D torus → 2D projection
        // Ring lies in vertical plane; tube expands radially
        const ringX = cosT * majorRx;
        const ringY = sinT * majorRy;
        const tubeOffX = cosU * p.tubeRadius * cosT;
        const tubeOffY = cosU * p.tubeRadius * sinT * 1.4;
        const tubeOffZ = sinU * p.tubeRadius; // depth axis

        const x = cx + ringX + tubeOffX + tubeOffZ * 0.25;
        const y = cy + ringY + tubeOffY;

        // Depth-based scaling (particles in front are bigger/brighter)
        const depth = 0.55 + (sinU * 0.45);
        const drawSize = p.size * depth;

        // Twinkle sparkle
        const twinkle = 0.4 + 0.6 * Math.sin(t * p.twinkleSpeed + p.twinklePhase);
        const opacity = p.maxOpacity * depth * twinkle;

        if (opacity < 0.01) continue;

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

        // Cross sparkle on bright particles
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

      // Warm central glow behind title
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
