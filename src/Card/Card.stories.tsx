import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardHeader, CardContent, CardFooter } from "./Card";

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
                    <CardFooter>This is the card footer</CardFooter>
                </Card>
                <Card {...props}>
                    <CardHeader>This is the card header</CardHeader>
                    <CardContent>The content of the card goes here and is separated from the header and footer by a gap of 4 units.</CardContent>
                    <CardFooter>This is the card footer</CardFooter>
                </Card>
                <Card {...props}>
                    <CardHeader>This is the card header</CardHeader>
                    <CardContent>The content of the card goes here and is separated from the header and footer by a gap of 4 units.</CardContent>
                    <CardFooter>This is the card footer</CardFooter>
                </Card>
            </div>
        );
    },
};

