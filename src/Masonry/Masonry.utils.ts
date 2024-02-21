import { BreakpointColumns } from "./Masonry.types";
import { breakpoints, Breakpoint } from "../utils/breakpoints";
import { ColumnCount } from "./Masonry.types";

export function orderItems(
  items: Array<React.ReactElement>,
  columns: number,
  columnOrder: "horizontal" | "vertical"
) {
  const orderedColumns: Array<Array<React.ReactElement>> = Array.from(
    { length: columns },
    () => []
  );

  items.forEach((item, index) => {
    if (columnOrder === "horizontal") {
      const columnIndex = index % columns;
      orderedColumns[columnIndex].push(item);
      return;
    }
    //vertical
    let columnIndex = Math.floor(index / Math.round(items.length / columns));
    if (columnIndex >= columns) columnIndex = columns - 1;
    orderedColumns[columnIndex].push(item);

    //if the last column has no items, fill it with an item from the previous column
    //there is an empty column when there is no remainder from the division and we have an extra column to fill
    //example: 16 items, user wants 5 columns, we get 4 columns with 4 items and 1 column with 0 items
    if (index === items.length - 1) {
      const lastColumn = orderedColumns[columns - 1];
      if (lastColumn.length === 0) {
        const previousColumn = orderedColumns[columns - 2];
        //if the previous column has less than 2 items, don't move any items
        if (previousColumn.length < 2) return;
        const lastItem = previousColumn.pop();
        if (lastItem) lastColumn.push(lastItem);
      }
    }
  });

  return orderedColumns;
}

/**
 * This function takes an object that maps breakpoints to columns and returns a new object with the same keys.
 * If a key in the input object has an undefined value, the function assigns it the value of the previous key that has a defined value.
 * If no previous key with a defined value is found, the function assigns it a value of 1.
 *
 * @param {BreakpointColumns} columns - An object where the keys are breakpoints ('xs', 'sm', 'md', 'lg', 'xl', '2xl') and the values are column counts.
 * @returns {Object} breakpointObj - A new object with the same keys as the input object. The values are derived from the input object as described above.
 */
export function getBreakpointColumns(columns: BreakpointColumns) {
  //create an object that has the same keys as the breakpoint
  const breakpointObj = Object.fromEntries(
    Object.keys(breakpoints).map((key) => [key, columns[key as Breakpoint]])
  );

  //check all keys to see if there are not undefined and if so derive the value from any of the previous breakpoints that has a value

  const keys = Object.keys(breakpointObj) as Array<keyof typeof breakpointObj>;
  for (let i = keys.length - 1; i >= 0; i--) {
    const key = keys[i];
    //go through the whole list until we find a value
    if (breakpointObj[key] === undefined) {
      for (let j = i; j >= 0; j--) {
        if (breakpointObj[keys[j]] !== undefined) {
          breakpointObj[key] = breakpointObj[keys[j]];
          break;
        }
        if (j === 0) breakpointObj[key] = 1;
      }
    }
  }
  return breakpointObj;
}

export function validateColumns (columns: ColumnCount | BreakpointColumns) {
  if (typeof columns == "number" && (columns < 1 || columns > 6))
    throw new Error("The number of columns must be between 1 and 6");
  if (typeof columns !== "number") {
    //check any of the keys to see if the value is not between 1 and 6
    const keys = Object.keys(columns) as Array<keyof typeof columns>;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (columns[key] && (columns[key]! < 1 || columns[key]! > 6))
        throw new Error("The number of columns must be between 1 and 6");
    }
  }
}