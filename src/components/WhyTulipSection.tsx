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
  { src: geminiLogo, name: "Gemini", color: "#4285F4" },
  { src: huggingfaceLogo, name: "Hugging Face", color: "#FFD700", hideLabel: true },
  { src: lovableLogo, name: "Lovable", color: "#E779C1" },
  { src: grokLogo, name: "Grok", color: "#FFFFFF" },
];

const WhyTulipSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const doubled = [...logos, ...logos];
  const doubledAi = [...aiLogos, ...aiLogos];

  return (
    <section className="py-24 md:py-32 section-padding">
      <div ref={ref} className="max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-[11px] tracking-[0.2em] uppercase text-primary font-body mb-3 font-medium"
        >
          Why Tulip
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-3xl md:text-5xl font-bold mb-6"
        >
          <span className="text-gradient-gold">Functional</span> and Explorative
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-foreground/90 font-body"
        >
          We're focused on{" "}
          <span
            className="font-semibold bg-clip-text text-transparent animate-[illuminating_3s_ease-in-out_infinite]"
            style={{ backgroundImage: 'linear-gradient(90deg, #C8A2C8, #ADD8E6, #C8A2C8, #ADD8E6)', backgroundSize: '200% 100%' }}
          >
            flow, adoption and integration
          </span>{" "}
          for our tools. Aiming for seamlessly into existing pipelines, delivering production-ready work via API for scalable, automated pipelines.
        </motion.p>

        {/* Logo carousel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16"
        >
          <p className="text-[11px] text-muted-foreground font-body mb-6 tracking-[0.15em] uppercase font-medium">
            Works with the tools you already use
          </p>
          <div className="overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />
            <div className="flex animate-logo-scroll">
              {doubled.map((logo, i) => (
                <div key={`${logo.name}-${i}`} className="flex-shrink-0 flex items-center justify-center px-8 md:px-10 h-14">
                  <div className="flex items-center gap-2">
                    <img
                      src={logo.src}
                      alt={logo.name}
                      className={`h-7 md:h-8 w-auto opacity-60 hover:opacity-100 transition-opacity duration-300 ${logo.invert ? 'brightness-0 invert' : ''}`}
                    />
                    {logo.showLabel && (
                      <span className="font-display text-xs font-bold whitespace-nowrap opacity-60" style={{ color: '#4B6EF5' }}>{logo.name}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Models carousel */}
          <div className="overflow-hidden relative mt-4">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />
            <div className="flex animate-logo-scroll-reverse">
              {doubledAi.map((logo, i) => (
                <div key={`${logo.name}-${i}`} className="flex-shrink-0 flex items-center justify-center px-8 md:px-10 h-14">
                  <div className="flex items-center gap-2">
                    <img
                      src={logo.src}
                      alt={logo.name}
                      className="h-5 md:h-6 w-auto opacity-60 hover:opacity-100 transition-opacity duration-300"
                    />
                    {!(logo as any).hideLabel && (
                      <span className="font-display text-xs font-bold whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity" style={{ color: logo.color }}>{logo.name}</span>
                    )}
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
