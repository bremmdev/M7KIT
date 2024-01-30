import { render } from "@testing-library/react";
import { Rating } from "./Rating";

describe("Rating", () => {
  it("should render the correct number of stars", () => {
    render(<Rating max={5} value={3} />);
    expect(document.querySelectorAll("svg").length).toBe(5);
  });

  it("should render the correct number of stars when value is greater than max", () => {
    render(<Rating max={5} value={6} />);
    expect(document.querySelectorAll("svg").length).toBe(5);
  });

  it("should render the correct number of stars when value is negative", () => {
    render(<Rating max={5} value={-1} />);
    expect(document.querySelectorAll("svg").length).toBe(5);
  });

  it("should render half star when it is rounded to .5", () => {
    const { getByTestId } = render(<Rating max={5} value={3.5} />);
    expect(getByTestId("half-star")).toBeTruthy();
  });

  it("should not render half star when it is not rounded to .5", () => {
    const { queryByTestId } = render(<Rating max={5} value={3.8} />);
    expect(queryByTestId("half-star")).toBeNull();
  });

  it("should render the correct number of filled stars", () => {
    render(<Rating max={5} value={3} />);
    expect(document.querySelectorAll("svg.fill-amber-300").length).toBe(3);
  });

  it("should render correct label", () => {
    render(<Rating max={5} value={3.5} />);
    expect(document.querySelector(".visually-hidden")).toHaveTextContent(
      "Rating is 3.5 out of 5"
    );
  });
});
