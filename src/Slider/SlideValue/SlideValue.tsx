import { useSliderContext } from "../slide-context";
import { cn } from "../../utils/cn";

export const SlideValue = () => {
  const { showValue, currentValue, decimalPlaces, disabled, orientation } =
    useSliderContext();

  if (!showValue) return null;

  //Round the value to the nearest whole number or decimal place
  let numberValue: string | number;

  if (decimalPlaces === 0) {
    numberValue = Math.round(currentValue || 0);
  } else {
    numberValue = (currentValue || 0).toFixed(decimalPlaces);
  }

  return (
    <span
      className={cn("absolute text-sm font-medium text-clr-text", {
        "opacity-50": disabled,
        "-top-5": orientation === "horizontal",
        "-right-6": orientation === "vertical",
      })}
    >
      {numberValue}
    </span>
  );
};
