import type { Meta, StoryObj } from "@storybook/react";

import { FolderStructure } from "./FolderStructure";

/**
 * The `FolderStructure` component provides a way for displaying folder structures or file trees. It accepts a data prop which is an object with a name and children property.
 * The name property is a string that represents the name of the folder or file. The children property is an array of objects with the same structure as the parent object.
 * The component will recursively render the children of the data object. The component accepts an indentSize prop which is a number that represents the number of indentations for each level.
 * The component accepts a className prop which can be used to override the default styles.
 *
 *
 * ## Usage
 * ```
 * <FolderStructure
 *    data={{
 *     name: "Component",
 *     children: [
 *       {
 *         name: "Component.tsx",
 *       },
 *       {
 *         name: "Component.types.ts",
 *       },
 *       {
 *         name: "Component.stories.tsx",
 *       },
 *     ],
 *   }}
 * />
 * ```
 */

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
};
export default meta;

type Story = StoryObj<typeof FolderStructure>;

/*
 ** Flat structure with no nesting
 */

export const Default: Story = {
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
