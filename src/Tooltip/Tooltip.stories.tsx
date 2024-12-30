import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";
import { Info } from "lucide-react";

/**
 * The `Tooltip` component is used to provide additional information about an element when it is hovered or focused.
 * It consists of a trigger element and a content element. The trigger element is the element that the user interacts with to show the tooltip, and the content element is the tooltip itself.
 * The tooltip content can be any HTML element or component.
 *
 * ## Features
 * - Fade in on hover (optional)
 * - Customizable placement (top left, top center, top right, bottom left, bottom center, bottom right)
 * - Customizable hover delay
 * - Accessible using ARIA attributes like aria-describedby to read the tooltip content to screen readers and aria-haspopup to indicate that the element has a popup
 *
 * ## Placement
 * The tooltip placement can be customized using the `placement` prop. The tooltip will be placed on the opposite side if it does not fit within the viewport.
 *
 * ## Styling
 * The container (Tooltip), trigger (TooltipTrigger), and content (TooltipContent) can be styled using the `className` prop. This is especially useful for the content as it has a fixed width. Adjust the width as desired using the className prop.
 *
 * ## Usage
 * ```
 * <Tooltip
 *   placement="top center"
 *   hoverDelay={300}
 * >
 *   <TooltipTrigger>
 *    <Info size={24} aria-label="additional information" />
 *  </TooltipTrigger>
 *   <TooltipContent>
 *    <div>
 *     <h3>Pricing details</h3>
 *     <p>The price listed is exclusive of taxes and shipping costs and may vary based on your location.</p>
 *    </div>
 *   </TooltipContent>
 * </Tooltip>
 * ```
 */

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  title: "Components/Tooltip",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    hoverDelay: 500,
    placement: "bottom center",
  },
  render: (props) => (
    <div className="flex justify-center min-h-screen items-center">
      <Tooltip {...props}>
        <TooltipTrigger className="text-blue-500">
          <Info size={24} aria-label="additional information" />
        </TooltipTrigger>
        <TooltipContent>
          <div>
            <h3 className="font-bold mb-2">Pricing details</h3>
            <p>
              The price listed is exclusive of taxes and shipping costs and may
              vary based on your location.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const PlacementOverride: Story = {
  args: {
    hoverDelay: 500,
    placement: "top left",
  },
  render: (props) => (
    <div className="p-4 flex justify-start flex-col min-h-screen items-start">
      <p>
        <span className="font-bold">top left</span> does not fit, so it is
        flipped to <span className="font-bold">bottom right</span>
      </p>
      <Tooltip {...props}>
        <TooltipTrigger className="text-blue-500">
          <Info size={24} aria-label="additional information" />
        </TooltipTrigger>
        <TooltipContent>
          <div>
            <h3 className="font-bold mb-2">Pricing details</h3>
            <p>
              The price listed is exclusive of taxes and shipping costs and may
              vary based on your location.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};
