import type { Meta, StoryObj } from "@storybook/react-vite";
import { TooltipV2, TooltipContent, TooltipTrigger } from "./TooltipV2";
import { Info } from "lucide-react";
import { Button } from "../Button/Button";
import React from "react";
import { Placement } from "./TooltipV2.types";

/**
 * The `Tooltip` component is used to provide additional information about an element when it is hovered or focused.
 * It consists of a trigger element and a content element. The trigger element is the element that the user interacts with to show the tooltip, and the content element is the tooltip itself.
 * The tooltip content can be any HTML element or component.
 *
 * ## Usage guidelines
 * - Provide an accessible name for the trigger. This can be its visible text or an aria-label/aria-labelledby attribute.

 */



const meta: Meta<typeof TooltipV2> = {
    component: TooltipV2,
    title: "Components/TooltipV2",
    tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof TooltipV2>;

export const Default: Story = {
    render: (props) => (
        <div className="flex justify-center min-h-screen items-center">
            <TooltipV2 {...props}>
                <TooltipTrigger aria-label="additional information">
                    <Info size={24} />
                </TooltipTrigger>
                <TooltipContent placement="bottom center">
                    <>
                        <h3 className="font-bold mb-2">Pricing details</h3>
                        <p>
                            The price listed is exclusive of taxes and shipping costs and may
                            vary based on your location.
                        </p>
                    </>
                </TooltipContent>
            </TooltipV2>
        </div>
    ),
};

export const Controlled: Story = {
    args: {
        open: true,
    },
    render: (props) => {

        const [open, setOpen] = React.useState(props.open);

        return (
            <div className="flex justify-center flex-col min-h-screen items-center gap-4">
                <Button variant="secondary" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Open'}</Button>
                <TooltipV2 {...props} open={open} onOpenChange={setOpen}>
                    <TooltipTrigger aria-label="additional information">
                        <Info size={24} />
                    </TooltipTrigger>
                    <TooltipContent placement="bottom center">
                        <>
                            <h3 className="font-bold mb-2">Pricing details</h3>
                            <p>
                                The price listed is exclusive of taxes and shipping costs and may
                                vary based on your location.
                            </p>
                        </>
                    </TooltipContent>
                </TooltipV2>
            </div>
        );
    },
};

export const PlacementOptions: Story = {
    args: {
    },
    render: (props) => {

        const TooltipDemo = ({ placement }: { placement: Placement }) => (
            <TooltipV2 {...props} open={true}>
                <TooltipTrigger>
                    <Info size={20} />
                </TooltipTrigger>
                <TooltipContent placement={placement} className="w-48">
                    <div>
                        <h3 className="font-bold mb-1">Tooltip</h3>
                        <p className="text-sm">{placement}</p>
                    </div>
                </TooltipContent>
            </TooltipV2>
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
    },
};