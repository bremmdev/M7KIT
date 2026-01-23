import { ToolTipProps, TooltipContentProps, TooltipTriggerProps, Placement } from "./TooltipV2.types";
import { useToolTip, ToolTipProvider } from "./TooltipV2Context";
import { cn } from "../utils/cn";
import { getPlacementClasses, getBridgeClasses, getArrowClasses } from "./TooltipV2.utils";

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
        />
    );
};

export const TooltipTrigger = ({ children, className, ...rest }: TooltipTriggerProps) => {

    const { setOpen, hoverDelay, openTimerRef, closeTimerRef } = useToolTip();

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

    return (
        <button type="button" {...rest} className={cn("focus-ring cursor-pointer bg-surface-subtle border border-neutral rounded-md p-2 my-1 text-foreground", className)} onFocus={handleFocus} onBlur={handleBlur} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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

