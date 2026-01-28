import type { Meta, StoryObj } from "@storybook/react-vite";

import { ImageShowcase } from "./ImageShowcase";

import image001 from "../_data/images/picture001.jpg";
import image002 from "../_data/images/picture002.jpg";
import image003 from "../_data/images/picture003.jpg";
import image004 from "../_data/images/picture004.jpg";
import image005 from "../_data/images/picture005.jpg";
import image006 from "../_data/images/picture006.jpg";
import image007 from "../_data/images/picture007.jpg";
import image008 from "../_data/images/picture008.jpg";

/**
 * The `ImageShowcase` component is used to create a gallery layout. It arranges all children in a row. Images will grow to the specified factor on hover, while the other images will shrink and change to grayscale.
 * In order to preserve the layout, the container needs to have a height set. Images are made to fit the container using the `object-cover` CSS property.
 *
 * ```
 * <ImageShowcase growFactor={2}>
 *  <img src={image001} alt="image001" width={300} height={300} />
 *  <img src={image002} alt="image002" width={300} height={300} />
 *  <img src={image003} alt="image003" width={300} height={300} />
 *  <img src={image004} alt="image004" width={300} height={300} />
 * </ImageShowcase>
 * ```
 */

const meta: Meta<typeof ImageShowcase> = {
  component: ImageShowcase,
  title: "Components/ImageShowcase",
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof ImageShowcase>;

export const Default: Story = {
  render: (props) => (
    <ImageShowcase {...props}>
      <img src={image001} alt="image001" width={300} height={300} />
      <img src={image002} alt="image002" width={300} height={300} />
      <img src={image003} alt="image003" width={600} height={600} />
      <img src={image004} alt="image004" width={300} height={300} />
      <img src={image005} alt="image005" width={300} height={300} />
      <img src={image006} alt="image006" width={300} height={300} />
      <img src={image007} alt="image007" width={300} height={300} />
      <img src={image008} alt="image008" width={300} height={300} />
    </ImageShowcase>
  )
};
