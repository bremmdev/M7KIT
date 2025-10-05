// SortableList.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SortableList } from "./SortableList";

//mock uuid to return predictable ids for testing
jest.mock("uuid", () => ({
  v4: jest
    .fn()
    .mockImplementation(() => Math.random().toString(36).substring(2, 15)),
}));

describe("SortableList", () => {
  const defaultProps = {
    items: ["Apple", "Banana", "Cherry"],
    onReorder: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders all items correctly", () => {
      render(<SortableList {...defaultProps} />);

      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByText("Banana")).toBeInTheDocument();
      expect(screen.getByText("Cherry")).toBeInTheDocument();
    });

    it("renders with title", () => {
      render(<SortableList {...defaultProps} title="My Fruits" />);

      expect(screen.getByText("My Fruits")).toBeInTheDocument();
    });

    it("renders custom title element", () => {
      render(
        <SortableList {...defaultProps} title="My Fruits" titleElement="h3" />
      );

      const title = screen.getByText("My Fruits");
      expect(title.tagName).toBe("H3");
    });

    it("renders with React element items", () => {
      const items = [
        <div key="1">
          <strong>Bold</strong> Text
        </div>,
        <span key="2">Simple span</span>,
      ];

      render(<SortableList items={items} />);

      expect(screen.getByText("Bold")).toBeInTheDocument();
      expect(screen.getByText("Simple span")).toBeInTheDocument();
    });

    it("renders items with icons and excludes them from labels", () => {
      const items = [
        <div key="1">
          <span aria-hidden="true">🔍</span>
          Search
        </div>,
      ];

      render(<SortableList items={items} />);

      const editButton = screen.getByText("Enter Edit Mode");
      fireEvent.click(editButton);

      // The reorder button should only announce "Search", not the icon
      const reorderButton = screen.getByLabelText(/Reorder Search/);
      expect(reorderButton).toBeInTheDocument();
    });

    it("uses aria-label from items when available", () => {
      const items = [
        <div key="1" aria-label="Custom label">
          Different text
        </div>,
      ];

      render(<SortableList items={items} />);

      const editButton = screen.getByText("Enter Edit Mode");
      fireEvent.click(editButton);

      // Should use aria-label instead of text content
      expect(screen.getByLabelText(/Reorder Custom label/)).toBeInTheDocument();
    });

    it("renders handle at start by default", () => {
      const { container } = render(<SortableList {...defaultProps} />);

      const listItem = container.querySelector("li");
      const firstChild = listItem?.firstElementChild;

      expect(firstChild?.tagName).toBe("svg"); // GripVertical icon
    });

    it("renders handle at end when specified", () => {
      const { container } = render(
        <SortableList {...defaultProps} handlePosition="end" />
      );

      const listItem = container.querySelector("li");
      const lastChild = listItem?.lastElementChild;

      expect(lastChild?.tagName).toBe("svg"); // GripVertical icon
    });
  });

  describe("Edit Mode", () => {
    it("toggles edit mode on button click", () => {
      render(<SortableList {...defaultProps} />);

      const editButton = screen.getByText("Enter Edit Mode");
      expect(editButton).toBeInTheDocument();

      fireEvent.click(editButton);

      expect(screen.getByText("Exit Edit Mode")).toBeInTheDocument();
      expect(screen.queryByText("Enter Edit Mode")).not.toBeInTheDocument();
    });

    it("shows reorder buttons in edit mode", () => {
      render(<SortableList {...defaultProps} />);

      // Not in edit mode - no reorder buttons
      expect(screen.queryByLabelText(/Reorder Apple/)).not.toBeInTheDocument();

      // Enter edit mode
      fireEvent.click(screen.getByText("Enter Edit Mode"));

      // Reorder buttons should appear
      expect(screen.getByLabelText(/Reorder Apple/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Reorder Banana/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Reorder Cherry/)).toBeInTheDocument();
    });

    it("announces edit mode changes", async () => {
      render(<SortableList {...defaultProps} />);

      // Get live region by assertive attribute using querySelector
      const liveRegion = document.querySelector("[aria-live='assertive']");

      fireEvent.click(screen.getByText("Enter Edit Mode"));

      await waitFor(() => {
        expect(liveRegion).toHaveTextContent("Entered edit mode");
      });

      fireEvent.click(screen.getByText("Exit Edit Mode"));

      await waitFor(() => {
        expect(liveRegion).toHaveTextContent("Exited edit mode");
      });
    });

    it("focuses first item when entering edit mode", async () => {
      render(<SortableList {...defaultProps} />);

      fireEvent.click(screen.getByText("Enter Edit Mode"));

      await waitFor(() => {
        const firstButton = screen.getByLabelText(/Reorder Apple/);
        expect(firstButton).toHaveFocus();
      });
    });

    it("exits edit mode on Escape key", async () => {
      render(<SortableList {...defaultProps} />);

      const editButton = screen.getByText("Enter Edit Mode");
      fireEvent.click(editButton);

      expect(screen.getByText("Exit Edit Mode")).toBeInTheDocument();

      fireEvent.keyDown(document, { key: "Escape" });

      await waitFor(() => {
        expect(screen.getByText("Enter Edit Mode")).toBeInTheDocument();
      });
    });
  });

  describe("Keyboard Navigation", () => {
    it("moves item down with ArrowDown", async () => {
      const onReorder = jest.fn();
      render(<SortableList {...defaultProps} onReorder={onReorder} />);

      fireEvent.click(screen.getByText("Enter Edit Mode"));

      const firstButton = screen.getByLabelText(/Reorder Apple/);
      fireEvent.keyDown(firstButton, { key: "ArrowDown" });

      await waitFor(() => {
        expect(onReorder).toHaveBeenCalledWith(["Banana", "Apple", "Cherry"]);
      });
    });

    it("moves item up with ArrowUp", async () => {
      const onReorder = jest.fn();
      render(<SortableList {...defaultProps} onReorder={onReorder} />);

      fireEvent.click(screen.getByText("Enter Edit Mode"));

      const secondButton = screen.getByLabelText(/Reorder Banana/);
      fireEvent.keyDown(secondButton, { key: "ArrowUp" });

      await waitFor(() => {
        expect(onReorder).toHaveBeenCalledWith(["Banana", "Apple", "Cherry"]);
      });
    });

    it("does not move first item up", () => {
      const onReorder = jest.fn();
      render(<SortableList {...defaultProps} onReorder={onReorder} />);

      fireEvent.click(screen.getByText("Enter Edit Mode"));

      const firstButton = screen.getByLabelText(/Reorder Apple/);
      fireEvent.keyDown(firstButton, { key: "ArrowUp" });

      expect(onReorder).not.toHaveBeenCalled();
    });

    it("does not move last item down", () => {
      const onReorder = jest.fn();
      render(<SortableList {...defaultProps} onReorder={onReorder} />);

      fireEvent.click(screen.getByText("Enter Edit Mode"));

      const lastButton = screen.getByLabelText(/Reorder Cherry/);
      fireEvent.keyDown(lastButton, { key: "ArrowDown" });

      expect(onReorder).not.toHaveBeenCalled();
    });

    it("announces keyboard reorder", async () => {
      render(<SortableList {...defaultProps} />);

      fireEvent.click(screen.getByText("Enter Edit Mode"));

      const firstButton = screen.getByLabelText(/Reorder Apple/);
      fireEvent.keyDown(firstButton, { key: "ArrowDown" });

      const liveRegion = document.querySelector("[aria-live='assertive']");

      await waitFor(() => {
        expect(liveRegion).toHaveTextContent("Moved Apple to position 2 of 3");
      });
    });

    it("moves focus to next item after reorder", async () => {
      render(<SortableList {...defaultProps} />);

      fireEvent.click(screen.getByText("Enter Edit Mode"));

      const firstButton = screen.getByLabelText(/Reorder Apple/);
      fireEvent.keyDown(firstButton, { key: "ArrowDown" });

      await waitFor(() => {
        // After moving Apple down, focus should move to what's now position 2
        const secondButton = screen.getByLabelText(
          /Reorder Apple.*Item 2 of 3/
        );
        expect(secondButton).toHaveFocus();
      });
    });
  });

  describe("Drag and Drop", () => {
    it("allows dragging items", () => {
      const { container } = render(<SortableList {...defaultProps} />);

      const firstItem = container.querySelector("li");
      expect(firstItem).toHaveAttribute("draggable", "true");
    });

    it("announces drag and drop reorder", async () => {
      const { container } = render(<SortableList {...defaultProps} />);

      const items = container.querySelectorAll("li");
      const firstItem = items[0];
      const secondItem = items[1];

      // Simulate drag
      fireEvent.dragStart(firstItem, {
        dataTransfer: { effectAllowed: "move", setData: jest.fn() },
      });

      fireEvent.dragOver(secondItem, {
        dataTransfer: { dropEffect: "move" },
      });

      fireEvent.drop(secondItem);

      const liveRegion = document.querySelector(
        "[aria-live='assertive']"
      ) as HTMLElement;

      await waitFor(() => {
        expect(liveRegion.textContent).toContain("Moved Apple to position");
      });
    });

    it("calls onReorder after drop", () => {
      const onReorder = jest.fn();
      const { container } = render(
        <SortableList {...defaultProps} onReorder={onReorder} />
      );

      const items = container.querySelectorAll("li");
      const firstItem = items[0];
      const thirdItem = items[2];

      fireEvent.dragStart(firstItem, {
        dataTransfer: { effectAllowed: "move", setData: jest.fn() },
      });

      fireEvent.dragOver(thirdItem, {
        dataTransfer: { dropEffect: "move" },
      });

      fireEvent.drop(thirdItem);

      expect(onReorder).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes", () => {
      render(<SortableList {...defaultProps} title="Fruits" />);

      const list = screen.getByRole("list");

      expect(list).toHaveAttribute("aria-roledescription", "Sortable List");
      expect(list).toHaveAttribute("aria-describedby");
      expect(list).toHaveAttribute("aria-labelledby");
    });

    it("provides screen reader instructions", () => {
      render(<SortableList {...defaultProps} />);

      const instructions = screen.getByText(/Press the button above/);
      expect(instructions).toHaveClass("sr-only");
    });

    it("updates instructions in edit mode", () => {
      render(<SortableList {...defaultProps} />);

      fireEvent.click(screen.getByText("Enter Edit Mode"));

      expect(
        screen.getByText(/Use the arrow buttons to reorder/)
      ).toBeInTheDocument();
    });

    it("includes item position in reorder button label", () => {
      render(<SortableList {...defaultProps} />);

      fireEvent.click(screen.getByText("Enter Edit Mode"));

      expect(
        screen.getByLabelText(/Reorder Apple.*Item 1 of 3/)
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/Reorder Banana.*Item 2 of 3/)
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/Reorder Cherry.*Item 3 of 3/)
      ).toBeInTheDocument();
    });

    it("hides decorative icons from screen readers", () => {
      const { container } = render(<SortableList {...defaultProps} />);

      const gripIcons = container.querySelectorAll('svg[aria-hidden="true"]');
      expect(gripIcons.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    it("handles empty items array", () => {
      render(<SortableList items={[]} />);

      const list = screen.getByRole("list");
      expect(list).toBeEmptyDOMElement();
    });

    it("handles single item", () => {
      render(<SortableList items={["Only Item"]} />);

      fireEvent.click(screen.getByText("Enter Edit Mode"));

      const button = screen.getByLabelText(/Reorder Only Item/);

      // Can't move up or down
      fireEvent.keyDown(button, { key: "ArrowUp" });
      fireEvent.keyDown(button, { key: "ArrowDown" });

      expect(screen.getByText("Only Item")).toBeInTheDocument();
    });

    it("updates when items prop changes", () => {
      const { rerender } = render(<SortableList items={["A", "B"]} />);

      expect(screen.getByText("A")).toBeInTheDocument();
      expect(screen.getByText("B")).toBeInTheDocument();

      rerender(<SortableList items={["C", "D", "E"]} />);

      expect(screen.queryByText("A")).not.toBeInTheDocument();
      expect(screen.getByText("C")).toBeInTheDocument();
      expect(screen.getByText("D")).toBeInTheDocument();
      expect(screen.getByText("E")).toBeInTheDocument();
    });
  });
});
