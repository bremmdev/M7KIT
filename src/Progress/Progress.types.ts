export type ProgressSize = "sm" | "md" | "lg";
export type ProgressVariant = "fill" | "outline";

export type ProgressProps = React.ComponentPropsWithoutRef<"div"> & {
    /**
     * Function to get the text to display for the progress bar
     * Is used to set the aria-valuetext attribute for human readable value
     * @default undefined
     */
    getValueText?: (value: number, min: number, max: number) => string;
    /**
     * Label of the progress bar
     * Is display next to the progress bar and used for aria-labelledby attribute
     * @default undefined
     */
    label?: string;
    /**
     * Minimum value of the progress bar
     * @default 0
     */
    min?: number;
    /**
     * Maximum value of the progress bar
     * @default 100
     */
    max?: number;
    /**
     * Whether to round the progress bar to create a pill shape
     * @default true
     */
    rounded?: boolean;
    /**
     * Size of the progress bar
     * @default "md"
     */
    size?: ProgressSize;
    /**
     * className for the track of the progress bar
     * Is used to style the track of the progress bar
     * @default undefined
     */
    trackClassName?: string;
    /**
     * The controlled value of the progress bar
     * @default undefined
     */
    value?: number;
    /**
     * Variant of the progress bar
     * @default "fill"
     */
    variant?: ProgressVariant;
};

export type ProgressLabelProps = {
    label: string;
    labelId: string;
};

export type ProgressTrackProps = {
    className?: string;
    size: ProgressSize;
    variant: ProgressVariant;
    rounded: boolean;
    value: number;
    min: number;
    max: number;
};