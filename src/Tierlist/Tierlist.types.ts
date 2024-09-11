export const defaultLabels = ["S", "A", "B", "C", "D"];
export const defaultLabelColors = [
  "#fca5a5",
  "#fed7aa",
  "#fef08a",
  "#d9f99d",
  "#bbf7d0",
];

export type RankedItems = Array<Array<React.ReactElement>>;

export type TierlistProps = React.ComponentPropsWithoutRef<"div"> & {
  /**
   * Colors of the the labels
   * @default defaultLabelColors
   */
  labelColors?: Array<string>;
  /**
   * The labels of the tierlist
   * @default defaultLabels
   */
  labels?: Array<string>;
  /**
   * Callback fired when an item is dropped into a tier
   */
  onDrop?: (rank: string) => void;
};

export type TierListRankProps = React.ComponentPropsWithRef<"div"> & {
  items: RankedItems[number];
  onDrop: React.DragEventHandler<HTMLDivElement>;
};

export type TierListLabelProps = React.ComponentPropsWithRef<"div"> & {
  color: string;
};

export type TierListItemsProps = React.ComponentPropsWithRef<"div"> & {
  rankedItems: RankedItems;
  /**
   * Callback fired when an item is dropped back into the tierlist to unrank it
   */
  onUnrankDrop: React.DragEventHandler<HTMLDivElement>;
};
