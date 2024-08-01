import type { Meta, StoryObj } from "@storybook/react";
import { TextReveal } from "./TextReveal";

/**
 * The `TextReveal` component is used to reveal multiple items of text one at a time. It is useful for showcasing multiple items of text in a single container without overwhelming the user with too much information at once.
 *
 * Some use cases include:
 * - Showcasing multiple features or benefits of a product or service.
 * - Personal branding statements
 *
 * ## Features
 * - Reveal multiple items of text one at a time.
 * - Up or down reveal direction.
 * - Customizable animation duration.
 * - Customizable default visible index, so you can start with a specific item.
 *
 * ## Usage
 * ```
 * <TextReveal
 *   animationDuration={1000}
 * >
 *   <span>full-stack developer</span>
 *   <span>tech enthusiast</span>
 *   <span>continuous learner</span>
 * </TextReveal>
 * ```
 */

const meta: Meta<typeof TextReveal> = {
  component: TextReveal,
  title: "Components/TextReveal",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof TextReveal>;

export const Default: Story = {
  args: {
    defaultVisibleIndex: 0,
    className: "",
  },
  render: (props) => (
    <div className="p-12">
      <h1 className="text-clr-accent font-bold text-2xl my-4 text-center">
        Hi, I am Matt!
      </h1>
      <TextReveal {...props}>
        <span className="text-md font-medium">full-stack developer</span>
        <span className="text-md font-medium">tech enthusiast</span>
        <span className="text-md font-medium">continuous learner</span>
      </TextReveal>
    </div>
  ),
};
