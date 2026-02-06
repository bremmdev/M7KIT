import type { Meta, StoryObj } from "@storybook/react-vite";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "./Popover";
import { Info } from "lucide-react";
import { Button } from "../Button/Button";
import { OverlayPlacement } from "../shared/Overlay/types";
import React from "react";
import { action } from "storybook/actions";

/**
 * The `Popover` component displays contextual information when the trigger is clicked. It consists of a trigger element (rendered as a button) and a content element. 
 * The Popover content can be any HTML element or component. There is overlap between the `Popover` and `Tooltip` components. Use the guidelines below to determine which component to use.
 * 
 * ## Popover vs Tooltip
 * - `Popover` is meant to capture the user's attention and provide additional information or actions. If the information is not essential or requires no interaction, consider using `Tooltip` instead.
 * - `Popover` is activated by clicking or using the keyboard (enter or space key) on the trigger element. `Tooltip` is activated by hovering over the trigger element or focusing it with the keyboard.
 * - Use `Popover` when you want to render focusable content. Do not use `Tooltip` for focusable content.
 * - Use `Tooltip` when you want to display a short, non-essential piece of information that does not require interaction.
 * 
 * ## Accessibility 
 * - Trigger element has `aria-haspopup="dialog"` and `aria-controls` attribute to indicate that the Popover content is controlled by the trigger element.
 * - Trigger element has `aria-expanded` attribute to indicate whether the Popover content is visible.
 * - When used with the `PopoverTitle` component, the content will be labelled by the title.
 * - When used without the `PopoverTitle` component, consider using an aria-label on the content container to describe the content.
 * - Focus management is handled by the `useFocusTrap` hook. It focuses the first focusable element within the content or the container itself if no focusable elements are found. By default, the focus is not trapped within the Popover content, but you can enable it by setting the `trapFocus` prop to true.
 *
 * ## Placement
 * The Popover placement can be customized using the `placement` prop. The Popover will be placed based on the following strategy:
 * - Check vertical placement, flip if necessary, only flip if the opposite side fits within the padding
 * - Check horizontal placement, move horizontally to the next possible placement (i.e if left does not fit, try center, then right, if right does not fit, try center, then left)
 * - If both sides do not fit, leave in center
 *
 * ## Styling
 * The container (Popover), trigger (PopoverTrigger), and content (PopoverContent) can be styled using the `className` prop. This is especially useful for the content as it has a fixed width. Adjust the width as desired using the className prop.
 *
 * ## Usage
 * ```
 * <Popover>
 *   <PopoverTrigger aria-label="additional information">
 *    <Info size={24} />
 *  </PopoverTrigger>
 *   <PopoverContent placement="bottom center">
 *     <PopoverTitle>Pricing details</PopoverTitle>
 *     <p>The price listed is exclusive of taxes and shipping costs and may vary based on your location.</p>
 *   </PopoverContent>
 * </Popover>
 * ```
 */

const meta: Meta<typeof Popover> = {
    component: Popover,
    title: "Components/Popover",
    tags: ["autodocs"]
};
export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {
    render: (props) => (
        <div className="flex justify-center min-h-screen items-center">
            <Popover {...props}>
                <PopoverTrigger aria-label="additional information">
                    <Info size={24} />
                </PopoverTrigger>
                <PopoverContent placement="bottom center">
                    <>
                        <PopoverTitle>Pricing details</PopoverTitle>
                        <p>The price listed is exclusive of taxes and shipping costs and may vary based on your location.</p>
                    </>
                </PopoverContent>
            </Popover>
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
                <Popover {...props} open={open} onOpenChange={handleOpenChange}>
                    <PopoverTrigger aria-label="additional information">
                        <Info size={24} />
                    </PopoverTrigger>
                    <PopoverContent placement="bottom left">
                        <>
                            <h3 className="font-bold mb-2">Pricing details</h3>
                            <p>The price listed is exclusive of taxes and shipping costs and may vary based on your location.</p>
                        </>
                    </PopoverContent>
                </Popover>
            </div>
        );
    }
};

export const FocusableContent: Story = {
    tags: ["!autodocs"],
    render: (props) => {
        return (
            <div className="flex justify-center min-h-screen items-center">
                <Popover {...props}>
                    <PopoverTrigger aria-label="additional information">
                        <Info size={24} />
                    </PopoverTrigger>
                    <PopoverContent placement="bottom center" className="flex flex-col gap-2">
                        <PopoverTitle>Focusable content</PopoverTitle>
                        <p>This is focusable content. By default, the focus is not trapped within the Popover content, but you can enable it by setting the `trapFocus` prop to true. Use 'escape' to close the Popover.</p>
                        <input type="text" className="border border-neutral rounded-md p-2 my-1" />
                        <Button>Submit</Button>
                    </PopoverContent>
                </Popover>
            </div>
        );
    }
};

export const PlacementOptions: Story = {
    tags: ["!autodocs"],
    args: {},
    render: (props) => {
        const PopoverDemo = ({ placement }: { placement: OverlayPlacement }) => (
            <Popover {...props} open={true}>
                <PopoverTrigger>
                    <Info size={20} />
                </PopoverTrigger>
                <PopoverContent placement={placement} className="w-48">
                    <div>
                        <h3 className="font-bold mb-1">Popover</h3>
                        <p className="text-sm">{placement}</p>
                    </div>
                </PopoverContent>
            </Popover>
        );

        return (
            <div className="min-h-screen flex items-center justify-center p-16">
                <div className="grid grid-cols-3 gap-x-32 gap-y-16">
                    {/* Top row - top placements */}
                    <div className="flex justify-center">
                        <PopoverDemo placement="top left" />
                    </div>
                    <div className="flex justify-center">
                        <PopoverDemo placement="top center" />
                    </div>
                    <div className="flex justify-center">
                        <PopoverDemo placement="top right" />
                    </div>

                    {/* Bottom row - bottom placements */}
                    <div className="flex justify-center">
                        <PopoverDemo placement="bottom left" />
                    </div>
                    <div className="flex justify-center">
                        <PopoverDemo placement="bottom center" />
                    </div>
                    <div className="flex justify-center">
                        <PopoverDemo placement="bottom right" />
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
        const PopoverDemo = ({ placement, label }: { placement: OverlayPlacement; label: string }) => (
            <Popover {...props} open={true}>
                <PopoverTrigger>
                    <div className="bg-accent text-white px-2 py-1 rounded text-xs">{label}</div>
                </PopoverTrigger>
                <PopoverContent placement={placement} className="w-48">
                    <div>
                        <p className="text-xs text-gray-400 mb-1">Requested: {placement}</p>
                        <p className="text-sm">This Popover should reposition if it doesn't fit.</p>
                    </div>
                </PopoverContent>
            </Popover>
        );

        return (
            <div className="min-h-screen w-[95%] relative">
                {/* LEFT EDGE - should trigger left → center → right fallback */}
                <div className="absolute left-2 top-1/4">
                    <PopoverDemo placement="top left" label="top left" />
                </div>
                <div className="absolute left-2 top-1/2">
                    <PopoverDemo placement="bottom left" label="bottom left" />
                </div>

                {/* RIGHT EDGE - should trigger right → center → left fallback */}
                <div className="absolute right-2 top-1/4">
                    <PopoverDemo placement="top right" label="top right" />
                </div>
                <div className="absolute right-2 top-1/2">
                    <PopoverDemo placement="bottom right" label="bottom right" />
                </div>

                {/* TOP EDGE - should trigger top → bottom flip */}
                <div className="absolute left-1/4 top-2">
                    <PopoverDemo placement="top center" label="top center" />
                </div>
                <div className="absolute left-1/2 top-2">
                    <PopoverDemo placement="top left" label="top left" />
                </div>

                {/* BOTTOM EDGE - should trigger bottom → top flip */}
                <div className="absolute left-1/4 bottom-2">
                    <PopoverDemo placement="bottom center" label="bottom center" />
                </div>
                <div className="absolute left-1/2 bottom-2">
                    <PopoverDemo placement="bottom right" label="bottom right" />
                </div>

                {/* CORNERS - combined fallbacks */}
                <div className="absolute left-2 top-2">
                    <PopoverDemo placement="top left" label="corner: top left" />
                </div>
                <div className="absolute right-2 top-2">
                    <PopoverDemo placement="top right" label="corner: top right" />
                </div>
                <div className="absolute left-2 bottom-2">
                    <PopoverDemo placement="bottom left" label="corner: bottom left" />
                </div>
                <div className="absolute right-2 bottom-2">
                    <PopoverDemo placement="bottom right" label="corner: bottom right" />
                </div>

                {/* CENTER - reference (should not need overrides) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <PopoverDemo placement="top center" label="center (no override)" />
                </div>
            </div>
        );
    }
};
