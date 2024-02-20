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
