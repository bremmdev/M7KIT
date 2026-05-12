import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";
import React from "react";

import { Switch } from "./Switch";
import { SwitchProps } from "./Switch.types";

/**
 * The `Switch` component is an accessible on/off control built on a native checkbox input with `role="switch"`.
 * A visually hidden `<input>` drives state and keyboard focus while the rounded track and thumb provide
 * the visual affordance.
 *
 * Interaction matches familiar checkbox behavior:
 * - **Pointer**: Click anywhere on the labeled control (wrap in `<label>` or use `htmlFor` / `id`) to toggle.
 * - **Keyboard**: Tab to focus the switch and press **Space** to toggle when the input is focused.
 *
 * ## Features
 * - **Controlled or uncontrolled**: Pass `checked` with `onCheckedChange` for controlled usage, or use `defaultChecked` for uncontrolled state.
 * - **Sizes**: Choose `sm`, `md` (default), or `lg` via the `size` prop.
 * - **Thumb indicators**: Optional `thumbIndicators` shows a check mark when on and an X when off.
 * - **Disabled state**: Use `disabled` to prevent interaction and apply muted styling.
 * - **Standard input props**: Extends checkbox-related input props (excluding `type` and `size`), including `name`, `id`, `aria-*`, and `onChange`. If `onChange` calls `preventDefault()`, internal state and `onCheckedChange` are not updated.
 *
 * ## Accessibility
 * The component follows standard switch and checkbox accessibility patterns:
 *
 * - Uses a real `<input type="checkbox">` with `role="switch"` so semantics and form submission stay predictable.
 * - The control is visually hidden with `sr-only` but remains tab-focusable; `:focus-visible` styles are applied to the visible track.
 * - Provide an accessible name by wrapping the switch in a `<label>` or pairing `htmlFor` on the label with the switch `id`, or use `aria-label` / `aria-labelledby` when the visible label structure differs.
 *
 * ## Usage
 * ```tsx
 * import { Switch } from "./Switch";
 *
 * export function Example() {
 *   return (
 *     <label className="flex items-center gap-2">
 *       <Switch />
 *       notifications
 *     </label>
 *   );
 * }
 * ```
 */

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
        onCheckedChange: (checked: boolean) => action("onCheckedChange")(checked),
    },
    render: (props) => render(props)
};

export const Sizes: Story = {
    args: {
        defaultChecked: false,
        onCheckedChange: (checked: boolean) => action("onCheckedChange")(checked),
    },
    render: (props) =>
        <div className="flex flex-col gap-4 items-center my-8">
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

export const ThumbIndicators: Story = {
    args: {
        defaultChecked: false,
        thumbIndicators: true,
        onCheckedChange: (checked: boolean) => action("onCheckedChange")(checked)
    },
    render: (props) => render(props)
};