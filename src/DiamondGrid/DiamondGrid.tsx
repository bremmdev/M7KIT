import React from "react";
import { cn } from "../utils/cn";
import { DiamondGridProps } from "./DiamondGrid.types";
import { divideIntoGroups } from "./DiamondGrid.utils";
import { getPositioning } from "./DiamondGrid.utils";

export const DiamondGrid = (props: DiamondGridProps) => {
  const { children, className, itemWidth = 250, maxItemsInGroup = 2, ...rest } = props;

  if (!Array.isArray(children)) {
    throw new Error("DiamondGrid component expects children to be an array of items");
  }

  //divide the children into groups. Alternate between sizes based on maxItemsInGroup
  const groups = divideIntoGroups(React.Children.toArray(children), maxItemsInGroup);

  return (
    <div className={cn("flex gap-2 diamond-gallery", className)} style={{ paddingLeft: itemWidth / 2 }} {...rest}>
      {groups.map((group, idx) => {
        const { shouldCenter, amountToAdjust } = getPositioning(group.length, idx, itemWidth, maxItemsInGroup);

        return (
          <div
            key={`group-${idx}`}
            className={`flex flex-col gap-1 ${shouldCenter ? "justify-center" : "justify-start"} shrink-0 has-[:hover]:z-10`}
          >
            {group.map((child, idx) => (
              <div
                key={`item-${idx}`}
                className={`[clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)] [&>img]:w-full [&>img]:aspect-square [&>img]:object-cover [&>img]:rounded-md hover:[clip-path:polygon(0_0,100%_0,100%_100%,0_100%)] transition-all duration-300`}
                style={{
                  marginLeft: -itemWidth / 2,
                  width: itemWidth,
                  height: itemWidth,
                  marginTop: amountToAdjust
                }}
              >
                {child}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
