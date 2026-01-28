import { render } from "@testing-library/react";
import { FolderStructure } from "./FolderStructure";

describe("FolderStructure", () => {
  const data = [
    {
      name: "Component.tsx"
    },
    {
      name: "Component.types.ts"
    },
    {
      name: "Component.stories.tsx"
    }
  ];

  const nestedData = [
    {
      name: "FolderStructure",
      children: [
        {
          name: "SubComponent",
          children: [
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
        },
        {
          name: "FolderStructure.tsx"
        },
        {
          name: "FolderStructure.types.ts"
        },
        {
          name: "FolderStructure.stories.tsx"
        }
      ]
    },
    {
      name: "index.tsx"
    }
  ];

  it("renders the nodes", () => {
    const { getByText } = render(<FolderStructure data={data} />);
    expect(getByText("Component.tsx")).toBeTruthy();
    expect(getByText("Component.types.ts")).toBeTruthy();
    expect(getByText("Component.stories.tsx")).toBeTruthy();
  });

  it("should not render a folder if it has no children", () => {
    const { queryAllByRole } = render(<FolderStructure data={data} />);
    //folder components render a <details> element that have a role of "group"
    expect(queryAllByRole("group")).toHaveLength(0);
  });

  it("should render the correct number of folders", () => {
    const { getAllByRole } = render(<FolderStructure data={nestedData} />);
    expect(getAllByRole("group")).toHaveLength(2);
  });
});
