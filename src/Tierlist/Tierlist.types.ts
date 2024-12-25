export const defaultLabels = ["S", "A", "B", "C", "D"];
export const defaultLabelColors = [
  "#fca5a5",
  "#fed7aa",
  "#fef08a",
  "#d9f99d",
  "#bbf7d0",
];

export type RankedItems = Array<Array<React.ReactElement<any>>>;

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
  onTierDrop?: (rank: string) => void;
  /**
   * className to apply to the tierlist items container
   */
  itemsClasses?: string;
  /**
   * className to apply to the tierlist label
   */
  labelClasses?: string;
  /**
   * className to apply to the tierlist tier
   */
  tierClasses?: string;
};

export type TierListTierProps = React.ComponentPropsWithRef<"div"> & {
  idx: number;
  items: RankedItems[number];
  onDrop: React.DragEventHandler<HTMLDivElement>;
  /**
   * Callback fired when an item is dragged over a tier by touch event on mobile
   */
  onTouchDrop: (rankIdx: number, itemId: number) => void;
  /**
   * Callback fired when an item is dropped back into the tierlist to unrank it
   */
  onUnrankDrop: (itemId: number) => void;
  /**
   * className to apply to the tierlist tier
   */
  tierClasses?: string;
};

export type TierListLabelProps = React.ComponentPropsWithRef<"div"> & {
  color: string;
  /**
   * className to apply to the tierlist label
   */
  labelClasses?: string;
};

export type TierListItemsProps = React.ComponentPropsWithRef<"div"> & {
  rankedItems: RankedItems;
  /**
   * Callback fired when an item is dropped back into the tierlist to unrank it
   */
  onUnrankDrop: (itemId: number) => void;
  /**
   * Callback fired when an item is dragged over a tier by touch event on mobile
   */
  onTouchDrop: (rankIdx: number, itemId: number) => void;
  /**
   * className to apply to the tierlist items container
   */
  itemsClasses?: string;
};
