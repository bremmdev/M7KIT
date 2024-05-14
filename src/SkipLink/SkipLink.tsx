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
        "w-fit absolute visually-hidden top-4 left-4 z-50 bg-slate-200 dark:bg-slate-900 px-4 py-2 text-slate-950 dark:text-slate-200 font-medium outline-none focus-visible:outline-sky-700 dark:focus-visible:outline-amber-400 focus-visible:outline-2 focus-visible:outline-offset-4 dark:focus-visible:outline-offset-4",
        className
      )}
      {...rest}
    >
      {text}
    </a>
  );
};
