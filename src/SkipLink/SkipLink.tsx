import { SkipLinkProps } from "./SkipLink.types";
import { cn } from "../utils/cn";

export const SkipLink = ({
  text = "Skip to content",
  targetId = "main",
  className,
  ...props
}: SkipLinkProps) => {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        "w-fit absolute visually-hidden z-50 bg-slate-200 dark:bg-slate-900 px-4 py-2 text-slate-950 dark:text-slate-200 font-medium focus-visible:outline-sky-700 focus-visible:outline-8 focus-visible:outline-offset-4",
        className
      )}
      {...props}
    >
      {text}
    </a>
  );
};
