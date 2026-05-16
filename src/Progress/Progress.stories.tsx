import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";
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
        className: "w-full",
        value: 50
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
        className: "w-full",
        variant: "fill",
        value: 50
    },
    render: (props) => (
        <div className="flex flex-col gap-4 items-center my-8">
            <Progress {...props} size="sm" />
            <Progress {...props} size="md" />
            <Progress {...props} size="lg" />
        </div>
    )
};

export const NotRounded: Story = {
    args: {
        className: "w-full",
        value: 50,
        rounded: false,
        variant: "fill"
    },
    render: (props) => render(props)
};

export const StepProgressWithGetValueText: Story = {
    args: {
        className: "w-full",
        value: 3,
        max: 5,
        getValueText: (value, _, max) => `Step ${value} of ${max}`,
    },
    render: (props) => render(props)
};