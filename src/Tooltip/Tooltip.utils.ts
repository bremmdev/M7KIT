import React from "react";
import { OverlayPlacement } from "../shared/Overlay/types";

export const ARROW_SIZE = 12; // w-3 = 12px
export const TOOLTIP_PADDING = 8; // for determining is placement is possible, do not place tooltip within this padding

export function getPlacementClasses(placement: OverlayPlacement) {
  return {
    "top left": "bottom-full right-0",
    "top center": "bottom-full left-1/2 -translate-x-1/2",
    "top right": "bottom-full left-0",
    "bottom left": "top-full right-0",
    "bottom center": "top-full left-1/2 -translate-x-1/2",
    "bottom right": "top-full left-0"
  }[placement];
}

// Returns classes for the invisible bridge that extends the hover area
export function getBridgeClasses(placement: OverlayPlacement) {
  const isTop = placement.startsWith("top");
  // Bridge extends from the content towards the trigger
  return isTop
    ? "before:absolute before:left-0 before:right-0 before:top-full before:h-3 before:bg-transparent"
    : "before:absolute before:left-0 before:right-0 before:bottom-full before:h-3 before:bg-transparent";
}

export function getArrowClasses(placement: OverlayPlacement) {
  // Arrow is a 12px rotated square (w-3 h-3)
  // Vertical position: half overlaps the tooltip edge (-mt-1.5 or -mb-1.5 = 6px)
  // Horizontal position is handled by getArrowPositionStyle for left/right placements
  return {
    "top left": "bottom-0 -mb-1.5",
    "top center": "bottom-0 left-1/2 -translate-x-1/2 -mb-1.5",
    "top right": "bottom-0 -mb-1.5",
    "bottom left": "top-0 -mt-1.5",
    "bottom center": "top-0 left-1/2 -translate-x-1/2 -mt-1.5",
    "bottom right": "top-0 -mt-1.5"
  }[placement];
}

export function getArrowPositionStyle(placement: OverlayPlacement, triggerWidth: number): React.CSSProperties {
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

function getVerticalDirection(placement: OverlayPlacement) {
  return placement.includes("bottom") ? "bottom" : "top";
}

type HorizontalPosition = "left" | "center" | "right";

// Calculate the horizontal bounds of the tooltip for a given horizontal position
function getHorizontalBounds(
  tooltipWidth: number,
  buttonRect: DOMRect,
  position: HorizontalPosition
): { left: number; right: number } {
  switch (position) {
    case "left":
      // Tooltip right-aligned with trigger right edge
      return { left: buttonRect.right - tooltipWidth, right: buttonRect.right };
    case "center":
      // Tooltip centered on trigger
      const centerLeft = buttonRect.left + (buttonRect.width - tooltipWidth) / 2;
      return { left: centerLeft, right: centerLeft + tooltipWidth };
    case "right":
      // Tooltip left-aligned with trigger left edge
      return { left: buttonRect.left, right: buttonRect.left + tooltipWidth };
  }
}

// Check if a horizontal position fits within screen bounds (with padding)
function horizontalFits(
  tooltipWidth: number,
  buttonRect: DOMRect,
  position: HorizontalPosition,
  windowWidth: number
): boolean {
  const bounds = getHorizontalBounds(tooltipWidth, buttonRect, position);
  return bounds.left >= TOOLTIP_PADDING && bounds.right <= windowWidth - TOOLTIP_PADDING;
}

// NOTE: the rect object denotes where the preferred placement would be
/* STRATEGY:
1. Check vertical placement, flip if necessary, only flip if the opposite side fits within the padding
2. Check horizontal placement, move horizontally to the next possible placement (i.e if left does not fit, try center, then right, if right does not fit, try center, then left)
3. If both sides do not fit, leave in center
*/
export function determinePlacement(
  rect: DOMRect,
  buttonRect: DOMRect,
  placement: OverlayPlacement,
  windowHeight: number,
  windowWidth: number
) {
  const isBottom = placement.includes("bottom");
  const vertical = getVerticalDirection(placement);
  // Whether the tooltip never fits within the window bounds
  let neverFits: boolean = false;

  let horizontalPosition: HorizontalPosition = placement.includes("left")
    ? "left"
    : placement.includes("right")
      ? "right"
      : "center";

  // Check vertical placement, flip if necessary, only flip if the opposite side fits within the padding
  let finalVertical = vertical;
  if (isBottom && rect.bottom > windowHeight - TOOLTIP_PADDING && buttonRect.top - rect.height > TOOLTIP_PADDING) {
    finalVertical = "top";
  } else if (
    !isBottom &&
    rect.top < TOOLTIP_PADDING &&
    buttonRect.bottom + rect.height < windowHeight - TOOLTIP_PADDING
  ) {
    finalVertical = "bottom";
  }

  // Check horizontal placement, try next positions progressively
  const tooltipWidth = rect.width;
  let finalHorizontal: HorizontalPosition = horizontalPosition;

  if (!horizontalFits(tooltipWidth, buttonRect, horizontalPosition, windowWidth)) {
    // Define fallback order based on starting position
    const fallbackOrder: Record<HorizontalPosition, HorizontalPosition[]> = {
      left: ["center", "right"],
      center: ["left", "right"],
      right: ["center", "left"]
    };

    // Try each fallback position
    let found = false;
    for (const fallback of fallbackOrder[horizontalPosition]) {
      if (horizontalFits(tooltipWidth, buttonRect, fallback, windowWidth)) {
        finalHorizontal = fallback;
        found = true;
        break;
      }
    }
    // If nothing fits, move to center
    if (!found) {
      finalHorizontal = "center";
      neverFits = true;
    }
  }

  return {
    newPlacement: `${finalVertical} ${finalHorizontal}` as OverlayPlacement,
    neverFits
  };
}
