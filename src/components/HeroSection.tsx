import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import TulipParticles from "./TulipParticles";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Tulip Technology hero"
          className="w-full h-full object-cover object-left"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <TulipParticles />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto section-padding">
        <div className="max-w-2xl">

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold leading-[0.95] mb-6">
            <span className="text-gradient-chrome-animated">Tulip Technology</span>
            <br />
            <span className="text-gradient-chrome-animated">R&D™</span>
          </motion.h1>

          {/* Tagline — reference colour for the rest */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-display text-xl md:text-2xl font-bold text-white mb-3">
            AI Labs That Ship 0→1&nbsp;&nbsp;Systems
          </motion.h2>

          {/* Sub-heading — same white as h2 above */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-body text-sm md:text-base text-white mb-2">
            3D Workflow &amp; Tools Experiments → GenAI Production Systems
          </motion.p>

          {/* Description line — same white as h2 above */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="font-body text-sm md:text-base text-white mb-3">
            Integrating GenAI tools into game engines, animation pipelines, and VFX workflows.
          </motion.p>

          {/* Pain-point copy — same white, "love" keeps its own style */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="font-body text-sm md:text-base text-white mb-8">
            We're all discovering the pain points to scale. We{" "}
            <span className="text-pink-400 font-semibold">love</span>{" "}
            handling the hard part:
            <br />
            making genAI reliable for our creatives &amp; technical leaders
          </motion.p>

          {/* Process pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="flex flex-wrap items-center gap-2 mb-8">
            {["Discover", "Prototype", "Adopt", "Integrate", "Scale"].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-2">
                <span className="px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-white text-xs font-body">
                  {step}
                </span>
                {i < arr.length - 1 && <span className="text-white/40 text-xs">→</span>}
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="flex gap-2">

            <a
              href="#contact"
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full font-display font-semibold text-sm bg-gradient-to-r from-green-300 to-teal-300 text-black hover:opacity-90 transition-opacity">
              Book a Call →
            </a>
            <a
              href="#estimator"
              className="flex-1 flex items-center justify-center px-4 py-2.5 rounded-full border border-white/30 font-display font-semibold text-sm text-white hover:bg-white/5 transition-colors">
              Get Estimate
            </a>
            <a
              href="#pipeline"
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full font-display font-semibold text-sm bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:opacity-90 transition-opacity">
              🎯 2-min Assessment
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-5 h-8 border-2 border-foreground/30 rounded-full flex justify-center pt-1">
          <div className="w-1 h-2 bg-primary rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
