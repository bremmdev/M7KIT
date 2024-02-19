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
    let columnIndex = Math.floor(index / Math.ceil(items.length / columns));
    if (columnIndex >= columns) columnIndex = columns - 1;
    console.log(columnIndex);
    console.log(orderedColumns);

    orderedColumns[columnIndex].push(item);
  });

  return orderedColumns;
}
