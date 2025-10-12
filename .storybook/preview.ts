import "../src/index.css";

import type { Preview } from "@storybook/react-vite";
import { useTheme } from "./useTheme";

const preview: Preview = {
  decorators: [useTheme],
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Set global theme for components",
      defaultValue: "light",
      toolbar: {
        items: [
          {
            value: "light",
            title: "☀️ Light ",
          },
          {
            value: "dark",
            title: "🌙 Dark",
          },
        ],
        // Change title based on selected value
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "fullscreen",
    options: {
      storySort: {
        order: ["Components", ["DiamondGrid", ["Overview"]]],
      },
    },
  },
};

export default preview;
