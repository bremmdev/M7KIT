export type ThemeToggleSize = "sm" | "lg";

export interface ThemeToggleProps
    extends Omit<React.ComponentPropsWithoutRef<"input">, "type" | "size"> {
    /**
     * label of the theme toggle, it is used for accessibility but visually hidden by default
     * @default "theme"
     */
    label?: string;
    /**
     * callback function when the theme toggle is changed
     */
    onCheckedChange?: (checked: boolean) => void;
    /**
     * position of the label of the theme toggle, default the label is hidden
     * @default undefined
     */
    labelPosition?: "left" | "right";
    /**
     * size of the theme toggle
     * @default "sm"
     */
    size?: ThemeToggleSize;
}