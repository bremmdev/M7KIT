import React from "react";
import { cn } from "../utils/cn";
import { SortableListProps } from "./SortableList.types";
import { ChevronsUpDown, GripVertical, Settings } from "lucide-react";
import {
  getItemsWithIdsAndLabels,
  extractTextFromNode,
} from "./SortableList.utils";
import { useFocusTrap } from "../_hooks/useFocusTrap";

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
  "aria-label": ariaLabel,
  className,
  handlePosition = "start",
  items,
  onReorder = () => { },
  title = "",
  titleElement = "h2",
  ...rest
}: SortableListProps) => {
  const [sortedItems, setSortedItems] = React.useState(() =>
    getItemsWithIdsAndLabels(items)
  );

  const [dragStartIndex, setDragStartIndex] = React.useState<number | null>(
    null
  );
  const [draggedItemIndex, setDraggedItemIndex] = React.useState<number | null>(
    null
  );
  const [lastAnnouncement, setLastAnnouncement] = React.useState<string | null>(
    null
  );

  const [touchStartY, setTouchStartY] = React.useState<number | null>(null);
  const dragHandleRefs = React.useRef<Array<HTMLButtonElement>>([]);
  const [editMode, setEditMode] = React.useState<boolean>(false);
  const editModeButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const handleEscapeCallback = React.useCallback(() => {
    setEditMode(false);
    setLastAnnouncement("Exited edit mode");
  }, []);

  // Stable reference for useFocusTrap to prevent focus trap re-initialization
  const focusTrapOptions = React.useMemo(
    () => ({
      condition: editMode,
      onEscape: handleEscapeCallback,
    }),
    [editMode, handleEscapeCallback]
  );

  useFocusTrap(containerRef, focusTrapOptions);

  // we only want to recalculate this when items change from the parent, not when sortedItems change due to reordering
  // we use a memoized string of all labels to compare sortedItems vs items for changes
  const parentLabels = React.useMemo(
    () => items.map(extractTextFromNode).join("|"),
    [items]
  );

  React.useEffect(() => {
    // Compare current vs incoming based on labels
    const localLabels = sortedItems.map((i) => i.label).join("|");

    // Only reset if parent items are truly different, not when just a new array instance with same content
    if (localLabels !== parentLabels) {
      setSortedItems((prev) => {
        const newItems = getItemsWithIdsAndLabels(items);

        // Preserve matching items by label to keep DOM/node identity and focus
        return newItems.map((newItem) => {
          const existing = prev.find((p) => p.label === newItem.label);
          return existing ?? newItem;
        });
      });
    }
  }, [parentLabels]);

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
      const message = `Moved ${sortedItems[draggedItemIndex].label
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
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;

    e.preventDefault(); // prevent scroll

    const newIndex = e.key === "ArrowDown" ? index + 1 : index - 1;
    if (newIndex < 0 || newIndex >= sortedItems.length) return;

    // Reorder items
    const updated = [...sortedItems];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(newIndex, 0, movedItem);
    setSortedItems(updated);

    onReorder?.(updated.map((item) => item.value));

    // Announce change (for screen readers)
    const message = `Moved ${movedItem.label} to position ${newIndex + 1} of ${sortedItems.length
      }`;
    setLastAnnouncement(message);

    // We'll ensure that DOM and refs are stable before moving focus
    const focusTargetIndex = newIndex;

    // Safari sometimes needs one paint *plus* a microtask
    Promise.resolve().then(() => {
      requestAnimationFrame(() => {
        // extra guard for ref existence
        const handle = dragHandleRefs.current[focusTargetIndex];
        if (handle && typeof handle.focus === "function") {
          handle.focus();
        }
      });
    });
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

  function handleTouchStart(e: React.TouchEvent, index: number) {
    setTouchStartY(e.touches[0].clientY);
    setDragStartIndex(index);
    setDraggedItemIndex(index);
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (draggedItemIndex === null || touchStartY === null) return;

    e.preventDefault(); // Prevent scrolling while dragging

    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const listItem = element?.closest("li");

    if (!listItem) return;

    const allItems = Array.from(
      containerRef.current?.querySelectorAll("li") || []
    );
    const newIndex = allItems.indexOf(listItem as HTMLLIElement);

    if (newIndex !== -1 && newIndex !== draggedItemIndex) {
      const updated = [...sortedItems];
      const draggedItem = updated[draggedItemIndex];
      updated.splice(draggedItemIndex, 1);
      updated.splice(newIndex, 0, draggedItem);
      setSortedItems(updated);
      setDraggedItemIndex(newIndex);
    }
  }

  function handleTouchEnd() {
    if (
      dragStartIndex !== null &&
      draggedItemIndex !== null &&
      dragStartIndex !== draggedItemIndex
    ) {
      const message = `Moved ${sortedItems[draggedItemIndex].label
        } to position ${draggedItemIndex + 1} of ${sortedItems.length}`;
      setLastAnnouncement(message);
      onReorder && onReorder(sortedItems.map((item) => item.value));
    }

    setDraggedItemIndex(null);
    setDragStartIndex(null);
    setTouchStartY(null);
  }

  const TitleElement = titleElement || "h2";

  // hidden text for screen readers on the edit mode toggle button for context
  const editModeButtonSRtext = title
    ? `for ${title}`
    : ariaLabel
      ? `for ${ariaLabel}`
      : "";

  return (
    <div
      className={cn("flex flex-col gap-4 w-fit text-foreground", className)}
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
          title="Use arrow keys to reorder items"
          className={cn(
            "shrink-0 cursor-pointer relative flex gap-2 border-none justify-center items-center px-4 py-2 bg-foreground text-foreground-inverse rounded-md w-fit transition-colors focus-ring hover:bg-foreground/90"
          )}
        >
          {editMode ? `Exit Edit Mode` : "Enter Edit Mode"}
          <span className="sr-only">{editModeButtonSRtext}</span>
          <Settings aria-hidden="true" />
        </button>
      </div>
      <div id="sortable-list-instructions" className="sr-only">
        {editMode
          ? "Use the arrow up and down keys to reorder items. Tab to select items. Press Escape to exit edit mode."
          : "You are not in edit mode. Press the button above to enter edit mode and reorder items."}
      </div>
      <ul
        className="space-y-2"
        {...rest}
        aria-roledescription="Sortable List"
        aria-describedby="sortable-list-instructions"
        aria-labelledby={title ? "sortable-list-title" : undefined}
        role="list"
        aria-label={ariaLabel ?? undefined}
      >
        {sortedItems.map((item, index) => (
          <li
            key={item.label}
            draggable={true}
            className={cn(
              "flex items-center gap-4 px-4 py-2 bg-surface-subtle border border-neutral rounded-md cursor-grab",
              {
                "border-accent bg-surface-muted":
                  index === draggedItemIndex && draggedItemIndex !== null,
              }
            )}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDrop={(e) => handleDrop(e)}
            onTouchStart={(e) => handleTouchStart(e, index)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {handlePosition === "end" && <>{item.value}</>}
            {editMode ? (
              <ReorderButton
                index={index}
                totalItems={sortedItems.length}
                onKeyDown={(e) => handleKeyDown(e, index)}
                handlePosition={handlePosition}
                label={`${item.label}`}
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
