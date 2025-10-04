import React from "react";
import { cn } from "../utils/cn";
import { SortableListProps } from "./SortableList.types";
import { GripVertical } from "lucide-react";

const GripHandle = ({
  handlePosition,
  index,
  onDragStart,
  onDragEnd,
}: {
  handlePosition: "start" | "end";
  index: number;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragEnd: (e: React.DragEvent) => void;
}) => (
  <button
    aria-label="Drag handle"
    draggable="true"
    onDragStart={(e) => onDragStart(e, index)}
    onDragEnd={onDragEnd}
    className={cn("focus-ring grid place-items-center", {
      "ml-auto": handlePosition === "end",
    })}
  >
    <GripVertical className={`inline-block cursor-grab`} />
  </button>
);

function getItemsWithIds(items: Array<React.ReactNode>) {
  return items.map((item) => ({
    id: crypto.randomUUID(),
    value: item,
  }));
}

export const SortableList = ({
  className,
  handlePosition = "start",
  onReorder = () => {},
  items,
  ...rest
}: SortableListProps) => {
  // Generate stable IDs for each item on first render
  const itemsWithIds = React.useMemo(
    () => {
      if (!items || !Array.isArray(items) || items.length === 0) {
        console.warn(
          "The 'items' prop should be a non-empty array. Did you forget to pass it?"
        );
        return [];
      }

      return getItemsWithIds(items);
    },
    [items] // Regenerate if items prop changes
  );

  const [sortedItems, setSortedItems] = React.useState(itemsWithIds);
  const [dragStartIndex, setDragStartIndex] = React.useState<number | null>(
    null
  );
  const [draggedItemIndex, setDraggedItemIndex] = React.useState<number | null>(
    null
  );

  const [lastAnnouncement, setLastAnnouncement] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    // Reset sorted items if the items prop changes
    if (items && Array.isArray(items) && items.length > 0) {
      setSortedItems(getItemsWithIds(items));
    }
  }, [items]);

  if (!items || !Array.isArray(items) || items.length === 0) {
    console.warn(
      "The 'items' prop should be a non-empty array. Did you forget to pass it?"
    );
    return null;
  }
  function handleDragStart(e: React.DragEvent, index: number) {
    // only allow dragging if started from the grip handle
    setDragStartIndex(index);
    setDraggedItemIndex(index);

    // Set drag data (required for drop to work)
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());

    // Tell the browser to "carry" the list item and set mouse pointer to center of it
    const li = (e.target as HTMLElement).closest("li");
    if (li) {
      e.dataTransfer.setDragImage(li, li.clientWidth / 2, li.clientHeight / 2);
    }
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault(); // allow dropping

    if (draggedItemIndex === null || index === draggedItemIndex) return;

    // Set drop effect for proper cursor feedback
    e.dataTransfer.dropEffect = "move";

    // show visual feedback by moving the item being dragged over
    const updated = [...sortedItems];
    const draggedItem = updated[draggedItemIndex];
    updated.splice(draggedItemIndex, 1);
    updated.splice(index, 0, draggedItem);
    setSortedItems(updated);
    // update the dragged item index to the new position to prevent flipping
    setDraggedItemIndex(index);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();

    // only announce if dropped inside a valid zone AND order changed
    if (
      dragStartIndex !== null &&
      draggedItemIndex !== null &&
      dragStartIndex !== draggedItemIndex
    ) {
      const message = `Moved ${
        sortedItems[draggedItemIndex].value
      } to position ${draggedItemIndex + 1} of ${sortedItems.length}`;
      setLastAnnouncement(message);
    }

    setDraggedItemIndex(null);
    setDragStartIndex(null);

    // Notify parent
    onReorder && onReorder(sortedItems.map((item) => item.value));
  }

  function handleDragEnd() {
    // Clear the dragged item index when dragging ends so that no item remains highlighted
    setDraggedItemIndex(null);
  }

  return (
    <>
      <ul className={cn("w-fit space-y-2", className)} {...rest}>
        {sortedItems.map((item, index) => (
          <li
            key={index}
            className={cn(
              "flex items-center gap-4 px-4 py-2 bg-clr-bg border border-clr-border rounded-md",
              {
                "border-clr-accent bg-clr-accent-muted":
                  index === draggedItemIndex && draggedItemIndex !== null,
              }
            )}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e)}
          >
            {handlePosition === "start" && (
              <GripHandle
                index={index}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                handlePosition="start"
              />
            )}
            {item.value}
            {handlePosition === "end" && (
              <GripHandle
                index={index}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                handlePosition="end"
              />
            )}
          </li>
        ))}
      </ul>
      <div aria-live="assertive" className="sr-only">
        {lastAnnouncement}
      </div>
    </>
  );
};
