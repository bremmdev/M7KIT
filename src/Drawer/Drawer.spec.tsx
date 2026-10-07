import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DrawerRoot, Drawer, DrawerContent, DrawerTrigger } from "./Drawer";

// jsdom doesn't implement showModal() and close()
const originalShowModal = HTMLDialogElement.prototype.showModal;
const originalClose = HTMLDialogElement.prototype.close;

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
});

afterAll(() => {
  HTMLDialogElement.prototype.showModal = originalShowModal;
  HTMLDialogElement.prototype.close = originalClose;
});

const renderDrawer = () =>
  render(
    <DrawerRoot>
      <DrawerTrigger>Open drawer</DrawerTrigger>
      <Drawer aria-label="settings" data-testid="drawer">
        <DrawerContent>
          <label>
            <input type="checkbox" />
            notifications
          </label>
          <button type="button">Save</button>
        </DrawerContent>
      </Drawer>
    </DrawerRoot>
  );

// Opens the drawer and places it on the right half of a 1000x800 viewport
const openDrawer = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("button", { name: "Open drawer" }));
  const drawer = screen.getByTestId("drawer") as HTMLDialogElement;
  jest.spyOn(drawer, "getBoundingClientRect").mockReturnValue({
    left: 500,
    right: 1000,
    top: 0,
    bottom: 800,
    x: 500,
    y: 0,
    width: 500,
    height: 800,
    toJSON: () => ({})
  });
  expect(drawer).toHaveAttribute("open");
  return drawer;
};

describe("Drawer", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Closing", () => {
    it("should close when clicking the backdrop", async () => {
      const user = userEvent.setup();
      renderDrawer();
      const drawer = await openDrawer(user);

      // The backdrop belongs to the dialog element, so a backdrop click targets the dialog, outside its box
      fireEvent.click(drawer, { clientX: 100, clientY: 100 });
      expect(drawer).not.toHaveAttribute("open");
    });

    it("should stay open when clicking the drawer itself, inside its box", async () => {
      const user = userEvent.setup();
      renderDrawer();
      const drawer = await openDrawer(user);

      fireEvent.click(drawer, { clientX: 700, clientY: 600 });
      expect(drawer).toHaveAttribute("open");
    });

    it("should close with Escape", async () => {
      const user = userEvent.setup();
      renderDrawer();
      const drawer = await openDrawer(user);

      screen.getByRole("button", { name: "Save" }).focus();
      await user.keyboard("{Escape}");
      expect(drawer).not.toHaveAttribute("open");
    });
  });

  // Clicks from the keyboard or from a <label> have clientX/clientY 0, which looks like a click outside the drawer
  describe("Clicks on the content", () => {
    it("should stay open when toggling a checkbox with Space", async () => {
      const user = userEvent.setup();
      renderDrawer();
      const drawer = await openDrawer(user);
      const checkbox = screen.getByRole("checkbox", { name: "notifications" });

      checkbox.focus();
      await user.keyboard(" ");
      expect(checkbox).toBeChecked();
      expect(drawer).toHaveAttribute("open");
    });

    it("should stay open when clicking a label", async () => {
      const user = userEvent.setup();
      renderDrawer();
      const drawer = await openDrawer(user);

      await user.click(screen.getByText("notifications"));
      expect(screen.getByRole("checkbox", { name: "notifications" })).toBeChecked();
      expect(drawer).toHaveAttribute("open");
    });

    it("should stay open when pressing a button with Enter", async () => {
      const user = userEvent.setup();
      renderDrawer();
      const drawer = await openDrawer(user);

      screen.getByRole("button", { name: "Save" }).focus();
      await user.keyboard("{Enter}");
      expect(drawer).toHaveAttribute("open");
    });
  });
});
