// ProblemCarousel_NingH_Authentic.tsx
// Authentic Ning H. scattered card layout from ning-h.com
// Cards rotate and transform on scroll/hover with scattered positioning

import { motion } from 'framer-motion';

interface Challenge {
  id: string;
  number: string;
  headline: string;
  accentText: string;
  description: string;
  citation: string;
  gradientColors: {
    start: string;
    end: string;
  };
  imageText: {
    line1: string;
    line2: string;
  };
  solution: string;
  service: string;
  pricing: string;
}

const challenges: Challenge[] = [
  {
    id: 'fragmented-tools',
    number: '01',
    headline: '40% Pipeline Time Wasted',
    accentText: 'PAIN POINT',
    description: 'Disconnected AI tools force asset redos across Blender → Unreal → Nuke workflows',
    citation: 'https://www.thirdpointventures.com/currents/AI-impact-on-gaming-and-media-tooling/',
    gradientColors: { start: '#ffffff', end: '#ede6f5' },

    imageText: { line1: 'FRAGMENTED', line2: 'AI TOOLING' },
    solution: 'Unified AI workflow wrappers eliminate manual handoffs',
    service: 'AI Pipeline Integration',
    pricing: '$50K–$200K'
  },
  {
    id: 'style-consistency',
    number: '02',
    headline: 'Visual Identity Crisis',
    accentText: 'PAIN POINT',
    description: 'GenAI homogenization destroys unique art styles at 100K+ asset scale',
    citation: 'https://www.hyperstack.cloud/technical-resources/tutorials/how-to-train-generatve-ai-for-3d-models',
    gradientColors: { start: '#ede6f5', end: '#e0cce7' },

    imageText: { line1: '100,000', line2: 'ASSETS DAILY' },
    solution: 'Proprietary studio style models fine-tuned on your artwork',
    service: 'Studio Style Training',
    pricing: '$25K–$350K'
  },
  {
    id: 'motion-capture',
    number: '03',
    headline: '$350K Per Rework Cycle',
    accentText: 'PAIN POINT',
    description: 'Manual mocap cleanup blocks real-time iteration and burns production budgets',
    citation: 'https://www.thirdpointventures.com/currents/AI-impact-on-gaming-and-media-tooling/',
    gradientColors: { start: '#e0cce7', end: '#cac1e7' },
    imageText: { line1: 'MANUAL', line2: 'MOCAP CLEANUP' },
    solution: 'EA-validated pipelines with Rokoko/Tato integration',
    service: 'Motion Capture Integration',
    pricing: '$40K–$150K'
  },
  {
    id: 'tool-paralysis',
    number: '04',
    headline: 'Tool Selection Paralysis',
    accentText: 'PAIN POINT',
    description: 'Wrong GenAI tool choices trigger $100K–$400K rework cycles across the pipeline',
    citation: 'https://www.thirdpointventures.com/currents/AI-impact-on-gaming-and-media-tooling/',
    gradientColors: { start: '#cac1e7', end: '#b0cced' },
    imageUrl: '/images/tool-paralysis.webp',
    imageText: { line1: '20+ TOOLS', line2: 'WHICH TO DEPLOY?' },
    solution: 'Benchmark 10–20 GenAI tools across your pipeline',
    service: 'GenAI Tool Benchmarking',
    pricing: '$15K–$50K'
  },
  {
    id: 'budget-overruns',
    number: '05',
    headline: '50% Budget Overruns',
    accentText: 'PAIN POINT',
    description: 'Underestimated GPU infrastructure costs explode during AI production deployment',
    citation: 'https://d1.awsstatic.com/psc-digital/2025/gc-a4gmt/genai-game-dev/the-2025-aws-guide-to-generative-ai-for-game-developers.pdf',
    gradientColors: { start: '#b0cced', end: '#a2d5e5' },
    imageUrl: '/images/budget-overruns.webp',
    imageText: { line1: 'RENDERING', line2: 'COST EXPLOSION' },
    solution: 'Right-size GPU infrastructure with cost optimization',
    service: 'Cost-Optimal Infrastructure Planning',
    pricing: '$20K–$75K'
  }
];

// Ning H. authentic scattered positions and rotations - full profile visibility
const cardTransforms = [
  { x: '-200%', y: '-25%', rotate: -18, zIndex: 1 },
  { x: '-100%', y: '12%', rotate: 10, zIndex: 3 },
  { x: '0%', y: '-10%', rotate: -5, zIndex: 5 },
  { x: '100%', y: '8%', rotate: 12, zIndex: 2 },
  { x: '200%', y: '-20%', rotate: -15, zIndex: 4 }
];

export default function ProblemCarousel() {
  return (
    <>
      {/* Header Section */}
      {/* Ning H. Scattered Cards Section */}
      <section className="bg-black overflow-x-hidden">
        {/* Title block */}
        <div
          className="container mx-auto px-4 text-center"
          style={{
            paddingTop: '64px',
            paddingBottom: '24px',
            background: '#000000',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 4px 24px rgba(255,255,255,0.06), 0 1px 4px rgba(255,255,255,0.03)',
          }}
        >
          <motion.h1
            className="text-6xl md:text-8xl lg:text-[120px] font-black uppercase tracking-tighter leading-none mb-2 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            CHALLENGES
          </motion.h1>
          <motion.p
            className="text-xs md:text-sm uppercase tracking-[0.15em] font-medium"
            style={{ color: 'rgba(255,255,255,0.45)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            STUDIO'S PRODUCTION CHALLENGES AND BOTTLENECK COSTS
          </motion.p>
        </div>

        {/* Cards */}
        <div className="relative flex items-center justify-center" style={{ height: '460px' }}>
            {challenges.map((challenge, index) => {
              const transform = cardTransforms[index];

              return (
                <motion.a
                  key={challenge.id}
                  href={challenge.citation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute w-[480px] block"
                  style={{ zIndex: transform.zIndex }}
                  initial={{ opacity: 0, scale: 0.8, x: transform.x, y: transform.y, rotate: transform.rotate }}
                  animate={{ opacity: 1, scale: 1, x: transform.x, y: transform.y, rotate: transform.rotate }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ scale: 1.12, rotate: 0, zIndex: 100, transition: { duration: 0.4 } }}
                >
                  {/* Card Container - 4:3 Aspect Ratio */}
                  <div
                    className="relative aspect-[4/3] bg-black overflow-hidden group cursor-pointer"
                    style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.15), 0 10px 20px rgba(0,0,0,0.08)' }}
                  >
                    {/* Gradient/Image Area - Top 70% */}
                    <div
                      className="w-full h-[70%] relative overflow-hidden flex items-center justify-center"
                      style={{ background: `linear-gradient(to bottom, ${challenge.gradientColors.start}, ${challenge.gradientColors.end})` }}
                    >
                      {/* Noise texture */}
                      <div className="absolute inset-0 opacity-5 mix-blend-overlay" style={{ backgroundImage: 'url(/images/noise-texture.png)' }} />
                      {/* Headline centered in gradient area */}
                      <h2
                        className="relative z-10 font-black uppercase tracking-tight text-center px-6 leading-tight"
                        style={{
                          fontSize: 'clamp(22px, 3.5vw, 32px)',
                          color: '#ffffff',
                          textShadow: '0 2px 12px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.5)',
                        }}
                      >
                        {challenge.headline}
                      </h2>
                    </div>

                    {/* Black Bar - Bottom 30% */}
                    <div className="w-full h-[30%] bg-black px-6 py-4 flex flex-col justify-between">
                      {/* Description + Arrow Row */}
                      <div className="flex items-end justify-between gap-3 h-full">
                        <p className="text-xs text-white uppercase tracking-wider leading-relaxed">
                          {challenge.description}
                        </p>
                        {/* Arrow in Circle - fades on hover */}
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ background: '#2B5BA6' }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 28 28" fill="none">
                            <path d="M7.39667 19.005L17.0683 9.33333L10.5583 9.33333C10.2489 9.33333 9.95217 9.21042 9.73338 8.99162C9.51458 8.77283 9.39167 8.47609 9.39167 8.16667C9.39167 7.85725 9.51458 7.5605 9.73338 7.34171C9.95217 7.12292 10.2489 7 10.5583 7L19.8333 7C20.1428 7 20.4395 7.12292 20.6583 7.34171C20.8771 7.5605 21 7.85725 21 8.16667L21 17.5C21 17.8094 20.8771 18.1062 20.6583 18.325C20.4395 18.5438 20.1428 18.6667 19.8333 18.6667H19.8917C19.5822 18.6667 19.2855 18.5438 19.0667 18.325C18.8479 18.1062 18.725 17.8094 18.725 17.5L18.725 11.025L9.08833 20.6617C8.97988 20.771 8.85084 20.8578 8.70867 20.917C8.5665 20.9763 8.41401 21.0068 8.26 21.0068C8.10599 21.0068 7.9535 20.9763 7.81133 20.917C7.66916 20.8578 7.54012 20.771 7.43167 20.6617C7.31999 20.5555 7.23045 20.4283 7.16819 20.2874C7.10594 20.1465 7.07221 19.9946 7.06896 19.8406C7.0657 19.6866 7.09299 19.5335 7.14923 19.39C7.20548 19.2466 7.28958 19.1158 7.39667 19.005Z" fill="white"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.a>
              );
            })}
        </div>
      </section>
    </>
  );
}
