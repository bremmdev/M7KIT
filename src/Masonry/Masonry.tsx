import React from "react";
import type { MasonryProps } from "./Masonry.types";
import { cn } from "../utils/cn";
import { orderItems } from "./Masonry.utils";

export const Masonry = (props: MasonryProps) => {
  const {
    columns = 3,
    spacing = 16,
    columnOrder = "horizontal",
    children,
  } = props;

  if (columns < 1 || columns > 6)
    throw new Error("The number of columns must be between 1 and 6");

  const orderedColumns = orderItems(
    React.Children.toArray(children).filter(React.isValidElement),
    columns,
    columnOrder
  );

  const styles = {
    gap: `${spacing}px`,
  };

  const childStyles = {
    flexBasis: `calc(100% / ${columns} - ${spacing}px)`,
    gap: `${spacing}px`,
  };

  return (
    <div className={cn(`flex justify-center`)} style={styles}>
      {orderedColumns.map((orderedColumn, idx) => (
        <div key={idx} className="flex flex-col" style={childStyles}>
          {orderedColumn.map((item, idx) => (
            <div className="[&>*]:w-full" key={idx}>
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
