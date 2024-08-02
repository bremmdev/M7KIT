import type { Meta, StoryObj } from "@storybook/react";

import { Breadcrumbs, BreadcrumbItem, BreadcrumbMenu } from "./Breadcrumbs";

/**
 * The `Breadcrumbs` component helps the user to visualize how content has been structured and how to navigate back to previous web pages, and may identify the current location within a series of web pages.
 *
 * ## Design Guidelines
 *
 * I followed the following guidelines while developing the `Breadcrumbs` component. These are mostly based on the [W3C breadcrumb design guidelines](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/examples/breadcrumb/):
 * - Use a `nav` element with a unique label to make it a navigation landmark so that it is easy to locate.
 * - Use an ordered list to provide context to users about a given breadcrumb’s position in a list and of the total number of breadcrumbs.
 * - Prevent screen reader from announcing the visual separators between links.
 * - Add `aria-current="page"` to the last item. This represents the current item within a container or set of related elements.
 * - Color or weight are not used as the only means of conveying it is a link
 *
 * ## Features
 *
 * - Use the asChild prop to render a custom link component instead of an anchor tag
 * - Wrap BreadcrumbItem components in BreadcrumbMenu to create a dropdown menu to hide some breadcrumbs for long breadcrumb lists
 * - isCurrentPage indicates the current page
 * - Choose between different separators: chevron, dash, or slash
 *
 * ## Usage
 *
 * ```
 * <Breadcrumbs>
 *   <BreadcrumbItem href="/">Home</BreadcrumbItem>
 *   <BreadcrumbItem href="/getting-started">Getting started</BreadcrumbItem>
 *   <BreadcrumbItem isCurrentPage>Installation</BreadcrumbItem>
 * </Breadcrumbs
 * ```
 * ### Using a custom Link component
 *
 * Use the `asChild` prop to render a custom link component instead of an anchor tag. This is useful when using frameworks like Next.js and Remix.
 * Only one child is allowed when using the `asChild` prop.
 *
 * ```
 * import Link from "next/link";
 *
 * <Breadcrumbs>
 *    <BreadcrumbItem asChild>
 *      <Link href="/">Home</Link>
 *    </BreadcrumbItem>
 *    <BreadcrumbItem asChild>
 *      <Link href="/getting-started">Getting started</Link>
 *    </BreadcrumbItem>
 *    <BreadcrumbItem isCurrentPage>
 *      Installation
 *    </BreadcrumbItem>
 * </Breadcrumbs>
 *```
 */

const meta: Meta<typeof Breadcrumbs> = {
  component: Breadcrumbs,
  title: "Components/Breadcrumbs",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  render: (props) => (
    <Breadcrumbs {...props}>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/getting-started">Getting started</BreadcrumbItem>
      <BreadcrumbItem isCurrentPage>Installation</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const SlashSeparator: Story = {
  args: {
    separator: "slash",
  },
  render: (props) => (
    <Breadcrumbs {...props}>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/getting-started">Getting started</BreadcrumbItem>
      <BreadcrumbItem isCurrentPage>Installation</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const BreadcrumbWithMenu: Story = {
  render: (props) => (
    <Breadcrumbs {...props}>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbMenu>
        <BreadcrumbItem href="#">Server</BreadcrumbItem>
        <BreadcrumbItem href="/server/overview">Overview</BreadcrumbItem>
      </BreadcrumbMenu>
      <BreadcrumbItem href="/server/overview/routing">Routing</BreadcrumbItem>
      <BreadcrumbItem isCurrentPage>API reference</BreadcrumbItem>
    </Breadcrumbs>
  ),
};
