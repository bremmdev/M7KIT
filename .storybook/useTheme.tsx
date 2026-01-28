import React from "react";
import { primaryColors } from "./preview";

type PrimaryColorKey = keyof typeof primaryColors;

export const useTheme = (Story, context) => {
  const selectedTheme = context.globals.theme || "light";
  const selectedColor: PrimaryColorKey = context.globals.primaryColor || "pink";

  const colorConfig = primaryColors[selectedColor];

  const isButtonStory = context.kind === "Components/Button";

  // For Button story, we want to use the light color for the button accent to make the buttons more visible
  // We use one color picker for the accent color and the button accent color, even though button accent is the same for light and dark mode
  let colorValue = selectedTheme === "dark" ? colorConfig?.dark : colorConfig?.light;
  if (isButtonStory) {
    colorValue = colorConfig?.light;
  }

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", selectedTheme);
  }, [selectedTheme]);

  return (
    <div
      data-theme={selectedTheme}
      className="h-min bg-background text-foreground p-4"
      style={
        {
          "--color-accent": colorValue,
          "--color-button-accent": colorValue
        } as React.CSSProperties
      }
    >
      <Story />
    </div>
  );
};
