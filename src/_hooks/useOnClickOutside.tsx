import React from "react";

type Event = MouseEvent | TouchEvent;

export function useOnClickOutside<T extends HTMLElement>(
  element: React.RefObject<T>,
  handler: (e: Event) => void
) {
  React.useEffect(() => {
    const listener = (e: Event) => {
      const el = element.current;
      const target = e.target as HTMLElement;

      if (!el || target === el || el.contains(target)) {
        return;
      }
      handler(e); //Call the handler only if the click is outside of the element
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [element, handler]);
}