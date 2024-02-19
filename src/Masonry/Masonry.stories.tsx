import type { Meta, StoryObj } from "@storybook/react";

import { Masonry } from "./Masonry";

/**
 * The `Masonry` component is used to create a masonry layout. It arranges its children using a nested flexbox layout. A row of columns is created using flexbox and each flex column is filled with the children based on the `columnOrder` prop.
 *
 * ## Features
 * - Supports 1-6 columns
 * - Supports horizontal and vertical column order
 * - Supports custom spacing
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
      src={`https://picsum.photos/seed/picsum/${
        Math.floor(Math.random() * 400) + 200
      }/${Math.floor(Math.random() * 400) + 200}?grayscale`}
      className="w-full col-span-1 rounded-xl"
    />
    <span className="absolute text-xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      Image {idx + 1}
    </span>
  </div>
);

const MasonryData = Array(10)
  .fill(0)
  .map((_, idx) => <MasonryImage idx={idx} key={idx} />);

export default meta;

type Story = StoryObj<typeof Masonry>;

export const Horizontal: Story = {
  args: {
    columns: 5,
  },
  render: (props) => (
    <div className="bg slate-50 dark:bg-slate-900 dark:text-slate-50 p-2">
      <Masonry {...props}>{MasonryData}</Masonry>
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    columns: 3,
    columnOrder: "vertical",
  },
  render: (props) => (
    <div className="bg slate-50 dark:bg-slate-900 dark:text-slate-50 p-2">
      <Masonry {...props}>{MasonryData}</Masonry>
    </div>
  ),
};
