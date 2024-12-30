import { Placement } from "./Tooltip.types";

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

function getDirections(placement: Placement) {
  return {
    isBottom: placement.includes("bottom"),
    isCenter: placement.includes("center"),
    isLeft: placement.includes("left"),
    isRight: placement.includes("right"),
  };
}

//NOTE: the rect object denotes where the preferred placement would be
export function determinePlacement(
  rect: DOMRect,
  buttonRect: DOMRect,
  placement: Placement,
  windowHeight: number,
  windowWidth: number
) {
  const { isBottom, isCenter, isLeft, isRight } = getDirections(placement);
  let calculatedPlacement: Placement = placement;

  // Check vertical placement, flip if necessary
  if (isBottom && rect.bottom > windowHeight && buttonRect.top - rect.height > 0) {
    calculatedPlacement = calculatedPlacement.replace(
      "bottom",
      "top"
    ) as Placement;
  } else if (!isBottom && rect.top < 0 && buttonRect.top + rect.height < windowHeight) {
    calculatedPlacement = calculatedPlacement.replace(
      "top",
      "bottom"
    ) as Placement;
  }

  // Check horizontal placement, flip if necessary, only flip if the opposite side fits
  if (isLeft && rect.left < 0 && buttonRect.left + rect.width < windowWidth) {
    calculatedPlacement = calculatedPlacement.replace(
      "left",
      "right"
    ) as Placement;
  } else if (
    isRight &&
    rect.right > windowWidth &&
    buttonRect.right - rect.width > 0
  ) {
    calculatedPlacement = calculatedPlacement.replace(
      "right",
      "left"
    ) as Placement;
  } else if (isCenter) {
    //leave in center if both sides do not fit
    if(buttonRect.left + rect.width > windowWidth && buttonRect.right - rect.width < 0) return calculatedPlacement;

    if (rect.left < 0) {
      calculatedPlacement = calculatedPlacement.replace(
        "center",
        "right"
      ) as Placement;
    } else if (rect.right > windowWidth) {
      calculatedPlacement = calculatedPlacement.replace(
        "center",
        "left"
      ) as Placement;
    }
  }

  return calculatedPlacement;
}
