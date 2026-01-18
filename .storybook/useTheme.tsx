import React from "react";

export const useTheme = (Story, context) => {
    const selectedTheme = context.globals.theme || "light";

    React.useEffect(() => {
        document.documentElement.setAttribute("data-theme", selectedTheme);
    }, [selectedTheme]);

    return (
        <div
            data-theme={selectedTheme}
            className="h-min bg-background text-foreground p-4"
        >
            <Story />
        </div>
    );
};
