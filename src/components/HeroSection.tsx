import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ClipboardCheck } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import CalendlyModal from "./CalendlyModal";

const rotatingTexts = ["0→1", "N→1"];

const HeroSection = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [textIndex, setTextIndex] = useState(0);
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Tulip Technology hero"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${videoLoaded ? "opacity-0" : "opacity-100"}`}
          loading="eager"
        />
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          onCanPlay={() => setVideoLoaded(true)}
          poster=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoLoaded ? "opacity-100" : "opacity-0"}`}
          style={{ filter: "blur(2px)" }}
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.48) 50%, rgba(0,0,0,0.36) 100%)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      {/* Content — Apple-style centered with generous whitespace */}
      <div className="relative z-10 w-full section-padding pt-28 md:pt-32 pb-20 md:pb-24">
        <div className="max-w-2xl">
          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display font-bold leading-[1.08] mb-6 text-[clamp(32px,5.5vw,64px)] tracking-[-0.03em]"
          >
            <span className="text-gradient-chrome-animated">Tulip Technology</span>
            <br />
            <span className="text-gradient-chrome-animated">R&D™</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-10 space-y-4"
            style={{ maxWidth: "560px" }}
          >
            {/* AI Labs tagline */}
            <p className="text-xl md:text-2xl font-display font-bold text-white/95" style={{ letterSpacing: "-0.01em" }}>
              AI Labs That Ship{" "}
              <span className="inline-block overflow-hidden align-bottom" style={{ height: "1.15em", width: "2.6em", position: "relative" }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={textIndex}
                    initial={{ y: "-100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center"
                  >
                    {rotatingTexts[textIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>{" "}
              Systems
            </p>

            {/* Description */}
            <p className="text-base md:text-lg font-body font-medium text-white/80 leading-relaxed">
              3D Workflow & Tools Experiments → GenAI Production Systems
            </p>

            <p className="text-sm md:text-base font-body text-white/80 leading-relaxed">
              Integrating GenAI tools into game engines, animation pipelines, and VFX workflows.
            </p>

            <p className="text-sm md:text-base font-body text-white/70 leading-relaxed">
              We're all discovering the pain points to scale. We{" "}
              <span className="text-gradient-tulip-ombre font-bold">love</span>{" "}
              handling the hard part:
              <br />
              making genAI reliable for our creatives & technical leaders
            </p>

            {/* Pipeline steps */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs md:text-sm font-display font-semibold text-white/60">
              {["Discover opportunities", "Rapid prototyping", "Adopt solutions", "Integrate & collaborate with experts", "Scale"].map((step, i, arr) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="text-white/80">{step}</span>
                  {i < arr.length - 1 && (
                    <span className="text-gradient-tulip-ombre">→</span>
                  )}
                </span>
              ))}
            </div>
          </motion.div>

          {/* CTAs — Apple-style prominent buttons with 44px+ touch targets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-wrap gap-2.5 items-start"
          >
            <a
              href="#services"
              className="hero-btn-explore hero-btn-bloom px-6 py-3 rounded-full font-display font-semibold text-sm transition-all min-h-[44px] flex items-center"
            >
              Explore Services
            </a>
            <a
              href="#estimator"
              className="hero-btn-quote hero-btn-bloom px-6 py-3 rounded-full font-display font-semibold text-sm transition-all min-h-[44px] flex items-center"
            >
              Estimate Quotes
            </a>
            <div className="flex flex-col items-center gap-1">
              <a
                href="#estimator"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("estimator");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                    setTimeout(() => {
                      const assessBtn = document.querySelector<HTMLButtonElement>('[data-assessment-trigger]');
                      assessBtn?.click();
                    }, 600);
                  }
                }}
                className="hero-btn-assessment hero-btn-bloom px-6 py-3 rounded-full font-display font-semibold text-sm transition-all min-h-[44px] flex items-center gap-2"
              >
                <ClipboardCheck className="w-4 h-4" />
                2-min Assessment
              </a>
              <span className="text-[10px] font-body text-white/50">Not Sure Where to Start?</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-5 h-8 border border-foreground/20 rounded-full flex justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 bg-primary/60 rounded-full" />
        </motion.div>
      </motion.div>

      <CalendlyModal open={calendlyOpen} onClose={() => setCalendlyOpen(false)} />
    </section>
  );
};

export default HeroSection;
