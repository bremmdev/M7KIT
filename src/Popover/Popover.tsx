"use client";

import React from "react";
import { PopoverProps, PopoverContentProps, PopoverTriggerProps } from "./Popover.types";
import { OverlayPlacement } from "../shared/Overlay/types";
import { usePopover, PopoverProvider } from "./PopoverContext";
import { cn } from "../utils/cn";
import {
    getPlacementClasses,
    getBridgeClasses,
    getArrowClasses,
    getArrowPositionStyle,
    determinePlacement
} from "../Tooltip/Tooltip.utils";
import { useOnClickOutside } from "../_hooks/useOnClickOutside";

export const Popover = ({
    children,
    className,
    fade = true,
    open,
    onOpenChange,
    ...rest
}: PopoverProps) => {

    return (
        <PopoverProvider
            open={open}
            onOpenChange={onOpenChange}
            fade={fade}
        >
            <div className={cn("relative w-fit text-foreground", className)} {...rest}>
                {children}
            </div>
        </PopoverProvider>
    );
};

const PopoverArrow = ({ placement }: { placement: OverlayPlacement }) => {
    const { triggerWidth } = usePopover();
    const isTop = placement.startsWith("top");

    return (
        <span
            className={cn(
                "absolute w-3 h-3 rotate-45 bg-surface-subtle",
                // Border only on the sides pointing toward trigger
                isTop ? "border-b border-r border-neutral" : "border-t border-l border-neutral",
                getArrowClasses(placement)
            )}
            style={getArrowPositionStyle(placement, triggerWidth)}
            aria-hidden
        />
    );
};

export const PopoverTrigger = ({ children, className, ...rest }: PopoverTriggerProps) => {
    const {
        open,
        setOpen,
        closeTimerRef,
        setTriggerWidth,
        overlayId,
        overlayTriggerRef,
    } = usePopover();

    // Measure trigger width on mount, so we can position the arrow correctly
    React.useEffect(() => {
        if (overlayTriggerRef.current) {
            setTriggerWidth(overlayTriggerRef.current.offsetWidth);
        }
    }, [setTriggerWidth]);

    function handleClick() {
        setOpen(!open);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
        if (e.key === "Tab") {
            setOpen(false);
            return;
        }
        e.preventDefault();
        if (e.key === "Escape" && open) {
            setOpen(false);
        }
        if (e.key === "Enter" || e.key === " ") {
            setOpen(!open);
        }
    }

    return (
        <button
            ref={overlayTriggerRef}
            type="button"
            onKeyDown={handleKeyDown}
            onClick={handleClick}
            aria-controls={open ? overlayId : undefined}
            aria-expanded={open}
            aria-haspopup="dialog"
            className={cn(
                "focus-ring cursor-pointer bg-surface-subtle border border-neutral rounded-md p-2 my-1 text-foreground",
                className
            )}
            {...rest}
        >
            {children}
        </button>
    );
};

export const PopoverContent = ({ children, className, placement = "bottom center", ...rest }: PopoverContentProps) => {
    const { fade, open, setOpen, overlayId, overlayContentRef, overlayTriggerRef } = usePopover();
    const [calculatedPlacement, setCalculatedPlacement] = React.useState<OverlayPlacement>(placement);
    const [neverFits, setNeverFits] = React.useState(false);

    useOnClickOutside(
        [overlayTriggerRef, overlayContentRef],
        React.useCallback(() => {
            if (open) {
                setOpen(false);
            }
        }, [setOpen])
    );

    React.useLayoutEffect(() => {
        if (!open) {
            //reset placement and neverFits when popover is hidden, so we can calculate fresh on next show
            setCalculatedPlacement(placement);
            setNeverFits(false);
            return;
        }

        const popoverContentRect = overlayContentRef.current?.getBoundingClientRect();
        const popoverTriggerRect = overlayTriggerRef.current?.getBoundingClientRect();
        const { innerHeight, innerWidth } = window;
        if (!popoverContentRect || !popoverTriggerRect) return;
        const { newPlacement, neverFits } = determinePlacement(
            popoverContentRect,
            popoverTriggerRect,
            placement,
            innerHeight,
            innerWidth
        );
        setNeverFits(neverFits);
        setCalculatedPlacement(newPlacement);
    }, [open, placement]);

    if (!open) return null;
    return (
        <div
            className={cn(
                "absolute w-64 bg-surface-subtle border border-neutral rounded-md p-2 my-2",
                {
                    "animate-fade-in": fade
                },
                {
                    "max-w-[calc(100vw-2rem)]": neverFits
                },
                getPlacementClasses(calculatedPlacement),
                getBridgeClasses(calculatedPlacement),
                className
            )}
            role="dialog"
            id={overlayId}
            ref={overlayContentRef}
            {...rest}
        >
            <PopoverArrow placement={calculatedPlacement} />
            {children}
        </div>
    );
};
