import React from "react";
import { cn } from "../utils/cn";
import { SliderPropsExtended } from "./Slider.types";
import { SliderContext } from "./slide-context";
import { determineDefaultValue, thumbSizeVariants } from "./slider.utils";
import { SlideTrack } from "./SlideTrack/SlideTrack";
import { SlideValue } from "./SlideValue/SlideValue";
import { SlideHiddenInput } from "./SlideHiddenInput/SlideHiddenInput";
import { useThrottle } from "../utils/hooks/useThrottle";

// Define interaction keys as a constant
const INTERACTION_KEYS = [
  "ArrowLeft",
  "ArrowRight",
  "ArrowDown",
  "ArrowUp",
  "Home",
  "End",
  "PageUp",
  "PageDown",
];

export const Slide = (props: SliderPropsExtended) => {
  const {
    min = 0,
    max = 100,
    step = 1,
    value = 0,
    decimalPlaces = 0,
    showValue = true,
    onValueChange = () => {},
    orientation = "horizontal",
    size = 3,
    disabled = false,
    label = "",
    name = "",
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

  const calculateOffset = React.useCallback(
    (value: number) => {
      const track = trackRef.current;
      const thumb = thumbRef.current;

      if (!track || !thumb) return;
      const { width: trackWidth, height: trackHeight } =
        track.getBoundingClientRect();
      const { width: thumbWidth } = thumb.getBoundingClientRect();

      const trackDimension =
        orientation === "horizontal" ? trackWidth : trackHeight;

      //calculate the offset of the thumb, keep it between 0 and trackWidth - thumbWidth to prevent the thumb from going outside the track
      const offset = Math.max(
        0,
        Math.min(
          (value / max) * trackDimension - thumbWidth / 2,
          trackDimension - thumbWidth
        )
      );

      return offset;
    },
    [max, orientation]
  );

  const updateValueAndOffset = React.useCallback(
    (newValue: number) => {
      // Ensure newValue is within min and max
      newValue = Math.max(Math.min(newValue, max), min);

      // Round the value to the nearest whole number or decimal place
      const roundedValue =
        decimalPlaces === 0
          ? Math.round(newValue)
          : Number(newValue.toFixed(decimalPlaces));

      setCurrentValue(roundedValue);
      // If the value has not changed, do not call onValueChange
      if (roundedValue === currentValue) return;

      onValueChange && onValueChange(roundedValue);

      const offset = calculateOffset(newValue);

      if (offset) {
        setOffset(offset);
      }
    },
    [calculateOffset, currentValue, decimalPlaces, max, min, onValueChange]
  );

  const handleTrackClick = React.useCallback(
    (e: React.MouseEvent<HTMLSpanElement> | MouseEvent) => {
      const track = trackRef.current;
      const thumb = thumbRef.current;
      if (!track || !thumb) return;
      const {
        left: trackLeft,
        width: trackWidth,
        bottom: trackBottom,
        height: trackHeight,
      } = track.getBoundingClientRect();

      //determine the position of the click relative to the track, basis for the new value and offset
      const position =
        orientation === "horizontal"
          ? e.clientX - trackLeft
          : trackBottom - e.clientY;

      const trackDimension =
        orientation === "horizontal" ? trackWidth : trackHeight;

      // Prevent thumb from exceeding track bounds
      if (position < 0 || position > trackDimension) return;
      const newValue = (position / trackDimension) * max;
      updateValueAndOffset(newValue);
    },
    [max, orientation, updateValueAndOffset]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    const interActionToValue = {
      ArrowLeft: -step,
      ArrowRight: step,
      ArrowDown: -step,
      ArrowUp: step,
      PageUp: Math.min(step * 10, max / 2),
      PageDown: -Math.min(step * 10, max / 2),
    };
    const { key } = e;
    if (!INTERACTION_KEYS.includes(key)) return;
    e.preventDefault();

    let newValue;

    if (key === "Home" || key === "End") {
      newValue = key === "Home" ? min : max;
    } else {
      newValue =
        (currentValue || 0) +
        interActionToValue[key as keyof typeof interActionToValue];
    }

    updateValueAndOffset(newValue);
  };

  const throttledKeyDown = useThrottle(handleKeyDown, 50);

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (!dragging) return;
      handleTrackClick(e);
    },
    [dragging, handleTrackClick]
  );

  const throttledMouseMove = useThrottle(handleMouseMove, 100);

  React.useEffect(() => {
    document.addEventListener("mousemove", throttledMouseMove);
    document.addEventListener("mouseup", () => setDragging(false));

    return () => {
      document.removeEventListener("mousemove", throttledMouseMove);
      document.removeEventListener("mouseup", () => setDragging(false));
    };
  }, [dragging, handleTrackClick, throttledMouseMove]);

  //set the initial offset
  React.useEffect(() => {
    const offset = calculateOffset(currentValue || 0) || 0;
    setOffset(offset);
  }, [currentValue, calculateOffset]);

  const SliderContextValue = {
    min,
    max,
    step,
    value,
    decimalPlaces,
    showValue,
    onValueChange,
    orientation,
    size,
    disabled,
    label,
    name,
    currentValue,
  };

  const thumbStyles = cn(
    `${thumbSizeVariants[orientation][size]} absolute left-0 flex justify-center rounded-full cursor-pointer outline-none bg-slate-600 dark:bg-slate-300 focus:bg-amber-300 focus:dark:bg-amber-300 focus:outline-2 focus:outline-offset-0 focus:outline-slate-950`,
    {
      "pointer-events-none bg-slate-400": disabled,
    }
  );

  // Extract ARIA properties
  const ariaProps = {
    role: "slider",
    "aria-valuemin": min,
    "aria-valuemax": max,
    "aria-valuenow": currentValue,
    "aria-orientation": orientation,
    "aria-labelledby": label ? `${label}-label` : undefined,
  };

  const thumbPositionStyles =
    orientation === "horizontal" ? { left: offset } : { bottom: offset };

  return (
    <SliderContext.Provider value={SliderContextValue}>
      <SlideTrack ref={trackRef} handleTrackClick={handleTrackClick} />
      {/* SlideThumb */}
      <span
        {...ariaProps}
        tabIndex={disabled ? -1 : 0}
        ref={thumbRef}
        style={thumbPositionStyles}
        onKeyDown={throttledKeyDown}
        onMouseDown={handleMouseDown}
        className={thumbStyles}
      >
        <SlideValue />
      </span>
      <SlideHiddenInput />
    </SliderContext.Provider>
  );
};
