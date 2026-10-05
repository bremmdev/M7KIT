import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";
import React from "react";

import { Button } from "../Button/Button";
import { ThemeToggle } from "./ThemeToggle";
import { ThemeToggleProps } from "./ThemeToggle.types";

/**
 * The `ThemeToggle` component is an accessible light/dark mode control built on a native checkbox with `role="switch"`.
 * It renders as a `<label>` around an invisible `<input>`, stretched over the illustrated track, which drives state, pointer
 * input and keyboard focus. The track, thumb, stars and clouds are hidden from screen readers and are for presentation only.
 *
 * **On (checked) means light mode**: the thumb is a sun in a day sky with clouds. Off is dark mode: a moon in a night sky with stars.
 *
 * Interaction matches familiar checkbox behavior:
 * - **Pointer**: Click the toggle or its visible label to toggle.
 * - **Keyboard**: Tab to focus the toggle and press **Space** to toggle. **Enter** does not toggle, matching a native checkbox.
 *
 * ## Features
 * - **Controlled or uncontrolled**: Pass `checked` with `onCheckedChange` for controlled usage, or use `defaultChecked` for uncontrolled state.
 * - **Sizes**: Choose `sm` (default) or `lg` via the `size` prop.
 * - **Appearance**: `blackAndWhite` uses neutral track/thumb styling; the default palette uses illustrative day/night colors.
 * - **Label**: `label` is the accessible name. It is visually hidden unless you set `labelPosition` (`left` / `right`).
 * - **Disabled state**: Use `disabled` to prevent interaction and apply muted styling. A disabled `<fieldset>` around the toggle has the same effect.
 * - **Read-only state**: Use `readOnly` to prevent changes while keeping the toggle focusable and readable, e.g. while the theme follows the system setting. A lock on the thumb shows it can't be changed, and screen reader users hear `readOnlyMessage` on focus and when they try to toggle it.
 * - **Form integration**: Submits and resets like a native checkbox, including the `name`, `value` and `form` attributes.
 * - **Right-to-left**: Mirrors automatically when `dir="rtl"` is set on the toggle or an ancestor: the thumb starts on the right and moves left when turned on.
 * - **Standard input props**: Extends checkbox-related input props (excluding `type` and `size`), including `name`, `id`, `aria-*`, `ref`, and `onChange`. `ref` points to the native `<input>`.
 *
 * ## Callbacks
 * - `onChange(event)` receives the native change event, `onCheckedChange(checked)` the new boolean value. When the user toggles, both are called, `onChange` first.
 * - To reject a change, use controlled mode and don't update `checked`. Calling `preventDefault()` in `onChange` does not cancel it.
 * - On a form reset only `onCheckedChange` is called, because no native change event fires.
 * - Neither is called while the toggle is `disabled` or `readOnly`.
 * - In development, the ThemeToggle warns when it changes between controlled and uncontrolled (e.g. `checked={settings?.light}` while settings load), when it gets both `checked` and `defaultChecked`, or when it gets `checked` without a change handler.
 *
 * ## Forms
 * - It is only submitted when it has a `name`. When on, it submits its `value` (`"on"` unless you pass `value`); when off, nothing is submitted.
 * - A `disabled` toggle is never submitted; a `readOnly` toggle is.
 * - On a form reset, an uncontrolled toggle goes back to the latest `defaultChecked`; a controlled toggle requests its initial `checked` value through `onCheckedChange`.
 *
 * ## Styling
 * `className` and `style` apply to the root `<label>`. All other props, including `data-*` attributes, go to the native input.
 * The root exposes `data-checked`, `data-disabled` and `data-readonly` for styling based on state.
 * `data-disabled` only reflects the `disabled` prop; to also style a toggle inside a `<fieldset disabled>`, use `has-[input:disabled]:` on the root.
 *
 * ## Accessibility
 * - Uses a real `<input type="checkbox">` with `role="switch"`. Screen readers announce it as "Light mode, switch, on" or "off".
 * - The input is transparent (`opacity-0`) and covers the track, so it stays tab-focusable, receives clicks directly, and is found by touch screen readers where it is drawn. `:focus-visible` styles are applied to the visible track.
 * - The off tracks have a border (in dark mode the on tracks too), and the day track is dark enough for the sun thumb, so the toggle and its state have at least 3:1 contrast (WCAG 1.4.11) in light and dark mode, against `background` and every `surface` token. The focus outline uses the foreground color for the same reason.
 *   On a custom background, check that the track's edge still has 3:1 contrast against it.
 * - The thumb animation is turned off when the user prefers reduced motion.
 * - In forced colors mode (Windows high contrast), the toggle uses system colors: off is an outlined track with a `CanvasText` thumb, on is a `Highlight` track with a `HighlightText` thumb, and disabled uses `GrayText`, for the track and the label text.
 *
 * ### Labeling
 * - The default label is "Light mode", because on means light mode. Name what the toggle controls in that state, not the current state, and keep the label the same when it changes: screen readers already announce on and off. A label like "theme" doesn't tell screen reader users what "on" means.
 * - Translate `label` (and `readOnlyMessage`) for non-English interfaces.
 * - The ThemeToggle is already a `<label>`: don't wrap it in another one. To use visible text elsewhere on the page as its name, point `aria-labelledby` at that text.
 * - Connect helper text with `aria-describedby`.
 *
 * ### Without a visible label
 * The most common setup, e.g. as a small control in a site header, and the default: without `labelPosition`, `label` is rendered as
 * visually hidden text inside the toggle. See the **Without Visible Label** story.
 * - **Screen readers**: the toggle still has its name ("Light mode, switch, off"), so no `aria-label` is needed. `aria-label` works, but overrides `label`; prefer `label` so the name is the same with or without a visible label.
 * - **Sighted users**: the sun, moon, clouds and stars act as the visual label. They are a widely recognized pattern for light and dark mode.
 * - **Speech control users** (Voice Control, Dragon) activate controls by saying their name, and they guess it from what they see. While the toggle is off they see a moon and stars, so they may say "click dark mode" or "click theme", which doesn't match "Light mode". They then have to fall back to numbered overlays or a mouse grid. Show a visible label (`labelPosition`) where there is room for one, such as a settings page.
 * - **Keep the hidden label meaningful**: since nobody sees it to notice a mistake, check that `label` still matches what "on" means, and translate it with the rest of the interface.
 *
 * ### Things to look out for
 * - **Read-only**: `readOnly` sets `aria-readonly`, but screen readers like NVDA don't announce it on switches. So the toggle also gets `readOnlyMessage` (default "Read only") as its description, and announces it through a polite live region when the user tries to toggle it. Explain _why_ it can't be changed in visible text, linked with `aria-describedby`.
 * - **Label position in right-to-left layouts**: `labelPosition` follows the reading direction, like the rest of the toggle: `left` puts the label before the toggle, which is on the right in a right-to-left layout.
 *
 * ## Usage
 * ```tsx
 * import { ThemeToggle } from "@bremmdev/m7kit";
 *
 * export function Example() {
 *   const [theme, setTheme] = React.useState<"light" | "dark">("light");
 *   return <ThemeToggle checked={theme === "light"} onCheckedChange={(light) => setTheme(light ? "light" : "dark")} />;
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
            <ThemeToggle {...props} size="sm" labelPosition="right" />
            <ThemeToggle {...props} size="lg" labelPosition="right" />
        </div>
    ),
};

export const LabelPosition: Story = {
    args: {
        onCheckedChange: (checked: boolean) => action("onCheckedChange")(checked),
    },
    render: (props) => (
        <div className="flex flex-col gap-4 items-center my-8">
            <ThemeToggle {...props} labelPosition="left" />
            <ThemeToggle {...props} labelPosition="right" />
        </div>
    ),
};

export const WithoutVisibleLabel: Story = {
    args: {
        onCheckedChange: (checked: boolean) => action("onCheckedChange")(checked),
    },
    // The typical setup: a small control in a header. Without `labelPosition`, `label` is visually hidden
    // but still the accessible name, so screen readers announce "Light mode, switch, off"
    render: (props) => (
        <div className="flex justify-center my-8">
            <header className="flex items-center justify-between w-full max-w-md gap-4 px-4 py-2 rounded-lg border border-foreground/20">
                <span className="font-semibold">Acme</span>
                <ThemeToggle {...props} />
            </header>
        </div>
    ),
};

export const BlackAndWhite: Story = {
    args: {
        defaultChecked: false,
        blackAndWhite: true,
        onCheckedChange: (checked: boolean) => action("onCheckedChange")(checked),
    },
    render: (props) => (
        <div className="flex flex-col gap-4 items-center my-8">
            <ThemeToggle {...props} />
            <ThemeToggle {...props} defaultChecked />
        </div>
    ),
};

export const Controlled: Story = {
    render: (props) => {
        const [light, setLight] = React.useState(true);

        const handleCheckedChange = (checked: boolean) => {
            setLight(checked);
            action("onCheckedChange")(checked);
        };

        // On is light mode: the preview follows the toggle, and the button changes it from outside
        return (
            <div data-theme={light ? "light" : "dark"} className="flex flex-col items-center gap-4 my-8 p-6 rounded-lg bg-background text-foreground">
                <ThemeToggle {...props} labelPosition="right" checked={light} onCheckedChange={handleCheckedChange} />
                <Button variant="secondary" onClick={() => setLight(!light)}>
                    Switch to {light ? "dark" : "light"} mode from outside
                </Button>
            </div>
        );
    }
};

export const Disabled: Story = {
    args: {
        disabled: true,
        onCheckedChange: (checked: boolean) => action("onCheckedChange")(checked),
    },
    render: (props) => (
        <div className="flex flex-col gap-4 items-center my-8">
            <ThemeToggle {...props} labelPosition="right" />
            <ThemeToggle {...props} labelPosition="right" defaultChecked />
        </div>
    ),
};

export const DisabledFieldset: Story = {
    render: (props) => {
        const [disabled, setDisabled] = React.useState(true);

        // A disabled fieldset disables the inputs inside it natively, without the ThemeToggle's `disabled` prop
        return (
            <div className="flex flex-col items-center gap-4 my-8">
                <fieldset disabled={disabled} className="flex flex-col gap-4">
                    <legend className="mb-2 font-semibold">Appearance</legend>
                    <ThemeToggle {...props} labelPosition="right" />
                </fieldset>
                <Button variant="secondary" onClick={() => setDisabled(!disabled)}>
                    {disabled ? "Enable" : "Disable"} fieldset
                </Button>
            </div>
        );
    }
};

export const ReadOnly: Story = {
    args: {
        defaultChecked: true,
        readOnly: true,
        onCheckedChange: (checked: boolean) => action("onCheckedChange")(checked),
    },
    render: (props) => {
        const descriptionId = React.useId();

        // The lock shows that it can't be changed, the description says why
        return (
            <div className="flex flex-col items-center gap-2 my-8">
                <ThemeToggle {...props} labelPosition="right" aria-describedby={descriptionId} />
                <p id={descriptionId} className="text-sm">Follows your system setting.</p>
                <div className="flex gap-4 mt-4">
                    <ThemeToggle {...props} defaultChecked={false} />
                    <ThemeToggle {...props} blackAndWhite />
                    <ThemeToggle {...props} blackAndWhite defaultChecked={false} />
                </div>
            </div>
        );
    }
};

export const WithDescription: Story = {
    args: {
        onCheckedChange: (checked: boolean) => action("onCheckedChange")(checked),
    },
    render: (props) => {
        const descriptionId = React.useId();

        // The description is read after the name and state, e.g. "Light mode, switch, on, Saved for this browser only."
        return (
            <div className="flex flex-col items-center gap-2 my-8">
                <ThemeToggle {...props} labelPosition="right" aria-describedby={descriptionId} />
                <p id={descriptionId} className="text-sm">Saved for this browser only.</p>
            </div>
        );
    }
};

export const InForm: Story = {
    render: (props) => {
        const [submitted, setSubmitted] = React.useState<string | null>(null);

        function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
            event.preventDefault();
            const data = Object.fromEntries(new FormData(event.currentTarget));
            setSubmitted(JSON.stringify(data, null, 2));
        }

        // When off, the toggle is left out of the FormData entirely
        return (
            <form onSubmit={handleSubmit} onReset={() => setSubmitted(null)} className="flex flex-col items-center gap-4 my-8">
                <ThemeToggle {...props} name="theme" value="light" labelPosition="right" defaultChecked />
                <div className="flex gap-2">
                    <Button type="submit">Submit</Button>
                    <Button type="reset" variant="secondary">Reset</Button>
                </div>
                <output className="min-h-20 font-mono text-sm whitespace-pre">
                    {submitted ? `Submitted: ${submitted}` : "Submit the form to see its data"}
                </output>
            </form>
        );
    }
};

export const RightToLeft: Story = {
    args: {
        onCheckedChange: (checked: boolean) => action("onCheckedChange")(checked),
    },
    // `dir` mirrors the toggle: the thumb starts on the right and moves left when turned on.
    // `lang` lets screen readers pronounce the Arabic label correctly
    render: (props) =>
        <div dir="rtl" lang="ar" className="flex flex-col gap-4 items-center my-8">
            <ThemeToggle {...props} label="الوضع الفاتح" labelPosition="left" />
            <ThemeToggle {...props} label="الوضع الفاتح" labelPosition="left" defaultChecked />
            <ThemeToggle {...props} label="الوضع الفاتح" labelPosition="left" blackAndWhite size="lg" />
        </div>
};
