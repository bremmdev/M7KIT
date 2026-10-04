import React from "react";
import { ThemeToggleProps, ThemeToggleSize } from "./ThemeToggle.types";
import { cn } from "../utils/cn";
import {
    getThemeToggleSizeClasses, getThemeToggleThumbSizeClasses, getThemeToggleTrackClusterClasses, getThemeToggleTrackStyleClasses,
    getThemeToggleThumbStyleClasses, getThemeToggleLockSizeClasses, getThemeToggleLockStyleClasses,
} from "./ThemeToggle.utils";
import { useCheckboxFormReset } from "../utils/hooks/useCheckboxFormReset";
import { useCheckedDevWarnings } from "../utils/hooks/useCheckedDevWarnings";
import { useMergedRef } from "../utils/hooks/useMergedRef";
import { announce, ensureLiveRegion } from "../utils/announce";
import { Star, Cloud, Lock } from "lucide-react";

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
    const { "aria-describedby": ariaDescribedBy, blackAndWhite = false, checked, className, defaultChecked, disabled, label = "Light mode",
        labelPosition, onChange, onCheckedChange, readOnly, readOnlyMessage = "Read only", ref, size = "sm", style, ...rest } = props;

    useCheckedDevWarnings("ThemeToggle", props);

    const isControlled = checked !== undefined;

    const [internalChecked, setInternalChecked] = React.useState(
        defaultChecked ?? false,
    );
    const isChecked = isControlled ? checked : internalChecked;

    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRef(inputRef, ref);

    // NVDA doesn't announce aria-readonly on switches, so read-only is also given as a description, before the consumer's own
    const readOnlyDescriptionId = React.useId();
    const describedBy = [readOnly && readOnlyDescriptionId, ariaDescribedBy].filter(Boolean).join(" ") || undefined;

    // Create the live region before it's needed (inside the toggle's dialog, if any): screen readers can miss a message in a region that was only just added
    React.useEffect(() => {
        if (readOnly) {
            ensureLiveRegion(inputRef.current);
        }
    }, [readOnly]);

    useCheckboxFormReset(inputRef, {
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
        // The state doesn't change, so screen readers say nothing: tell the user why their click or Space did nothing
        if (readOnly) {
            announce(readOnlyMessage, event.currentTarget);
            return;
        }

        const nextChecked = event.currentTarget.checked;

        onChange?.(event);

        if (!isControlled) {
            setInternalChecked(nextChecked);
        }

        onCheckedChange?.(nextChecked);
    }

    const trackIcon = isChecked ? <CloudCluster size={size} blackAndWhite={blackAndWhite} /> : <StarCluster size={size} blackAndWhite={blackAndWhite} />;

    const visibleLabel = <span className="font-medium">{label}</span>;

    // Dim based on the input's :disabled state, not the prop, so a disabled <fieldset> ancestor dims the toggle too.
    // In forced colors GrayText marks disabled instead, so the opacity is removed to keep it readable.
    // w-fit/h-fit: a flex or grid parent stretches its children by default, which would make empty space next to the toggle clickable.
    // relative: keeps the sr-only label positioned inside the toggle
    return <label data-checked={isChecked} data-disabled={disabled} data-readonly={readOnly} className={cn(
        "relative inline-flex w-fit h-fit items-center gap-2 has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50 forced-colors:has-[input:disabled]:opacity-100",
        className,
    )} style={style}>
        {labelPosition === "left" && visibleLabel}
        <span className="relative inline-flex shrink-0">
            {/* Invisible but stretched over the track, so touch screen readers find the switch where it is drawn */}
            <input {...rest}
                ref={mergedRef}
                type="checkbox"
                role="switch"
                checked={isChecked}
                disabled={disabled}
                aria-readonly={readOnly || undefined}
                aria-describedby={describedBy}
                className={cn("absolute inset-0 z-10 m-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed", {
                    "cursor-default": readOnly,
                })}
                onChange={handleChange} />
            {/* Forced colors (Windows high contrast) would replace every background with Canvas and hide the thumb, so the track opts out
                (inherited by the thumb and icons) and uses system colors: on is a Highlight track, disabled uses GrayText */}
            <span className={cn("relative block rounded-full border transition-colors outline-foreground [input:focus-visible~&]:outline-2 [input:focus-visible~&]:outline-offset-2",
                "forced-colors:forced-color-adjust-none forced-colors:[input:focus-visible~&]:outline-[CanvasText] forced-colors:[input:disabled~&]:border-[GrayText]",
                getThemeToggleSizeClasses(size),
                getThemeToggleTrackStyleClasses(blackAndWhite, isChecked),
                isChecked
                    ? "forced-colors:bg-[Highlight] forced-colors:border-[Highlight] forced-colors:[input:disabled~&]:bg-[GrayText]"
                    : "forced-colors:bg-[Canvas] forced-colors:border-[CanvasText]",
            )} aria-hidden="true">
                {trackIcon}
                {/* inset-s-0.75 + the 1px border keeps a 4px gap on both sides.
                    Translate has no logical variant, so RTL flips the direction explicitly to mirror the toggle */}
                <span className={cn("absolute inset-s-0.75 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-transform motion-reduce:transition-none translate-x-0 duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                    getThemeToggleThumbSizeClasses(size),
                    getThemeToggleThumbStyleClasses(blackAndWhite, isChecked),
                    isChecked
                        ? "translate-x-[calc(100%+0.5rem)] rtl:-translate-x-[calc(100%+0.5rem)] forced-colors:bg-[HighlightText] forced-colors:[input:disabled~*_&]:bg-[Canvas]"
                        : "forced-colors:bg-[CanvasText] forced-colors:[input:disabled~*_&]:bg-[GrayText]",
                )}>
                    {/* A visual cue for read-only that isn't color alone and doesn't look disabled. Screen readers get readOnlyMessage instead */}
                    {readOnly && <Lock className={cn(getThemeToggleLockSizeClasses(size), getThemeToggleLockStyleClasses(blackAndWhite, isChecked), isChecked
                        ? "forced-colors:stroke-[Highlight] forced-colors:[input:disabled~*_&]:stroke-[GrayText]"
                        : "forced-colors:stroke-[Canvas]")} />}
                </span>
            </span>
        </span>
        {labelPosition === "right" && visibleLabel}
        {labelPosition === undefined && <span className="sr-only">{label}</span>}
        {/* `hidden` still works as a description target, but keeps the text out of the label's accessible name and out of browse mode */}
        {readOnly && <span id={readOnlyDescriptionId} hidden>{readOnlyMessage}</span>}
    </label>
};
