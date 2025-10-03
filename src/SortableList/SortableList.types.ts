export interface SortableListProps extends React.ComponentPropsWithRef<"ul"> {
  /**
   * position of the handle
   */
  handlePosition?: "start" | "end";
  /**
   * items to sort
   */
  items: Array<React.ReactNode>;
  /**
   * Callback function that is called when the order of items changes.
   * It receives the new order of items as an argument.
   */
  onReorder?: (newOrder: Array<React.ReactNode>) => void;
}
