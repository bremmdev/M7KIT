import React from "react";

export type Placement = "right" | "left" | "top" | "bottom";

export type DrawerProps = React.ComponentPropsWithRef<"dialog"> & {
  /**
   * Placement of the drawer on the screen
   * @default "right"
   */
  placement?: Placement;
};

export type DrawerContentProps = React.ComponentPropsWithRef<"div">;

export type DrawerTriggerProps = React.ComponentPropsWithRef<"button"> & {
    /**
   * If true, the trigger will not be visible when the drawer is open
   * @default false
   */
    hideTriggerWhenOpen?: boolean;
};