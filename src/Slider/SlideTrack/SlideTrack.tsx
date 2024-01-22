import React, { ForwardedRef } from "react";
import { cn } from "../../utils/cn";
import { SlideTrackPropsType } from "./SlideTrack.types";
import { useSliderContext } from "../slide-context";
import { trackSizeVariants } from "../slider.utils";

/* Track is the bar that the thumb slides along, it has a inner span that is the fill */
export const SlideTrack = React.forwardRef(
  (
    { handleTrackClick }: SlideTrackPropsType,
    ref: ForwardedRef<HTMLSpanElement>
  ) => {
    const { max, disabled, orientation, currentValue, size } =
      useSliderContext();

    const amount = currentValue ? (currentValue / max) * 100 : 0;

    const slideTrackClasses = cn(
      `${trackSizeVariants[orientation][size]} relative inline-block rounded-full bg-slate-200 dark:bg-slate-500`,
      {
        "pointer-events-none opacity-50": disabled,
      }
    );

    const slideTrackFillStyles = cn(
      `${trackSizeVariants[orientation][size]} absolute inline-block w-full rounded-full bg-slate-400 dark:bg-slate-950`,
      {
        "pointer-events-none opacity-50 cursor-not-allowed": disabled,
      }
    );

    const trackFillStyles =
      orientation === "horizontal"
        ? { width: amount + "%" }
        : { bottom: 0, height: amount + "%" };

    return (
      <span
        className={slideTrackClasses}
        ref={ref}
        data-testid="track"
        onClick={(e) => handleTrackClick(e)}
      >
        <span className={slideTrackFillStyles} style={trackFillStyles}></span>
      </span>
    );
  }
);
