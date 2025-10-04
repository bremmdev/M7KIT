import React from "react";
import { cn } from "../utils/cn";
import { SortableListProps } from "./SortableList.types";
import { ChevronsUpDown, GripVertical, Settings } from "lucide-react";
import { validateItems, getItemsWithIds } from "./SortableList.utils";

const ReorderButton = ({
  handlePosition,
  index,
  totalItems,
  label,
  onKeyDown,
  ref,
}: {
  handlePosition: "start" | "end";
  index: number;
  totalItems: number;
  label: string;
  onKeyDown: (e: React.KeyboardEvent) => void;
  ref: (el: HTMLButtonElement) => void;
}) => (
  <button
    aria-label={`Reorder ${label}. Item ${index + 1} of ${totalItems}.`}
    onKeyDown={onKeyDown}
    ref={ref}
    className={cn("focus-ring grid place-items-center", {
      "ml-auto": handlePosition === "end",
    })}
  >
    <ChevronsUpDown className={`inline-block cursor-grab`} />
  </button>
);

export const SortableList = ({
  className,
  handlePosition = "start",
  items,
  onReorder = () => {},
  title = "",
  titleElement = "h2",
  ...rest
}: SortableListProps) => {
  // Generate stable IDs for each item on first render
  const itemsWithIds = React.useMemo(
    () => {
      if (!validateItems(items)) {
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
  const dragHandleRefs = React.useRef<Array<HTMLButtonElement>>([]);
  const [editMode, setEditMode] = React.useState<boolean>(false);
  const editModeButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    // Reset sorted items if the items prop changes
    if (!validateItems(items)) {
      setSortedItems([]);
      return;
    }

    if (items && Array.isArray(items) && items.length > 0) {
      setSortedItems(getItemsWithIds(items));
    }
  }, [items]);

  function handleDragStart(e: React.DragEvent, index: number) {
    // only allow dragging if started from the grip handle
    setDragStartIndex(index);
    setDraggedItemIndex(index);

    // Set drag data (required for drop to work)
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
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

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      // Prevent page scrolling when pressing arrow keys
      e.preventDefault();

      //reorder items
      const newIndex = e.key === "ArrowDown" ? index + 1 : index - 1;
      if (newIndex < 0 || newIndex >= sortedItems.length) return; // out of bounds

      const updated = [...sortedItems];
      const [movedItem] = updated.splice(index, 1);
      updated.splice(newIndex, 0, movedItem);
      setSortedItems(updated);

      onReorder && onReorder(updated.map((item) => item.value));

      // Announce the move
      const message = `Moved ${movedItem.value} to position ${
        newIndex + 1
      } of ${sortedItems.length}`;
      setLastAnnouncement(message);

      // Move focus to the next/previous item
      const nextIndex = e.key === "ArrowDown" ? index + 1 : index - 1;
      if (dragHandleRefs.current[nextIndex]) {
        dragHandleRefs.current[nextIndex].focus();
      }
    }
  }

  function handleEditModeSwitch() {
    setEditMode(!editMode);
    setLastAnnouncement(editMode ? "Exited edit mode" : "Entered edit mode");
    if (!editMode) {
      // focus first drag handle when entering edit mode
      setTimeout(() => {
        dragHandleRefs.current[0]?.focus();
      }, 0);
    }
  }

  React.useEffect(() => {
    if (!editMode) return;

    function handleFocusTrap(e: KeyboardEvent) {
      // Exit focus trap on Escape
      if (e.key === "Escape") {
        setEditMode(false);
        setLastAnnouncement("Exited edit mode");
        editModeButtonRef.current?.focus();
        return;
      }

      if (e.key !== "Tab" || !containerRef.current) return;

      const focusableElements = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("disabled"));

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const isShiftTab = e.shiftKey;
      const activeEl = document.activeElement as HTMLElement | null;

      // focus loop logic
      if (!containerRef.current.contains(activeEl)) {
        // If focus leaves the container (e.g., via modals or OS shortcuts)
        firstElement.focus();
        e.preventDefault();
        return;
      }

      if (!isShiftTab && activeEl === lastElement) {
        // Tabbing forward past last moves to first
        e.preventDefault();
        firstElement.focus();
      } else if (isShiftTab && activeEl === firstElement) {
        // Shift-Tabbing backward past first moves to last
        e.preventDefault();
        lastElement.focus();
      }
    }

    document.addEventListener("keydown", handleFocusTrap, true);

    return () => {
      document.removeEventListener("keydown", handleFocusTrap, true);
    };
  }, [editMode]);

  const TitleElement = titleElement || "h2";

  return (
    <div
      className={cn("flex flex-col gap-4 w-fit", className)}
      role={editMode ? "application" : undefined}
      ref={containerRef}
    >
      <div className="flex flex-col gap-4">
        {title && (
          <TitleElement
            className="text-lg font-medium"
            id="sortable-list-title"
          >
            {title}
          </TitleElement>
        )}
        <button
          onClick={handleEditModeSwitch}
          ref={editModeButtonRef}
          className={cn(
            "shrink-0 cursor-pointer relative flex gap-2 border-none justify-center items-center px-4 py-2 bg-clr-text text-clr-text-inverted rounded-md w-fit transition-colors focus-ring hover:bg-clr-text/90"
          )}
        >
          {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          <Settings aria-hidden="true" />
        </button>
      </div>
      <div id="sortable-list-instructions" className="sr-only">
        {editMode
          ? "Use the arrow buttons to reorder items. Tab to cycle through items. Press Escape to exit edit mode."
          : "You are not in edit mode. Press the button above to enter edit mode and reorder items."}
      </div>
      <ul
        className="space-y-2"
        {...rest}
        aria-roledescription="Sortable List"
        aria-describedby="sortable-list-instructions"
        aria-labelledby={title ? "sortable-list-title" : undefined}
        role="list"
      >
        {sortedItems.map((item, index) => (
          <li
            key={index}
            draggable={true}
            className={cn(
              "flex items-center gap-4 px-4 py-2 bg-clr-bg border border-clr-border rounded-md cursor-grab",
              {
                "border-clr-accent bg-clr-accent-muted":
                  index === draggedItemIndex && draggedItemIndex !== null,
              }
            )}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDrop={(e) => handleDrop(e)}
          >
            {handlePosition === "end" && <>{item.value}</>}
            {editMode ? (
              <ReorderButton
                index={index}
                totalItems={sortedItems.length}
                onKeyDown={(e) => handleKeyDown(e, index)}
                handlePosition={handlePosition}
                label={`${item.value}`}
                ref={(el: HTMLButtonElement) =>
                  (dragHandleRefs.current[index] = el)
                }
              />
            ) : (
              <GripVertical
                className={cn(`inline-block cursor-grab`, {
                  "ml-auto": handlePosition === "end",
                })}
                aria-hidden="true"
              />
            )}
            {handlePosition === "start" && <>{item.value}</>}
          </li>
        ))}
      </ul>
      <div aria-live="assertive" className="sr-only">
        {lastAnnouncement}
      </div>
    </div>
  );
};
