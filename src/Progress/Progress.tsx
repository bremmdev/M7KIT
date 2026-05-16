import { useId } from "react";
import { ProgressLabelProps, ProgressProps, ProgressTrackProps } from "./Progress.types";
import { cn } from "../utils/cn";
import { getProgressClasses, getProgressFillStyle, validateValues } from "./Progress.utils";

const ProgressLabel = (props: ProgressLabelProps) => {
    const { label, labelId } = props;
    return (
        <span id={labelId} role="presentation" className="font-medium">
            {label}
        </span>
    );
};

const ProgressTrack = (props: ProgressTrackProps) => {
    const { className, size, variant, rounded, value, min, max } = props;
    return (
        <div
            className={cn(
                "relative w-full overflow-hidden",
                getProgressClasses(size, variant),
                {
                    "rounded-full": rounded,
                },
                className,
            )}
        >
            <div
                className={cn("absolute left-0 top-0 h-full bg-accent transition-[width] duration-300 ease-out", {
                    "rounded-full": rounded,
                })}
                style={getProgressFillStyle(value, min, max)}
            />
        </div>
    );
};

export const Progress = (props: ProgressProps) => {
    const {
        "aria-label": ariaLabel,
        className,
        trackClassName,
        value,
        min = 0,
        max = 100,
        size = "md",
        variant = "fill",
        rounded = true,
        getValueText,
        label,
        ...rest
    } = props;

    const labelId = useId();

    validateValues({
        ariaLabel,
        label,
        min,
        max,
    });

    // Check if the value is indeterminate as we don't want to set the aria-valuenow attribute when it is indeterminate
    const isIndeterminate = value === undefined || value === null;

    // Clamp the value to the min and max values
    const clamped = isIndeterminate
        ? 0
        : Math.min(Math.max(value, min), max);

    const percent = ((clamped - min) / (max - min)) * 100;

    // Human readable value text with percentage as default
    const valueText = getValueText?.(clamped, min, max) ?? `${Math.round(percent)}%`;

    return (
        <div
            {...rest}
            role="progressbar"
            aria-label={!label ? ariaLabel : undefined}
            aria-labelledby={label ? labelId : undefined}
            aria-valuenow={isIndeterminate ? undefined : clamped}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuetext={isIndeterminate ? undefined : valueText}
            className={cn(
                "relative flex w-full flex-col gap-2",
                className,
            )}
        >
            <div className="flex items-center justify-between gap-2">
                {label && <ProgressLabel label={label} labelId={labelId} />}
                {!isIndeterminate && valueText && (
                    <span aria-hidden="true" className="ml-auto block italic">
                        {valueText}
                    </span>
                )}
            </div>
            <ProgressTrack size={size} variant={variant} rounded={rounded} value={clamped} min={min} max={max} className={trackClassName} />
        </div>
    );
};