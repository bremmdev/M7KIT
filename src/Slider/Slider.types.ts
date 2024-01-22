export interface SliderPropsType {
  /**
   * The minimum value of the slider
   * @default 0
   */
  min?: number;
  /**
   * The maximum value of the slider
   * @default 100
   */
  max?: number;
  /**
   * The step value of the slider
   * @default 1
   */
  step?: number;
  /**
   * controlled value of the slider, use in conjunction with onValueChange
   * @default 0
   */
  value?: number;
  /**
   * Show the value of the slider
   * @default true
   */
  showValue?: boolean;
  /**
   * Event handler called when the value changes
   */
  onValueChange?: (value: number) => void;
  /**
   * The orientation of the slider
   * @default horizontal
   */
  orientation?: "horizontal" | "vertical";
  /**
   * The size of the slider, 1 unit = 4px
   * @default 3
   */
  size?: 2 | 3 | 4;
  /**
   * disabled state of the slider
   * @default false
   */
  disabled?: boolean;
  /**
   * name attribute of the slider, send in conjunction with a form
   */
  name?: string;
  /**
   * label of the slider, if not provided, no label will be rendered
   */
  label?: string;
}

export interface SliderPropsExtended extends React.ComponentPropsWithRef<"div">, SliderPropsType {}