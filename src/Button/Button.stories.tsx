import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Button } from "./Button";
/**
 * Button component that can be used as a button or a link. It also support custom Link components like Next.js Link or TanStack Router Link.
 *
 * ## Usage
 *
 * ```
 * <Button as="button" variant="primary">Get started for free</Button>
 * <Button as="a" href="https://www.google.com" variant="primary">Get started for free</Button>
 * <Button as={Link} href="https://www.google.com" variant="primary">Get started for free</Button>
 * 
 * ## Custom Class Name
 *
 * <Button as="button" className="bg-black hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-100 dark:text-black" variant="primary">Get started for free</Button>
 * ```
 */


const meta: Meta<typeof Button> = {
    component: Button,
    title: "Components/Button",
    tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        as: "button",
        variant: "primary",
    },
    render: (props) => {
        return (
            <div className="space-y-4 p-8">
                <Button {...props}>Get started for free</Button>
            </div>
        );
    },
};

export const Secondary: Story = {
    args: {
        as: "button",
        variant: "secondary",
    },
    render: (props) => {
        return (
            <div className="space-y-4 p-8">
                <Button {...props}>Get started for free</Button>
            </div>
        );
    },
};

export const CTA: Story = {
    args: {
        as: "button",
        variant: "cta",
    },
    render: (props) => {
        return (
            <div className="space-y-4 p-8">
                <Button {...props}>Get started for free</Button>
            </div>
        );
    },
};

export const LinkButton: Story = {
    args: {
        as: "a",
        href: "https://www.google.com",
        variant: "primary"
    },
    render: (props) => {
        return (
            <div className="space-y-4 p-8">
                <Button {...props}>Get started for free</Button>
            </div>
        );
    },
};

export const Loading: Story = {
    args: {
        as: "button",
        variant: "primary",
        isLoading: true,
    },
    render: (props) => {
        const [loading, setLoading] = React.useState(false);
        const handleClick = () => {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        };

        return (
            <div className="space-y-4 p-8">
                <Button {...props} isLoading={loading} onClick={handleClick}>Get started for free</Button>
                <span>click to toggle loading state</span>
            </div>
        );
    },
};

export const CTALoading: Story = {
    args: {
        as: "button",
        variant: "cta",
    },
    render: (props) => {
        const [loading, setLoading] = React.useState(false);
        const handleClick = () => {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        };
        return (
            <div className="space-y-4 p-8">
                <Button {...props} isLoading={loading} onClick={handleClick}>Get started for free</Button>
                <span>click to toggle loading state</span>
            </div>
        );
    },
};

export const customClassName: Story = {
    args: {
        as: "button",
    },
    render: (props) => {
        return (
            <div className="space-y-4 p-8">
                <Button {...props} className="bg-black hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-100 dark:text-black" variant="primary">Get started for free</Button>
            </div>
        );
    }
};