import React from "react";
import {
  defaultLabels,
  defaultLabelColors,
  TierListItemsProps,
  TierListLabelProps,
  TierlistProps,
  TierListTierProps,
  RankedItems,
} from "./Tierlist.types";
import {
  handleTouchEnd,
  handleTouchMove,
  handleTouchStart,
} from "./Tierlist.utils";
import { cn } from "../utils/cn";

const TierListItems = (props: TierListItemsProps) => {
  const {
    children,
    onTouchDrop,
    onUnrankDrop,
    rankedItems,
    itemsClasses,
    ...rest
  } = props;

  function handleDragStart(e: React.DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData("text/plain", e.currentTarget.dataset.id!);
  }

  //handle body scrolling when dragging an item
  React.useEffect(() => {
    function handleDragOver(e: DragEvent | TouchEvent) {
      //get the clientY position of the cursor or touch
      const clientY = "clientY" in e ? e.clientY : e.touches[0].clientY;
      const scrollSpeed = 5;
      const threshold = 100; // Distance from the edge to start scrolling

      if (clientY < threshold) {
        window.scrollBy(0, -scrollSpeed);
      } else if (clientY > window.innerHeight - threshold) {
        window.scrollBy(0, scrollSpeed);
      }
    }

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("touchmove", handleDragOver);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("touchmove", handleDragOver);
    };
  }, []);

  function handleTouchDrop(e: React.TouchEvent<HTMLDivElement>) {
    const { targetTierIdx } = handleTouchEnd(e);

    if (targetTierIdx === -1) return;

    //provide the rank index and the item id to the parent component
    onTouchDrop(targetTierIdx, parseInt((e.target as HTMLElement).dataset.id!));
  }

  function handleOnUnrankDrop(e: React.DragEvent<HTMLDivElement>) {
    const draggedItemId = e.dataTransfer.getData("text/plain");
    onUnrankDrop(parseInt(draggedItemId));
  }

  if (!Array.isArray(children)) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-wrap gap-2 select-none items-center rounded-md p-8 my-4 border border-clr-border border-dashed",
        itemsClasses
      )}
      data-id="tierlist-items"
      onDrop={handleOnUnrankDrop}
      onDragOver={(e) => e.preventDefault()}
      {...rest}
    >
      {React.Children.map(children, (child, idx) => {
        //check if the item is already in a tier, so we can hide it from the list
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
              onTouchStart: handleTouchStart,
              onTouchMove: handleTouchMove,
              onTouchEnd: handleTouchDrop,
              "data-id": idx,
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const TierListLabel = (props: TierListLabelProps) => {
  const { children: label, color, labelClasses } = props;

  return (
    <div
      className={cn(
        "flex items-center px-2 justify-center self-stretch min-w-24 max-w-32 w-fit font-medium text-slate-700 select-none flex-1",
        labelClasses
      )}
      style={{ backgroundColor: color }}
    >
      {label}
    </div>
  );
};

const TierListTier = (props: TierListTierProps) => {
  const { items, idx, onDrop, onUnrankDrop, onTouchDrop, tierClasses } = props;

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    //allow drop on this element
    e.preventDefault();
  }

  function handleRankedDragStart(e: React.DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData("text/plain", e.currentTarget.dataset.id!);
  }

  function handleTouchDrop(e: React.TouchEvent<HTMLDivElement>) {
    const { isUnranking, targetTierIdx } = handleTouchEnd(e);

    const itemId = parseInt((e.target as HTMLElement).dataset.id!);

    //fire unranking callback if the item was dropped back to the list
    if (isUnranking) {
      onUnrankDrop(itemId);
      return;
    }

    if (targetTierIdx === -1) return;

    //provide the rank index and the item id to the parent component
    onTouchDrop(targetTierIdx, itemId);
  }

  return (
    <div
      className={cn(
        "flex gap-4 p-4 min-h-24 flex-wrap flex-1 items-center",
        tierClasses
      )}
      onDragOver={handleDragOver}
      onDrop={onDrop}
      data-tierlist-tier-idx={idx}
    >
      {React.Children.map(items, (child, idx) =>
        React.cloneElement(child, {
          key: `rankeditem-${idx}`,
          className: cn(child.props.className, "cursor-pointer"),
          draggable: true,
          onDragStart: handleRankedDragStart,
          onTouchStart: handleTouchStart,
          onTouchMove: handleTouchMove,
          onTouchEnd: handleTouchDrop,
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
    onTierDrop,
    itemsClasses,
    labelClasses,
    tierClasses,
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

  function rankItems(rankIdx: number, itemId: number) {
    const draggedItem = childrenWithProps[itemId];

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
          (item) => item.props["data-id"] === itemId
        );
        if (!itemExists) {
          return [...items, draggedItem];
        }
        return items;
      } else {
        return items.filter((item) => item.props["data-id"] !== itemId);
      }
    });

    //call the onDrop callback if the item was dropped into a different rank
    const currentRankIdx = rankedItems.findIndex((items) =>
      items.some((item) => item.props["data-id"] === itemId)
    );

    if (currentRankIdx !== rankIdx && onTierDrop) {
      onTierDrop(labels[rankIdx]);
    }

    setRankedItems(newItems);
  }

  function handleDropInTier(
    rankIdx: number,
    e: React.DragEvent<HTMLDivElement>
  ) {
    //get the data-id attribute of the dragged element
    const draggedItemId = e.dataTransfer.getData("text/plain");
    rankItems(rankIdx, parseInt(draggedItemId));
  }

  function handleTouchDrop(rankIdx: number, itemId: number) {
    rankItems(rankIdx, itemId);
  }

  function handleUnrankDrop(itemId: number) {
    //remove the item from the rank
    const newItems = rankedItems.map((items) =>
      items.filter((item) => item.props["data-id"] !== itemId)
    );

    setRankedItems(newItems);
  }

  return (
    <div className={cn("text-clr-text select-none", className)} {...rest}>
      <div className="flex flex-col border border-clr-border">
        {labels.map((label, idx) => {
          return (
            <div
              className="flex justify-between items-center border-b border-b-clr-border last-of-type:border-b-0"
              key={label}
            >
              <TierListLabel
                color={labelColors[idx]}
                labelClasses={labelClasses}
              >
                {label}
              </TierListLabel>
              <TierListTier
                key={`${label}-tier`}
                idx={idx}
                items={rankedItems[idx]}
                onDrop={handleDropInTier.bind(null, idx)}
                onTouchDrop={handleTouchDrop}
                onUnrankDrop={handleUnrankDrop}
                tierClasses={tierClasses}
              />
            </div>
          );
        })}
      </div>
      <TierListItems
        rankedItems={rankedItems}
        onUnrankDrop={handleUnrankDrop}
        onTouchDrop={handleTouchDrop}
        itemsClasses={itemsClasses}
      >
        {childrenWithProps}
      </TierListItems>
    </div>
  );
};
