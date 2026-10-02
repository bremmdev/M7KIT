import React from "react";
import { SwitchProps } from "./Switch.types";
import { cn } from "../utils/cn";
import { getSwitchSizeClasses, getSwitchThumbSizeClasses, getSwitchThumbIndicatorsClasses, useSwitchDevWarnings, useSwitchFormReset } from "./Switch.utils";
import { useMergedRef } from "../utils/hooks/useMergedRef";
import { Check, X, Play, Pause } from "lucide-react";

export const Switch = (props: SwitchProps) => {
    const { checked, className, defaultChecked, disabled, onChange, onCheckedChange,
        readOnly, ref, size = "md", style, thumbIndicators = undefined, ...rest } = props;

    useSwitchDevWarnings(props);

    const isControlled = checked !== undefined;

    const [internalChecked, setInternalChecked] = React.useState(
        defaultChecked ?? false,
    );

    const isChecked = isControlled ? checked : internalChecked;

    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRef(inputRef, ref);

    useSwitchFormReset(inputRef, {
        isChecked,
        isControlled,
        defaultChecked,
        onReset: (resetChecked) => {
            if (!isControlled) {
                setInternalChecked(resetChecked);
            }

            // In controlled mode this is a request: the parent decides whether to accept the reset
            if (resetChecked !== isChecked) {
                onCheckedChange?.(resetChecked);
            }
        },
    });

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        // Browsers ignore `readonly` on checkboxes, so block the change here. React then puts the rendered value back.
        if (readOnly) {
            return;
        }

        const nextChecked = event.currentTarget.checked;

        onChange?.(event);

        if (!isControlled) {
            setInternalChecked(nextChecked);
        }

        onCheckedChange?.(nextChecked);
    }

    return <span data-checked={isChecked} data-disabled={disabled} data-readonly={readOnly} className={cn(
        "relative inline-flex items-center",
        { "cursor-not-allowed opacity-50": disabled },
        className,
    )} style={style}>
        {/* Invisible but stretched over the track, so the visible switch is clickable even without a wrapping label */}
        <input {...rest}
            ref={mergedRef}
            type="checkbox"
            role="switch"
            checked={isChecked}
            disabled={disabled}
            aria-readonly={readOnly || undefined}
            className={cn("absolute inset-0 z-10 m-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed", {
                "cursor-default": readOnly,
            })}
            onChange={handleChange} />
        {/* The off-state border gives the track at least 3:1 contrast against the page (WCAG 1.4.11); the fill alone is too light */}
        <span className={cn("relative block rounded-full border border-foreground/50 transition-colors bg-surface-strong [input:focus-visible~&]:outline-2 [input:focus-visible~&]:outline-accent [input:focus-visible~&]:outline-offset-2", getSwitchSizeClasses(size), {
            "bg-accent border-transparent": isChecked,
        })} aria-hidden="true">
            {/* left-[3px] + the 1px border keeps a 4px gap on both sides, so translate-x-full lands symmetrically */}
            <span className={cn("absolute left-[3px] top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-transform motion-reduce:transition-none translate-x-0 bg-foreground duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                getSwitchThumbSizeClasses(size), {
                "translate-x-full bg-foreground-inverse": isChecked,
            })}>
                {thumbIndicators === "check" && isChecked && <Check className={cn("stroke-foreground", getSwitchThumbIndicatorsClasses(size))} />}
                {thumbIndicators === "play" && isChecked && <Play className={cn("stroke-foreground", getSwitchThumbIndicatorsClasses(size))} />}
                {thumbIndicators === "check" && !isChecked && <X className={cn("stroke-foreground-inverse", getSwitchThumbIndicatorsClasses(size))} />}
                {thumbIndicators === "play" && !isChecked && <Pause className={cn("stroke-foreground-inverse", getSwitchThumbIndicatorsClasses(size))} />}
            </span>
        </span>
    </span>
};