import React from "react";
import { act, render, screen } from "@testing-library/react";
import {
  ANNOUNCER_ATTRIBUTE,
  DEFAULT_TIMEOUT,
  MESSAGE_INTERVAL,
  PRIMING_DELAY,
  QUEUE_DELAY,
  announce,
  clearAnnouncer,
  ensureLiveRegion
} from "./Announcer";
import { useAnnounce } from "./useAnnounce";
import { UseAnnounceOptions } from "./Announcer.types";

const getWrappers = (container: Element = document.body) =>
  Array.from(container.children).filter((child) => child.hasAttribute(ANNOUNCER_ATTRIBUTE));

const getRegion = (politeness: "polite" | "assertive", container: Element = document.body) =>
  getWrappers(container)[0]?.querySelector(`:scope > [aria-live="${politeness}"]`) ?? null;

// The messages currently in a region, in order
const messages = (politeness: "polite" | "assertive", container: Element = document.body) =>
  Array.from(getRegion(politeness, container)?.children ?? []).map((node) => node.textContent);

const advance = (ms: number) => act(() => jest.advanceTimersByTime(ms));

// Creates the pair ahead of time and waits until it can be used, so tests about timing don't include that wait
const prime = (element?: Element | null) => {
  ensureLiveRegion(element);
  advance(PRIMING_DELAY);
};

// jsdom doesn't implement showModal() or :modal. A dialog with data-modal stands in for one opened with showModal()
const originalMatches = Element.prototype.matches;

describe("Announcer", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(Element.prototype, "matches").mockImplementation(function (this: Element, selector: string) {
      if (selector === ":modal") {
        return this instanceof HTMLDialogElement && this.open && this.hasAttribute("data-modal");
      }
      return originalMatches.call(this, selector);
    });
  });

  afterEach(() => {
    clearAnnouncer();
    for (const wrapper of document.querySelectorAll(`[${ANNOUNCER_ATTRIBUTE}]`)) {
      wrapper.remove();
    }
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe("Regions", () => {
    it("should create one polite and one assertive region that only announce additions", () => {
      ensureLiveRegion();
      const [wrapper] = getWrappers();
      const [polite, assertive] = Array.from(wrapper.children);

      expect(getWrappers()).toHaveLength(1);
      expect(polite).toHaveAttribute("role", "log");
      expect(polite).toHaveAttribute("aria-live", "polite");
      expect(polite).toHaveAttribute("aria-relevant", "additions");
      expect(assertive).toHaveAttribute("role", "log");
      expect(assertive).toHaveAttribute("aria-live", "assertive");
      expect(assertive).toHaveAttribute("aria-relevant", "additions");
    });

    // aria-atomic="true" (also implied by role="status" and role="alert") would read every message in the region again
    it("should not make the regions atomic", () => {
      ensureLiveRegion();
      for (const region of getWrappers()[0].children) {
        expect(region).not.toHaveAttribute("aria-atomic");
        expect(region).not.toHaveAttribute("role", "status");
        expect(region).not.toHaveAttribute("role", "alert");
      }
    });

    // Hidden with display:none, hidden or aria-hidden, a live region is never announced
    it("should be visually hidden without hiding it from screen readers", () => {
      ensureLiveRegion();
      const [wrapper] = getWrappers() as HTMLElement[];

      expect(wrapper.style.position).toBe("absolute");
      expect(wrapper.style.width).toBe("1px");
      expect(wrapper.style.height).toBe("1px");
      expect(wrapper.style.overflow).toBe("hidden");
      expect(wrapper.style.display).not.toBe("none");
      expect(wrapper).not.toHaveAttribute("hidden");
      expect(wrapper).not.toHaveAttribute("aria-hidden");
    });

    it("should create only one pair per container", () => {
      ensureLiveRegion();
      ensureLiveRegion(document.body);
      prime();
      announce("Saved");
      advance(QUEUE_DELAY);

      expect(getWrappers()).toHaveLength(1);
      expect(document.querySelectorAll(`[${ANNOUNCER_ATTRIBUTE}]`)).toHaveLength(1);
    });

    it("should add the pair at the end of body", () => {
      render(<p>Page content</p>);
      ensureLiveRegion();
      expect(document.body.lastElementChild).toHaveAttribute(ANNOUNCER_ATTRIBUTE);
    });
  });

  describe("Writing messages", () => {
    it("should add a message to the polite region by default, about 100 ms after announce()", () => {
      prime();
      announce("Saved");

      advance(QUEUE_DELAY - 1);
      expect(messages("polite")).toEqual([]);

      advance(1);
      expect(messages("polite")).toEqual(["Saved"]);
      expect(messages("assertive")).toEqual([]);
    });

    it("should add an assertive message to the assertive region", () => {
      prime();
      announce("Connection lost", { politeness: "assertive" });
      advance(QUEUE_DELAY);

      expect(messages("assertive")).toEqual(["Connection lost"]);
      expect(messages("polite")).toEqual([]);
    });

    it("should add each message as a new element instead of replacing the text", () => {
      prime();
      announce("First");
      advance(QUEUE_DELAY);
      const first = getRegion("polite")!.firstElementChild;

      announce("Second");
      advance(MESSAGE_INTERVAL);

      expect(messages("polite")).toEqual(["First", "Second"]);
      expect(getRegion("polite")!.firstElementChild).toBe(first);
    });

    it("should ignore empty messages", () => {
      prime();
      announce("");
      announce("   ");
      advance(QUEUE_DELAY + MESSAGE_INTERVAL);

      expect(messages("polite")).toEqual([]);
    });

    it("should remove a message after 7 seconds", () => {
      prime();
      announce("Saved");
      advance(QUEUE_DELAY);

      advance(DEFAULT_TIMEOUT - 1);
      expect(messages("polite")).toEqual(["Saved"]);

      advance(1);
      expect(messages("polite")).toEqual([]);
    });

    it("should remove a message after a custom timeout", () => {
      prime();
      announce("Saved", { timeout: 1000 });
      advance(QUEUE_DELAY + 1000);

      expect(messages("polite")).toEqual([]);
    });

    it("should only remove the message whose time is up", () => {
      prime();
      announce("First", { timeout: 1000 });
      announce("Second");
      advance(QUEUE_DELAY + MESSAGE_INTERVAL);
      expect(messages("polite")).toEqual(["First", "Second"]);

      advance(1000);
      expect(messages("polite")).toEqual(["Second"]);
    });
  });

  describe("Scenario: the same message twice", () => {
    it("should add both, as separate elements, so the repeat is announced again", () => {
      prime();
      announce("Saved");
      announce("Saved");

      advance(QUEUE_DELAY);
      expect(messages("polite")).toEqual(["Saved"]);

      advance(MESSAGE_INTERVAL);
      expect(messages("polite")).toEqual(["Saved", "Saved"]);

      const [first, second] = Array.from(getRegion("polite")!.children);
      expect(first).not.toBe(second);
    });

    it("should announce a repeat that comes after the first was written", () => {
      prime();
      announce("Read only");
      advance(QUEUE_DELAY);

      advance(2000);
      announce("Read only");
      advance(QUEUE_DELAY);

      expect(messages("polite")).toEqual(["Read only", "Read only"]);
    });

    it("should replace the earlier one when both have the same id", () => {
      prime();
      announce("Read only", { id: "switch" });
      advance(QUEUE_DELAY);
      const first = getRegion("polite")!.firstElementChild;

      advance(2000);
      announce("Read only", { id: "switch" });
      advance(QUEUE_DELAY);

      // The repeat is a new element, so it is announced again, and the old one is gone from the region
      expect(messages("polite")).toEqual(["Read only"]);
      expect(getRegion("polite")!.firstElementChild).not.toBe(first);
    });
  });

  describe("Scenario: a burst of messages", () => {
    it("should write the messages one at a time, 250 ms apart, in order", () => {
      prime();
      announce("One");
      announce("Two");
      announce("Three");

      advance(QUEUE_DELAY);
      expect(messages("polite")).toEqual(["One"]);

      advance(MESSAGE_INTERVAL - 1);
      expect(messages("polite")).toEqual(["One"]);

      advance(1);
      expect(messages("polite")).toEqual(["One", "Two"]);

      advance(MESSAGE_INTERVAL);
      expect(messages("polite")).toEqual(["One", "Two", "Three"]);
    });

    it("should keep 250 ms after the last written message for a message that comes shortly after", () => {
      prime();
      announce("One");
      advance(QUEUE_DELAY);

      advance(50);
      announce("Two");

      // QUEUE_DELAY alone would write it at 150 ms after "One"; spacing keeps it at 250 ms
      advance(MESSAGE_INTERVAL - 50 - 1);
      expect(messages("polite")).toEqual(["One"]);

      advance(1);
      expect(messages("polite")).toEqual(["One", "Two"]);
    });

    it("should only announce the latest of a burst with the same id", () => {
      prime();
      for (const volume of [10, 20, 30, 40, 50]) {
        announce(`Volume ${volume}%`, { id: "volume" });
      }

      advance(QUEUE_DELAY + MESSAGE_INTERVAL * 5);
      expect(messages("polite")).toEqual(["Volume 50%"]);
    });

    it("should keep the waiting message's turn when it is replaced", () => {
      prime();
      announce("A");
      announce("Position 1", { id: "list" });
      announce("B");
      announce("Position 2", { id: "list" });

      advance(QUEUE_DELAY + MESSAGE_INTERVAL * 2);
      expect(messages("polite")).toEqual(["A", "Position 2", "B"]);
    });

    it("should not merge messages with different ids or without an id", () => {
      prime();
      announce("A", { id: "one" });
      announce("B", { id: "two" });
      announce("C");
      announce("D");

      advance(QUEUE_DELAY + MESSAGE_INTERVAL * 3);
      expect(messages("polite")).toEqual(["A", "B", "C", "D"]);
    });
  });

  describe("Scenario: a quick series from one source, waiting until it stops (delay)", () => {
    // Every message that reaches a region, also ones that are replaced later: screen readers read each of them
    const recordAdditions = () => {
      const added: string[] = [];
      const observer = new MutationObserver((records) => {
        for (const record of records) {
          for (const node of record.addedNodes) {
            added.push(node.textContent ?? "");
          }
        }
      });
      observer.observe(getRegion("polite")!, { childList: true });
      return () => {
        // Records not delivered yet (fake timers can hold back the observer's callback)
        for (const record of observer.takeRecords()) {
          for (const node of record.addedNodes) {
            added.push(node.textContent ?? "");
          }
        }
        observer.disconnect();
        return added;
      };
    };

    it("should wait for the delay before writing", () => {
      prime();
      announce("Moved Apple to position 2 of 4", { delay: 500 });

      advance(499);
      expect(messages("polite")).toEqual([]);

      advance(1);
      expect(messages("polite")).toEqual(["Moved Apple to position 2 of 4"]);
    });

    it("should only write the last message when messages with the same id come quicker than the delay", () => {
      prime();
      const stop = recordAdditions();

      // Moves 200 ms apart: each one starts the wait again
      announce("Moved Apple to position 2 of 4", { id: "list", delay: 500 });
      advance(200);
      announce("Moved Apple to position 3 of 4", { id: "list", delay: 500 });
      advance(200);
      announce("Moved Apple to position 4 of 4", { id: "list", delay: 500 });

      advance(499);
      expect(messages("polite")).toEqual([]);
      advance(1);

      expect(stop()).toEqual(["Moved Apple to position 4 of 4"]);
    });

    it("should announce each message when they come slower than the delay", () => {
      prime();
      const stop = recordAdditions();

      announce("Moved Apple to position 2 of 4", { id: "list", delay: 500 });
      advance(600);
      announce("Moved Apple to position 3 of 4", { id: "list", delay: 500 });
      advance(500);

      expect(stop()).toEqual(["Moved Apple to position 2 of 4", "Moved Apple to position 3 of 4"]);
      // The older one is removed from the region once the newer one is written
      expect(messages("polite")).toEqual(["Moved Apple to position 3 of 4"]);
    });

    it("should not hold up other messages while a delayed message waits", () => {
      prime();
      announce("Moved Apple to position 2 of 4", { id: "list", delay: 500 });
      announce("Saved");

      advance(QUEUE_DELAY);
      expect(messages("polite")).toEqual(["Saved"]);

      advance(500 - QUEUE_DELAY);
      expect(messages("polite")).toEqual(["Saved", "Moved Apple to position 2 of 4"]);
    });

    it("should still keep 250 ms after the last message", () => {
      prime();
      announce("Saved");
      announce("Moved Apple to position 2 of 4", { delay: 150 });

      // The delayed message is ready at 150 ms, but "Saved" was written at 100 ms
      advance(QUEUE_DELAY);
      expect(messages("polite")).toEqual(["Saved"]);

      advance(MESSAGE_INTERVAL - 1);
      expect(messages("polite")).toEqual(["Saved"]);

      advance(1);
      expect(messages("polite")).toEqual(["Saved", "Moved Apple to position 2 of 4"]);
    });
  });

  describe("Scenario: a polite and an assertive message at the same moment", () => {
    it("should write the assertive message first, then the polite one", () => {
      prime();
      announce("Draft saved");
      announce("Connection lost", { politeness: "assertive" });

      advance(QUEUE_DELAY);
      expect(messages("assertive")).toEqual(["Connection lost"]);
      expect(messages("polite")).toEqual([]);

      advance(MESSAGE_INTERVAL);
      expect(messages("polite")).toEqual(["Draft saved"]);
    });

    it("should let an assertive message go ahead of polite messages that are still waiting", () => {
      prime();
      announce("One");
      announce("Two");
      advance(QUEUE_DELAY);
      expect(messages("polite")).toEqual(["One"]);

      announce("Error", { politeness: "assertive" });
      advance(MESSAGE_INTERVAL);
      expect(messages("assertive")).toEqual(["Error"]);
      expect(messages("polite")).toEqual(["One"]);

      advance(MESSAGE_INTERVAL);
      expect(messages("polite")).toEqual(["One", "Two"]);
    });
  });

  describe("New regions", () => {
    it("should wait 150 ms before the first message in a pair that was only just created", () => {
      announce("Saved");

      // The pair is created when the message is written, at 100 ms, and used 150 ms later
      advance(QUEUE_DELAY);
      expect(getWrappers()).toHaveLength(1);
      expect(messages("polite")).toEqual([]);

      advance(PRIMING_DELAY - 1);
      expect(messages("polite")).toEqual([]);

      advance(1);
      expect(messages("polite")).toEqual(["Saved"]);
    });

    it("should not wait when the pair was created ahead of time", () => {
      ensureLiveRegion();
      advance(500);

      announce("Saved");
      advance(QUEUE_DELAY);
      expect(messages("polite")).toEqual(["Saved"]);
    });

    // For example a pair created by another copy of the library on the same page
    it("should use a pair it didn't create without waiting", () => {
      const wrapper = document.createElement("div");
      wrapper.setAttribute(ANNOUNCER_ATTRIBUTE, "");
      wrapper.innerHTML = `<div role="log" aria-live="polite"></div><div role="log" aria-live="assertive"></div>`;
      document.body.append(wrapper);

      announce("Saved");
      advance(QUEUE_DELAY);
      expect(messages("polite")).toEqual(["Saved"]);
    });
  });

  describe("Dialogs", () => {
    it("should put the pair inside the dialog of the element, as its first child", () => {
      render(
        <dialog open data-testid="dialog">
          <button type="button">Save</button>
          <p data-testid="last">Last</p>
        </dialog>
      );
      const dialog = screen.getByTestId("dialog");
      prime(screen.getByRole("button"));

      expect(dialog.firstElementChild).toHaveAttribute(ANNOUNCER_ATTRIBUTE);
      // As the last child it would change the consumer's :last-child (Tailwind's space-y and divide-y)
      expect(dialog.lastElementChild).toBe(screen.getByTestId("last"));
    });

    it("should create the pair inside a dialog that is still closed", () => {
      render(
        <dialog data-testid="dialog">
          <button type="button">Save</button>
        </dialog>
      );
      ensureLiveRegion(screen.getByRole("button", { hidden: true }));

      expect(getWrappers(screen.getByTestId("dialog"))).toHaveLength(1);
      expect(getWrappers()).toHaveLength(0);
    });

    it("should announce inside an open non-modal dialog around the element", () => {
      render(
        <dialog open data-testid="dialog">
          <button type="button">Save</button>
        </dialog>
      );
      const dialog = screen.getByTestId("dialog");
      prime(screen.getByRole("button"));

      announce("Saved", { from: screen.getByRole("button") });
      advance(QUEUE_DELAY);
      expect(messages("polite", dialog)).toEqual(["Saved"]);
    });

    it("should announce inside an aria-modal container around the element", () => {
      render(
        <div role="dialog" aria-modal="true" aria-label="Settings" data-testid="modal">
          <button type="button">Save</button>
        </div>
      );
      const modal = screen.getByTestId("modal");
      prime(screen.getByRole("button"));

      announce("Saved", { from: screen.getByRole("button") });
      advance(QUEUE_DELAY);
      expect(messages("polite", modal)).toEqual(["Saved"]);
      expect(getWrappers()).toHaveLength(0);
    });

    it("should announce on the page when only a non-modal dialog is open", () => {
      render(
        <>
          <button type="button">Outside</button>
          <dialog open data-testid="dialog">
            Not modal
          </dialog>
        </>
      );
      prime();

      announce("Saved", { from: screen.getByRole("button", { name: "Outside" }) });
      advance(QUEUE_DELAY);
      expect(messages("polite")).toEqual(["Saved"]);
      expect(getWrappers(screen.getByTestId("dialog"))).toHaveLength(0);
    });

    it("should announce on the page when an aria-modal element is hidden", () => {
      render(
        <div role="dialog" aria-modal="true" aria-label="Settings" hidden>
          Closed
        </div>
      );
      prime();

      announce("Saved");
      advance(QUEUE_DELAY);
      expect(messages("polite")).toEqual(["Saved"]);
    });

    it("should announce on the page when the element is no longer on the page", () => {
      const { unmount } = render(
        <dialog open data-testid="dialog">
          <button type="button">Save</button>
        </dialog>
      );
      const button = screen.getByRole("button");
      prime();

      announce("Saved", { from: button });
      unmount();
      advance(QUEUE_DELAY);
      expect(messages("polite")).toEqual(["Saved"]);
    });

    it("should announce in the topmost modal when modals are nested", () => {
      render(
        <>
          <dialog open data-modal data-testid="first">
            <button type="button">In the first modal</button>
          </dialog>
          <dialog open data-modal data-testid="second">
            <button type="button">In the second modal</button>
          </dialog>
        </>
      );
      const second = screen.getByTestId("second");
      prime(second);

      // The first modal is inert behind the second one, so its own regions can't be heard
      announce("From the first", { from: screen.getByRole("button", { name: "In the first modal" }) });
      announce("From the second", { from: screen.getByRole("button", { name: "In the second modal" }) });
      advance(QUEUE_DELAY + MESSAGE_INTERVAL);

      expect(messages("polite", second)).toEqual(["From the first", "From the second"]);
      expect(getWrappers(screen.getByTestId("first"))).toHaveLength(0);
    });
  });

  describe("Scenario: a message from inside an open Drawer", () => {
    it("should announce inside the modal dialog, not on the inert page", () => {
      render(
        <dialog open data-modal data-testid="drawer">
          <button type="button">Save</button>
        </dialog>
      );
      const drawer = screen.getByTestId("drawer");
      prime(drawer);

      announce("Settings saved", { from: screen.getByRole("button") });
      advance(QUEUE_DELAY);

      expect(messages("polite", drawer)).toEqual(["Settings saved"]);
      expect(getWrappers()).toHaveLength(0);
    });
  });

  describe("Scenario: a message from outside while the Drawer is open", () => {
    const renderPageWithOpenDrawer = () =>
      render(
        <>
          <button type="button">On the page</button>
          <dialog open data-modal data-testid="drawer">
            Drawer content
          </dialog>
        </>
      );

    it("should announce inside the open modal, because the page is inert", () => {
      renderPageWithOpenDrawer();
      const drawer = screen.getByTestId("drawer");
      prime(drawer);

      announce("Upload finished", { from: screen.getByRole("button", { name: "On the page" }) });
      advance(QUEUE_DELAY);

      expect(messages("polite", drawer)).toEqual(["Upload finished"]);
      expect(getWrappers()).toHaveLength(0);
    });

    it("should announce inside the open modal when no element is given", () => {
      renderPageWithOpenDrawer();
      const drawer = screen.getByTestId("drawer");
      prime(drawer);

      announce("Upload finished");
      advance(QUEUE_DELAY);

      expect(messages("polite", drawer)).toEqual(["Upload finished"]);
    });
  });

  describe("Scenario: a message sent while the Drawer closes", () => {
    it("should announce on the page, because the container is picked when the message is written", () => {
      render(
        <dialog open data-modal data-testid="drawer">
          <button type="button">Save and close</button>
        </dialog>
      );
      const drawer = screen.getByTestId("drawer") as HTMLDialogElement;
      prime(drawer);
      prime();

      announce("Settings saved", { from: screen.getByRole("button", { hidden: true }) });
      // The drawer closes in the same click handler
      drawer.removeAttribute("open");
      advance(QUEUE_DELAY);

      expect(messages("polite")).toEqual(["Settings saved"]);
      expect(messages("polite", drawer)).toEqual([]);
    });

    it("should announce on the page when the modal closes before a waiting message is written", () => {
      render(
        <dialog open data-modal data-testid="drawer">
          <button type="button">Save</button>
        </dialog>
      );
      const drawer = screen.getByTestId("drawer") as HTMLDialogElement;
      prime(drawer);
      prime();

      announce("First", { from: screen.getByRole("button") });
      announce("Second", { from: screen.getByRole("button") });
      advance(QUEUE_DELAY);
      expect(messages("polite", drawer)).toEqual(["First"]);

      drawer.removeAttribute("open");
      advance(MESSAGE_INTERVAL);
      expect(messages("polite")).toEqual(["Second"]);
    });
  });

  describe("Scenario: a message right after focus moves", () => {
    it("should not move focus, and write the message after focus has moved", () => {
      render(
        <>
          <button type="button">Next</button>
          <h2 tabIndex={-1}>Step 2 of 3</h2>
        </>
      );
      prime();
      const heading = screen.getByRole("heading");

      // As in a click handler: move focus, then announce
      heading.focus();
      announce("Step 2 of 3: shipping address");
      expect(messages("polite")).toEqual([]);

      advance(QUEUE_DELAY);
      expect(messages("polite")).toEqual(["Step 2 of 3: shipping address"]);
      expect(heading).toHaveFocus();
    });
  });

  describe("clearAnnouncer", () => {
    it("should cancel waiting messages and empty both regions", () => {
      prime();
      announce("Written");
      announce("Error", { politeness: "assertive" });
      advance(QUEUE_DELAY + MESSAGE_INTERVAL);
      announce("Waiting");

      clearAnnouncer();
      advance(QUEUE_DELAY + MESSAGE_INTERVAL);

      expect(messages("polite")).toEqual([]);
      expect(messages("assertive")).toEqual([]);
    });

    it("should only clear the given politeness", () => {
      prime();
      announce("Error", { politeness: "assertive" });
      announce("Written");
      advance(QUEUE_DELAY + MESSAGE_INTERVAL);
      announce("Waiting");
      announce("Another error", { politeness: "assertive" });

      clearAnnouncer("assertive");
      expect(messages("assertive")).toEqual([]);

      advance(MESSAGE_INTERVAL * 2);
      expect(messages("polite")).toEqual(["Written", "Waiting"]);
      expect(messages("assertive")).toEqual([]);
    });
  });

  describe("useAnnounce", () => {
    const Announcing = ({
      options,
      onRender
    }: {
      options?: UseAnnounceOptions;
      onRender?: (announce: ReturnType<typeof useAnnounce>) => void;
    }) => {
      const ref = React.useRef<HTMLButtonElement>(null);
      const announceFromButton = useAnnounce(ref, options);
      onRender?.(announceFromButton);
      return (
        <button ref={ref} type="button" onClick={() => announceFromButton("Clicked")}>
          Announce
        </button>
      );
    };

    it("should create the pair on mount, in the component's dialog", () => {
      render(
        <dialog data-testid="dialog">
          <Announcing />
        </dialog>
      );
      expect(getWrappers(screen.getByTestId("dialog"))).toHaveLength(1);
    });

    it("should create nothing on mount when not enabled", () => {
      render(<Announcing options={{ enabled: false }} />);
      expect(document.querySelectorAll(`[${ANNOUNCER_ATTRIBUTE}]`)).toHaveLength(0);
    });

    it("should create the pair once it is enabled", () => {
      const { rerender } = render(<Announcing options={{ enabled: false }} />);
      rerender(<Announcing options={{ enabled: true }} />);
      expect(getWrappers()).toHaveLength(1);
    });

    it("should return the same function on every render", () => {
      const functions: Array<ReturnType<typeof useAnnounce>> = [];
      const { rerender } = render(<Announcing onRender={(fn) => functions.push(fn)} />);
      rerender(<Announcing onRender={(fn) => functions.push(fn)} />);

      expect(functions).toHaveLength(2);
      expect(functions[0]).toBe(functions[1]);
    });

    it("should announce from the component's element", () => {
      render(
        <dialog open data-testid="dialog">
          <Announcing />
        </dialog>
      );
      const dialog = screen.getByTestId("dialog");
      advance(PRIMING_DELAY);

      act(() => screen.getByRole("button").click());
      advance(QUEUE_DELAY);

      expect(messages("polite", dialog)).toEqual(["Clicked"]);
    });

    it("should pass the options on", () => {
      let announceFromButton: ReturnType<typeof useAnnounce> | undefined;
      render(<Announcing onRender={(fn) => (announceFromButton = fn)} />);
      advance(PRIMING_DELAY);

      act(() => announceFromButton!("Connection lost", { politeness: "assertive" }));
      advance(QUEUE_DELAY);

      expect(messages("assertive")).toEqual(["Connection lost"]);
    });
  });
});
