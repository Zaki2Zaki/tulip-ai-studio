import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ClipboardCheck, ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import CalendlyModal from "./CalendlyModal";

const rotatingTexts = ["0→1", "N→1"];

const pipelineSteps = [
  "Discover",
  "Prototype",
  "Adopt",
  "Integrate",
  "Scale",
];

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
    <section className="relative flex items-center overflow-hidden" style={{ minHeight: "95vh" }}>
      {/* Background Video + Overlays */}
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
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoLoaded ? "opacity-100" : "opacity-0"}`}
          style={{ filter: "blur(2px)" }}
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Left-heavy gradient overlay for readability */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.78), rgba(0,0,0,0.35))" }} />
        {/* Bottom fade to background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      {/* Grid Container */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 md:px-10 lg:px-12 py-24 md:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
          {/* Left: Content Block */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col gap-6 lg:col-span-2 pl-72"
          >
            {/* Title */}
            <h1 className="font-display font-bold leading-[1.08] tracking-[-0.03em] text-[clamp(30px,4.8vw,58px)]">
              <span className="text-gradient-chrome-animated">Tulip Technology</span>
              <br />
              <span className="text-gradient-chrome-animated">R&D™</span>
            </h1>

            {/* Tagline + body copy */}
            <div className="space-y-3">
              <p className="text-lg md:text-xl font-display font-bold text-foreground/95 leading-snug" style={{ letterSpacing: "-0.01em" }}>
                AI Labs That Ship{" "}
                <span
                  className="inline-block overflow-hidden align-bottom relative"
                  style={{ height: "1.15em", width: "2.6em" }}
                >
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

              {/* Asymmetric block — subheading right-aligned, description lifts under it */}
              <div className="relative mt-10">
                <p className="text-sm md:text-base font-display font-normal text-foreground/95 leading-relaxed text-right" style={{ letterSpacing: "-0.01em" }}>
                  3D Workflow &amp; Tools Experiments → GenAI Production Systems
                </p>
                <p className="text-sm md:text-base font-display font-normal text-foreground/95 leading-relaxed w-1/2 mt-1" style={{ letterSpacing: "-0.01em" }}>
                  Integrating GenAI tools into game engines, animation pipelines, and VFX workflows.
                </p>
              </div>

              <p className="text-sm md:text-base font-display font-normal text-foreground/95 leading-relaxed" style={{ letterSpacing: "-0.01em" }}>
                We're all discovering the pain points to scale. We{" "}
                <span className="text-gradient-tulip-ombre font-bold">love</span>{" "}
                handling the hard part:
                <br />
                making genAI reliable for our creatives &amp; technical leaders
              </p>
            </div>

            {/* Process Flow */}
            <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
              {pipelineSteps.map((step, i) => (
                <span key={step} className="flex items-center gap-1.5 md:gap-2">
                  <span className="px-2.5 py-1 rounded-full border border-border/40 bg-secondary/40 text-[10px] md:text-xs font-display font-semibold text-foreground/80 whitespace-nowrap">
                    {step}
                  </span>
                  {i < pipelineSteps.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-primary/50 shrink-0" />
                  )}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2 mt-2">
              {/* Row 1 — Book a Call + Get Estimate */}
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setCalendlyOpen(true)}
                  className="hero-btn-explore hero-btn-bloom px-6 py-2.5 rounded-full font-display font-semibold text-sm transition-all min-h-[40px] flex items-center justify-center gap-1.5"
                >
                  Book a Call
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href="#estimator"
                  className="hero-btn-quote hero-btn-bloom px-6 py-2.5 rounded-full font-display font-semibold text-sm transition-all min-h-[40px] flex items-center justify-center"
                >
                  Get Estimate
                </a>
              </div>

              {/* Row 2 — 2-min Assessment centred below */}
              <div className="flex justify-center">
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
                  className="hero-btn-assessment hero-btn-bloom px-6 py-2.5 rounded-full font-display font-semibold text-sm transition-all min-h-[40px] flex items-center justify-center gap-1.5"
                >
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  2-min Assessment
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: reserved for future visual */}
          <div className="hidden lg:block" />
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
