import React from "react";

export type SegmentedControlProps = React.ComponentProps<"ul"> & {
  /**
   * fired when the value of the selected button changes,
   * @param value the value of the selected button, or the children of the selected button if the value prop is not provided
   */
  onValueChange?: (value: string) => void;
};

export type SegmentedControlButtonProps = React.ComponentProps<"button"> & {
  /**
   * Whether the button is the default selected button
   * @default false
   */
  defaultSelected?: boolean;
  /**
   * The value of the button. When provided, this value will be passed to the onValueChange callback when the button is selected.
   * If not provided, the children of the button will be used as the value.
   */
  value?: string;
};
