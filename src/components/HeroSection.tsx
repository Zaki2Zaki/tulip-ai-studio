import { motion } from "framer-motion";
import { useRef, useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        {/* Poster / fallback image */}
        <img
          src={heroBg}
          alt="Tulip Technology hero"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${videoLoaded ? "opacity-0" : "opacity-100"}`}
          loading="eager" />
        

        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => setVideoLoaded(true)}
          poster=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoLoaded ? "opacity-100" : "opacity-0"}`}
          style={{ filter: "blur(2px)" }}>
          
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Diagonal dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.4) 100%)"
          }} />
        

        {/* Bottom fade to background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.25) 100%)"
          }} />
        
      </div>

      {/* Content — left-aligned at golden ratio */}
      <div className="relative z-10 w-full section-padding">
        <div className="max-w-[50vw] md:ml-[calc(8%+9rem)] lg:ml-[calc(12%+9rem)] ml-0 max-md:max-w-full max-md:text-center max-md:ml-0" style={{ marginTop: "-5vh" }}>
          






          

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="font-display font-bold leading-[0.95] mb-6 hero-title"
            style={{
              letterSpacing: "-0.02em",
              textShadow: "0 0 40px rgba(255,255,255,0.3), 0 2px 8px rgba(0,0,0,0.4)"
            }}>
            
            <span className="text-gradient-chrome-animated">Tulip Technology</span>
            <br />
            <span className="text-gradient-chrome-animated">R&D™</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="font-normal mb-10 hero-subtitle text-2xl font-sans text-left whitespace-pre-line"
            style={{
              maxWidth: "680px",
              letterSpacing: "0.01em",
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.9)"
            }}>
            AI R&D That Ships 0/N →1 Breakthroughs
            <br />
            Game Studios, 3D Animation &amp; VFX Teams
            <br /><br />
            Transform imaginative ideas into production-ready pipelines: Discover groundbreaking possibilities → Flow rapid prototyping → Adopt proven solutions → Integrate seamlessly →
            <br />
            Collab with our experts
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }} className="flex gap-4 items-center max-md:flex-col max-md:items-stretch">
            
            <a
              href="#services"
              className="hero-btn-explore px-8 py-4 rounded-full font-display font-semibold text-lg transition-all">
              
              Explore Services
            </a>
            <a
              href="#estimator"
              className="hero-btn-quote px-8 py-4 rounded-full font-display font-semibold text-lg transition-all text-center">
              
              Estimate Quotes
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
    </section>);

};

export default HeroSection;