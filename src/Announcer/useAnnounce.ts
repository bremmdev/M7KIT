import React from "react";
import { announce, ensureLiveRegion } from "./Announcer";
import { AnnounceOptions, UseAnnounceOptions } from "./Announcer.types";

/**
 * Announces messages to screen readers from a component.
 *
 * Creates the live regions when the component mounts (inside its dialog, if it has one), so they exist before the
 * first message, and returns a stable `announce` function that sends messages from the component's element.
 *
 * @param ref The component's element. Picks the live regions of its dialog. Without it, messages go to the open
 * modal dialog, or to the page
 *
 * @example
 * const listRef = React.useRef<HTMLUListElement>(null);
 * const announce = useAnnounce(listRef);
 * announce(`Moved ${label} to position ${index + 1} of ${total}`, { id: listId });
 */
export const useAnnounce = (ref?: React.RefObject<Element | null>, { enabled = true }: UseAnnounceOptions = {}) => {
  React.useEffect(() => {
    if (enabled) {
      ensureLiveRegion(ref?.current);
    }
  }, [enabled, ref]);

  return React.useCallback(
    (message: string, options?: AnnounceOptions) => announce(message, { from: ref?.current, ...options }),
    [ref]
  );
};
