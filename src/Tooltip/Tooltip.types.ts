export type Placement =
  | "top left"
  | "top center"
  | "top right"
  | "bottom left"
  | "bottom center"
  | "bottom right";

export type TooltipTriggerProps = React.ComponentPropsWithoutRef<"button">;

export type TooltipContentProps = React.ComponentPropsWithoutRef<"div">;

export type TooltipProps = React.ComponentPropsWithoutRef<"div"> & {
  /** Time user needs to hover for the tooltip to appear
   * @default 500
   */
  hoverDelay?: number;
  /**
   * Placement of the tooltip. Only applicable when the tooltip fits within the viewport,
   * otherwise it will be placed on the opposite side.
   * @default "bottom center"
   */
  placement?: Placement;
  /**
   * Fade in on hover
   * @default true
   */
  fade?: boolean;
};
