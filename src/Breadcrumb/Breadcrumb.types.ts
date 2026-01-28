import React from "react";

export type BreadcrumbProps = React.ComponentPropsWithRef<"nav"> & {
  /**
   * The separator to be used in breadcrumb
   * @default "chevron"
   */
  separator?: "chevron" | "dash" | "slash";
};

export type BreadcrumbMenuProps = React.ComponentPropsWithRef<"div">;

export type BreadcrumbItemProps = React.ComponentPropsWithRef<"a"> & {
  /**
   * Render custom link component instead of an anchor tag
   * @default false
   */
  asChild?: boolean;
  /**
   * Whether the item represents the current page.
   * @default false
   * Automatically set to true when using BreadcrumbCurrentItem instead of BreadcrumbItem
   * */
  isCurrentPage?: boolean;
};
