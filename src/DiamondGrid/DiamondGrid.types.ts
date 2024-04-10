export type DiamondGridProps = React.ComponentPropsWithRef<"div"> & {
  /**
   * the size of each diamond in the grid
   * @default 250
   * */
  itemWidth?: number;
  /**
   * The maximum number of items in each group
   * @default 2
   */
  maxItemsInGroup?: number;
};
