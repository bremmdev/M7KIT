import React from "react";
import { ToolTipProps, TooltipContentProps, TooltipTriggerProps, Placement } from "./TooltipV2.types";
import { useToolTip, ToolTipProvider } from "./TooltipV2Context";
import { cn } from "../utils/cn";
import { getPlacementClasses, getBridgeClasses, getArrowClasses, getArrowPositionStyle } from "./TooltipV2.utils";

export const TooltipV2 = ({ children, className, hoverDelay = 500, open, onOpenChange, ...rest }: ToolTipProps) => {
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

    const { open, setOpen, hoverDelay, openTimerRef, closeTimerRef, setTriggerWidth } = useToolTip();
    const triggerRef = React.useRef<HTMLButtonElement>(null);

    // Measure trigger width on mount and resize
    React.useEffect(() => {
        if (triggerRef.current) {
            setTriggerWidth(triggerRef.current.offsetWidth);
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
        <button ref={triggerRef} type="button" {...rest} className={cn("focus-ring cursor-pointer bg-surface-subtle border border-neutral rounded-md p-2 my-1 text-foreground", className)} onFocus={handleFocus} onBlur={handleBlur} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onKeyDown={handleKeyDown}>
            {children}
        </button>
    );
};

export const TooltipContent = ({ children, className, placement = "bottom center", ...rest }: TooltipContentProps) => {
    const { open, setOpen, closeTimerRef } = useToolTip();

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


    if (!open) return null;
    return (
        <div
            className={cn(
                "absolute w-64 bg-surface-subtle border border-neutral rounded-md p-2 my-2",
                getPlacementClasses(placement),
                getBridgeClasses(placement),
                className
            )}
            {...rest}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <ToolTipArrow placement={placement} />
            {children}
        </div>
    );
};

