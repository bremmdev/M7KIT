import { Star } from "lucide-react";
import { RatingProps } from "./Rating.types";
import { cn } from "../utils/cn";

const roundToHalf = (num: number) => {
  return Math.round(num * 2) / 2;
};

const starColors = {
  gold: "text-amber-300 fill-amber-300",
  black: "text-black fill-black",
  gray: "text-gray-400 fill-gray-400",
};

const halfStarColors = {
  gold: "text-amber-300 fill-white",
  black: "text-black fill-white",
  gray: "text-gray-400 fill-white",
};

export const Rating = (props: RatingProps) => {
  const {
    max = 5,
    value = 0,
    size = 24,
    color = "gold",
    className,
    ...remainingProps
  } = props;

  let val = value;
  if (value > max) val = max;
  if (value < 0) val = 0;

  const hasHalfStar = roundToHalf(val % 1) === 0.5;

  const renderFilledStars = () => {
    // keep value between 0 and max
    const roundedVal =
      roundToHalf(val % 1) <= 0.5 ? Math.floor(val) : Math.ceil(val);
    const amount = Math.min(roundedVal, max);

    return Array.from({ length: amount }, (_, i) => {
      const classes = starColors[color];
      return (
        <Star key={i} size={size} strokeWidth={1} className={cn(classes)} />
      );
    });
  };

  const renderHalfStar = () => {
    const classes = starColors[color];
    const halfStarClasses = halfStarColors[color];

    return (
      <div className="relative">
        <Star size={size} strokeWidth={1} className={cn(halfStarClasses)} />
        <div
          className="absolute left-0 top-0 half overflow-hidden"
          style={{ direction: "rtl" }}
        >
          <Star
            size={size}
            strokeWidth={1}
            className={cn(
              classes,
              "half-star",
              "[clip-path:polygon(50%_0%,50%_35%,50%_80%,21%_91%,30%_58%,2%_35%,39%_35%)]"
            )}
          />
        </div>
      </div>
    );
  };

  const renderEmptyStars = () => {
    const amount =
      roundToHalf(val % 1) < 0.5 ? Math.ceil(max - val) : Math.floor(max - val);
    return Array.from(
      {
        length: amount,
      },
      (_, i) => {
        const classes = starColors[color];
        return (
          <Star
            key={i}
            size={size}
            strokeWidth={1}
            className={cn(classes, "fill-white")}
          />
        );
      }
    );
  };

  const accessibilityLabel = `Rating is ${val} out of ${max}`;

  return (
    <div className={cn("flex", className)} {...remainingProps}>
      {renderFilledStars()}
      {hasHalfStar && renderHalfStar()}
      {renderEmptyStars()}
      <span className="visually-hidden">{accessibilityLabel}</span>
    </div>
  );
};
