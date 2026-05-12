export type SwitchSize = "sm" | "md" | "lg";

export interface SwitchProps
    extends Omit<React.ComponentPropsWithoutRef<"input">, "type" | "size"> {
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
     * Whether to show the check icon when the switch is checked and the X icon when the switch is unchecked
     * @default false
     */
    thumbIndicators?: boolean;
}