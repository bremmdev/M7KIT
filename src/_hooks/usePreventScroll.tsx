import React from "react";

type Options = {
  /**
   * Condition to prevent scrolling
   */
  enabled: boolean;
  /**
   * Class to add to body to prevent scrolling
   * @default "overflow-hidden"
   */
  preventBodyScrollClass?: string;
};

export function usePreventScroll({ enabled, preventBodyScrollClass = "overflow-hidden" }: Options) {
  const togglePreventScroll = React.useCallback(
    (add: boolean) => (add ? document.body.setAttribute("inert", "") : document.body.removeAttribute("inert")),
    []
  );

  React.useEffect(() => {
    if (!enabled) return;
    togglePreventScroll(true);
    document.body.classList.add(preventBodyScrollClass);

    return () => {
      togglePreventScroll(false);

      document.body.classList.remove(preventBodyScrollClass);
    };
  }, [togglePreventScroll, preventBodyScrollClass, enabled]);
}
