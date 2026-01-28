import React from "react";
import { TextRevealProps } from "./TextReveal.types";
import { cn } from "../utils/cn";

export const TextReveal = (props: TextRevealProps) => {
  const { animationDuration = 2000, className, children, defaultVisibleIndex = 0, direction = "down", ...rest } = props;

  const [animatingIdx, setAnimatingIdx] = React.useState(defaultVisibleIndex);

  //after every animationDuration, increment the animatingIdx so the next child is animated
  //and the animations of the previous children are paused/removed
  React.useEffect(() => {
    const interval = setInterval(() => {
      setAnimatingIdx((prev) => {
        if (prev === React.Children.count(children) - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, animationDuration);

    return () => clearInterval(interval);
  }, [animationDuration, children]);

  const animationClass = direction === "up" ? "animate-slide-up-fade" : "animate-slide-down-fade";
  const pausedClass =
    direction === "up" ? "animate-none opacity-0 translate-y-0" : "animate-none opacity-0 -translate-y-full";

  return (
    <div {...rest} className={cn("text-foreground grid *:col-1 *:row-1 w-fit mx-auto text-center", className)}>
      {Array.isArray(children) ? (
        children.map((child, idx) => {
          const styles = {
            animationDuration: `${animationDuration}ms`
          };
          return (
            <div
              key={idx}
              className={cn(`${idx === animatingIdx ? `${animationClass}` : `${pausedClass}`}`)}
              style={styles}
            >
              {child}
            </div>
          );
        })
      ) : (
        <div
          className={cn(`${animationClass}`, className)}
          style={{
            animationDuration: `${animationDuration}ms`,
            animationIterationCount: "infinite"
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
