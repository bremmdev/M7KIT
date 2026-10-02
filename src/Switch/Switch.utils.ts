import React from "react";
import { SwitchProps, SwitchSize } from "./Switch.types";

export const getSwitchSizeClasses = (size: SwitchSize) => {
    switch (size) {
        case "sm":
            return "h-5 w-10";
        case "md":
            return "h-6 w-12";
        case "lg":
            return "h-7 w-14";
    }
};

export const getSwitchThumbSizeClasses = (size: SwitchSize) => {
    switch (size) {
        case "sm":
            return "w-4 h-4";
        case "md":
            return "w-5 h-5";
        case "lg":
            return "w-6 h-6";
    }
};

export const getSwitchThumbIndicatorsClasses = (size: SwitchSize) => {
    switch (size) {
        case "sm":
            return "w-3 h-3";
        case "md":
            return "w-4 h-4";
        case "lg":
            return "w-5 h-5";
    }
};

/**
 * Dev-only warnings for misuse of the controlled/uncontrolled API, mirroring the ones React gives for native inputs.
 * Each warning is logged at most once per Switch instance. Stripped from production builds by the consumer's bundler.
 */
export const useSwitchDevWarnings = (props: SwitchProps) => {
    const { checked, defaultChecked, onChange, onCheckedChange, disabled, readOnly } = props;
    const isControlled = checked !== undefined;

    const initialIsControlled = React.useRef(isControlled);
    const warned = React.useRef(new Set<string>());

    React.useEffect(() => {
        if (process.env.NODE_ENV === "production") {
            return;
        }

        const warnOnce = (key: string, message: string) => {
            if (warned.current.has(key)) return;
            warned.current.add(key);
            console.warn(message);
        };

        if (isControlled !== initialIsControlled.current) {
            const [from, to] = initialIsControlled.current ? ["controlled", "uncontrolled"] : ["uncontrolled", "controlled"];
            warnOnce(
                "mode-switch",
                `Switch is changing from ${from} to ${to}. This is likely caused by \`checked\` changing between undefined and a boolean (e.g. \`checked={data?.flag}\` while data loads). ` +
                "Decide between a controlled or uncontrolled Switch for the lifetime of the component."
            );
        }

        if (isControlled && defaultChecked !== undefined) {
            warnOnce(
                "both-props",
                "Switch received both `checked` and `defaultChecked`. `defaultChecked` is ignored when `checked` is provided. " +
                "Use `checked` with `onCheckedChange` for a controlled Switch, or `defaultChecked` for an uncontrolled Switch."
            );
        }

        if (isControlled && !onChange && !onCheckedChange && !disabled && !readOnly) {
            warnOnce(
                "read-only",
                "Switch received `checked` without `onCheckedChange` or `onChange`, so it can never be toggled. " +
                "Use `defaultChecked` for an uncontrolled Switch, add `onCheckedChange`, or set `disabled` or `readOnly` if this is intended."
            );
        }
    }, [isControlled, defaultChecked, onChange, onCheckedChange, disabled, readOnly]);
};

type SwitchFormResetOptions = {
    isChecked: boolean;
    isControlled: boolean;
    defaultChecked?: boolean;
    /**
     * Called when the input's form is reset, with the value the browser resets the input to
     */
    onReset: (checked: boolean) => void;
};

/**
 * Keeps the Switch in sync with its form when the form is reset (a reset button, `form.reset()`,
 * or React 19's automatic reset after a `<form action>`).
 *
 * The inner input is always controlled by React, so the browser's reset changes the DOM behind React's back:
 * the visual state and the submitted value would disagree, and the next click would not fire onChange.
 */
export const useSwitchFormReset = (inputRef: React.RefObject<HTMLInputElement | null>, options: SwitchFormResetOptions) => {
    const { isControlled, defaultChecked } = options;

    // Latest render values, read by the native reset listener
    const latest = React.useRef(options);
    React.useLayoutEffect(() => {
        latest.current = options;
    });

    // The browser resets a checkbox to its DOM default (the `checked` attribute). React only writes that on mount,
    // so keep it in sync with the latest defaultChecked. In controlled mode it stays at the initial `checked` value.
    React.useLayoutEffect(() => {
        if (!isControlled && inputRef.current) {
            inputRef.current.defaultChecked = defaultChecked ?? false;
        }
    }, [inputRef, isControlled, defaultChecked]);

    React.useEffect(() => {
        const input = inputRef.current;
        // `.form` also covers inputs associated through the `form` attribute
        const form = input?.form;
        if (!input || !form) {
            return;
        }

        let restoreTimer: ReturnType<typeof setTimeout> | undefined;

        // The reset event fires before the browser resets the inputs
        function handleReset() {
            latest.current.onReset(input!.defaultChecked);

            // The browser then changes `input.checked` without going through its property setter, so React doesn't notice.
            // When no re-render follows (a controlled parent ignoring the request), the input would show the reset value and
            // React's change tracking would be stale. Once the reset is done, write the rendered value back so everything agrees.
            restoreTimer = setTimeout(() => {
                input!.checked = latest.current.isChecked;
            });
        }

        form.addEventListener("reset", handleReset);

        return () => {
            form.removeEventListener("reset", handleReset);
            clearTimeout(restoreTimer);
        };
    }, [inputRef]);
};
