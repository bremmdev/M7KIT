# Accessibility guidelines

How this library meets the rules in [AGENTS.md](../AGENTS.md) in practice. Read this before changing the styles of a component, or before making a component announce something to screen readers.

- [Color contrast](#color-contrast)
- [Forced colors (Windows high contrast)](#forced-colors-windows-high-contrast)
  - [What the browser changes](#what-the-browser-changes)
  - [System colors](#system-colors)
  - [Our choices](#our-choices)
  - [Per component](#per-component)
  - [How we compare to other libraries](#how-we-compare-to-other-libraries)
  - [Writing forced colors styles in Tailwind](#writing-forced-colors-styles-in-tailwind)
  - [Testing](#testing)
- [Screen reader announcements](#screen-reader-announcements)
  - [When to use it](#when-to-use-it)
  - [How it works](#how-it-works)
  - [Politeness](#politeness)
  - [Dialogs](#dialogs)
  - [How we compare to other libraries](#how-we-compare-to-other-libraries-1)
  - [Testing announcements](#testing-announcements)

---

## Color contrast

WCAG 2.2 AA asks for 4.5:1 for normal text, 3:1 for large text, and 3:1 for the parts of a control needed to see it and its state (WCAG 1.4.11): borders of inputs, tracks, thumbs, focus outlines.

- **`neutral` is `slate-500` in light and dark mode.** It is used only for borders and lines, never for text or behind text. `slate-500` has at least 3:1 against `background` and every `surface` token in light mode (3.86:1 against `surface-strong`, 4.76:1 against white). The earlier `slate-400` had 2.1 to 2.6:1.
- **Focus outlines use `accent` or `foreground`**, through the `focus-ring` utilities in `src/index.css`. Use `focus-ring-neutral` where the accent would be too close to the surface.
- When you add a color token or a state that relies on color, check its contrast against `background` and every `surface` token, in light and dark mode. Don't show state with color alone (WCAG 1.4.1): add a border, an icon, a change in weight, position or shape.

---

## Forced colors (Windows high contrast)

Windows contrast themes (Settings → Accessibility → Contrast themes) replace the colors of every app with a small palette the user picked, for example white text on black, yellow links and cyan selection. Browsers apply this to web pages too. In CSS this is **forced colors mode**: the browser _forces_ its own colors onto the page and ignores most of the page's colors. Detect it with `@media (forced-colors: active)`, or the `forced-colors:` variant in Tailwind.

It is not the same as `prefers-contrast: more` (for example macOS "Increase contrast"). That is a _request_ for more contrast, and the page still picks the colors. In forced colors `prefers-contrast` matches too, so `contrast-more:` styles also apply there.

### What the browser changes

Measured in Chromium (Edge and Chrome on Windows behave the same) and checked against the [CSS Color Adjustment spec](https://www.w3.org/TR/css-color-adjust-1/#forced-colors-properties), [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors) and the [Microsoft Edge blog](https://blogs.windows.com/msedgedev/2020/09/17/styling-for-windows-high-contrast-with-new-standards-for-forced-colors/).

| Property                                             | In forced colors                                                                                                    |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `color`                                              | Replaced by the text color of the element, usually `CanvasText`                                                     |
| `background-color`                                   | Replaced by the pair of that text color, usually `Canvas`. The alpha is kept, so `bg-black/70` becomes 70% `Canvas` |
| `border-color`, `outline-color`                      | Replaced by the text color. **Transparent borders and outlines become visible**                                     |
| `box-shadow`, `text-shadow`                          | Removed                                                                                                             |
| `background-image`                                   | Gradients are removed. `url()` images are kept, with a backplate behind text                                        |
| SVG `fill` / `stroke`                                | Explicit colors are **kept**. `currentColor` follows the forced text color, unless the `<svg>` sets its own `color` |
| `accent-color`, `scrollbar-color`                    | Become `auto`                                                                                                       |
| System colors written by the author (`Highlight`, …) | Kept                                                                                                                |
| `opacity`                                            | Kept                                                                                                                |

- **The forced color depends on the element.** Normal text gets `CanvasText` on `Canvas`, a link `LinkText`, a `<button>` `ButtonText` on `ButtonFace`, an `<input>` `FieldText` on `Field`. ARIA roles don't count: a `<div role="button">` gets `CanvasText`.
- **Text gets a backplate.** Chromium and Firefox draw a rectangle in the forced background color behind each line of text. You can't style it. On a `Highlight` fill it hides `HighlightText`, which is why selected items need `forced-color-adjust: none` (see [Our choices](#our-choices)).
- **State shown only with a background color disappears.** A selected item with a colored fill, a checked switch, a progress bar fill: all become `Canvas` on `Canvas`.
- **Icons depend on how they're colored.** Browsers give `<svg>` `forced-color-adjust: preserve-parent-color`: an icon drawn with `currentColor` (the lucide default) gets the forced text color, but an icon with a `stroke-*`, `fill-*` or `text-*` class keeps that color, and can end up dark on a dark forced background.

### System colors

The theme exposes its palette as CSS system colors: keywords like `Canvas` that work wherever a color goes (in Tailwind `bg-[Canvas]`). They are defined in [CSS Color 4](https://www.w3.org/TR/css-color-4/#css-system-colors). Don't use the deprecated ones (`Window`, `WindowText`, `ButtonHighlight`, `ThreeDFace`, …), and don't use `AccentColor`: its value is unpredictable outside forced colors.

Outside forced colors, system colors are the browser's defaults (`Canvas` is plain white or near-black) and ignore this library's tokens, so **system colors only go behind `forced-colors:`**.

A theme only guarantees contrast between colors that belong together:

| Background                                   | Readable on it                                        |
| -------------------------------------------- | ----------------------------------------------------- |
| `Canvas`                                     | `CanvasText`, `LinkText`, `VisitedText`, `ActiveText` |
| `ButtonFace`                                 | `ButtonText`                                          |
| `Field`                                      | `FieldText`                                           |
| `Highlight`                                  | `HighlightText`                                       |
| `SelectedItem`                               | `SelectedItemText`                                    |
| `Mark`                                       | `MarkText`                                            |
| `Canvas`, `ButtonFace`, `Field` (as borders) | `ButtonBorder`                                        |
| Any of the above                             | `GrayText`, possibly at lower contrast                |

Anything else is a guess: `HighlightText` on `Canvas` may be unreadable.

### Our choices

| What                              | System colors                                                                                                                 | Where                                                              |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Normal content, borders, outlines | Leave them alone: the browser forces them correctly                                                                           | Everywhere                                                         |
| Selected, checked, on             | `HighlightText` on `Highlight`                                                                                                | Switch, ThemeToggle, SegmentedControl                              |
| Filled button                     | `ButtonFace` on `ButtonText`, `HighlightText` on `Highlight` on hover                                                         | `primary` and `cta` Button                                         |
| Value of a progress bar           | `Highlight` fill, `CanvasText` track border                                                                                   | Progress                                                           |
| Focus                             | `Highlight` outline                                                                                                           | `focus-ring` utilities, Switch, ThemeToggle, Drawer, Popover arrow |
| Focus on a `Highlight` fill       | `HighlightText` outline, inside the fill                                                                                      | Selected SegmentedControl button, focused Breadcrumb menu item     |
| Hover on an outlined button       | `Highlight` text, icon and border on `HighlightText`                                                                          | `secondary` Button, Popover trigger, SortableList Edit Mode button |
| Hover on an icon button           | `Highlight` stroke                                                                                                            | GalleryStack arrows, Drawer close button                           |
| Hover on a segment or tab         | `Highlight` border or underline, on a `Canvas` border that only exists in forced colors                                       | Unselected SegmentedControl buttons, unselected Tabs               |
| Hover and focus on a menu item    | `HighlightText` on `Highlight`                                                                                                | Breadcrumb menu                                                    |
| Hover on a disclosure             | `Highlight` text with an underline                                                                                            | FolderStructure folder names                                       |
| Disabled                          | `GrayText` for text, borders, icons and tracks, with the opacity reset to 100%. Filled buttons lose their fill (`ButtonFace`) | Button, Switch, ThemeToggle, GalleryStack                          |
| Edge of a shape                   | A border that only exists, or is only visible, in forced colors; the browser picks its color                                  | Button, Card, Drawer, Progress, SortableList                       |
| Lines and fills that are graphics | `CanvasText`                                                                                                                  | Timeline, FolderStructure, OTPInput cursor                         |
| Icons with an explicit color      | `ButtonText` inside buttons, `CanvasText` elsewhere                                                                           | GalleryStack, Drawer, Rating, Switch, ThemeToggle                  |
| Decorative overlays               | Hidden                                                                                                                        | The shine of the `cta` Button                                      |

The reasons:

1. **Start by doing nothing.** Text, borders, outlines and native controls already work. Only add styles where something disappears, a state is lost, or colors are kept that clash with the theme.
2. **Selected is `HighlightText` on `Highlight`.** This is the Windows convention for selection, and what Fluent UI, React Spectrum and MUI use for selected toggle buttons, switches and segmented controls. Because of the text backplate, the selected element opts out with `forced-color-adjust: none`, and then sets **every** color inside it to a system color: background, text, border, focus outline and hover. Keep `none` on that small element only. Never put it on a large area "to keep the design": that takes away the user's colors.
3. **Focus is `Highlight`.** It is the focus color of Windows itself and of Fluent UI, React Spectrum and MUI, so users of contrast themes recognize it. Focus is always an `outline`, never a `box-shadow` (removed in forced colors). Where an outline must be hidden normally, use `outline-hidden` (a transparent outline in forced colors), never `outline-none`. On a `Highlight` fill, a `Highlight` outline would blend in, so it becomes `HighlightText` and moves inside the fill (`-outline-offset-4`), where it is drawn on its guaranteed pair.
4. **Filled buttons stay filled.** Forced colors replace a fill with `ButtonFace`, so without styles a `primary` button looks the same as a `secondary` one and the main action can't be picked out. Like React Spectrum, a filled button is `ButtonFace` text on a `ButtonText` fill, and `HighlightText` on `Highlight` on hover. Fluent UI fills it with `Highlight` instead, but then it looks selected. The button opts out with `forced-color-adjust: none`, so every color in it is a system color, including the disabled ones.
5. **Hover is `Highlight`, and it must be easy to see.** Every control with a hover style keeps one in forced colors, the same as in Fluent UI and React Spectrum. A `Highlight` border alone is not enough: in light themes it is close to the `CanvasText` border next to it (about 1.4:1 in Chromium's light palette). So hover changes more than a 1px line:
   - Outlined buttons invert, like Fluent UI: `Highlight` text, icon and border on a `HighlightText` background. They opt out with `forced-color-adjust: none` while hovered, to remove the text backplate.
   - Filled buttons turn `Highlight` (rule 4). Icon buttons turn their icon `Highlight`, which changes much more than a border.
   - Unselected segments get a `Highlight` border and unselected tabs a `Highlight` underline, like React Spectrum and Fluent UI. They have a `Canvas` border in forced colors at rest, invisible on the page, so hover doesn't change their size.
   - Menu items are `HighlightText` on `Highlight` while hovered or focused, the active row of a React Spectrum menu.
   - FolderStructure folder names turn `Highlight` and get an underline. Chromium colors a `<summary>` in `LinkText`, which in some themes is close to `Highlight`, so the underline carries the change.
   - Links (Breadcrumb links, the LineClamp trigger) get no hover style, the same as native links: their underline already shows they can be clicked.
   - Disabled controls never show hover. Scope hover to `not-disabled:`, because a disabled element still matches `:hover`.
6. **Disabled is `GrayText`.** Native controls use it, and users of contrast themes recognize it. Opacity is kept in forced colors, and would make `GrayText` too faint, so it goes back to 100% (`forced-colors:disabled:opacity-100`).
7. **Shapes get an edge.** A filled shape without a border (a button, a card, a progress track) disappears. Use `forced-colors:border` to add a border in forced colors only, or keep a `border-transparent` border that is invisible normally and visible in forced colors. Leave its color to the browser unless the pair matters.
8. **System colors go in matching pairs**, and only behind `forced-colors:`.

### Per component

| Component                                                                                   | In forced colors                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Breadcrumb                                                                                  | Menu items are `HighlightText` on `Highlight` while hovered or focused, with a `HighlightText` focus outline inside the fill. The links get no hover style                                                                                                                                                              |
| Button                                                                                      | `primary` and `cta` are `ButtonFace` on `ButtonText`, `HighlightText` on `Highlight` on hover. `secondary` inverts on hover: `Highlight` text and border on `HighlightText`. Disabled and loading use `GrayText` on `ButtonFace` with full opacity, including the spinner, and show no hover. The `cta` shine is hidden |
| Card                                                                                        | Keeps a transparent border in dark mode (instead of none), so its edge shows                                                                                                                                                                                                                                            |
| Drawer                                                                                      | Gets a border. The close icon is `ButtonText`, `Highlight` on hover. The focus outline of the dialog is `Highlight`                                                                                                                                                                                                     |
| FolderStructure                                                                             | The guide lines are `CanvasText`. Folder names turn `Highlight` and get an underline on hover                                                                                                                                                                                                                           |
| GalleryStack                                                                                | The arrows are `ButtonText`, `Highlight` on hover, `GrayText` while disabled                                                                                                                                                                                                                                            |
| OTPInput                                                                                    | The cursor is `CanvasText`. The active slot has a `Highlight` border                                                                                                                                                                                                                                                    |
| Popover                                                                                     | The trigger inverts on hover: `Highlight` icon and border on `HighlightText`. The arrow follows the `Highlight` focus outline of the content                                                                                                                                                                            |
| Progress                                                                                    | The fill is `Highlight`. The `fill` variant's track gets a `CanvasText` border (the `outline` variant already has an outline)                                                                                                                                                                                           |
| Rating                                                                                      | Filled shapes are `CanvasText`, empty ones a `CanvasText` outline on `Canvas`, for every variant                                                                                                                                                                                                                        |
| SegmentedControl                                                                            | The selected button is `HighlightText` on `Highlight`, with a `HighlightText` focus outline inside the fill. The other buttons get a `Highlight` border on hover                                                                                                                                                        |
| SortableList                                                                                | The Edit Mode button gets a border, and inverts on hover: `Highlight` text, icon and border on `HighlightText`. The dragged item gets a `Highlight` border and outline                                                                                                                                                  |
| Switch, ThemeToggle                                                                         | Off is an outlined track with a `CanvasText` thumb. On is a `Highlight` track with a `HighlightText` thumb. Disabled is `GrayText`. Focus is a `Highlight` outline                                                                                                                                                      |
| Tabs                                                                                        | The underline of the selected tab is `Highlight`. Unselected tabs get a `Highlight` underline on hover                                                                                                                                                                                                                  |
| Timeline                                                                                    | The line is `CanvasText`                                                                                                                                                                                                                                                                                                |
| LineClamp, Tierlist, Tooltip, TextReveal, TextAnimation, Marquee, Masonry, image components | Nothing: borders, underlines and outlines already carry the state                                                                                                                                                                                                                                                       |

### How we compare to other libraries

Checked in the published code of Fluent UI v9, React Spectrum S2, MUI 9 (including its opt-in `enhanceHighContrast()`), Primer, Radix Themes, Base Web and Chakra UI. Radix Themes, Base Web and Chakra UI don't style components for forced colors.

| Choice                                    | Fluent UI                                                               | React Spectrum                                          | MUI                            | This library                                                                                                |
| ----------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| Selected                                  | `Highlight`                                                             | `HighlightText` on `Highlight`                          | `HighlightText` on `Highlight` | `HighlightText` on `Highlight`                                                                              |
| Where `forced-color-adjust: none` is used | Selected and hovered parts                                              | Most controls, with every color set                     | Selected and active items      | Selected items, filled buttons, hovered outlined buttons and menu items                                     |
| Filled (primary) button                   | `Highlight` fill, `HighlightText` text; hover swaps them                | `ButtonText` fill, `ButtonFace` text; hover `Highlight` | Not checked                    | `ButtonText` fill, `ButtonFace` text; hover `Highlight`                                                     |
| Disabled                                  | `GrayText`                                                              | `GrayText`                                              | `GrayText`, opacity 1          | `GrayText`, opacity 100%                                                                                    |
| Focus                                     | `Highlight`                                                             | `Highlight`                                             | `Highlight`                    | `Highlight`                                                                                                 |
| Hover                                     | `Highlight`: inverted buttons, tab indicator, menu item border and text | `Highlight` border, focused menu row fill               | `Highlight` on menu items      | `Highlight`: inverted outlined buttons, filled buttons, icons, segment border, tab underline, menu row fill |
| Progress fill                             | `Highlight`                                                             | `ButtonText`                                            | `ButtonText`                   | `Highlight`                                                                                                 |
| Empty rating item                         | `Canvas` with a `CanvasText` stroke                                     | –                                                       | –                              | `Canvas` with a `CanvasText` stroke                                                                         |

### Writing forced colors styles in Tailwind

- **Put every override behind `forced-colors:`.** Use system colors as arbitrary values: `forced-colors:bg-[Highlight]`, `forced-colors:text-[GrayText]`, `forced-colors:stroke-[ButtonText]`.
- **Pseudo-class variants win over plain `forced-colors:` classes.** `hover:bg-surface-subtle` is more specific than `forced-colors:bg-[Highlight]`, so on hover the forced colors style is lost. Repeat it with the same pseudo-class: `forced-colors:hover:bg-[Highlight]`.
- **Hover on a disabled element still matches `:hover`.** Scope forced colors hover styles to the enabled state: `forced-colors:not-disabled:hover:bg-[Highlight]` (also works on links, which have no `:enabled`), or `forced-colors:group-enabled:hover:stroke-[Highlight]` for an icon inside a button. This matters most with `forced-color-adjust-none` on hover: on a disabled element it would bring back the normal colors.
- **A border that appears on hover changes the size.** Give the element the border in forced colors at rest, in `Canvas` so it doesn't show, and change only its color on hover: `forced-colors:border forced-colors:border-[Canvas] forced-colors:hover:border-[Highlight]`. Don't use a transparent border for this: forced colors make it visible.
- **An icon with a `text-*`, `stroke-*` or `fill-*` class needs its own override**, even when it is drawn with `currentColor`.
- **`forced-color-adjust-none` is inherited.** Put it on the smallest element that needs it, and set a system color for every color inside it, focus outline and hover included.
- **Comment the reason in the code**, starting with "Forced colors (Windows high contrast)", like the existing components. Mention the forced colors behavior in the component's story docs (Accessibility or Features section) and in the CHANGELOG.
- `cn()` (tailwind-merge) keeps `forced-colors:` classes separate from the plain ones, so a consumer's `className` doesn't remove them.

### Testing

- **Storybook:** the **Overview/All Components** page has every component in its notable states. Its **High Contrast** story shows screenshots of that page in both emulated palettes, including an open Drawer. After changing a component's styles, regenerate them with `npm run screenshots:high-contrast`, check the result in the High Contrast story, and commit the screenshots with the change. When you add a component or a state, add it to `src/_stories/AllComponentsGallery.tsx`. Components that only lay out images or add effects forced colors don't change (DiamondGrid, ImageShowcase, Masonry, ShimmerImage) are left out to keep the screenshots small; add them once they get their own colors, borders or controls. The command builds Storybook first; pass `-- --url http://localhost:6006` to use a running Storybook instead. It needs Playwright's Chromium (`npx playwright install chromium`).
- **Chrome or Edge DevTools:** Rendering panel → "Emulate CSS media feature forced-colors: active", combined with `prefers-color-scheme` light and dark for both emulated palettes. Check the library's light and dark theme too.
- **Playwright:** `page.emulateMedia({ forcedColors: "active", colorScheme: "dark" })`. Screenshot every state (default, hover, focus, selected, disabled, read-only) normally and in both palettes. When you read a color with `getComputedStyle`, wait for transitions first: `transition-colors` also animates `outline-color` and `border-color`.
- **Windows:** Settings → Accessibility → Contrast themes, or left Alt + left Shift + Print Screen. Real themes (Aquatic, Desert, Dusk, Night sky) have other colors than the emulation, so check at least one dark and one light theme before a release.
- **Firefox:** Settings → General → Fonts → Colors… → "Override the colors specified by the page". Its details can differ from Chromium's.

---

## Screen reader announcements

A status message (the result of an action, a waiting state, progress or an error) must reach screen reader users without moving focus (WCAG 2.2 SC 4.1.3). Components send them through the shared announcer in `src/Announcer` (`useAnnounce()`, or `announce()` outside React), never through a live region of their own. Apps get the same functions, so the whole page shares two regions and one queue.

### When to use it

| Situation                                                                                                     | Use                                                                                          |
| ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Something changed that has no text for screen readers: a read-only switch that doesn't toggle, an item moved | The announcer                                                                                |
| A visible message appears ("3 results")                                                                       | Make that element the live region (`role="status"`), rendered before the message             |
| The state of a control changed (expanded, selected, checked)                                                  | An ARIA state on the control. Screen readers announce it, an announcement as well is heard twice |
| The user has to act on it                                                                                     | Move focus to it (a dialog)                                                                  |
| An error                                                                                                      | Visible error text next to the field that stays (WCAG 3.3.1). Optionally an announcement too |

### How it works

- **Two regions per container**, one polite and one assertive: `role="log"` with `aria-relevant="additions"` and no `aria-atomic`. They are visually hidden with inline styles, never with `display: none`, `hidden` or `aria-hidden`: hidden regions are never announced.
- **Each message is a new child element.** Messages from different components can't overwrite each other, and a repeated message is announced again. `role="status"` and `role="alert"` are atomic, so they would read every message in the region again. Messages are removed after 7 s, so they aren't found later when browsing.
- **One queue.** A message is written about 100 ms after `announce()`, then one every 250 ms, assertive first. A waiting message with the same `id` is replaced, so a burst only announces the latest. When it is written, an older message with the same `id` is removed. With a `delay`, a message waits longer before it is written, and a newer message with the same `id` starts the wait again. That's for a series spread out over time, like quick key presses: a message that has been written is in the screen reader's queue, and removing it doesn't take it out again.
- **New regions wait.** Screen readers can miss a message in a region that was only just added, so a new pair waits 150 ms before its first message. `useAnnounce()` creates the pair on mount, and `Drawer` and a `Popover` with `trapFocus` create one when they open.
- **One place writes** (`write()` in `Announcer.ts`), so the announcer can move to `ariaNotify()` once VoiceOver supports it reliably. In June 2026 it still failed on iOS.

### Politeness

Polite by default. Assertive only for errors and time-critical messages ("Connection lost", "Your session ends in 1 minute"):

- WCAG lists "Using `role="alert"` or `aria-live="assertive"` on content which is not important and time-sensitive" as a failure of 4.1.3.
- Assertive is unreliable anyway. In [Adrian Roselli's tests (January 2026)](https://adrianroselli.com/2026/01/live-region-support.html), NVDA, JAWS, Narrator, Orca and TalkBack treated it as polite. VoiceOver interrupts what it is reading, and screen readers may drop waiting polite messages (WAI-ARIA allows it).
- The regions don't use `role="alert"`: NVDA says "alert" first, and Orca didn't announce it at all.

`SortableList` announces its moves politely. Focus moves to the moved item at the same time, and a polite message is read after the item's name instead of cutting it off. Moves wait 500 ms (`delay`), so moving an item several times quickly only announces the final position.

### Dialogs

`showModal()` makes everything outside the dialog inert, and `aria-modal="true"` makes screen readers ignore it. That includes live regions, and `Drawer` also puts `inert` on `<body>`. So a message goes to the regions inside the open modal. They are picked when the message is written, not when `announce()` is called, so a message sent while a dialog closes goes to the page:

1. the open dialog or `[aria-modal="true"]` element around `from`, unless another modal is open on top of it,
2. otherwise the topmost open modal, also for a message from the page behind it,
3. otherwise the end of `<body>`.

In a dialog the pair is the first child, so it doesn't change which element is the consumer's `:last-child` (Tailwind's `space-*` and `divide-*`).

### How we compare to other libraries

Checked in their published source code in October 2026.

| Choice                 | React Aria                     | Fluent UI v9                                      | Angular CDK                           | Primer                                 | This library                                        |
| ---------------------- | ------------------------------ | ------------------------------------------------- | ------------------------------------- | -------------------------------------- | --------------------------------------------------- |
| Delivery               | Function                       | Provider and hook (does nothing without provider) | Service                               | Custom element and function            | Function and hook                                   |
| Regions                | 2, `role="log"`                | `ariaNotify()`, otherwise 1 assertive region      | 1, politeness switched per message    | 2                                      | 2, `role="log"`, per container                      |
| Message                | Appended, removed after 7 s    | Queued, text replaced every 500 ms                | Text replaced after 100 ms            | Queued, text replaced, 150 ms apart    | Appended, 250 ms apart, removed after 7 s           |
| Default politeness     | Assertive                      | Normal                                            | Polite                                | Polite                                 | Polite                                              |
| Modal dialogs          | Left out of its own `aria-hidden` | None                                           | `aria-owns` from each modal           | Region inside the open `<dialog>`      | Regions inside the topmost open modal               |

### Testing announcements

- **Unit tests** (`src/Announcer/Announcer.spec.tsx`, with Jest fake timers) cover the regions, the timing, `id`, `clearAnnouncer()` and dialogs. jsdom has no accessibility tree, no `showModal()` and no `:modal`, so a `<dialog open data-modal>` stands in for a modal dialog.
- **Storybook:** the **Utilities/Announcer** stories show every scenario with a live region inspector: where the regions are, whether screen readers can hear them, what they contain, and a timeline of messages and focus changes.
- **Chromium:** the Chrome DevTools Protocol (`Accessibility.getPartialAXTree`) shows whether a region is exposed to screen readers or ignored, for example because it is inert behind a modal.
- **Screen readers:** NVDA with Firefox and Chrome, JAWS with Chrome, Narrator with Edge, VoiceOver with Safari on macOS and iOS, and TalkBack with Chrome. Results differ between screen readers and between their versions.
