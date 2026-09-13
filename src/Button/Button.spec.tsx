import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

type LinkProps = { to: string } & React.ComponentPropsWithoutRef<"a">;
const Link = ({ to, ...rest }: LinkProps) => <a href={to} {...rest} />;
const RefLink = React.forwardRef<HTMLAnchorElement, LinkProps>(({ to, ...rest }, ref) => (
  <a ref={ref} href={to} {...rest} />
));

describe("Button", () => {
  it("should render a button by default", () => {
    const { getByRole } = render(<Button>Get started</Button>);
    expect(getByRole("button")).toBeTruthy();
  });

  it("should default to type button so it does not submit a surrounding form", () => {
    const { getByRole } = render(<Button>Get started</Button>);
    expect(getByRole("button").getAttribute("type")).toBe("button");
  });

  it("should keep an explicit type", () => {
    const { getByRole } = render(<Button type="submit">Get started</Button>);
    expect(getByRole("button").getAttribute("type")).toBe("submit");
  });

  it("should not submit a surrounding form by default", async () => {
    const onSubmit = jest.fn((e: React.FormEvent) => e.preventDefault());
    const { getByRole } = render(
      <form onSubmit={onSubmit}>
        <Button>Get started</Button>
      </form>
    );
    await userEvent.click(getByRole("button"));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should disable the button while loading", () => {
    const { getByRole } = render(<Button isLoading>Get started</Button>);
    expect(getByRole("button")).toBeDisabled();
  });

  it("should not let an explicit disabled={false} re-enable a loading button", () => {
    const { getByRole } = render(
      <Button isLoading disabled={false}>
        Get started
      </Button>
    );
    expect(getByRole("button")).toBeDisabled();
  });

  it("should not put a disabled attribute on an anchor", () => {
    const { getByRole } = render(
      <Button as="a" href="/getting-started" isLoading>
        Get started
      </Button>
    );
    const link = getByRole("link");
    expect(link.hasAttribute("disabled")).toBe(false);
    expect(link.getAttribute("aria-disabled")).toBe("true");
  });

  it("should not put a disabled or type attribute on a custom link component", () => {
    const { getByRole } = render(
      <Button as={Link} to="/getting-started" isLoading>
        Get started
      </Button>
    );
    const link = getByRole("link");
    expect(link.hasAttribute("disabled")).toBe(false);
    expect(link.hasAttribute("type")).toBe(false);
    expect(link.getAttribute("aria-disabled")).toBe("true");
  });

  it("should not mark an idle link as disabled or busy", () => {
    const { getByRole } = render(
      <Button as="a" href="/getting-started">
        Get started
      </Button>
    );
    const link = getByRole("link");
    expect(link.hasAttribute("aria-disabled")).toBe(false);
    expect(link.hasAttribute("aria-busy")).toBe(false);
  });

  it("should mark the loading state as busy", () => {
    const { getByRole } = render(<Button isLoading>Get started</Button>);
    expect(getByRole("button").getAttribute("aria-busy")).toBe("true");
  });

  it("should forward a ref to the underlying button", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Get started</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("should forward a ref to the underlying anchor", () => {
    const ref = React.createRef<HTMLAnchorElement>();
    render(
      <Button as="a" href="/getting-started" ref={ref}>
        Get started
      </Button>
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it("should forward a ref through a custom link component", () => {
    const ref = React.createRef<HTMLAnchorElement>();
    render(
      <Button as={RefLink} to="/getting-started" ref={ref}>
        Get started
      </Button>
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it("should merge custom class names", () => {
    const { getByRole } = render(<Button className="mycustom">Get started</Button>);
    expect(getByRole("button").className).toContain("mycustom");
  });
});
