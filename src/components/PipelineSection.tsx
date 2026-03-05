import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import pipelineBg from "@/assets/pipeline-bg.jpg";
import workflowTraditional from "@/assets/workflow-traditional.jpg";
import workflowAi from "@/assets/workflow-ai.png";

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
          className="text-sm tracking-[0.3em] uppercase text-primary font-body mb-4 text-center">

          3D Production Pipeline
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-display text-4xl md:text-6xl font-bold text-center mb-6">

          AI across <span className="text-gradient-gold">every stage</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-center max-w-2xl mx-auto mb-20 font-body">

          We identify where generative AI creates the most impact in your content production pipeline—from pre-production through final output.
        </motion.p>

        {/* Traditional Workflow */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8">

          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground font-body mb-6 text-center">
            The traditional 3D production workflow
          </p>
          <div className="relative rounded-2xl overflow-hidden border border-border/50 group">
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40 z-10 pointer-events-none" />
            <img
              src={workflowTraditional}
              alt="Traditional 3D production pipeline showing Pre-Production, Production, and Post-Production stages"
              className="w-full h-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

          </div>
        </motion.div>

        {/* Transition Arrow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col items-center gap-3 my-12">

          <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary/60 to-primary" />
          <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm border border-primary/30 rounded-full px-6 py-3">
            <span className="text-sm font-body text-primary font-semibold tracking-wide">
              Evolving with AI
            </span>
            <ArrowRight className="w-4 h-4 text-primary" />
          </div>
          <div className="w-px h-12 bg-gradient-to-b from-primary via-primary/60 to-transparent" />
        </motion.div>

        {/* AI-Powered Workflow */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}>

          <p className="text-sm tracking-[0.3em] uppercase text-primary font-body mb-6 text-center">THE FUTURE WITH GENERATIVE AI TOOLS

          </p>
          <div className="relative rounded-2xl overflow-hidden border border-primary/30 group glow-gold">
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/30 z-10 pointer-events-none" />
            <img
              src={workflowAi}
              alt="AI-powered studio workflow pipeline with tools like Runway, Sora, Stability AI, Llama, and Claude"
              className="w-full h-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

          </div>
          <p className="text-center max-w-2xl mx-auto mt-8 text-sm text-white font-sans md:text-lg">Startup AI tools are reshaping every stage of the pipeline. We help studios adopt and integrate these tools seamlessly. So, your team stays focused more on what they love to do. 

          </p>
        </motion.div>
      </div>
    </section>);

};

export default PipelineSection;