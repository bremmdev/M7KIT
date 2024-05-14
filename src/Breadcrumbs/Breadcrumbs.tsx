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
        className="text-sky-700 dark:text-sky-300 font-medium underline underline-offset-4 focus-visible:outline-sky-700 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 dark:focus-visible:outline-amber-300 p-1"
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

export const Breadcrumbs = ({ breadcrumbs, className, ...rest }: BreadCrumbProps) => {
  const ariaLabel = rest["aria-label"] || "breadcrumbs";

  return (
    <nav aria-label={ariaLabel}>
      <ol className={cn("flex gap-2 items-center flex-wrap text-slate-950 dark:text-slate-200", className)}>
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
