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
        scale: [1, 1.08, 1],
        rotate: [-8, -3, -8],
      }}
      exit={{ opacity: 0, scale: 0.7 }}
      transition={{
        opacity: { duration: 0.2 },
        scale: { repeat: Infinity, duration: 1.4, ease: "easeInOut" },
        rotate: { repeat: Infinity, duration: 1.4, ease: "easeInOut" },
      }}
    >
      <svg
        width="64"
        height="84"
        viewBox="0 0 64 84"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Curly body */}
        <path
          d="M32 6 C48 8, 56 22, 50 36 C46 46, 36 50, 30 58 C27 63, 28 70, 28 70"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.9"
        />
        {/* Arrowhead */}
        <path
          d="M28 70 L20 61"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M28 70 L37 63"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
    </motion.div>
  );
}
