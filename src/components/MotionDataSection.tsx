import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Database, Target, Handshake } from "lucide-react";

const llmModels = [
  { provider: "AI21 Labs", model: "Jurassic", desc: "Contextual answers, summarization, paraphrasing", color: "hsl(200 90% 75%)" },
  { provider: "Amazon", model: "Amazon Titan", desc: "Text summarization, generation, Q&A, search", color: "hsl(220 80% 70%)" },
  { provider: "Anthropic", model: "Claude", desc: "Summarization, complex reasoning, writing, coding", color: "hsl(260 85% 75%)" },
  { provider: "Cohere", model: "Command + Embed", desc: "Text generation, search, classification", color: "hsl(280 70% 70%)" },
  { provider: "Meta", model: "Llama 2", desc: "Q&A and reading comprehension", color: "hsl(320 60% 70%)" },
  { provider: "Stability.ai", model: "Stable Diffusion", desc: "High-quality images and art", color: "hsl(80 70% 60%)" },
];

const engagements = [
  {
    icon: Database,
    title: "Pre-built datasets",
    description: "Curated datasets for common application areas.",
  },
  {
    icon: Target,
    title: "Custom data programs",
    description: "Targeted capture and generation aligned to specific behaviors.",
  },
  {
    icon: Handshake,
    title: "Ongoing data partnerships",
    description: "Long-term programs supporting model training and iteration.",
  },
];

const MotionDataSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto section-padding">
        {/* Header */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-sm tracking-[0.3em] uppercase text-primary font-body mb-4 text-center"
        >
          Motion Data & LLM Foundations
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-display text-4xl md:text-6xl font-bold text-center mb-6"
        >
          We customize <span className="text-gradient-gold">LLM foundations</span> and{" "}
          <span className="text-gradient-chrome-animated">Motion data</span> for insight
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-muted-foreground font-body text-base md:text-lg leading-relaxed max-w-4xl mx-auto text-center mb-6"
        >
          We capture, generate, and transform motion into structured, reusable datasets that can be used to train models,
          evaluate behavior, simulate interaction, or derive insight — independent of any specific character, animation,
          or render pipeline.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="text-primary/80 font-body text-sm md:text-base leading-relaxed max-w-3xl mx-auto text-center mb-20"
        >
          Structured, high-fidelity human motion data for training, analysis, and simulation across physical and digital systems.
        </motion.p>

        {/* LLM Foundation Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-24"
        >
          <h3 className="font-display text-xl md:text-2xl font-semibold text-center mb-12 text-foreground/90">
            Broad choice of <span className="text-gradient-gold">models</span>
          </h3>

          {/* Timeline */}
          <div className="relative">
            {/* Gradient line */}
            <div className="hidden md:block absolute top-[52px] left-0 right-0 h-[2px]"
              style={{
                background: "linear-gradient(90deg, hsl(200 90% 75%), hsl(260 85% 75%), hsl(320 60% 70%), hsl(80 70% 60%))",
              }}
            />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-4">
              {llmModels.map((item, i) => (
                <motion.div
                  key={item.model}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
                  className="flex flex-col items-center text-center"
                >
                  <p className="text-xs font-body text-muted-foreground mb-3 tracking-wide uppercase">
                    {item.provider}
                  </p>

                  {/* Dot */}
                  <div
                    className="w-3 h-3 rounded-full mb-3 shrink-0"
                    style={{ backgroundColor: item.color, boxShadow: `0 0 12px ${item.color}` }}
                  />

                  <p className="font-display text-sm font-semibold mb-1" style={{ color: item.color }}>
                    {item.model}
                  </p>
                  <p className="text-xs text-muted-foreground font-body leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Engagements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h3 className="font-display text-2xl md:text-3xl font-semibold text-center mb-4">
            Flexible engagements,{" "}
            <span className="text-gradient-gold">from single datasets to partnerships</span>
          </h3>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {engagements.map((eng, i) => (
              <motion.div
                key={eng.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
                className="group bg-card/50 border border-border hover:border-primary/30 rounded-2xl p-8 transition-all duration-500 hover:glow-gold text-center"
              >
                <eng.icon className="w-8 h-8 text-primary mb-5 mx-auto group-hover:scale-110 transition-transform" />
                <h4 className="font-display text-lg font-semibold mb-3">{eng.title}</h4>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">{eng.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MotionDataSection;
