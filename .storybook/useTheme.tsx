import React from "react";
import { primaryColors } from "./preview";

type PrimaryColorKey = keyof typeof primaryColors;

export const useTheme = (Story, context) => {
    const selectedTheme = context.globals.theme || "light";
    const selectedColor: PrimaryColorKey = context.globals.primaryColor || "pink";

    const colorConfig = primaryColors[selectedColor];
    const colorValue = selectedTheme === "dark" ? colorConfig?.dark : colorConfig?.light;

    React.useEffect(() => {
        document.documentElement.setAttribute("data-theme", selectedTheme);
    }, [selectedTheme]);

    return (
        <div
            data-theme={selectedTheme}
            className="h-min bg-background text-foreground p-4"
            style={{ "--color-accent": colorValue } as React.CSSProperties}
        >
            <Story />
        </div>
    );
};
