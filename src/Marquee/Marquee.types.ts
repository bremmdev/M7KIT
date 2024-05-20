export interface MarqueeProps extends React.ComponentPropsWithoutRef<"div"> {
  /**
   * Animation duration in milliseconds
   * @default 5000
   */
  animationDuration?: number;
  /**
   * Direction of the marquee effect
   * @default "left"
   */
  direction?: "left" | "right" | "up" | "down";
  /**
   * Animation should be paused on hover
   * @default true
   */
  pauseOnHover?: boolean;
}
