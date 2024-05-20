import type { Meta, StoryObj } from "@storybook/react";

import { SkipLink } from "./SkipLink";
import { SkipLinkProps } from "./SkipLink.types";

/**
 * The `SkipLink` component provides a way for keyboard users to skip over navigation links and jump directly to the main content or specific sections of a page.
 * This is particularly useful for people who use screen readers or can't use a mouse.
 * The component accepts a link with a text and target id.
 * The target ID should correspond to the id of the HTML element that the link should skip to.
 * The SkipLink component is visually hidden by default, but will be visible when focused.
 * The component is positioned absolutely at the top of the page, so it will be the first thing that keyboard users tab to.
 * The position can be changed by passing a className prop or by using inline styles.
 *
 *
 * ## Usage
 * ```
 * <SkipLink
 *    text="Skip to content"
 *    targetId="main"
 * />
 * ```
 */

const meta: Meta<typeof SkipLink> = {
  component: SkipLink,
  title: "Components/SkipLink",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SkipLink>;

const render = (props: SkipLinkProps) => (
  <div className="relative flex flex-col text-slate-950 bg-slate-50 dark:bg-slate-800 dark:text-slate-200">
    <SkipLink {...props} />
    <header className="basis-96 flex justify-center items-center shrin">
      <h1 className="text-center text-2xl">Header</h1>
    </header>
    <main
      className="h-screen border-t border-t-slate-300 flex justify-center items-center"
      id="main"
    >
      <h2 className="text-center text-2xl">Main content</h2>
    </main>
  </div>
);

/**
 * ## Basic SkipLink
 * This skiplink will skip to the main content of the page, skipping over the header.
 */

export const Default: Story = {
  args: {
    text: "Skip to content",
    targetId: "main",
  },
  render: (props) => render(props),
};
