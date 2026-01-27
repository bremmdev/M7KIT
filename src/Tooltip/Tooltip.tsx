"use client";

import React from "react";
import { TooltipProps, TooltipContentProps, TooltipTriggerProps, Placement } from "./Tooltip.types";
import { useTooltip, TooltipProvider } from "./TooltipContext";
import { cn } from "../utils/cn";
import { getPlacementClasses, getBridgeClasses, getArrowClasses, getArrowPositionStyle, determinePlacement } from "./Tooltip.utils";

export const Tooltip = ({ children, className, fade = true, hoverDelay = 500, open, onOpenChange, ...rest }: TooltipProps) => {
  return (
    <TooltipProvider hoverDelay={hoverDelay} open={open} onOpenChange={onOpenChange} fade={fade}>
      <div className={cn("relative w-fit text-foreground", className)} {...rest}>
        {children}
      </div>
    </TooltipProvider>
  );
};

const TooltipArrow = ({ placement }: { placement: Placement }) => {
  const { triggerWidth } = useTooltip();
  const isTop = placement.startsWith("top");

  return (
    <span
      className={cn(
        "absolute w-3 h-3 rotate-45 bg-surface-subtle",
        // Border only on the sides pointing toward trigger
        isTop
          ? "border-b border-r border-neutral"
          : "border-t border-l border-neutral",
        getArrowClasses(placement)
      )}
      style={getArrowPositionStyle(placement, triggerWidth)}
      aria-hidden
    />
  );
};

export const TooltipTrigger = ({ children, className, ...rest }: TooltipTriggerProps) => {

  const { open, setOpen, hoverDelay, openTimerRef, closeTimerRef, setTriggerWidth, tooltipId, tooltipTriggerRef, tooltipContentRef } = useTooltip();

  // Measure trigger width on mount, so we can position the arrow correctly
  React.useEffect(() => {
    if (tooltipTriggerRef.current) {
      setTriggerWidth(tooltipTriggerRef.current.offsetWidth);
    }
  }, [setTriggerWidth]);

  // Cleanup timers on unmount
  React.useEffect(() => {
    return () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [openTimerRef, closeTimerRef]);

  function handleMouseEnter() {
    // Cancel any pending close
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    // Start open timer
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
    }
    openTimerRef.current = setTimeout(() => {
      setOpen(true);
    }, hoverDelay);
  }

  function handleMouseLeave() {
    // Cancel open timer if pending
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    // Start close timer with small delay to allow moving to content
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
    }, 100);
  }

  function handleFocus() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpen(true);
  }

  function handleBlur(e: React.FocusEvent<HTMLButtonElement>) {
    // Don't close if focus is moving to the tooltip content
    const relatedTarget = e.relatedTarget as Node | null;
    if (relatedTarget && tooltipContentRef.current?.contains(relatedTarget)) {
      return;
    }

    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
    }, 100);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
    }
  }

  function handleTouchEnd(e: React.TouchEvent<HTMLButtonElement>) {
    // On mobile, allow tap-to-close when tooltip is already open
    if (open) {
      e.preventDefault(); // Prevent focus event from reopening
      setOpen(false);
    }
  }

  return (
    <button ref={tooltipTriggerRef} type="button" onFocus={handleFocus} onBlur={handleBlur} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onKeyDown={handleKeyDown} onTouchEnd={handleTouchEnd} aria-describedby={open ? tooltipId : undefined} className={cn("focus-ring cursor-pointer bg-surface-subtle border border-neutral rounded-md p-2 my-1 text-foreground", className)} {...rest}>
      {children}
    </button>
  );
};

export const TooltipContent = ({ children, className, placement = "bottom center", ...rest }: TooltipContentProps) => {
  const { fade, open, setOpen, closeTimerRef, tooltipId, tooltipContentRef, tooltipTriggerRef } = useTooltip();
  const [calculatedPlacement, setCalculatedPlacement] =
    React.useState<Placement>(placement);
  const [neverFits, setNeverFits] = React.useState(false);

  function handleMouseEnter() {
    // Cancel any pending close when entering content
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function handleMouseLeave() {
    // Start close timer when leaving content
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
    }, 0);
  }

  function handleMouseDown() {
    // Cancel any pending close when clicking inside content
    // Use setTimeout to ensure this runs after the blur handler on the trigger
    setTimeout(() => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    }, 0);
  }

  // Handle Escape key when tooltip is shown via hover (trigger not focused)
  React.useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, setOpen]);

  React.useLayoutEffect(() => {
    if (!open) {
      //reset placement and neverFits when tooltip is hidden, so we can calculate fresh on next show
      setCalculatedPlacement(placement);
      setNeverFits(false);
      return;
    };

    const tooltipContentRect = tooltipContentRef.current?.getBoundingClientRect();
    const tooltipTriggerRect = tooltipTriggerRef.current?.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    if (!tooltipContentRect || !tooltipTriggerRect) return;
    const { newPlacement, neverFits } = determinePlacement(tooltipContentRect, tooltipTriggerRect, placement, innerHeight, innerWidth);
    setNeverFits(neverFits);
    setCalculatedPlacement(newPlacement);
  }, [open, placement]);

  if (!open) return null;
  return (
    <div
      className={cn(
        "absolute w-64 bg-surface-subtle border border-neutral rounded-md p-2 my-2",
        {
          "animate-fade-in": fade,
        },
        {
          "max-w-[calc(100vw-2rem)]": neverFits,
        },
        getPlacementClasses(calculatedPlacement),
        getBridgeClasses(calculatedPlacement),
        className
      )}
      role="tooltip"
      id={tooltipId}
      ref={tooltipContentRef}
      {...rest}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
    >
      <TooltipArrow placement={calculatedPlacement} />
      {children}
    </div>
  );
};

