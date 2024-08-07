/* eslint-disable */
import React from "react";

function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function useResizeWindow(cb: (...args: Array<any>) => void, delay = 20) {
  const debouncedResizeHandler = React.useMemo(() => debounce(cb, delay), [cb, delay]);

  React.useEffect(() => {
    window.addEventListener("resize", debouncedResizeHandler);
    return () => {
      window.removeEventListener("resize", debouncedResizeHandler);
    };
  }, [debouncedResizeHandler]);
}