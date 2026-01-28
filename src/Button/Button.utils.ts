import type { ButtonVariant } from "./Button.types";

export const getButtonVariantClasses = (variant: ButtonVariant) => {
  switch (variant) {
    case "primary":
      return "bg-button-accent dark:bg-button-accent text-foreground-inverse dark:text-foreground focus-ring hover:bg-button-accent/90 dark:hover:bg-button-accent/90";
    case "secondary":
      return "border border-accent dark:border-accent bg-accent/5 dark:bg-accent/5 text-accent dark:text-foreground focus-ring hover:bg-accent/10 dark:hover:bg-accent/20";
    case "cta":
      return "bg-button-accent dark:bg-button-accent text-foreground-inverse dark:text-foreground focus-ring hover:bg-button-accent/90 dark:hover:bg-button-accent/90";
  }
};
