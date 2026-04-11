import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingScrollTop from "@/components/FloatingScrollTop";
import CaseStudyDiagram from "@/components/case-studies/CaseStudyDiagram";

const pageData: Record<string, {
  title: string;
  subtitle: string;
  blocks: { id: string; label: string; color: string; hoverTitle: string; hoverDescription: string; hoverMetric?: string }[];
  capabilities: string[];
  buildingBlocks: string[];
  prevLink: { to: string; label: string };
  nextLink: { to: string; label: string };
}> = {
  "pre-production": {
    title: "Pre-Production Breakthroughs",
    subtitle: "Coming soon — detailed breakdowns of how we've helped game studios, VFX houses, and animation teams transform their pre-production pipelines with AI.",
    blocks: [
      { id: "storyboard", label: "AI Storyboard Automation", color: "bg-[hsl(270_40%_15%/0.6)]", hoverTitle: "Key Moments Visualization", hoverDescription: "AI-powered storyboard generation from script analysis — visualizing key narrative moments in silent-film style planning sequences.", hoverMetric: "Coming Q4 2026" },
      { id: "concept", label: "Concept Art Generation", color: "bg-[hsl(220_40%_15%/0.6)]", hoverTitle: "Rapid Visual Exploration", hoverDescription: "Generate hundreds of concept art variations matching your studio's art direction in minutes, not days." },
      { id: "previz", label: "Automated Previz", color: "bg-[hsl(160_40%_15%/0.6)]", hoverTitle: "Script-to-Scene Pipeline", hoverDescription: "Transform written descriptions into 3D previz sequences with AI-suggested camera work and staging." },
    ],
    capabilities: ["Script Analysis", "Style Transfer", "Camera AI", "Previz Automation"],
    buildingBlocks: ["Custom Diffusion Models", "ControlNet", "Scene Understanding", "Motion Planning"],
    prevLink: { to: "/case-studies/post-production", label: "Post-Production" },
    nextLink: { to: "/case-studies/production", label: "Production" },
  },
  "post-production": {
    title: "Post-Production Polish Innovations",
    subtitle: "Coming soon — detailed breakdowns of how we've helped game studios, VFX houses, and animation teams transform their post-production with AI.",
    blocks: [
      { id: "render", label: "AI Render Polish", color: "bg-[hsl(270_40%_15%/0.6)]", hoverTitle: "ML-Powered Denoising & Upscaling", hoverDescription: "Production-quality denoising and super-resolution that cuts render times by 70% while maintaining artistic intent.", hoverMetric: "Coming Q4 2026" },
      { id: "composite", label: "Smart Compositing", color: "bg-[hsl(220_40%_15%/0.6)]", hoverTitle: "AI-Assisted Layer Blending", hoverDescription: "Intelligent compositing that understands scene depth, lighting, and materials for photorealistic integration." },
      { id: "color", label: "Adaptive Color Grading", color: "bg-[hsl(160_40%_15%/0.6)]", hoverTitle: "Scene-Aware Color Science", hoverDescription: "AI color grading that maintains consistency across shots while respecting the creative intent of each scene." },
    ],
    capabilities: ["Denoising", "Super-Resolution", "Compositing AI", "Color Science"],
    buildingBlocks: ["ONNX Runtime", "Custom GANs", "OpenEXR Pipeline", "ACES Color Management"],
    prevLink: { to: "/case-studies/production", label: "Production" },
    nextLink: { to: "/case-studies/pre-production", label: "Pre-Production" },
  },
};

const CaseStudyComingSoonPage = () => {
  const { stage } = useParams<{ stage: string }>();
  const data = pageData[stage || "pre-production"] || pageData["pre-production"];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-40 pb-12 section-padding">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/case-studies"
            className="inline-flex items-center gap-2 text-sm font-body text-white hover:text-primary transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Case Studies
          </Link>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm tracking-[0.3em] uppercase text-primary font-body mb-4"
          >
            Case Studies
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-4xl md:text-6xl font-bold mb-6"
          >
            Real Results for{" "}
            <span className="text-gradient-gold">Creative Teams</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-white font-body max-w-2xl mb-16"
          >
            {data.subtitle}
          </motion.p>

          {/* Coming soon diagram */}
          <CaseStudyDiagram
            blocks={data.blocks}
            capabilities={data.capabilities}
            buildingBlocks={data.buildingBlocks}
            comingSoon
          />
        </div>
      </section>

      <div className="max-w-5xl mx-auto section-padding pb-12">
        <div className="flex items-center justify-between border-t border-border pt-8">
          <Link
            to={data.prevLink.to}
            className="inline-flex items-center gap-2 text-sm font-body text-white hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {data.prevLink.label}
          </Link>
          <Link
            to={data.nextLink.to}
            className="inline-flex items-center gap-2 text-sm font-body text-white hover:text-primary transition-colors"
          >
            {data.nextLink.label} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <Footer />
      <FloatingScrollTop />
    </main>
  );
};

export default CaseStudyComingSoonPage;
