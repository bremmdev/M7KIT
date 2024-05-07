import type { Meta, StoryObj } from "@storybook/react";

import { Rating } from "./Rating";

/**
 * The `Rating` component is used to display a rating out of a maximum value. It is a wrapper around `ludice-react` icons. 
 * 
 * ## Features
 * - Supports `Star`, `Circle` and `Heart` variants
 * - Supports "half" rating by passing a decimal value to the `value` prop. The passed value is rounded to the nearest half.
 * - Supports custom sizes
 * 
 * ## Usage
 * ```
 * <Rating
 *    max={5}
 *    value={3.5}
 *    size={32}
 *    color="gold"
 *    variant="star"
 * />
 * ```
 */

const meta: Meta<typeof Rating> = {
  component: Rating,
  title: "Components/Rating",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ["star", "heart", "circle-black", "circle-gray"],
      control: { type: "radio" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Rating>;

export const Star: Story = {
  args: {
    max: 5,
    value: 3.5,
    size: 32,
    variant: "star",
  },
  render: (props) => (
    <div className="bg slate-50 dark:bg-slate-900 p-4">
      <Rating {...props} />
    </div>
  ),
};

export const Circle: Story = {
  args: {
    max: 5,
    value: 3,
    size: 16,
    variant: "circle-black",
  },
  render: (props) => (
    <div className="bg slate-50 dark:bg-slate-900 p-4">
      <Rating {...props} />
    </div>
  ),
};

export const Heart: Story = {
  args: {
    max: 5,
    value: 3,
    size: 24,
    variant: "heart",
  },
  render: (props) => (
    <div className="bg slate-50 dark:bg-slate-900 p-4">
      <Rating {...props} />
    </div>
  ),
};
