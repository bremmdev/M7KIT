import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";

import { SegmentedControl } from "./SegmentedControl";

/**
 * The `SegmentedControl` component is a group of buttons that allows the user to select one option from a list of options in a mutually exclusive manner.
 *
 * ## Features
 * - Select the default selected button by adding the `defaultSelected` prop to the `SegmentedControl.Button` component.
 * - Use the `onValueChange` prop to listen for changes in the selected button
 * - Use the `value` prop to provide a value for the selected button. This value will be passed to the `onValueChange` callback when the button is selected. If the `value` prop is not provided, the children of the button will be used as the value.
 * - 'aria-current' attribute is set to 'true' on the selected button to indicate the current selection to screen readers
 *
 * ## Usage
 *
 * ```
 * <SegmentedControl onValueChange={onValueChange}>
 *   <SegmentedControl.Button value="option-1" defaultSelected>Option 1</SegmentedControl.Button>
 *   <SegmentedControl.Button value="option-2">Option 2</SegmentedControl.Button>
 *   <SegmentedControl.Button value="option-3">Option 3</SegmentedControl.Button>
 * </SegmentedControl>
 * ```
 */

const meta: Meta<typeof SegmentedControl> = {
  component: SegmentedControl,
  title: "Components/SegmentedControl",
  tags: ["autodocs"]
};
export default meta;

type Story = StoryObj<typeof SegmentedControl>;

export const Default: Story = {
  args: {
    onValueChange: (value: string) => action("Value changed")(value)
  },
  render: (props) => {
    return (
      <div className="space-y-4 p-8">
        <SegmentedControl {...props} aria-label="email categories">
          <SegmentedControl.Button value="all">All</SegmentedControl.Button>
          <SegmentedControl.Button value="unread" defaultSelected>
            Unread
          </SegmentedControl.Button>
          <SegmentedControl.Button value="read">Read</SegmentedControl.Button>
        </SegmentedControl>
      </div>
    );
  }
};
