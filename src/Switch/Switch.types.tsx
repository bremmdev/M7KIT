export type SwitchSize = "sm" | "md" | "lg";

export interface SwitchProps extends Omit<React.ComponentPropsWithRef<"input">, "type" | "size"> {
  /**
   * class names applied to the root element. All other props, except `style`, are passed to the native input
   */
  className?: string;
  /**
   * inline styles applied to the root element. All other props, except `className`, are passed to the native input
   */
  style?: React.CSSProperties;
  /**
   * Prevents the user from changing the value. Unlike `disabled`, the switch stays focusable, keeps full contrast,
   * and its value is still submitted with the form. Announced to screen readers with `aria-readonly`
   * @default false
   */
  readOnly?: boolean;
  /**
   * Tells screen reader users that a read-only switch can't be changed: read as the switch's description on focus,
   * and announced when they try to toggle it. Needed because screen readers like NVDA don't announce `aria-readonly`
   * on switches.
   * @default "Read only"
   */
  readOnlyMessage?: string;
  /**
   * callback function when the switch is changed
   */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * size of the switch
   * @default "md"
   */
  size?: SwitchSize;
  /**
   * Icons to show on thumb. Valid values:
   * - "play": Play icon when the switch is checked and a pause icon when the switch is unchecked
   * - "check": Check icon when the switch is checked and an X icon when the switch is unchecked
   * @default undefined
   */
  thumbIndicators?: "play" | "check";
}
