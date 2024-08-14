import React from "react";
import { AnimatedCountProps } from "./AnimatedCount.types";
import { cn } from "../utils/cn";

export const AnimatedCount = <T extends keyof JSX.IntrinsicElements>(
  props: AnimatedCountProps<T>
) => {
  const {
    as = "span",
    className,
    count,
    duration = 2000,
    slowDownAt,
    slowDownFactor = 5,
    start = 0,
  } = props;

  const [currentCount, setCurrentCount] = React.useState(start);

  // Function to calculate dynamic interval
  const calculateInterval = React.useCallback(
    (currentCount: number, slowDownAt?: number) => {
      const baseInterval = duration / (count - start);
      if (!slowDownAt) return baseInterval;

      // Start with baseInterval and increase it only when near the end
      const slowed = currentCount >= slowDownAt ? slowDownFactor : 1;

      return baseInterval * slowed;
    },
    [count, duration, slowDownFactor, start]
  );

  React.useEffect(() => {
    if (currentCount < count) {
      const interval = calculateInterval(currentCount, slowDownAt);
      const timer = setTimeout(() => {
        setCurrentCount((prev) => prev + 1);
      }, interval);

      // Clean up the timeout
      return () => clearTimeout(timer);
    }
  }, [currentCount, count, calculateInterval, duration, slowDownAt]);

  const Element = as as keyof JSX.IntrinsicElements;

  return (
    <Element className={cn("w-fit", className)}>
      {currentCount}
    </Element>
  );
};

export default AnimatedCount;
