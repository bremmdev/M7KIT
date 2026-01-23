import React from "react";
import { Placement } from "./TooltipV2.types";

export const ARROW_SIZE = 12; // w-3 = 12px

export function getPlacementClasses(placement: Placement) {
    return {
        "top left": "bottom-full right-0",
        "top center": "bottom-full left-1/2 -translate-x-1/2",
        "top right": "bottom-full left-0",
        "bottom left": "top-full right-0",
        "bottom center": "top-full left-1/2 -translate-x-1/2",
        "bottom right": "top-full left-0",
    }[placement];
}

// Returns classes for the invisible bridge that extends the hover area
export function getBridgeClasses(placement: Placement) {
    const isTop = placement.startsWith("top");
    // Bridge extends from the content towards the trigger
    return isTop
        ? "before:absolute before:left-0 before:right-0 before:top-full before:h-3 before:bg-transparent"
        : "before:absolute before:left-0 before:right-0 before:bottom-full before:h-3 before:bg-transparent";
}

export function getArrowClasses(placement: Placement) {
    // Arrow is a 12px rotated square (w-3 h-3)
    // Vertical position: half overlaps the tooltip edge (-mt-1.5 or -mb-1.5 = 6px)
    // Horizontal position is handled by getArrowPositionStyle for left/right placements
    return {
        "top left": "bottom-0 -mb-1.5",
        "top center": "bottom-0 left-1/2 -translate-x-1/2 -mb-1.5",
        "top right": "bottom-0 -mb-1.5",
        "bottom left": "top-0 -mt-1.5",
        "bottom center": "top-0 left-1/2 -translate-x-1/2 -mt-1.5",
        "bottom right": "top-0 -mt-1.5",
    }[placement];
}

export function getArrowPositionStyle(
    placement: Placement,
    triggerWidth: number,
): React.CSSProperties {
    // Center placements use CSS classes for positioning
    if (placement.includes("center")) {
        return {};
    }

    // Calculate position: center of trigger minus half arrow size
    const offset = triggerWidth / 2 - ARROW_SIZE / 2;

    // "left" placements: tooltip is right-aligned, arrow positioned from right
    // "right" placements: tooltip is left-aligned, arrow positioned from left
    if (placement.includes("left")) {
        return { right: offset };
    } else {
        return { left: offset };
    }
}