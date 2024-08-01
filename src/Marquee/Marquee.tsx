import React from "react";
import { MarqueeProps } from "./Marquee.types";
import { cn } from "../utils/cn";

export const Marquee = (props: MarqueeProps) => {
  const {
    animationDuration = 5000,
    children,
    className,
    direction = "left",
    pauseOnHover = true,
    ...rest
  } = props;

  if (React.Children.count(children) < 2) {
    throw new Error("Marquee component requires at least 2 children to work.");
  }

  //need to duplicate the children to create the marquee effect
  const duplicatedChildren = [children, children];

  const isVertical = direction === "up" || direction === "down";
  const isReversed = direction === "right" || direction === "down";

  const animationClass = isVertical
    ? "animate-marquee-vertical"
    : "animate-marquee-horizontal";

  return (
    <div
      {...rest}
      className={cn(
        "flex overflow-hidden gap-8 p-8 group bg-clr-bg",
        className,
        {
          "flex-col w-fit": isVertical,
          "h-fit": !isVertical,
        }
      )}
    >
      {duplicatedChildren.map((c, idx) => {
        return (
          <div
            key={idx}
            aria-hidden={idx === 0 ? "false" : "true"}
            className={cn(
              `flex justify-center gap-8 ${animationClass} shrink-0`,
              {
                "group-hover:[animation-play-state:paused]": pauseOnHover,
                "flex-col": isVertical,
              }
            )}
            style={{
              animationDuration: `${animationDuration}ms`,
              animationDirection: isReversed ? "reverse" : "normal",
            }}
          >
            {c}
          </div>
        );
      })}
    </div>
  );
};
