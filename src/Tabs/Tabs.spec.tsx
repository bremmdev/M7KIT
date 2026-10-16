import React from "react";
import { renderToString } from "react-dom/server";
import { render } from "@testing-library/react";
import { Tabs } from "./Tabs";
import userEvent from "@testing-library/user-event";

const createTabsComponent = (defaultValue: string, onValueChange?: () => void) => (
  <>
    <h2 id="tabs-title">Tabs title</h2>
    <Tabs.Root defaultValue={defaultValue} onValueChange={onValueChange}>
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
      expect(getAllByRole("tab")[0].id).toBeTruthy();
    });

    it("should have aria-controls pointing to its panel", () => {
      const { getAllByRole } = render(TabsComponent);
      const panel = getAllByRole("tabpanel", { hidden: true })[0];
      expect(getAllByRole("tab")[0]).toHaveAttribute("aria-controls", panel.id);
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

    it("should have aria-labelledby pointing to its tab", () => {
      const { getAllByRole } = render(TabsComponent);
      expect(getAllByRole("tabpanel")[0]).toHaveAttribute("aria-labelledby", getAllByRole("tab")[0].id);
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

    it("should set first tab active if no defaultValue is provided", () => {
      const { getAllByRole } = render(createTabsComponent(""));
      expect(getAllByRole("tab")[0]).toHaveAttribute("aria-selected", "true");
      expect(getAllByRole("tabpanel")[0]).not.toHaveClass("hidden");
    });

    it("should show the panel of the defaultValue", () => {
      const { getAllByRole } = render(createTabsComponent("third"));
      expect(getAllByRole("tab")[2]).toHaveAttribute("aria-selected", "true");
      expect(getAllByRole("tabpanel", { hidden: true }).map((panel) => panel.classList.contains("hidden"))).toEqual([
        true,
        true,
        false
      ]);
    });

    it("should show the panel of a clicked tab", async () => {
      const { getAllByRole } = render(createTabsComponent("first"));
      await userEvent.click(getAllByRole("tab")[2]);
      expect(getAllByRole("tab")[2]).toHaveAttribute("aria-selected", "true");
      expect(getAllByRole("tabpanel", { hidden: true })[2]).not.toHaveClass("hidden");
      expect(getAllByRole("tabpanel", { hidden: true })[0]).toHaveClass("hidden");
    });

    it("should keep its role and ids when other props are passed", () => {
      const { getAllByRole } = render(
        <Tabs.Root>
          <Tabs.List aria-label="Tabs">
            <Tabs.Tab label="first">First</Tabs.Tab>
          </Tabs.List>
          <Tabs.Content label="first" id="custom" role="region" aria-labelledby="other" data-testid="panel">
            First
          </Tabs.Content>
        </Tabs.Root>
      );
      const tab = getAllByRole("tab")[0];
      const panel = getAllByRole("tabpanel")[0];
      expect(panel).toHaveAttribute("data-testid", "panel");
      expect(panel).toHaveAttribute("aria-labelledby", tab.id);
      expect(tab).toHaveAttribute("aria-controls", panel.id);
    });

    it("should let a panel opt out of the tab order", () => {
      const { getAllByRole } = render(
        <Tabs.Root>
          <Tabs.List aria-label="Tabs">
            <Tabs.Tab label="first">First</Tabs.Tab>
          </Tabs.List>
          <Tabs.Content label="first" tabIndex={-1}>
            <a href="#top">Documentation</a>
          </Tabs.Content>
        </Tabs.Root>
      );
      expect(getAllByRole("tabpanel")[0]).toHaveAttribute("tabindex", "-1");
    });
  });

  describe("Outside Tabs.Root", () => {
    let consoleError: jest.SpyInstance;
    beforeEach(() => {
      consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    });
    afterEach(() => {
      consoleError.mockRestore();
    });

    it("should throw a clear error for Tabs.List", () => {
      expect(() => render(<Tabs.List aria-label="Tabs">{null}</Tabs.List>)).toThrow(
        "Tabs.List must be used within Tabs.Root"
      );
    });

    it("should throw a clear error for Tabs.Tab", () => {
      expect(() => render(<Tabs.Tab label="first">First</Tabs.Tab>)).toThrow("Tabs.Tab must be used within Tabs.Root");
    });

    it("should throw a clear error for Tabs.Content", () => {
      expect(() => render(<Tabs.Content label="first">First</Tabs.Content>)).toThrow(
        "Tabs.Content must be used within Tabs.Root"
      );
    });
  });

  describe("Keyboard interaction", () => {
    const TabsComponent2 = createTabsComponent("second");

    it("should focus the active tab on tab", async () => {
      const { getAllByRole } = render(TabsComponent2);
      await userEvent.keyboard("{tab}");
      expect(getAllByRole("tab")[1]).toHaveFocus();
    });

    it("should focus the next tab on arrow right", async () => {
      const { getAllByRole } = render(TabsComponent2);
      await userEvent.keyboard("{tab}{arrowright}");
      expect(getAllByRole("tab")[2]).toHaveFocus();
    });

    it("should focus the previous tab on arrow left", async () => {
      const { getAllByRole } = render(TabsComponent2);
      await userEvent.keyboard("{tab}{arrowleft}");
      expect(getAllByRole("tab")[0]).toHaveFocus();
    });

    it("should focus the first tab on home", async () => {
      const { getAllByRole } = render(TabsComponent2);
      await userEvent.keyboard("{tab}{home}");
      expect(getAllByRole("tab")[0]).toHaveFocus();
    });

    it("should focus the last tab on end", async () => {
      const { getAllByRole } = render(TabsComponent2);
      await userEvent.keyboard("{tab}{end}");
      expect(getAllByRole("tab")[2]).toHaveFocus();
    });

    it("should wrap from the last tab to the first on arrow right", async () => {
      const { getAllByRole } = render(createTabsComponent("third"));
      await userEvent.keyboard("{tab}{arrowright}");
      expect(getAllByRole("tab")[0]).toHaveFocus();
      expect(getAllByRole("tab")[0]).toHaveAttribute("aria-selected", "true");
    });

    it("should wrap from the first tab to the last on arrow left", async () => {
      const { getAllByRole } = render(createTabsComponent("first"));
      await userEvent.keyboard("{tab}{arrowleft}");
      expect(getAllByRole("tab")[2]).toHaveFocus();
      expect(getAllByRole("tab")[2]).toHaveAttribute("aria-selected", "true");
    });

    it("should select the focused tab, show its panel and hide the others", async () => {
      const { getAllByRole } = render(createTabsComponent("first"));
      await userEvent.keyboard("{tab}{arrowright}");
      const tabs = getAllByRole("tab");
      const panels = getAllByRole("tabpanel", { hidden: true });
      expect(tabs.map((tab) => tab.getAttribute("aria-selected"))).toEqual(["false", "true", "false"]);
      expect(tabs.map((tab) => tab.getAttribute("tabindex"))).toEqual(["-1", "0", "-1"]);
      expect(panels.map((panel) => panel.classList.contains("hidden"))).toEqual([true, false, true]);
    });

    it("should only move between the tabs of its own Tabs when they are nested", async () => {
      const { getByRole } = render(
        <Tabs.Root defaultValue="outer-first">
          <Tabs.List aria-label="Outer">
            <Tabs.Tab label="outer-first">Outer first</Tabs.Tab>
            <Tabs.Tab label="outer-second">Outer second</Tabs.Tab>
          </Tabs.List>
          <Tabs.Content label="outer-first">
            <Tabs.Root>
              <Tabs.List aria-label="Inner">
                <Tabs.Tab label="inner-first">Inner first</Tabs.Tab>
                <Tabs.Tab label="inner-second">Inner second</Tabs.Tab>
              </Tabs.List>
              <Tabs.Content label="inner-first">Inner first</Tabs.Content>
              <Tabs.Content label="inner-second">Inner second</Tabs.Content>
            </Tabs.Root>
          </Tabs.Content>
          <Tabs.Content label="outer-second">Outer second</Tabs.Content>
        </Tabs.Root>
      );
      expect(getByRole("tab", { name: "Inner first" })).toHaveAttribute("aria-selected", "true");
      await userEvent.click(getByRole("tab", { name: "Inner first" }));
      await userEvent.keyboard("{arrowright}");
      expect(getByRole("tab", { name: "Inner second" })).toHaveFocus();
      await userEvent.keyboard("{arrowright}");
      expect(getByRole("tab", { name: "Inner first" })).toHaveFocus();
      expect(getByRole("tab", { name: "Outer first" })).toHaveAttribute("aria-selected", "true");
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

  describe("Ids", () => {
    it("should link a tab and its panel when the label has spaces", () => {
      const { getByRole } = render(
        <Tabs.Root>
          <Tabs.List aria-label="Docs">
            <Tabs.Tab label="Getting started">Getting started</Tabs.Tab>
          </Tabs.List>
          <Tabs.Content label="Getting started">Content</Tabs.Content>
        </Tabs.Root>
      );
      const tab = getByRole("tab", { name: "Getting started" });
      const panel = getByRole("tabpanel", { name: "Getting started" });
      expect(tab.getAttribute("aria-controls")).not.toMatch(/\s/);
      expect(tab).toHaveAttribute("aria-controls", panel.id);
    });

    it("should have unique ids when two Tabs use the same labels", () => {
      const { getAllByRole } = render(
        <>
          {createTabsComponent("first")}
          {createTabsComponent("first")}
        </>
      );
      const tabs = getAllByRole("tab");
      const panels = getAllByRole("tabpanel", { hidden: true });
      const ids = [...tabs, ...panels].map((el) => el.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(panels[3]).toHaveAttribute("aria-labelledby", tabs[3].id);
    });
  });

  describe("Props", () => {
    it("should pass props to the tab", async () => {
      const onClick = jest.fn();
      const ref = React.createRef<HTMLButtonElement>();
      const { getByRole } = render(
        <Tabs.Root>
          <Tabs.List aria-label="Tabs">
            <Tabs.Tab label="settings" aria-label="Settings" data-testid="settings" onClick={onClick} ref={ref}>
              <svg aria-hidden="true" />
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Content label="settings">Settings</Tabs.Content>
        </Tabs.Root>
      );
      const tab = getByRole("tab", { name: "Settings" });
      expect(tab).toHaveAttribute("data-testid", "settings");
      expect(ref.current).toBe(tab);
      await userEvent.click(tab);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("should not select the tab when its onClick calls preventDefault", async () => {
      const onValueChange = jest.fn();
      const { getAllByRole } = render(
        <Tabs.Root defaultValue="first" onValueChange={onValueChange}>
          <Tabs.List aria-label="Tabs">
            <Tabs.Tab label="first">First</Tabs.Tab>
            <Tabs.Tab label="second" onClick={(e) => e.preventDefault()}>
              Second
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Content label="first">First</Tabs.Content>
          <Tabs.Content label="second">Second</Tabs.Content>
        </Tabs.Root>
      );
      await userEvent.click(getAllByRole("tab")[1]);
      expect(getAllByRole("tab")[0]).toHaveAttribute("aria-selected", "true");
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("should pass props to the root", () => {
      const ref = React.createRef<HTMLDivElement>();
      const { container } = render(
        <Tabs.Root id="frameworks" data-testid="root" ref={ref}>
          <Tabs.List aria-label="Tabs">
            <Tabs.Tab label="first">First</Tabs.Tab>
          </Tabs.List>
          <Tabs.Content label="first">First</Tabs.Content>
        </Tabs.Root>
      );
      const root = container.firstChild as HTMLDivElement;
      expect(root).toHaveAttribute("id", "frameworks");
      expect(root).toHaveAttribute("data-testid", "root");
      expect(ref.current).toBe(root);
    });

    it("should call the tablist's onKeyDown and skip the keyboard handling when it calls preventDefault", async () => {
      const onKeyDown = jest.fn((e: React.KeyboardEvent) => e.preventDefault());
      const { getAllByRole } = render(
        <Tabs.Root defaultValue="first">
          <Tabs.List aria-label="Tabs" onKeyDown={onKeyDown}>
            <Tabs.Tab label="first">First</Tabs.Tab>
            <Tabs.Tab label="second">Second</Tabs.Tab>
          </Tabs.List>
          <Tabs.Content label="first">First</Tabs.Content>
          <Tabs.Content label="second">Second</Tabs.Content>
        </Tabs.Root>
      );
      await userEvent.keyboard("{tab}{arrowright}");
      expect(onKeyDown).toHaveBeenCalled();
      expect(getAllByRole("tab")[0]).toHaveFocus();
      expect(getAllByRole("tab")[0]).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("Disabled tabs", () => {
    const createDisabledTabs = (defaultValue?: string) => (
      <Tabs.Root defaultValue={defaultValue}>
        <Tabs.List aria-label="Tabs">
          <Tabs.Tab label="first" disabled>
            First
          </Tabs.Tab>
          <Tabs.Tab label="second">Second</Tabs.Tab>
          <Tabs.Tab label="third" disabled>
            Third
          </Tabs.Tab>
          <Tabs.Tab label="fourth">Fourth</Tabs.Tab>
        </Tabs.List>
        <Tabs.Content label="first">First</Tabs.Content>
        <Tabs.Content label="second">Second</Tabs.Content>
        <Tabs.Content label="third">Third</Tabs.Content>
        <Tabs.Content label="fourth">Fourth</Tabs.Content>
      </Tabs.Root>
    );

    it("should be disabled", () => {
      const { getAllByRole } = render(createDisabledTabs());
      expect(getAllByRole("tab")[0]).toBeDisabled();
    });

    it("should select the first enabled tab by default", () => {
      const { getAllByRole } = render(createDisabledTabs());
      expect(getAllByRole("tab")[1]).toHaveAttribute("aria-selected", "true");
      expect(getAllByRole("tab")[1]).toHaveAttribute("tabindex", "0");
    });

    it("should select the first enabled tab when the default value is a disabled tab", () => {
      const { getAllByRole } = render(createDisabledTabs("third"));
      expect(getAllByRole("tab")[1]).toHaveAttribute("aria-selected", "true");
    });

    it("should skip disabled tabs with the arrow keys", async () => {
      const { getAllByRole } = render(createDisabledTabs("second"));
      await userEvent.keyboard("{tab}{arrowright}");
      expect(getAllByRole("tab")[3]).toHaveFocus();
      await userEvent.keyboard("{arrowright}");
      expect(getAllByRole("tab")[1]).toHaveFocus();
      await userEvent.keyboard("{arrowleft}");
      expect(getAllByRole("tab")[3]).toHaveFocus();
      expect(getAllByRole("tab")[3]).toHaveAttribute("aria-selected", "true");
    });

    it("should skip disabled tabs with home and end", async () => {
      const { getAllByRole } = render(createDisabledTabs("fourth"));
      await userEvent.keyboard("{tab}{home}");
      expect(getAllByRole("tab")[1]).toHaveFocus();
      await userEvent.keyboard("{end}");
      expect(getAllByRole("tab")[3]).toHaveFocus();
    });
  });

  describe("Keyboard reachability", () => {
    const getTabbable = (tabs: Array<HTMLElement>) => tabs.filter((tab) => tab.getAttribute("tabindex") === "0");
    const getVisiblePanels = (panels: Array<HTMLElement>) =>
      panels.filter((panel) => !panel.classList.contains("hidden"));

    it("should select the first tab when the value matches no tab", () => {
      const { getAllByRole } = render(createTabsComponent("typo"));
      expect(getTabbable(getAllByRole("tab"))).toEqual([getAllByRole("tab")[0]]);
      expect(getVisiblePanels(getAllByRole("tabpanel", { hidden: true }))).toHaveLength(1);
    });

    it("should select the first tab when the selected tab is removed", () => {
      const createTabs = (labels: Array<string>) => (
        <Tabs.Root defaultValue="third">
          <Tabs.List aria-label="Tabs">
            {labels.map((label) => (
              <Tabs.Tab key={label} label={label}>
                {label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          {labels.map((label) => (
            <Tabs.Content key={label} label={label}>
              {label}
            </Tabs.Content>
          ))}
        </Tabs.Root>
      );
      const { getAllByRole, rerender } = render(createTabs(["first", "second", "third"]));
      rerender(createTabs(["first", "second"]));
      expect(getTabbable(getAllByRole("tab"))).toEqual([getAllByRole("tab")[0]]);
      expect(getVisiblePanels(getAllByRole("tabpanel", { hidden: true }))).toHaveLength(1);
    });

    it("should select the first tab in the server-rendered HTML when there is no value", () => {
      const html = renderToString(createTabsComponent(""));
      const container = document.createElement("div");
      container.innerHTML = html;
      const tabs = Array.from(container.querySelectorAll<HTMLElement>('[role="tab"]'));
      const panels = Array.from(container.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");
      expect(getTabbable(tabs)).toEqual([tabs[0]]);
      expect(getVisiblePanels(panels)).toEqual([panels[0]]);
    });

    it("should only move between tabs with the arrow keys when the tablist has other elements", async () => {
      const { getAllByRole } = render(
        <Tabs.Root defaultValue="first">
          <Tabs.List aria-label="Tabs">
            <Tabs.Tab label="first">First</Tabs.Tab>
            <Tabs.Tab label="second">Second</Tabs.Tab>
            <span aria-hidden="true">|</span>
          </Tabs.List>
          <Tabs.Content label="first">First</Tabs.Content>
          <Tabs.Content label="second">Second</Tabs.Content>
        </Tabs.Root>
      );
      await userEvent.keyboard("{tab}{arrowleft}");
      expect(getAllByRole("tab")[1]).toHaveFocus();
      expect(getAllByRole("tab")[1]).toHaveAttribute("aria-selected", "true");
      await userEvent.keyboard("{end}");
      expect(getAllByRole("tab")[1]).toHaveFocus();
    });

    it("should find tabs that are wrapped in other elements", async () => {
      const { getAllByRole } = render(
        <Tabs.Root>
          <Tabs.List aria-label="Tabs">
            <span>
              <Tabs.Tab label="first">First</Tabs.Tab>
            </span>
            <span>
              <Tabs.Tab label="second">Second</Tabs.Tab>
            </span>
          </Tabs.List>
          <Tabs.Content label="first">First</Tabs.Content>
          <Tabs.Content label="second">Second</Tabs.Content>
        </Tabs.Root>
      );
      await userEvent.keyboard("{tab}{arrowright}");
      expect(getAllByRole("tab")[1]).toHaveFocus();
      expect(getAllByRole("tab")[1]).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("Right-to-left", () => {
    it("should move to the tab on the left with arrow left", async () => {
      const { getAllByRole } = render(<div dir="rtl">{createTabsComponent("first")}</div>);
      await userEvent.keyboard("{tab}{arrowleft}");
      expect(getAllByRole("tab")[1]).toHaveFocus();
      expect(getAllByRole("tab")[1]).toHaveAttribute("aria-selected", "true");
    });

    it("should move to the tab on the right with arrow right, and wrap", async () => {
      const { getAllByRole } = render(<div dir="rtl">{createTabsComponent("first")}</div>);
      await userEvent.keyboard("{tab}{arrowright}");
      expect(getAllByRole("tab")[2]).toHaveFocus();
    });

    it("should follow the direction of a nested ltr section", async () => {
      const { getAllByRole } = render(
        <div dir="rtl">
          <div dir="ltr">{createTabsComponent("first")}</div>
        </div>
      );
      await userEvent.keyboard("{tab}{arrowright}");
      expect(getAllByRole("tab")[1]).toHaveFocus();
    });

    it("should keep home and end on the first and last tab", async () => {
      const { getAllByRole } = render(<div dir="rtl">{createTabsComponent("second")}</div>);
      await userEvent.keyboard("{tab}{home}");
      expect(getAllByRole("tab")[0]).toHaveFocus();
      await userEvent.keyboard("{end}");
      expect(getAllByRole("tab")[2]).toHaveFocus();
    });
  });

  describe("Modifier keys", () => {
    it.each(["Alt", "Control", "Meta", "Shift"])(
      "should ignore the arrow keys, home and end with %s",
      async (modifier) => {
        const onValueChange = jest.fn();
        const { getAllByRole } = render(createTabsComponent("second", onValueChange));
        await userEvent.keyboard(`{tab}{${modifier}>}{arrowleft}{arrowright}{home}{end}{/${modifier}}`);
        expect(getAllByRole("tab")[1]).toHaveFocus();
        expect(getAllByRole("tab")[1]).toHaveAttribute("aria-selected", "true");
        expect(onValueChange).not.toHaveBeenCalled();
      }
    );

    it("should not prevent the default action of the key with a modifier", () => {
      const { getAllByRole } = render(createTabsComponent("second"));
      const event = new KeyboardEvent("keydown", { key: "ArrowLeft", altKey: true, bubbles: true, cancelable: true });
      getAllByRole("tab")[1].dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });
  });

  describe("Controlled", () => {
    const ControlledTabs = ({ initialValue = "first", accept = true }: { initialValue?: string; accept?: boolean }) => {
      const [value, setValue] = React.useState(initialValue);
      return (
        <>
          <button type="button" onClick={() => setValue("third")}>
            Show third
          </button>
          <Tabs.Root value={value} onValueChange={(next) => accept && setValue(next)}>
            <Tabs.List aria-label="Tabs">
              <Tabs.Tab label="first">First</Tabs.Tab>
              <Tabs.Tab label="second">Second</Tabs.Tab>
              <Tabs.Tab label="third">Third</Tabs.Tab>
            </Tabs.List>
            <Tabs.Content label="first">First</Tabs.Content>
            <Tabs.Content label="second">Second</Tabs.Content>
            <Tabs.Content label="third">Third</Tabs.Content>
          </Tabs.Root>
        </>
      );
    };

    let warn: jest.SpyInstance;
    beforeEach(() => {
      warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    });
    afterEach(() => {
      warn.mockRestore();
    });

    it("should select the tab when the parent updates the value", async () => {
      const { getAllByRole } = render(<ControlledTabs />);
      await userEvent.click(getAllByRole("tab")[1]);
      expect(getAllByRole("tab")[1]).toHaveAttribute("aria-selected", "true");
    });

    it("should keep the selected tab when the parent doesn't update the value", async () => {
      const { getAllByRole } = render(<ControlledTabs accept={false} />);
      await userEvent.click(getAllByRole("tab")[1]);
      expect(getAllByRole("tab")[0]).toHaveAttribute("aria-selected", "true");
      expect(getAllByRole("tabpanel")[0]).not.toHaveClass("hidden");
      expect(getAllByRole("tabpanel")[1]).toHaveClass("hidden");
    });

    it("should follow a value changed by the parent", async () => {
      const { getAllByRole, getByRole } = render(<ControlledTabs />);
      await userEvent.click(getByRole("button", { name: "Show third" }));
      expect(getAllByRole("tab")[2]).toHaveAttribute("aria-selected", "true");
    });

    it("should treat an empty string as a controlled value", async () => {
      const onValueChange = jest.fn();
      const { getAllByRole } = render(
        <Tabs.Root value="" onValueChange={onValueChange}>
          <Tabs.List aria-label="Tabs">
            <Tabs.Tab label="first">First</Tabs.Tab>
            <Tabs.Tab label="second">Second</Tabs.Tab>
          </Tabs.List>
          <Tabs.Content label="first">First</Tabs.Content>
          <Tabs.Content label="second">Second</Tabs.Content>
        </Tabs.Root>
      );
      expect(getAllByRole("tab")[0]).toHaveAttribute("aria-selected", "true");
      await userEvent.click(getAllByRole("tab")[1]);
      expect(onValueChange).toHaveBeenCalledWith("second");
      expect(getAllByRole("tab")[0]).toHaveAttribute("aria-selected", "true");
    });

    it("should warn instead of throwing when both value and defaultValue are passed, and use value", () => {
      const { getAllByRole } = render(
        <Tabs.Root value="second" defaultValue="first" onValueChange={() => {}}>
          <Tabs.List aria-label="Tabs">
            <Tabs.Tab label="first">First</Tabs.Tab>
            <Tabs.Tab label="second">Second</Tabs.Tab>
          </Tabs.List>
          <Tabs.Content label="first">First</Tabs.Content>
          <Tabs.Content label="second">Second</Tabs.Content>
        </Tabs.Root>
      );
      expect(getAllByRole("tab")[1]).toHaveAttribute("aria-selected", "true");
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("both `value` and `defaultValue`"));
    });

    it("should warn when value is passed without onValueChange", () => {
      render(
        <Tabs.Root value="first">
          <Tabs.List aria-label="Tabs">
            <Tabs.Tab label="first">First</Tabs.Tab>
          </Tabs.List>
          <Tabs.Content label="first">First</Tabs.Content>
        </Tabs.Root>
      );
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("without `onValueChange`"));
    });

    it("should warn once when changing between controlled and uncontrolled", () => {
      const createTabs = (value?: string) => (
        <Tabs.Root value={value} onValueChange={() => {}}>
          <Tabs.List aria-label="Tabs">
            <Tabs.Tab label="first">First</Tabs.Tab>
          </Tabs.List>
          <Tabs.Content label="first">First</Tabs.Content>
        </Tabs.Root>
      );
      const { rerender } = render(createTabs(undefined));
      rerender(createTabs("first"));
      rerender(createTabs(undefined));
      rerender(createTabs("first"));
      const switchWarnings = warn.mock.calls.filter(([message]) =>
        String(message).includes("uncontrolled to controlled")
      );
      expect(switchWarnings).toHaveLength(1);
    });

    it("should not warn for uncontrolled tabs", () => {
      render(createTabsComponent("first"));
      expect(warn).not.toHaveBeenCalled();
    });
  });
});
