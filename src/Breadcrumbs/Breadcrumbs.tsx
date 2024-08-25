import React, { useEffect } from "react";
import {
  BreadcrumbProps,
  BreadcrumbItemProps,
  BreadcrumbMenuProps,
} from "./Breadcrumbs.types";
import { cn } from "../utils/cn";
import { ChevronRight, Ellipsis, Minus, Slash } from "lucide-react";
import { useOnClickOutside } from "../_hooks/useOnClickOutside";

const BreadcrumbSeparator = ({
  separator,
}: {
  separator: BreadcrumbProps["separator"];
}) => {
  const separatorIcons = {
    chevron: <ChevronRight size={16} />,
    dash: <Minus size={16} />,
    slash: <Slash size={16} />,
  };

  return separatorIcons[separator || "chevron"];
};

export const BreadcrumbMenu = (props: BreadcrumbMenuProps) => {
  const [show, setShow] = React.useState(false);
  const menuRef = React.useRef<HTMLUListElement>(null);
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  useOnClickOutside(menuButtonRef, () => setShow(false));
  const { children, className, ...rest } = props;

  function handleMenuClick() {
    setShow((prev) => !prev);
  }

  function handleMenuKeydown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setShow(false);
      menuButtonRef.current?.focus();
    }

    if (e.key === "Tab") {
      const isFirstElement =
        document.activeElement === menuRef.current?.querySelector("a");
      const isLastElement =
        document.activeElement ===
        menuRef.current?.querySelector("a:last-child");

      // Close menu when tabbing out of the menu
      if ((isFirstElement && e.shiftKey) || (isLastElement && !e.shiftKey)) {
        setShow(false);
      }
    }

    // focus the next link is there is one
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const sibling =
        e.key === "ArrowDown"
          ? document.activeElement?.parentElement?.nextElementSibling
          : document.activeElement?.parentElement?.previousElementSibling;
      const nextLink = sibling?.querySelector("a") as HTMLAnchorElement;
      if (nextLink) nextLink.focus();
    }
  }

  //focus the first link when the menu is opened
  useEffect(() => {
    if (show) {
      menuRef.current && menuRef.current.querySelector("a")?.focus();
    }
  }, [show]);

  return (
    <div
      className={cn("flex gap-2 items-center relative", className)}
      {...rest}
    >
      <button
        className="focus-ring"
        id="breadcrumb-list-button"
        aria-label="additional breadcrumbs"
        aria-expanded={show}
        ref={menuButtonRef}
        onClick={handleMenuClick}
      >
        <Ellipsis />
      </button>

      <ul
        ref={menuRef}
        onKeyDown={handleMenuKeydown}
        aria-labelledby="breadcrumb-list-button"
        id="breadcrumb-list"
        className={cn(
          "absolute top-8 bg-clr-bg left-0 border border-clr-border rounded-md flex flex-col [&_a]:no-underline [&_a]:py-2 [&_a]:px-4 [&_a:hover]:bg-clr-accent-muted [&_a:hover]:rounded-md [&_a]:focus-ring-inner [&_a]:block",
          {
            hidden: !show,
          }
        )}
      >
        {React.Children.map(children, (child, idx) => {
          return (
            <li key={idx}>
              {child}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const BreadcrumbItem = (props: BreadcrumbItemProps) => {
  const {
    asChild = false,
    children,
    className,
    isCurrentPage = false,
    href,
    ...rest
  } = props;
  const isLink = href ? true : false;

  const linkClassNames = cn(
    "text-clr-text font-medium underline underline-offset-4 p-1 hover:text-clr-accent focus-ring",
    className
  );

  // If asChild is true, we want to render a custom link component instead of an anchor tag
  // in this case,BreadcrumbItem can only have one child
  if (asChild) {
    if (!React.isValidElement(children)) {
      console.warn(
        "BreadcrumbItem can only have one child when using asChild prop"
      );
      return null;
    }
    // Clone the custom Link element and pass the props and classes
    return React.cloneElement(children as React.ReactElement, {
      className: linkClassNames,
      "aria-current": isCurrentPage ? "page" : undefined,
      ...rest,
    });
  }

  return isLink ? (
    <a
      href={href}
      className={linkClassNames}
      aria-current={isCurrentPage ? "page" : undefined}
      {...rest}
    >
      {children}
    </a>
  ) : (
    <span aria-current={isCurrentPage ? "page" : undefined}>{children}</span>
  );
};

export const Breadcrumbs = ({
  children,
  className,
  separator = "chevron",
  ...rest
}: BreadcrumbProps) => {
  const ariaLabel = rest["aria-label"] || "breadcrumbs";

  return (
    <nav aria-label={ariaLabel} className="p-4">
      <ol
        className={cn(
          "flex gap-2 items-center flex-wrap text-clr-text",
          className
        )}
      >
        {React.Children.map(children, (child, idx) => {
          return (
            <li className="flex items-center gap-2" key={idx}>
              {child}
              {idx !== React.Children.count(children) - 1 && (
                <BreadcrumbSeparator separator={separator} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
