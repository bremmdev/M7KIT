import type { Meta, StoryObj } from "@storybook/react";

import { CTAButton } from "./CTAButton";

/**
 * Button component that can be used as an engaging call-to-action button or link (by adding an href).
 *
 * ## Usage
 *
 * ```
 * <CTAButton href="/pricing/plans">Get started for free</CTAButton>
 * ```
 */


const meta: Meta<typeof CTAButton> = {
  component: CTAButton,
  title: "Components/CTAButton",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof CTAButton>;

export const Default: Story = {
  args: {
    href: "#",
  },
  render: (props) => {
    return (
      <div className="space-y-4 p-8">
        <CTAButton {...props}>Get started for free</CTAButton>
      </div>
    );
  },
};
