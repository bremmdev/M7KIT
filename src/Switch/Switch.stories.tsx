import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";
import React from "react";

import { Button } from "../Button/Button";
import { Switch } from "./Switch";
import { SwitchProps } from "./Switch.types";

/**
 * The `Switch` component is an accessible on/off control built on a native checkbox input with `role="switch"`.
 * An invisible `<input>`, stretched over the track, drives state, pointer input and keyboard focus while the rounded
 * track and thumb provide the visual affordance.
 *
 * Use a switch for settings that take effect immediately, like turning notifications on. When a choice only applies
 * after submitting a form, or the user has to agree to something, a checkbox is usually the clearer control.
 *
 * Interaction matches familiar checkbox behavior:
 * - **Pointer**: Click the switch to toggle, with or without a visible label. Wrapping it in a `<label>` (or using `htmlFor` / `id`) makes the label text clickable too.
 * - **Keyboard**: Tab to focus the switch and press **Space** to toggle. **Enter** does not toggle, matching a native checkbox (WAI-ARIA lists Enter as optional for switches). Inside a form, Enter submits the form, as it does on a native checkbox.
 *
 * ## Features
 * - **Controlled or uncontrolled**: Pass `checked` with `onCheckedChange` for controlled usage, or use `defaultChecked` for uncontrolled state.
 * - **Sizes**: Choose `sm`, `md` (default), or `lg` via the `size` prop.
 * - **Thumb indicators**: `thumbIndicators="check"` shows a check mark when on and an X when off; `"play"` shows a play icon when on and a pause icon when off. The icons are decorative: screen readers get the state from the switch itself. While read-only, a lock replaces them.
 * - **Disabled state**: Use `disabled` to prevent interaction and apply muted styling. A disabled `<fieldset>` around the switch has the same effect.
 * - **Read-only state**: Use `readOnly` to prevent changes while keeping the switch focusable, readable and submitted with the form. A lock on the thumb shows it can't be changed, and screen reader users hear `readOnlyMessage` on focus and when they try to toggle it.
 * - **Form integration**: Submits and resets like a native checkbox, including the `name`, `value` and `form` attributes. See **Forms** below.
 * - **Right-to-left**: Mirrors automatically when `dir="rtl"` is set on the switch or an ancestor: the thumb starts on the right and moves left when turned on.
 * - **Standard input props**: Extends checkbox-related input props (excluding `type` and `size`), including `name`, `id`, `aria-*`, `ref`, and `onChange`. `ref` points to the native `<input>`, so `focus()` and `setCustomValidity()` work as usual.
 *
 * ## Callbacks
 * - `onChange(event)` receives the native change event, `onCheckedChange(checked)` the new boolean value. When the user toggles the switch, both are called, `onChange` first.
 * - On a form reset only `onCheckedChange` is called, because no native change event fires.
 * - Neither is called while the switch is `disabled` or `readOnly`.
 * - In development, the Switch warns when it changes between controlled and uncontrolled (e.g. `checked={data?.flag}` while data loads), when it gets both `checked` and `defaultChecked`, or when it gets `checked` without a change handler.
 *
 * ## Forms
 * The Switch submits like a native checkbox, which has a few non-obvious rules:
 * - It is only submitted when it has a `name`.
 * - When on, it submits its `value`, which is the string `"on"` unless you pass `value`.
 * - **When off, nothing is submitted.** The key is missing from the `FormData`, so treat a missing key as `false` on the server.
 * - A `disabled` switch is never submitted; a `readOnly` switch is.
 * - There is no indeterminate state: `role="switch"` has no "mixed" value. Use a checkbox when you need one.
 * - Avoid `required`: on a checkbox it means "must be on", and the browser's validation message ("Please check this box") doesn't fit a switch. A required switch that is off is also exposed as invalid from the start, so screen readers announce "invalid" before the user has done anything.
 *
 * On a form reset (a reset button, `form.reset()`, or React 19's automatic reset after a `<form action>`):
 * - An uncontrolled switch goes back to the latest `defaultChecked`. Changing `defaultChecked` after mount doesn't change the current state, but it does change what a reset restores.
 * - A controlled switch requests its initial `checked` value through `onCheckedChange`. The parent decides whether to accept it.
 *
 * ## Styling
 * `className` and `style` apply to the root element. All other props, including `data-*` attributes such as `data-testid`, go to the native input.
 * The root exposes `data-checked`, `data-disabled` and `data-readonly` for styling based on state.
 * `data-disabled` only reflects the `disabled` prop. A switch inside a `<fieldset disabled>` is disabled as well (not focusable, not submitted) and dims the same way,
 * but without `data-disabled`. To style both cases, use `has-[input:disabled]:` on the root instead.
 *
 * ## Accessibility
 * The component follows standard switch and checkbox accessibility patterns:
 *
 * - Uses a real `<input type="checkbox">` with `role="switch"` so semantics and form submission stay predictable. Screen readers announce it as a switch that is "on" or "off"; older ones fall back to "checkbox, checked / not checked".
 * - The input is transparent (`opacity-0`) and covers the track, so it stays tab-focusable and receives clicks directly; `:focus-visible` styles are applied to the visible track.
 * - The thumb animation is turned off when the user prefers reduced motion.
 * - In forced colors mode (Windows high contrast), the switch uses system colors: off is an outlined track with a `CanvasText` thumb, on is a `Highlight` track with a `HighlightText` thumb, disabled uses `GrayText`, and the focus outline is `Highlight`.
 *
 * ### Labeling
 * - Give the switch an accessible name by wrapping it in a `<label>`, or by pairing `htmlFor` on the label with the switch `id`. The Switch doesn't generate an `id`; use `React.useId()`.
 * - When the visible label can't be a `<label>`, point `aria-labelledby` at it rather than using `aria-label`: the accessible name must contain the visible text (WCAG 2.5.3 Label in Name). Use `aria-label` only when there is no visible label.
 * - Name what the switch controls ("Notifications"), not its state ("Notifications on"), and keep the label the same when the state changes. Screen readers already announce on and off.
 * - Connect helper or error text with `aria-describedby`.
 *
 * ### Things to look out for
 * - **Read-only**: `readOnly` sets `aria-readonly`, but screen readers like NVDA don't announce it on switches. So the switch also gets `readOnlyMessage` (default "Read only") as its description, read on focus before any `aria-describedby` you pass, and announces it through a polite live region when the user tries to toggle it. Screen readers that do support `aria-readonly` may say "read only" twice. Translate `readOnlyMessage` for non-English interfaces.
 * - **Read-only for sighted users**: the lock shows _that_ the switch can't be changed, not _why_. Explain the reason in visible text, linked with `aria-describedby`. If the value can never be changed on the page, consider showing it as text instead of a switch.
 * - **Target size**: the `sm` switch is 20px tall, below the 24×24px minimum of WCAG 2.5.8 Target Size. A wrapping label makes the target larger; otherwise leave enough space around it or use `md` or larger.
 * - **Async changes**: when toggling saves something, use controlled mode so you can revert on failure, and tell the user what went wrong, for example with error text linked through `aria-describedby`.
 * - **Other languages**: set `lang` on labels in a different language than the page (as in the right-to-left story) so screen readers pronounce them correctly.
 *
 * ## Usage
 * ```tsx
 * import { Switch } from "@bremmdev/m7kit";
 *
 * export function Example() {
 *   return (
 *     <label className="flex items-center gap-2">
 *       <Switch name="notifications" />
 *       Notifications
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

const Label = (props: { children: React.ReactNode; text?: string }) => (
  <label className="flex items-center gap-4 font-medium">
    {props.children}
    <span>{props.text ?? "notifications"}</span>
  </label>
);

const render = (props: SwitchProps) => (
  <div className="relative flex flex-col items-center my-8">
    <Label>
      <Switch {...props} />
    </Label>
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
    onCheckedChange: (checked: boolean) => action("onCheckedChange")(checked)
  },
  render: (props) => (
    <div className="flex flex-col gap-4 items-center my-8">
      <Label>
        <Switch {...props} size="sm" />
      </Label>
      <Label>
        <Switch {...props} size="md" />
      </Label>
      <Label>
        <Switch {...props} size="lg" />
      </Label>
    </div>
  )
};

export const Disabled: Story = {
  args: {
    defaultChecked: false,
    disabled: true,
    onCheckedChange: (checked: boolean) => action("onCheckedChange")(checked)
  },
  render: (props) => render(props)
};

export const DisabledFieldset: Story = {
  render: (props) => {
    const [disabled, setDisabled] = React.useState(true);

    // A disabled fieldset disables the inputs inside it natively, without the Switch's `disabled` prop
    return (
      <div className="flex flex-col items-center gap-4 my-8">
        <fieldset disabled={disabled} className="flex flex-col gap-4">
          <legend className="mb-2 font-semibold">Preferences</legend>
          <Label>
            <Switch {...props} defaultChecked />
          </Label>
          <Label text="newsletter">
            <Switch {...props} />
          </Label>
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

    // The parent owns the state, so it can change it from outside without the user touching the switch
    return (
      <div className="flex flex-col items-center gap-4 my-8">
        <Label>
          <Switch {...props} checked={checked} onCheckedChange={handleCheckedChange} />
        </Label>
        <Button variant="secondary" onClick={() => setChecked(!checked)}>
          {checked ? "Turn off" : "Turn on"} from outside
        </Button>
      </div>
    );
  }
};

export const ThumbIndicators: Story = {
  args: {
    defaultChecked: false,
    onCheckedChange: (checked: boolean) => action("onCheckedChange")(checked)
  },
  render: (props) => (
    <div className="flex flex-col gap-4 items-center my-8">
      <Label>
        <Switch {...props} thumbIndicators="check" />
      </Label>
      <Label>
        <Switch {...props} thumbIndicators="play" />
      </Label>
    </div>
  )
};

export const WithoutVisibleLabel: Story = {
  args: {
    "aria-label": "notifications",
    onCheckedChange: (checked: boolean) => action("onCheckedChange")(checked)
  },
  render: (props) => (
    <div className="flex flex-col items-center my-8">
      <Switch {...props} />
    </div>
  )
};

export const WithDescription: Story = {
  args: {
    onCheckedChange: (checked: boolean) => action("onCheckedChange")(checked)
  },
  render: (props) => {
    const descriptionId = React.useId();

    // The description is read after the name and state, e.g. "notifications, switch, off, Get an email when..."
    return (
      <div className="flex flex-col items-center gap-2 my-8">
        <Label>
          <Switch {...props} aria-describedby={descriptionId} />
        </Label>
        <p id={descriptionId} className="text-sm">
          Get an email when someone mentions you.
        </p>
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

    // Switches that are off are left out of the FormData entirely; the one without `value` submits "on"
    return (
      <form
        onSubmit={handleSubmit}
        onReset={() => setSubmitted(null)}
        className="flex flex-col items-center gap-4 my-8"
      >
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-2 font-semibold">Preferences</legend>
          <Label>
            <Switch {...props} name="notifications" defaultChecked />
          </Label>
          <Label text="newsletter">
            <Switch {...props} name="newsletter" value="weekly" />
          </Label>
          <Label text="marketing (disabled)">
            <Switch {...props} name="marketing" defaultChecked disabled />
          </Label>
        </fieldset>
        <div className="flex gap-2">
          <Button type="submit">Submit</Button>
          <Button type="reset" variant="secondary">
            Reset
          </Button>
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
    onCheckedChange: (checked: boolean) => action("onCheckedChange")(checked)
  },
  // `dir` mirrors the switch: the thumb starts on the right and moves left when turned on.
  // `lang` lets screen readers pronounce the Arabic labels correctly
  render: (props) => (
    <div dir="rtl" lang="ar" className="flex flex-col gap-4 items-center my-8">
      <Label text="الإشعارات">
        <Switch {...props} />
      </Label>
      <Label text="الإشعارات">
        <Switch {...props} defaultChecked />
      </Label>
      <Label text="الإشعارات">
        <Switch {...props} defaultChecked thumbIndicators="check" />
      </Label>
    </div>
  )
};
