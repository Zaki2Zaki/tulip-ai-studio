import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

const FloatingScrollTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-10 right-10 z-50 flex flex-col items-center gap-1 cursor-pointer group"
          aria-label="Scroll to top"
        >
          <div className="w-12 h-12 rounded-full bg-card/80 backdrop-blur-md border border-border/50 flex items-center justify-center group-hover:border-primary/50 transition-all duration-300 group-hover:shadow-[0_0_20px_-4px_hsl(260_80%_70%/0.4)]">
            <span className="font-display text-xs font-bold tracking-tight text-foreground">T</span>
            <span className="font-display text-xs font-bold text-gradient-gold">T</span>
          </div>
          <ArrowUp className="w-4 h-4 text-[hsl(185_100%_50%)] animate-bounce" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingScrollTop;
