import React from "react";
import { SwitchProps } from "./Switch.types";
import { cn } from "../utils/cn";
import { getSwitchSizeClasses, getSwitchThumbSizeClasses, getSwitchThumbIndicatorsClasses } from "./Switch.utils";
import { Check, X } from "lucide-react";

export const Switch = (props: SwitchProps) => {
    const { checked, className, defaultChecked, disabled, onChange, onCheckedChange = () => { }, size = "md", thumbIndicators = false, ...rest } = props;

    const isControlled = checked !== undefined;
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(
        defaultChecked ?? false,
    );

    const isChecked = isControlled ? checked : uncontrolledChecked;

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const nextChecked = event.currentTarget.checked;

        onChange?.(event);

        // Allow the event to be cancelled
        if (event.defaultPrevented) {
            return;
        }

        if (!isControlled) {
            setUncontrolledChecked(nextChecked);
        }

        onCheckedChange?.(nextChecked);
    }

    return <span data-checked={isChecked} data-disabled={disabled} className={cn(
        "inline-flex items-center",
        { "cursor-not-allowed opacity-50": disabled },
        className,
    )} >
        <input {...rest}
            type="checkbox"
            role="switch"
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            className="peer sr-only"
            onChange={handleChange} />

        <span className={cn("relative block rounded-full transition-colors bg-surface-strong [input:focus-visible~&]:outline-2 [input:focus-visible~&]:outline-accent [input:focus-visible~&]:outline-offset-2", getSwitchSizeClasses(size), {
            "bg-accent outline-accent": isChecked,
        })} aria-hidden="true">
            <span className={cn("absolute left-1 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-transform motion-reduce:transition-none translate-x-0 bg-foreground duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                getSwitchThumbSizeClasses(size), {
                "translate-x-[calc(100%+2px)] bg-foreground-inverse": isChecked,
            })}>
                {thumbIndicators && isChecked && <Check className={cn("stroke-foreground", getSwitchThumbIndicatorsClasses(size))} />}
                {thumbIndicators && !isChecked && <X className={cn("stroke-foreground-inverse", getSwitchThumbIndicatorsClasses(size))} />}
            </span>
        </span>
    </span>
};