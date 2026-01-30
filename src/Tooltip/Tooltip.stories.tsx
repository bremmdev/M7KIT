import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";
import { Info } from "lucide-react";
import { Button } from "../Button/Button";
import { Placement } from "./Tooltip.types";
import React from "react";
import { action } from "storybook/actions";

/**
 * The `Tooltip` component displays contextual information on hover, focus, or tap (mobile). It consists of a trigger element (rendered as a button) and a content element. 
 * The tooltip content can be any HTML element or component. Some libraries treat tooltips as visual-only. Ours are visual, mobile-friendly, and accessible.
 * 
 * ## Accessibility 
 * - If invoked using focus, focus stays on the triggering element while the tooltip is displayed and the tooltip is dismissed when it no longer has focus (onBlur)
 * - If invoked when a pointing cursor moves over the trigger element, then it remains open as long as the cursor is over the trigger.
 * - Optionally, the tooltip can be used on mobile devices by setting the `touchBehavior` prop to "tap". By default, the tooltip is not used on mobile devices.
 * - The tooltip is dismissed when the user presses the Escape key.
 * - Role="tooltip" is applied to the tooltip content element. aria-describedby is applied to the trigger element to indicate that the tooltip content is described by the tooltip content element for screen readers.

 * ## Usage guidelines for assistive technologies
 * - The tooltip is meant for short, non-essential information the user does not need to actively interact with and should not contain focusable elements. If the information is essential or requires interaction, consider using a modal or a PopOver instead.
 *
 * ## Features
 * - Fade in on hover (optional)
 * - Customizable placement (top left, top center, top right, bottom left, bottom center, bottom right)
 * - Customizable hover delay
 * - Controlled mode. The tooltip can be controlled by the parent component by passing the `open` prop. The `onOpenChange` prop can be used to listen to changes in the open state so the parent component can update its own state.
 *
 * ## Placement
 * The tooltip placement can be customized using the `placement` prop. The tooltip will be placed based on the following strategy:
 * - Check vertical placement, flip if necessary, only flip if the opposite side fits within the padding
 * - Check horizontal placement, move horizontally to the next possible placement (i.e if left does not fit, try center, then right, if right does not fit, try center, then left)
 * - If both sides do not fit, leave in center
 *
 * ## Styling
 * The container (Tooltip), trigger (TooltipTrigger), and content (TooltipContent) can be styled using the `className` prop. This is especially useful for the content as it has a fixed width. Adjust the width as desired using the className prop.
 *
 * ## Usage
 * ```
 * <Tooltip
 *   hoverDelay={300}
 * >
 *   <TooltipTrigger aria-label="additional information">
 *    <Info size={24} />
 *  </TooltipTrigger>
 *   <TooltipContent placement="bottom center">
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
  tags: ["autodocs"]
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: (props) => (
    <div className="flex justify-center min-h-screen items-center">
      <Tooltip {...props}>
        <TooltipTrigger aria-label="additional information">
          <Info size={24} />
        </TooltipTrigger>
        <TooltipContent placement="bottom center">
          <>
            <h3 className="font-bold mb-2">Pricing details</h3>
            <p>The price listed is exclusive of taxes and shipping costs and may vary based on your location.</p>
          </>
        </TooltipContent>
      </Tooltip>
    </div>
  )
};

export const Controlled: Story = {
  tags: ["!autodocs"],
  args: {
    open: true
  },
  render: (props) => {
    const [open, setOpen] = React.useState(props.open);

    const handleOpenChange = (open: boolean) => {
      setOpen(open);
      action("onOpenChange")(open);
    };

    return (
      <div className="flex justify-center flex-col min-h-screen items-center gap-4">
        <Button variant="secondary" onClick={() => setOpen(!open)}>
          {open ? "Close" : "Open"}
        </Button>
        <Tooltip {...props} open={open} onOpenChange={handleOpenChange}>
          <TooltipTrigger aria-label="additional information">
            <Info size={24} />
          </TooltipTrigger>
          <TooltipContent placement="bottom left">
            <>
              <h3 className="font-bold mb-2">Pricing details</h3>
              <p>The price listed is exclusive of taxes and shipping costs and may vary based on your location.</p>
            </>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }
};

export const TouchBehavior: Story = {
  tags: ["!autodocs"],
  args: {
    touchBehavior: "tap",
  },
  render: (props) => {
    return (
      <div className="flex justify-center min-h-screen items-center">
        <Tooltip {...props}>
          <TooltipTrigger>
            <Info size={20} />
          </TooltipTrigger>
          <TooltipContent>
            <div>Tooltip content</div>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }
};

export const PlacementOptions: Story = {
  tags: ["!autodocs"],
  args: {},
  render: (props) => {
    const TooltipDemo = ({ placement }: { placement: Placement }) => (
      <Tooltip {...props} open={true}>
        <TooltipTrigger>
          <Info size={20} />
        </TooltipTrigger>
        <TooltipContent placement={placement} className="w-48">
          <div>
            <h3 className="font-bold mb-1">Tooltip</h3>
            <p className="text-sm">{placement}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    );

    return (
      <div className="min-h-screen flex items-center justify-center p-16">
        <div className="grid grid-cols-3 gap-x-32 gap-y-16">
          {/* Top row - top placements */}
          <div className="flex justify-center">
            <TooltipDemo placement="top left" />
          </div>
          <div className="flex justify-center">
            <TooltipDemo placement="top center" />
          </div>
          <div className="flex justify-center">
            <TooltipDemo placement="top right" />
          </div>

          {/* Bottom row - bottom placements */}
          <div className="flex justify-center">
            <TooltipDemo placement="bottom left" />
          </div>
          <div className="flex justify-center">
            <TooltipDemo placement="bottom center" />
          </div>
          <div className="flex justify-center">
            <TooltipDemo placement="bottom right" />
          </div>
        </div>
      </div>
    );
  }
};

export const PlacementOverrides: Story = {
  tags: ["!autodocs"],
  parameters: {
    layout: "fullscreen"
  },
  render: (props) => {
    const TooltipDemo = ({ placement, label }: { placement: Placement; label: string }) => (
      <Tooltip {...props} open={true}>
        <TooltipTrigger>
          <div className="bg-accent text-white px-2 py-1 rounded text-xs">{label}</div>
        </TooltipTrigger>
        <TooltipContent placement={placement} className="w-48">
          <div>
            <p className="text-xs text-gray-400 mb-1">Requested: {placement}</p>
            <p className="text-sm">This tooltip should reposition if it doesn't fit.</p>
          </div>
        </TooltipContent>
      </Tooltip>
    );

    return (
      <div className="min-h-screen w-[95%] relative">
        {/* LEFT EDGE - should trigger left → center → right fallback */}
        <div className="absolute left-2 top-1/4">
          <TooltipDemo placement="top left" label="top left" />
        </div>
        <div className="absolute left-2 top-1/2">
          <TooltipDemo placement="bottom left" label="bottom left" />
        </div>

        {/* RIGHT EDGE - should trigger right → center → left fallback */}
        <div className="absolute right-2 top-1/4">
          <TooltipDemo placement="top right" label="top right" />
        </div>
        <div className="absolute right-2 top-1/2">
          <TooltipDemo placement="bottom right" label="bottom right" />
        </div>

        {/* TOP EDGE - should trigger top → bottom flip */}
        <div className="absolute left-1/4 top-2">
          <TooltipDemo placement="top center" label="top center" />
        </div>
        <div className="absolute left-1/2 top-2">
          <TooltipDemo placement="top left" label="top left" />
        </div>

        {/* BOTTOM EDGE - should trigger bottom → top flip */}
        <div className="absolute left-1/4 bottom-2">
          <TooltipDemo placement="bottom center" label="bottom center" />
        </div>
        <div className="absolute left-1/2 bottom-2">
          <TooltipDemo placement="bottom right" label="bottom right" />
        </div>

        {/* CORNERS - combined fallbacks */}
        <div className="absolute left-2 top-2">
          <TooltipDemo placement="top left" label="corner: top left" />
        </div>
        <div className="absolute right-2 top-2">
          <TooltipDemo placement="top right" label="corner: top right" />
        </div>
        <div className="absolute left-2 bottom-2">
          <TooltipDemo placement="bottom left" label="corner: bottom left" />
        </div>
        <div className="absolute right-2 bottom-2">
          <TooltipDemo placement="bottom right" label="corner: bottom right" />
        </div>

        {/* CENTER - reference (should not need overrides) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <TooltipDemo placement="top center" label="center (no override)" />
        </div>
      </div>
    );
  }
};
