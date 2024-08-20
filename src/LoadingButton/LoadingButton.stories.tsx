import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { LoadingButton } from "./LoadingButton";

/**
 * Button component that displays a loading spinner overlayed on the text content of a button when the `loading` prop is true. 
 * By overlaying the spinner on the text content, the button maintains its original size and layout when transitioning to the loading state.
 * The button is disabled when in the loading state.
 *
 * ## Usage
 *
 * ```
 * <LoadingButton loading={loading}>Submit</LoadingButton>
 * ```
 */

const meta: Meta<typeof LoadingButton> = {
  component: LoadingButton,
  title: "Components/LoadingButton",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof LoadingButton>;

export const Default: Story = {
  render: (props) => {
    const [loading, setLoading] = React.useState(false);

    const handleClick = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };

    return (
      <div className="space-y-4 p-8">
        <p className="text-clr-text">Click the button to activate the loading state.</p>
        <LoadingButton {...props} loading={loading} onClick={handleClick}>Submit</LoadingButton>
      </div>
    );
  },
};
