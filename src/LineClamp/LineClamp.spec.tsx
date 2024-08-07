import { render } from "@testing-library/react";
import { LineClamp, LineClampRoot } from "./LineClamp";

describe("LineClamp", () => {
  it("renders the children", () => {
    const { getByText } = render(
      <LineClampRoot>
        <LineClamp>Some text</LineClamp>
      </LineClampRoot>
    );
    expect(getByText("Some text")).toBeTruthy();
  });

  it("should clamp correct number of lines", () => {
    const { container } = render(
      <LineClampRoot>
        <LineClamp lines={2}>Some text</LineClamp>
      </LineClampRoot>
    );
    const element = container.querySelector("p");

    expect(element).toHaveClass("line-clamp-2");
  });

  it("should clamp to 3 lines by default", () => {
    const { container } = render(
      <LineClampRoot>
        <LineClamp>Some text</LineClamp>
      </LineClampRoot>
    );
    const element = container.querySelector("p");

    expect(element).toHaveClass("line-clamp-3");
  });

  it("should clamp to more than 6 lines using CSS styles", () => {
    const { container } = render(
      <LineClampRoot>
        <LineClamp lines={7}>Some text</LineClamp>
      </LineClampRoot>
    );
    const element = container.querySelector("p");

    expect(element).not.toHaveClass("line-clamp-7");
    expect(element).toHaveAttribute("style");
  });

  it("should render as a different element", () => {
    const { container } = render(
      <LineClampRoot>
        <LineClamp as="h1">Some text</LineClamp>
      </LineClampRoot>
    );
    const element = container.querySelector("h1");

    expect(element).toBeTruthy();
  });
});
