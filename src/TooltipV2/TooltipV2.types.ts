import * as React from "react";

export type Placement =
    | "top left"
    | "top center"
    | "top right"
    | "bottom left"
    | "bottom center"
    | "bottom right";

export type TooltipTriggerProps = React.ComponentProps<"button">;

export type TooltipContentProps = React.ComponentProps<"div"> & {
    /**
    * Placement of the tooltip. Only applicable when the tooltip fits within the viewport,
    * otherwise it will be placed on the opposite side.
    * @default "bottom center"
    */
    placement?: Placement;
}

export type ToolTipProps = React.ComponentPropsWithoutRef<"div"> & {
    /**
    * Fade in on hover
    * @default true
    */
    fade?: boolean;
    /** Time user needs to hover for the tooltip to appear
     * @default 500
     */
    hoverDelay?: number;
    /**
    * Whether the tooltip is currently open
    * @default undefined
    */
    open?: boolean;
    /**
     * Event handler called when the tooltip is opened or closed.
     */
    onOpenChange?: (open: boolean) => void;
};
