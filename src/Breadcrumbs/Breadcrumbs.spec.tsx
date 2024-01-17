import { render } from "@testing-library/react";
import { Breadcrumbs } from "./Breadcrumbs";

describe("Breadcrumbs", () => {
  const testBreadcrumbs = [
    {
      text: "Home",
      href: "/",
    },
    {
      text: "Getting started",
      href: "/getting-started",
    },
    {
      text: "Installation",
      href: "/getting-started/installation",
    },
  ];

  it('should render a nav with an aria-label of "breadcrumbs"', () => {
    const { getByLabelText } = render(
      <Breadcrumbs breadcrumbs={testBreadcrumbs} />
    );
    expect(getByLabelText("breadcrumbs")).toBeTruthy();
    expect(getByLabelText("breadcrumbs").tagName).toBe("NAV");
  });

  it("should render the provided aria-label", () => {
    const { getByLabelText } = render(
      <Breadcrumbs breadcrumbs={testBreadcrumbs} aria-label="custom" />
    );
    expect(getByLabelText("custom")).toBeTruthy();
  });

  it("should render the provided breadcrumbs", () => {
    const { getByText } = render(<Breadcrumbs breadcrumbs={testBreadcrumbs} />);
    expect(getByText("Home")).toBeTruthy();
    expect(getByText("Getting started")).toBeTruthy();
    expect(getByText("Installation")).toBeTruthy();
  });

  it("should render the last breaddcrumb with aria-current='page'", () => {
    const { getByText } = render(<Breadcrumbs breadcrumbs={testBreadcrumbs} />);
    expect(getByText("Installation").getAttribute("aria-current")).toBe("page");
  });

  it("should not render the last breadcrumb as a link", () => {
    const { getByText } = render(<Breadcrumbs breadcrumbs={testBreadcrumbs} />);
    expect(getByText("Installation").tagName).toBe("LI");
  });
});
