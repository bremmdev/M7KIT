import React, { type JSX } from "react";
import { cn } from "../utils/cn";
import {
  LineClampProps,
  LineClampRootProps,
  LineClampTriggerProps,
} from "./LineClamp.types";
import { getLineClampStyling, useLineClampContext } from "./LineClamp.utils";
import { LineClampProvider } from "./LineClampContext";
import { useResizeWindow } from "../_hooks/useResizeWindow";

export const LineClampTrigger = (props: LineClampTriggerProps) => {
  const {
    className,
    showLessText = "Read Less",
    showMoreText = "Read More",
  } = props;

  const { clamped, setClamped, hideTrigger } = useLineClampContext();

  const handleTriggerClick = () => {
    setClamped((prev) => !prev);
  };

  return !hideTrigger ? (
    <button
      className={cn(
        "text-clr-text font-medium underline underline-offset-4 p-1 hover:text-clr-accent focus-ring-inner",
        className
      )}
      onClick={handleTriggerClick}
    >
      {clamped ? showMoreText : showLessText}
    </button>
  ) : null;
};

export const LineClamp = <T extends keyof JSX.IntrinsicElements = "p">(
  props: LineClampProps<T>
) => {
  const { animate = true, as = "p", children, className, lines = 3 } = props;

  const { clamped, setHideTrigger } = useLineClampContext();
  const lineClampRef = React.useRef<HTMLElement>(null);
  const [height, setHeight] = React.useState<string>("auto");
  const [isAnimating, setIsAnimating] = React.useState(false);

  const { lineClampStyles, lineClampClass } = clamped
    ? getLineClampStyling(lines)
    : {
        lineClampStyles: {},
        lineClampClass: "",
      };

  const styles = animate
    ? {
        ...lineClampStyles,
        height,
        transition: "height 0.3s ease-in-out",
      }
    : lineClampStyles;

  const LineClampComponent = as as React.ElementType;

  // Check if the content is clamped by comparing the height of the content with the height of the container,
  // if the content is not clamped, hide the trigger button
  React.useEffect(() => {
    const clampElement = lineClampRef.current;
    if (
      clampElement &&
      clampElement.scrollHeight <= clampElement.clientHeight
    ) {
      setHideTrigger(true);
    }
  }, [setHideTrigger]);

  React.useEffect(() => {
    if (lineClampRef.current && animate) {
      // Get the height of the content
      const fullHeight = lineClampRef.current.scrollHeight;
      // Calculate the clamped height
      const lineHeight = parseFloat(
        getComputedStyle(lineClampRef.current).lineHeight
      );
      const clampedHeight = `${lines * lineHeight}px`;

      if (!clamped) {
        setIsAnimating(true);
        setHeight(`${fullHeight}px`);
      } else {
        setIsAnimating(true);
        setHeight(clampedHeight);
      }
    }
  }, [clamped, lines, animate]);


  //When resizing the window, check if the content is clamped or not
  //in the not clamped state, the height must be recalculated on window resize
  //additionally check if the content is overflowing or not and hide the trigger button accordingly
  useResizeWindow(() => {
    if (!lineClampRef.current) return;
    if (!clamped && height !== "auto") {
      //set height to get the "natural" height of the content
      setHeight("auto");
    }

    //if the content is clamped, hide the trigger button if there is no overflow
    if (
      clamped &&
      lineClampRef.current.scrollHeight <= lineClampRef.current.clientHeight
    ) {
      setHideTrigger(true);
    } else {
      setHideTrigger(false);
    }

    //if not clamped, hide the trigger button if the content is not overflowing
    if (!clamped) {
      const lineHeight = parseFloat(
        getComputedStyle(lineClampRef.current).lineHeight
      );
      const clampedHeight = lines * lineHeight;

      if (lineClampRef.current.scrollHeight <= clampedHeight) {
        setHideTrigger(true);
      } else {
        setHideTrigger(false);
      }
    }
  });

  return (
    <LineClampComponent
      style={styles}
      className={cn(
        `${lineClampClass} px-1 transition-[max-height] duration-300 ease-in-out`,
        className,
        { "overflow-hidden": isAnimating }
      )}
      ref={lineClampRef}
    >
      {children}
    </LineClampComponent>
  );
};

export const LineClampRoot = (props: LineClampRootProps) => {
  const { children, className } = props;

  return (
    <LineClampProvider>
      <div className={cn("text-clr-text", className)}>{children}</div>
    </LineClampProvider>
  );
};
