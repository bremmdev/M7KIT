import type { JSX } from "react";

export type TextAnimationProps<T extends keyof JSX.IntrinsicElements = "p"> =
  React.ComponentPropsWithoutRef<T> & {
    /**
     * Type of animation
     * @default "fade-in-blur"
     */
    animation?: "fade-in-blur" | "fade-in" | "slide-down" | "slide-up"
    /**
     * Element to render as
     * @default "p"
     */
    as?: T;
    /**
     * Delay between each word or character animation
     * @default 100
     */
    delay?: number;
    /**
     * Animate per word or per character
     * @default "word"
     */
    per?: "word" | "char";
  };
