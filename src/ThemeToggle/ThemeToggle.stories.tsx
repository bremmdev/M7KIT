import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";

import { ThemeToggle } from "./ThemeToggle";
import { ThemeToggleProps } from "./ThemeToggle.types";

/**
 * The `ThemeToggle` component is an accessible light/dark preference control built on a native checkbox
 * with `role="switch"`. It renders as a `<label>` wrapping a visually hidden `<input>` (`sr-only`);
 * the illustrated track and thumb are marked `aria-hidden` and are for presentation only.
 *
 * Interaction matches familiar checkbox behavior:
 * - **Pointer**: Click anywhere on the labeled control to toggle.
 * - **Keyboard**: Tab to focus the input and press **Space** to toggle when it is focused.
 *
 * ## Features
 * - **Controlled or uncontrolled**: Pass `checked` with `onCheckedChange` for controlled usage, or use `defaultChecked` for uncontrolled state.
 * - **Sizes**: Choose `sm` (default) or `lg` via the `size` prop.
 * - **Appearance**: `blackAndWhite` uses neutral track/thumb styling; the default palette uses illustrative day/night colors.
 * - **Visible label**: Use `label` with optional `labelPosition` (`left` / `right`); otherwise the label string is exposed only via a screen-reader-only span.
 * - **Disabled state**: Use `disabled` to prevent interaction and apply muted styling.
 * - **Standard input props**: Extends checkbox-related input props (excluding `type` and `size`), including `name`, `id`, `aria-*`, and `onChange`. If `onChange` calls `preventDefault()`, internal state and `onCheckedChange` are not updated.
 *
 * ## Accessibility
 * The component follows standard switch and checkbox accessibility patterns:
 *
 * - Uses a real `<input type="checkbox">` with `role="switch"` so semantics stay predictable.
 * - The control is visually hidden with `sr-only` but remains tab-focusable; `:focus-visible` styles are applied to the visible track.
 * - Provide an accessible name via the `label` prop (visible or `sr-only`), or override with `aria-label` / `aria-labelledby` on the input through spread props.
 *
 * ## Usage
 * ```tsx
 * import { ThemeToggle } from "./ThemeToggle";
 *
 * export function Example() {
 *   return <ThemeToggle onCheckedChange={(next) => console.log(next)} />;
 * }
 * ```
 */

const meta: Meta<typeof ThemeToggle> = {
    component: ThemeToggle,
    title: "Components/ThemeToggle",
    tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof ThemeToggle>;

const render = (props: ThemeToggleProps) => (
    <div className="relative flex flex-col items-center my-8">
        <ThemeToggle {...props} />
    </div>
);

export const Default: Story = {
    args: {
        onCheckedChange: (checked: boolean) => action("onCheckedChange")(checked),
    },
    render: (props) => render(props),
};

export const Sizes: Story = {
    args: {
        defaultChecked: false,
        onCheckedChange: (checked: boolean) => action("onCheckedChange")(checked),
    },
    render: (props) => (
        <div className="flex flex-col gap-4 items-center my-8">
            <ThemeToggle {...props} size="sm" label="Small" labelPosition="right" />
            <ThemeToggle {...props} size="lg" label="Large" labelPosition="right" />
        </div>
    ),
};

export const LabelPosition: Story = {
    args: {
        label: "Theme",
    },
    render: (props) => (
        <div className="flex flex-col gap-4 items-center my-8">
            <ThemeToggle {...props} labelPosition="left" />
            <ThemeToggle {...props} labelPosition="right" />
        </div>
    ),
};

export const BlackAndWhite: Story = {
    args: {
        defaultChecked: false,
        blackAndWhite: true,
        onCheckedChange: (checked: boolean) => action("onCheckedChange")(checked),
    },
    render: (props) => render(props),
};
