export function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
  //prevent body scrolling when dragging an item
  document.body.classList.add("overflow-hidden");
  const touch = e.touches[0];
  const target = e.currentTarget;
  target.dataset.touchId = touch.identifier.toString();
  target.dataset.touchStartX = touch.clientX.toString();
  target.dataset.touchStartY = touch.clientY.toString();
}

export function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
  const touch = e.touches[0];
  const target = e.currentTarget;
  const touchId = target.dataset.touchId;
  if (touchId && touch.identifier.toString() === touchId) {
    const startX = parseFloat(target.dataset.touchStartX!);
    const startY = parseFloat(target.dataset.touchStartY!);
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    target.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  }
}

/** This function handles the touchEnd for the dragged tierlist item
 *  It calculates the drop target and returns the index of the tierlist rank where the item was dropped
 *  So that the parent component can update the tierlist accordingly
 *  If the item is dropped back to the tierlist, it returns -1 as the targetTierIdx and isUnranking as true so that the parent component
 * can unrank the item
 */
export function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
  document.body.classList.remove("overflow-hidden");
  const target = e.currentTarget;
  target.style.transform = "";
  delete target.dataset.touchId;
  delete target.dataset.touchStartX;
  delete target.dataset.touchStartY;

  const touch = e.changedTouches[0];
  const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);

  let targetTierIdx = -1;

  //check if the drop target is a tier, or a child of a tier (i.e another item in the same tier)
  if (dropTarget instanceof HTMLElement) {
    //check if we are dropping the item back to the tierlist
    if (dropTarget.closest("[data-id=tierlist-items]")) {
      return {
        targetTierIdx: -1,
        isUnranking: true
      };
    }

    const tier = dropTarget.closest("[data-tierlist-tier-idx]");
    if (tier) {
      targetTierIdx = parseInt((tier as HTMLElement).dataset.tierlistTierIdx || "-1");
    }
  }

  return {
    isUnranking: false,
    targetTierIdx
  };
}
