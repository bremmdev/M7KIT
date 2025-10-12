import type { Meta, StoryObj } from "@storybook/react-vite";

import { GalleryStack } from "./GalleryStack";

import image001 from "../_data/images/picture001.jpg";
import image002 from "../_data/images/picture002.jpg";
import image003 from "../_data/images/picture003.jpg";
import image004 from "../_data/images/picture004.jpg";

/**
 * The `GalleryStack` component is used to create a gallery layout in the form of a stack. It arranges all children on top of each other in a stack and allows the user to click the stack to rotate the items.
 *
 *
 * ## Features
 * - Supports custom rotation amount
 * - Supports reversed order of items
 * - Supports custom animation duration
 * - Navigation buttons to rotate the stack
 *
 * ## Known limitations
 * - The component expects children to be an array of at items. If children is not an array, it will throw an error
 *
 * ## Usage
 * ```
 * <GalleryStack
 *  reversed={false}
 *  rotationAmount={10}
 *  animationDuration={2000}
 * >
 *   <img src={image001} alt="image001" width={300} height={300} />
 *   <img src={image002} alt="image002" width={300} height={300} />
 *   <img src={image003} alt="image003" width={300} height={300} />
 *   <img src={image004} alt="image004" width={300} height={300} />
 * </GalleryStack>
 * ```
 */

const meta: Meta<typeof GalleryStack> = {
  component: GalleryStack,
  title: "Components/GalleryStack",
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof GalleryStack>;

export const Default: Story = {
  args: {
    reversed: false,
  },
  render: (props) => (
    <GalleryStack {...props}>
      <img src={image001} alt="image001" width={300} height={300} />
      <img src={image002} alt="image002" width={300} height={300} />
      <img src={image003} alt="image003" width={300} height={300} />
      <img src={image004} alt="image004" width={300} height={300} />
    </GalleryStack>
  ),
};
