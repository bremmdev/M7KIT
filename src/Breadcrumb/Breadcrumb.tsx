"use client";

import React, { useEffect } from "react";
import {
  BreadcrumbProps,
  BreadcrumbItemProps,
  BreadcrumbMenuProps,
} from "./Breadcrumb.types";
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
  useOnClickOutside(
    menuButtonRef as React.RefObject<HTMLButtonElement | null>,
    handleOnClickOutside
  );
  const { children, className, ...rest } = props;

  function handleMenuClick() {
    setShow((prev) => !prev);
  }

  function handleOnClickOutside(e: Event | React.KeyboardEvent) {
    if (!show) return;
    e.preventDefault();
    setShow(false);
    menuButtonRef.current?.focus();
  }

  function handleMenuKeydown(e: React.KeyboardEvent) {
    if (e.key === "Tab") {
      e.preventDefault();
      return;
    }

    // Close menu on escape key and focus the menu button
    if (e.key === "Escape") {
      handleOnClickOutside(e);
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

  const menuId = React.useId();

  return (
    <div
      className={cn("flex gap-2 items-center relative", className)}
      {...rest}
    >
      <button
        className="focus-ring"
        type="button"
        id={`${menuId}-trigger`}
        aria-haspopup="menu"
        aria-controls={`${menuId}-content`}
        aria-expanded={show}
        aria-label="additional breadcrumbs"
        ref={menuButtonRef}
        onClick={handleMenuClick}
      >
        <Ellipsis />
      </button>
      <ul
        ref={menuRef}
        id={`${menuId}-content`}
        role="menu"
        aria-labelledby={`${menuId}-trigger`}
        onKeyDown={handleMenuKeydown}
        className={cn(
          "w-max absolute top-8 bg-surface-subtle left-0 border border-neutral rounded-md flex flex-col [&_a]:no-underline [&_a]:py-2 [&_a]:px-4 [&_a:hover]:rounded-md [&_a]:focus-ring-inner [&_a]:block [&_a:focus]:relative",
          {
            hidden: !show,
          }
        )}
      >
        {React.Children.map(children, (child, idx) => {
          return (
            <li key={idx} role="menuitem">
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
    isCurrentPage,
    href,
    ...rest
  } = props;

  const isLink = href ? true : false;

  const linkClassNames = cn(
    "text-foreground font-medium underline underline-offset-4 p-1 hover:text-accent focus-ring cursor-pointer",
    className
  );

  const spanClassNames = cn("text-foreground", className);

  // If asChild is true, we want to render a custom link component instead of an anchor tag
  // in this case, BreadcrumbItem can only have one child
  if (asChild) {
    if (!React.isValidElement(children)) {
      console.warn(
        "BreadcrumbItem can only have one child when using asChild prop"
      );
      return null;
    }

    // Clone the custom Link element and pass the props and classes
    return React.cloneElement(children as React.ReactElement<any>, {
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
    <span
      className={spanClassNames}
      aria-current={isCurrentPage ? "page" : undefined}
    >
      {children}
    </span>
  );
};

export const BreadcrumbCurrentItem = (props: BreadcrumbItemProps) => {
  return <BreadcrumbItem {...props} isCurrentPage />;
};

export const Breadcrumb = ({
  children,
  className,
  separator = "chevron",
  ...rest
}: BreadcrumbProps) => {
  const ariaLabel = rest["aria-label"] || "breadcrumb";

  return (
    <nav aria-label={ariaLabel} className="p-4">
      <ol
        className={cn(
          "flex gap-2 items-center flex-wrap text-foreground",
          className
        )}
      >
        {React.Children.map(children, (child, idx) => {
          const isLast = idx === React.Children.count(children) - 1;
          return (
            <li className="flex items-center gap-2" key={idx}>
              {child}
              {!isLast && <BreadcrumbSeparator separator={separator} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
