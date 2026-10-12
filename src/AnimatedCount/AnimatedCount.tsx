import React from "react";
import { AnimatedCountProps } from "./AnimatedCount.types";
import { cn } from "../utils/cn";
import { JSX } from "react";

// Number of decimals, also for numbers written with an exponent (1e-7)
const decimalPlaces = (value: number) => {
  if (Number.isInteger(value)) return 0;
  const [base, exponent = "0"] = value.toString().split("e");
  const decimals = base.split(".")[1]?.length ?? 0;
  return Math.max(0, decimals - Number(exponent));
};

export const AnimatedCount = <T extends keyof JSX.IntrinsicElements>(props: AnimatedCountProps<T>) => {
  const {
    as = "span",
    className,
    count,
    duration = 2000,
    slowDownAt,
    slowDownFactor = 10,
    start = 0,
    step = 1,
    style,
    ...rest
  } = props;

  const [currentCount, setCurrentCount] = React.useState(start);
  // `from` is where the current animation started: `start`, or the number shown when `count` changed
  const [animation, setAnimation] = React.useState({ start, count, from: start });

  // A new `start` starts the animation again, a new `count` animates from the number shown to it
  if (start !== animation.start) {
    setAnimation({ start, count, from: start });
    setCurrentCount(start);
  } else if (count !== animation.count) {
    setAnimation({ start, count, from: currentCount });
  }

  const { from } = animation;

  // Show every number with the same decimals, and round each step to them
  const precision = Math.max(decimalPlaces(from), decimalPlaces(count), decimalPlaces(step));

  React.useEffect(() => {
    // Always count toward `count`, whatever the sign of `step`
    const direction = Math.sign(count - currentCount);
    if (direction === 0) return;

    // Each animation takes `duration`, from the number it started at to `count`
    let interval = duration / (Math.abs(count - from) / Math.abs(step));

    // Start with the base interval and increase it only when near the end
    if (slowDownAt) {
      const isSlowed = direction > 0 ? currentCount >= slowDownAt : currentCount <= slowDownAt;
      if (isSlowed) interval *= slowDownFactor;
    }

    const timer = setTimeout(() => {
      setCurrentCount((prev) => {
        const next = Number((prev + direction * Math.abs(step)).toFixed(precision));
        // Stop at `count`, also when `step` doesn't divide the distance to it
        return direction > 0 ? Math.min(next, count) : Math.max(next, count);
      });
    }, interval);

    // Clean up the timeout
    return () => clearTimeout(timer);
  }, [count, currentCount, duration, from, precision, slowDownAt, slowDownFactor, step]);

  const Element = as as React.ElementType;

  //prevent layout shift by setting width to the max number of characters, every number shown is between `from` and `count`
  const styles = {
    width: `${Math.max(from.toFixed(precision).length, count.toFixed(precision).length)}ch`
  };

  return (
    <Element
      {...rest}
      style={{ ...styles, ...style }}
      className={cn("inline-block text-center text-foreground", className)}
    >
      {currentCount.toFixed(precision)}
    </Element>
  );
};

export default AnimatedCount;
