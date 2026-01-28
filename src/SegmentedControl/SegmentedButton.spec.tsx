import { waitFor, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SegmentedControl } from "./SegmentedControl";

describe("SegmentedControl", () => {
  const renderComp = (onValueChange?: (value: string) => void) => {
    return (
      <SegmentedControl onValueChange={onValueChange ? onValueChange : () => {}}>
        <SegmentedControl.Button>Option 1</SegmentedControl.Button>
        <SegmentedControl.Button defaultSelected>Option 2</SegmentedControl.Button>
        <SegmentedControl.Button>Option 3</SegmentedControl.Button>
      </SegmentedControl>
    );
  };

  it("should render the SegmentedControl component", () => {
    const { getByRole } = render(renderComp());
    expect(getByRole("button", { name: "Option 1" })).toBeInTheDocument();
    expect(getByRole("button", { name: "Option 2" })).toBeInTheDocument();
    expect(getByRole("button", { name: "Option 3" })).toBeInTheDocument();
  });

  it("should render the SegmentedControl component with default selected button", () => {
    const { getByRole } = render(renderComp());
    expect(getByRole("button", { name: "Option 2" })).toHaveAttribute("aria-current", "true");
    expect(getByRole("button", { name: "Option 1" })).not.toHaveAttribute("aria-current");
    expect(getByRole("button", { name: "Option 3" })).not.toHaveAttribute("aria-current");
  });

  it("should not fire onValueChange callback when defaultSelected button is rendered", () => {
    const onValueChange = jest.fn();
    render(renderComp());
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("should fire onValueChange callback when button is clicked", async () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(renderComp(onValueChange));

    expect(onValueChange).not.toHaveBeenCalled();

    await userEvent.click(getByRole("button", { name: "Option 1" }));

    // Wait for the onValueChange to be called
    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith("Option 1");
    });
  });

  it("should fire onValueChange callback when a button is clicked AND there is no default selected button", async () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      <SegmentedControl onValueChange={onValueChange}>
        <SegmentedControl.Button>Option 1</SegmentedControl.Button>
        <SegmentedControl.Button>Option 2</SegmentedControl.Button>
        <SegmentedControl.Button>Option 3</SegmentedControl.Button>
      </SegmentedControl>
    );

    expect(onValueChange).not.toHaveBeenCalled();

    await userEvent.click(getByRole("button", { name: "Option 1" }));

    // Wait for the onValueChange to be called
    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith("Option 1");
    });
  });

  it("should use provided value instead of children as value", async () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      <SegmentedControl onValueChange={onValueChange}>
        <SegmentedControl.Button value="value1">Option 1</SegmentedControl.Button>
        <SegmentedControl.Button value="value2" defaultSelected>
          Option 2
        </SegmentedControl.Button>
        <SegmentedControl.Button value="value3">Option 3</SegmentedControl.Button>
      </SegmentedControl>
    );

    expect(onValueChange).not.toHaveBeenCalled();

    await userEvent.click(getByRole("button", { name: "Option 1" }));

    // Wait for the onValueChange to be called
    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith("value1");
    });
  });
});
