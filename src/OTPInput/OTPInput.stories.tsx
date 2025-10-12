import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";

import { OTPInput } from "./OTPInput";

/**
 * The `OTPInput` component is used to create a one-time password input that a user can use to enter a code sent to them via SMS or email.
 *
 * ## Usage
 * ```
 * <OTPInput
 *    maxLength={5}
 *    onValueChange={(value) => console.log('value')}
 *    onComplete={(value) => console.log('do backend stuff with value')}
 * />
 * ```
 */

const meta: Meta<typeof OTPInput> = {
  component: OTPInput,
  title: "Components/OTPInput",
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof OTPInput>;

export const Default: Story = {
  args: {
    onValueChange: (value: string) => action("Value changed")(value),
  },
  render: (props) => (
    <div className="p-8">
      <OTPInput {...props} />
    </div>
  ),
};
