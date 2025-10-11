"use client";

import React from "react";
import {
  Placement,
  TooltipProps,
  TooltipTriggerProps,
  TooltipContentProps,
} from "./Tooltip.types";
import { cn } from "../utils/cn";
import { getPlacementClasses, determinePlacement } from "./Tooltip.utils";

export const TooltipTrigger = ({ children }: TooltipTriggerProps) => (
  <>{children}</>
);

export const TooltipContent = ({ children }: TooltipContentProps) => (
  <>{children}</>
);

export const Tooltip = ({
  children,
  className,
  fade = true,
  hoverDelay = 500,
  placement = "bottom center",
  ...rest
}: TooltipProps) => {
  const [show, setShow] = React.useState(false);
  const tooltipButtonRef = React.useRef<HTMLButtonElement>(null);
  const tooltipContentRef = React.useRef<HTMLDivElement>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const [calculatedPlacement, setCalculatedPlacement] =
    React.useState<Placement>(placement);

  const tooltipId = React.useId();

  function handleMouseEnter() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setShow(true);
    }, hoverDelay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setShow(false);
    };
  }

  function handleMouseLeave() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setShow(false);
  }

  function handleFocus() {
    setShow(true);
  }

  function handleBlur() {
    setShow(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setShow(false);
      tooltipButtonRef.current?.focus();
    }
  }

  React.useLayoutEffect(() => {
    if (!show) {
      //reset placement when tooltip is hidden, so we can calculate it based on prop again on next show
      setCalculatedPlacement(placement);
      return;
    }

    const rect = tooltipContentRef.current?.getBoundingClientRect();
    const buttonRect = tooltipButtonRef.current?.getBoundingClientRect();
    if (!rect || !buttonRect) return;

    const { innerWidth, innerHeight } = window;

    const newPlacement = determinePlacement(
      rect,
      buttonRect,
      placement,
      innerHeight,
      innerWidth
    );

    if (newPlacement !== calculatedPlacement) {
      setCalculatedPlacement(newPlacement as Placement);
    }
  }, [show, placement]);

  // Get TooltipTrigger and TooltipContent
  const triggerContent = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === TooltipTrigger
  );

  if (!triggerContent) {
    throw new Error("Warning: Tooltip must contain a TooltipTrigger component");
  }

  const tooltipContent = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === TooltipContent
  );

  if (!tooltipContent) {
    throw new Error("Warning: Tooltip must contain a TooltipContent component");
  }

  const { className: triggerClassName, ...triggerRestProps } = (
    triggerContent as React.ReactElement<any>
  ).props;
  const { className: contentClassName, ...contentRestProps } = (
    tooltipContent as React.ReactElement<any>
  ).props;

  return (
    <div className={cn("relative w-fit text-foreground", className)} {...rest}>
      <button
        type="button"
        aria-controls={tooltipId}
        aria-haspopup="dialog"
        aria-expanded={show}
        aria-describedby={show ? tooltipId : undefined}
        className={cn("focus-ring", triggerClassName)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        ref={tooltipButtonRef}
        {...triggerRestProps}
      >
        {triggerContent}
      </button>

      {show ? (
        <div
          id={tooltipId}
          role="tooltip"
          ref={tooltipContentRef}
          className={cn(
            "absolute w-64 bg-surface-subtle border border-neutral rounded-md p-2 my-1",
            {
              "animate-fade-in": fade,
            },
            getPlacementClasses(calculatedPlacement),
            contentClassName
          )}
          {...contentRestProps}
        >
          {tooltipContent}
        </div>
      ) : null}
    </div>
  );
};
