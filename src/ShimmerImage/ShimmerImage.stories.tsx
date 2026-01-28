import type { Meta, StoryObj } from "@storybook/react-vite";
import { ShimmerImage } from "./ShimmerImage";
import profilePicture from "../_data/images/profile001.jpg";

/**
 * The `ShimmerImage` is a wrapper for an image that has a 'shimmer' or 'shine' effect and it is useful for showcasing images in a more visually appealing way.
 *
 * Some use cases include:
 * - Placeholder images while the actual image is loading.
 * - Profile pictures or avatars.
 *
 * ## Usage (React)
 * ```
 * <ShimmerImage
 *   src={profilePicture}
 *   width={300}
 *   alt="profile picture"
 * />
 * ```
 *
 * ## Usage (Next.js)
 *
 * Imported images in Next.js are of type `StaticImageData` so we need to access the `src` property to get the actual image source.
 *
 * ```
 * import profilePicture from "../_data/images/picture001.jpg";
 *
 * <ShimmerImage
 *   src={profilePicture.src}
 *   width={300}
 *   alt="profile picture"
 * />
 *
 * ```
 */

const meta: Meta<typeof ShimmerImage> = {
  component: ShimmerImage,
  title: "Components/ShimmerImage",
  tags: ["autodocs"]
};
export default meta;

type Story = StoryObj<typeof ShimmerImage>;

export const Default: Story = {
  args: {},
  render: (props) => (
    <div className="p-12">
      <ShimmerImage src={profilePicture} width={300} {...props} />
    </div>
  )
};

export const Rounded: Story = {
  args: {
    rounded: true
  },
  render: (props) => (
    <div className="p-12">
      <ShimmerImage src={profilePicture} width={300} {...props} />
    </div>
  )
};
