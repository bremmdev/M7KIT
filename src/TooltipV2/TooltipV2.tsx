import React from "react";
import { ToolTipProps, TooltipContentProps, TooltipTriggerProps } from "./TooltipV2.types";
import { useToolTip, ToolTipProvider } from "./TooltipV2Context";
import { cn } from "../utils/cn";
import { getPlacementClasses } from "./TooltipV2.utils";

export const TooltipV2 = ({ children, className, hoverDelay = 500, open, onOpenChange, ...rest }: ToolTipProps) => {
    return (
        <ToolTipProvider hoverDelay={hoverDelay} open={open} onOpenChange={onOpenChange}>
            <div className={cn("relative w-fit text-foreground", className)} {...rest}>
                {children}
            </div>
        </ToolTipProvider>
    );
};

export const TooltipTrigger = ({ children, className, ...rest }: TooltipTriggerProps) => {

    const { setOpen, hoverDelay } = useToolTip();
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    function handleMouseEnter() {

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            setOpen(true);
        }, hoverDelay);
    }
    function handleMouseLeave() {
        setOpen(false);
    }
    function handleFocus() {
        setOpen(true);
    }
    function handleBlur() {
        setOpen(false);
    }

    return (
        <button type="button" {...rest} className={cn("focus-ring cursor-pointer bg-surface-subtle border border-neutral rounded-md p-2 my-1 text-foreground", className)} onFocus={handleFocus} onBlur={handleBlur} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {children}
        </button>
    );
};

export const TooltipContent = ({ children, className, placement = "bottom center", ...rest }: TooltipContentProps) => {
    const { open } = useToolTip();

    if (!open) return null;
    return (
        <div className={cn(
            "absolute w-64 bg-surface-subtle border border-neutral rounded-md p-2 my-1",
            getPlacementClasses(placement),
            className
        )} {...rest}>
            {children}
        </div>
    );
};

