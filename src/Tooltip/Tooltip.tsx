import React from "react";
import { ToolTipProps, TooltipContentProps, TooltipTriggerProps, Placement } from "./Tooltip.types";
import { useToolTip, ToolTipProvider } from "./TooltipContext";
import { cn } from "../utils/cn";
import { getPlacementClasses, getBridgeClasses, getArrowClasses, getArrowPositionStyle, determinePlacement } from "./Tooltip.utils";

export const Tooltip = ({ children, className, hoverDelay = 500, open, onOpenChange, ...rest }: ToolTipProps) => {
  return (
    <ToolTipProvider hoverDelay={hoverDelay} open={open} onOpenChange={onOpenChange}>
      <div className={cn("relative w-fit text-foreground", className)} {...rest}>
        {children}
      </div>
    </ToolTipProvider>
  );
};

const ToolTipArrow = ({ placement }: { placement: Placement }) => {
  const { triggerWidth } = useToolTip();
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
    />
  );
};

export const TooltipTrigger = ({ children, className, ...rest }: TooltipTriggerProps) => {

  const { open, setOpen, hoverDelay, openTimerRef, closeTimerRef, setTriggerWidth, tooltipId, tooltipTriggerRef } = useToolTip();

  // Measure trigger width on mount and resize
  React.useEffect(() => {
    if (tooltipTriggerRef.current) {
      setTriggerWidth(tooltipTriggerRef.current.offsetWidth);
    }
  }, [setTriggerWidth]);

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

  function handleBlur() {
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
    }, 0);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "Escape" && open) {
      e.preventDefault(); // Signal to parent components that we handled this
      setOpen(false);
    }
  }

  return (
    <button ref={tooltipTriggerRef} type="button" onFocus={handleFocus} onBlur={handleBlur} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onKeyDown={handleKeyDown} aria-describedby={open ? tooltipId : undefined} className={cn("focus-ring cursor-pointer bg-surface-subtle border border-neutral rounded-md p-2 my-1 text-foreground", className)} {...rest}>
      {children}
    </button>
  );
};

export const TooltipContent = ({ children, className, placement = "bottom center", ...rest }: TooltipContentProps) => {
  const { fade, open, setOpen, closeTimerRef, tooltipId, tooltipContentRef, tooltipTriggerRef } = useToolTip();
  const [calculatedPlacement, setCalculatedPlacement] =
    React.useState<Placement>(placement);

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

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        e.preventDefault(); // Signal to parent components that we handled this
        setOpen(false);
      }
    }

    // Use capture to run before other components' keydown handlers
    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [setOpen]);


  React.useLayoutEffect(() => {
    if (!open) {
      //reset placement when tooltip is hidden, so we can calculate it based on prop again on next show
      setCalculatedPlacement(placement);
      return;
    };
    const tooltipContentRect = tooltipContentRef.current?.getBoundingClientRect();
    const tooltipTriggerRect = tooltipTriggerRef.current?.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    if (!tooltipContentRect || !tooltipTriggerRect) return;
    const newPlacement = determinePlacement(tooltipContentRect, tooltipTriggerRect, placement, innerHeight, innerWidth);
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
    >
      <ToolTipArrow placement={calculatedPlacement} />
      {children}
    </div>
  );
};

