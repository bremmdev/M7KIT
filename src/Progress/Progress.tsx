import { useId } from "react";
import { ProgressProps } from "./Progress.types";
import { cn } from "../utils/cn";
import { getProgressClasses, getProgressFillStyle } from "./Progress.utils";

export const Progress = (props: ProgressProps) => {
    const {
        "aria-label": ariaLabel,
        className,
        containerClassName,
        value = 0,
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

    // Human readable value text
    const valueText = getValueText?.(value, min, max);

    return (
        <div
            {...rest}
            role="progressbar"
            aria-label={!label ? ariaLabel : undefined}
            aria-labelledby={label ? labelId : undefined}
            aria-valuenow={value}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuetext={valueText}
            className={cn(
                "relative flex w-full flex-col items-start justify-start gap-2",
                containerClassName,
            )}
        >
            {label && (
                <span id={labelId} role="presentation" className="font-medium">
                    {label}
                </span>
            )}

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
                    className={cn("absolute left-0 top-0 h-full bg-accent", {
                        "rounded-full": rounded,
                    })}
                    style={getProgressFillStyle(value, min, max)}
                />
            </div>

            {valueText && (
                <span aria-hidden="true" className="block text-sm italic">
                    {valueText}
                </span>
            )}
        </div>
    );
};