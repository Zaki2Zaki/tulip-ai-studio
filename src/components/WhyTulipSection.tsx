import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const WhyTulipSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

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
          className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-white font-semibold font-sans">We're focused on flow, adoption and integration for our tools. Aiming for seamlessly into existing pipelines, delivering production-ready work via
API for scalable, automated pipelines. 

        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">

          {[
          { value: "8+", label: "Years Experience" },
          { value: "AAA", label: "Game Studios" },
          { value: "AI", label: "First Approach" },
          { value: "Global", label: "Reach" }].
          map((stat) =>
          <div key={stat.label} className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-gradient-gold mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-body">{stat.label}</div>
            </div>
          )}
        </motion.div>
      </div>
    </section>);

};

export default WhyTulipSection;