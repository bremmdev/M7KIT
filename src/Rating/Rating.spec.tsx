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
    render(<Rating max={5} value={3.5} />);
    expect(document.querySelector("svg.half-star")).toBeTruthy();
  });

  it("should render half star when it is rounded to .5", () => {
    render(<Rating max={5} value={3.8} />);
    expect(document.querySelector("svg.half-star")).not.toBeTruthy();
  });

  it("should render the correct number of filled stars", () => {
    render(<Rating max={5} value={3} />);
    expect(document.querySelectorAll("svg.fill-amber-300").length).toBe(3);
  });

  it("should render the correct number of filled stars when value is decimal", () => {
    render(<Rating max={5} value={3.5} />);
    expect(
      document.querySelectorAll("svg.fill-amber-300:not(.half-star)").length
    ).toBe(3);
  });

  it("should render correct label", () => {
    render(<Rating max={5} value={3.5} />);
    expect(document.querySelector(".visually-hidden")).toHaveTextContent("Rating is 3.5 out of 5");
  });
});
