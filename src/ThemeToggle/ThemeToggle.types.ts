export type ThemeToggleSize = "sm" | "lg";

export interface ThemeToggleProps
    extends Omit<React.ComponentPropsWithoutRef<"input">, "type" | "size"> {
    /**
     * callback function when the theme toggle is changed
     */
    onCheckedChange?: (checked: boolean) => void;
    /**
     * size of the theme toggle
     * @default "sm"
     */
    size?: ThemeToggleSize;
}