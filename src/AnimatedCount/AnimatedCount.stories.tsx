import type { Meta, StoryObj } from "@storybook/react";

import { AnimatedCount } from "./AnimatedCount";

/**
 * The `AnimatedCounter` component is used to animate a number from a starrting number (default: 0) to a specified number.
 * The animation can be slowed down when it reaches a certain number.
 *
 * ## Usage
 *
 * ```
 * <AnimatedCount count={100} slowDownAt={95} />
 * ```
 */

const meta: Meta<typeof AnimatedCount> = {
  component: AnimatedCount,
  title: "Components/AnimatedCount",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof AnimatedCount>;

export const Default: Story = {
  args: {
    count: 100,
    // className: "text-2xl font-bold text-clr-text",
  },
  render: (props) => {
    return (
      <div className="p-8">
        <AnimatedCount {...props} />
      </div>
    );
  },
};

export const SlowDown: Story = {
  args: {
    count: 100,
    slowDownAt: 95,
    slowDownFactor: 10,
    // className: "text-2xl font-bold text-clr-text",
  },
  render: (props) => {
    return (
      <div className="p-8">
        <AnimatedCount {...props} />
      </div>
    );
  },
};

export const CountDown: Story = {
  args: {
    count: 0,
    start: 100,
    step: -1,
    // className: "text-2xl font-bold text-clr-text",
  },
  render: (props) => {
    return (
      <div className="p-8">
        <AnimatedCount {...props} />
      </div>
    );
  },
};
