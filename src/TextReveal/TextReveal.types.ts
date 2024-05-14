export interface TextRevealProps extends React.ComponentPropsWithoutRef<"div"> {
  /**
   * Default visible index, index of the child that will be visible first
   * @default 0
   */
  defaultVisibleIndex?: number;
  /**
   * Animation duration in milliseconds
   * @default 2000
   */
  animationDuration?: number;
  /**
   * Direction of the reveal effect
   * @default "down"
   */
  direction?: "down" | "up";
}
