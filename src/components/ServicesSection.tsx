import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Search, Layers, Box, LayoutDashboard, Plug, GraduationCap } from "lucide-react";
import servicesBg from "@/assets/services-bg.jpg";

const services = [
  {
    icon: Search,
    title: "GenAI Research",
    description: "Identify pipeline pain points and align cutting-edge AI tools to your studio's specific needs.",
    range: "$5K – $110K",
  },
  {
    icon: Layers,
    title: "Tool Benchmarking",
    description: "Test, validate and compare gen AI tools in sandbox environments with proven use cases.",
    range: "$5K – $130K",
  },
  {
    icon: Box,
    title: "Demos & Sandboxes",
    description: "Hands-on prototypes demonstrating AI capabilities tailored to your production pipeline.",
    range: "$3K – $120K",
  },
  {
    icon: LayoutDashboard,
    title: "Architecture Blueprint",
    description: "Full GenAI architecture design including LLM data model training and quality assurance.",
    range: "$12K – $350K",
  },
  {
    icon: Plug,
    title: "Adoption & Integration",
    description: "End-to-end integration of AI tools into your studio's workflows and production pipelines.",
    range: "$20K – $600K+",
  },
  {
    icon: GraduationCap,
    title: "Workshops & Education",
    description: "Certified training by Unreal & Unity educators to empower your team with AI skills.",
    range: "$3K – $85K",
  },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="relative py-32">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={servicesBg} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto section-padding">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-sm tracking-[0.3em] uppercase text-primary font-body mb-4 text-center"
        >
          Our Services
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-display text-4xl md:text-6xl font-bold text-center mb-16"
        >
          What we <span className="text-gradient-gold">deliver</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group bg-card/50 border border-border hover:border-primary/30 rounded-2xl p-8 transition-all duration-500 hover:glow-gold"
            >
              <service.icon className="w-8 h-8 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-display text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4">
                {service.description}
              </p>
              <div className="text-primary font-display font-semibold text-sm">{service.range} USD</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
