import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingScrollTop from "@/components/FloatingScrollTop";
import StageTabs, { type StageId } from "@/components/case-studies/StageTabs";
import CaseStudyDiagram from "@/components/case-studies/CaseStudyDiagram";

const stageData: Record<StageId, {
  blocks: { id: string; label: string; color: string; hoverTitle: string; hoverDescription: string; hoverMetric?: string }[];
  capabilities: string[];
  buildingBlocks: string[];
}> = {
  "pre-production": {
    blocks: [
      { id: "concept", label: "Concept Art & Prototyping", color: "bg-[hsl(270_40%_15%/0.6)]", hoverTitle: "AI-Assisted Concept Generation", hoverDescription: "Rapid visual prototyping using AI to explore hundreds of variations in hours, not weeks.", hoverMetric: "10x faster iteration" },
      { id: "storyboard", label: "Storyboarding & Previz", color: "bg-[hsl(220_40%_15%/0.6)]", hoverTitle: "Automated Previz Pipeline", hoverDescription: "AI-driven storyboard-to-previz workflow with camera angle suggestions and pacing analysis.", hoverMetric: "60% time savings" },
      { id: "planning", label: "Technical Planning", color: "bg-[hsl(160_40%_15%/0.6)]", hoverTitle: "Pipeline Architecture Design", hoverDescription: "Data-driven tool selection and pipeline architecture optimized for your team's specific needs." },
    ],
    capabilities: ["Concept Exploration", "Style Transfer", "Previz Automation", "Pipeline Design"],
    buildingBlocks: ["Stable Diffusion", "ComfyUI", "Unity Muse", "Custom LoRA Training"],
  },
  production: {
    blocks: [
      { id: "modeling", label: "3D Modeling + Rigging", color: "bg-[hsl(270_40%_15%/0.6)]", hoverTitle: "Baked-Quality Art in Dynamic Environments", hoverDescription: "Artist tools that enable stunning visuals at production scale — Hardspace: Shipbreaker shipped baked-quality art in fully dynamic, destructible zero-G environments.", hoverMetric: "Production-ready quality" },
      { id: "vfx", label: "VFX + Lighting + Collisions", color: "bg-[hsl(220_40%_15%/0.6)]", hoverTitle: "Physically Accurate Zero-G Behaviors", hoverDescription: "Custom physics and VFX systems delivering physically accurate behaviors — every object responds to zero-G forces with artist-tunable controls.", hoverMetric: "Physically accurate simulation" },
      { id: "collab", label: "Team Collaboration", color: "bg-[hsl(160_40%_15%/0.6)]", hoverTitle: "~25 Artists, 4 Years, Zero Friction", hoverDescription: "Streamlined collaboration workflows enabling a team of ~25 artists to ship a AAA-quality title in 4 years with minimal pipeline friction.", hoverMetric: "~25 artists, 4-year cycle" },
    ],
    capabilities: ["Real-time Rendering", "Physics Simulation", "Asset Pipeline", "Version Control", "Artist Tools"],
    buildingBlocks: ["Unity HDRP", "Custom Shaders", "Addressable Assets", "CI/CD Pipeline"],
  },
  "post-production": {
    blocks: [
      { id: "polish", label: "Visual Polish & Compositing", color: "bg-[hsl(270_40%_15%/0.6)]", hoverTitle: "AI-Enhanced Post-Processing", hoverDescription: "Machine learning-driven color grading, denoising, and compositing for final frame quality.", hoverMetric: "40% faster final pass" },
      { id: "qa", label: "QA & Testing", color: "bg-[hsl(220_40%_15%/0.6)]", hoverTitle: "Automated Visual Regression", hoverDescription: "AI-powered visual QA that catches rendering artifacts, LOD issues, and visual regressions automatically." },
      { id: "deploy", label: "Optimization & Delivery", color: "bg-[hsl(160_40%_15%/0.6)]", hoverTitle: "Performance Profiling", hoverDescription: "Automated performance profiling and optimization recommendations for target platforms.", hoverMetric: "Stable 60fps delivery" },
    ],
    capabilities: ["Color Grading", "Denoising", "Visual QA", "Performance Profiling"],
    buildingBlocks: ["ONNX Runtime", "Custom ML Models", "Automated Testing", "Platform SDKs"],
  },
};

const CaseStudyProductionPage = () => {
  const [activeStage, setActiveStage] = useState<StageId>("production");
  const data = stageData[activeStage];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-40 pb-12 section-padding">
        <div className="max-w-5xl mx-auto">
          {/* Back link */}
          <Link
            to="/case-studies"
            className="inline-flex items-center gap-2 text-sm font-body text-white hover:text-primary transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Case Studies
          </Link>

          {/* Hero title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display font-bold mb-4 case-study-hero-title"
          >
            Hardspace: Shipbreaker — Unity Artist Tools That Shipped Stunning Zero-G Visuals
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base text-white font-body max-w-3xl mb-4"
          >
            How a team of ~25 artists used custom Unity tools and AI-assisted workflows to create a visually stunning zero-gravity salvage simulator.
          </motion.p>

          <p className="text-xs text-white/60 font-body mb-12">
            Citation: Unity for Games Case Study "Hardspace: Shipbreaker" (2020)
          </p>

          {/* Stage tabs */}
          <div className="mb-12">
            <StageTabs active={activeStage} onChange={setActiveStage} />
          </div>

          {/* Diagram */}
          <CaseStudyDiagram
            blocks={data.blocks}
            capabilities={data.capabilities}
            buildingBlocks={data.buildingBlocks}
          />
        </div>
      </section>

      {/* Footer navigation */}
      <div className="max-w-5xl mx-auto section-padding pb-12">
        <div className="flex items-center justify-between border-t border-border pt-8">
          <Link
            to="/case-studies/pre-production"
            className="inline-flex items-center gap-2 text-sm font-body text-white hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Pre-Production
          </Link>
          <Link
            to="/case-studies/post-production"
            className="inline-flex items-center gap-2 text-sm font-body text-white hover:text-primary transition-colors"
          >
            Post-Production <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <Footer />
      <FloatingScrollTop />
    </main>
  );
};

export default CaseStudyProductionPage;
