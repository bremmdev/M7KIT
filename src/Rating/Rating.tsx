import { Star, Circle, Heart } from "lucide-react";
import { RatingProps } from "./Rating.types";
import { cn } from "../utils/cn";

const roundToHalf = (num: number) => {
  return Math.round(num * 2) / 2;
};

const ratingStyles = {
  star: "text-amber-300 fill-amber-300",
  heart: "text-red-500 fill-red-500",
  "circle-black": "text-black fill-black",
  "circle-gray": "text-gray-400 fill-gray-400"
};

// Forced colors (Windows high contrast) keep explicit SVG colors, so the shapes could vanish against the forced background
// (e.g. circle-black on a black theme). There, filled shapes use CanvasText and empty ones a CanvasText outline on Canvas
const filledForcedColors = "forced-colors:text-[CanvasText] forced-colors:fill-[CanvasText]";
const emptyForcedColors = "forced-colors:text-[CanvasText] forced-colors:fill-[Canvas]";

const shapeVariants = {
  star: Star,
  heart: Heart,
  "circle-black": Circle,
  "circle-gray": Circle
};

export const Rating = (props: RatingProps) => {
  const { max = 5, value = 0, size = 24, className, variant = "star", ...rest } = props;

  let val = value;
  if (value > max) val = max;
  if (value < 0) val = 0;

  const hasHalfRating = roundToHalf(val % 1) === 0.5;

  const RatingItem = shapeVariants[variant] || Star;

  const renderFilledRatingItem = () => {
    // keep value between 0 and max
    const roundedVal = roundToHalf(val % 1) <= 0.5 ? Math.floor(val) : Math.ceil(val);
    const amount = Math.min(roundedVal, max);

    return Array.from({ length: amount }, (_, i) => {
      const classes = ratingStyles[variant || "star"];
      return <RatingItem key={i} size={size} strokeWidth={1} className={cn(classes, filledForcedColors)} />;
    });
  };

  const renderHalfRatingItem = () => {
    const classes = ratingStyles[variant || "star"];

    return (
      <div className="relative">
        <RatingItem size={size} strokeWidth={1} className={cn(classes, "fill-white", emptyForcedColors)} />
        <div className="absolute left-0 top-0 overflow-hidden">
          <RatingItem
            size={size}
            strokeWidth={1}
            data-testid="half-star"
            className={cn(classes, filledForcedColors, "[clip-path:polygon(0_0,50%_0,50%_100%,0%_100%)]")}
          />
        </div>
      </div>
    );
  };

  const renderEmptyRatingItem = () => {
    const amount = roundToHalf(val % 1) < 0.5 ? Math.ceil(max - val) : Math.floor(max - val);
    return Array.from(
      {
        length: amount
      },
      (_, i) => {
        const classes = ratingStyles[variant || "star"];
        return (
          <RatingItem key={i} size={size} strokeWidth={1} className={cn(classes, "fill-white", emptyForcedColors)} />
        );
      }
    );
  };

  const accessibilityLabel = `Rating is ${val} out of ${max}`;

  return (
    <div className={cn("flex", className)} {...rest}>
      {renderFilledRatingItem()}
      {hasHalfRating && renderHalfRatingItem()}
      {renderEmptyRatingItem()}
      <span className="visually-hidden">{accessibilityLabel}</span>
    </div>
  );
};
