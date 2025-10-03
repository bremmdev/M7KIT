import { render } from "@testing-library/react";
import { SortableList } from "./SortableList";

// Mock crypto.randomUUID
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: jest.fn(() => "mocked-uuid"),
  },
});

const fruits = ["Apple", "Banana", "Cherry", "Mango"];

describe("SortableList", () => {
  it("should render successfully", () => {
    const { getByRole } = render(<SortableList items={fruits} />);
    expect(getByRole("list")).toBeTruthy();
  });

  it("should warn if 'items' prop is missing or empty", () => {
    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
    render(<SortableList items={[]} />);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "The 'items' prop should be a non-empty array. Did you forget to pass it?"
    );
    consoleWarnSpy.mockRestore();

    const consoleWarnSpy2 = jest.spyOn(console, "warn").mockImplementation();
    render(<SortableList items={undefined as any} />);
    expect(consoleWarnSpy2).toHaveBeenCalledWith(
      "The 'items' prop should be a non-empty array. Did you forget to pass it?"
    );
    consoleWarnSpy2.mockRestore();
  });
});
