import { SkipLinkProps } from "./SkipLink.types";
import { cn } from "../utils/cn";

export const SkipLink = ({
  text = "Skip to content",
  targetId = "main",
  className,
  ...rest
}: SkipLinkProps) => {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        "w-fit absolute visually-hidden top-4 left-4 z-50 bg-clr-accent/10 px-4 py-2 text-clr-text font-medium focus-ring",
        className
      )}
      {...rest}
    >
      {text}
    </a>
  );
};
