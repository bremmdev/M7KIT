import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";
import { Tierlist } from "./Tierlist";
import HtmxIcon from "../_data/icons/htmx.svg";
import NextIcon from "../_data/icons/next.svg";
import ReactIcon from "../_data/icons/react.svg";
import SanityIcon from "../_data/icons/sanity.svg";
import StorybookIcon from "../_data/icons/storybook.svg";
import TailwindIcon from "../_data/icons/tailwind.svg";
import TypeScriptIcon from "../_data/icons/typescript.svg";

/**
 * `Tierlist` is a component that allows you to create a tierlist of items. It accepts a list of items (HTML / JSX elements) as children and allows you to drag and drop them into different tiers.
 * Items can be dragged and dropped into different tiers.
 *
 * ## Features
 *
 * - Drag and drop items into different tiers
 * - Drag and drop items back to the list to unrank them
 * - Customize labels and colors
 * - Customizable classnames for items, labels, and tiers
 * - Mobile touch support for drag and drop
 *
 * ## Usage
 *
 * ```
 * <Tierlist>
 *   <Image src={Picture001} alt="Picture001" width={20} height={20} />
 *   <Image src={Picture002} alt="Picture002" width={20} height={20} />
 *   <Image src={Picture003} alt="Picture003" width={20} height={20} />
 *   <Image src={Picture004} alt="Picture004" width={20} height={20} />
 *   <Image src={Picture005} alt="Picture005" width={20} height={20} />
 * </Tierlist>
 * ```
 **/

const meta: Meta<typeof Tierlist> = {
  component: Tierlist,
  title: "Components/Tierlist",
  tags: ["autodocs"]
};
export default meta;

type Story = StoryObj<typeof Tierlist>;

const tierlistItems = [
  <img src={ReactIcon} alt="React Icon" className="w-16 h-16" key="1" />,
  <img src={NextIcon} alt="Next Icon" className="w-16 h-16" key="2" />,
  <img src={StorybookIcon} alt="Storybook Icon" className="w-16 h-16" key="3" />,
  <img src={TailwindIcon} alt="Tailwind Icon" className="w-16 h-16" key="4" />,
  <img src={TypeScriptIcon} alt="TypeScript Icon" className="w-16 h-16" key="5" />,
  <img src={HtmxIcon} alt="Htmx Icon" className="w-16 h-16" key="6" />,
  <img src={SanityIcon} alt="Sanity Icon" className="w-16 h-16" key="7" />
];

export const Default: Story = {
  args: {
    onTierDrop: (rank: string) => action("Dropped in tier")(rank)
  },
  render: (props) => {
    return (
      <div className="space-y-4 p-8">
        <Tierlist {...props} aria-label="frontend technologies">
          {tierlistItems}
        </Tierlist>
      </div>
    );
  }
};
