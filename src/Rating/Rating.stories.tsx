import type { Meta, StoryObj } from "@storybook/react";

import { Rating } from "./Rating";

/**
 * The `Rating` component is used to display a rating out of a maximum value. It is a wrapper around the `Star` icon from `ludice-react`. Has support for half stars by passing a decimal value to the `value` prop.
 * The passed value is rounded to the nearest half star.
 *
 * ## Usage
 * ```
 * <Rating
 *    max: 5,
 *    value: 3.5,
 *    size: 32,
 *    color: "gold",
 * />
 * ```
 */

const meta: Meta<typeof Rating> = {
  component: Rating,
  title: "Components/Rating",
  tags: ["autodocs"],
  argTypes: {
    color: {
      options: ["gold", "black", "gray"],
      control: { type: "radio" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Rating>;

export const Basic: Story = {
  args: {
    max: 5,
    value: 3.5,
    size: 32,
  },
  render: (props) => (
    <div className="bg slate-50 dark:bg-slate-900 p-4">
      <Rating {...props} />
    </div>
  ),
};
