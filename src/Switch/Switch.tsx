


import React from "react";
import { SwitchProps } from "./Switch.types";
import { cn } from "../utils/cn";
import { getSwitchSizeClasses, getSwitchThumbSizeClasses } from "./Switch.utils";

export const Switch = (props: SwitchProps) => {
    const { checked, defaultChecked, disabled, onChange, onCheckedChange, size = "md", className, ...rest } = props;

    const isControlled = checked !== undefined;
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(
        defaultChecked ?? false,
    );

    const isChecked = isControlled ? checked : uncontrolledChecked;

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (!isControlled) {
            setUncontrolledChecked(event.target.checked);
        }

        onChange?.(event);
        onCheckedChange?.(event.target.checked);
    }

    return <span className={cn(
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

        <span className={cn("relative block rounded-full bg-surface-strong [input:focus-visible~&]:outline-2 [input:focus-visible~&]:outline-accent [input:focus-visible~&]:outline-offset-2", getSwitchSizeClasses(size), {
            "bg-accent outline-accent": isChecked,
        })} aria-hidden="true">
            <span className={cn("absolute left-1 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-transform translate-x-0 bg-foreground duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                getSwitchThumbSizeClasses(size), {
                "translate-x-[calc(100%+2px)] bg-foreground-inverse": isChecked,
            })}></span>
        </span>
    </span>
};