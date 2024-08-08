import type { Meta, StoryObj } from "@storybook/react";

import { LineClampRoot, LineClamp, LineClampTrigger } from "./LineClamp";

/**
 * The `LineClamp` component is used to truncate text content that exceeds a certain number of lines. The component truncates the text content and optionally provides a "Read More" button (text can be customized) to expand the content when clicked.	
 *
 * ## Features
 *
 * - Use the `lines` prop to specify the number of lines to display before truncating the content
 * - Use the `as` prop to specify the element type to render as ('p', 'div', etc.)
 * - Use the `LineClampTrigger` component to provide a button to expand and collapse the content. The logic for expanding and collapsing the content is automatically handled by the `LineClampTrigger` component
 * - Use the `showMoreText` and `showLessText` props to customize the text displayed on the trigger button
 *
 * ## Usage
 *
 * ```
 * <LineClampRoot>
 *   <LineClamp lines={3}>
 *      Long text you want to truncate
 *   </LineClamp>
 *   <LineClampTrigger showMoreText="Expand" showLessText="Collapse" />
 * </LineClampRoot>
 * ```
 */

const meta: Meta<typeof LineClamp> = {
  component: LineClamp,
  title: "Components/LineClamp",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof LineClamp>;

export const Default: Story = {
  render: (props) => (
    <div className="space-y-4 p-8">
      <LineClampRoot>
        <LineClamp lines={3} {...props}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident,
        </LineClamp>
        <LineClampTrigger />
      </LineClampRoot>
    </div>
  ),
};

export const CustomTriggerText: Story = {
  render: (props) => (
    <div className="space-y-4 p-8">
      <LineClampRoot>
        <LineClamp lines={3} {...props}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
          velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
          occaecat cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim id est laborum.
        </LineClamp>
        <LineClampTrigger showMoreText="Expand" showLessText="Collapse" />
      </LineClampRoot>
    </div>
  ),
};

export const MultipleLineClamps: Story = {
  render: (props) => (
    <div className="space-y-4 p-8">
      <LineClampRoot>
        <LineClamp lines={3} {...props} className="duration-1000">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
          velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
          occaecat cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim id est laborum.
        </LineClamp>
        <LineClampTrigger />
      </LineClampRoot>
      <LineClampRoot>
        <LineClamp lines={3} {...props}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
          velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
          occaecat cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim id est laborum.
        </LineClamp>
        <LineClampTrigger />
      </LineClampRoot>
    </div>
  ),
};