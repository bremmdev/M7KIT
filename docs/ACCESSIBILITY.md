# Accessibility guidelines

How this library meets the rules in [AGENTS.md](../AGENTS.md) in practice. Read this before changing the styles of a component.

- [Color contrast](#color-contrast)
- [Forced colors (Windows high contrast)](#forced-colors-windows-high-contrast)
  - [What the browser changes](#what-the-browser-changes)
  - [System colors](#system-colors)
  - [Our choices](#our-choices)
  - [Per component](#per-component)
  - [How we compare to other libraries](#how-we-compare-to-other-libraries)
  - [Writing forced colors styles in Tailwind](#writing-forced-colors-styles-in-tailwind)
  - [Testing](#testing)

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

| What                              | System colors                                                                                | Where                                                                                            |
| --------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Normal content, borders, outlines | Leave them alone: the browser forces them correctly                                          | Everywhere                                                                                       |
| Selected, checked, on             | `HighlightText` on `Highlight`                                                               | Switch, ThemeToggle, SegmentedControl                                                            |
| Value of a progress bar           | `Highlight` fill, `CanvasText` track border                                                  | Progress                                                                                         |
| Focus                             | `Highlight` outline                                                                          | `focus-ring` utilities, Switch, ThemeToggle, Drawer, Popover arrow                               |
| Focus on a `Highlight` fill       | `HighlightText` outline, inside the fill                                                     | Selected SegmentedControl button                                                                 |
| Hover                             | `Highlight` border, or `Highlight` stroke for icon buttons                                   | Button, SortableList Edit Mode button, Popover trigger, GalleryStack arrows, Drawer close button |
| Disabled                          | `GrayText` for text, borders, icons and tracks, with the opacity reset to 100%               | Button, Switch, ThemeToggle, GalleryStack                                                        |
| Edge of a shape                   | A border that only exists, or is only visible, in forced colors; the browser picks its color | Button, Card, Drawer, Progress, SortableList                                                     |
| Lines and fills that are graphics | `CanvasText`                                                                                 | Timeline, FolderStructure, OTPInput cursor                                                       |
| Icons with an explicit color      | `ButtonText` inside buttons, `CanvasText` elsewhere                                          | GalleryStack, Drawer, Rating, Switch, ThemeToggle                                                |
| Decorative overlays               | Hidden                                                                                       | The shine of the `cta` Button                                                                    |

The reasons:

1. **Start by doing nothing.** Text, borders, outlines and native controls already work. Only add styles where something disappears, a state is lost, or colors are kept that clash with the theme.
2. **Selected is `HighlightText` on `Highlight`.** This is the Windows convention for selection, and what Fluent UI, React Spectrum and MUI use for selected toggle buttons, switches and segmented controls. Because of the text backplate, the selected element opts out with `forced-color-adjust: none`, and then sets **every** color inside it to a system color: background, text, border, focus outline and hover. Keep `none` on that small element only. Never put it on a large area "to keep the design": that takes away the user's colors.
3. **Focus is `Highlight`.** It is the focus color of Windows itself and of Fluent UI, React Spectrum and MUI, so users of contrast themes recognize it. Focus is always an `outline`, never a `box-shadow` (removed in forced colors). Where an outline must be hidden normally, use `outline-hidden` (a transparent outline in forced colors), never `outline-none`. On a `Highlight` fill, a `Highlight` outline would blend in, so it becomes `HighlightText` and moves inside the fill (`-outline-offset-4`), where it is drawn on its guaranteed pair.
4. **Hover is `Highlight`, but only where hover is otherwise lost.** Controls whose normal hover is a background or color change get a `Highlight` border (bordered buttons) or stroke (icon buttons), like React Spectrum and Fluent UI. It is a nice-to-have, not a WCAG requirement, so it stays subtle. Text-only controls (links, tabs, unselected segments, the LineClamp trigger, Breadcrumb links) get no hover style in forced colors, the same as native links. Disabled controls never show hover.
5. **Disabled is `GrayText`.** Native controls use it, and users of contrast themes recognize it. Opacity is kept in forced colors, and would make `GrayText` too faint, so it goes back to 100% (`forced-colors:disabled:opacity-100`).
6. **Shapes get an edge.** A filled shape without a border (a button, a card, a progress track) disappears. Use `forced-colors:border` to add a border in forced colors only, or keep a `border-transparent` border that is invisible normally and visible in forced colors. Leave its color to the browser unless the pair matters.
7. **System colors go in matching pairs**, and only behind `forced-colors:`.

### Per component

| Component                                                                                                     | In forced colors                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button                                                                                                        | `primary` and `cta` get a border. Hover turns the border `Highlight`. Disabled and loading use `GrayText` with full opacity, including the spinner. The `cta` shine is hidden |
| Card                                                                                                          | Keeps a transparent border in dark mode (instead of none), so its edge shows                                                                                                  |
| Drawer                                                                                                        | Gets a border. The close icon is `ButtonText`, `Highlight` on hover. The focus outline of the dialog is `Highlight`                                                           |
| FolderStructure                                                                                               | The guide lines are `CanvasText`                                                                                                                                              |
| GalleryStack                                                                                                  | The arrows are `ButtonText`, `Highlight` on hover, `GrayText` while disabled                                                                                                  |
| OTPInput                                                                                                      | The cursor is `CanvasText`. The active slot has a `Highlight` border                                                                                                          |
| Popover                                                                                                       | The trigger's border turns `Highlight` on hover. The arrow follows the `Highlight` focus outline of the content                                                               |
| Progress                                                                                                      | The fill is `Highlight`. The `fill` variant's track gets a `CanvasText` border (the `outline` variant already has an outline)                                                 |
| Rating                                                                                                        | Filled shapes are `CanvasText`, empty ones a `CanvasText` outline on `Canvas`, for every variant                                                                              |
| SegmentedControl                                                                                              | The selected button is `HighlightText` on `Highlight`, with a `HighlightText` focus outline inside the fill                                                                   |
| SortableList                                                                                                  | The Edit Mode button gets a border, `Highlight` on hover. The dragged item gets a `Highlight` border and outline                                                              |
| Switch, ThemeToggle                                                                                           | Off is an outlined track with a `CanvasText` thumb. On is a `Highlight` track with a `HighlightText` thumb. Disabled is `GrayText`. Focus is a `Highlight` outline            |
| Timeline                                                                                                      | The line is `CanvasText`                                                                                                                                                      |
| Breadcrumb, LineClamp, Tabs, Tierlist, Tooltip, TextReveal, TextAnimation, Marquee, Masonry, image components | Nothing: borders, underlines and outlines already carry the state                                                                                                             |

### How we compare to other libraries

Checked in the published code of Fluent UI v9, React Spectrum S2, MUI 9 (including its opt-in `enhanceHighContrast()`), Primer, Radix Themes, Base Web and Chakra UI. Radix Themes, Base Web and Chakra UI don't style components for forced colors.

| Choice                                    | Fluent UI                           | React Spectrum                      | MUI                            | This library                        |
| ----------------------------------------- | ----------------------------------- | ----------------------------------- | ------------------------------ | ----------------------------------- |
| Selected                                  | `Highlight`                         | `HighlightText` on `Highlight`      | `HighlightText` on `Highlight` | `HighlightText` on `Highlight`      |
| Where `forced-color-adjust: none` is used | Selected and hovered parts          | Most controls, with every color set | Selected and active items      | Selected items only                 |
| Disabled                                  | `GrayText`                          | `GrayText`                          | `GrayText`, opacity 1          | `GrayText`, opacity 100%            |
| Focus                                     | `Highlight`                         | `Highlight`                         | `Highlight`                    | `Highlight`                         |
| Hover                                     | `Highlight`                         | `Highlight` border                  | `Highlight` on menu items      | `Highlight` border or stroke        |
| Progress fill                             | `Highlight`                         | `ButtonText`                        | `ButtonText`                   | `Highlight`                         |
| Empty rating item                         | `Canvas` with a `CanvasText` stroke | –                                   | –                              | `Canvas` with a `CanvasText` stroke |

### Writing forced colors styles in Tailwind

- **Put every override behind `forced-colors:`.** Use system colors as arbitrary values: `forced-colors:bg-[Highlight]`, `forced-colors:text-[GrayText]`, `forced-colors:stroke-[ButtonText]`.
- **Pseudo-class variants win over plain `forced-colors:` classes.** `hover:bg-surface-subtle` is more specific than `forced-colors:bg-[Highlight]`, so on hover the forced colors style is lost. Repeat it with the same pseudo-class: `forced-colors:hover:bg-[Highlight]`.
- **Hover on a disabled element still matches `:hover`.** When a hover style must not apply while disabled, scope it to the enabled state (`forced-colors:group-enabled:hover:stroke-[Highlight]`), or check that the disabled style comes later in the generated CSS.
- **An icon with a `text-*`, `stroke-*` or `fill-*` class needs its own override**, even when it is drawn with `currentColor`.
- **`forced-color-adjust-none` is inherited.** Put it on the smallest element that needs it, and set a system color for every color inside it, focus outline and hover included.
- **Comment the reason in the code**, starting with "Forced colors (Windows high contrast)", like the existing components. Mention the forced colors behavior in the component's story docs (Accessibility or Features section) and in the CHANGELOG.
- `cn()` (tailwind-merge) keeps `forced-colors:` classes separate from the plain ones, so a consumer's `className` doesn't remove them.

### Testing

- **Storybook:** the **Overview/All Components** page has every component in its notable states. Its **High Contrast** story shows screenshots of that page in both emulated palettes, including an open Drawer. After changing a component's styles, regenerate them with `npm run screenshots:high-contrast`, check the result in the High Contrast story, and commit the screenshots with the change. When you add a component or a state, add it to `src/_stories/AllComponentsGallery.tsx`. The command builds Storybook first; pass `-- --url http://localhost:6006` to use a running Storybook instead. It needs Playwright's Chromium (`npx playwright install chromium`).
- **Chrome or Edge DevTools:** Rendering panel → "Emulate CSS media feature forced-colors: active", combined with `prefers-color-scheme` light and dark for both emulated palettes. Check the library's light and dark theme too.
- **Playwright:** `page.emulateMedia({ forcedColors: "active", colorScheme: "dark" })`. Screenshot every state (default, hover, focus, selected, disabled, read-only) normally and in both palettes. When you read a color with `getComputedStyle`, wait for transitions first: `transition-colors` also animates `outline-color` and `border-color`.
- **Windows:** Settings → Accessibility → Contrast themes, or left Alt + left Shift + Print Screen. Real themes (Aquatic, Desert, Dusk, Night sky) have other colors than the emulation, so check at least one dark and one light theme before a release.
- **Firefox:** Settings → General → Fonts → Colors… → "Override the colors specified by the page". Its details can differ from Chromium's.
