import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

import unrealLogo from "@/assets/logos/unreal-engine.svg";
import blenderLogo from "@/assets/logos/blender.svg";
import unityLogo from "@/assets/logos/unity.svg";
import godotLogo from "@/assets/logos/godot.svg";
import mayaLogo from "@/assets/logos/maya.png";
import cinema4dLogo from "@/assets/logos/cinema4d.png";
import houdiniLogo from "@/assets/logos/houdini.svg";
import openaiLogo from "@/assets/logos/openai.svg";
import geminiLogo from "@/assets/logos/google-gemini.svg";
import huggingfaceLogo from "@/assets/logos/huggingface-full.svg";
import lovableLogo from "@/assets/logos/lovable.svg";
import grokLogo from "@/assets/logos/xai-grok.svg";

const logos = [
  { src: unrealLogo, name: "Unreal Engine", invert: true },
  { src: blenderLogo, name: "Blender" },
  { src: unityLogo, name: "Unity" },
  { src: mayaLogo, name: "Maya" },
  { src: cinema4dLogo, name: "Cinema4D", showLabel: true },
  { src: godotLogo, name: "Godot" },
  { src: houdiniLogo, name: "Houdini" },
  
];

const aiLogos = [
  { src: openaiLogo, name: "GPT-5 / o1", color: "#10A37F" },
  { src: geminiLogo, name: "Gemini 3.0", color: "#4285F4" },
  { src: huggingfaceLogo, name: "Hugging Face", color: "#FFD700" },
  { src: lovableLogo, name: "Lovable", color: "#E779C1" },
  { src: grokLogo, name: "Grok", color: "#FFFFFF" },
];

const WhyTulipSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  // Double the logos for seamless infinite scroll
  const doubled = [...logos, ...logos];
  const doubledAi = [...aiLogos, ...aiLogos];
  return (
    <section className="py-32 section-padding">
      <div ref={ref} className="max-w-5xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-sm tracking-[0.3em] uppercase text-primary font-body mb-4">
          Why Tulip
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-4xl md:text-6xl font-bold mb-8">
          <span className="text-gradient-gold">Functional</span> and Explorative
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-white font-semibold font-sans">
          We're focused on <span className="font-bold bg-clip-text text-transparent animate-[illuminating_3s_ease-in-out_infinite]" style={{ backgroundImage: 'linear-gradient(90deg, #C8A2C8, #ADD8E6, #C8A2C8, #ADD8E6)', backgroundSize: '200% 100%' }}>flow, adoption and integration</span> for our tools. Aiming for seamlessly into existing pipelines, delivering production-ready work via API for scalable, automated pipelines.
        </motion.p>

        {/* Logo carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20">
          <p className="text-sm text-muted-foreground font-body mb-8 tracking-widest uppercase">
            Works with the tools you already use:
          </p>
          <div className="overflow-hidden relative">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
            <div className="flex animate-logo-scroll">
              {doubled.map((logo, i) => (
                <div
                  key={`${logo.name}-${i}`}
                  className="flex-shrink-0 flex items-center justify-center px-8 md:px-12 h-16"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={logo.src}
                      alt={logo.name}
                      className={`h-8 md:h-10 w-auto opacity-80 hover:opacity-100 transition-opacity ${logo.invert ? 'brightness-0 invert' : ''}`}
                    />
                    {logo.showLabel && (
                      <span className="font-display text-sm md:text-base font-bold whitespace-nowrap opacity-80" style={{ color: '#4B6EF5' }}>
                        {logo.name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Models carousel - scrolls in reverse */}
          <div className="overflow-hidden relative mt-6">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
            <div className="flex animate-logo-scroll-reverse">
              {doubledAi.map((logo, i) => (
                <div
                  key={`${logo.name}-${i}`}
                  className="flex-shrink-0 flex items-center justify-center px-8 md:px-12 h-16"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={logo.src}
                      alt={logo.name}
                      className={`h-6 md:h-7 w-auto opacity-80 hover:opacity-100 transition-opacity ${(logo as any).whiteBg ? 'bg-white rounded px-1 py-0.5' : ''}`}
                    />
                    <span
                      className="font-display text-sm md:text-base font-bold whitespace-nowrap opacity-80 hover:opacity-100 transition-opacity"
                      style={{ color: logo.color }}
                    >
                      {logo.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyTulipSection;