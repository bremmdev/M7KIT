import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "./ThemeToggle";
import { ThemeToggleProps } from "./ThemeToggle.types";
import { clearAnnouncer } from "../Announcer";

// The visual track/thumb is driven by data-checked on the root label, so it must stay in sync with the input
const getRoot = (input: HTMLElement) => input.closest("label")!;

describe("ThemeToggle", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    // The shared live regions outlive each test: start every test without them
    clearAnnouncer();
    for (const wrapper of document.querySelectorAll("[data-m7kit-announcer]")) {
      wrapper.remove();
    }
  });

  describe("Semantics", () => {
    it("should render a checkbox input with switch role", () => {
      render(<ThemeToggle />);
      const input = screen.getByRole("switch");
      expect(input).toBeInstanceOf(HTMLInputElement);
      expect(input).toHaveAttribute("type", "checkbox");
    });

    // "Light mode, switch, on" tells screen reader users what on means; "theme, switch, on" doesn't
    it("should be named after the checked state by default", () => {
      render(<ThemeToggle />);
      expect(screen.getByRole("switch", { name: "Light mode" })).toBeInTheDocument();
    });

    it("should use the label prop as its accessible name", () => {
      render(<ThemeToggle label="Lichte modus" />);
      expect(screen.getByRole("switch", { name: "Lichte modus" })).toBeInTheDocument();
    });

    it.each(["left", "right"] as const)(
      "should keep the same accessible name with a visible label on the %s",
      (labelPosition) => {
        render(<ThemeToggle label="Light mode" labelPosition={labelPosition} />);
        expect(screen.getByRole("switch", { name: "Light mode" })).toBeInTheDocument();
        expect(screen.getByText("Light mode")).not.toHaveClass("sr-only");
      }
    );

    it("should hide the label visually when there is no labelPosition", () => {
      render(<ThemeToggle />);
      expect(screen.getByText("Light mode")).toHaveClass("sr-only");
    });

    it("should hide the decorative track from screen readers", () => {
      render(<ThemeToggle />);
      const root = getRoot(screen.getByRole("switch"));
      root.querySelectorAll("svg").forEach((svg) => {
        expect(svg.closest("[aria-hidden='true']")).not.toBeNull();
      });
    });
  });

  describe("Ref", () => {
    it("should forward the ref to the native input", () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<ThemeToggle ref={ref} defaultChecked />);
      expect(ref.current).toBe(screen.getByRole("switch"));
      expect(ref.current?.checked).toBe(true);
    });

    it("should support callback refs", () => {
      const ref = jest.fn();
      const { unmount } = render(<ThemeToggle ref={ref} />);
      expect(ref).toHaveBeenLastCalledWith(screen.getByRole("switch"));

      unmount();
      expect(ref).toHaveBeenLastCalledWith(null);
    });
  });

  describe("Prop placement", () => {
    it("should apply className and style to the root element, not the input", () => {
      render(<ThemeToggle className="mt-2" style={{ marginTop: 8 }} />);
      const input = screen.getByRole("switch");
      const root = getRoot(input);

      expect(root).toHaveClass("mt-2");
      expect(root).toHaveStyle({ marginTop: "8px" });
      expect(input).not.toHaveClass("mt-2");
      expect(input).not.toHaveAttribute("style");
    });

    it("should pass other props to the input", () => {
      render(<ThemeToggle id="theme" name="theme" value="light" data-testid="theme-input" />);
      const input = screen.getByRole("switch");

      expect(input).toHaveAttribute("id", "theme");
      expect(input).toHaveAttribute("name", "theme");
      expect(input).toHaveAttribute("value", "light");
      expect(input).toHaveAttribute("data-testid", "theme-input");
    });
  });

  describe("Uncontrolled", () => {
    it("should be unchecked by default", () => {
      render(<ThemeToggle />);
      const input = screen.getByRole("switch");
      expect(input).not.toBeChecked();
      expect(getRoot(input)).toHaveAttribute("data-checked", "false");
    });

    it("should use defaultChecked as the initial state", () => {
      render(<ThemeToggle defaultChecked />);
      const input = screen.getByRole("switch");
      expect(input).toBeChecked();
      expect(getRoot(input)).toHaveAttribute("data-checked", "true");
    });

    it("should toggle on click and call onCheckedChange with the next value", async () => {
      const user = userEvent.setup();
      const onCheckedChange = jest.fn();
      render(<ThemeToggle onCheckedChange={onCheckedChange} />);
      const input = screen.getByRole("switch");

      await user.click(input);
      expect(input).toBeChecked();
      expect(getRoot(input)).toHaveAttribute("data-checked", "true");
      expect(onCheckedChange).toHaveBeenLastCalledWith(true);

      await user.click(input);
      expect(input).not.toBeChecked();
      expect(getRoot(input)).toHaveAttribute("data-checked", "false");
      expect(onCheckedChange).toHaveBeenLastCalledWith(false);
      expect(onCheckedChange).toHaveBeenCalledTimes(2);
    });

    it("should toggle when clicking the visible label", async () => {
      const user = userEvent.setup();
      render(<ThemeToggle labelPosition="right" />);

      await user.click(screen.getByText("Light mode"));
      expect(screen.getByRole("switch")).toBeChecked();
    });

    it("should toggle with the Space key", async () => {
      const user = userEvent.setup();
      render(<ThemeToggle />);
      const input = screen.getByRole("switch");

      await user.tab();
      expect(input).toHaveFocus();

      await user.keyboard(" ");
      expect(input).toBeChecked();
    });

    it("should show stars when off and clouds when on", async () => {
      const user = userEvent.setup();
      render(<ThemeToggle />);
      const root = getRoot(screen.getByRole("switch"));
      expect(root.querySelectorAll("svg.lucide-star")).toHaveLength(3);

      await user.click(screen.getByRole("switch"));
      expect(root.querySelectorAll("svg.lucide-star")).toHaveLength(0);
      expect(root.querySelectorAll("svg.lucide-cloud")).toHaveLength(3);
    });

    it("should call onChange with the change event", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<ThemeToggle onChange={onChange} />);

      await user.click(screen.getByRole("switch"));
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][0].target).toBe(screen.getByRole("switch"));
    });

    it("should submit its value with the form when checked", async () => {
      const user = userEvent.setup();
      render(
        <form data-testid="form">
          <ThemeToggle name="theme" />
        </form>
      );
      const form = screen.getByTestId("form") as HTMLFormElement;

      expect(new FormData(form).get("theme")).toBeNull();

      await user.click(screen.getByRole("switch"));
      expect(new FormData(form).get("theme")).toBe("on");
    });
  });

  describe("Controlled", () => {
    it("should reflect the checked prop", () => {
      render(<ThemeToggle checked onCheckedChange={() => {}} />);
      const input = screen.getByRole("switch");
      expect(input).toBeChecked();
      expect(getRoot(input)).toHaveAttribute("data-checked", "true");
    });

    it("should not change state when the parent does not update checked", async () => {
      const user = userEvent.setup();
      const onCheckedChange = jest.fn();
      render(<ThemeToggle checked={false} onCheckedChange={onCheckedChange} />);
      const input = screen.getByRole("switch");

      await user.click(input);
      expect(onCheckedChange).toHaveBeenCalledWith(true);
      expect(input).not.toBeChecked();
      expect(getRoot(input)).toHaveAttribute("data-checked", "false");
    });

    it("should follow the parent state when it updates", async () => {
      const user = userEvent.setup();

      const ControlledThemeToggle = () => {
        const [checked, setChecked] = React.useState(false);
        return <ThemeToggle checked={checked} onCheckedChange={setChecked} />;
      };

      render(<ControlledThemeToggle />);
      const input = screen.getByRole("switch");

      await user.click(input);
      expect(input).toBeChecked();

      await user.click(input);
      expect(input).not.toBeChecked();
    });

    it("should allow the parent to reject a change", async () => {
      const user = userEvent.setup();

      // Can be turned on, but never off again
      const ControlledThemeToggle = () => {
        const [checked, setChecked] = React.useState(false);
        return <ThemeToggle checked={checked} onCheckedChange={(next) => next && setChecked(true)} />;
      };

      render(<ControlledThemeToggle />);
      const input = screen.getByRole("switch");

      await user.click(input);
      expect(input).toBeChecked();

      await user.click(input);
      expect(input).toBeChecked();
      expect(getRoot(input)).toHaveAttribute("data-checked", "true");
    });

    it("should update when the checked prop changes externally", () => {
      const { rerender } = render(<ThemeToggle checked={false} onCheckedChange={() => {}} />);
      expect(screen.getByRole("switch")).not.toBeChecked();

      rerender(<ThemeToggle checked={true} onCheckedChange={() => {}} />);
      expect(screen.getByRole("switch")).toBeChecked();
    });
  });

  describe("Form reset", () => {
    // The toggle restores React's change tracking in a timeout after the browser has reset the input
    const flushReset = () =>
      act(async () => {
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
      expect(getRoot(input)).toHaveAttribute("data-checked", String(expected));
      expect(new FormData(input.form!).get("theme")).toBe(expected ? "on" : null);
    };

    const renderInForm = (props: ThemeToggleProps = {}) =>
      render(
        <form>
          <ThemeToggle name="theme" {...props} />
          <button type="reset">reset</button>
        </form>
      );

    it("should go back to defaultChecked and notify the parent (uncontrolled)", async () => {
      const user = userEvent.setup();
      const onCheckedChange = jest.fn();
      renderInForm({ onCheckedChange });

      await user.click(screen.getByRole("switch"));
      expectInSync(true);

      await user.click(screen.getByRole("button", { name: "reset" }));
      await flushReset();
      expectInSync(false);
      expect(onCheckedChange).toHaveBeenLastCalledWith(false);
    });

    it("should respond to the first click after a reset", async () => {
      const user = userEvent.setup();
      const onCheckedChange = jest.fn();
      renderInForm({ defaultChecked: true, onCheckedChange });

      await user.click(screen.getByRole("switch"));
      await resetForm();
      expectInSync(true);
      onCheckedChange.mockClear();

      await user.click(screen.getByRole("switch"));
      expectInSync(false);
      expect(onCheckedChange).toHaveBeenCalledWith(false);
    });

    it("should keep the parent's value when it ignores the request (controlled)", async () => {
      const onCheckedChange = jest.fn();
      const renderControlled = (checked: boolean) => (
        <form>
          <ThemeToggle name="theme" checked={checked} onCheckedChange={onCheckedChange} />
        </form>
      );

      const { rerender } = render(renderControlled(false));
      rerender(renderControlled(true));

      await resetForm();
      expect(onCheckedChange).toHaveBeenCalledWith(false);
      expectInSync(true);
    });
  });

  describe("Read-only", () => {
    it("should not toggle or call callbacks", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      const onCheckedChange = jest.fn();
      render(
        <ThemeToggle
          defaultChecked
          readOnly
          onChange={onChange}
          onCheckedChange={onCheckedChange}
          labelPosition="right"
        />
      );
      const input = screen.getByRole("switch");

      await user.click(input);
      await user.click(screen.getByText("Light mode"));
      await user.keyboard(" ");
      expect(input).toBeChecked();
      expect(getRoot(input)).toHaveAttribute("data-checked", "true");
      expect(onChange).not.toHaveBeenCalled();
      expect(onCheckedChange).not.toHaveBeenCalled();
    });

    it("should be announced as read-only and stay enabled", () => {
      render(<ThemeToggle readOnly />);
      const input = screen.getByRole("switch");

      expect(input).toHaveAttribute("aria-readonly", "true");
      expect(input).toBeEnabled();
      expect(getRoot(input)).toHaveAttribute("data-readonly", "true");
    });

    it("should not set aria-readonly when not read-only", () => {
      render(<ThemeToggle />);
      expect(screen.getByRole("switch")).not.toHaveAttribute("aria-readonly");
    });

    it("should show a lock on the thumb, hidden from screen readers", () => {
      const { rerender } = render(<ThemeToggle readOnly />);
      const lock = getRoot(screen.getByRole("switch")).querySelector("svg.lucide-lock");
      expect(lock).toBeInTheDocument();
      expect(lock!.closest("[aria-hidden='true']")).not.toBeNull();

      rerender(<ThemeToggle />);
      expect(getRoot(screen.getByRole("switch")).querySelector("svg.lucide-lock")).not.toBeInTheDocument();
    });

    // Screen readers like NVDA don't announce aria-readonly on switches, so it's also given as a description
    it("should describe itself as read-only without changing its name", () => {
      render(<ThemeToggle readOnly />);
      expect(screen.getByRole("switch", { name: "Light mode" })).toHaveAccessibleDescription("Read only");
    });

    it("should put the read-only description before the consumer's description", () => {
      render(
        <>
          <ThemeToggle readOnly readOnlyMessage="Alleen lezen" aria-describedby="help" />
          <p id="help">Follows your system setting</p>
        </>
      );
      expect(screen.getByRole("switch")).toHaveAccessibleDescription("Alleen lezen Follows your system setting");
    });

    it("should announce the read-only message when the user tries to toggle it", async () => {
      const user = userEvent.setup();
      render(<ThemeToggle readOnly />);
      // The shared polite live region, created on mount before the first message
      const liveRegion = document.querySelector<HTMLElement>("body > [data-m7kit-announcer] > [aria-live='polite']")!;
      expect(liveRegion).toBeInTheDocument();

      await user.click(screen.getByRole("switch"));
      await waitFor(() => expect(liveRegion).toHaveTextContent("Read only"));
      const first = liveRegion.lastElementChild;

      // A repeated attempt is a new message, so it is announced again. It replaces the earlier one, which has the same id
      await user.keyboard(" ");
      await waitFor(() => expect(liveRegion.lastElementChild).not.toBe(first));
      expect(liveRegion.children).toHaveLength(1);
    });

    it("should still submit its value with the form", () => {
      render(
        <form data-testid="form">
          <ThemeToggle name="theme" defaultChecked readOnly />
        </form>
      );
      expect(new FormData(screen.getByTestId("form") as HTMLFormElement).get("theme")).toBe("on");
    });
  });

  describe("Disabled", () => {
    it("should not toggle or call callbacks when disabled", async () => {
      const user = userEvent.setup();
      const onCheckedChange = jest.fn();
      render(<ThemeToggle disabled onCheckedChange={onCheckedChange} />);
      const input = screen.getByRole("switch");

      expect(input).toBeDisabled();
      expect(getRoot(input)).toHaveAttribute("data-disabled", "true");
      await user.click(input);
      expect(input).not.toBeChecked();
      expect(onCheckedChange).not.toHaveBeenCalled();
    });

    it("should not be focusable when disabled", async () => {
      const user = userEvent.setup();
      render(<ThemeToggle disabled />);

      await user.tab();
      expect(screen.getByRole("switch")).not.toHaveFocus();
    });

    it("should be disabled by a disabled fieldset", async () => {
      const user = userEvent.setup();
      const onCheckedChange = jest.fn();
      render(
        <fieldset disabled>
          <ThemeToggle onCheckedChange={onCheckedChange} />
        </fieldset>
      );
      const input = screen.getByRole("switch");

      expect(input).toBeDisabled();
      await user.click(input);
      expect(onCheckedChange).not.toHaveBeenCalled();
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
          <ThemeToggle />
          <ThemeToggle defaultChecked />
          <ThemeToggle checked onCheckedChange={() => {}} />
          <ThemeToggle checked disabled />
          <ThemeToggle checked readOnly />
        </>
      );
      expect(warn).not.toHaveBeenCalled();
    });

    it("should warn when switching from uncontrolled to controlled", () => {
      const { rerender } = render(<ThemeToggle checked={undefined} onCheckedChange={() => {}} />);
      rerender(<ThemeToggle checked={true} onCheckedChange={() => {}} />);
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0][0]).toContain("ThemeToggle is changing from uncontrolled to controlled");
    });

    it("should warn when both checked and defaultChecked are passed", () => {
      render(<ThemeToggle checked defaultChecked onCheckedChange={() => {}} />);
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0][0]).toContain("both `checked` and `defaultChecked`");
    });

    it("should warn when checked is passed without a change handler", () => {
      render(<ThemeToggle checked />);
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0][0]).toContain("can never be toggled");
    });
  });
});
