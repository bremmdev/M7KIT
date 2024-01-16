import { render } from "@testing-library/react";
import { SkipLink } from "./SkipLink";

describe("SkipLink", () => {
  it("should render successfully", () => {
    const { getByText } = render(<SkipLink />);
    expect(getByText("Skip to content")).toBeTruthy();
  });

  it("shoulder render the provided text", () => {
    const { getByText } = render(<SkipLink text="Skip to pagecontent" />);
    expect(getByText("Skip to pagecontent")).toBeTruthy();
  });

  it("should render with the provided targetId", () => {
    const { getByText } = render(<SkipLink targetId="content" />);
    const link = getByText("Skip to content");
    expect(link.getAttribute("href")).toBe("#content");
  });

  it("should render with the default targetId when none is provided", () => {
    const { getByText } = render(<SkipLink />);
    const link = getByText("Skip to content");
    expect(link.getAttribute("href")).toBe("#main");
  });
});
