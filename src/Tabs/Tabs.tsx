import React from "react";
import { TabListProps, TabsProps, TabProps, TabContentProps } from "./Tabs.types";
import { cn } from "../utils/cn";
import { useMergedRef } from "../utils/hooks/useMergedRef";

type RegisteredTab = {
  label: string;
  disabled: boolean;
  element: HTMLButtonElement;
};

type TabsContext = {
  baseId: string;
  selectedTab: string;
  selectTab: (tab: string) => void;
  tabs: Array<RegisteredTab>;
  registerTab: (tab: RegisteredTab) => () => void;
};

const TabsContext = React.createContext<TabsContext | undefined>(undefined);

// A label is a value, not a valid id: it can contain spaces and another Tabs on the page can use the same label.
//  The id of the Tabs keeps the ids unique, and  encodeURIComponent removes the whitespace without making two labels the same
const getTabId = (baseId: string, label: string) => `${baseId}-tab-${encodeURIComponent(label)}`;
const getPanelId = (baseId: string, label: string) => `${baseId}-panel-${encodeURIComponent(label)}`;

// The direction the element actually has, also inside a nested dir="ltr" section
function isRtl(element: Element) {
  try {
    return element.matches(":dir(rtl)");
  } catch {
    // Browsers without :dir(), such as Chrome before 120
    return getComputedStyle(element).direction === "rtl";
  }
}

// The labels of the enabled tabs in the children. Used on the first render (and on the server), before the tabs have
// registered themselves, so a tab is selected from the start. Tabs rendered by other components are found once they register
function getTabLabels(children: React.ReactNode): Array<string> {
  return React.Children.toArray(children).flatMap((child) => {
    if (!React.isValidElement<{ children?: React.ReactNode; label?: string; disabled?: boolean }>(child)) return [];
    if (child.type === Tab) return child.props.disabled || child.props.label === undefined ? [] : [child.props.label];
    if (child.type === Tabs || child.type === TabContent) return [];
    return getTabLabels(child.props.children);
  });
}

/**
 * Dev-only warnings for misuse of the controlled/uncontrolled API, like the ones React gives for native inputs.
 * Each warning is logged at most once per instance
 */
const useValueDevWarnings = ({
  value,
  defaultValue,
  onValueChange
}: Pick<TabsProps, "value" | "defaultValue" | "onValueChange">) => {
  const isControlled = value !== undefined;

  const initialIsControlled = React.useRef(isControlled);
  const warned = React.useRef(new Set<string>());

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const warnOnce = (key: string, message: string) => {
      if (warned.current.has(key)) return;
      warned.current.add(key);
      console.warn(message);
    };

    if (isControlled !== initialIsControlled.current) {
      const [from, to] = initialIsControlled.current ? ["controlled", "uncontrolled"] : ["uncontrolled", "controlled"];
      warnOnce(
        "mode-switch",
        `Tabs is changing from ${from} to ${to}. This is likely caused by \`value\` changing between undefined and a string. ` +
          "Decide between controlled or uncontrolled Tabs for the lifetime of the component."
      );
    }

    if (isControlled && defaultValue !== undefined) {
      warnOnce(
        "both-props",
        "Tabs received both `value` and `defaultValue`. `defaultValue` is ignored when `value` is provided. " +
          "Use `value` with `onValueChange` for controlled Tabs, or `defaultValue` for uncontrolled Tabs."
      );
    }

    if (isControlled && !onValueChange) {
      warnOnce(
        "read-only",
        "Tabs received `value` without `onValueChange`, so the selected tab can never change. " +
          "Use `defaultValue` for uncontrolled Tabs, or add `onValueChange`."
      );
    }
  }, [isControlled, defaultValue, onValueChange]);
};

export const Tabs = ({ className, defaultValue, value, onValueChange, children, ...rest }: TabsProps) => {
  useValueDevWarnings({ value, defaultValue, onValueChange });

  const baseId = React.useId();

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const activeTab = isControlled ? value : internalValue;

  const [tabs, setTabs] = React.useState<Array<RegisteredTab>>([]);

  // Tabs register themselves, in the order of the page, so the keyboard handling only moves between real tabs
  const registerTab = React.useCallback((tab: RegisteredTab) => {
    setTabs((prev) =>
      [...prev.filter((t) => t.element !== tab.element), tab].sort((a, b) =>
        a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      )
    );
    return () => setTabs((prev) => prev.filter((t) => t !== tab));
  }, []);

  // Keyboard users reach the tabs through the selected tab, the only one in the tab order. When no enabled tab has the
  // active label (no value, a value that matches no tab, or a tab that was removed or disabled), the first enabled tab is
  // selected instead, so the tabs can still be reached and a panel is shown
  const labels = tabs.length > 0 ? tabs.filter((t) => !t.disabled).map((t) => t.label) : getTabLabels(children);
  const selectedTab = labels.includes(activeTab) ? activeTab : (labels[0] ?? activeTab);

  // In controlled mode this is a request: the parent decides whether to select the tab
  const selectTab = (tab: string) => {
    if (tab === selectedTab) return;
    if (!isControlled) {
      setInternalValue(tab);
    }
    onValueChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ baseId, selectedTab, selectTab, tabs, registerTab }}>
      <div {...rest} className={cn("text-foreground", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

Tabs.Root = Tabs;

const TabList = ({ className, children, onKeyDown, ...rest }: TabListProps) => {
  const { selectTab, tabs } = React.useContext(TabsContext) as TabsContext;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;

    // Key combinations belong to the browser, the OS or the screen reader, such as Alt+Left Arrow, which goes back
    // in browsers on Windows and Linux
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;

    // Only the enabled tabs: a disabled tab can't be focused, and other elements in the list aren't tabs
    const enabledTabs = tabs.filter((tab) => !tab.disabled);
    const currentIndex = enabledTabs.findIndex((tab) => tab.element === e.target);
    if (currentIndex === -1) return;

    // The arrow keys follow the order on screen: in right-to-left text the next tab is on the left
    const step = isRtl(e.currentTarget) ? -1 : 1;

    let nextIndex: number;
    switch (e.key) {
      case "ArrowRight":
        nextIndex = (currentIndex + step + enabledTabs.length) % enabledTabs.length;
        break;
      case "ArrowLeft":
        nextIndex = (currentIndex - step + enabledTabs.length) % enabledTabs.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = enabledTabs.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    const nextTab = enabledTabs[nextIndex];
    selectTab(nextTab.label);
    nextTab.element.focus();
  };

  return (
    <div {...rest} role="tablist" onKeyDown={handleKeyDown} className={cn("border-b border-b-neutral mb-1", className)}>
      {children}
    </div>
  );
};

Tabs.List = TabList;

const Tab = ({ className, label, disabled, onClick, ref, children, ...rest }: TabProps) => {
  const { baseId, selectedTab, selectTab, registerTab } = React.useContext(TabsContext) as TabsContext;

  const tabRef = React.useRef<HTMLButtonElement>(null);
  const mergedRef = useMergedRef(tabRef, ref);

  React.useLayoutEffect(
    () => registerTab({ label, disabled: Boolean(disabled), element: tabRef.current! }),
    [registerTab, label, disabled]
  );

  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    selectTab(label);
  };

  // Forced colors (Windows high contrast) replace the accent of the selected tab's underline, and Chromium paints it
  // in CanvasText or Highlight depending on how the tab was selected, so Highlight, the selection color, is set explicitly.
  // The hover background is replaced too, so a hovered tab shows a Highlight underline there, like Fluent UI. Unselected tabs
  // get the underline in Canvas, invisible on the page, so hover doesn't change their height. A disabled tab is GrayText
  // at full opacity and shows no hover
  const isSelected = selectedTab === label;

  return (
    <button
      {...rest}
      role="tab"
      type="button"
      id={getTabId(baseId, label)}
      aria-controls={getPanelId(baseId, label)}
      aria-selected={isSelected}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      onClick={handleOnClick}
      data-tablabel={label}
      ref={mergedRef}
      className={cn(
        "py-2 px-4 mb-[2px] focus-ring not-disabled:hover:bg-surface-subtle mr-1",
        "disabled:opacity-50 dark:disabled:opacity-70 disabled:cursor-not-allowed forced-colors:disabled:opacity-100 forced-colors:disabled:text-[GrayText]",
        {
          "border-b-2 border-accent font-medium bg-surface-muted hover:bg-surface-muted forced-colors:border-[Highlight]":
            isSelected,
          "forced-colors:border-b-2 forced-colors:border-[Canvas] forced-colors:not-disabled:hover:border-[Highlight]":
            !isSelected
        },
        className
      )}
    >
      {children}
    </button>
  );
};

Tabs.Tab = Tab;

const TabContent = ({ className, label, children, ...rest }: TabContentProps) => {
  const { baseId, selectedTab } = React.useContext(TabsContext) as TabsContext;

  return (
    <div
      role="tabpanel"
      id={getPanelId(baseId, label)}
      aria-labelledby={getTabId(baseId, label)}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: APG Tabs pattern: the tabpanel is focusable so keyboard users can reach panels that have no focusable content
      tabIndex={0}
      className={cn("animate-fade-in p-4 focus-ring", className, {
        hidden: selectedTab !== label
      })}
      {...rest}
    >
      {children}
    </div>
  );
};

Tabs.Content = TabContent;
