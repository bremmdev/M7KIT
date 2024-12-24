import React, { type JSX } from "react";
import { TextAnimationProps } from "./TextAnimation.types";
import { cn } from "../utils/cn";

export const TextAnimation = <T extends keyof JSX.IntrinsicElements = "p">(
  props: TextAnimationProps<T>
) => {
  const {
    animation = "fade-in-blur",
    as = "p",
    children,
    className,
    delay = 100,
    per = "word",
    ...rest
  } = props;

  const Element = as as React.ElementType;

  if (typeof children !== "string") {
    throw new Error("TextAnimation only accepts a string as children");
  }

  const animationClass =
    {
      "fade-in": "animate-fade-in opacity-0",
      "fade-in-blur": "animate-fade-in-blur opacity-0",
      "slide-down": "animate-slide-down opacity-1",
      "slide-up": "animate-slide-up opacity-1",
    }[animation as string] || "animate-fade-in opacity-0";

  //divide the children into words and characters
  const words = children
    .split(" ")
    .map((word, idx, arr) => (idx !== arr.length - 1 ? `${word} ` : `${word}`));

  const items = per === "word" ? words : children.split("");

  return (
    <Element
      className={cn("whitespace-pre-wrap text-clr-text", className)}
      {...rest}
    >
      {items.map((i, idx) => {
        return (
          <span
            key={idx}
            style={{ animationDelay: `${idx * delay}ms` }}
            className={`inline-block ${animationClass}`}
          >
            {i}
          </span>
        );
      })}
    </Element>
  );
};
