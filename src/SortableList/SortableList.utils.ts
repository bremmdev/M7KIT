import React from "react";

export function validateItems(items: Array<React.ReactNode>) {
  if (!Array.isArray(items) || items.length === 0) {
    console.warn("The 'items' prop should be a non-empty array. Did you forget to pass it?");
    return false;
  }
  return true;
}

export function getItemsWithIdsAndLabels(items: Array<React.ReactNode>) {
  if (!validateItems(items)) {
    return [];
  }

  return items.map((item) => ({
    value: item,
    label: extractTextFromNode(item).trim()
  }));
}

// ARIA roles that can't be named, so aria-label is prohibited on them (https://www.w3.org/TR/wai-aria-1.2/#namefromprohibited)
const NAME_PROHIBITED_ROLES = new Set([
  "caption",
  "code",
  "deletion",
  "emphasis",
  "generic",
  "insertion",
  "none",
  "paragraph",
  "presentation",
  "strong",
  "subscript",
  "superscript"
]);

// HTML elements whose implicit role (https://www.w3.org/TR/html-aam-1.0/) is one of the roles above
const NAME_PROHIBITED_ELEMENTS = new Set([
  "b",
  "bdi",
  "bdo",
  "code",
  "data",
  "del",
  "div",
  "em",
  "i",
  "ins",
  "p",
  "pre",
  "q",
  "s",
  "samp",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "u"
]);

// Whether ARIA allows an aria-label on the element. A component can render any element, so its aria-label is trusted
function canBeNamed(type: unknown, role: unknown) {
  if (typeof type !== "string") return true;
  if (typeof role === "string" && role.trim()) {
    // role can list fallback roles, check the first
    return !NAME_PROHIBITED_ROLES.has(role.trim().split(/\s+/)[0]);
  }
  return !NAME_PROHIBITED_ELEMENTS.has(type);
}

const warnedAriaLabels = new Set<string>();

// Dev-only, logged once per message. Stripped from production builds by the consumer's bundler
function warnIgnoredAriaLabel(type: string, label: string) {
  if (process.env.NODE_ENV === "production") return;
  const message =
    `SortableList ignores aria-label="${label}" on <${type}>: ARIA doesn't allow a label on this element and screen readers ` +
    `often don't announce it, so the reorder button uses the item's text instead. To label an emoji or icon, give it role="img".`;
  if (warnedAriaLabels.has(message)) return;
  warnedAriaLabels.add(message);
  console.warn(message);
}

// Extracts text from a React node, handling various types and ignoring aria-hidden elements
// This prevents screenreaders from reading out [object Object] for complex nodes
export function extractTextFromNode(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node).trim();
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

    // Prefer an existing aria-label, but only where ARIA allows one, so the label matches what screen readers announce:
    // on a div or span they often ignore it and read the text
    if (props["aria-label"]) {
      if (canBeNamed(node.type, props.role)) {
        return props["aria-label"];
      }
      warnIgnoredAriaLabel(node.type as string, props["aria-label"]);
    }

    // Recursively extract from children
    if (props.children) {
      return extractTextFromNode(props.children).trim();
    }
  }

  return "";
}
