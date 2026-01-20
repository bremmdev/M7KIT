import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardHeader, CardContent } from "./Card";
import image from "../_data/images/picture009.jpg";

const meta: Meta<typeof Card> = {
    component: Card,
    title: "Components/Card",
    tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Primary: Story = {
    args: {
        as: "div",
    },
    render: (props) => {
        return (
            <div className="flex gap-6">
                <Card {...props}>
                    <CardHeader>This is the card header</CardHeader>
                    <CardContent>The content of the card goes here and is separated from the header and footer by a gap of 4 units.</CardContent>
                </Card>
                <Card {...props}>
                    <CardHeader>This is the card header</CardHeader>
                    <CardContent>The content of the card goes here and is separated from the header and footer by a gap of 4 units.</CardContent>
                </Card>
                <Card {...props}>
                    <CardHeader>This is the card header</CardHeader>
                    <CardContent>The content of the card goes here and is separated from the header and footer by a gap of 4 units.</CardContent>
                </Card>
            </div>
        );
    },
};

export const WithImage: Story = {
    args: {
        image: image,
        imageAlt: "Image",
        imageHeight: 500,
        className: "w-2xl"
    },
    render: (props) => {
        return (
            <Card {...props}>
                <CardHeader>A beautiful landscape</CardHeader>
                <CardContent>This is a beautiful seaside landscape with a clear blue sky and a calm ocean. It was taken on a sunny day in the summer. The height of the image
                    is based on the imageHeight prop.
                </CardContent>
            </Card>
        );
    },
};