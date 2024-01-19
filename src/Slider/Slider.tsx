import React from "react";
import { SliderProps } from "./Slider.types";
import { cn } from "../utils/cn";

const thumbSizeVariants = {
  2: "h-4 w-4 top-[50%] -translate-y-[6px]",
  3: "h-5 w-5 top-[50%] -translate-y-[10px]",
  4: "h-6 w-6 top-[50%] -translate-y-[14px]",
};

const trackSizeVariants = {
  2: "h-2",
  3: "h-3",
  4: "h-4",
};

const determineDefaultValue = (
  value: number | undefined,
  max: number,
  min: number
) => {
  if (value === undefined) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const Value = ({ value, disabled, showValue }: { value: number; disabled: boolean, showValue: boolean }) => {
  if (!showValue) return null;
  return (
    <span
      className={cn("absolute -top-5 text-sm font-medium text-slate-950", {
        "opacity-50": disabled,
      })}
    >
      {value}
    </span>
  );
};

const Slide = (props: SliderProps) => {
  const {
    min = 0,
    max = 100,
    step = 1,
    value = 0,
    showValue = true,
    onValueChange,
    size = 3,
    disabled = false,
    label,
    name,
  } = props;

  if (min > max) throw new Error("min cannot be greater than max");

  const thumbRef = React.useRef<HTMLSpanElement>(null);
  const trackRef = React.useRef<HTMLSpanElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const [currentValue, setCurrentValue] = React.useState<number | undefined>(
    () => determineDefaultValue(value, max, min)
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLSpanElement>) => {
    setDragging(true);
    handleTrackClick(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      handleTrackClick(e);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const calculateOffset = React.useCallback(
    (value: number) => {
      const track = trackRef.current;
      const thumb = thumbRef.current;

      if (!track || !thumb) return;
      const { width: trackWidth } = track.getBoundingClientRect();
      const { width: thumbWidth } = thumb.getBoundingClientRect();

      const offset = value ? (value / max) * trackWidth - thumbWidth / 2 : 0;
      if (offset > trackWidth - thumbWidth) {
        return trackWidth - thumbWidth;
      }

      //prevent the thumb from going outside the track visually
      if (offset < 0) {
        return 0;
      }

      return offset;
    },
    [max]
  );

  const handleTrackClick = (
    e: React.MouseEvent<HTMLSpanElement> | MouseEvent
  ) => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;
    const { left: trackLeft, width: trackWidth } =
      track.getBoundingClientRect();
    const { width: thumbWidth } = thumb.getBoundingClientRect();

    //determine the position of the click relative to the track, basis for the new value and offset
    const position = e.clientX - trackLeft;

    //prevent the thumb from going outside the track using the mouse
    if (position < 0 || position > trackWidth) return;
    const newValue = Math.round((position / trackWidth) * max);
    setCurrentValue(newValue);
    onValueChange && onValueChange(newValue);

    let offset = position - thumbWidth / 2;

    //prevent the thumb from going outside the track visually
    if (offset > trackWidth - thumbWidth) {
      offset = trackWidth - thumbWidth;
    }
    if (offset < 0) {
      offset = 0;
    }
    setOffset(offset);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    const interactionKeys = [
      "ArrowLeft",
      "ArrowRight",
      "ArrowDown",
      "ArrowUp",
      "Home",
      "End",
    ];
    const interActionToValue = {
      ArrowLeft: -step,
      ArrowRight: step,
      ArrowDown: -step,
      ArrowUp: step,
    };
    const { key } = e;
    if (!interactionKeys.includes(key)) return;
    e.preventDefault();

    if (key === "Home" || key === "End") {
      const newValue = key === "Home" ? min : max;
      if (newValue < min || newValue > max) return;
      setCurrentValue(newValue);
      onValueChange && onValueChange(newValue);
      const offset = calculateOffset(newValue);
      if (offset) {
        setOffset(offset);
      }
      return;
    }

    const newValue =
      (currentValue || 0) +
      interActionToValue[key as keyof typeof interActionToValue];

    if (newValue < min || newValue > max) return;

    setCurrentValue(newValue);
    onValueChange && onValueChange(newValue);

    const offset = calculateOffset(newValue);

    if (offset) {
      setOffset(offset);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  //set the initial offset
  React.useEffect(() => {
    const offset = calculateOffset(currentValue || 0) || 0;
    setOffset(offset);
  }, [currentValue, calculateOffset]);

  return (
    <>
      <span
        className={cn(
          `${trackSizeVariants[size]} relative inline-block w-full rounded-full bg-slate-200 dark:bg-slate-500`,
          {
            "pointer-events-none opacity-50": disabled,
          }
        )}
        ref={trackRef}
        data-testid="track"
        onClick={(e) => handleTrackClick(e)}
      >
        <span
          className={cn(
            `${trackSizeVariants[size]} absolute inline-block w-full rounded-full bg-slate-400 dark:bg-slate-950`,
            {
              "pointer-events-none opacity-50 cursor-not-allowed": disabled,
            }
          )}
          style={{ width: (currentValue || 0 / max) + "%" }}
        ></span>
      </span>
      <span
        role="slider"
        tabIndex={disabled ? -1 : 0}
        onMouseDown={handleMouseDown}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentValue}
        ref={thumbRef}
        style={{ left: offset }}
        aria-labelledby={label ? `${label}-label` : undefined}
        onKeyDown={handleKeyDown}
        className={cn(
          `${thumbSizeVariants[size]} absolute left-0 flex justify-center rounded-full cursor-pointer outline-none bg-slate-600 dark:bg-slate-300 focus:bg-amber-300 focus:dark:bg-amber-300 focus:outline-2 focus:outline-offset-0 focus:outline-slate-950`,
          {
            "pointer-events-none bg-slate-400": disabled,
          }
        )}
      >
        <Value value={currentValue || 0} disabled={disabled} showValue={showValue} />
      </span>
      {name ? (
        <input className="hidden" type="text" name={name} value={currentValue} />
      ) : null}
    </>
  );
};

export const Slider = ({
  label,
  className,
  ...remainingProps
}: SliderProps) => {
  return (
    <div className={cn("w-full text-slate-950", className)}>
      {label && (
        <div className="font-medium mb-3" id={`${label}-label`}>
          {label}
        </div>
      )}
      <div className="relative flex-1">
        <Slide {...remainingProps} label={label} />
      </div>
    </div>
  );
};
