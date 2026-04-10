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
  imageUrl?: string;  // Optional: actual image URL
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
    citation: 'Third Point Ventures, AI Impact on Gaming and Media Tooling, 2025',
    gradientColors: { start: '#ffffff', end: '#ede6f5' },  // #ffffff → #f5f3fa → #ede6f5
    imageUrl: '/images/fragmented-tools.webp',
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
    citation: 'Hyperstack, How to Train Generative AI for 3D Models, 2025',
    gradientColors: { start: '#ede6f5', end: '#e0cce7' },  // #ede6f5 → #e6d9ee → #e0cce7
    imageUrl: '/images/style-consistency.webp',
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
    citation: 'Third Point Ventures, AI Impact on Gaming and Media Tooling, 2025',
    gradientColors: { start: '#e0cce7', end: '#cac1e7' },  // #e0cce7 → #d9c8e7 → #d2c4e7 → #cac1e7
    imageUrl: '/images/motion-capture.webp',
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
    citation: 'Third Point Ventures, AI Impact on Gaming and Media Tooling, 2025',
    gradientColors: { start: '#cac1e7', end: '#b0cced' },  // #cac1e7 → #bcc7ec → #b0cced
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
    citation: 'AWS, The 2025 Guide to Generative AI for Game Developers',
    gradientColors: { start: '#b0cced', end: '#a2d5e5' },  // #b0cced → #a7d1eb → #a2d5e5
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
      <section className="bg-[#f0ebe5] py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            className="text-6xl md:text-8xl lg:text-[120px] font-black uppercase tracking-tighter leading-none mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            CHALLENGES
          </motion.h1>
          <motion.p
            className="text-xs md:text-sm uppercase tracking-[0.15em] text-gray-600 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            PRODUCTION BOTTLENECKS COSTING YOUR STUDIO MILLIONS
          </motion.p>
        </div>
      </section>

      {/* Ning H. Scattered Cards Section */}
      <section className="bg-[#f0ebe5] pt-4 pb-32 relative overflow-x-hidden min-h-[1400px]">
        <div className="container mx-auto px-4">
          <div className="relative h-[1100px] flex items-center justify-center">
            {challenges.map((challenge, index) => {
              const transform = cardTransforms[index];

              return (
                <motion.a
                  key={challenge.id}
                  href={`/services/${challenge.id}`}
                  className="absolute w-[520px] block"
                  style={{
                    left: '50%',
                    top: '50%',
                    zIndex: transform.zIndex,
                  }}
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                    x: transform.x,
                    y: transform.y,
                    rotate: transform.rotate
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: transform.x,
                    y: transform.y,
                    rotate: transform.rotate
                  }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  whileHover={{
                    scale: 1.12,
                    rotate: 0,
                    zIndex: 100,
                    transition: { duration: 0.4 }
                  }}
                >
                  {/* Card Container - Exact Ning H. Style: 4:3 Aspect Ratio */}
                  <div
                    className="relative aspect-[4/3] bg-black overflow-hidden transition-all duration-500 group cursor-pointer"
                    style={{
                      boxShadow: `
                        0 25px 50px rgba(0, 0, 0, 0.15),
                        0 10px 20px rgba(0, 0, 0, 0.08)
                      `
                    }}
                  >
                    {/* Image Section - Top 70% */}
                    <div
                      className="w-full h-[70%] relative overflow-hidden"
                      style={{
                        background: `linear-gradient(to bottom, ${challenge.gradientColors.start}, ${challenge.gradientColors.end})`
                      }}
                    >
                      {challenge.imageUrl && (
                        <img
                          src={challenge.imageUrl}
                          alt={challenge.headline}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                      {/* Subtle noise/grain texture */}
                      <div
                        className="absolute inset-0 opacity-5 mix-blend-overlay"
                        style={{ backgroundImage: 'url(/images/noise-texture.png)' }}
                      />
                    </div>

                    {/* Black Title Bar - Bottom 30% */}
                    <div className="w-full h-[30%] bg-black px-8 py-6 flex flex-col justify-between">
                      {/* Title */}
                      <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-tight">
                        {challenge.headline}
                      </h2>

                      {/* Description + Arrow Row */}
                      <div className="flex items-end justify-between">
                        <p className="text-[10px] text-white uppercase tracking-wider leading-relaxed max-w-[280px]">
                          {challenge.description}
                        </p>

                        {/* Arrow in Circle - Bottom Right */}
                        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: '#2B5BA6' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 28 28" fill="none">
                            <path d="M7.39667 19.005L17.0683 9.33333L10.5583 9.33333C10.2489 9.33333 9.95217 9.21042 9.73338 8.99162C9.51458 8.77283 9.39167 8.47609 9.39167 8.16667C9.39167 7.85725 9.51458 7.5605 9.73338 7.34171C9.95217 7.12292 10.2489 7 10.5583 7L19.8333 7C20.1428 7 20.4395 7.12292 20.6583 7.34171C20.8771 7.5605 21 7.85725 21 8.16667L21 17.5C21 17.8094 20.8771 18.1062 20.6583 18.325C20.4395 18.5438 20.1428 18.6667 19.8333 18.6667H19.8917C19.5822 18.6667 19.2855 18.5438 19.0667 18.325C18.8479 18.1062 18.725 17.8094 18.725 17.5L18.725 11.025L9.08833 20.6617C8.97988 20.771 8.85084 20.8578 8.70867 20.917C8.5665 20.9763 8.41401 21.0068 8.26 21.0068C8.10599 21.0068 7.9535 20.9763 7.81133 20.917C7.66916 20.8578 7.54012 20.771 7.43167 20.6617C7.31999 20.5555 7.23045 20.4283 7.16819 20.2874C7.10594 20.1465 7.07221 19.9946 7.06896 19.8406C7.0657 19.6866 7.09299 19.5335 7.14923 19.39C7.20548 19.2466 7.28958 19.1158 7.39667 19.005Z"
                            fill="white"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
