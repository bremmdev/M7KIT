import React from "react";
import { breakpoints } from "../breakpoints";
import { useThrottle } from "./useThrottle";

const windowSizeToBreakpoint = (windowSize: number) => {
  if (windowSize < breakpoints.sm) {
    return "xs";
  }
  if (windowSize < breakpoints.md) {
    return "sm";
  }
  if (windowSize < breakpoints.lg) {
    return "md";
  }
  if (windowSize < breakpoints.xl) {
    return "lg";
  }
  if (windowSize < breakpoints["2xl"]) {
    return "xl";
  }
  return "2xl";
};

export function useMediaQuery() {
  const [windowSize, setWindowSize] = React.useState(getWindowSize());

  function getWindowSize() {
    const isClient = typeof window === "object";
    return isClient ? window.innerWidth : undefined;
  }

  function handleResize() {
    setWindowSize(getWindowSize());
  }

  const throttledHandleResize = useThrottle(handleResize, 150);

  React.useEffect(() => {
    if (!(typeof window === "object")) {
      return;
    }

    window.addEventListener("resize", throttledHandleResize);
    return () => window.removeEventListener("resize", throttledHandleResize);
  }, [throttledHandleResize]); // Empty array ensures that effect is only run on mount and unmount

  return windowSize ? windowSizeToBreakpoint(windowSize) : undefined;
}

export default useMediaQuery;
