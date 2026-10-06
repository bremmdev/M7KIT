import type { ButtonVariant } from "./Button.types";

// Forced colors (Windows high contrast), following React Spectrum for the filled variants and Fluent UI for the outlined one:
// - primary and cta stay filled: ButtonFace on ButtonText, HighlightText on Highlight on hover. Forced colors would otherwise
//   replace the fill with ButtonFace and make them look like the secondary variant. They opt out with forced-color-adjust-none,
//   so every color is set to a system color, and the disabled colors in Button.tsx override them
// - secondary inverts on hover: Highlight text and border on HighlightText. A Highlight border alone is hard to tell from
//   the CanvasText border in light themes. It opts out on hover only, to remove the text backplate
const filledForcedColors =
  "forced-colors:forced-color-adjust-none forced-colors:border forced-colors:border-[ButtonText] forced-colors:bg-[ButtonText] forced-colors:text-[ButtonFace] forced-colors:not-disabled:hover:border-[Highlight] forced-colors:not-disabled:hover:bg-[Highlight] forced-colors:not-disabled:hover:text-[HighlightText]";

const outlinedForcedColors =
  "forced-colors:not-disabled:hover:forced-color-adjust-none forced-colors:not-disabled:hover:border-[Highlight] forced-colors:not-disabled:hover:bg-[HighlightText] forced-colors:not-disabled:hover:text-[Highlight]";

export const getButtonVariantClasses = (variant: ButtonVariant) => {
  switch (variant) {
    case "primary":
      return `bg-button-accent dark:bg-button-accent text-foreground-inverse dark:text-foreground focus-ring hover:bg-button-accent/90 dark:hover:bg-button-accent/90 ${filledForcedColors}`;
    case "secondary":
      return `border border-accent dark:border-accent bg-accent/5 dark:bg-accent/5 text-accent dark:text-foreground focus-ring hover:bg-accent/10 dark:hover:bg-accent/20 ${outlinedForcedColors}`;
    case "cta":
      return `bg-button-accent dark:bg-button-accent text-foreground-inverse dark:text-foreground focus-ring hover:bg-button-accent/90 dark:hover:bg-button-accent/90 ${filledForcedColors}`;
  }
};
