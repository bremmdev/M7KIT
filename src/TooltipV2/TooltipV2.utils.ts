import { Placement } from "./TooltipV2.types";

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