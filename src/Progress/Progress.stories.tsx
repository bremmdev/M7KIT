import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { Progress } from "./Progress";
import { ProgressProps } from "./Progress.types";

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