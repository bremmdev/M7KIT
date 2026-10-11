"use client";

import React from "react";
import { BreadcrumbProps, BreadcrumbItemProps, BreadcrumbMenuProps } from "./Breadcrumb.types";
import { cn } from "../utils/cn";
import { ChevronRight, Ellipsis, Minus, Slash } from "lucide-react";
import { useOnClickOutside } from "../_hooks/useOnClickOutside";

const BreadcrumbSeparator = ({ separator }: { separator: BreadcrumbProps["separator"] }) => {
  const separatorIcons = {
    // The chevron points to the next crumb, so it flips in right-to-left text
    chevron: <ChevronRight size={16} className="rtl:rotate-180" />,
    dash: <Minus size={16} />,
    slash: <Slash size={16} />
  };

  return separatorIcons[separator || "chevron"];
};

/**
 * Hides some items of a long trail behind a `…` button.
 *
 * A disclosure (APG Disclosure Navigation pattern), not an ARIA menu: the hidden items are links to pages, so they stay
 * links in a nested list of the trail. The button only has `aria-expanded` and `aria-controls`.
 */
export const BreadcrumbMenu = (props: BreadcrumbMenuProps) => {
  const [show, setShow] = React.useState(false);
  const disclosureRef = React.useRef<HTMLOListElement>(null);
  const disclosureButtonRef = React.useRef<HTMLButtonElement>(null);
  useOnClickOutside([disclosureRef, disclosureButtonRef], handleOnClickOutside);
  const { children, className, ...rest } = props;

  // toArray drops null, undefined and booleans, so a conditional child isn't counted or rendered as an empty item
  const items = React.Children.toArray(children);
  const label = items.length === 1 ? "1 more breadcrumb" : `${items.length} more breadcrumbs`;

  function handleMenuClick() {
    setShow((prev) => !prev);
  }

  // Only close: the browser focuses what the user clicked
  function handleOnClickOutside() {
    setShow(false);
  }

  // Close when focus moves to something outside the button and the list (WCAG 2.4.11).
  // relatedTarget is null for a click that focused nothing: Safari doesn't focus links and buttons on click.
  // Leave that to the click-outside check, or the list closes before the click reaches the link
  function handleBlur(e: React.FocusEvent) {
    const next = e.relatedTarget;
    const stillInside = disclosureButtonRef.current?.contains(next) || disclosureRef.current?.contains(next);
    if (next && !stillInside) {
      setShow(false);
    }
  }

  function getLinks() {
    return Array.from(disclosureRef.current?.querySelectorAll<HTMLElement>("a[href]") ?? []);
  }

  // Escape closes only the list, not a Drawer or Popover around it, and puts focus on the button so it isn't lost on
  // a hidden link. These are native listeners on the button and the list: React's handlers run at the root, after the
  // native listeners of a surrounding Popover, which would already have closed it
  React.useEffect(() => {
    if (!show) return;
    const elements: Array<HTMLElement | null> = [disclosureButtonRef.current, disclosureRef.current];

    function handleEscape(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      e.preventDefault(); // keeps a surrounding <dialog>, such as the Drawer, open
      e.stopPropagation(); // keeps listeners on surrounding elements, such as the Popover's, from seeing it
      setShow(false);
      disclosureButtonRef.current?.focus();
    }

    for (const el of elements) el?.addEventListener("keydown", handleEscape);
    return () => {
      for (const el of elements) el?.removeEventListener("keydown", handleEscape);
    };
  }, [show]);

  function handleDisclosureButtonKeyDown(e: React.KeyboardEvent) {
    // Optional APG key: Down Arrow on the open button moves into the list
    if (e.key === "ArrowDown" && show) {
      e.preventDefault();
      getLinks()[0]?.focus();
    }
  }

  function handleDisclosureKeyDown(e: React.KeyboardEvent) {
    // Optional APG keys between the links. They add to Tab, they don't replace it, and they don't wrap
    const links = getLinks();
    const current = links.indexOf(document.activeElement as HTMLElement);
    const targets: Record<string, number> = {
      ArrowDown: current + 1,
      ArrowUp: current - 1,
      Home: 0,
      End: links.length - 1
    };
    const target = targets[e.key];
    if (target === undefined) return;

    e.preventDefault();
    links[Math.min(Math.max(target, 0), links.length - 1)]?.focus();
  }

  // Close the list when one of its links is activated: a click, a tap, or Enter on a focused link
  function handleListClick(e: React.MouseEvent<HTMLOListElement>) {
    if (e.target instanceof Element && e.target.closest("a")) {
      setShow(false);
    }
  }

  const disclosureId = React.useId();

  return (
    <div className={cn("flex gap-2 items-center relative", className)} {...rest}>
      <button
        className="focus-ring"
        type="button"
        id={`${disclosureId}-trigger`}
        aria-controls={`${disclosureId}-content`}
        aria-expanded={show}
        aria-label={label}
        ref={disclosureButtonRef}
        onClick={handleMenuClick}
        onKeyDown={handleDisclosureButtonKeyDown}
        onBlur={handleBlur}
      >
        <Ellipsis />
      </button>
      {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: delegated from list inside (keys, blur and link clicks). The links are the interactive elements, so the handlers are valid */}
      <ol
        ref={disclosureRef}
        id={`${disclosureId}-content`}
        aria-labelledby={`${disclosureId}-trigger`}
        hidden={!show}
        onKeyDown={handleDisclosureKeyDown}
        onBlur={handleBlur}
        onClick={handleListClick}
        className={cn(
          "w-max absolute top-8 bg-surface-subtle inset-s-0 border border-neutral rounded-md flex flex-col [&_a]:no-underline [&_a]:py-2 [&_a]:px-4 [&_a]:rounded-md [&_a]:block [&_a:focus]:relative",
          // The links' focus ring goes inside the row, so it doesn't overlap the list's border
          "[&_a:focus-visible]:-outline-offset-2",
          // Forced colors (Windows high contrast): the links in the list have no underline, so unlike the links in the
          // trail they keep a hover style. The row is HighlightText on Highlight while hovered or focused
          "forced-colors:[&_a:hover]:forced-color-adjust-none forced-colors:[&_a:hover]:bg-[Highlight] forced-colors:[&_a:hover]:text-[HighlightText]",
          "forced-colors:[&_a:focus-visible]:forced-color-adjust-none forced-colors:[&_a:focus-visible]:bg-[Highlight] forced-colors:[&_a:focus-visible]:text-[HighlightText] forced-colors:[&_a:focus-visible]:outline-[HighlightText] forced-colors:[&_a:focus-visible]:-outline-offset-4"
        )}
      >
        {items.map((child, idx) => (
          <li key={idx}>{child}</li>
        ))}
      </ol>
    </div>
  );
};

export const BreadcrumbItem = (props: BreadcrumbItemProps) => {
  const { asChild = false, children, className, isCurrentPage, href, ...rest } = props;

  const isLink = !!href;

  const linkClassNames = cn(
    "text-foreground font-medium underline underline-offset-4 p-1 hover:text-accent focus-ring cursor-pointer",
    className
  );

  const spanClassNames = cn("text-foreground", className);

  // If asChild is true, we want to render a custom link component instead of an anchor tag
  // in this case, BreadcrumbItem can only have one child
  if (asChild) {
    if (!React.isValidElement(children)) {
      console.warn("BreadcrumbItem can only have one child when using asChild prop");
      return null;
    }

    // Keep the link's own classes, after ours. A className function, like React Router's NavLink takes,
    // gets our classes added to its result
    const childClassName = (children.props as { className?: unknown }).className;
    const mergedClassName =
      typeof childClassName === "function"
        ? (...args: unknown[]) => cn(linkClassNames, childClassName(...args))
        : cn(linkClassNames, childClassName as string | undefined);

    // Clone the custom Link element and pass the props and classes.
    // aria-current is only set for the current page, so a link's own aria-current isn't removed
    return React.cloneElement(children as React.ReactElement<any>, {
      className: mergedClassName,
      ...(isCurrentPage && { "aria-current": "page" }),
      ...rest
    });
  }

  return isLink ? (
    <a href={href} className={linkClassNames} aria-current={isCurrentPage ? "page" : undefined} {...rest}>
      {children}
    </a>
  ) : (
    <span
      className={spanClassNames}
      aria-current={isCurrentPage ? "page" : undefined}
      {...(rest as React.ComponentPropsWithRef<"span">)}
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
  "aria-label": ariaLabel,
  ...rest
}: BreadcrumbProps) => {
  // toArray drops null, undefined and booleans, so a conditional crumb leaves no empty item or stray separator
  const items = React.Children.toArray(children);

  return (
    <nav
      // The default name only applies when the landmark isn't named by a visible heading through aria-labelledby
      aria-label={ariaLabel || (rest["aria-labelledby"] ? undefined : "breadcrumb")}
      className={cn("p-4", className)}
      {...rest}
    >
      <ol className="flex gap-2 items-center flex-wrap text-foreground">
        {items.map((child, idx) => (
          <li className="flex items-center gap-2" key={idx}>
            {child}
            {idx < items.length - 1 && <BreadcrumbSeparator separator={separator} />}
          </li>
        ))}
      </ol>
    </nav>
  );
};
