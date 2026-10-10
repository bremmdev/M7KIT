import React from "react";
import { flushSync } from "react-dom";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { announce } from "./Announcer";
import { useAnnounce } from "./useAnnounce";
import { Politeness } from "./Announcer.types";
import { Button } from "../Button";
import { Drawer, DrawerContent, DrawerRoot, DrawerTrigger } from "../Drawer";
import { useDrawer } from "../Drawer/Drawer.utils";
import { SortableList } from "../SortableList";
import { Switch } from "../Switch";
import { AnnouncerInspector } from "../_stories/AnnouncerInspector";

/**
 * `announce()` and `useAnnounce()` tell screen reader users about something that changed without moving focus: the
 * result of an action ("Profile saved"), a waiting state, progress, or an error. This is what WCAG 2.2 SC 4.1.3 Status
 * Messages asks for. Multiple components can use the same component. `Switch`, `ThemeToggle` and `SortableList` use it too,
 * so the whole page shares one pair of live regions and one queue.
 *
 * ## Usage
 *
 * ```tsx
 * import { announce, useAnnounce } from "@bremmdev/m7kit";
 *
 * // Anywhere, also outside React
 * announce("Profile saved");
 * announce("Connection lost. Your changes are not saved.", { politeness: "assertive" });
 *
 * // In a component: creates the live regions on mount, inside the component's dialog if it has one
 * const listRef = React.useRef<HTMLUListElement>(null);
 * const announceFromList = useAnnounce(listRef);
 * announceFromList(`Moved ${label} to position ${index + 1} of ${total}`, { id: listId });
 * ```
 *
 * | Option | Default | |
 * | --- | --- | --- |
 * | `politeness` | `"polite"` | `"assertive"` only for errors and time-critical messages: WCAG counts other use as a failure |
 * | `from` | | The element the message comes from. Inside an open dialog, the message goes to that dialog's regions |
 * | `id` | | A waiting message with the same `id` is replaced, so a burst only announces the latest. When written, an older message with the same `id` is removed |
 * | `delay` | | Milliseconds to wait before the message is written. A newer message with the same `id` starts the wait again, so a quick series is announced once, when it stops |
 * | `timeout` | `7000` | Milliseconds before the message is removed from its region |
 *
 * `clearAnnouncer(politeness?)` cancels waiting messages and empties the regions.
 *
 * ## How it works
 *
 * - **Two live regions**, one polite and one assertive (`role="log"`, `aria-relevant="additions"`), visually hidden.
 * - **One element per message.** A message is added as a new child instead of replacing the region's text, so messages
 *   from different components can't overwrite each other, and a repeated message is announced again.
 * - **One message at a time**, about 100 ms after `announce()`, then 250 ms apart. Assertive messages go first.
 * - **A new pair waits 150 ms** before its first message: screen readers can miss a message in a region that was only
 *   just added. `useAnnounce()`, `Drawer` and a `Popover` with `trapFocus` create their regions ahead of time.
 * - **Dialogs.** Everything outside a modal dialog is hidden from screen readers, live regions included. So a message
 *   goes to the regions inside the open modal: the one around `from`, or else the topmost one, even when it comes from
 *   the page behind it. Without an open modal it goes to the regions at the end of `<body>`.
 * - **Removed after 7 seconds**, so old messages aren't found later when browsing the page.
 *
 * ## When not to use it
 *
 * - The message is **visible** ("3 results" above a list): make that element the live region (`role="status"`), so
 *   everyone gets the same text.
 * - The **state of a control** changed (expanded, selected, checked): use `aria-expanded`, `aria-selected`, … on the
 *   control. Screen readers announce those already, an announcement as well is heard twice.
 * - The user has to **act** on it (a dialog, a message with buttons): move focus to it.
 * - It is an **error**: keep visible error text next to the field. An announcement disappears.
 *
 * ## The stories
 *
 * Each story has a **live region inspector**: a visual copy of the hidden regions, showing where they are, whether
 * screen readers can hear them, what is in them now, and a timeline of every message. All stories on this page share
 * one announcer, so every inspector shows every message: open a single story to see one scenario at a time.
 *
 * Test with real screen readers too: NVDA + Firefox or Chrome, JAWS + Chrome, Narrator + Edge, VoiceOver + Safari
 * (macOS and iOS), TalkBack + Chrome. Results differ between screen readers, and between versions.
 */
const meta: Meta = {
  title: "Utilities/Announcer",
  tags: ["autodocs"]
};
export default meta;

type Story = StoryObj;

const Scenario = ({ children, inspector }: { children: React.ReactNode; inspector?: React.ReactNode }) => (
  <div className="p-8 grid gap-8 lg:grid-cols-2 items-start text-foreground">
    <div className="flex flex-col gap-4 items-start">{children}</div>
    {inspector ?? <AnnouncerInspector />}
  </div>
);

const settingsDrawerClasses = "p-6 flex flex-col gap-6 text-foreground";

/**
 * Polite messages wait until the screen reader has finished what it is saying. Assertive messages may interrupt it.
 * Watch each message appear in its own region, and disappear again after 7 seconds.
 */
export const PoliteAndAssertive: Story = {
  render: () => (
    <Scenario>
      <Button onClick={() => announce("Profile saved")}>Announce "Profile saved" (polite)</Button>
      <Button
        variant="secondary"
        onClick={() => announce("Connection lost. Your changes are not saved.", { politeness: "assertive" })}
      >
        Announce "Connection lost" (assertive)
      </Button>
    </Scenario>
  )
};

/**
 * Setting the same text again is not a change, so a live region whose text is replaced stays silent. Here every
 * message is a new element, so the repeat is announced again.
 *
 * - **Twice at once**: two separate "Saved" elements, 250 ms apart. Without an id the old message is NOT replaced
 * - **With an id**, click a few times: each click is a new element, so it is announced again, and it replaces the
 *   previous one, so the region doesn't fill up with copies. This is what a read-only `Switch` does.
 */
export const SameMessageTwice: Story = {
  render: () => (
    <Scenario>
      <Button
        onClick={() => {
          announce("Saved");
          announce("Saved");
        }}
      >
        Announce "Saved" twice at once
      </Button>
      <Button variant="secondary" onClick={() => announce("Read only", { id: "same-message-demo" })}>
        Announce "Read only" with an id (click a few times)
      </Button>
    </Scenario>
  )
};

/**
 * A burst is written one message at a time, 250 ms apart, so screen readers get each one separately.
 *
 * - **Without an id**: all five messages, in order, 250 ms apart in the timeline.
 * - **With one id**: messages from the same source replace each other while they wait, so only "Volume 50%" is
 *   written.
 * - **Moves 200 ms apart, with one id**: like an item moved with quick key presses. Each message has been written
 *   before the next one comes, so the moves are written one by one, and a screen reader reads them out one after
 *   another.
 * - **Moves 200 ms apart, with one id and a delay**: each move starts the 500 ms wait again, so only "Moved Apple to
 *   position 5 of 5" is written, 500 ms after the last move. `SortableList` does this.
 */
// Moves from position 1 to 5, 200 ms apart, like quick key presses
const announceMoves = (delay?: number) => {
  for (const [step, position] of [2, 3, 4, 5].entries()) {
    setTimeout(() => announce(`Moved Apple to position ${position} of 5`, { id: "move-demo", delay }), step * 200);
  }
};

export const BurstOfMessages: Story = {
  render: () => (
    <Scenario>
      <Button
        onClick={() => {
          for (let message = 1; message <= 5; message++) {
            announce(`Message ${message} of 5`);
          }
        }}
      >
        Announce 5 messages without an id
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          for (const volume of [10, 20, 30, 40, 50]) {
            announce(`Volume ${volume}%`, { id: "volume-demo" });
          }
        }}
      >
        Announce 5 messages with one id
      </Button>
      <Button variant="secondary" onClick={() => announceMoves()}>
        Announce 4 moves, 200 ms apart, with one id
      </Button>
      <Button variant="secondary" onClick={() => announceMoves(500)}>
        Announce 4 moves, 200 ms apart, with one id and a delay
      </Button>
    </Scenario>
  )
};

/**
 * One click announces "Draft saved" (polite) and then "Connection lost" (assertive). The assertive message is written
 * first and the polite one 250 ms later, each in its own region.
 *
 * What happens next is up to the screen reader. VoiceOver interrupts what it is reading for the assertive message, and
 * may drop the polite one. NVDA, JAWS and Narrator treat both as polite and read them in turn.
 */
export const PoliteAndAssertiveAtTheSameMoment: Story = {
  render: () => (
    <Scenario>
      <Button
        onClick={() => {
          announce("Draft saved");
          announce("Connection lost. Your changes are not saved.", { politeness: "assertive" });
        }}
      >
        Announce a polite and an assertive message at once
      </Button>
    </Scenario>
  )
};

const AnnounceFromInside = () => {
  const ref = React.useRef<HTMLButtonElement>(null);
  const announceFromButton = useAnnounce(ref);

  return (
    <Button ref={ref} onClick={() => announceFromButton("Settings saved")}>
      Save settings
    </Button>
  );
};

/**
 * The Drawer is a modal dialog: everything behind it is inert and hidden from screen readers, live regions included.
 * So a message from inside the Drawer goes to a pair of regions inside it, created when it opens. The inspector marks
 * the pair on the page as silent while the Drawer is open.
 */
export const FromInsideAnOpenDrawer: Story = {
  render: () => (
    <Scenario>
      <DrawerRoot>
        <DrawerTrigger className="px-4 py-2 rounded-md bg-foreground text-foreground-inverse font-medium focus-ring">
          Open settings
        </DrawerTrigger>
        <Drawer aria-label="Settings">
          <DrawerContent className={settingsDrawerClasses}>
            <h2 className="text-2xl font-bold">Settings</h2>
            <AnnounceFromInside />
            <AnnouncerInspector title="Inspector (inside the Drawer)" />
          </DrawerContent>
        </Drawer>
      </DrawerRoot>
    </Scenario>
  )
};

const OpenAndAnnounceLater = () => {
  const { open } = useDrawer();
  const ref = React.useRef<HTMLButtonElement>(null);
  // Creates the page's regions on mount, so the inspector shows them going silent while the Drawer is open
  const announceFromPage = useAnnounce(ref);

  return (
    <Button
      ref={ref}
      onClick={() => {
        open();
        // A message from the page, for example a background upload that finishes
        setTimeout(() => announceFromPage("Upload finished"), 2000);
      }}
    >
      Open the Drawer, the page announces in 2 seconds
    </Button>
  );
};

/**
 * A message from the page while the Drawer is open, like a background upload that finishes. It comes from a button on
 * the page, and the page is inert while the Drawer is open: the inspector marks the page's regions as silent. So the
 * announcer sends it to the topmost open modal instead: watch "Upload finished" arrive in the Drawer's regions after
 * 2 seconds.
 */
export const FromOutsideWhileTheDrawerIsOpen: Story = {
  render: () => (
    <Scenario>
      <DrawerRoot>
        <OpenAndAnnounceLater />
        <Drawer aria-label="Upload">
          <DrawerContent className={settingsDrawerClasses}>
            <h2 className="text-2xl font-bold">Upload</h2>
            <p>In 2 seconds the page announces "Upload finished". It arrives in the regions inside this Drawer.</p>
            <AnnouncerInspector title="Inspector (inside the Drawer)" />
          </DrawerContent>
        </Drawer>
      </DrawerRoot>
    </Scenario>
  )
};

const SaveAndClose = () => {
  const { close } = useDrawer();
  const ref = React.useRef<HTMLButtonElement>(null);
  const announceFromButton = useAnnounce(ref);

  return (
    <Button
      ref={ref}
      onClick={() => {
        announceFromButton("Settings saved");
        close();
      }}
    >
      Save and close
    </Button>
  );
};

/**
 * "Save and close" announces "Settings saved" from inside the Drawer and closes it in the same click. The announcer
 * picks the regions when it writes the message, about 100 ms later, not when `announce()` is called. By then the
 * Drawer is closed and hidden, so the message goes to the regions on the page.
 */
export const WhileTheDrawerCloses: Story = {
  render: () => (
    <Scenario>
      <DrawerRoot>
        <DrawerTrigger className="px-4 py-2 rounded-md bg-foreground text-foreground-inverse font-medium focus-ring">
          Open settings
        </DrawerTrigger>
        <Drawer aria-label="Settings">
          <DrawerContent className={settingsDrawerClasses}>
            <h2 className="text-2xl font-bold">Settings</h2>
            <SaveAndClose />
          </DrawerContent>
        </Drawer>
      </DrawerRoot>
    </Scenario>
  )
};

const fruits = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];

const DeleteWithFocusMove = () => {
  const [items, setItems] = React.useState(fruits);
  const [politeness, setPoliteness] = React.useState<Politeness>("polite");
  const listRef = React.useRef<HTMLUListElement>(null);
  const announceFromList = useAnnounce(listRef);

  const remove = (index: number) => {
    const removed = items[index];
    flushSync(() => setItems((current) => current.filter((_, i) => i !== index)));

    // Focus goes to the next item's button (or the previous one at the end), then the message is announced
    const buttons = listRef.current?.querySelectorAll("button");
    buttons?.[Math.min(index, buttons.length - 1)]?.focus();
    announceFromList(`${removed} deleted`, { politeness });
  };

  return (
    <div className="flex flex-col gap-4">
      <fieldset className="flex gap-4">
        <legend className="font-medium mb-1">Politeness of the message</legend>
        {(["polite", "assertive"] as const).map((value) => (
          <label key={value} className="flex items-center gap-2">
            <input
              type="radio"
              name="delete-politeness"
              checked={politeness === value}
              onChange={() => setPoliteness(value)}
            />
            {value}
          </label>
        ))}
      </fieldset>
      <ul ref={listRef} aria-label="Fruits" className="flex flex-col gap-2">
        {items.map((item, index) => (
          <li key={item} className="flex items-center justify-between gap-4 w-72">
            {item}
            <Button variant="secondary" aria-label={`Delete ${item}`} onClick={() => remove(index)}>
              Delete
            </Button>
          </li>
        ))}
      </ul>
      <Button onClick={() => setItems(fruits)}>Reset the list</Button>
    </div>
  );
};

/**
 * Deleting an item moves focus to the next item's Delete button and announces "<item> deleted". The screen reader
 * reads the newly focused button and the message, so the two can collide.
 *
 * The timeline shows the order: first the focus change, then the message about 100 ms later. A polite message is read
 * after the focused button. Compare it with assertive in VoiceOver, which can cut off the button's name.
 */
export const RightAfterFocusMoves: Story = {
  render: () => (
    <Scenario inspector={<AnnouncerInspector logFocus />}>
      <DeleteWithFocusMove />
    </Scenario>
  )
};

/**
 * The library's own components announce through the same regions.
 *
 * - **Read-only Switch**: click it or press Space. The click does nothing, so the switch announces "Read only". Click
 *   quickly: the attempts are merged into one message.
 * - **SortableList**: enter edit mode and move items with the arrow keys. Each move is announced politely. Move an
 *   item several times quickly: only the final position is announced, half a second after the last move.
 */
export const InLibraryComponents: Story = {
  render: () => (
    <Scenario>
      <div className="flex items-center gap-3">
        <Switch id="announcer-read-only-switch" readOnly defaultChecked />
        <label htmlFor="announcer-read-only-switch">Notifications (read-only)</label>
      </div>
      <SortableList title="Favorite fruits" titleElement="h3" items={["Apple", "Banana", "Cherry", "Date"]} />
    </Scenario>
  )
};
