export interface TabsProps extends React.ComponentPropsWithRef<"div"> {
  /**
   * The label of the default selected tab, only use this if the component is uncontrolled
   * @default ''
   */
  defaultValue?: string;
  /**
   * The label of the active tab, use this if the component is controlled
   */
  value?: string;
  /**
   * Callback when the active tab changes
   */
  onValueChange?: (value: string) => void;
  children: Array<React.ReactElement>;
}

export interface TabListProps extends React.ComponentPropsWithRef<"div"> {
  children: Array<React.ReactElement<TabProps>>;
}

export interface TabProps extends React.ComponentPropsWithRef<"button"> {
  /**
   * The label for the tab, used to associate the tab with its content panel
   */
  label: string;
}

export interface TabContentProps extends React.ComponentPropsWithRef<"div"> {
  /**
   * The label for the tab, used to associate the content panel with its tab
   */
  label: string;
}
