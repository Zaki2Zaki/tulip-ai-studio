import { useState, useEffect } from "react";

const scales = [
  { label: "1×", value: 1 },
  { label: "1.5×", value: 1.5 },
  { label: "2×", value: 2 },
];

const TextScaleControl = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--text-scale",
      String(scales[activeIndex].value)
    );
    document.documentElement.style.fontSize = `${16 * scales[activeIndex].value}px`;
    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [activeIndex]);

  return (
    <div className="flex items-center bg-card/80 backdrop-blur-xl rounded-full border border-border/40 overflow-hidden min-h-[32px]">
      {scales.map((s, i) => (
        <button
          key={s.label}
          onClick={() => setActiveIndex(i)}
          className={`px-2.5 py-1 text-[11px] font-body font-semibold transition-all min-w-[36px] min-h-[32px] ${
            i === activeIndex
              ? "text-foreground bg-primary/20"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-label={`Set text scale to ${s.label}`}
        >
          {i === 0 ? (
            <span className="text-[10px]">a</span>
          ) : i === 1 ? (
            <span className="text-[13px] font-bold">A</span>
          ) : (
            <span className="text-[15px] font-bold">A</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default TextScaleControl;
