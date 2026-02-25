import { motion, useInView } from "framer-motion";
import { useRef } from "react";


const ContactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="py-32 section-padding">
      <div ref={ref} className="max-w-3xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-sm tracking-[0.3em] uppercase text-primary font-body mb-4">

          Get in Touch
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-display text-4xl md:text-6xl font-bold mb-6">

          Let's build the <span className="text-gradient-gold">future</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="font-body mb-12 text-lg text-sky-50">

          Ready to build systems that help you grow without the chaos. Let's collaborate on your product vision, strategy, and roadmap for intelligent tool-sets, aligning on objectives, OKRs and KPIs.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-6">

          <a
            href="#"
            className="btn-chrome-outline px-8 py-4 rounded-full font-display font-semibold text-lg transition-all">

            Book a 30-minute Discovery Meeting
          </a>
          <p className="text-muted-foreground font-body text-sm">*Automatically receive a client-intake form and service package to review

          </p>
        </motion.div>
      </div>
    </section>);

};

export default ContactSection;