import React from "react";

export function validateItems(items: Array<React.ReactNode>) {
  if (!Array.isArray(items) || items.length === 0) {
    console.warn(
      "The 'items' prop should be a non-empty array. Did you forget to pass it?"
    );
    return false;
  }
  return true;
}

export function getItemsWithIdsAndLabels(items: Array<React.ReactNode>) {
  return items.map((item) => ({
    id: crypto.randomUUID(),
    value: item,
    label: extractTextFromNode(item).trimEnd(),
  }));
}

// Extracts text from a React node, handling various types and ignoring aria-hidden elements
// This prevents screenreaders from reading out [object Object] for complex nodes
function extractTextFromNode(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (node == null || typeof node === "boolean") {
    return "";
  }

  if (Array.isArray(node)) {
    return node.map(extractTextFromNode).join(" ");
  }

  // Handle React elements
  if (React.isValidElement(node)) {
    const props = node.props as { [key: string]: any };

    // Skip aria-hidden elements
    if (props["aria-hidden"] === true || props["aria-hidden"] === "true") {
      return "";
    }

    // Prefer existing aria-label for accessibility
    if (props["aria-label"]) {
      return props["aria-label"];
    }

    // Recursively extract from children
    if (props.children) {
      return extractTextFromNode(props.children);
    }
  }

  return "";
}
