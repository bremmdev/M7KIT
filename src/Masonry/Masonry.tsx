import React from "react";
import type { MasonryProps } from "./Masonry.types";
import { cn } from "../utils/cn";
import { getBreakpointColumns, orderItems } from "./Masonry.utils";
import { useMediaQuery } from "../utils/hooks/useMediaQuery";
import { BreakpointColumns } from "./Masonry.types";
import { Breakpoint } from "../utils/breakpoints";
import { validateColumns } from "./Masonry.utils";

export const Masonry = (props: MasonryProps) => {
  const {
    columns = 3,
    spacing = 16,
    columnOrder = "horizontal",
    children,
  } = props;

  //don't show the component until the breakpoint is calculated, so don't render on the server
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    if (!mounted) setMounted(true);
  }, [mounted]);

  const breakpoint = useMediaQuery();

  //checks if the columns prop is valid and throws an error if it's not
  validateColumns(columns);

  //if columns is a number, it means it's not responsive
  const hasResponsiveColumns = typeof columns !== "number";

  let breakpointToColumns: BreakpointColumns = {};

  if (hasResponsiveColumns) {
    //maps all the breakpoints to the number of columns
    breakpointToColumns = getBreakpointColumns(columns);
  }

  const columnCount = !hasResponsiveColumns
    ? columns
    : breakpointToColumns[breakpoint as Breakpoint] || 3;

  const orderedColumns = orderItems(
    React.Children.toArray(children).filter(React.isValidElement),
    columnCount as number,
    columnOrder
  );

  const styles = {
    gap: `${spacing}px`,
  };

  const childStyles = {
    flexBasis: `calc(100% / ${columnCount} - ${spacing}px)`,
    gap: `${spacing}px`,
  };

  return (
    <div className={cn(`flex justify-center`)} style={styles}>
      {mounted &&
        orderedColumns.map((orderedColumn, idx) => (
          <div
            key={idx}
            className="flex flex-col"
            data-testid="column"
            style={childStyles}
          >
            {orderedColumn.map((item, idx) => (
              <div key={idx} className="[&>*]:w-full">
                {item}
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};
