import React from "react";

export function divideIntoGroups(arr: React.ReactNode[], maxInGroup: number) {
  const groups: Array<Array<React.ReactNode>> = [];
  let currentGroup: React.ReactNode[] = [];
  let maxItemsInGroup = maxInGroup; // Start with the max amount of items in the first group

  arr.forEach((item) => {
    if (currentGroup.length === 0 || currentGroup.length < maxItemsInGroup) {
      currentGroup.push(item);
    } else {
      groups.push(currentGroup);
      currentGroup = [item];
      maxItemsInGroup =
        maxItemsInGroup === maxInGroup ? maxInGroup - 1 : maxInGroup; // Toggle between group sizes
    }
  });

  // Push the last group if it's not empty
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
}

export function getPositioning(
  groupLength: number,
  idx: number,
  itemWidth: number,
  maxItemsInGroup: number
) {
  const isSmallerGroup = groupLength < maxItemsInGroup;

  const shouldCenter =
    isSmallerGroup && groupLength === maxItemsInGroup - 1 && idx % 2 !== 0;
  const shouldAdjust = groupLength < maxItemsInGroup - 1;

  let amountToAdjust = 0;
  if (shouldAdjust) {
    amountToAdjust = idx % 2 === 0 ? itemWidth + 4 : itemWidth / 2;
  }

  return { shouldCenter, amountToAdjust };
}
