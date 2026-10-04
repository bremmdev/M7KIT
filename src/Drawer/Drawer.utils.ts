import React from "react";
import { DrawerContext } from "./DrawerContext";
import { Placement } from "./Drawer.types";

export function getPositionClasses(placement: Placement) {
  const baseWidth = "w-full sm:w-2/3 lg:w-1/2";
  const baseHeight = "h-[75svh]";

  return {
    right: `${baseWidth} left-0 sm:left-1/3 lg:left-1/2 h-svh animate-slide-left`,
    left: `${baseWidth} right-0 sm:right-1/3 lg:right-1/2 h-svh animate-slide-right`,
    top: `${baseHeight} top-0 bottom-[25svh] overflow-y-auto animate-slide-down`,
    bottom: `${baseHeight} bottom-0 top-[25svh] overflow-y-auto animate-slide-up`
  }[placement];
}

export function useDrawer() {
  const context = React.useContext(DrawerContext);

  if (!context) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }

  return context;
}

export function useDrawerEvents() {
  const { drawerRef, isOpen, close } = useDrawer();

  React.useEffect(() => {
    const drawer = drawerRef.current;

    if (drawer) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          close();
        }
      };

      const handleClickOutside = (e: MouseEvent) => {
        // A backdrop click targets the dialog itself. Clicks on the content target its children, and must be ignored:
        // clicks from the keyboard (Space on a checkbox, Enter on a button) or from a <label> have clientX/clientY 0,
        // so their coordinates look like they are outside the drawer
        if (!isOpen || e.target !== drawer) {
          return;
        }

        // The dialog itself can also be clicked inside its own area (e.g. empty space below the content)
        const rect = drawer.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
          close();
        }
      };

      drawer.addEventListener("keydown", handleKeyDown);
      drawer.addEventListener("click", handleClickOutside);

      return () => {
        drawer.removeEventListener("keydown", handleKeyDown);
        drawer.removeEventListener("click", handleClickOutside);
      };
    }
  }, [drawerRef, close, isOpen]);
}
