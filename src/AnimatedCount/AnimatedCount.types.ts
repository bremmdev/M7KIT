import React from "react";
import { JSX } from "react";

export type AnimatedCountProps<T extends keyof JSX.IntrinsicElements = "span"> = React.ComponentPropsWithoutRef<T> & {
  /**
   * Element to render as
   * @default "span"
   */
  as?: T;
  /**
   * The number to animate to. When it changes, the count animates from the number shown to the new one
   */
  count: number;
  /**
   * Duration of the animation in milliseconds, from `start` (or from the number shown when `count` changed) to `count`
   * @default 2000
   */
  duration?: number;
  /**
   * The number at which the animation should slow down
   */
  slowDownAt?: number;
  /**
   * Factor to slow down the animation by when it reaches `slowDownAt`
   * @default 10
   */
  slowDownFactor?: number;
  /**
   * The number to start the animation from. When it changes, the animation starts again from it
   * @default 0
   */
  start?: number;
  /**
   * How much the count changes per step. The count always moves toward `count`, so the sign is ignored,
   * and the last step stops at `count`. With decimals, every number is shown with them (0.5, 1.0, 1.5)
   * @default 1
   */
  step?: number;
};
