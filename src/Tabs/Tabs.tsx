import React from "react";
import {
  TabListProps,
  TabsProps,
  TabProps,
  TabContentProps,
} from "./Tabs.types";
import { cn } from "../utils/cn";

type TabsContext = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const TabsContext = React.createContext<TabsContext | undefined>(undefined);

export const Tabs = ({ className, defaultSelected, children }: TabsProps) => {
  const [activeTab, setActiveTab] = React.useState(defaultSelected);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("text-slate-950", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

Tabs.Root = Tabs;

const TabList = ({ className, children, ...props }: TabListProps) => {
  const { activeTab, setActiveTab } = React.useContext(
    TabsContext
  ) as TabsContext;

  const tabListRef = React.useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const key = e.key;

    function getTabs() {
      return Array.from(
        tabListRef.current!.children
      ) as Array<HTMLButtonElement>;
    }

    if (key === "ArrowRight" || key === "ArrowLeft") {
      e.preventDefault();
      const tabs = getTabs();

      //get the current index of the active tab based on its data-label
      const currentIndex = tabs.findIndex(
        (tab) => tab.dataset.tablabel === activeTab
      );
      //get the next index based on the arrow key pressed, and make sure it loops
      const direction = key === "ArrowRight" ? 1 : -1;
      const nextTab =
        tabs[(currentIndex + direction + tabs.length) % tabs.length];
      setActiveTab(nextTab.dataset.tablabel!);
      nextTab.focus();
    }

    if (key === "Home" || key === "End") {
      e.preventDefault();
      const tabs = getTabs();
      const indexToFocus = key === "Home" ? 0 : tabs.length - 1;
      const newTab = tabs[indexToFocus];
      setActiveTab(newTab.dataset.tablabel!);
      newTab.focus();
    }
  };

  return (
    <div
      role="tablist"
      {...props}
      onKeyDown={handleKeyDown}
      className={cn("border-b border-b-slate-300 mb-1", className)}
      ref={tabListRef}
    >
      {children}
    </div>
  );
};

Tabs.List = TabList;

const Tab = ({ className, label, children }: TabProps) => {
  const { activeTab, setActiveTab } = React.useContext(
    TabsContext
  ) as TabsContext;

  const tabRef = React.useRef<HTMLButtonElement>(null);

  const handleOnClick = () => {
    setActiveTab(label);
  };

  return (
    <button
      role="tab"
      type="button"
      id={`tab-${label}`}
      aria-controls={`panel-${label}`}
      aria-selected={activeTab === label}
      tabIndex={activeTab === label ? 0 : -1}
      onClick={handleOnClick}
      data-tablabel={label}
      ref={tabRef}
      className={cn(
        "py-2 px-4 mb-[2px] focus-visible:outline-blue-600 focus-visible:-outline-offset-1 hover:bg-blue-50 mr-1",
        {
          "border-b-2 border-b-blue-600 font-medium bg-blue-50":
            activeTab === label,
        },
        className
      )}
    >
      {children}
    </button>
  );
};

Tabs.Tab = Tab;

const TabContent = ({
  className,
  label,
  children,
  ...props
}: TabContentProps) => {
  const { activeTab } = React.useContext(TabsContext) as TabsContext;

  return (
    <div
      role="tabpanel"
      id={`panel-${label}`}
      aria-labelledby={`tab-${label}`}
      tabIndex={0}
      className={cn(
        "animate-fade-in p-4 focus-visible:outline-blue-600",
        className,
        {
          hidden: activeTab !== label,
        }
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Tabs.Content = TabContent;
