import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import TulipParticles from "./TulipParticles";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Tulip Technology hero"
          className="w-full h-full object-cover object-left"
          loading="eager" />

        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <TulipParticles />
      </div>

      {/* Content */}
      <div className="relative z-10 text-right max-w-4xl ml-auto mr-6 md:mr-12 lg:mr-24 section-padding">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-sm md:text-base font-body tracking-[0.3em] uppercase text-muted-foreground mb-6">


        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-4">

          <span className="text-gradient-chrome-animated">Tulip Technology</span>
          <br />
          <span className="text-gradient-chrome-animated">R&D™</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg max-w-2xl mx-auto mb-10 font-body text-white md:text-3xl">

          AI Research & Development for 3D Artwork, Games, 3D Animation and VFX's Production Pipelines, and Creative Dev-Tools
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-end">

          <a
            href="#services"
            className="btn-chrome-outline px-8 py-4 rounded-full font-display font-semibold text-lg transition-all">

            Explore Services
          </a>
          <a
            href="#estimator"
            className="px-8 py-4 rounded-full font-display font-semibold text-lg hover:opacity-90 transition-opacity text-primary-foreground bg-white">

            ​Estimate Quotes  
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-sm md:text-base max-w-xl mx-auto mt-6 text-[#f4fbfa] font-sans font-light">



        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }}
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
    </section>);

};

export default HeroSection;