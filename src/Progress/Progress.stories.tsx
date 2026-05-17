import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { Progress } from "./Progress";
import { ProgressProps } from "./Progress.types";

/**
 * The `Progress` component renders a determinate or indeterminate progress bar with an optional text label
 * and optional human-readable value text. The track supports **fill** and **outline** variants, three **sizes**,
 * and pill or square corners. Values are clamped between `min` and `max`.
 *
 * ## Features
 * - **Determinate and indeterminate**: Pass a numeric `value` for a fixed proportion; omit `value` for indeterminate (animated) progress. This is useful for loading states or when the progress is not known in advance.
 * - **Range**: Configure `min` (default `0`) and `max` (default `100`); the fill width and ARIA values use the same range.
 * - **Variants**: `fill` (filled track background) or `outline` (outlined track).
 * - **Sizes**: `sm`, `md` (default), or `lg` for track height.
 * - **Label**: Optional `label` is shown above the progress bar on the left and is used for the `aria-labelledby` attribute; optional `getValueText` customizes the string shown above the progressbar to the right. Default value text is a rounded percentage.
 * - **Styling**: `className` styles the root; `trackClassName` targets the track. Use `rounded={false}` for square ends.
 *
 * ## Accessibility
 * The root element uses `role="progressbar"` with `aria-valuemin` and `aria-valuemax` set from props.
 *
 * - **Name**: Provide either `label` (uses `aria-labelledby` with the visible label) or `aria-label` when there is no visible label. Omitting both logs a development warning as this does not meet accessibility standards.
 * - **Determinate values**: `aria-valuenow` is set to the clamped value; `aria-valuetext` comes from `getValueText` or the default percentage string. The duplicate value shown on the right is marked `aria-hidden="true"` so screen readers rely on `aria-valuetext`.
 * - **Indeterminate**: When `value` is omitted or `null`, `aria-valuenow` and `aria-valuetext` are omitted so assistive technologies can treat the state as indeterminate per platform conventions.
 *
 * ## Usage
 * ```tsx
 * import { Progress } from "./Progress";
 *
 * export function Example() {
 *   return (
 *     <Progress
 *       value={40}
 *       max={100}
 *       label="Upload"
 *       variant="fill"
 *       size="md"
 *     />
 *   );
 * }
 *
 * // Without a visible label, set aria-label:
 * <Progress aria-label="Download progress" value={72} />
 *
 * // Steps or custom wording:
 * <Progress
 *   value={2}
 *   max={5}
 *   aria-label="Setup steps"
 *   getValueText={(value, _min, max) => `${value} of ${max} steps`}
 * />
 * ```
 */

const meta: Meta<typeof Progress> = {
    component: Progress,
    title: "Components/Progress",
    tags: ["autodocs"]
};
export default meta;

type Story = StoryObj<typeof Progress>;

const render = (props: ProgressProps) => (
    <div className="relative flex justify-center w-full items-center my-8">
        <Progress {...props} />
    </div>
);

export const Default: Story = {
    args: {
        value: 50,
        max: 100,
        className: "max-w-sm"
    },
    render: (props) => (
        <div className="flex flex-col gap-4 items-center my-8">
            <Progress {...props} variant="fill" label="Fill" />
            <Progress {...props} variant="outline" label="Outline" />
        </div>
    )
};

export const Sizes: Story = {
    args: {
        className: "max-w-sm",
        variant: "fill",
        value: 50
    },
    render: (props) => (
        <div className="flex flex-col gap-4 items-center my-8">
            <Progress {...props} size="sm" aria-label="Small progress bar" />
            <Progress {...props} size="md" aria-label="Medium progress bar" />
            <Progress {...props} size="lg" aria-label="Large progress bar" />
        </div>
    )
};

export const NotRounded: Story = {
    args: {
        className: "max-w-sm",
        "aria-label": "Not rounded progress bar",
        value: 50,
        rounded: false,
        variant: "fill"
    },
    render: (props) => render(props)
};

export const StepProgressWithGetValueText: Story = {
    args: {
        className: "max-w-sm",
        value: 3,
        max: 5,
        "aria-label": "Step progress bar",
        getValueText: (value, _, max) => `${value} of ${max} steps completed`,
    },
    render: (props) => render(props)
};

export const dynamicProgress: Story = {
    args: {
        className: "max-w-sm",
        max: 100,
        "aria-label": "Dynamic progress bar"
    },
    render: (props) => {
        const max = props.max ?? 100;
        const [value, setValue] = React.useState(50);

        React.useEffect(() => {
            const interval = setInterval(() => {
                setValue((prev) => {
                    const p = prev ?? 0;
                    // After hitting max, wrap back to 50 on the next tick
                    if (p >= max) return 50;
                    return Math.min(p + 5, max);
                });
            }, 1000);

            return () => clearInterval(interval);
        }, [max]);

        return render({ ...props, value });
    }
};

export const Indeterminate: Story = {
    args: {
        className: "max-w-sm",
        variant: "fill"
    },
    render: (props) => render({ ...props, value: undefined })
};