import { render } from "@testing-library/react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbCurrentItem } from "./Breadcrumb";

describe("Breadcrumb", () => {
  it('should render a nav with an aria-label of "breadcrumb"', () => {
    const { getByLabelText } = render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/getting-started">Getting started</BreadcrumbItem>
        <BreadcrumbCurrentItem>Installation</BreadcrumbCurrentItem>
      </Breadcrumb>
    );
    expect(getByLabelText("breadcrumb")).toBeTruthy();
    expect(getByLabelText("breadcrumb").tagName).toBe("NAV");
  });

  it("should render the provided aria-label", () => {
    const { getByLabelText } = render(
      <Breadcrumb aria-label="custom">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/getting-started">Getting started</BreadcrumbItem>
        <BreadcrumbCurrentItem>Installation</BreadcrumbCurrentItem>
      </Breadcrumb>
    );
    expect(getByLabelText("custom")).toBeTruthy();
  });

  it("should render the provided Breadcrumb", () => {
    const { getByText } = render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/getting-started">Getting started</BreadcrumbItem>
        <BreadcrumbCurrentItem>Installation</BreadcrumbCurrentItem>
      </Breadcrumb>
    );
    expect(getByText("Home")).toBeTruthy();
    expect(getByText("Getting started")).toBeTruthy();
    expect(getByText("Installation")).toBeTruthy();
  });

  it("should render the separator between Breadcrumb", () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/getting-started">Getting started</BreadcrumbItem>
        <BreadcrumbCurrentItem>Installation</BreadcrumbCurrentItem>
      </Breadcrumb>
    );
    // separator icons from react-lucide have lucide class
    expect(container.querySelectorAll(".lucide")).toHaveLength(2);
  });

  it("should render the correct separator", () => {
    const { container } = render(
      <Breadcrumb separator="slash">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/getting-started">Getting started</BreadcrumbItem>
        <BreadcrumbCurrentItem>Installation</BreadcrumbCurrentItem>
      </Breadcrumb>
    );
    expect(container.querySelector(".lucide-slash")).toBeTruthy();
  });

  it("should render CurrentItem with aria-current='page'", () => {
    const { getByText } = render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/getting-started">Getting started</BreadcrumbItem>
        <BreadcrumbCurrentItem>Installation</BreadcrumbCurrentItem>
      </Breadcrumb>
    );
    expect(getByText("Installation").getAttribute("aria-current")).toBe("page");
  });

  it("should render CurrentItem with aria-current='page' if not last item", () => {
    const { getByText } = render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbCurrentItem href="/getting-started">Getting started</BreadcrumbCurrentItem>
        <BreadcrumbItem>Installation</BreadcrumbItem>
      </Breadcrumb>
    );
    expect(getByText("Getting started").getAttribute("aria-current")).toBe("page");
    expect(getByText("Installation").getAttribute("aria-current")).toBeNull();
  });

  it("should only render link if there is an href", () => {
    const { getByText } = render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/getting-started">Getting started</BreadcrumbItem>
        <BreadcrumbCurrentItem>Installation</BreadcrumbCurrentItem>
      </Breadcrumb>
    );
    expect(getByText("Home").tagName).toBe("A");
    expect(getByText("Installation").tagName).not.toBe("A");
  });

  it("should render custom link component instead of an anchor tag", () => {
    const { getByText } = render(
      <Breadcrumb>
        <BreadcrumbItem asChild>
          <a href="/" data-custom="mycustom">Home</a>
        </BreadcrumbItem>
        <BreadcrumbItem asChild>
          <a href="/getting-started" data-custom="mycustom">Getting started</a>
        </BreadcrumbItem>
        <BreadcrumbCurrentItem>Installation</BreadcrumbCurrentItem>
      </Breadcrumb>
    );

    expect(getByText("Home").tagName).toBe("A");
    expect(getByText("Home").getAttribute("data-custom")).toBe("mycustom");
  });

  
  it("should render custom link component instead of an anchor tag", () => {
    const { getByText } = render(
      <Breadcrumb>
        <BreadcrumbItem asChild>
          <a data-custom="mycustom">Home</a>
        </BreadcrumbItem>
        <BreadcrumbItem asChild>
          <a href="/getting-started" data-custom="mycustom">Getting started</a>
        </BreadcrumbItem>
        <BreadcrumbCurrentItem>Installation</BreadcrumbCurrentItem>
      </Breadcrumb>
    );

    expect(getByText("Home").tagName).toBe("A");
    expect(getByText("Home").getAttribute("data-custom")).toBe("mycustom");
  });

  it("should warn if BreadcrumbItem has more than one child when using asChild prop", () => {
    const spy = jest.spyOn(console, "warn").mockImplementation();
    render(
      <Breadcrumb>
        <BreadcrumbItem asChild>
          <a href="/">Home</a>
          <span>Home</span>
        </BreadcrumbItem>
      </Breadcrumb>
    );
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
