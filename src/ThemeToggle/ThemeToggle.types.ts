export type ThemeToggleSize = "sm" | "lg";

export interface ThemeToggleProps extends Omit<React.ComponentPropsWithRef<"input">, "type" | "size"> {
  /**
   * if true, the theme toggle will be black and white style
   * @default false
   */
  blackAndWhite?: boolean;
  /**
   * class names applied to the root `<label>` element. All other props, except `style`, are passed to the native input
   */
  className?: string;
  /**
   * inline styles applied to the root `<label>` element. All other props, except `className`, are passed to the native input
   */
  style?: React.CSSProperties;
  /**
   * accessible name of the theme toggle, visually hidden unless `labelPosition` is set.
   * The toggle is on (checked) in light mode, so name it after that state: screen readers announce it as "Light mode, switch, on".
   * @default "Light mode"
   */
  label?: string;
  /**
   * callback function when the theme toggle is changed
   */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * position of the visible label. Without it, the label is only available to screen readers.
   * Mirrored in right-to-left layouts, like the rest of the toggle: `left` places the label before the toggle in reading order.
   * @default undefined
   */
  labelPosition?: "left" | "right";
  /**
   * Prevents the user from changing the value. Unlike `disabled`, the toggle stays focusable, keeps full contrast,
   * and its value is still submitted with the form. Announced to screen readers with `aria-readonly`
   * @default false
   */
  readOnly?: boolean;
  /**
   * Tells screen reader users that a read-only toggle can't be changed: read as the toggle's description on focus,
   * and announced when they try to toggle it. Needed because screen readers like NVDA don't announce `aria-readonly`
   * on switches.
   * @default "Read only"
   */
  readOnlyMessage?: string;
  /**
   * size of the theme toggle
   * @default "sm"
   */
  size?: ThemeToggleSize;
}
