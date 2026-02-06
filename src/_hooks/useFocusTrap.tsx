import React from "react";

/**
 * Selector for all focusable elements that can receive keyboard focus.
 * Includes standard interactive elements and elements with explicit tabindex.
 */
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  "iframe",
  "object",
  "embed",
  "audio[controls]",
  "video[controls]",
  '[tabindex]:not([tabindex="-1"])',
  "[contenteditable]",
].join(", ");

/**
 * Filters elements to only those that are actually visible and focusable.
 */
const isElementVisible = (element: HTMLElement): boolean =>
  !element.hasAttribute("disabled") &&
  !element.hasAttribute("hidden") &&
  element.offsetParent !== null &&
  getComputedStyle(element).visibility !== "hidden";

/**
 * A hook that traps focus within a specified element.
 * @param el The element to trap focus within
 * @param options Optional settings for the focus trap, including:
 *  - condition: A boolean to enable or disable the focus trap (default: true)
 *  - onEscape: A callback function to be called when the Escape key is pressed
 *  - initialFocusElement: Specifies which element to focus on when the trap is activated. Can be:
 *    - "first": Focus the first focusable element (default)
 *    - "container": Focus the container element (for example, a modal dialog)
 *    - A ref to a specific element to focus
 *  - autoRestoreFocus: If true, restores focus to the previously focused element when the trap is deactivated (default: true)
 *  - loop: If true, loops through the focusable elements when the end or start of the focusable elements is reached (default: true)
 *  - inert: If true, marks all sibling content as inert to prevent screen reader access outside the trap (default: false)
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
    initialFocusElement?: React.RefObject<HTMLElement | null> | "first" | "container";
    autoRestoreFocus?: boolean;
    loop?: boolean;
    inert?: boolean;
  }
) {
  const previousActiveElement = React.useRef<HTMLElement | null>(null);
  const hasSetInitialFocus = React.useRef(false);
  const inertElements = React.useRef<Set<Element>>(new Set());

  const {
    condition = true,
    onEscape,
    initialFocusElement = "first",
    autoRestoreFocus = true,
    loop = true,
    inert = false,
  } = options || {};

  // Handle inert attribute on sibling content for screen reader containment
  React.useEffect(() => {
    const container = el.current;
    if (!container || !condition || !inert) {
      // Remove inert from previously marked elements
      inertElements.current.forEach((element) => {
        element.removeAttribute("inert");
      });
      inertElements.current.clear();
      return;
    }

    // Mark all siblings and their ancestors' siblings as inert
    const markSiblingsInert = (element: Element | null) => {
      while (element && element !== document.body) {
        const parent = element.parentElement;
        if (parent) {
          Array.from(parent.children).forEach((sibling) => {
            if (sibling !== element && !sibling.hasAttribute("inert")) {
              sibling.setAttribute("inert", "");
              inertElements.current.add(sibling);
            }
          });
        }
        element = parent;
      }
    };

    markSiblingsInert(container);

    return () => {
      inertElements.current.forEach((element) => {
        element.removeAttribute("inert");
      });
      inertElements.current.clear();
    };
  }, [el, condition, inert]);

  React.useEffect(() => {
    const container = el.current;

    // When condition becomes false, restore focus and reset
    if (!container || !condition) {
      if (autoRestoreFocus && previousActiveElement.current && previousActiveElement.current.isConnected) {
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

      const getFocusableElements = (): HTMLElement[] => {
        if (!el.current) return [];
        return Array.from(el.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isElementVisible);
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

      // Use requestAnimationFrame for more predictable timing after paint
      requestAnimationFrame(() => {
        requestAnimationFrame(setInitialFocus);
      });
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!el.current) return;

      if (e.key === "Escape" && onEscape) {
        onEscape();
        return;
      }

      if (e.key !== "Tab") return;

      const focusables = Array.from(el.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        isElementVisible
      );

      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement;

      // Tab loop logic - consistent behavior for both Tab and Shift+Tab
      if (e.shiftKey) {
        if (active === first) {
          if (loop) {
            e.preventDefault();
            last.focus();
          } else {
            // Break out of trap backwards
            onEscape?.();
            return;
          }
        }
      } else {
        if (active === last) {
          if (loop) {
            e.preventDefault();
            first.focus();
          } else {
            // Break out of trap forwards
            onEscape?.();
            return;
          }
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [el, condition, onEscape, initialFocusElement, loop, autoRestoreFocus]);
}
