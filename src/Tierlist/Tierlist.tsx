import React from "react";
import {
  defaultLabels,
  defaultLabelColors,
  TierListItemsProps,
  TierListLabelProps,
  TierlistProps,
  TierListRankProps,
  RankedItems,
} from "./Tierlist.types";
import { cn } from "../utils/cn";

const TierListItems = (props: TierListItemsProps) => {
  const { children, className, onUnrankDrop, rankedItems, ...rest } = props;

  function handleDragStart(e: React.DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData("text/plain", e.currentTarget.dataset.id!);
  }

  //handle body scrolling when dragging an item
  React.useEffect(() => {
    function handleDragOver(e: DragEvent) {
      const { clientY } = e;
      const scrollSpeed = 5;
      const threshold = 100; // Distance from the edge to start scrolling

      if (clientY < threshold) {
        window.scrollBy(0, -scrollSpeed);
      } else if (clientY > window.innerHeight - threshold) {
        window.scrollBy(0, scrollSpeed);
      }
    }

    window.addEventListener("dragover", handleDragOver);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
    };
  }, []);

  if (!Array.isArray(children)) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-wrap gap-2 select-none items-center rounded-md p-8 my-4 border border-clr-border border-dashed",
        className
      )}
      onDrop={onUnrankDrop}
      onDragOver={(e) => e.preventDefault()}
      {...rest}
    >
      {React.Children.map(children, (child, idx) => {
        //check if the item is already in a rank, so we can hide it from the list
        const isRanked =
          rankedItems
            .flat()
            .findIndex(
              (item) => item.props["data-id"] === child.props["data-id"]
            ) !== -1;

        return (
          <React.Fragment key={`tierlist-item-${idx}`}>
            {React.cloneElement(child, {
              key: `tierlistitem-${idx}`,
              className: cn(child.props.className, "cursor-pointer", {
                hidden: isRanked,
              }),
              draggable: true,
              onDragStart: handleDragStart,
              "data-id": idx,
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const TierListLabel = (props: TierListLabelProps) => {
  const { children: label, color } = props;

  return (
    <div
      className="flex items-center px-2 justify-center self-stretch min-w-24 max-w-32 w-fit font-medium text-slate-700 select-none flex-1"
      style={{ backgroundColor: color }}
    >
      {label}
    </div>
  );
};

const TierListRank = (props: TierListRankProps) => {
  const { items, onDrop } = props;

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    //allow drop on this element
    e.preventDefault();
  }

  function handleRankedDragStart(e: React.DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData("text/plain", e.currentTarget.dataset.id!);
  }

  return (
    <div
      className="flex gap-4 p-4 min-h-16 flex-wrap flex-1 items-center"
      onDragOver={handleDragOver}
      onDrop={onDrop}
    >
      {React.Children.map(items, (child, idx) =>
        React.cloneElement(child, {
          key: `rankeditem-${idx}`,
          className: cn(child.props.className, "cursor-pointer"),
          draggable: true,
          onDragStart: handleRankedDragStart,
        })
      )}
    </div>
  );
};

export const Tierlist = (props: TierlistProps) => {
  const {
    children,
    className,
    labels = defaultLabels,
    labelColors = defaultLabelColors,
    onDrop,
    ...rest
  } = props;

  //keep track of the items in each tier rank
  const [rankedItems, setRankedItems] = React.useState<RankedItems>(
    labels.map(() => [])
  );

  if (!React.Children.toArray(children).every(React.isValidElement)) {
    throw new Error(
      "Tierlist only accepts valid React elements as children, not strings or numbers."
    );
  }

  //add a data-id attribute to each child element so we can identify it when dragging
  const childrenWithProps = React.Children.map(children, (child, idx) => {
    return React.cloneElement(child as React.ReactElement, {
      "data-id": idx,
    });
  }) as React.ReactElement[];

  function handleDrop(rankIdx: number, e: React.DragEvent<HTMLDivElement>) {
    //get the data-id attribute of the dragged element
    const draggedItemId = e.dataTransfer.getData("text/plain");

    const draggedItem = childrenWithProps[parseInt(draggedItemId)];

    //if we dragged an item that is not in the list, return
    if (!draggedItem) return;

    /**
     * update the state with the new item
     * if the item is already in a rank, remove it from the rank first
     * then add it to the new rank
     **/
    const newItems = rankedItems.map((items, idx) => {
      if (idx === rankIdx) {
        // Check if the item already exists in the target rank
        const itemExists = items.some(
          (item) => item.props["data-id"] === parseInt(draggedItemId)
        );
        if (!itemExists) {
          return [...items, draggedItem];
        }
        return items;
      } else {
        return items.filter(
          (item) => item.props["data-id"] !== parseInt(draggedItemId)
        );
      }
    });

    //call the onDrop callback if the item was dropped into a different rank
    const currentRankIdx = rankedItems.findIndex((items) =>
      items.some((item) => item.props["data-id"] === parseInt(draggedItemId))
    );

    if (currentRankIdx !== rankIdx && onDrop) {
      onDrop(labels[rankIdx]);
    }

    setRankedItems(newItems);
  }

  const handleUnrankDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const draggedItemId = e.dataTransfer.getData("text/plain");

    //remove the item from the rank
    const newItems = rankedItems.map((items) =>
      items.filter((item) => item.props["data-id"] !== parseInt(draggedItemId))
    );

    setRankedItems(newItems);
  };

  return (
    <div className={cn("text-clr-text select-none", className)} {...rest}>
      <div className="flex flex-col border border-clr-border">
        {labels.map((label, idx) => {
          return (
            <div
              className="flex justify-between items-center border-b border-b-clr-border last-of-type:border-b-0"
              key={label}
            >
              <TierListLabel color={labelColors[idx]}>{label}</TierListLabel>
              <TierListRank
                key={`${label}-rank`}
                items={rankedItems[idx]}
                onDrop={handleDrop.bind(null, idx)}
              />
            </div>
          );
        })}
      </div>
      <TierListItems rankedItems={rankedItems} onUnrankDrop={handleUnrankDrop}>
        {childrenWithProps}
      </TierListItems>
    </div>
  );
};
