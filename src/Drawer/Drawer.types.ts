import React from "react";

export type Placement = "right" | "left" | "top" | "bottom";

export type DrawerProps = React.ComponentPropsWithRef<"dialog"> & {
  /**
   * Callback when the drawer is closed
   */
  onClose?: () => void;
  /**
   * Callback when the drawer is opened
   */
  onOpen?: () => void;
  /**
   * Placement of the drawer on the screen
   * @default "right"
   */
  placement?: Placement;
  /**
   * If true, the scroll position will be reset to 0 when the drawer is opened
   * @default true
   */
  resetScroll?: boolean;
};

export type DrawerContentProps = React.ComponentPropsWithRef<"div">;

export type DrawerTriggerProps = React.ComponentPropsWithRef<"button"> & {
  /**
   * If true, the trigger will not be visible when the drawer is open
   * @default false
   */
  hideTriggerWhenOpen?: boolean;
};
