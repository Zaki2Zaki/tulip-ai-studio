import { Slider } from "@/components/ui/slider";

interface MatchRateSliderProps {
  range: [number, number];
  onChange: (range: [number, number]) => void;
}

const MatchRateSlider = ({ range, onChange }: MatchRateSliderProps) => {
  return (
    <div className="flex items-center gap-4 px-1">
      <span className="text-xs font-body text-muted-foreground whitespace-nowrap">Match Rate</span>
      <div className="flex-1 relative">
        <Slider
          min={0}
          max={100}
          step={1}
          value={range}
          onValueChange={(v) => onChange(v as [number, number])}
          className="w-full"
        />
      </div>
      <span className="text-xs font-body text-foreground tabular-nums min-w-[70px] text-right">
        {range[0]}% – {range[1]}%
      </span>
    </div>
  );
};

export default MatchRateSlider;
