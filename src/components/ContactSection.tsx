import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import CalendlyBookingButton from "./CalendlyBookingButton";

const ContactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="py-24 md:py-32 section-padding">
      <div ref={ref} className="max-w-6xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-sm tracking-[0.3em] uppercase text-gray-400 font-body mb-6"
        >
          Get in Touch
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-10 text-gray-100"
        >
          Let's find your{" "}
          <span className="text-gradient-gold">three biggest leaks</span>{" "}
          in 30 minutes.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="font-body mb-10 text-xl md:text-2xl lg:text-3xl text-gray-300 leading-relaxed max-w-5xl mx-auto"
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
            className="btn-chrome-outline px-20 py-10 rounded-full font-display font-semibold text-[40px] transition-all min-h-[120px] text-white"
          >
            Book a 30-minute Discovery Meeting
          </button>
          <p className="text-white font-body text-xs">
            *Automatically receive a client-intake form and service package
          </p>
          <p className="text-white font-body text-base mt-1">
            No Obligation. The discovery meeting is complimentary.
          </p>
        </motion.div>
      </div>

      <CalendlyModal open={calendlyOpen} onClose={() => setCalendlyOpen(false)} />
    </section>
  );
};

export default ContactSection;
