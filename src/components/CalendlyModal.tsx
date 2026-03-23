import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface CalendlyModalProps {
  open: boolean;
  onClose: () => void;
}

const CALENDLY_URL = "https://calendly.com/youki-youki/30min";

const CalendlyModal = ({ open, onClose }: CalendlyModalProps) => {
  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg mx-4 bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-display font-bold text-lg">Book a 30-Minute Discovery Meeting</h3>
            <button onClick={onClose} className="text-white hover:text-foreground transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-0">
            <iframe
              src={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=0f0f0f&text_color=e8e4df&primary_color=b0b8c8`}
              width="100%"
              height="660"
              frameBorder="0"
              title="Schedule a meeting"
              className="w-full"
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CalendlyModal;
