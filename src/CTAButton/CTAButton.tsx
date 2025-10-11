import React from "react";
import { CTAButtonProps } from "./CTAButton.types";
import { cn } from "../utils/cn";
import { MoveRight } from "lucide-react";

export const CTAButton = (props: CTAButtonProps) => {
  const { children, className, href, ...rest } = props;

  const CTA = href
    ? ("a" as React.ElementType)
    : ("button" as React.ElementType);

  return (
    <CTA
      className={cn(
        "group overflow-hidden cursor-pointer relative flex gap-2 border-none justify-center items-center px-6 py-2.5 bg-accent text-foreground-inverse rounded-md font-medium w-fit transition-colors focus-ring hover:ring-2 hover:ring-offset-2 hover:ring-offset-current hover:ring-accent",
        className
      )}
      href={href}
      {...rest}
    >
      {children}
      <MoveRight className="size-5 group-hover:translate-x-1 transition-transform ease-in-out" />
      <span className="inline-block absolute -top-4 -bottom-4 -left-[50%] bg-white opacity-50 w-5 z-10 rotate-35 transition-all group-hover:left-[125%] duration-1000" />
    </CTA>
  );
};
