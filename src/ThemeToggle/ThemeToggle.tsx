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
    const { label = "theme", checked, className, defaultChecked, disabled, labelPosition, onChange, onCheckedChange = () => { }, size = "sm", ...rest } = props;

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

    const hiddenLabel = labelPosition === undefined ? <span className="sr-only">{label}</span> : null;

    return <label data-checked={isChecked} data-disabled={disabled} className={cn(
        "inline-flex items-center gap-2",
        { "cursor-not-allowed opacity-50": disabled },
        className,
    )} >
        <input {...rest}
            type="checkbox"
            role="switch"
            checked={isChecked}
            disabled={disabled}
            className="peer sr-only"
            onChange={handleChange} />
        {labelPosition === "left" && <span className="font-medium">{label}</span>}
        <span className={cn("relative block rounded-full transition-colors bg-surface-strong [input:focus-visible~&]:outline-2 peer-focus-visible~&:outline-foreground peer-focus-visible:outline-offset-2", getThemeToggleSizeClasses(size), {
            "bg-foreground outline-foreground": isChecked,
        })} aria-hidden="true">

            {trackIcon}
            <span className={cn("absolute left-1 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-transform motion-reduce:transition-none translate-x-0 bg-foreground duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                getThemeToggleThumbSizeClasses(size), {
                "translate-x-[calc(100%+0.5rem)] bg-foreground-inverse": isChecked,
            })}>
                {thumbIcon}
            </span>
        </span>
        {labelPosition === "right" && <span className="font-medium">{label}</span>}
        {hiddenLabel}
    </label>
};