/**
 * Urgency `polite` waits until the screen reader has finished what it is saying, `assertive` may interrupt it
 */
export type Politeness = "polite" | "assertive";

export type AnnounceOptions = {
  /**
   * @default "polite"
   */
  politeness?: Politeness;
  /**
   * The element the message comes from, usually the component that announces it. While it is inside an open dialog,
   * the message goes to the live regions of that dialog, because everything outside a modal dialog is hidden from
   * screen readers
   */
  from?: Element | null;
  /**
   * Identifies where the message comes from, for example one component instance. A message with the same `id` that is
   * still waiting is replaced by the new one, so a burst only announces the latest. When it is
   * written, an older message with the same `id` is removed from the live region
   */
  id?: string;
  /**
   * Milliseconds to wait before the message is written (instead of about 100 ms). A newer message with the same `id`
   * starts the wait again, so a quick series (an item moved several times) is announced once, when it stops, with the
   * latest message. Screen readers read every message they receive, so without it each step is read out in turn
   */
  delay?: number;
  /**
   * Milliseconds before the message is removed from the live region, so it isn't found later as stray text when
   * browsing the page
   * @default 7000
   */
  timeout?: number;
};

export type UseAnnounceOptions = {
  /**
   * Create the live regions when the component mounts, so they exist before the first message.
   * Set it to `false` while the component can't announce anything
   * @default true
   */
  enabled?: boolean;
};
