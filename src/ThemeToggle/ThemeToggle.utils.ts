import { ThemeToggleSize } from "./ThemeToggle.types";

export const getThemeToggleSizeClasses = (size: ThemeToggleSize) => {
  switch (size) {
    case "sm":
      return "h-8 w-16";
    case "lg":
      return "h-10 w-20";
  }
};

export const getThemeToggleThumbSizeClasses = (size: ThemeToggleSize) => {
  switch (size) {
    case "sm":
      return "w-6 h-6";
    case "lg":
      return "w-8 h-8";
  }
};

export const getThemeToggleLockSizeClasses = (size: ThemeToggleSize) => {
  switch (size) {
    case "sm":
      return "size-4";
    case "lg":
      return "size-5";
  }
};

/**
 * The border gives the track at least 3:1 contrast (WCAG 1.4.11) against the background and every surface token,
 * in light and dark mode; the fills alone are too close to some of them.
 * In light mode the on-state fills have enough contrast, so the border is transparent, which keeps the size the same in both states.
 * Dark surfaces get lighter up to surface-strong, so in dark mode every track except the light blackAndWhite on-track gets a stronger border
 */
export const getThemeToggleTrackStyleClasses = (blackAndWhite: boolean, checked: boolean) => {
  if (blackAndWhite) {
    return checked
      ? "bg-foreground border-transparent"
      : "bg-surface-strong border-foreground/50 dark:border-foreground/70";
  }

  // blue-600 instead of a lighter blue, so the sun thumb keeps 3:1 contrast against the day sky
  return checked
    ? "bg-blue-600 border-transparent dark:border-foreground/70"
    : "bg-blue-800 border-foreground/50 dark:border-foreground/70";
};

export const getThemeToggleThumbStyleClasses = (blackAndWhite: boolean, checked: boolean) => {
  if (blackAndWhite) {
    return checked ? "bg-foreground-inverse" : "bg-foreground";
  }

  return checked ? "bg-amber-300" : "bg-slate-200";
};

/** The lock shown on the thumb while read-only, in a color that contrasts with the thumb */
export const getThemeToggleLockStyleClasses = (blackAndWhite: boolean, checked: boolean) => {
  if (blackAndWhite) {
    return checked ? "stroke-foreground" : "stroke-foreground-inverse";
  }

  return checked ? "stroke-slate-900" : "stroke-blue-800";
};

/** Decorative track icons for the theme toggle, a cluster of Stars (off) or Clouds (on), on the side the thumb is not on */
export const getThemeToggleTrackClusterClasses = (
  size: ThemeToggleSize,
  isChecked: boolean,
  blackAndWhite: boolean
) => {
  const iconSize = size === "sm" ? "size-3" : "size-4";

  // Forced colors: the track opts out of color adjustment, so the icons use the same system colors as the thumb
  const stroke = isChecked
    ? `${blackAndWhite ? "stroke-foreground-inverse" : "stroke-white"} forced-colors:stroke-[HighlightText] forced-colors:[input:disabled~*_&]:stroke-[Canvas]`
    : `${blackAndWhite ? "stroke-foreground" : "stroke-amber-300"} forced-colors:stroke-[CanvasText] forced-colors:[input:disabled~*_&]:stroke-[GrayText]`;

  const icon = `absolute fill-none ${iconSize} ${stroke}`;

  // Logical insets, so the clusters mirror with the thumb in right-to-left layouts
  if (isChecked) {
    return {
      container: "pointer-events-none absolute inset-y-0 inset-s-0 inset-e-[50%]",
      top: `${icon} inset-s-1 top-1`,
      right: `${icon} inset-e-0 top-[40%] -translate-y-1/2`,
      bottom: `${icon} inset-s-3 bottom-1`
    };
  }

  return {
    container: "pointer-events-none absolute inset-y-0 inset-s-[50%] inset-e-0",
    top: `${icon} inset-s-0 top-1`,
    right: `${icon} inset-e-1 top-[40%] -translate-y-1/2`,
    bottom: `${icon} inset-s-2 bottom-1`
  };
};
