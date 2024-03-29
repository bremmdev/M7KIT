
import { cn } from "../utils/cn";
import { Slide } from "./Slide";
import { SliderPropsExtended } from "./Slider.types";

const LabelText = ({ label }: { label?: string }) => {
  if (!label) return null;
  return (
    <label
      className="block mb-4 text-sm font-medium text-slate-950"
      id={`${label}-label`}
    >
      {label}
    </label>
  );
};

export const Slider = ({ className, ...remainingProps }: SliderPropsExtended) => {
  return (
    <div className={cn("w-full h-full text-slate-950", className)}>
      <LabelText label={remainingProps.label} />
      <div
        className={cn("relative", {
          "h-full": remainingProps.orientation === "vertical",
        })}
      >
        <Slide {...remainingProps} />
      </div>
    </div>
  );
};
