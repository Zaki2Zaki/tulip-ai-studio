import { motion } from "framer-motion";

interface CurlyArrowProps {
  style?: React.CSSProperties;
}

export default function CurlyArrow({ style }: CurlyArrowProps) {
  return (
    <motion.div
      className="pointer-events-none absolute z-50"
      style={style}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: [1, 1.05, 1],
        rotate: [-8, -3, -8],
        y: [0, -4, 0],
      }}
      exit={{ opacity: 0, scale: 0.7 }}
      transition={{
        opacity: { duration: 0.2 },
        scale:  { repeat: Infinity, duration: 1.8, ease: "easeInOut" },
        rotate: { repeat: Infinity, duration: 1.8, ease: "easeInOut" },
        y:      { repeat: Infinity, duration: 1.8, ease: "easeInOut" },
      }}
    >
      <svg
        width="90"
        height="120"
        viewBox="0 0 90 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#A78BFA" />
            <stop offset="50%"  stopColor="#C084FC" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
        </defs>

        {/* Main curly body */}
        <path
          d="M55 6 C80 8, 85 28, 72 44 C60 58, 38 58, 30 72 C22 86, 28 100, 36 110"
          stroke="url(#arrowGradient)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Arrowhead — left prong */}
        <path
          d="M36 110 L24 98"
          stroke="url(#arrowGradient)"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Arrowhead — right prong */}
        <path
          d="M36 110 L48 100"
          stroke="url(#arrowGradient)"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </motion.div>
  );
}
