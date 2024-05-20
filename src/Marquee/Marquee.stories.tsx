import type { Meta, StoryObj } from "@storybook/react";
import { Marquee } from "./Marquee";

import AzureIcon from "../_data/icons/azure.svg";
import FlaskIcon from "../_data/icons/flask.svg";
import HtmxIcon from "../_data/icons/htmx.svg";
import NextIcon from "../_data/icons/next.svg";
import ReactIcon from "../_data/icons/react.svg";
import SanityIcon from "../_data/icons/sanity.svg";
import StorybookIcon from "../_data/icons/storybook.svg";
import TailwindIcon from "../_data/icons/tailwind.svg";
import TypeScriptIcon from "../_data/icons/typescript.svg";
import image001 from "../_data/images/picture001.jpg";
import image002 from "../_data/images/picture002.jpg";
import image003 from "../_data/images/picture003.jpg";
import image004 from "../_data/images/picture004.jpg";
import image005 from "../_data/images/picture005.jpg";

/**
 * The `Marquee` component is used to create a marquee effect with multiple items. It is useful for showcasing multiple items in a single container without overwhelming the user with too much information at once.
 *
 * ## Features
 * - Supports horizontal and vertical marquee effects, with left, right, up, and down directions.
 * - Customizable animation duration.
 * - Pause on hover, which can be disabled if needed.
 *
 * ## Known limitations
 * - For a seamless marquee effect, the total width of all items should be greater than the container width in the horizontal direction.
 * - For a seamless marquee effect, the total height of all items should be greater than the container height in the vertical direction.
 *
 * ## Usage
 * ```
 * <Marquee
 *   animationDuration={3000}
 * >
 *   {children}
 * </Marquee>
 * ```
 */

const meta: Meta<typeof Marquee> = {
  component: Marquee,
  title: "Components/Marquee",
  tags: ["autodocs"],
  argTypes: {
    direction: {
      options: ["left", "right"],
      mapping: {
        left: "left",
        right: "right",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Marquee>;

const items = [
  <img src={AzureIcon} alt="Azure Icon" className="w-16 h-16" />,
  <img src={FlaskIcon} alt="Flask Icon" className="w-16 h-16" />,
  <img src={HtmxIcon} alt="Htmx Icon" className="w-16 h-16" />,
  <img src={NextIcon} alt="Next Icon" className="w-16 h-16" />,
  <img src={ReactIcon} alt="React Icon" className="w-16 h-16" />,
  <img src={SanityIcon} alt="Sanity Icon" className="w-16 h-16" />,
  <img src={StorybookIcon} alt="Storybook Icon" className="w-16 h-16" />,
  <img src={TailwindIcon} alt="Tailwind Icon" className="w-16 h-16" />,
  <img src={TypeScriptIcon} alt="TypeScript Icon" className="w-16 h-16" />,
];

export const Default: Story = {
  args: {
    pauseOnHover: true,
    className: "bg-slate-50 max-w-[800px] mx-auto",
  },

  render: (props) => (
    <div className="p-12">
      <Marquee {...props}>{items}</Marquee>
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    direction: "down",
    className: "bg-slate-50 max-h-[360px]",
  },
  argTypes: {
    direction: {
      options: ["down", "up"],
      mapping: {
        down: "down",
        up: "up",
      },
    },
  },
  render: (props) => (
    <div className="p-12">
      <Marquee {...props}>{items}</Marquee>
    </div>
  ),
};

export const ImageGallery: Story = {
  args: {
    animationDuration: 10000,
  },
  render: (props) => (
    <div className="p-12">
      <Marquee {...props}>
        <img src={image001} alt="image001" className="w-96 h-72" />
        <img src={image002} alt="image002" className="w-80 h-72" />
        <img src={image003} alt="image003" className="w-[400px] h-72" />
        <img src={image004} alt="image004" className="w-48 h-72" />
        <img src={image005} alt="image005" className="w-[500px] h-72" />
      </Marquee>
    </div>
  ),
};
