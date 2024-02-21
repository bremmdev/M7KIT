export type ColumnCount = 1 | 2 | 3 | 4 | 5 | 6;
import type { Breakpoint } from "../utils/breakpoints";

export type BreakpointColumns = {
  [K in Breakpoint]?: ColumnCount;
};

export type MasonryProps = React.ComponentPropsWithRef<"div"> & {
  /**
   * The number of columns to display
   */
  columns: ColumnCount | BreakpointColumns;
  /**
   * The spacing between the columns and rows
   */
  spacing?: number;
  /**
   * The order of the columns.
   * With `horizontal` the columns will be filled from left to right
   * With `vertical` the columns will be filled from top to bottom
   */
  columnOrder?: "horizontal" | "vertical";
};
