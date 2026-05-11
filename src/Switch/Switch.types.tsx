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
}