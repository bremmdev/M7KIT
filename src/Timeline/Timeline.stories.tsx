import type { Meta, StoryObj } from "@storybook/react-vite";
import { Timeline } from "./Timeline";
import image from "../Masonry/data/picture001.jpg";
import { CircleDashed } from "lucide-react";

/**
 * The `Timeline` component is used to display a list of events in chronological order. It is a vertical representation of a sequence of events, such as a story or a history.
 *
 *
 * ## Structure
 *
 * - `Timeline`: The main container for the timeline.
 * - `Timeline.Item`: The individual items in the timeline.
 *
 * ## Customization
 *
 * - `lineClassName`: class name for overriding the styles for the line connecting the items.
 * - `bullet`: custom bullet for the timeline item, if not provided, a default bullet (circle) will be rendered.
 * - `Timeline` and `Timeline.Item` can be styled using the `className` prop.
 *
 * ## Usage
 * ```
 * <Timeline>
 *   <Timeline.Item>
 *     <h2>Heading 1</h2>
 *     <p>Content 1</p>
 *   </Timeline.Item>
 *   <Timeline.Item>
 *     <h2>Heading 2</h2>
 *     <p>Content 2</p>
 *   </Timeline.Item>
 * </Timeline>
 * ```
 */

const meta: Meta<typeof Timeline> = {
  component: Timeline,
  title: "Components/Timeline",
  tags: ["autodocs"]
};
export default meta;

type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
  args: {},
  render: (props) => (
    <Timeline {...props}>
      <Timeline.Item>
        <h2 className="text-xl font-bold -my-1">Heading 1</h2>
        <p>Content 1</p>
      </Timeline.Item>
      <Timeline.Item>
        <h2 className="text-xl font-bold -my-1">Heading 2</h2>
        <img src={image} width="200" height="300" alt="image" className="my-2" />
      </Timeline.Item>
      <Timeline.Item>
        <h2 className="text-xl font-bold -my-1">Heading 3</h2>
        <p>Content 3</p>
      </Timeline.Item>
    </Timeline>
  )
};

export const CustomBullet: Story = {
  args: {},
  render: (props) => (
    <Timeline {...props}>
      <Timeline.Item lineClassName="bg-accent" bullet={<CircleDashed color="var(--color-accent)" size={24} />}>
        <h2 className="text-xl font-bold -my-[2px]">Heading 1</h2>
        <p>Content 1</p>
      </Timeline.Item>
      <Timeline.Item bullet={<CircleDashed color="var(--color-accent)" size={24} />} lineClassName="bg-accent">
        <h2 className="text-xl font-bold -my-[2px]">Heading 2</h2>
        <img src={image} width="200" height="300" alt="image" className="my-2" />
      </Timeline.Item>
      <Timeline.Item bullet={<CircleDashed color="var(--color-accent)" size={24} />} lineClassName="bg-accent">
        <h2 className="text-xl font-bold -my-[2px]">Heading 3</h2>
        <p>Content 3</p>
      </Timeline.Item>
    </Timeline>
  )
};
