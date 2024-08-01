import { useEffect } from "react";

/* If we change the theme using the toolbar in Storybook, we
   - set the theme in the document's root element
   - change the background color of the body
   - change the background color of the 'overview' part of the docs
*/

export const useTheme = (Story, context) => {
  const selectedTheme = context.globals.theme || "light";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", selectedTheme);

    if (selectedTheme === "dark") {
      document.body.style.backgroundColor = "#0f172a";
      // Change background color of 'overview' part of docs
      document.querySelectorAll(".docs-story").forEach((el) => {
        (el as HTMLElement).style.backgroundColor = "#0f172a";
      });
    } else {
      document.body.style.backgroundColor = "#fff";
    }
  }, [selectedTheme]);

  return Story();
};
