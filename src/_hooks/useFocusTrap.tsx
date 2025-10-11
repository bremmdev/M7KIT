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
  const hasSetInitialFocus = React.useRef(false);
  const {
    condition = true,
    onEscape,
    initialFocusElement = "first",
    autoRestoreFocus = true,
  } = options || {};

  React.useEffect(() => {
    const container = el.current;

    // When condition becomes false, restore focus and reset
    if (!container || !condition) {
      if (
        autoRestoreFocus &&
        previousActiveElement.current &&
        previousActiveElement.current.isConnected
      ) {
        previousActiveElement.current.focus();
        previousActiveElement.current = null; // Clear after restore
      }
      hasSetInitialFocus.current = false;
      return;
    }

    // Store the element that had focus before trap
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Only set initial focus once per activation
    if (!hasSetInitialFocus.current) {
      hasSetInitialFocus.current = true;

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

      const setInitialFocus = () => {
        if (initialFocusElement === "container") {
          el.current?.focus();
        } else if (initialFocusElement === "first") {
          const focusables = getFocusableElements();
          focusables[0]?.focus();
        } else if (initialFocusElement && initialFocusElement.current) {
          initialFocusElement.current.focus();
        }
      };

      // Delay to ensure rendering is done
      setTimeout(setInitialFocus, 0);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!el.current) return;

      if (e.key === "Escape" && onEscape) {
        onEscape();
        return;
      }

      if (e.key !== "Tab") return;

      const focusables = Array.from(
        el.current.querySelectorAll<HTMLElement>(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]'
        )
      ).filter(
        (el) =>
          !el.hasAttribute("disabled") &&
          !el.hasAttribute("hidden") &&
          el.offsetParent !== null &&
          getComputedStyle(el).visibility !== "hidden"
      );

      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement;

      // Tab loop logic
      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [el, condition, onEscape, initialFocusElement]);
}
