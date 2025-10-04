export function validateItems(items: Array<React.ReactNode>) {
  if (!Array.isArray(items) || items.length === 0) {
    console.warn(
      "The 'items' prop should be a non-empty array. Did you forget to pass it?"
    );
    return false;
  }
  return true;
}

export function getItemsWithIds(items: Array<React.ReactNode>) {
  return items.map((item) => ({
    id: crypto.randomUUID(),
    value: item,
  }));
}
