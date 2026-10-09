import React from "react";
import { cn } from "../utils/cn";

/**
 * Story-only panel that shows what the visually hidden live regions of the announcer contain, where they are and
 * whether screen readers can hear them, plus a timeline of every message (and optionally every focus change).
 *
 * It only mirrors the regions, it is not a live region itself, so it doesn't add announcements of its own.
 */

const WRAPPER = "[data-m7kit-announcer]";
const REGION = `${WRAPPER} > [aria-live]`;

type Status = "audible" | "behind-modal" | "closed";

type PairSnapshot = {
  location: string;
  status: Status;
  polite: string[];
  assertive: string[];
};

type LogEntry = {
  id: number;
  time: number;
  kind: "polite" | "assertive" | "focus";
  location: string;
  text: string;
};

const matchesSafely = (element: Element, selector: string) => {
  try {
    return element.matches(selector);
  } catch {
    return false;
  }
};

const isOpenModal = (element: Element) =>
  element instanceof HTMLDialogElement
    ? element.open && matchesSafely(element, ":modal")
    : element.getAttribute("aria-modal") === "true" && !element.closest("[hidden]");

const getTopmostModal = () =>
  Array.from(document.querySelectorAll("dialog[open], [aria-modal='true']")).filter(isOpenModal).at(-1) ?? null;

const getStatus = (wrapper: Element): Status => {
  if (wrapper.closest("dialog:not([open]), [hidden]")) {
    return "closed";
  }
  const topmost = getTopmostModal();
  if (topmost) {
    return topmost.contains(wrapper) ? "audible" : "behind-modal";
  }
  return wrapper.closest("[inert]") ? "behind-modal" : "audible";
};

const describeLocation = (container: Element | null) => {
  if (!container || container === document.body) {
    return "On the page (end of <body>)";
  }
  const name = container.getAttribute("aria-label");
  if (container instanceof HTMLDialogElement) {
    return `Inside the <dialog>${name ? ` "${name}"` : ""}`;
  }
  return `Inside the aria-modal ${container.getAttribute("role") ?? "element"}${name ? ` "${name}"` : ""}`;
};

const getMessages = (wrapper: Element, politeness: "polite" | "assertive") =>
  Array.from(wrapper.querySelector(`:scope > [aria-live="${politeness}"]`)?.children ?? []).map(
    (node) => node.textContent ?? ""
  );

const readPairs = (): PairSnapshot[] =>
  Array.from(document.querySelectorAll(WRAPPER)).map((wrapper) => ({
    location: describeLocation(wrapper.parentElement),
    status: getStatus(wrapper),
    polite: getMessages(wrapper, "polite"),
    assertive: getMessages(wrapper, "assertive")
  }));

const describeFocusTarget = (element: Element) =>
  element.getAttribute("aria-label") ||
  element.textContent?.trim().replace(/\s+/g, " ").slice(0, 60) ||
  element.tagName.toLowerCase();

const formatGap = (ms: number) => (ms >= 1000 ? `+${(ms / 1000).toFixed(1)} s` : `+${Math.round(ms)} ms`);

const statusText: Record<Status, string> = {
  audible: "Screen readers can hear these regions",
  "behind-modal": "Silent: hidden behind an open modal dialog",
  closed: "Silent: its dialog is closed"
};

const useAnnouncerMirror = (rootRef: React.RefObject<HTMLElement | null>, logFocus: boolean) => {
  const [pairs, setPairs] = React.useState<PairSnapshot[]>([]);
  const [log, setLog] = React.useState<LogEntry[]>([]);
  const nextId = React.useRef(0);

  React.useEffect(() => {
    setPairs(readPairs());

    // Only changes to the regions, to the wrappers, or to what makes them audible count. Ignoring everything else keeps
    // the panel's own re-renders from triggering it again
    const observer = new MutationObserver((mutations) => {
      let changed = false;
      const added: LogEntry[] = [];

      for (const mutation of mutations) {
        const target = mutation.target as Element;

        if (mutation.type === "attributes") {
          changed = true;
          continue;
        }

        if (target.nodeType === Node.ELEMENT_NODE && target.matches(REGION)) {
          changed = true;
          for (const node of mutation.addedNodes) {
            added.push({
              id: nextId.current++,
              time: performance.now(),
              kind: target.getAttribute("aria-live") as "polite" | "assertive",
              location: describeLocation(target.parentElement?.parentElement ?? null),
              text: node.textContent ?? ""
            });
          }
          continue;
        }

        const nodes = [...mutation.addedNodes, ...mutation.removedNodes];
        if (
          nodes.some(
            (node) =>
              node.nodeType === Node.ELEMENT_NODE &&
              ((node as Element).matches(WRAPPER) || (node as Element).querySelector(WRAPPER))
          )
        ) {
          changed = true;
        }
      }

      if (changed) {
        setPairs(readPairs());
      }
      if (added.length > 0) {
        setLog((current) => [...current, ...added]);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["open", "inert", "aria-modal", "hidden"]
    });

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!logFocus) {
      return;
    }

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as Element;
      if (rootRef.current?.contains(target)) {
        return;
      }
      setLog((current) => [
        ...current,
        {
          id: nextId.current++,
          time: performance.now(),
          kind: "focus",
          location: "",
          text: describeFocusTarget(target)
        }
      ]);
    };

    document.addEventListener("focusin", handleFocusIn);
    return () => document.removeEventListener("focusin", handleFocusIn);
  }, [logFocus, rootRef]);

  return { pairs, log, clearLog: () => setLog([]) };
};

const MessageList = ({ title, messages }: { title: string; messages: string[] }) => (
  <div className="flex-1 min-w-40">
    <h4 className="text-sm font-medium mb-1">{title}</h4>
    {messages.length === 0 ? (
      <p className="text-sm italic opacity-70">Empty</p>
    ) : (
      <ol className="flex flex-col gap-1">
        {messages.map((message, index) => (
          <li key={index} className="text-sm px-2 py-1 rounded-md border border-neutral bg-surface">
            {message}
          </li>
        ))}
      </ol>
    )}
  </div>
);

export const AnnouncerInspector = ({
  className,
  logFocus = false,
  title = "Live region inspector"
}: {
  className?: string;
  /** Also show focus changes in the timeline, to see how they line up with messages */
  logFocus?: boolean;
  title?: string;
}) => {
  const rootRef = React.useRef<HTMLElement>(null);
  const headingId = React.useId();
  const { pairs, log, clearLog } = useAnnouncerMirror(rootRef, logFocus);

  return (
    <section
      ref={rootRef}
      aria-labelledby={headingId}
      className={cn(
        "flex flex-col gap-4 p-4 rounded-md border border-neutral bg-surface-subtle text-foreground",
        className
      )}
    >
      <div>
        <h3 id={headingId} className="font-bold">
          {title}
        </h3>
        <p className="text-sm">
          A visual copy of the announcer's live regions, which are visually hidden. Messages disappear after 7 seconds.
        </p>
      </div>

      {pairs.length === 0 ? (
        <p className="text-sm italic">No live regions on the page yet. They are created before the first message.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {pairs.map((pair, index) => (
            <li
              key={index}
              data-status={pair.status}
              className={cn("flex flex-col gap-2 p-3 rounded-md border bg-surface-muted", {
                "border-accent border-2": pair.status === "audible",
                "border-neutral border-dashed opacity-80": pair.status !== "audible"
              })}
            >
              <div className="flex flex-wrap justify-between gap-2">
                <span className="font-medium">{pair.location}</span>
                <span className="text-sm">{statusText[pair.status]}</span>
              </div>
              <div className="flex flex-wrap gap-4">
                <MessageList title="Polite region" messages={pair.polite} />
                <MessageList title="Assertive region" messages={pair.assertive} />
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-medium">Timeline</h4>
          <button
            type="button"
            onClick={clearLog}
            className="text-sm px-2 py-1 rounded-md border border-neutral bg-surface focus-ring cursor-pointer"
          >
            Clear timeline
          </button>
        </div>
        {log.length === 0 ? (
          <p className="text-sm italic">Nothing yet.</p>
        ) : (
          <ol className="flex flex-col gap-1 text-sm font-mono">
            {log.map((entry, index) => (
              <li key={entry.id} className="grid grid-cols-[4.5rem_5.5rem_1fr] gap-x-3">
                <span>{index === 0 ? "start" : formatGap(entry.time - log[index - 1].time)}</span>
                <span className="font-bold">{entry.kind === "focus" ? "focus →" : entry.kind}</span>
                <span className="min-w-0">
                  {entry.text}
                  {entry.location && <span className="opacity-70"> · {entry.location}</span>}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
};
