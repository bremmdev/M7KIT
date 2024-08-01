import { BreadCrumbProps, BreadCrumbType } from "./Breadcrumbs.types";
import { cn } from "../utils/cn";
import { ChevronRight } from "lucide-react";

const Breadcrumb = ({
  breadcrumb,
  isLast,
}: {
  breadcrumb: BreadCrumbType;
  isLast: boolean;
}) => {
  const { text, href } = breadcrumb;

  const ariaCurrent = isLast ? "page" : undefined;

  return !isLast ? (
    <li className="flex items-center gap-2">
      <a
        href={href}
        className="text-clr-text font-medium underline underline-offset-4 outline-accent p-1 hover:text-clr-accent"
        aria-current={ariaCurrent}
      >
        {text}
      </a>
      <ChevronRight size={16} />
    </li>
  ) : (
    <li aria-current={ariaCurrent}>{text}</li>
  );
};

export const Breadcrumbs = ({
  breadcrumbs,
  className,
  ...rest
}: BreadCrumbProps) => {
  const ariaLabel = rest["aria-label"] || "breadcrumbs";

  return (
    <nav aria-label={ariaLabel} className="p-4">
      <ol
        className={cn(
          "flex gap-2 items-center flex-wrap text-clr-text",
          className
        )}
      >
        {breadcrumbs?.map((breadcrumb, index) => (
          <Breadcrumb
            key={index}
            breadcrumb={breadcrumb}
            isLast={index == breadcrumbs.length - 1}
          />
        ))}
      </ol>
    </nav>
  );
};
