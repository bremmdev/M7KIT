import type { Meta, StoryObj } from "@storybook/react";

import { FolderStructure } from "./FolderStructure";

const meta: Meta<typeof FolderStructure> = {
  component: FolderStructure,
  title: "Components/FolderStructure",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: 'Component for displaying hierarchical data structures. It uses Folder and File subcomponents to represent nodes in a file-tree hierarchy. It use an Indentation subcomponent to visually represents the depth of each node.',
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
      name: "Indentation",
      children: [
        {
          name: "Indentation.tsx",
        },
        {
          name: "Indentation.types.ts",
        },
        {
          name: "Indentation.stories.tsx",
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
    data: {
      name: "src",
      children: [
        {
          name: "FolderStructure",
          children: [
            {
              name: "Indentation",
              children: [
                {
                  name: "Indentation.tsx",
                },
                {
                  name: "Indentation.types.ts",
                },
                {
                  name: "Indentation.stories.tsx",
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
