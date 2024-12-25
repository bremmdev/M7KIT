import type { Meta, StoryObj } from "@storybook/react";

import { TextAnimation } from "./TextAnimation";
import { TextAnimationProps } from "./TextAnimation.types";
import { type JSX } from "react";

/**
 * ```
 * <TextAnimation as="div" animation="fade-in-blur">
 *   This is a simple text animation example.
 * </TextAnimation>
 * ```
 */

const meta: Meta<typeof TextAnimation> = {
  component: TextAnimation,
  title: "Components/TextAnimation",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof TextAnimation>;

const render = (props: TextAnimationProps<keyof JSX.IntrinsicElements>) => (
  <div className="p-8">
    <TextAnimation {...props}>
      This is a simple text animation example.
    </TextAnimation>
  </div>
);

export const Default: Story = {
  args: {
    as: "div",
    animation: "fade-in-blur",
  },
  render: (props) => render(props),
};

export const CharAnimation: Story = {
  args: {
    as: "div",
    per: "char",
    delay: 25,
  },
  render: (props) => render(props),
};