import { ProgressSize } from "./Progress.types";

export const getProgressClasses = (size: ProgressSize, variant: "fill" | "outline") => {
    const sizeMap = {
        sm: "h-2",
        md: "h-3",
        lg: "h-4",
    };

    const variantMap = {
        fill: "bg-accent/25",
        outline: "bg-transparent outline-accent outline",
    } as const;

    return `${sizeMap[size]} ${variantMap[variant]}`;
};

export const getProgressFillStyle = (value: number, min: number, max: number, indeterminate: boolean) => {
    if (indeterminate) {
        return { width: "50%" };
    }

    const range = max - min;
    const percentage = range === 0 ? 0 : ((value - min) / range) * 100;
    const clampedPercentage = Math.min(100, Math.max(0, percentage));

    return { width: `${clampedPercentage}%` };
};

export const validateValues = ({
    min,
    max,
    ariaLabel,
    label,
}: {
    min: number;
    max: number;
    ariaLabel?: string;
    label?: string;
}) => {
    if (max < min) {
        console.warn("Progress: max must be greater than min");
    }

    if (!ariaLabel && !label) {
        console.warn("Progress: ariaLabel or label must be provided for proper accessibility");
    }
};