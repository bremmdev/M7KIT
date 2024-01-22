import { useSliderContext } from "../slide-context";
import { cn } from "../../utils/cn";

export const SlideValue = () => {
  const { showValue, currentValue, disabled, orientation } = useSliderContext();

  if (!showValue) return null;
  return (
    <span
      className={cn("absolute text-sm font-medium text-slate-950", {
        "opacity-50": disabled,
        "-top-5": orientation === "horizontal",
        "-right-6": orientation === "vertical",
      })}
    >
      {currentValue || 0}
    </span>
  );
};