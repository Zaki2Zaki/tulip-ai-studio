import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

import unrealLogo from "@/assets/logos/unreal-engine.svg";
import blenderLogo from "@/assets/logos/blender.svg";
import unityLogo from "@/assets/logos/unity.svg";
import godotLogo from "@/assets/logos/godot.svg";

const logos = [
  { src: unrealLogo, name: "Unreal Engine" },
  { src: blenderLogo, name: "Blender" },
  { src: unityLogo, name: "Unity" },
  { name: "AUTODESK Maya", text: true },
  { name: "Cinema 4D", text: true },
  { src: godotLogo, name: "Godot" },
  { name: "Houdini", text: true },
  { name: "Substance 3D", text: true },
];

const WhyTulipSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  // Double the logos for seamless infinite scroll
  const doubled = [...logos, ...logos];

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
          Innovation, both{" "}
          <span className="text-gradient-gold">functional</span> and poetic
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-white font-semibold font-sans">
          We're focused on flow, adoption and integration for our tools. Aiming for seamlessly into existing pipelines, delivering production-ready work via API for scalable, automated pipelines.
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
                  {logo.text ? (
                    <span className="font-display text-lg md:text-xl font-bold text-muted-foreground whitespace-nowrap opacity-70 hover:opacity-100 transition-opacity">
                      {logo.name}
                    </span>
                  ) : (
                    <img
                      src={logo.src}
                      alt={logo.name}
                      className="h-8 md:h-10 w-auto brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
                    />
                  )}
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