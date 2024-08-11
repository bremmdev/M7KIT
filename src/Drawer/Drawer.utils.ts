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
    bottom: `${baseHeight} bottom-0 top-[25svh] overflow-y-auto animate-slide-up`,
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
        const rect = drawer.getBoundingClientRect();
        if (
          (isOpen && e.clientX < rect.left) ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        ) {
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
