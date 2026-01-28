import { render } from "@testing-library/react";
import { Tabs } from "./Tabs";
import userEvent from "@testing-library/user-event";

const createTabsComponent = (defaultSelected: string, onValueChange?: () => void) => (
  <>
    <h2 id="tabs-title">Tabs title</h2>
    <Tabs.Root value={defaultSelected} onValueChange={onValueChange}>
      <Tabs.List className="TabsList" aria-labelledby="tabs-title">
        <Tabs.Tab className="TabsTrigger" label="first">
          Tab 1
        </Tabs.Tab>
        <Tabs.Tab className="TabsTrigger" label="second">
          Tab 2
        </Tabs.Tab>
        <Tabs.Tab className="TabsTrigger" label="third">
          Tab 3
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Content className="TabsContent" label="first">
        <p className="Text">Tabcontent 1</p>
      </Tabs.Content>
      <Tabs.Content className="TabsContent" label="second">
        <p className="Text">Tabcontent 2</p>
      </Tabs.Content>
      <Tabs.Content className="TabsContent" label="third">
        <p className="Text">Tabcontent 3</p>
      </Tabs.Content>
    </Tabs.Root>
  </>
);

const TabsComponent = createTabsComponent("first");

describe("Tabs", () => {
  describe("TabList", () => {
    it("should have tablist role", () => {
      const { getByRole } = render(TabsComponent);
      expect(getByRole("tablist")).toBeTruthy();
    });

    it("should have aria-labelledby", () => {
      const { getByRole } = render(TabsComponent);
      expect(getByRole("tablist")).toHaveAttribute("aria-labelledby", "tabs-title");
    });
  });

  describe("Tab", () => {
    it("should have tab role", () => {
      const { getAllByRole } = render(TabsComponent);
      expect(getAllByRole("tab")[0]).toBeInstanceOf(HTMLButtonElement);
      expect(getAllByRole("tab")).toHaveLength(3);
    });

    it("should have type button", () => {
      const { getAllByRole } = render(TabsComponent);
      expect(getAllByRole("tab")[0]).toHaveAttribute("type", "button");
    });

    it("should have an id so it can be referenced", () => {
      const { getAllByRole } = render(TabsComponent);
      expect(getAllByRole("tab")[0]).toHaveAttribute("id", "tab-first");
    });

    it("should have aria-controls", () => {
      const { getAllByRole } = render(TabsComponent);
      expect(getAllByRole("tab")[0]).toHaveAttribute("aria-controls", "panel-first");
    });

    it("should have aria-selected if selected", () => {
      const { getAllByRole } = render(TabsComponent);
      expect(getAllByRole("tab")[0]).toHaveAttribute("aria-selected", "true");
    });

    it("should not have aria-selected if not selected", () => {
      const { getAllByRole } = render(TabsComponent);
      expect(getAllByRole("tab")[1]).toHaveAttribute("aria-selected", "false");
    });

    it("should have tabindex 0 if selected", () => {
      const { getAllByRole } = render(TabsComponent);
      expect(getAllByRole("tab")[0]).toHaveAttribute("tabindex", "0");
    });

    it("should have tabindex -1 if not selected", () => {
      const { getAllByRole } = render(TabsComponent);
      expect(getAllByRole("tab")[1]).toHaveAttribute("tabindex", "-1");
    });
  });

  describe("TabContent", () => {
    it("should have tabpanel role", () => {
      const { getAllByRole } = render(TabsComponent);
      expect(getAllByRole("tabpanel")[0]).toBeInstanceOf(HTMLDivElement);
      expect(getAllByRole("tabpanel")).toHaveLength(3);
    });

    it("should have aria-labelledby", () => {
      const { getAllByRole } = render(TabsComponent);
      expect(getAllByRole("tabpanel")[0]).toHaveAttribute("aria-labelledby", "tab-first");
    });

    it("should be hidden if not selected", () => {
      const { getAllByRole } = render(TabsComponent);
      expect(getAllByRole("tabpanel")[1]).toHaveClass("hidden");
    });

    it("should not be hidden if selected", () => {
      const { getAllByRole } = render(TabsComponent);
      expect(getAllByRole("tabpanel")[0]).not.toHaveClass("hidden");
    });

    it("should have tabindex 0", () => {
      const { getAllByRole } = render(TabsComponent);
      expect(getAllByRole("tabpanel")[0]).toHaveAttribute("tabindex", "0");
    });

    it("should set first tab active if no defaultSelected is provided", () => {
      const { getAllByRole } = render(createTabsComponent(""));
      expect(getAllByRole("tab")[0]).toHaveAttribute("aria-selected", "true");
      expect(getAllByRole("tabpanel")[0]).not.toHaveClass("hidden");
    });
  });

  describe("Keyboard interaction", () => {
    const TabsComponent2 = createTabsComponent("second");

    it("should focus the active tab on tab", async () => {
      const { getAllByRole } = render(TabsComponent2);
      await userEvent.keyboard("{tab}");
      expect(getAllByRole("tab")[1]).toHaveFocus();
    });

    it("should focus the active tab on arrow right", async () => {
      const { getAllByRole } = render(TabsComponent2);
      await userEvent.keyboard("{tab}{arrowright}");
      expect(getAllByRole("tab")[2]).toHaveFocus();
    });

    it("should focus the active tab on arrow left", async () => {
      const { getAllByRole } = render(TabsComponent2);
      await userEvent.keyboard("{tab}{arrowleft}");
      expect(getAllByRole("tab")[0]).toHaveFocus();
    });

    it("should focus the active tab on home", async () => {
      const { getAllByRole } = render(TabsComponent2);
      await userEvent.keyboard("{tab}{home}");
      expect(getAllByRole("tab")[0]).toHaveFocus();
    });

    it("should focus the active tab on end", async () => {
      const { getAllByRole } = render(TabsComponent2);
      await userEvent.keyboard("{tab}{end}");
      expect(getAllByRole("tab")[2]).toHaveFocus();
    });
  });

  describe("Value change", () => {
    it("should call onValueChange when clicked", async () => {
      const onValueChange = jest.fn();
      const { getAllByRole } = render(createTabsComponent("first", onValueChange));
      await userEvent.click(getAllByRole("tab")[1]);
      expect(onValueChange).toHaveBeenCalledWith("second");
    });

    it("should not call onValueChange when clicked if already selected", async () => {
      const onValueChange = jest.fn();
      const { getAllByRole } = render(createTabsComponent("first", onValueChange));
      await userEvent.click(getAllByRole("tab")[0]);
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("should call onValueChange when arrow right", async () => {
      const onValueChange = jest.fn();
      render(createTabsComponent("first", onValueChange));
      await userEvent.keyboard("{tab}{arrowright}");
      expect(onValueChange).toHaveBeenCalledWith("second");
    });

    it("should call onValueChange when arrow left", async () => {
      const onValueChange = jest.fn();
      render(createTabsComponent("second", onValueChange));
      await userEvent.keyboard("{tab}{arrowleft}");
      expect(onValueChange).toHaveBeenCalledWith("first");
    });

    it("should call onValueChange when home", async () => {
      const onValueChange = jest.fn();
      render(createTabsComponent("second", onValueChange));
      await userEvent.keyboard("{tab}{home}");
      expect(onValueChange).toHaveBeenCalledWith("first");
    });

    it("should call onValueChange when end", async () => {
      const onValueChange = jest.fn();
      render(createTabsComponent("second", onValueChange));
      await userEvent.keyboard("{tab}{end}");
      expect(onValueChange).toHaveBeenCalledWith("third");
    });
  });
});
