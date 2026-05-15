import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";

import { ThemeToggle } from "./ThemeToggle";
import { ThemeToggleProps } from "./ThemeToggle.types";

const meta: Meta<typeof ThemeToggle> = {
    component: ThemeToggle,
    title: "Components/ThemeToggle",
    tags: ["autodocs"]
};
export default meta;

type Story = StoryObj<typeof ThemeToggle>;

const render = (props: ThemeToggleProps) => (
    <div className="relative flex flex-col items-center my-8">
        <label className="flex items-center gap-2">
            <ThemeToggle {...props} />
            theme
        </label>
    </div>
);

export const Default: Story = {
    args: {
        size: "lg",
        onCheckedChange: (checked: boolean) => action("onCheckedChange")(checked),
    },
    render: (props) => render(props)
};
