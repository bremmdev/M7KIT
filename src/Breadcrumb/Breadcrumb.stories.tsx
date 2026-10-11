import type { Meta, StoryObj } from "@storybook/react-vite";

import { Breadcrumb, BreadcrumbItem, BreadcrumbCurrentItem, BreadcrumbMenu } from "./Breadcrumb";

/**
 * The `Breadcrumb` component helps the user to visualize how content has been structured and how to navigate back to previous web pages, and may identify the current location within a series of web pages.
 *
 * ## Design Guidelines
 *
 * I followed the following guidelines while developing the `Breadcrumb` component. These are mostly based on the [W3C breadcrumb design guidelines](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/examples/breadcrumb/):
 * - Use a `nav` element with a unique label to make it a navigation landmark so that it is easy to locate.
 * - Use an ordered list to provide context to users about a given breadcrumb’s position in a list and of the total number of items.
 * - Prevent screen reader from announcing the visual separators between links.
 * - Add `aria-current="page"` to the last item. This represents the current item within a container or set of related elements.
 * - Color or weight are not used as the only means of conveying it is a link
 *
 * ## Features
 *
 * - Use the asChild prop to render a custom link component instead of an anchor tag
 * - Wrap BreadcrumbItem components in BreadcrumbMenu to hide some items of a long trail behind a `…` button
 * - Choose between different separators: chevron, dash, or slash
 * - Use BreadcrumbCurrentItem to indicate the current page
 * - In forced colors mode (Windows high contrast), a hovered or focused link in a BreadcrumbMenu uses `HighlightText` on `Highlight`
 *
 * ## BreadcrumbMenu
 *
 * `BreadcrumbMenu` is a disclosure, following the [APG Disclosure Navigation Menu](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/), not an ARIA menu:
 * - The hidden items are links to pages, not commands, so they stay links, in an ordered list nested in the trail. ARIA menus are for actions, and would turn them into menu items.
 * - The button has `aria-expanded` and `aria-controls`, and no `aria-haspopup`, which would announce a menu. It is named after the number of hidden items, for example "2 more breadcrumbs".
 * - Screen readers stay in browse mode, so the links can be read and found like any other link on the page.
 *
 * Keyboard:
 * - **Enter** or **Space** on the button shows or hides the list. Focus stays on the button.
 * - **Tab** and **Shift+Tab** move through the button and, while the list is open, its links. The list closes when focus leaves the button and the list, so it never covers what has focus next (WCAG 2.4.11).
 * - **Escape** closes the list and puts focus on the button.
 * - Optional, as in the APG example: **Down Arrow** on the open button moves to the first link. **Down Arrow**, **Up Arrow**, **Home** and **End** move between the links, without wrapping.
 *   These keys are for keyboard users without a screen reader. NVDA and JAWS in browse mode use the arrow keys to read, so the page never gets them: screen reader users read the list with Down Arrow and reach the links with Tab or their links list. To try the arrow keys with NVDA running, switch to focus mode first (NVDA+Space).
 *
 * Activating a link, or a click outside, closes the list. A click outside doesn't move focus: it goes where the user clicked.
 *
 * ```
 * <Breadcrumb>
 *   <BreadcrumbItem href="/">Home</BreadcrumbItem>
 *   <BreadcrumbMenu>
 *     <BreadcrumbItem href="/server">Server</BreadcrumbItem>
 *     <BreadcrumbItem href="/server/overview">Overview</BreadcrumbItem>
 *   </BreadcrumbMenu>
 *   <BreadcrumbItem href="/server/overview/routing">Routing</BreadcrumbItem>
 *   <BreadcrumbCurrentItem>API reference</BreadcrumbCurrentItem>
 * </Breadcrumb>
 * ```
 *
 * ## Usage
 *
 * ```
 * <Breadcrumb>
 *   <BreadcrumbItem href="/">Home</BreadcrumbItem>
 *   <BreadcrumbItem href="/getting-started">Getting started</BreadcrumbItem>
 *   <BreadcrumbCurrentItem>Installation</BreadcrumbItem>
 * </Breadcrumb
 * ```
 * ### Using a custom Link component
 *
 * Use the `asChild` prop to render a custom link component instead of an anchor tag. This is useful when using frameworks like Next.js and Remix.
 * Only one child is allowed when using the `asChild` prop.
 *
 * ```
 * import Link from "next/link";
 *
 * <Breadcrumb>
 *    <BreadcrumbItem asChild>
 *      <Link href="/">Home</Link>
 *    </BreadcrumbItem>
 *    <BreadcrumbItem asChild>
 *      <Link href="/getting-started">Getting started</Link>
 *    </BreadcrumbItem>
 *    <BreadcrumbCurrentItem>
 *      Installation
 *    </BreadcrumbCurrentItem>
 * </Breadcrumb>
 *```
 */

const meta: Meta<typeof Breadcrumb> = {
  component: Breadcrumb,
  title: "Components/Breadcrumb",
  tags: ["autodocs"]
};
export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  render: (props) => (
    <Breadcrumb {...props}>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/getting-started">Getting started</BreadcrumbItem>
      <BreadcrumbCurrentItem>Installation</BreadcrumbCurrentItem>
    </Breadcrumb>
  )
};

export const SlashSeparator: Story = {
  args: {
    separator: "slash"
  },
  render: (props) => (
    <Breadcrumb {...props}>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/getting-started">Getting started</BreadcrumbItem>
      <BreadcrumbCurrentItem>Installation</BreadcrumbCurrentItem>
    </Breadcrumb>
  )
};

export const BreadcrumbWithMenu: Story = {
  render: (props) => (
    <Breadcrumb {...props}>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbMenu>
        <BreadcrumbItem href="#anchor">Server</BreadcrumbItem>
        <BreadcrumbItem href="/server/overview">Overview</BreadcrumbItem>
      </BreadcrumbMenu>
      <BreadcrumbItem href="/server/overview/routing">Routing</BreadcrumbItem>
      <BreadcrumbCurrentItem>API reference</BreadcrumbCurrentItem>
    </Breadcrumb>
  )
};
