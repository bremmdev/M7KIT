/**
 * Screen reader announcements through two shared, visually hidden live regions: one polite and one assertive.
 *
 * Every message is added to its region as a new child element instead of replacing the region's text. Messages from
 * different components can't overwrite each other before they are read, and a repeated message is a new addition, so
 * it is announced again. The regions are `role="log"` with `aria-relevant="additions"`: only the new child is read
 * (`aria-atomic` stays false) and removing old messages is silent. `role="status"` and `role="alert"` would make the
 * regions atomic, so every message still in them would be read again.
 *
 * Polite is the default. Assertive is for errors and time-critical messages only: WCAG counts other use as a failure,
 * most Windows screen readers treat it as polite anyway, and VoiceOver interrupts what it is reading.
 *
 * The regions live outside the components on purpose: a live region inside a component that is wrapped in a `<label>`
 * would add its message to the accessible name of the labelled control.
 *
 * Content outside a modal dialog (`showModal()`, `aria-modal="true"`, or a focus trap that makes the rest of the page
 * inert) is hidden from screen readers, live regions included. So messages go into regions inside the open modal: the
 * one around the announcing element, or else the topmost one. Only without an open modal do they go to `document.body`.
 */

import { AnnounceOptions, Politeness } from "./Announcer.types";

export const ANNOUNCER_ATTRIBUTE = "data-m7kit-announcer";

/** Messages are written this long after `announce()`: messages from the same moment can be merged and ordered, and the page can settle first (a dialog that is closing) */
export const QUEUE_DELAY = 100;
/** Time between two messages, so screen readers get each message separately */
export const MESSAGE_INTERVAL = 250;
/** A new pair of regions waits this long before its first message: screen readers can miss a message in a region that was only just added */
export const PRIMING_DELAY = 150;
/** Messages are removed after this long, so they aren't found as stray text when browsing the page */
export const DEFAULT_TIMEOUT = 7000;

type QueuedMessage = {
  message: string;
  politeness: Politeness;
  from?: Element | null;
  id?: string;
  timeout: number;
  // The earliest time the message may be written
  notBefore: number;
};

let queue: QueuedMessage[] = [];
let timer: ReturnType<typeof setTimeout> | undefined;
let lastWrite = Number.NEGATIVE_INFINITY;

// When each pair of regions was created, so the first message in a new pair can wait for it to be registered
const createdAt = new WeakMap<Element, number>();
// The last message written for each id, removed when a newer one with the same id is written
const writtenById = new Map<string, HTMLElement>();

// Inline styles instead of Tailwind's sr-only, so the regions work without the consumer's CSS
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

const findWrapper = (container: Element) =>
  Array.from(container.children).find((child) => child.hasAttribute(ANNOUNCER_ATTRIBUTE)) as HTMLElement | undefined;

const createRegion = (politeness: Politeness) => {
  const region = document.createElement("div");
  region.setAttribute("role", "log");
  region.setAttribute("aria-live", politeness);
  region.setAttribute("aria-relevant", "additions");
  return region;
};

const getOrCreateWrapper = (container: Element) => {
  const existing = findWrapper(container);
  if (existing) {
    return existing;
  }

  const wrapper = document.createElement("div");
  wrapper.setAttribute(ANNOUNCER_ATTRIBUTE, "");
  Object.assign(wrapper.style, visuallyHidden);
  wrapper.append(createRegion("polite"), createRegion("assertive"));
  createdAt.set(wrapper, Date.now());

  // In a dialog the wrapper becomes a sibling of the consumer's content, so it counts for :first-child / :last-child.
  // Tailwind's space-* and divide-* style every child except the last; as the first child the wrapper only gets those
  // styles itself (invisible, it's clipped), instead of adding spacing or a divider below the real last item
  if (container === document.body) {
    container.append(wrapper);
  } else {
    container.prepend(wrapper);
  }

  return wrapper;
};

const isRendered = (element: Element) =>
  !element.closest("[hidden], dialog:not([open])") &&
  (typeof element.checkVisibility === "function" ? element.checkVisibility() : true);

// A dialog opened with showModal(), or a visible element with aria-modal="true"
const isOpenModal = (element: Element) => {
  if (element instanceof HTMLDialogElement) {
    if (!element.open) {
      return false;
    }

    // :modal tells showModal() from show(). Without support (jsdom), an open dialog counts as modal: a region inside
    // an open dialog can always be heard, so that's the safe side
    try {
      return element.matches(":modal");
    } catch {
      return true;
    }
  }

  return element.getAttribute("aria-modal") === "true" && isRendered(element);
};

// The last open modal in document order. Nested modals are usually rendered after the one they were opened from
const getTopmostModal = () =>
  Array.from(document.querySelectorAll("dialog[open], [aria-modal='true']")).filter(isOpenModal).at(-1) ?? null;

// The open dialog around the element, modal or not
const getOwnDialog = (element: Element) => {
  const dialog = element.closest("dialog, [aria-modal='true']");
  if (dialog instanceof HTMLDialogElement) {
    return dialog.open ? dialog : null;
  }
  return dialog && isOpenModal(dialog) ? dialog : null;
};

// Where a message can be heard right now
const getContainer = (from?: Element | null): Element => {
  const topmost = getTopmostModal();
  const own = from?.isConnected ? getOwnDialog(from) : null;

  // The element's own dialog, unless another modal is open on top of it: that one makes the rest of the page inert
  if (own && (!topmost || topmost === own || topmost.contains(own))) {
    return own;
  }

  return topmost ?? document.body;
};

// The only place that puts messages on the page, so it can switch to `ariaNotify()` once screen readers support it well
const write = (wrapper: Element, { message, politeness, id, timeout }: QueuedMessage) => {
  const region = Array.from(wrapper.children).find((child) => child.getAttribute("aria-live") === politeness);
  if (!region) {
    return;
  }

  const node = document.createElement("div");
  node.textContent = message;
  region.append(node);

  if (id !== undefined) {
    // An older message from the same source is out of date. Removals aren't announced (aria-relevant="additions")
    writtenById.get(id)?.remove();
    writtenById.set(id, node);
  }

  setTimeout(() => {
    node.remove();
    if (id !== undefined && writtenById.get(id) === node) {
      writtenById.delete(id);
    }
  }, timeout);
};

// Sets the timer for the next message that can be written: when its wait is over, and 250 ms after the last message
const schedule = () => {
  clearTimeout(timer);
  timer = undefined;

  if (queue.length === 0) {
    return;
  }

  const earliest = Math.min(...queue.map((item) => item.notBefore));
  const at = Math.max(earliest, lastWrite + MESSAGE_INTERVAL);
  timer = setTimeout(flush, Math.max(at - Date.now(), 0));
};

// Writes the next message whose wait is over (assertive first), one at a time
const flush = () => {
  timer = undefined;

  const now = Date.now();
  const ready = queue.filter((item) => item.notBefore <= now);
  const next = ready.find((item) => item.politeness === "assertive") ?? ready[0];
  if (!next || now < lastWrite + MESSAGE_INTERVAL) {
    schedule();
    return;
  }

  // The container is picked now, not when announce() was called: a message sent while a dialog closes must not end up
  // in that dialog, which is hidden by now
  const wrapper = getOrCreateWrapper(getContainer(next.from));
  const age = now - (createdAt.get(wrapper) ?? Number.NEGATIVE_INFINITY);
  if (age < PRIMING_DELAY) {
    timer = setTimeout(flush, PRIMING_DELAY - age);
    return;
  }

  queue.splice(queue.indexOf(next), 1);
  write(wrapper, next);
  lastWrite = now;
  schedule();
};

/**
 * Creates the live regions for the given element's container (its dialog, or `document.body`) if they don't exist yet.
 * Call this ahead of the first announcement (e.g. on mount, or when a dialog opens): screen readers can miss a message
 * in a region that was only just added to the page.
 */
export const ensureLiveRegion = (element?: Element | null) => {
  if (typeof document === "undefined") {
    return null;
  }

  // Any dialog, open or not: content is often mounted while its dialog is still closed
  return getOrCreateWrapper(element?.closest("dialog, [aria-modal='true']") ?? document.body);
};

/**
 * Announces a message to screen readers without moving focus (WCAG 2.2 SC 4.1.3 Status Messages).
 *
 * The message is queued and written about 100 ms later (or after `delay`), one message at a time, 250 ms apart, with
 * assertive messages first. It is added to a visually hidden live region as a new element, and removed again after
 * `timeout`.
 *
 * @example
 * announce("Profile saved");
 * announce("Connection lost. Your changes are not saved.", { politeness: "assertive" });
 */
export const announce = (message: string, options: AnnounceOptions = {}) => {
  if (typeof document === "undefined" || !message.trim()) {
    return;
  }

  const { politeness = "polite", from, id, delay = 0, timeout = DEFAULT_TIMEOUT } = options;
  const notBefore = Date.now() + Math.max(QUEUE_DELAY, delay);
  const queued: QueuedMessage = { message, politeness, from, id, timeout, notBefore };

  // A waiting message with the same id is replaced, and its wait starts again
  const waiting = id === undefined ? -1 : queue.findIndex((item) => item.id === id);
  if (waiting === -1) {
    queue.push(queued);
  } else {
    queue[waiting] = queued;
  }

  schedule();
};

/**
 * Cancels waiting messages and empties the live regions, for one politeness or both.
 */
export const clearAnnouncer = (politeness?: Politeness) => {
  queue = politeness ? queue.filter((item) => item.politeness !== politeness) : [];

  if (!politeness) {
    lastWrite = Number.NEGATIVE_INFINITY;
    writtenById.clear();
  }

  schedule();

  if (typeof document === "undefined") {
    return;
  }

  const regions = document.querySelectorAll(
    `[${ANNOUNCER_ATTRIBUTE}] > [aria-live${politeness ? `="${politeness}"` : ""}]`
  );
  for (const region of regions) {
    region.replaceChildren();
  }
};
