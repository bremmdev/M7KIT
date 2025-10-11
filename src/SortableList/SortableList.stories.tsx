import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { SortableList } from "./SortableList";
import { SortableListProps } from "./SortableList.types";
import { Cat, Dog, Fish, Rabbit, Squirrel } from "lucide-react";

/**
 * The `SortableList` component allows users to reorder a list of items while maintaining full accessibility
 * for screen reader and keyboard users.
 *
 * It supports two types of interaction:
 * - **Drag-and-drop** for mouse or touch users using native HTML Drag and Drop API
 * - **Keyboard reordering** using arrow keys when "Edit Mode" is enabled (via a toggle button)
 *
 * ## Features
 * - **Accessible keyboard control**: Enter Edit Mode and use the up and down arrow keys to reorder items.
 * - **Screen reader support**: Announces position updates, movement, and mode changes using `aria-live`.
 * - **Dynamic instructions**: Hidden text updates to guide assistive technology users.
 * - **Visual feedback**: The currently dragged item is highlighted for visual clarity.
 * - **Edit Mode toggle**: The Edit Mode button toggles between view and application modes, ensuring both simple display and interactive reordering.
 * - **Customizable layout**: Determines whether the drag handle appears at the start or end of each item via the `handlePosition` prop.
 * - **Optional title and heading level**: Use the `title` and `titleElement` to provide a title of the desired heading level. If not used, using `aria-label` on the component is recommended for accessibility.
 * - **Stable IDs**: Each item is assigned a unique, stable ID using `crypto.randomUUID()` to ensure consistent rendering and behavior.
 * - **Screenreader friendly labels**: When passing React nodes as items, the component extracts text content for better screen reader announcements.
 * - **Callback on reorder**: The `onReorder` prop allows parent components to respond to changes in item order.
 *
 * ## Accessibility
 * The component implements several accessibility best practices:
 *
 * - Uses `role="list"` and `aria-roledescription="Sortable List"` for clear semantics.
 * - When reordering via keyboard, all updates are announced through an `aria-live="assertive"` region.
 * - Including `role="application"` in Edit Mode ensures keyboard focus and arrow key overrides work properly in screen readers.
 * - The Edit Mode toggle button allows users to easily enter or exit keyboard reordering.
 * - Escape key exits Edit Mode and returns focus to the toggle button.
 * - Hidden instructions (`aria-describedby`) explain how to operate the list in edit mode.
 * - Focus trap within the list when in Edit Mode to prevent focus loss.
 *
 * ## Usage
 * ```tsx
 * import { SortableList } from "./SortableList";
 *
 * const items = ["Banana", "Apple", "Orange", "Strawberry"];
 *
 * export function Example() {
 *   const handleReorder = (newOrder: string[]) => {
 *     console.log("New order:", newOrder);
 *   };
 *
 *   return (
 *     <SortableList
 *       title="Favorite Fruits"
 *       titleElement="h3"
 *       items={items}
 *       onReorder={handleReorder}
 *       handlePosition="start"
 *     />
 *   );
 * }
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
  <div className="relative flex flex-col items-center my-8">
    <SortableList {...props} className="w-96" />
  </div>
);

export const Default: Story = {
  args: {
    items: ["Apple", "Banana", "Mango", "Orange", "Pineapple"],
    onReorder: action("onReorder"),
    "aria-label": "Sortable list of fruits",
  },
  render: (props) => render(props),
};

export const WithTitle: Story = {
  args: {
    title: "Favorite Fruits",
    titleElement: "h3",
    items: ["Apple", "Banana", "Mango", "Orange", "Pineapple"],
    onReorder: action("onReorder"),
  },
  render: (props) => render(props),
};

export const HandleAtEnd: Story = {
  args: {
    title: "Favorite Fruits",
    titleElement: "h3",
    handlePosition: "end",
    items: ["Apple", "Banana", "Mango", "Orange", "Pineapple"],
    onReorder: action("onReorder"),
  },
  render: (props) => render(props),
};

export const WithReactNodes: Story = {
  args: {
    items: [
      <span className="flex items-center gap-2" key="cat">
        Cat <Cat aria-hidden="true" />
      </span>,
      <span className="flex items-center gap-2" key="dog">
        Dog <Dog aria-hidden="true" />
      </span>,
      <span className="flex items-center gap-2" key="fish">
        Fish <Fish aria-hidden="true" />
      </span>,
      <span className="flex items-center gap-2" key="rabbit">
        Rabbit <Rabbit aria-hidden="true" />
      </span>,
      <span className="flex items-center gap-2" key="squirrel">
        Squirrel <Squirrel aria-hidden="true" />
      </span>,
    ],
    onReorder: action("onReorder"),
    "aria-label": "Sortable list of animals with icons",
  },
  render: (props) => render(props),
};

export const WithNestedReactNodes: Story = {
  args: {
    items: [
      <div key="item1">
        This is a <em>nested</em> React node
      </div>,
      <div key="item2">
        This is another <em>nested</em> React node
      </div>,
      <div key="item3">
        Yet another <em>nested</em> React node
      </div>,
    ],
    onReorder: action("onReorder"),
    "aria-label": "Sortable list of nested React nodes",
  },
  render: (props) => render(props),
};
