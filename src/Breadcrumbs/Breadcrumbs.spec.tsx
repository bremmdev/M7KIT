import { render } from "@testing-library/react";
import { Breadcrumbs, BreadcrumbItem } from "./Breadcrumbs";

describe("Breadcrumbs", () => {
  it('should render a nav with an aria-label of "breadcrumbs"', () => {
    const { getByLabelText } = render(
      <Breadcrumbs>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/getting-started">Getting started</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Installation</BreadcrumbItem>
      </Breadcrumbs>
    );
    expect(getByLabelText("breadcrumbs")).toBeTruthy();
    expect(getByLabelText("breadcrumbs").tagName).toBe("NAV");
  });

  it("should render the provided aria-label", () => {
    const { getByLabelText } = render(
      <Breadcrumbs aria-label="custom">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/getting-started">Getting started</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Installation</BreadcrumbItem>
      </Breadcrumbs>
    );
    expect(getByLabelText("custom")).toBeTruthy();
  });

  it("should render the provided breadcrumbs", () => {
    const { getByText } = render(
      <Breadcrumbs>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/getting-started">Getting started</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Installation</BreadcrumbItem>
      </Breadcrumbs>
    );
    expect(getByText("Home")).toBeTruthy();
    expect(getByText("Getting started")).toBeTruthy();
    expect(getByText("Installation")).toBeTruthy();
  });

  it("should render the last breadcrumb with aria-current='page'", () => {
    const { getByText } = render(
      <Breadcrumbs>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/getting-started">Getting started</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Installation</BreadcrumbItem>
      </Breadcrumbs>
    );
    expect(getByText("Installation").getAttribute("aria-current")).toBe("page");
  });

  it("should render the separator between breadcrumbs", () => {
    const { container } = render(
      <Breadcrumbs>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/getting-started">Getting started</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Installation</BreadcrumbItem>
      </Breadcrumbs>
    );
    // separator icons from react-lucide have lucide class
    expect(container.querySelectorAll('.lucide')).toHaveLength(2);
  });

  it("should only render link if there is an href", () => {
    const { getByText } = render(
      <Breadcrumbs>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/getting-started">Getting started</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Installation</BreadcrumbItem>
      </Breadcrumbs>
    );
    expect(getByText("Home").tagName).toBe("A");
    expect(getByText("Installation").tagName).not.toBe("A");
  });

  it("should warn if BreadcrumbItem has more than one child when using asChild prop", () => {
    const spy = jest.spyOn(console, "warn").mockImplementation();
    render(
      <Breadcrumbs>
        <BreadcrumbItem asChild>
          <a href="/">Home</a>
          <span>Home</span>
        </BreadcrumbItem>
      </Breadcrumbs>
    );
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
