export interface TabsProps extends React.ComponentPropsWithRef<"div"> {
  /**
   * The label of the tab selected at first, for uncontrolled tabs. Without it, the first enabled tab is selected
   */
  defaultValue?: string;
  /**
   * The label of the selected tab, for controlled tabs. Update it in `onValueChange`. When it matches no enabled tab,
   * the first enabled tab is shown
   */
  value?: string;
  /**
   * Called with the label of the tab the user selects. In controlled tabs, the selected tab only changes when `value` does
   */
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export interface TabListProps extends React.ComponentPropsWithRef<"div"> {
  children: React.ReactNode;
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
