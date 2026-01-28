import { getItemsWithIdsAndLabels } from "./SortableList.utils";

//mock uuid to return predictable ids for testing
jest.mock("uuid", () => ({
  v4: jest.fn().mockImplementation(() => "unique-id")
}));

describe("getItemsWithIdsAndLabels", () => {
  describe("extractTextFromReactNode", () => {
    it("extracts text from string primitives", () => {
      const items = ["Banana", "Apple", "Orange"];
      const result = getItemsWithIdsAndLabels(items);

      expect(result[0].label).toBe("Banana");
      expect(result[1].label).toBe("Apple");
      expect(result[2].label).toBe("Orange");
    });

    it("extracts text from number primitives", () => {
      const items = [1, 42, 100];
      const result = getItemsWithIdsAndLabels(items);

      expect(result[0].label).toBe("1");
      expect(result[1].label).toBe("42");
      expect(result[2].label).toBe("100");
    });

    it("returns empty string for null, undefined, and booleans", () => {
      const items = [null, undefined, true, false];
      const result = getItemsWithIdsAndLabels(items);

      expect(result[0].label).toBe("");
      expect(result[1].label).toBe("");
      expect(result[2].label).toBe("");
      expect(result[3].label).toBe("");
    });

    it("extracts text from simple React elements", () => {
      const items = [<div>Banana</div>, <span>Apple</span>, <p>Orange</p>];
      const result = getItemsWithIdsAndLabels(items);

      expect(result[0].label).toBe("Banana");
      expect(result[1].label).toBe("Apple");
      expect(result[2].label).toBe("Orange");
    });

    it("extracts text from nested React elements", () => {
      const items = [
        <div>
          <strong>Banana</strong> - Yellow
        </div>,
        <div>
          <span>Apple</span>
          <em>Red</em>
        </div>
      ];
      const result = getItemsWithIdsAndLabels(items);

      expect(result[0].label).toBe("Banana - Yellow");
      expect(result[1].label).toBe("Apple Red");
    });

    it("prefers aria-label over text content", () => {
      const items = [<div aria-label="Orange fruit">🍊</div>, <span aria-label="Custom label">Actual text</span>];
      const result = getItemsWithIdsAndLabels(items);

      expect(result[0].label).toBe("Orange fruit");
      expect(result[1].label).toBe("Custom label");
    });

    it("excludes aria-hidden elements", () => {
      const items = [
        <div>
          <span aria-hidden="true">🔍</span>
          Search
        </div>,
        <div>
          <i aria-hidden="true" className="icon" />
          Delete
        </div>
      ];
      const result = getItemsWithIdsAndLabels(items);

      expect(result[0].label).toBe("Search");
      expect(result[1].label).toBe("Delete");
    });

    it("excludes aria-hidden with boolean true", () => {
      const items = [
        <div>
          <span aria-hidden={true}>Icon</span>
          Text
        </div>
      ];
      const result = getItemsWithIdsAndLabels(items);

      expect(result[0].label).toBe("Text");
    });

    it("handles deeply nested aria-hidden elements", () => {
      const items = [
        <div>
          <div aria-hidden="true">
            <span>Hidden Icon</span>
            <i>More hidden</i>
          </div>
          <span>Visible Text</span>
        </div>
      ];
      const result = getItemsWithIdsAndLabels(items);

      expect(result[0].label).toBe("Visible Text");
    });

    it("handles arrays of React nodes", () => {
      const items = [
        [<span key="1">First</span>, <span key="2">Second</span>],
        ["Third", "Fourth"]
      ];
      const result = getItemsWithIdsAndLabels(items);

      expect(result[0].label).toBe("First Second");
      expect(result[1].label).toBe("Third Fourth");
    });

    it("handles complex mixed content", () => {
      const items = [
        <div>
          <span aria-hidden="true">🗑️</span>
          <strong>Delete</strong>
          <span aria-label="priority badge">⭐</span>
        </div>
      ];
      const result = getItemsWithIdsAndLabels(items);

      expect(result[0].label).toBe("Delete priority badge");
    });

    it("trims whitespace correctly", () => {
      const items = [
        <div>
          {"  "}
          Text with spaces
          {"  "}
        </div>,
        "  String with spaces  "
      ];
      const result = getItemsWithIdsAndLabels(items);

      expect(result[0].label).toBe("Text with spaces");
      expect(result[1].label).toBe("String with spaces");
    });

    it("preserves original value", () => {
      const customElement = <div className="custom">Custom Element</div>;
      const items = ["String", 42, customElement];
      const result = getItemsWithIdsAndLabels(items);

      expect(result[0].value).toBe("String");
      expect(result[1].value).toBe(42);
      expect(result[2].value).toBe(customElement);
    });
  });
});
