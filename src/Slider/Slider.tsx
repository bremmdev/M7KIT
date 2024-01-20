import { SliderProps } from "./Slider.types";
import { cn } from "../utils/cn";
import { Slide } from "./Slide";

const LabelText = ({ label }: { label?: string }) => {
  if (!label) return null;
  return (
    <label
      className="block mb-2 text-sm font-medium text-slate-950"
      id={`${label}-label`}
    >
      {label}
    </label>
  );
};

export const Slider = ({
  label,
  className,
  ...remainingProps
}: SliderProps) => {
  return (
    <div className={cn("w-full text-slate-950", className)}>
      <LabelText label={label} />
      <div className="relative flex-1">
        <Slide {...remainingProps} label={label} />
      </div>
    </div>
  );
};
