import type { Meta, StoryObj } from "@storybook/react";

import { FolderStructure } from "./FolderStructure";

const meta: Meta<typeof FolderStructure> = {
  component: FolderStructure,
  title: "Components/FolderStructure",
  tags: ["autodocs"],
  argTypes: {
    indentSize: {
      control: {
        type: "select",
        options: [2, 3, 4],
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Component for displaying folder structures or file trees.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof FolderStructure>;

/*
 **  Basic: Flat structure with no nesting
 */

export const Basic: Story = {
  args: {
    data: {
      name: "Component",
      children: [
        {
          name: "Component.tsx",
        },
        {
          name: "Component.types.ts",
        },
        {
          name: "Component.stories.tsx",
        },
      ],
    },
  },
};

/*
 **  Nested: Nested structure with multiple levels
 */

export const Nested: Story = {
  args: {
    indentSize: 2,
    data: {
      name: "src",
      children: [
        {
          name: "FolderStructure",
          children: [
            {
              name: "SubComponent",
              children: [
                {
                  name: "Component.tsx",
                },
                {
                  name: "Component.types.ts",
                },
                {
                  name: "Component.stories.tsx",
                },
              ],
            },
            {
              name: "FolderStructure.tsx",
            },
            {
              name: "FolderStructure.types.ts",
            },
            {
              name: "FolderStructure.stories.tsx",
            },
          ],
        },
        {
          name: "index.tsx",
        },
      ],
    },
  },
};
