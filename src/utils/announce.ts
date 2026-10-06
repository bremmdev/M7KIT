/**
 * Screen reader announcements through a shared, visually hidden live region.
 *
 * The region lives outside the component on purpose: a live region inside a component that is wrapped in a `<label>`
 * would add its message to the accessible name of the labelled control.
 *
 * Content outside a modal dialog (`showModal()`, `aria-modal="true"`, or a focus trap that makes the rest of the page inert)
 * is hidden from screen readers, live regions included. So the region goes into the closest dialog around the announcing
 * element, and only falls back to `document.body` outside dialogs.
 */

const REGION_ATTRIBUTE = "data-m7kit-announcer";

// The region whose message is currently showing, and the timer that sets or clears it
let activeRegion: HTMLElement | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;

// Inline styles instead of Tailwind's sr-only, so the region works without the consumer's CSS
const visuallyHidden: Partial<CSSStyleDeclaration> = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: "0"
};

// Any dialog, open or not: content is often mounted while its dialog is still closed, and the region has to exist
// before the first announcement
const getContainer = (element?: Element | null) => element?.closest("dialog, [aria-modal='true']") ?? document.body;

/**
 * Creates the live region for the given element's container (its dialog, or `document.body`) if it doesn't exist yet.
 * Call this ahead of the first announcement (e.g. on mount): screen readers can miss a message in a region
 * that was only just added to the page.
 */
export const ensureLiveRegion = (element?: Element | null) => {
  if (typeof document === "undefined") {
    return null;
  }

  const container = getContainer(element);
  let region = Array.from(container.children).find((child) => child.hasAttribute(REGION_ATTRIBUTE)) as
    | HTMLElement
    | undefined;

  if (!region) {
    region = document.createElement("div");
    region.setAttribute(REGION_ATTRIBUTE, "");
    region.setAttribute("role", "status");
    Object.assign(region.style, visuallyHidden);

    // In a dialog the region becomes a sibling of the consumer's content, so it counts for :first-child / :last-child.
    // Tailwind's space-* and divide-* style every child except the last; as the first child the region only gets those
    // styles itself (invisible, it's clipped), instead of adding spacing or a divider below the real last item
    if (container === document.body) {
      container.appendChild(region);
    } else {
      container.prepend(region);
    }
  }

  return region;
};

/**
 * Announces a message politely to screen readers, through the live region of the element's container
 */
export const announce = (message: string, element?: Element | null) => {
  const liveRegion = ensureLiveRegion(element);
  if (!liveRegion) {
    return;
  }

  clearTimeout(timer);

  // A message still showing in another container's region is removed, so it isn't found as stray text later
  if (activeRegion && activeRegion !== liveRegion) {
    activeRegion.textContent = "";
  }
  activeRegion = liveRegion;

  // Clear first, so the same message is announced again when it repeats
  liveRegion.textContent = "";
  timer = setTimeout(() => {
    liveRegion.textContent = message;

    // Remove the message afterwards, so it isn't found as stray text when browsing the page
    timer = setTimeout(() => {
      liveRegion.textContent = "";
    }, 5000);
  }, 100);
};
