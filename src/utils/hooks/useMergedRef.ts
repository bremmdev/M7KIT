import React from "react";

/**
 * Combines a component's internal ref with the ref passed in by the consumer, so both point at the same element.
 * Supports object refs and callback refs, including React 19 callback refs that return a cleanup function.
 */
export const useMergedRef = <T>(internalRef: React.RefObject<T | null>, externalRef: React.Ref<T> | undefined) =>
  React.useCallback(
    (node: T | null) => {
      internalRef.current = node;

      const cleanup = typeof externalRef === "function" ? externalRef(node) : undefined;
      if (externalRef && typeof externalRef !== "function") {
        externalRef.current = node;
      }

      return () => {
        internalRef.current = null;

        if (typeof cleanup === "function") {
          cleanup();
        } else if (typeof externalRef === "function") {
          externalRef(null);
        } else if (externalRef) {
          externalRef.current = null;
        }
      };
    },
    [internalRef, externalRef]
  );
