export type LineClampRootProps = React.ComponentPropsWithoutRef<"div">;

export type LineClampProps<
  T extends keyof JSX.IntrinsicElements = "p",
> = React.ComponentPropsWithoutRef<T> & {
  /**
   * Number of lines to clamp
   * @default 3
   */
  lines?: number;
  /**
   * Element to render as
   * @default "p"
   */
  as?: T;
  /**
   * Animate the line clamp
   * @default true
   */
  animate?: boolean;
};

//button that toggles line clamp on and off
export type LineClampTriggerProps = React.ComponentPropsWithoutRef<"button"> & {
  /**
   * Text to show when line clamp is toggled on
   * @default "Show More"
   */
  showMoreText?: string;
  /**
   * Text to show when line clamp is toggled off
   * @default "Read Less"
   */
  showLessText?: string;
};
