import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Breadcrumb, BreadcrumbItem, BreadcrumbCurrentItem, BreadcrumbMenu } from "./Breadcrumb";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";

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
          <a href="/" data-custom="mycustom">
            Home
          </a>
        </BreadcrumbItem>
        <BreadcrumbItem asChild>
          <a href="/getting-started" data-custom="mycustom">
            Getting started
          </a>
        </BreadcrumbItem>
        <BreadcrumbCurrentItem>Installation</BreadcrumbCurrentItem>
      </Breadcrumb>
    );

    expect(getByText("Home").tagName).toBe("A");
    expect(getByText("Home").getAttribute("data-custom")).toBe("mycustom");
  });

  it("should pass the link classes and aria-current to a custom link component", () => {
    // Stands in for a router link, which takes `to` instead of `href`
    const CustomLink = ({ to, ...rest }: React.ComponentProps<"a"> & { to: string }) => (
      <a href={to} data-router-link {...rest} />
    );

    const { getByRole } = render(
      <Breadcrumb>
        <BreadcrumbItem asChild>
          <CustomLink to="/">Home</CustomLink>
        </BreadcrumbItem>
        <BreadcrumbCurrentItem asChild>
          <CustomLink to="/installation">Installation</CustomLink>
        </BreadcrumbCurrentItem>
      </Breadcrumb>
    );

    const home = getByRole("link", { name: "Home" });
    expect(home).toHaveAttribute("href", "/");
    expect(home).toHaveAttribute("data-router-link");
    expect(home).toHaveClass("underline");
    expect(home).not.toHaveAttribute("aria-current");
    expect(getByRole("link", { name: "Installation" })).toHaveAttribute("aria-current", "page");
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

  it("should not render an item or a separator for children that render nothing", () => {
    const showDocs = false;
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        {showDocs && <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>}
        <BreadcrumbCurrentItem>Installation</BreadcrumbCurrentItem>
        {null}
      </Breadcrumb>
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(container.querySelectorAll(".lucide")).toHaveLength(1);
    expect(screen.getByText("Installation").parentElement?.querySelector(".lucide")).toBeNull();
  });

  it("should pass its props and ref to the nav", () => {
    const ref = React.createRef<HTMLElement>();
    render(
      <Breadcrumb ref={ref} id="trail" data-testid="trail" dir="rtl">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
      </Breadcrumb>
    );
    const nav = screen.getByRole("navigation");
    expect(ref.current).toBe(nav);
    expect(nav).toHaveAttribute("id", "trail");
    expect(nav).toHaveAttribute("data-testid", "trail");
    expect(nav).toHaveAttribute("dir", "rtl");
  });

  it("should be named by aria-labelledby instead of the default name", () => {
    render(
      <>
        <h2 id="location">You are here</h2>
        <Breadcrumb aria-labelledby="location">
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
        </Breadcrumb>
      </>
    );
    const nav = screen.getByRole("navigation", { name: "You are here" });
    expect(nav).not.toHaveAttribute("aria-label");
  });

  it("should put className on the nav, where it can replace the default padding", () => {
    render(
      <Breadcrumb className="p-0">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
      </Breadcrumb>
    );
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("p-0");
    expect(nav).not.toHaveClass("p-4");
  });

  it("should keep the className of a custom link component, also when it is a function", () => {
    // Stands in for React Router's NavLink, whose className can be a function of its state
    const NavLink = ({
      className,
      ...rest
    }: Omit<React.ComponentProps<"a">, "className"> & {
      className?: (state: { isActive: boolean }) => string;
    }) => <a className={className?.({ isActive: true })} {...rest} />;

    render(
      <Breadcrumb>
        <BreadcrumbItem asChild>
          <a href="/" className="router-link">
            Home
          </a>
        </BreadcrumbItem>
        <BreadcrumbItem asChild>
          <NavLink href="/docs" className={({ isActive }) => (isActive ? "active" : "")}>
            Docs
          </NavLink>
        </BreadcrumbItem>
      </Breadcrumb>
    );

    const home = screen.getByRole("link", { name: "Home" });
    expect(home).toHaveClass("router-link");
    expect(home).toHaveClass("underline");
    const docs = screen.getByRole("link", { name: "Docs" });
    expect(docs).toHaveClass("active");
    expect(docs).toHaveClass("underline");
  });

  it("should keep a custom link's own aria-current when it isn't the current page", () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem asChild>
          <a href="/docs" aria-current="location">
            Docs
          </a>
        </BreadcrumbItem>
      </Breadcrumb>
    );
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("aria-current", "location");
  });

  it("should pass its props to an item without href", () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem id="section" data-testid="section">
          Section
        </BreadcrumbItem>
      </Breadcrumb>
    );
    const item = screen.getByText("Section");
    expect(item.tagName).toBe("SPAN");
    expect(item).toHaveAttribute("id", "section");
    expect(item).toHaveAttribute("data-testid", "section");
  });
});

describe("BreadcrumbMenu", () => {
  // Hash links, because jsdom doesn't implement navigation to another page
  const renderWithMenu = () =>
    render(
      <>
        <Breadcrumb>
          <BreadcrumbItem href="#home">Home</BreadcrumbItem>
          <BreadcrumbMenu>
            <BreadcrumbItem href="#server">Server</BreadcrumbItem>
            <BreadcrumbItem href="#overview">Overview</BreadcrumbItem>
          </BreadcrumbMenu>
          <BreadcrumbItem href="#routing">Routing</BreadcrumbItem>
          <BreadcrumbCurrentItem>API reference</BreadcrumbCurrentItem>
        </Breadcrumb>
        <input aria-label="Search" />
      </>
    );

  const getButton = () => screen.getByRole("button", { name: "2 more breadcrumbs" });
  // A hidden element has no accessible name, so the closed list is found through the button's aria-controls
  const getControlledList = () => document.getElementById(getButton().getAttribute("aria-controls") ?? "");

  async function openWithKeyboard() {
    const user = userEvent.setup();
    renderWithMenu();
    await user.tab();
    await user.tab();
    expect(getButton()).toHaveFocus();
    await user.keyboard("{Enter}");
    return user;
  }

  describe("semantics", () => {
    it("should be a disclosure button, not a menu button", () => {
      renderWithMenu();
      const button = getButton();
      expect(button).toHaveAttribute("aria-expanded", "false");
      expect(button).not.toHaveAttribute("aria-haspopup");
      expect(getControlledList()?.tagName).toBe("OL");
    });

    it("should name the button after the number of hidden items", () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="#home">Home</BreadcrumbItem>
          <BreadcrumbMenu>
            <BreadcrumbItem href="#server">Server</BreadcrumbItem>
          </BreadcrumbMenu>
        </Breadcrumb>
      );
      expect(screen.getByRole("button", { name: "1 more breadcrumb" })).toBeInTheDocument();
    });

    it("should not count or render children that render nothing", async () => {
      const user = userEvent.setup();
      const showOverview = false;
      render(
        <Breadcrumb>
          <BreadcrumbMenu>
            <BreadcrumbItem href="#server">Server</BreadcrumbItem>
            {showOverview && <BreadcrumbItem href="#overview">Overview</BreadcrumbItem>}
            {null}
          </BreadcrumbMenu>
        </Breadcrumb>
      );
      await user.click(screen.getByRole("button", { name: "1 more breadcrumb" }));
      expect(screen.getByRole("list", { name: "1 more breadcrumb" }).children).toHaveLength(1);
    });

    it("should hide the list and its links until the button is used", () => {
      renderWithMenu();
      expect(screen.queryByRole("link", { name: "Server" })).not.toBeInTheDocument();
      expect(getControlledList()).not.toBeVisible();
    });

    it("should show the hidden items as links in an ordered list nested in the trail", async () => {
      const user = userEvent.setup();
      renderWithMenu();
      await user.click(getButton());

      expect(getButton()).toHaveAttribute("aria-expanded", "true");
      const list = screen.getByRole("list", { name: "2 more breadcrumbs" });
      expect(list.tagName).toBe("OL");
      expect(list.closest("nav")).toBe(screen.getByRole("navigation"));
      expect(screen.getByRole("link", { name: "Server" })).toBeVisible();
      expect(screen.getByRole("link", { name: "Overview" })).toBeVisible();
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      expect(screen.queryByRole("menuitem")).not.toBeInTheDocument();
    });
  });

  describe("keyboard", () => {
    it("should open with Enter and keep focus on the button", async () => {
      await openWithKeyboard();
      expect(getButton()).toHaveAttribute("aria-expanded", "true");
      expect(getButton()).toHaveFocus();
    });

    it("should open and close with Space", async () => {
      const user = userEvent.setup();
      renderWithMenu();
      getButton().focus();
      await user.keyboard(" ");
      expect(getButton()).toHaveAttribute("aria-expanded", "true");
      await user.keyboard(" ");
      expect(getButton()).toHaveAttribute("aria-expanded", "false");
    });

    it("should Tab through the hidden links, then close when focus leaves the list", async () => {
      const user = await openWithKeyboard();
      await user.tab();
      expect(screen.getByRole("link", { name: "Server" })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole("link", { name: "Overview" })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole("link", { name: "Routing" })).toHaveFocus();
      expect(getButton()).toHaveAttribute("aria-expanded", "false");
    });

    it("should stay open while Shift+Tab moves back through the links to the button", async () => {
      const user = await openWithKeyboard();
      await user.tab();
      await user.tab();
      await user.tab({ shift: true });
      expect(screen.getByRole("link", { name: "Server" })).toHaveFocus();
      await user.tab({ shift: true });
      expect(getButton()).toHaveFocus();
      expect(getButton()).toHaveAttribute("aria-expanded", "true");
    });

    it("should close when Shift+Tab leaves the button", async () => {
      const user = await openWithKeyboard();
      await user.tab({ shift: true });
      expect(screen.getByRole("link", { name: "Home" })).toHaveFocus();
      expect(getButton()).toHaveAttribute("aria-expanded", "false");
    });

    it("should close with Escape on the button", async () => {
      const user = await openWithKeyboard();
      await user.keyboard("{Escape}");
      expect(getButton()).toHaveAttribute("aria-expanded", "false");
      expect(getButton()).toHaveFocus();
    });

    it("should close with Escape on a link and move focus to the button", async () => {
      const user = await openWithKeyboard();
      await user.tab();
      await user.keyboard("{Escape}");
      expect(getButton()).toHaveAttribute("aria-expanded", "false");
      expect(getButton()).toHaveFocus();
    });

    it("should close when a link is activated with Enter", async () => {
      const user = await openWithKeyboard();
      await user.tab();
      await user.keyboard("{Enter}");
      expect(getButton()).toHaveAttribute("aria-expanded", "false");
    });

    it("should move between the links with the arrow keys, Home and End, without wrapping", async () => {
      const user = await openWithKeyboard();
      const server = screen.getByRole("link", { name: "Server" });
      const overview = screen.getByRole("link", { name: "Overview" });

      await user.keyboard("{ArrowDown}");
      expect(server).toHaveFocus();
      await user.keyboard("{ArrowDown}");
      expect(overview).toHaveFocus();
      await user.keyboard("{ArrowDown}");
      expect(overview).toHaveFocus();
      await user.keyboard("{Home}");
      expect(server).toHaveFocus();
      await user.keyboard("{ArrowUp}");
      expect(server).toHaveFocus();
      await user.keyboard("{End}");
      expect(overview).toHaveFocus();
      await user.keyboard("{ArrowUp}");
      expect(server).toHaveFocus();
    });

    it("should not open with Down Arrow on the closed button", async () => {
      const user = userEvent.setup();
      renderWithMenu();
      getButton().focus();
      await user.keyboard("{ArrowDown}");
      expect(getButton()).toHaveAttribute("aria-expanded", "false");
      expect(getButton()).toHaveFocus();
    });
  });

  // jsdom has no hit testing: a click is always delivered to the element it's sent to, even after it was hidden.
  // A link click that never arrives because the list closed on mousedown only shows up in a real browser
  describe("pointer", () => {
    it("should toggle with a click on the button", async () => {
      const user = userEvent.setup();
      renderWithMenu();
      await user.click(getButton());
      expect(getButton()).toHaveAttribute("aria-expanded", "true");
      await user.click(getButton());
      expect(getButton()).toHaveAttribute("aria-expanded", "false");
    });

    it("should close when a link is clicked", async () => {
      const user = userEvent.setup();
      renderWithMenu();
      await user.click(getButton());
      await user.click(screen.getByRole("link", { name: "Overview" }));
      expect(getButton()).toHaveAttribute("aria-expanded", "false");
    });

    it("should close on a click outside, and leave focus where the user clicked", async () => {
      const user = userEvent.setup();
      renderWithMenu();
      await user.click(getButton());
      const search = screen.getByRole("textbox", { name: "Search" });
      await user.click(search);
      expect(getButton()).toHaveAttribute("aria-expanded", "false");
      expect(search).toHaveFocus();
    });
  });

  describe("inside another popup", () => {
    it("should close only the list on Escape inside a Popover, and the Popover on the next Escape", async () => {
      const user = userEvent.setup();
      render(
        <Popover>
          <PopoverTrigger aria-label="Open popover">P</PopoverTrigger>
          <PopoverContent>
            <Breadcrumb>
              <BreadcrumbItem href="#home">Home</BreadcrumbItem>
              <BreadcrumbMenu>
                <BreadcrumbItem href="#server">Server</BreadcrumbItem>
                <BreadcrumbItem href="#overview">Overview</BreadcrumbItem>
              </BreadcrumbMenu>
            </Breadcrumb>
          </PopoverContent>
        </Popover>
      );
      await user.click(screen.getByRole("button", { name: "Open popover" }));
      // The Popover moves focus into itself two animation frames after opening. Wait for it, or that late focus move
      // closes the list as focus leaving it
      await waitFor(() => expect(screen.getByRole("dialog")).toContainElement(document.activeElement as HTMLElement));
      await user.click(getButton());
      screen.getByRole("link", { name: "Server" }).focus();

      await user.keyboard("{Escape}");
      expect(getButton()).toHaveAttribute("aria-expanded", "false");
      expect(getButton()).toHaveFocus();
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      await user.keyboard("{Escape}");
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    // A surrounding <dialog>, like the Drawer's, closes on an Escape whose default isn't prevented
    it("should prevent the default of Escape and stop it while the list is open", async () => {
      const user = userEvent.setup();
      renderWithMenu();
      const onParentKeyDown = jest.fn();
      document.body.addEventListener("keydown", onParentKeyDown);
      await user.click(getButton());

      const notPrevented = fireEvent.keyDown(screen.getByRole("link", { name: "Server" }), { key: "Escape" });
      expect(notPrevented).toBe(false);
      expect(onParentKeyDown).not.toHaveBeenCalled();
      document.body.removeEventListener("keydown", onParentKeyDown);
    });

    it("should let Escape through while the list is closed", () => {
      renderWithMenu();
      const onParentKeyDown = jest.fn();
      document.body.addEventListener("keydown", onParentKeyDown);

      const notPrevented = fireEvent.keyDown(getButton(), { key: "Escape" });
      expect(notPrevented).toBe(true);
      expect(onParentKeyDown).toHaveBeenCalled();
      document.body.removeEventListener("keydown", onParentKeyDown);
    });
  });
});
