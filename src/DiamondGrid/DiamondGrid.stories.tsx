import type { Meta, StoryObj } from "@storybook/react";

import { DiamondGrid } from "./DiamondGrid";

import image001 from "../_data/images/picture001.jpg";
import image002 from "../_data/images/picture002.jpg";
import image003 from "../_data/images/picture003.jpg";
import image004 from "../_data/images/picture004.jpg";
import image005 from "../_data/images/picture005.jpg";
import image006 from "../_data/images/picture006.jpg";
import image007 from "../_data/images/picture007.jpg";
import image008 from "../_data/images/picture008.jpg";
import image009 from "../_data/images/picture009.jpg";
import image010 from "../_data/images/picture010.jpg";
import image011 from "../_data/images/picture011.jpg";
import image012 from "../_data/images/picture012.jpg";
import image013 from "../_data/images/picture013.jpg";

/**
 * The `DiamondGrid` component is used to create a gallery layout. It arranges all children in a grid layout and creates diamond shapes items using a clip-path. Hovering over the items will reveal the full image.
 *
 *
 * ## Features
 * - Supports custom item width
 * - Supports an infinite number of items
 * - Supports custom number of items in each group
 *
 * ## Known limitations
 * - To preverse the layout, the items are moved to the left by half of the item width. This may cause the items to overflow the container if the item width is too large
 * - Works best with square images, non-square images are clipped to fit the diamond shape with the `object-cover` CSS property and aspect ratio 1/1
 *
 * ## Usage
 * ```
 * <DiamondGrid itemWidth={300}>
 *  <img src={image001} alt="image001" width={300} height={300} />
 *  <img src={image002} alt="image002" width={300} height={300} />
 *  <img src={image003} alt="image003" width={300} height={300} />
 *  <img src={image004} alt="image004" width={300} height={300} />
 * /DiamondGrid>
 * ```
 */

const meta: Meta<typeof DiamondGrid> = {
  component: DiamondGrid,
  title: "Components/DiamondGrid",
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof DiamondGrid>;

export const Default: Story = {
  args: {
    itemWidth: 200,
    maxItemsInGroup: 2,
  },
  render: (props) => (
    <div className="dark:text-slate-50 p-2">
      <DiamondGrid {...props}>
        <img src={image001} alt="image001" width={300} height={300} />
        <img src={image002} alt="image002" width={300} height={300} />
        <img src={image003} alt="image003" width={300} height={300} />
        <img src={image004} alt="image004" width={300} height={300} />
        <img src={image005} alt="image005" width={300} height={300} />
        <img src={image006} alt="image006" width={300} height={300} />
        <img src={image007} alt="image007" width={300} height={300} />
        <img src={image008} alt="image008" width={300} height={300} />
      </DiamondGrid>
    </div>
  ),
};

export const ThreeRows: Story = {
  args: {
    itemWidth: 200,
    maxItemsInGroup: 3,
  },
  render: (props) => (
    <div className="dark:text-slate-50 p-2">
      <DiamondGrid {...props}>
        <img src={image001} alt="image001" width={300} height={300} />
        <img src={image002} alt="image002" width={300} height={300} />
        <img src={image003} alt="image003" width={300} height={300} />
        <img src={image004} alt="image004" width={300} height={300} />
        <img src={image005} alt="image005" width={300} height={300} />
        <img src={image006} alt="image006" width={300} height={300} />
        <img src={image007} alt="image007" width={300} height={300} />
        <img src={image008} alt="image008" width={300} height={300} />
        <img src={image009} alt="image009" width={300} height={300} />
        <img src={image010} alt="image010" width={300} height={300} />
        <img src={image011} alt="image011" width={300} height={300} />
        <img src={image012} alt="image012" width={300} height={300} />
        <img src={image013} alt="image013" width={300} height={300} />
      </DiamondGrid>
    </div>
  ),
};
