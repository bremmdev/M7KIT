import type { Meta, StoryObj } from "@storybook/react";

import { DrawerRoot, Drawer, DrawerContent, DrawerTrigger } from "./Drawer";

/**
 * The `Drawer` component is used to create a modal that slides in from the side of the screen. It is used to display additional content without navigating away from the current page.
 * The Drawer is a modal that fills half of the screen on larger screens, 2/3 of the screen on medium screens, and the full screen on smaller screens.
 *
 * ## Features
 *
 * - The Drawer is accessible using the native dialog element
 * - The Drawer can be closed using the keyboard, close button, or clicking outside the Drawer
 * - Body content is inert when the Drawer is open and body scrolling is disabled
 * - Placement of the Drawer can be set to left, right, top, or bottom
 *
 * ## Usage
 *
 * ```
 * <DrawerRoot>
 *  <DrawerTrigger>Open Drawer</DrawerTrigger>
 *  <Drawer>
 *   <DrawerContent>
 *    Here you can put any content you want to display in the Drawer
 *   </DrawerContent>
 *  </Drawer>
 * </DrawerRoot>
 * ```
 */

const meta: Meta<typeof Drawer> = {
  component: Drawer,
  title: "Components/Drawer",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
  args: {
    placement: "right",
    className: "",
  },
  render: (props) => {
    return (
      <div className="p-12">
        <DrawerRoot>
          <DrawerTrigger className="px-4 py-2 flex justify-center text-clr-text-inverted bg-clr-text hover:opacity-90 transition-all rounded-md font-medium w-fit focus-ring">
            Open Modal
          </DrawerTrigger>
          <Drawer
            {...props}
            onOpen={() => console.log("Drawer opened")}
            onClose={() => console.log("Drawer closed")}
          >
            <DrawerContent>
              <div className="space-y-5 leading-7 text-clr-text">
                <h1 className="text-3xl font-bold">Drawer</h1>
                <p>
                  This is a drawer. You can put anything you want in the
                  DrawerContent. It's a modal that slides in when opened. It
                  fills half of the screen on larger screens, 2/3 of the screen
                  on medium screens, and the full screen on smaller screens.
                </p>

                <h2 className="text-2xl font-bold">Focus and accessibility</h2>
                <p>
                  On opening, the Drawer gets focus. All elements in the Drawer
                  are in a focus trap and can be navigated using the keyboard.
                </p>
                <div className="flex flex-col gap-4">
                  <label htmlFor="input" className="text-clr-text font-medium">
                    Focusable input
                  </label>
                  <input
                    type="text"
                    name="input"
                    id="input"
                    className="border border-gray-300 rounded-md px-4 py-1 focus-ring min-w-16 shrink max-w-[200px] text-slate-700"
                  />
                  <button className="px-4 py-2 flex justify-center text-clr-text-inverted bg-clr-text hover:opacity-90 transition-all rounded-md font-medium w-fit focus-ring">
                    Fosusable button
                  </button>
                </div>

                <div>
                  The Drawer can be closed in several ways:
                  <ul className="list-disc list-inside pl-1 space-y-1 mt-2">
                    <li>clicking the close button</li>
                    <li>pressing the escape key</li>
                    <li>clicking outside the Drawer</li>
                  </ul>
                </div>

                <p>
                  The region that contains the close button has position sticky
                  and is always visible at the top of the Drawer. The content
                  flows under the close button when scrolling.
                </p>

                <p>
                  When opened, all other elements on the page are inert and not
                  reachable by keyboard or announced by screenreaders.
                </p>

                <h2 className="text-2xl font-bold">Trigger</h2>
                <p>
                  The DrawerTrigger component is used to open the Drawer. It
                  needs to be contained within the DrawerRoot component to work.
                  It is hidden when the Drawer is open.
                </p>
                <h2 className="text-2xl font-bold">Placement</h2>
                <p>
                  The Drawer can be placed on the left, right, top or bottom of
                  the screen using the <strong>placement</strong> prop. The
                  default placement is right.
                </p>

                <h2 className="text-2xl font-bold">Scrolling</h2>
                <p>
                  The Drawer has a scrollbar when the content is too long to fit
                  in the Drawer. The scrollbar is only visible when the Drawer
                  is open. The close button is always visible at the top of the
                  Drawer when scrolling. The page content is inert when the
                  Drawer is open and scrolling the page content is disabled.
                </p>
              </div>
            </DrawerContent>
          </Drawer>
        </DrawerRoot>
        <p className="text-clr-text h-screen my-4">Page content</p>
        <input
          type="text"
          className="border border-gray-300 rounded-md px-4 py-1 focus-ring min-w-16 shrink max-w-[200px] text-slate-700"
        />
      </div>
    );
  },
};

export const Bottom: Story = {
  args: {
    placement: "bottom",
  },
  render: Default.render,
};
