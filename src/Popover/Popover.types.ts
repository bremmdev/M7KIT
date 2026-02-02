import * as React from "react";
import { OverlayPlacement } from "../shared/Overlay/types";

export type PopoverTriggerProps = React.ComponentProps<"button">;

export type PopoverContentProps = React.ComponentProps<"div"> & {
    /**
     * Placement of the popover. Only applicable when the popover fits within the viewport,
     * otherwise it will be placed on the opposite side.
     * @default "bottom center"
     */
    placement?: OverlayPlacement;
};

export type PopoverProps = React.ComponentProps<"div"> & {
    /**
     * Fade in on open
     * @default true
     */
    fade?: boolean;
    /**
     * Whether the popover is currently open in controlled mode
     * @default undefined
     */
    open?: boolean;
    /**
     * Event handler called when the popover is opened or closed.
     * Use this in controlled mode to update the parent component's state.
     */
    onOpenChange?: (open: boolean) => void;
};
