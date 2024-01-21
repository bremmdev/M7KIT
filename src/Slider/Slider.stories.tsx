import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "./Slider";

/**
 * The `Slider` component is an accessible slider component that allows users to select a value from a range of values. It is based on the [W3C Slider pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/).
 * It has several features, such as horizontal and vertical orientation, different sizes, a hidden input field for form submission, and a label.
 * 
 * ## Accessibility
 *
 * I followed the following guidelines while developing the `Slider` component:
 * - The element serving as the focusable slider control has role slider.
 * - The slider element has the aria-valuenow property set to a decimal value representing the current value of the slider.
 * - The slider element has the aria-valuemin property set to a decimal value representing the minimum allowed value of the slider.
 * - The slider element has the aria-valuemax property set to a decimal value representing the maximum allowed value of the slider.
 * - If the slider has a visible label, it is referenced by aria-labelledby on the slider element. Otherwise, the slider element has a label provided by aria-label.
 * - If the slider is vertically oriented, it has aria-orientation set to vertical. The default value of aria-orientation for a slider is horizontal.
 *

 * ## Keyboard interaction
 *
 * - Right Arrow: Increase the value of the slider by one step.
 * - Up Arrow: Increase the value of the slider by one step.
 * - Left Arrow: Decrease the value of the slider by one step.
 * - Down Arrow: Decrease the value of the slider by one step.
 * - Home: Set the slider to the first allowed value in its range.
 * - End: Set the slider to the last allowed value in its range.
 * - Page Up (Optional): Increase the slider value by an amount larger than the step change made by Up Arrow.
 * - Page Down (Optional): Decrease the slider value by an amount larger than the step change made by Down Arrow.
 *
 * ## Usage
 * ```
 * <Slider
 *  min={0}
 *  max={10}
 *  step={1}
 *  value={50},
 *  label: "Brightness",
 * ```
 */

const meta: Meta<typeof Slider> = {
  component: Slider,
  title: "Components/Slider",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Slider>;

export const Basic: Story = {
  args: {
    className: "w-[500px]",
    size: 3,
    min: 0,
    max: 100,
    value: 50,
    label: "Brightness",
    name: "brightness",
  },
  render: (props) => (
    <div className="p-12">
      <Slider {...props} />
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    className: "h-[200px]",
    size: 3,
    min: 0,
    max: 100,
    value: 50,
    label: "Volume",
    name: "volume",
    orientation: "vertical",
  },
  render: (props) => (
    <div className="p-12">
      <Slider {...props} />
    </div>
  ),
};
