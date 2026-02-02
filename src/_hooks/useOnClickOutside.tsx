import React from "react";

type Event = MouseEvent | TouchEvent;

export function useOnClickOutside<T extends HTMLElement>(
  element: React.RefObject<T | null> | Array<React.RefObject<HTMLElement | null>>,
  handler: (e: Event) => void
) {
  React.useEffect(() => {
    const listener = (e: Event) => {
      const elements = Array.isArray(element) ? element : [element];
      const target = e.target as HTMLElement;

      // Check if click is inside any of the elements
      const isInsideAnyElement = elements.some((el) => {
        const currentEl = el.current;
        return currentEl && (target === currentEl || currentEl.contains(target));
      });

      // Call the handler only if the click is outside all elements
      if (!isInsideAnyElement) {
        handler(e);
      }
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [element, handler]);
}
