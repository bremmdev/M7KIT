import React from "react";

type CheckboxFormResetOptions = {
    isChecked: boolean;
    isControlled: boolean;
    defaultChecked?: boolean;
    /**
     * Called when the input's form is reset, with the value the browser resets the input to
     */
    onReset: (checked: boolean) => void;
};

/**
 * Keeps a checkbox-based component (Switch, ThemeToggle) in sync with its form when the form is reset
 * (a reset button, `form.reset()`, or React 19's automatic reset after a `<form action>`).
 *
 * The inner input is always controlled by React, so the browser's reset changes the DOM behind React's back:
 * the visual state and the submitted value would disagree, and the next click would not fire onChange.
 */
export const useCheckboxFormReset = (inputRef: React.RefObject<HTMLInputElement | null>, options: CheckboxFormResetOptions) => {
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
