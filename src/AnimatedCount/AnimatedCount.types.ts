import React from "react";

export type AnimatedCountProps<T extends keyof JSX.IntrinsicElements = "span"> =
  React.ComponentPropsWithoutRef<T> & {
    /**
     * Element to render as
     * @default "span"
     */
    as?: T;
    /**
     * The number to animate to
     */
    count: number;
    /**
     * Duration of the animation in milliseconds
     * @default 2000
     */
    duration?: number;
    /**
     * The number at which the animation should slow down
     */
    slowDownAt?: number;
    /**
     * Factor to slow down the animation by when it reaches `slowDownAt`
     * @default 5
     */
    slowDownFactor?: number;
    /**
     * The number to start the animation from
     * @default 0
     */
    start?: number;
  };
