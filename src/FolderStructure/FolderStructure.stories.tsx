import type { Meta, StoryObj } from "@storybook/react-vite";

import { FolderStructure } from "./FolderStructure";

/**
 * The `FolderStructure` component provides a way for displaying folder structures or file trees. It accepts a data prop which is an array with objects. Every object represents a file or a folder.
 * The name property is a string that represents the name of the folder or file. The children property is an array of objects with the same structure as the parent object.
 * The component will recursively render the children of the data object. The component accepts an indentSize prop which is a number that represents the number of indentations for each level.
 * The component accepts a className prop which can be used to override the default styles.
 *
 *
 * ## Usage
 * ```
 * <FolderStructure
 *    data={[
 *    {
 *      name: "Folder",
 *      children: [
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
 *    },
 *    {
 *      name: "file.txt",
 *    }
 *   ]}
 * />
 * ```
 */

const meta: Meta<typeof FolderStructure> = {
  component: FolderStructure,
  title: "Components/FolderStructure",
  tags: ["autodocs"]
};
export default meta;

type Story = StoryObj<typeof FolderStructure>;

/*
 ** Flat structure with no nesting
 */

export const Default: Story = {
  args: {
    data: [
      {
        name: "Component.tsx"
      },
      {
        name: "Component.types.ts"
      },
      {
        name: "Component.stories.tsx"
      }
    ]
  }
};

/*
 **  Nested: Nested structure with multiple levels
 */

export const Nested: Story = {
  args: {
    indent: "normal",
    trailingSlash: true,
    data: [
      {
        name: "src",
        children: [
          {
            name: "Component",
            children: [
              {
                name: "Component.tsx"
              },
              {
                name: "Component.types.ts"
              },
              {
                name: "Component.stories.tsx"
              },
              {
                name: "SubComponent",
                children: [
                  {
                    name: "SubComponent.tsx"
                  },
                  {
                    name: "SubComponent.types.ts"
                  }
                ]
              }
            ]
          },
          {
            name: "Component2",
            children: [
              {
                name: "Component2.tsx"
              },
              {
                name: "Component2.types.ts"
              },
              {
                name: "Component2.stories.tsx"
              }
            ]
          },
          {
            name: "index.ts"
          }
        ]
      },
      {
        name: "lib",
        children: [
          {
            name: "types.ts"
          },
          {
            name: "utils.ts"
          }
        ]
      }
    ]
  }
};
