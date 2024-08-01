import type { Meta, StoryObj } from "@storybook/react";

import { Breadcrumbs } from "./Breadcrumbs";

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
 *
 * ## Usage
 * ```
 * <Breadcrumbs
 *    breadcrumbs={[
 *     {
 *       text: "Home",
 *       href: "/",
 *     },
 *     {
 *       text: "Getting started",
 *       href: "/getting-started",
 *     },
 *     {
 *       text: "Installation",
 *       href: "/getting-started/installation",
 *     },
 *   ]}
 * />
 * ```
 */

const meta: Meta<typeof Breadcrumbs> = {
  component: Breadcrumbs,
  title: "Components/Breadcrumbs",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  args: {
    breadcrumbs: [
      {
        text: "Home",
        href: "/",
      },
      {
        text: "Getting started",
        href: "/getting-started",
      },
      {
        text: "Installation",
        href: "/getting-started/installation",
      },
    ],
  },
  render: (props) => <Breadcrumbs {...props} />,
};
