import type { Meta, StoryObj } from '@storybook/react';

import { FolderStructure } from './FolderStructure';

const meta: Meta<typeof FolderStructure> = {
  component: FolderStructure,
};
export default meta;

type Story = StoryObj<typeof FolderStructure>;

export const Basic: Story = {
  args: {
    data: {
      name: 'src',
      children: [
        {
          name: 'FolderStructure',
          children: [
            {
              name: 'FolderStructure.tsx',
            },
            {
              name: 'FolderStructure.types.ts',
            },
            {
              name: 'FolderStructure.stories.tsx',
            },
          ],
        },
        {
          name: 'Indentation',
          children: [
            {
              name: 'Indentation.tsx',
            },
            {
              name: 'Indentation.types.ts',
            },
            {
              name: 'Indentation.stories.tsx',
            },
          ],
        },
        {
          name: 'index.tsx',
        },
      ],
    },
    }
};

