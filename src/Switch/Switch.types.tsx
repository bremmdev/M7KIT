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
     * Icons to show on thumb. Valid values:
     * - "play": Play icon when the switch is checked and a pause icon when the switch is unchecked
     * - "check": Check icon when the switch is checked and an X icon when the switch is unchecked
     * @default undefined
     */
    thumbIndicators?: "play" | "check"
}