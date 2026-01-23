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
