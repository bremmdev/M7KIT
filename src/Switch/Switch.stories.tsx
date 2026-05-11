import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";
import React from "react";

import { Switch } from "./Switch";
import { SwitchProps } from "./Switch.types";

const meta: Meta<typeof Switch> = {
    component: Switch,
    title: "Components/Switch",
    tags: ["autodocs"]
};
export default meta;

type Story = StoryObj<typeof Switch>;

const Label = (props: { children: React.ReactNode }) => (
    <label className="flex items-center gap-4 font-medium">
        {props.children}
        <span>notifications</span>
    </label>
);

const render = (props: SwitchProps) => (
    <div className="relative flex flex-col items-center my-8">
        <Label><Switch {...props} /></Label>
    </div>
);

export const Default: Story = {
    args: {
        onCheckedChange: (checked: boolean) => action("onCheckedChange")(checked)
    },
    render: (props) => render(props)
};

export const Sizes: Story = {
    args: {
        defaultChecked: false,
        onCheckedChange: (checked: boolean) => action("onCheckedChange")(checked),
    },
    render: (props) =>
        <div className="flex flex-col gap-4">
            <Label><Switch {...props} size="sm" /></Label>
            <Label><Switch {...props} size="md" /></Label>
            <Label><Switch {...props} size="lg" /></Label>
        </div>
};

export const Disabled: Story = {
    args: {
        defaultChecked: false,
        disabled: true,
        onCheckedChange: (checked: boolean) => action("onCheckedChange")(checked)
    },
    render: (props) => render(props)
};

export const Controlled: Story = {
    render: (props) => {
        const [checked, setChecked] = React.useState(false);

        const handleCheckedChange = (checked: boolean) => {
            setChecked(checked);
            action("onCheckedChange")(checked);
        };

        return render({ ...props, checked, onCheckedChange: handleCheckedChange });
    }
};