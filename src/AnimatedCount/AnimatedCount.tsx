import React from "react";
import { AnimatedCountProps } from "./AnimatedCount.types";
import { cn } from "../utils/cn";
import { JSX } from "react";

export const AnimatedCount = <T extends keyof JSX.IntrinsicElements>(props: AnimatedCountProps<T>) => {
  const {
    as = "span",
    className,
    count,
    duration = 2000,
    slowDownAt,
    slowDownFactor = 10,
    start = 0,
    step = 1
  } = props;

  const [currentCount, setCurrentCount] = React.useState(start);

  // Function to calculate dynamic interval
  const calculateInterval = React.useCallback(
    (currentCount: number, slowDownAt?: number) => {
      const direction = count > start ? 1 : -1;
      const baseInterval = duration / Math.abs((count - start) / step);
      if (!slowDownAt) return baseInterval;

      // Start with baseInterval and increase it only when near the end
      const isSlowed = direction > 0 ? currentCount >= slowDownAt : currentCount <= slowDownAt;
      const slowed = isSlowed ? slowDownFactor : 1;

      return baseInterval * slowed;
    },
    [count, duration, slowDownFactor, start, step]
  );

  React.useEffect(() => {
    const direction = count > start ? 1 : -1;
    const continueCounting = direction > 0 ? currentCount < count : currentCount > count;

    if (continueCounting) {
      const interval = calculateInterval(currentCount, slowDownAt);
      const timer = setTimeout(() => {
        setCurrentCount((prev) => prev + step);
      }, interval);

      // Clean up the timeout
      return () => clearTimeout(timer);
    }
  }, [currentCount, count, calculateInterval, duration, slowDownAt, step, start]);

  const Element = as as keyof JSX.IntrinsicElements;

  //prevent layout shift by setting width to the max number of digits
  const styles = {
    width: `${Math.max(count.toString().length, start.toString().length)}ch`
  };

  return (
    <Element style={styles} className={cn("inline-block text-center text-foreground", className)}>
      {currentCount}
    </Element>
  );
};

export default AnimatedCount;
