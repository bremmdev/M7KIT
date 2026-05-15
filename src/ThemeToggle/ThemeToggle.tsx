import React from "react";
import { ThemeToggleProps, ThemeToggleSize } from "./ThemeToggle.types";
import { cn } from "../utils/cn";
import { getThemeToggleSizeClasses, getThemeToggleThumbSizeClasses, getThemeToggleTrackClusterClasses, getThemeToggleTrackStyleClasses, getThemeToggleThumbStyleClasses } from "./ThemeToggle.utils";
import { Star, Cloud } from "lucide-react";

const StarCluster = ({ size, blackAndWhite }: { size: ThemeToggleSize, blackAndWhite: boolean }) => {
    const c = getThemeToggleTrackClusterClasses(size, false, blackAndWhite);

    return (
        <div className={c.container} aria-hidden="true">
            <Star className={c.top} />
            <Star className={c.right} />
            <Star className={c.bottom} />
        </div>
    );
};

const CloudCluster = ({ size, blackAndWhite }: { size: ThemeToggleSize, blackAndWhite: boolean }) => {
    const c = getThemeToggleTrackClusterClasses(size, true, blackAndWhite);
    return (
        <div className={c.container} aria-hidden="true">
            <Cloud className={c.top} />
            <Cloud className={c.right} />
            <Cloud className={c.bottom} />
        </div>
    );
};

export const ThemeToggle = (props: ThemeToggleProps) => {
    const { blackAndWhite = false, checked, className, defaultChecked, disabled, label = "theme", labelPosition, onChange, onCheckedChange = () => { }, size = "sm", ...rest } = props;

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

    const trackIcon = isChecked ? <CloudCluster size={size} blackAndWhite={blackAndWhite} /> : <StarCluster size={size} blackAndWhite={blackAndWhite} />;

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
        <span className={cn("relative block rounded-full transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2", getThemeToggleSizeClasses(size), getThemeToggleTrackStyleClasses(blackAndWhite, isChecked)
        )} aria-hidden="true">

            {trackIcon}
            <span className={cn("absolute left-1 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-transform motion-reduce:transition-none translate-x-0 duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                getThemeToggleThumbSizeClasses(size), getThemeToggleThumbStyleClasses(blackAndWhite, isChecked), {
                "translate-x-[calc(100%+0.5rem)]": isChecked
            })}>
            </span>
        </span>
        {labelPosition === "right" && <span className="font-medium">{label}</span>}
        {hiddenLabel}
    </label>
};