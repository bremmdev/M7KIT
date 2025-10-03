import type { Meta, StoryObj } from "@storybook/react";

import { SortableList } from "./SortableList";
import { SortableListProps } from "./SortableList.types";
import { Cat, Dog, Fish, Rabbit, Squirrel } from "lucide-react";

/**
 * The `SkipLink` component provides a way for keyboard users to skip over navigation links and jump directly to the main content or specific sections of a page.
 * This is particularly useful for people who use screen readers or can't use a mouse.
 * The component accepts a link with a text and target id.
 * The target ID should correspond to the id of the HTML element that the link should skip to.
 * The SkipLink component is visually hidden by default, but will be visible when focused.
 * The component is positioned absolutely at the top of the page, so it will be the first thing that keyboard users tab to.
 * The position can be changed by passing a className prop or by using inline styles.
 *
 *
 * ## Usage
 * ```
 * <SkipLink
 *    text="Skip to content"
 *    targetId="main"
 * />
 * ```
 */

const meta: Meta<typeof SortableList> = {
  component: SortableList,
  title: "Components/SortableList",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SortableList>;

const render = (props: SortableListProps) => (
  <div className="relative flex flex-col text-clr-text items-center my-8">
    <SortableList {...props} className="w-96" />
  </div>
);

export const Default: Story = {
  args: {
    items: [],
    onReorder: (newOrder) => {
      console.log("New order:", newOrder);
    },
  },
  render: (props) => render(props),
};

export const WithReactNodes: Story = {
  args: {
    items: [
      <span className="flex items-center gap-2" key="cat">
        Cat <Cat />
      </span>,
      <span className="flex items-center gap-2" key="dog">
        Dog <Dog />
      </span>,
      <span className="flex items-center gap-2" key="fish">
        Fish <Fish />
      </span>,
      <span className="flex items-center gap-2" key="rabbit">
        Rabbit <Rabbit />
      </span>,
      <span className="flex items-center gap-2" key="squirrel">
        Squirrel <Squirrel />
      </span>,
    ],
    onReorder: (newOrder) => {
      console.log("New order:", newOrder);
    },
  },
  render: (props) => render(props),
};
