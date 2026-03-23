import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Search, Layers, Box, LayoutDashboard, Plug, GraduationCap } from "lucide-react";
import servicesBg from "@/assets/services-bg.jpg";

const services = [
  { icon: Search, title: "GenAI Research", description: "Identify pipeline pain points and align cutting-edge AI tools to your studio's specific needs.", range: "$5K – $110K" },
  { icon: Layers, title: "Tool Benchmarking", description: "Test, validate and compare gen AI tools in sandbox environments with proven use cases.", range: "$5K – $130K" },
  { icon: Box, title: "Demos & Sandboxes", description: "Hands-on prototypes demonstrating AI capabilities relevant to your production pipeline.", range: "$3K – $120K" },
  { icon: LayoutDashboard, title: "Architecture Blueprint", description: "GenAI architecture recommendations including tool selection, data pipeline guidance, and quality criteria — scope defined collaboratively based on studio goals.", range: "$12K – $350K" },
  { icon: Plug, title: "Adoption & Integration", description: "Guidance and support for integrating AI tools into your studio's existing workflows and production pipelines.", range: "$20K – $600K+" },
  { icon: GraduationCap, title: "Workshops & Education", description: "Certified training led by certified Unreal Educators or VFX/Game-Developers to empower your team with AI creative skills.", range: "$3K – $85K" },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="absolute inset-0">
        <img src={servicesBg} alt="" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto section-padding">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-[11px] tracking-[0.2em] uppercase text-primary font-body mb-3 text-center font-medium"
        >
          Our Services
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-display text-3xl md:text-5xl font-bold text-center mb-4"
        >
          What we <span className="text-gradient-gold">deliver</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="text-center text-muted-foreground font-body text-sm mb-12 max-w-lg mx-auto"
        >
          End-to-end GenAI integration services, from research through production deployment.
        </motion.p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group bg-card/40 border border-border/60 hover:border-primary/25 rounded-2xl p-6 transition-all duration-400 hover:bg-card/60"
            >
              <service.icon className="w-6 h-6 text-primary mb-4 group-hover:scale-105 transition-transform duration-300" />
              <h3 className="font-display text-base font-semibold mb-2">{service.title}</h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed whitespace-pre-line">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
