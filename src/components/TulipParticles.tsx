import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  angle: number; // angle in torus field
  radius: number; // distance from torus ring center
  torusAngle: number; // position along the torus ring
  speed: number;
  size: number;
  opacity: number;
  hue: number;
  section: "stem" | "bulb" | "torus";
}

const PARTICLE_COUNT = 180;
const PETAL_PARTICLE_COUNT = 120;

const TulipParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);
  const initialized = useRef(false);

  const init = useCallback((w: number, h: number) => {
    if (initialized.current) return;
    initialized.current = true;

    const cx = w / 2;
    const cy = h * 0.45;
    const particles: Particle[] = [];

    // Torus field particles — flow up center, out at top, down sides, in at bottom
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const torusAngle = Math.random() * Math.PI * 2;
      const tubeAngle = Math.random() * Math.PI * 2;
      const tubeRadius = 20 + Math.random() * 60;
      particles.push({
        x: cx,
        y: cy,
        angle: tubeAngle,
        radius: tubeRadius,
        torusAngle,
        speed: 0.003 + Math.random() * 0.004,
        size: Math.random() * 2 + 0.8,
        opacity: Math.random() * 0.6 + 0.15,
        hue: 20 + Math.random() * 30, // orange range 20-50
        section: "torus",
      });
    }

    // Tulip bulb/petal particles — clustered at top forming tulip shape
    for (let i = 0; i < PETAL_PARTICLE_COUNT; i++) {
      const petalAngle = Math.random() * Math.PI * 2;
      const petalR = Math.random() * 55;
      particles.push({
        x: cx + Math.cos(petalAngle) * petalR * 0.7,
        y: cy - 80 - Math.random() * 70 + Math.abs(Math.cos(petalAngle)) * 20,
        angle: petalAngle,
        radius: petalR,
        torusAngle: petalAngle,
        speed: 0.002 + Math.random() * 0.003,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        hue: 15 + Math.random() * 35,
        section: "bulb",
      });
    }

    // Stem particles — vertical line below bulb
    for (let i = 0; i < 40; i++) {
      const stemY = cy - 10 + Math.random() * 160;
      particles.push({
        x: cx + (Math.random() - 0.5) * 8,
        y: stemY,
        angle: 0,
        radius: 3 + Math.random() * 4,
        torusAngle: 0,
        speed: 0.001 + Math.random() * 0.002,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.35 + 0.1,
        hue: 90 + Math.random() * 40, // greenish for stem
        section: "stem",
      });
    }

    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initialized.current = false;
      init(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h * 0.45;
      timeRef.current += 0.008;
      const t = timeRef.current;

      ctx.clearRect(0, 0, w, h);

      // Torus parameters
      const torusMajorRadius = Math.min(w, h) * 0.22; // major ring radius
      const torusVerticalStretch = 1.6; // elongate vertically for tulip feel

      for (const p of particlesRef.current) {
        if (p.section === "torus") {
          // Advance along torus
          p.torusAngle += p.speed;
          p.angle += p.speed * 2.5;

          // Torus field: major circle is vertical (upright)
          // torusAngle = position along the big ring (vertical circle)
          // angle = position along the small tube cross-section
          const majorX = Math.cos(p.torusAngle) * torusMajorRadius;
          const majorY = Math.sin(p.torusAngle) * torusMajorRadius * torusVerticalStretch;

          // Tube offset - perpendicular to the torus ring
          const tubeOffsetX = Math.cos(p.angle) * p.radius * Math.cos(p.torusAngle);
          const tubeOffsetY = Math.cos(p.angle) * p.radius * Math.sin(p.torusAngle) * torusVerticalStretch;
          const tubeOffsetZ = Math.sin(p.angle) * p.radius; // depth for size variation

          p.x = cx + majorX + tubeOffsetX + tubeOffsetZ * 0.3;
          p.y = cy - 40 + majorY + tubeOffsetY;

          // Depth-based size and opacity
          const depthFactor = 0.6 + (tubeOffsetZ / p.radius) * 0.4;
          const drawSize = p.size * Math.max(0.3, depthFactor);
          const drawOpacity = p.opacity * Math.max(0.2, depthFactor);

          ctx.beginPath();
          ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 85%, 58%, ${drawOpacity})`;
          ctx.fill();

          // Glow
          if (drawSize > 1.2) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, drawSize * 3, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 90%, 55%, ${drawOpacity * 0.08})`;
            ctx.fill();
          }
        } else if (p.section === "bulb") {
          // Tulip bulb — gentle breathing/pulsing
          const breathe = Math.sin(t * 0.8 + p.angle * 2) * 0.15;
          const baseX = cx + Math.cos(p.angle + t * 0.1) * p.radius * (0.7 + breathe);
          // Tulip petal shape: wider at middle, narrow at top
          const petalShape = 1 - Math.pow(Math.abs(Math.sin(p.angle * 2.5 + t * 0.05)), 0.5) * 0.3;
          const baseY = cy - 80 - p.radius * petalShape * 1.2 + Math.sin(t + p.radius) * 3;

          p.x += (baseX - p.x) * 0.03;
          p.y += (baseY - p.y) * 0.03;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 80%, 55%, ${p.opacity * (0.7 + breathe * 0.5)})`;
          ctx.fill();

          // Soft glow for bulb particles
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 85%, 50%, ${p.opacity * 0.06})`;
          ctx.fill();
        } else {
          // Stem — subtle sway
          const sway = Math.sin(t * 0.5 + p.y * 0.02) * 4;
          const targetX = cx + sway;
          p.x += (targetX - p.x) * 0.02;
          p.y += Math.sin(t + p.x) * 0.1;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 50%, 40%, ${p.opacity})`;
          ctx.fill();
        }
      }

      // Central glow behind tulip
      const gradient = ctx.createRadialGradient(cx, cy - 60, 0, cx, cy - 60, torusMajorRadius * 1.2);
      gradient.addColorStop(0, "hsla(30, 90%, 55%, 0.06)");
      gradient.addColorStop(0.5, "hsla(25, 85%, 50%, 0.02)");
      gradient.addColorStop(1, "hsla(20, 80%, 45%, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

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
