import React from "react";
import { SwitchProps } from "./Switch.types";
import { cn } from "../utils/cn";
import { getSwitchSizeClasses, getSwitchThumbSizeClasses, getSwitchThumbIndicatorsClasses, useSwitchDevWarnings, useSwitchFormReset } from "./Switch.utils";
import { useMergedRef } from "../utils/hooks/useMergedRef";
import { announce, ensureLiveRegion } from "../utils/announce";
import { Check, X, Play, Pause, Lock } from "lucide-react";

export const Switch = (props: SwitchProps) => {
    const { "aria-describedby": ariaDescribedBy, checked, className, defaultChecked, disabled, onChange, onCheckedChange,
        readOnly, readOnlyMessage = "Read only", ref, size = "md", style, thumbIndicators = undefined, ...rest } = props;

    useSwitchDevWarnings(props);

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

    // Create the live region before it's needed (inside the switch's dialog, if any): screen readers can miss a message in a region that was only just added
    React.useEffect(() => {
        if (readOnly) {
            ensureLiveRegion(inputRef.current);
        }
    }, [readOnly]);

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

    // A lock replaces the indicators while read-only: a visual cue that isn't color alone and doesn't look disabled.
    // Hidden from screen readers with the rest of the track; they get readOnlyMessage instead
    const ThumbIcon = readOnly ? Lock
        : thumbIndicators === "check" ? (isChecked ? Check : X)
            : thumbIndicators === "play" ? (isChecked ? Play : Pause)
                : null;

    // Dim based on the input's :disabled state, not the prop, so a disabled <fieldset> ancestor dims the switch too.
    // In forced colors GrayText marks disabled instead, so the opacity is removed to keep it readable.
    // w-fit/h-fit: a flex or grid parent stretches its children by default, and the invisible input would stretch along,
    // making empty space next to the switch clickable
    return <span data-checked={isChecked} data-disabled={disabled} data-readonly={readOnly} className={cn(
        "relative inline-flex w-fit h-fit items-center has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50 forced-colors:has-[input:disabled]:opacity-100",
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
            aria-describedby={describedBy}
            className={cn("absolute inset-0 z-10 m-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed", {
                "cursor-default": readOnly,
            })}
            onChange={handleChange} />
        {/* The off-state border gives the track at least 3:1 contrast against the page (WCAG 1.4.11); the fill alone is too light.
            Forced colors (Windows high contrast) would replace every background with Canvas and hide the thumb, so the track opts out
            (inherited by the thumb and icons) and uses system colors: on is a Highlight track, disabled uses GrayText */}
        <span className={cn("relative block rounded-full border transition-colors [input:focus-visible~&]:outline-2 [input:focus-visible~&]:outline-accent [input:focus-visible~&]:outline-offset-2",
            "forced-colors:forced-color-adjust-none forced-colors:[input:focus-visible~&]:outline-[CanvasText] forced-colors:[input:disabled~&]:border-[GrayText]",
            getSwitchSizeClasses(size),
            isChecked
                ? "bg-accent border-transparent forced-colors:bg-[Highlight] forced-colors:border-[Highlight] forced-colors:[input:disabled~&]:bg-[GrayText]"
                : "bg-surface-strong border-foreground/50 forced-colors:bg-[Canvas] forced-colors:border-[CanvasText]",
        )} aria-hidden="true">
            {/* inset-s-0.75 + the 1px border keeps a 4px gap on both sides, so translate-x-full lands symmetrically.
                Translate has no logical variant, so RTL flips the direction explicitly to mirror the switch */}
            <span className={cn("absolute inset-s-0.75 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-transform motion-reduce:transition-none translate-x-0 duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                getSwitchThumbSizeClasses(size),
                isChecked
                    ? "translate-x-full rtl:-translate-x-full bg-foreground-inverse forced-colors:bg-[HighlightText] forced-colors:[input:disabled~*_&]:bg-[Canvas]"
                    : "bg-foreground forced-colors:bg-[CanvasText] forced-colors:[input:disabled~*_&]:bg-[GrayText]",
            )}>
                {ThumbIcon && <ThumbIcon className={cn(getSwitchThumbIndicatorsClasses(size), isChecked
                    ? "stroke-foreground forced-colors:stroke-[Highlight] forced-colors:[input:disabled~*_&]:stroke-[GrayText]"
                    : "stroke-foreground-inverse forced-colors:stroke-[Canvas]")} />}
            </span>
        </span>
        {/* `hidden` still works as a description target, but keeps the text out of a wrapping label's accessible name and out of browse mode */}
        {readOnly && <span id={readOnlyDescriptionId} hidden>{readOnlyMessage}</span>}
    </span >
};