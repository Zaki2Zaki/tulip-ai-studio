import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import pipelineBg from "@/assets/pipeline-bg.jpg";

const stages = [
  "Layout",
  "Modeling",
  "Texturing",
  "Rigging",
  "Animation",
  "VFX",
  "Lighting",
  "Compositing",
  "Rendering",
];

const PipelineSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pipeline" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <img src={pipelineBg} alt="" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      </div>

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto section-padding">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-sm tracking-[0.3em] uppercase text-primary font-body mb-4 text-center"
        >
          3D Production Pipeline
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-display text-4xl md:text-6xl font-bold text-center mb-6"
        >
          AI across <span className="text-gradient-gold">every stage</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-center max-w-2xl mx-auto mb-16 font-body"
        >
          We identify where generative AI creates the most impact in your content production pipeline—from pre-production through final output.
        </motion.p>

        {/* Pipeline visualization */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-0 md:flex-nowrap">
          {stages.map((stage, i) => (
            <motion.div
              key={stage}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative group"
            >
              <div className="bg-card border border-border group-hover:border-primary/50 rounded-xl px-4 py-6 md:px-5 md:py-8 text-center transition-all duration-300 group-hover:glow-gold min-w-[100px]">
                <div className="w-3 h-3 rounded-full bg-primary/40 group-hover:bg-primary mx-auto mb-3 transition-colors animate-glow-pulse" />
                <span className="font-body text-xs md:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {stage}
                </span>
              </div>
              {i < stages.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-[1px] w-[2px] h-4 bg-primary/20" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Phase labels */}
        <div className="flex justify-between mt-8 max-w-4xl mx-auto">
          {["Pre-Production", "Production", "Post-Production"].map((phase) => (
            <span key={phase} className="text-xs tracking-widest uppercase text-muted-foreground font-body">
              {phase}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PipelineSection;
