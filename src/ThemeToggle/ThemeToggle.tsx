import React from "react";
import { ThemeToggleProps, ThemeToggleSize } from "./ThemeToggle.types";
import { cn } from "../utils/cn";
import { getThemeToggleSizeClasses, getThemeToggleThumbSizeClasses, getThemeToggleThumbIndicatorsClasses, getThemeToggleTrackClusterClasses } from "./ThemeToggle.utils";
import { Moon, Sun, Star, Cloud } from "lucide-react";

const StarCluster = ({ size }: { size: ThemeToggleSize }) => {
    const c = getThemeToggleTrackClusterClasses(size, false);

    return (
        <div className={c.container} aria-hidden="true">
            <Star className={c.top} />
            <Star className={c.right} />
            <Star className={c.bottom} />
        </div>
    );
};

const CloudCluster = ({ size }: { size: ThemeToggleSize }) => {
    const c = getThemeToggleTrackClusterClasses(size, true);
    return (
        <div className={c.container} aria-hidden="true">
            <Cloud className={c.top} />
            <Cloud className={c.right} />
            <Cloud className={c.bottom} />
        </div>
    );
};

export const ThemeToggle = (props: ThemeToggleProps) => {
    const { "aria-label": ariaLabel = "theme", checked, className, defaultChecked, disabled, onChange, onCheckedChange = () => { }, size = "sm", ...rest } = props;

    const isControlled = checked !== undefined;

    const [internalChecked, setInternalChecked] = React.useState(
        defaultChecked ?? false,
    );
    const isChecked = isControlled ? checked : internalChecked;

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const nextChecked = event.currentTarget.checked;

        onChange?.(event);

        // Allow the event to be cancelled
        if (event.defaultPrevented) {
            return;
        }

        if (!isControlled) {
            setInternalChecked(nextChecked);
        }

        onCheckedChange?.(nextChecked);
    }

    // OFF is moon, ON is sun
    const thumbIcon = isChecked ? <Sun className={cn("stroke-foreground", getThemeToggleThumbIndicatorsClasses(size))} /> : <Moon className={cn("stroke-foreground-inverse", getThemeToggleThumbIndicatorsClasses(size))} />;
    const trackIcon = isChecked ? <CloudCluster size={size} /> : <StarCluster size={size} />;

    return <span data-checked={isChecked} data-disabled={disabled} className={cn(
        "inline-flex items-center",
        { "cursor-not-allowed opacity-50": disabled },
        className,
    )} >
        <input {...rest}
            type="checkbox"
            role="switch"
            checked={isChecked}
            disabled={disabled}
            aria-label={ariaLabel}
            className="peer sr-only"
            onChange={handleChange} />

        <span className={cn("relative block rounded-full transition-colors bg-surface-strong [input:focus-visible~&]:outline-2 [input:focus-visible~&]:outline-accent [input:focus-visible~&]:outline-offset-2", getThemeToggleSizeClasses(size), {
            "bg-foreground outline-accent": isChecked,
        })} aria-hidden="true">
            {trackIcon}
            <span className={cn("absolute left-1 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-transform motion-reduce:transition-none translate-x-0 bg-foreground duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                getThemeToggleThumbSizeClasses(size), {
                "translate-x-[calc(100%+0.5rem)] bg-foreground-inverse": isChecked,
            })}>
                {thumbIcon}
            </span>
        </span>
    </span>
};