import type { Meta, StoryObj } from "@storybook/react";

import image from "./data/picture001.jpg";

import { Masonry } from "./Masonry";

/**
 * The `Masonry` component is used to create a masonry layout. It arranges its children using a nested flexbox layout. A row of columns is created using flexbox and each flex column is filled with the children based on the `columnOrder` prop.
 *
 * ## Features
 * - Supports 1-6 columns
 * - Supports horizontal and vertical column order
 * - Supports custom spacing
 * - Items can have different aspect ratios or sizes
 *
 * ## Known limitations
 * - There is an empty column when there is no remainder from the division and we have an extra column to fill, i.e when we have 16 items and the user wants 5 columns. In this situation
 *   we get 4 columns with 4 items and 1 column with 0 items. As a partial workaround, the last column is filled with an item from the previous column. **Applicable to vertical column order only**.
 * - Math.round() is used to calculate the number of items per column. This can lead to uneven columns when the number of items is not divisible by the number of columns. This is most noticeable when there are only a few items and many columns. **Applicable to vertical column order only**.
 *
 * ## Usage
 * ```
 * <Masonry
 *    columns={3}
 *    spacing={16}
 * >{children}
 * </Masonry>
 * ```
 */

const meta: Meta<typeof Masonry> = {
  component: Masonry,
  title: "Components/Masonry",
  tags: ["autodocs"],
};

const MasonryImage = ({ idx }: { idx: number }) => (
  <div className="relative">
    <img
      src={image}
      style={{ aspectRatio: Math.random() * (1.25 - 0.75) + 0.75 }}
      className="w-full col-span-1 rounded-xl"
    />
    <span className="absolute text-xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      Image {idx + 1}
    </span>
  </div>
);

const MasonryData = Array(12)
  .fill(0)
  .map((_, idx) => <MasonryImage idx={idx} key={idx} />);

export default meta;

type Story = StoryObj<typeof Masonry>;

export const Horizontal: Story = {
  args: {
    columns: 3,
  },
  render: (props) => (
    <div className="bg slate-50 dark:bg-slate-900 dark:text-slate-50 p-2">
      <Masonry {...props}>{MasonryData}</Masonry>
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    columns: 4,
    columnOrder: "vertical",
  },
  render: (props) => (
    <div className="bg slate-50 dark:bg-slate-900 dark:text-slate-50 p-2">
      <Masonry {...props}>{MasonryData}</Masonry>
    </div>
  ),
};
