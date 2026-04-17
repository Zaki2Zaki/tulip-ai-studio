import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Database, Target, Handshake } from "lucide-react";

const llmModels = [
  { provider: "AI21 Labs", model: "Jurassic", desc: "Contextual answers, summarization, paraphrasing", color: "hsl(200 90% 75%)" },
  { provider: "Amazon", model: "Amazon Titan", desc: "Text summarization, generation, Q&A, search", color: "hsl(220 80% 70%)" },
  { provider: "Anthropic", model: "Claude", desc: "Summarization, complex reasoning, writing, coding", color: "hsl(260 85% 75%)" },
  { provider: "Cohere", model: "Command + Embed", desc: "Text generation, search, classification", color: "hsl(280 70% 70%)" },
  { provider: "Meta", model: "Llama 2", desc: "Q&A and reading comprehension", color: "hsl(320 60% 70%)" },
  { provider: "Stability.ai", model: "Stable Diffusion", desc: "High-quality images\nand art", color: "hsl(80 70% 60%)" },
];

const engagements = [
  { icon: Database, title: "Pre-built datasets", description: "Curated datasets for common application areas." },
  { icon: Target, title: "Custom data programs", description: "Targeted capture and generation aligned to specific behaviors." },
  { icon: Handshake, title: "Ongoing data partnerships", description: "Long-term programs supporting model training and iteration." },
];

const MotionDataSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative pt-24 md:pt-32 pb-6">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto section-padding">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-sm tracking-[0.3em] uppercase text-gray-400 font-body mb-6 text-center"
        >
          Motion Data & LLM Foundations
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-10 text-gray-100"
        >
          We customize <span className="text-gradient-gold">LLM foundations</span> and{" "}
          <span className="text-gradient-chrome-animated">Motion data</span> for insight
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-body text-xl md:text-2xl lg:text-3xl leading-relaxed max-w-5xl mx-auto text-center mb-6 text-gray-300"
        >
          We capture, generate, and transform motion into structured, reusable datasets that can be used to train models,
          evaluate behavior, simulate interaction, or derive insight.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="font-body text-xl md:text-2xl lg:text-3xl leading-relaxed max-w-5xl mx-auto text-center mb-16 text-gray-300"
        >
          Structured, high-fidelity human motion data for training, analysis, and simulation across physical and digital systems.
        </motion.p>

        {/* LLM Foundation Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-20"
        >
          <h3 className="font-display text-lg md:text-xl font-semibold text-center mb-10 text-white/80">
            Broad choice of <span className="text-gradient-gold">models</span>
          </h3>

          <div className="relative">
            <div
              className="hidden md:block absolute top-[44px] left-0 right-0 h-[1px]"
              style={{ background: "linear-gradient(90deg, hsl(200 90% 75%), hsl(260 85% 75%), hsl(320 60% 70%), hsl(80 70% 60%))" }}
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 md:gap-3">
              {llmModels.map((item, i) => (
                <motion.div
                  key={item.model}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.06 }}
                  className="flex flex-col items-center text-center"
                >
                  <p className="text-[10px] font-body text-white mb-2 tracking-wide uppercase">{item.provider}</p>
                  <div className="w-2.5 h-2.5 rounded-full mb-2 shrink-0" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }} />
                  <p className="font-display text-xs font-semibold mb-0.5" style={{ color: item.color }}>{item.model}</p>
                  <p className="text-white leading-relaxed font-body text-[11px] whitespace-pre-line">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Engagements */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h3 className="font-display text-xl md:text-2xl font-semibold text-center mb-3">
            Flexible engagements,{" "}
            <span className="text-gradient-gold">from single datasets to partnerships</span>
          </h3>

          <div className="grid md:grid-cols-3 gap-4 mt-10">
            {engagements.map((eng, i) => (
              <motion.div
                key={eng.title}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.08 }}
                className="group bg-card/40 border border-border/60 hover:border-primary/25 rounded-2xl p-6 transition-all duration-400 hover:bg-card/60 text-center"
              >
                <eng.icon className="w-6 h-6 text-primary mb-4 mx-auto group-hover:scale-105 transition-transform duration-300" />
                <h4 className="font-display text-base font-semibold mb-2">{eng.title}</h4>
                <p className="text-white font-body text-sm leading-relaxed">{eng.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MotionDataSection;
