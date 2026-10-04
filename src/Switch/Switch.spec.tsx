import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "./Switch";
import { SwitchProps } from "./Switch.types";

const renderSwitch = (props: SwitchProps = {}) =>
    render(
        <label>
            <Switch {...props} />
            notifications
        </label>
    );

// The visual track/thumb is driven by data-checked on the wrapper, so it must stay in sync with the input
const getWrapper = (input: HTMLElement) => input.parentElement!;

describe("Switch", () => {
    describe("Semantics", () => {
        it("should render a checkbox input with switch role", () => {
            renderSwitch();
            const input = screen.getByRole("switch");
            expect(input).toBeInstanceOf(HTMLInputElement);
            expect(input).toHaveAttribute("type", "checkbox");
        });

        it("should get its accessible name from the wrapping label", () => {
            renderSwitch();
            expect(screen.getByRole("switch", { name: "notifications" })).toBeInTheDocument();
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("Ref", () => {
        it("should forward the ref to the native input", () => {
            const ref = React.createRef<HTMLInputElement>();
            render(<Switch aria-label="notifications" ref={ref} defaultChecked />);
            expect(ref.current).toBe(screen.getByRole("switch"));
            expect(ref.current?.checked).toBe(true);
        });

        it("should support callback refs", () => {
            const ref = jest.fn();
            const { unmount } = render(<Switch aria-label="notifications" ref={ref} />);
            expect(ref).toHaveBeenLastCalledWith(screen.getByRole("switch"));

            unmount();
            expect(ref).toHaveBeenLastCalledWith(null);
        });
    });

    describe("Prop placement", () => {
        it("should apply className and style to the root element, not the input", () => {
            render(<Switch aria-label="notifications" className="mt-2" style={{ marginTop: 8 }} />);
            const input = screen.getByRole("switch");
            const root = getWrapper(input);

            expect(root).toHaveClass("mt-2");
            expect(root).toHaveStyle({ marginTop: "8px" });
            expect(input).not.toHaveClass("mt-2");
            expect(input).not.toHaveAttribute("style");
        });

        it("should pass other props to the input", () => {
            render(<Switch aria-label="notifications" id="notif" name="notifications" data-testid="switch-input" required />);
            const input = screen.getByRole("switch");

            expect(input).toHaveAttribute("id", "notif");
            expect(input).toHaveAttribute("name", "notifications");
            expect(input).toHaveAttribute("data-testid", "switch-input");
            expect(input).toBeRequired();
        });
    });

    describe("Uncontrolled", () => {
        it("should be unchecked by default", () => {
            renderSwitch();
            const input = screen.getByRole("switch");
            expect(input).not.toBeChecked();
            expect(getWrapper(input)).toHaveAttribute("data-checked", "false");
        });

        it("should use defaultChecked as the initial state", () => {
            renderSwitch({ defaultChecked: true });
            const input = screen.getByRole("switch");
            expect(input).toBeChecked();
            expect(getWrapper(input)).toHaveAttribute("data-checked", "true");
        });

        it("should toggle on click and call onCheckedChange with the next value", async () => {
            const user = userEvent.setup();
            const onCheckedChange = jest.fn();
            renderSwitch({ onCheckedChange });
            const input = screen.getByRole("switch");

            await user.click(input);
            expect(input).toBeChecked();
            expect(getWrapper(input)).toHaveAttribute("data-checked", "true");
            expect(onCheckedChange).toHaveBeenLastCalledWith(true);

            await user.click(input);
            expect(input).not.toBeChecked();
            expect(getWrapper(input)).toHaveAttribute("data-checked", "false");
            expect(onCheckedChange).toHaveBeenLastCalledWith(false);
            expect(onCheckedChange).toHaveBeenCalledTimes(2);
        });

        it("should toggle when clicking the label", async () => {
            const user = userEvent.setup();
            renderSwitch();

            await user.click(screen.getByText("notifications"));
            expect(screen.getByRole("switch")).toBeChecked();
        });

        it("should toggle with the Space key", async () => {
            const user = userEvent.setup();
            renderSwitch();
            const input = screen.getByRole("switch");

            await user.tab();
            expect(input).toHaveFocus();

            await user.keyboard(" ");
            expect(input).toBeChecked();
        });

        it("should ignore changes to defaultChecked after mount", () => {
            const { rerender } = render(<Switch aria-label="notifications" defaultChecked={false} />);
            rerender(<Switch aria-label="notifications" defaultChecked={true} />);
            expect(screen.getByRole("switch")).not.toBeChecked();
        });

        it("should call onChange with the change event", async () => {
            const user = userEvent.setup();
            const onChange = jest.fn();
            renderSwitch({ onChange });

            await user.click(screen.getByRole("switch"));
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange.mock.calls[0][0].target).toBe(screen.getByRole("switch"));
        });

        it("should submit its value with the form when checked", async () => {
            const user = userEvent.setup();
            render(
                <form data-testid="form">
                    <Switch aria-label="notifications" name="notifications" />
                </form>
            );
            const form = screen.getByTestId("form") as HTMLFormElement;

            expect(new FormData(form).get("notifications")).toBeNull();

            await user.click(screen.getByRole("switch"));
            expect(new FormData(form).get("notifications")).toBe("on");
        });
    });

    describe("Controlled", () => {
        it("should reflect the checked prop", () => {
            renderSwitch({ checked: true, onCheckedChange: () => {} });
            const input = screen.getByRole("switch");
            expect(input).toBeChecked();
            expect(getWrapper(input)).toHaveAttribute("data-checked", "true");
        });

        it("should take precedence over defaultChecked", () => {
            jest.spyOn(console, "warn").mockImplementation(() => {});
            renderSwitch({ checked: false, defaultChecked: true, onCheckedChange: () => {} });
            expect(screen.getByRole("switch")).not.toBeChecked();
        });

        it("should not change state when the parent does not update checked", async () => {
            const user = userEvent.setup();
            const onCheckedChange = jest.fn();
            renderSwitch({ checked: false, onCheckedChange });
            const input = screen.getByRole("switch");

            await user.click(input);
            expect(onCheckedChange).toHaveBeenCalledWith(true);
            expect(input).not.toBeChecked();
            expect(getWrapper(input)).toHaveAttribute("data-checked", "false");
        });

        it("should follow the parent state when it updates", async () => {
            const user = userEvent.setup();

            const ControlledSwitch = () => {
                const [checked, setChecked] = React.useState(false);
                return <Switch aria-label="notifications" checked={checked} onCheckedChange={setChecked} />;
            };

            render(<ControlledSwitch />);
            const input = screen.getByRole("switch");

            await user.click(input);
            expect(input).toBeChecked();

            await user.click(input);
            expect(input).not.toBeChecked();
        });

        it("should allow the parent to reject a change", async () => {
            const user = userEvent.setup();

            // Can be turned on, but never off again
            const ControlledSwitch = () => {
                const [checked, setChecked] = React.useState(false);
                return (
                    <Switch
                        aria-label="notifications"
                        checked={checked}
                        onCheckedChange={(next) => next && setChecked(true)}
                    />
                );
            };

            render(<ControlledSwitch />);
            const input = screen.getByRole("switch");

            await user.click(input);
            expect(input).toBeChecked();

            await user.click(input);
            expect(input).toBeChecked();
        });

        it("should update when the checked prop changes externally", () => {
            const { rerender } = render(<Switch aria-label="notifications" checked={false} onCheckedChange={() => {}} />);
            expect(screen.getByRole("switch")).not.toBeChecked();

            rerender(<Switch aria-label="notifications" checked={true} onCheckedChange={() => {}} />);
            expect(screen.getByRole("switch")).toBeChecked();
        });

        it("should call both onChange and onCheckedChange", async () => {
            const user = userEvent.setup();
            const onChange = jest.fn();
            const onCheckedChange = jest.fn();
            renderSwitch({ checked: false, onChange, onCheckedChange });

            await user.click(screen.getByRole("switch"));
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onCheckedChange).toHaveBeenCalledWith(true);
        });
    });

    describe("Form reset", () => {
        // The Switch restores React's change tracking in a timeout after the browser has reset the input
        const flushReset = () => act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        const resetForm = async () => {
            act(() => (screen.getByRole("switch") as HTMLInputElement).form!.reset());
            await flushReset();
        };

        // What the user sees, what the DOM holds and what the form submits must always agree
        const expectInSync = (expected: boolean) => {
            const input = screen.getByRole("switch") as HTMLInputElement;
            expect(input.checked).toBe(expected);
            expect(getWrapper(input)).toHaveAttribute("data-checked", String(expected));
            expect(new FormData(input.form!).get("notifications")).toBe(expected ? "on" : null);
        };

        const renderInForm = (props: SwitchProps = {}) =>
            render(
                <form>
                    <Switch aria-label="notifications" name="notifications" {...props} />
                    <button type="reset">reset</button>
                </form>
            );

        describe("Uncontrolled", () => {
            it("should go back to defaultChecked and notify the parent", async () => {
                const user = userEvent.setup();
                const onCheckedChange = jest.fn();
                renderInForm({ onCheckedChange });

                await user.click(screen.getByRole("switch"));
                expectInSync(true);

                await resetForm();
                expectInSync(false);
                expect(onCheckedChange).toHaveBeenLastCalledWith(false);
            });

            it("should go back to defaultChecked when it is true", async () => {
                const user = userEvent.setup();
                renderInForm({ defaultChecked: true });

                await user.click(screen.getByRole("switch"));
                expectInSync(false);

                await resetForm();
                expectInSync(true);
            });

            it("should reset to the latest defaultChecked", async () => {
                const { rerender } = renderInForm({ defaultChecked: false });
                rerender(
                    <form>
                        <Switch aria-label="notifications" name="notifications" defaultChecked={true} />
                    </form>
                );
                // A later defaultChecked does not change the current value...
                expectInSync(false);

                // ...but it is what a reset goes back to, like a native input
                await resetForm();
                expectInSync(true);
            });

            it("should not notify the parent when the value does not change", async () => {
                const onCheckedChange = jest.fn();
                renderInForm({ onCheckedChange });

                await resetForm();
                expectInSync(false);
                expect(onCheckedChange).not.toHaveBeenCalled();
            });

            it("should respond to the first click after a reset", async () => {
                const user = userEvent.setup();
                const onCheckedChange = jest.fn();
                renderInForm({ onCheckedChange });

                await user.click(screen.getByRole("switch"));
                await resetForm();
                onCheckedChange.mockClear();

                await user.click(screen.getByRole("switch"));
                expectInSync(true);
                expect(onCheckedChange).toHaveBeenCalledWith(true);
            });

            it("should reset with a reset button", async () => {
                const user = userEvent.setup();
                renderInForm();

                await user.click(screen.getByRole("switch"));
                await user.click(screen.getByRole("button", { name: "reset" }));
                await flushReset();
                expectInSync(false);
            });

            it("should stay in sync after a React 19 form action resets the form", async () => {
                const user = userEvent.setup();
                const submitted: Array<FormDataEntryValue | null> = [];
                const action = async (formData: FormData) => {
                    submitted.push(formData.get("notifications"));
                };

                render(
                    <form action={action}>
                        <Switch aria-label="notifications" name="notifications" />
                        <button type="submit">save</button>
                    </form>
                );

                await user.click(screen.getByRole("switch"));
                await user.click(screen.getByRole("button", { name: "save" }));
                await flushReset();

                expect(submitted).toEqual(["on"]);
                // React resets the form after the action, so the Switch must show what will be submitted next
                expectInSync(false);
            });
        });

        describe("Controlled", () => {
            it("should request the initial value and follow the parent when it accepts", async () => {
                const user = userEvent.setup();

                const ControlledSwitch = () => {
                    const [checked, setChecked] = React.useState(false);
                    return (
                        <form>
                            <Switch aria-label="notifications" name="notifications" checked={checked} onCheckedChange={setChecked} />
                        </form>
                    );
                };

                render(<ControlledSwitch />);
                await user.click(screen.getByRole("switch"));
                expectInSync(true);

                await resetForm();
                expectInSync(false);
            });

            it("should keep the parent's value when it ignores the request", async () => {
                const user = userEvent.setup();
                const onCheckedChange = jest.fn();
                const renderControlled = (checked: boolean) => (
                    <form>
                        <Switch aria-label="notifications" name="notifications" checked={checked} onCheckedChange={onCheckedChange} />
                    </form>
                );

                // Mounted off (the browser's reset target), then turned on by the parent
                const { rerender } = render(renderControlled(false));
                rerender(renderControlled(true));

                await resetForm();
                expect(onCheckedChange).toHaveBeenCalledWith(false);
                // The browser reset the input to off, the Switch restores the parent's value
                expectInSync(true);

                onCheckedChange.mockClear();
                await user.click(screen.getByRole("switch"));
                expect(onCheckedChange).toHaveBeenCalledWith(false);
            });
        });

        it("should stop listening when unmounted", async () => {
            const onCheckedChange = jest.fn();
            const Form = ({ show }: { show: boolean }) => (
                <form data-testid="form">
                    {show && <Switch aria-label="notifications" defaultChecked onCheckedChange={onCheckedChange} />}
                </form>
            );

            const { rerender } = render(<Form show />);
            const form = screen.getByTestId("form") as HTMLFormElement;
            rerender(<Form show={false} />);

            act(() => form.reset());
            await flushReset();
            expect(onCheckedChange).not.toHaveBeenCalled();
        });
    });

    describe("Read-only", () => {
        it("should not toggle or call callbacks (uncontrolled)", async () => {
            const user = userEvent.setup();
            const onChange = jest.fn();
            const onCheckedChange = jest.fn();
            renderSwitch({ defaultChecked: true, readOnly: true, onChange, onCheckedChange });
            const input = screen.getByRole("switch");

            await user.click(input);
            expect(input).toBeChecked();
            expect(getWrapper(input)).toHaveAttribute("data-checked", "true");
            expect(onChange).not.toHaveBeenCalled();
            expect(onCheckedChange).not.toHaveBeenCalled();
        });

        it("should not toggle via the label or the Space key", async () => {
            const user = userEvent.setup();
            renderSwitch({ readOnly: true });
            const input = screen.getByRole("switch");

            await user.tab();
            expect(input).toHaveFocus();
            await user.keyboard(" ");
            expect(input).not.toBeChecked();

            await user.click(screen.getByText("notifications"));
            expect(input).not.toBeChecked();
        });

        it("should not request changes (controlled)", async () => {
            const user = userEvent.setup();
            const onCheckedChange = jest.fn();
            renderSwitch({ checked: false, readOnly: true, onCheckedChange });

            await user.click(screen.getByRole("switch"));
            expect(screen.getByRole("switch")).not.toBeChecked();
            expect(onCheckedChange).not.toHaveBeenCalled();
        });

        it("should be announced as read-only and stay enabled", () => {
            renderSwitch({ readOnly: true });
            const input = screen.getByRole("switch");

            expect(input).toHaveAttribute("aria-readonly", "true");
            expect(input).toBeEnabled();
            expect(getWrapper(input)).toHaveAttribute("data-readonly", "true");
        });

        it("should not set aria-readonly when not read-only", () => {
            renderSwitch();
            expect(screen.getByRole("switch")).not.toHaveAttribute("aria-readonly");
        });

        // A visual cue that isn't color alone; screen readers get readOnlyMessage instead
        it("should show a lock on the thumb, hidden from screen readers", () => {
            renderSwitch({ readOnly: true });
            const lock = getWrapper(screen.getByRole("switch")).querySelector("svg.lucide-lock");
            expect(lock).toBeInTheDocument();
            expect(lock!.closest("[aria-hidden='true']")).not.toBeNull();
        });

        it("should replace the thumb indicators with the lock", () => {
            renderSwitch({ readOnly: true, defaultChecked: true, thumbIndicators: "check" });
            const wrapper = getWrapper(screen.getByRole("switch"));
            expect(wrapper.querySelector("svg.lucide-lock")).toBeInTheDocument();
            expect(wrapper.querySelector("svg.lucide-check")).not.toBeInTheDocument();
        });

        it("should show the thumb indicators again once readOnly is removed", () => {
            const { rerender } = render(<Switch aria-label="notifications" readOnly defaultChecked thumbIndicators="check" />);
            rerender(<Switch aria-label="notifications" defaultChecked thumbIndicators="check" />);
            const wrapper = getWrapper(screen.getByRole("switch"));
            expect(wrapper.querySelector("svg.lucide-lock")).not.toBeInTheDocument();
            expect(wrapper.querySelector("svg.lucide-check")).toBeInTheDocument();
        });

        // Screen readers like NVDA don't announce aria-readonly on switches, so it's also given as a description
        it("should describe itself as read-only without changing its name", () => {
            renderSwitch({ readOnly: true });
            const input = screen.getByRole("switch", { name: "notifications" });
            expect(input).toHaveAccessibleDescription("Read only");
        });

        it("should put the read-only description before the consumer's description", () => {
            render(
                <>
                    <label>
                        <Switch readOnly aria-describedby="help" />
                        notifications
                    </label>
                    <p id="help">Managed by your organization</p>
                </>
            );
            expect(screen.getByRole("switch")).toHaveAccessibleDescription("Read only Managed by your organization");
        });

        it("should use a custom readOnlyMessage", () => {
            renderSwitch({ readOnly: true, readOnlyMessage: "Alleen lezen" });
            expect(screen.getByRole("switch")).toHaveAccessibleDescription("Alleen lezen");
        });

        it("should only have the consumer's description when not read-only", () => {
            render(
                <>
                    <Switch aria-label="notifications" aria-describedby="help" />
                    <p id="help">Managed by your organization</p>
                </>
            );
            expect(screen.getByRole("switch")).toHaveAccessibleDescription("Managed by your organization");
        });

        it("should announce the read-only message when the user tries to toggle it", async () => {
            const user = userEvent.setup();
            renderSwitch({ readOnly: true, readOnlyMessage: "Read only" });
            const liveRegion = document.querySelector("body > [role='status']") as HTMLElement;
            expect(liveRegion).toBeInTheDocument();

            await user.click(screen.getByRole("switch"));
            await waitFor(() => expect(liveRegion).toHaveTextContent("Read only"));

            // Cleared first, so a repeated attempt is announced again
            await user.keyboard(" ");
            expect(liveRegion).toHaveTextContent("");
            await waitFor(() => expect(liveRegion).toHaveTextContent("Read only"));
        });

        // A modal dialog makes everything outside it inert, including a live region on <body>
        it("should announce through a live region inside its dialog", async () => {
            const user = userEvent.setup();
            render(
                <dialog open data-testid="dialog">
                    <label>
                        <Switch readOnly />
                        notifications
                    </label>
                </dialog>
            );
            const liveRegion = screen.getByTestId("dialog").querySelector(":scope > [role='status']") as HTMLElement;
            expect(liveRegion).toBeInTheDocument();

            await user.click(screen.getByRole("switch"));
            await waitFor(() => expect(liveRegion).toHaveTextContent("Read only"));
        });

        it("should create the live region inside a dialog that is still closed", () => {
            render(
                <dialog data-testid="dialog">
                    <Switch aria-label="notifications" readOnly />
                </dialog>
            );
            expect(screen.getByTestId("dialog").querySelector(":scope > [role='status']")).toBeInTheDocument();
        });

        // As the last child it would make the real last item lose :last-child, e.g. get an extra space-y margin or divide-y border
        it("should put the live region first in its dialog, so the dialog's last child stays the same", () => {
            render(
                <dialog open data-testid="dialog">
                    <Switch aria-label="notifications" readOnly />
                    <p data-testid="last">Managed by your organization</p>
                </dialog>
            );
            const dialog = screen.getByTestId("dialog");
            expect(dialog.firstElementChild).toHaveAttribute("role", "status");
            expect(dialog.lastElementChild).toBe(screen.getByTestId("last"));
        });

        it("should announce through a live region inside an aria-modal container", async () => {
            const user = userEvent.setup();
            render(
                <div role="dialog" aria-modal="true" aria-label="settings" data-testid="modal">
                    <Switch aria-label="notifications" readOnly />
                </div>
            );
            const liveRegion = screen.getByTestId("modal").querySelector(":scope > [role='status']") as HTMLElement;

            await user.click(screen.getByRole("switch"));
            await waitFor(() => expect(liveRegion).toHaveTextContent("Read only"));
        });

        it("should not announce when the switch can be toggled", async () => {
            const user = userEvent.setup();
            // The live region is shared and outlives each test, so start from an empty one
            const liveRegion = document.querySelector("body > [role='status']");
            if (liveRegion) liveRegion.textContent = "";

            renderSwitch();
            await user.click(screen.getByRole("switch"));
            await new Promise((resolve) => setTimeout(resolve, 150));
            expect(document.querySelector("body > [role='status']")?.textContent ?? "").toBe("");
        });

        it("should still submit its value with the form", () => {
            render(
                <form data-testid="form">
                    <Switch aria-label="notifications" name="notifications" defaultChecked readOnly />
                </form>
            );
            expect(new FormData(screen.getByTestId("form") as HTMLFormElement).get("notifications")).toBe("on");
        });

        it("should respond to clicks again once readOnly is removed", async () => {
            const user = userEvent.setup();
            const { rerender } = render(<Switch aria-label="notifications" readOnly />);
            await user.click(screen.getByRole("switch"));
            expect(screen.getByRole("switch")).not.toBeChecked();

            rerender(<Switch aria-label="notifications" />);
            await user.click(screen.getByRole("switch"));
            expect(screen.getByRole("switch")).toBeChecked();
        });
    });

    describe("Disabled", () => {
        it("should not toggle or call callbacks when disabled (uncontrolled)", async () => {
            const user = userEvent.setup();
            const onCheckedChange = jest.fn();
            renderSwitch({ disabled: true, onCheckedChange });
            const input = screen.getByRole("switch");

            expect(input).toBeDisabled();
            await user.click(input);
            expect(input).not.toBeChecked();
            expect(onCheckedChange).not.toHaveBeenCalled();
        });

        it("should not call callbacks when disabled (controlled)", async () => {
            const user = userEvent.setup();
            const onCheckedChange = jest.fn();
            renderSwitch({ checked: true, disabled: true, onCheckedChange });

            await user.click(screen.getByRole("switch"));
            expect(screen.getByRole("switch")).toBeChecked();
            expect(onCheckedChange).not.toHaveBeenCalled();
        });

        it("should not be focusable when disabled", async () => {
            const user = userEvent.setup();
            renderSwitch({ disabled: true });

            await user.tab();
            expect(screen.getByRole("switch")).not.toHaveFocus();
        });
    });

    describe("Dev warnings", () => {
        let warn: jest.SpyInstance;

        beforeEach(() => {
            warn = jest.spyOn(console, "warn").mockImplementation(() => {});
        });

        it("should not warn for correct uncontrolled or controlled usage", () => {
            render(
                <>
                    <Switch aria-label="a" />
                    <Switch aria-label="b" defaultChecked />
                    <Switch aria-label="c" checked onCheckedChange={() => {}} />
                    <Switch aria-label="d" checked={false} onChange={() => {}} />
                </>
            );
            expect(warn).not.toHaveBeenCalled();
        });

        it("should warn when switching from uncontrolled to controlled", () => {
            const { rerender } = render(<Switch aria-label="n" checked={undefined} onCheckedChange={() => {}} />);
            rerender(<Switch aria-label="n" checked={true} onCheckedChange={() => {}} />);
            expect(warn).toHaveBeenCalledTimes(1);
            expect(warn.mock.calls[0][0]).toContain("from uncontrolled to controlled");
        });

        it("should warn when switching from controlled to uncontrolled", () => {
            const { rerender } = render(<Switch aria-label="n" checked={true} onCheckedChange={() => {}} />);
            rerender(<Switch aria-label="n" checked={undefined} onCheckedChange={() => {}} />);
            expect(warn).toHaveBeenCalledTimes(1);
            expect(warn.mock.calls[0][0]).toContain("from controlled to uncontrolled");
        });

        it("should warn when both checked and defaultChecked are passed", () => {
            render(<Switch aria-label="n" checked defaultChecked onCheckedChange={() => {}} />);
            expect(warn).toHaveBeenCalledTimes(1);
            expect(warn.mock.calls[0][0]).toContain("both `checked` and `defaultChecked`");
        });

        it("should warn when checked is passed without a change handler", () => {
            render(<Switch aria-label="n" checked />);
            expect(warn).toHaveBeenCalledTimes(1);
            expect(warn.mock.calls[0][0]).toContain("can never be toggled");
        });

        it("should not warn about a missing handler when disabled or readOnly", () => {
            render(
                <>
                    <Switch aria-label="a" checked disabled />
                    <Switch aria-label="b" checked readOnly />
                </>
            );
            expect(warn).not.toHaveBeenCalled();
        });

        it("should log each warning only once per instance", () => {
            const { rerender } = render(<Switch aria-label="n" checked />);
            rerender(<Switch aria-label="n" checked={false} />);
            rerender(<Switch aria-label="n" checked />);
            expect(warn).toHaveBeenCalledTimes(1);
        });
    });
});
