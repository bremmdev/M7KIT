import React from "react";

/**
 * A hook that traps focus within a specified element.
 * @param el The element to trap focus within
 * @param options Optional settings for the focus trap, including:
 *  - condition: A boolean to enable or disable the focus trap (default: true)
 *  - onEscape: A callback function to be called when the Escape key is pressed
 *  - initialFocusElement: Specifies which element to focus on when the trap is activated. Can be:
 *  - "first": Focus the first focusable element (default)
 *  - "container": Focus the container element (for example, a modal dialog)
 *  - A ref to a specific element to focus
 *  - autoRestoreFocus: If true, restores focus to the previously focused element when the trap is deactivated (default: true)
 * @returns void
 * @example
 * ```
 * const ref = React.useRef(null);
 * useFocusTrap(ref, { condition: isOpen });
 * ```
 */

export function useFocusTrap<T extends HTMLElement>(
  el: React.RefObject<T | null>,
  options?: {
    condition?: boolean;
    onEscape?: () => void;
    initialFocusElement?:
      | React.RefObject<HTMLElement | null>
      | "first"
      | "container";
    autoRestoreFocus?: boolean;
  }
) {
  const previousActiveElement = React.useRef<HTMLElement | null>(null);
  const {
    condition = true,
    onEscape,
    initialFocusElement = "first",
    autoRestoreFocus = true,
  } = options || {};

  React.useEffect(() => {
    const container = el.current;
    // Guard: only run when active and container exists
    if (!container || !condition) return;

    // Store the element that had focus before trap
    previousActiveElement.current = document.activeElement as HTMLElement;

    const getFocusableElements = () => {
      if (!el.current) return [];

      return Array.from(
        el.current.querySelectorAll<HTMLElement>(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]'
        )
      ).filter(
        (element) =>
          !element.hasAttribute("disabled") &&
          !element.hasAttribute("hidden") &&
          element.offsetParent !== null &&
          getComputedStyle(element).visibility !== "hidden"
      );
    };

    // Determine what to focus
    const setInitialFocus = () => {
      if (initialFocusElement === "container") {
        el.current?.focus();
      } else if (initialFocusElement === "first") {
        const focusable = getFocusableElements();
        focusable[0]?.focus();
      } else if (initialFocusElement && initialFocusElement.current) {
        initialFocusElement.current.focus();
      }
    };

    setTimeout(setInitialFocus, 0); // Delay to ensure element is rendered

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!el.current) return;

      // Handle Escape
      if (e.key === "Escape" && onEscape) {
        onEscape();
        return;
      }

      if (e.key !== "Tab") return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeEl = document.activeElement as HTMLElement;

      // Shift + Tab
      if (e.shiftKey) {
        if (activeEl === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      }
      // Tab
      else {
        if (activeEl === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);

      // Optionally restore focus
      if (
        autoRestoreFocus &&
        previousActiveElement.current &&
        previousActiveElement.current.isConnected // Ensure it's still in the DOM
      ) {
        previousActiveElement.current.focus();
      }
    };
  }, [el, options?.condition, options?.onEscape, options?.initialFocusElement]);
}
