import React from "react";
import { LineClampContext } from "./LineClampContext";

/**
 * Get the line clamp styling based on the number of lines
 * For up to 6 lines, use Tailwind CSS classes
 * For more than 6 lines, use CSS styles to provide maximum flexibility
 */

export function getLineClampStyling(lines: number) {
  const lineClampStyles =
    lines && lines > 6
      ? {
          overflow: "hidden",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical" as const,
          WebkitLineClamp: lines
        }
      : {};

  return {
    lineClampStyles,
    lineClampClass: getLineClampClass(lines)
  };
}

function getLineClampClass(lines: number) {
  if (lines > 0 && lines <= 6) {
    const lineClampClasses = {
      "1": "line-clamp-1",
      "2": "line-clamp-2",
      "3": "line-clamp-3",
      "4": "line-clamp-4",
      "5": "line-clamp-5",
      "6": "line-clamp-6"
    } as const;

    return lineClampClasses[lines.toString() as keyof typeof lineClampClasses];
  }
  return "";
}

export const useLineClampContext = () => {
  const context = React.useContext(LineClampContext);

  if (!context) {
    throw new Error("useLineClampContext must be used within a LineClampProvider");
  }

  return context;
};
