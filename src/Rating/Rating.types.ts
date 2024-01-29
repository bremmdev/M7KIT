export type RatingProps = React.ComponentPropsWithRef<"div"> & {
  /**
   * The maximum value of the rating scale (inclusive)
   * @default 5
   */
  max?: number;
  /**
   * The value of the rating
   * @default 0
   */
  value?: number;
  /**
   * The size of the rating in pixels
   * @default 24
  */
  size?: number;
  /**
   * The color of the rating
   * @default gold
   */
  color?: 'gold' | 'black' | 'gray';
};