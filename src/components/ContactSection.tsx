import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import CalendlyModal from "./CalendlyModal";

const ContactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  return (
    <section id="contact" className="py-24 md:py-32 section-padding">
      <div ref={ref} className="max-w-2xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-[11px] tracking-[0.2em] uppercase text-primary font-body mb-3 font-medium"
        >
          Get in Touch
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-display text-3xl md:text-5xl font-bold mb-4"
        >
          Let's find your
          <span className="text-gradient-gold"> three biggest leaks</span> in 30 minutes.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="font-body mb-10 text-sm md:text-base text-white/80 leading-relaxed max-w-lg mx-auto"
        >
          "Most studios are losing $350K per rework cycle without knowing it. In 30 minutes, we'll map exactly where your pipeline is bleeding — and what to fix first. No pitch. No pressure. Just clarity."
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-4"
        >
          <button
            onClick={() => setCalendlyOpen(true)}
            className="btn-chrome-outline px-7 py-3.5 rounded-full font-display font-semibold text-[15px] transition-all min-h-[48px]"
          >
            Book a 30-minute Discovery Meeting
          </button>
          <p className="text-white font-body text-xs">
            *Automatically receive a client-intake form and service package
          </p>
        </motion.div>
      </div>

      <CalendlyModal open={calendlyOpen} onClose={() => setCalendlyOpen(false)} />
    </section>
  );
};

export default ContactSection;
