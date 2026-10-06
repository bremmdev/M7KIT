# 0.63.0 - 2026-10-06

- Make hover easier to see in Windows high contrast mode (forced colors), following Fluent UI and React Spectrum:
  - `Button`: the `primary` and `cta` variants stay filled (`ButtonFace` on `ButtonText`, `HighlightText` on `Highlight` on hover) instead of looking the same as `secondary`. The `secondary` variant inverts on hover (`Highlight` text and border on `HighlightText`) instead of only turning its border `Highlight`. Disabled and loading buttons lose the fill and show no hover
  - The `Popover` trigger and the `SortableList` Edit Mode button invert on hover the same way
  - `Tabs`: unselected tabs get a `Highlight` underline on hover
  - `SegmentedControl`: unselected buttons get a `Highlight` border on hover
  - `Breadcrumb`: a hovered or focused item in a `BreadcrumbMenu` uses `HighlightText` on `Highlight`
  - `FolderStructure`: folder names turn `Highlight` and get an underline on hover

# 0.62.0 - 2026-10-06

- Fix components in Windows high contrast mode (forced colors), following the approach of `Switch` and `ThemeToggle`:
  - `Progress`: the fill no longer disappears; it uses `Highlight`, and the `fill` track gets a border
  - `Button`: `primary` and `cta` get a border to keep their shape, disabled and loading buttons use `GrayText` instead of reduced opacity, the loading spinner stays visible, and the decorative `cta` shine is hidden
  - `SegmentedControl`: the selected button uses `HighlightText` on `Highlight`, instead of only a border
  - `Rating`: shapes use `CanvasText` instead of their fixed colors, so `circle-black` no longer disappears on a dark theme and the other variants don't clash with a light one
  - `OTPInput`: the cursor no longer disappears, and the active slot gets a `Highlight` border
  - `Timeline` and `FolderStructure`: the connecting lines no longer disappear
  - `Drawer`: the close icon no longer disappears, and the drawer gets a border to show its edge
  - `GalleryStack`: the navigation arrows no longer disappear, and use `GrayText` while disabled
  - `SortableList`: the Edit Mode button gets a border, and the dragged item a `Highlight` border and outline
  - `Card`: keeps its border in dark mode (transparent there), so its edge stays visible
  - `Tabs`: the underline of the selected tab uses `Highlight`, instead of a color that changed after clicking a tab
  - The `Timeline` Custom Bullet story colors its icons with a class and a `CanvasText` override, instead of an accent color forced colors keep
  - Focus outlines are `Highlight`, the Windows focus color, in every component, including the `focus-ring` utilities in `m7kit/css`, `Switch` and `ThemeToggle`
  - Hover shows as a `Highlight` border or icon on `Button`, the `SortableList` Edit Mode button, the `Popover` trigger, the `GalleryStack` arrows and the `Drawer` close button, whose normal hover is a background change
- Fix the `OTPInput` slot background and the `FolderStructure` container background, which used a misspelled class (`bg-surface-suble`) and were never applied
- Darken the light mode `neutral` color from `slate-400` to `slate-500` (the dark mode value), so borders and lines that use it have at least 3:1 contrast (WCAG 1.4.11) against the background and every surface token. This affects `OTPInput`, `Popover`, `Tooltip`, `Card`, `Tabs`, `Timeline`, `Tierlist`, `SortableList`, `Breadcrumb` and `FolderStructure`, and your own `neutral` classes

# 0.61.0 - 2026-10-04

- Apply the `Switch` accessibility improvements to `ThemeToggle`:
  - Add `readOnly` and `readOnlyMessage`: a lock on the thumb, `aria-readonly`, and a description and live region announcement for screen readers that don't support `aria-readonly` on switches (like NVDA)
  - Keep `ThemeToggle` in sync with its form when the form is reset
  - Add dev warnings for incorrect usage or mixing of controlled and uncontrolled behavior
  - Forward `ref` to the native input, and apply `style` to the root element instead of the input
  - Fix contrast (WCAG 1.4.11): add a border to the off state, use a darker day track (`blue-600`) and a lighter sun (`amber-300`) so the thumb has 3:1 contrast, and use the foreground color for the focus outline in every state
  - Make `ThemeToggle` visible in Windows high contrast mode (forced colors) using system colors
  - Add rtl support: the thumb and the track icons mirror in right-to-left layouts
  - Dim `ThemeToggle` inside a disabled `<fieldset>`, the same as with the `disabled` prop
  - Stretch the invisible input over the track, so touch screen readers find the toggle where it is drawn, and stop the root from stretching in a flex or grid parent
  - Fix the `lg` star and cloud sizes, which were built from a template string that Tailwind can't detect
- **Breaking**: the default `label` of `ThemeToggle` is now "Light mode" instead of "theme", because the toggle is on in light mode and "theme, switch, on" doesn't say what on means
- **Breaking**: calling `preventDefault()` in the `onChange` of `ThemeToggle` no longer cancels the change, the same as `Switch`. It left the input checked while the toggle showed it as off. Use controlled mode to reject a change
- Move the controlled/uncontrolled dev warnings and the form reset handling of `Switch` into shared hooks
- Expand the `ThemeToggle` documentation and add stories for usage without a visible label, controlled usage, disabled, disabled fieldsets, read-only, descriptions, forms and rtl

# 0.60.0 - 2026-10-04

- Add rtl support for `Switch`: the thumb starts on the right and moves left when turned on
- Redefine the `rtl:` and `ltr:` variants in `m7kit/css` with `:dir()`, so they no longer match inside a nested section with the opposite direction. This also applies to your own `rtl:` / `ltr:` classes
- Dim `Switch` inside a disabled `<fieldset>`, the same as with the `disabled` prop
- Fix `Switch` becoming clickable across the whole row when placed in a flex column or grid cell: the click area now matches the visible switch
- Show a lock on the thumb of a read-only `Switch`, replacing the thumb indicators
- Make `Switch` visible in Windows high contrast mode (forced colors): the thumb no longer disappears, and on, off and disabled use system colors
- Announce read-only `Switch` to screen readers that don't support `aria-readonly` on switches (like NVDA): "Read only" is read on focus and announced when the user tries to toggle it.
- Expand the `Switch` documentation (form behavior, callbacks, accessibility) and add stories for forms, descriptions, disabled fieldsets and rtl
- Hide the decorative triangle in `FolderStructure` from screen readers
- Fix `Drawer` closing when a control inside it is used with the keyboard (Space on a checkbox, Enter on a button) or through a `<label>`. It now only closes on a backdrop click
- Add support for high contrast modes for `Switch`

# 0.59.0 - 2026-10-02

- Add dev warnings for `Switch` for incorrect usage or mixing of controlled and uncontrolled behavior
- Make `Switch` clickable without label
- Pass style prop to `Switch` wrapper
- Keep `Switch` in sync with its form when the form is reset (a reset button, `form.reset()`, or React 19's automatic reset after a form action).
- Add readonly to `Switch`
- Add border to `Switch` off state for contrast

# 0.58.0 - 2026-09-13

- Fix button/link prop differentiation in `Button`

# 0.57.0 - 2026-05-27

- Fix failing tests
- Expose `theme.css` and `index.css` as CSS source files instead of compiling them

# 0.56.0 - 2026-05-17

- Add `Progress`
- Deprecate `PageScrollIndicator`

# 0.55.0 - 2026-05-15

- Update to Vite 8
- Move certain packages from devDependencies to dependencies

# 0.54.0 - 2026-05-15

- Add `ThemeToggle`

# 0.53.0 - 2026-05-14

- Add play and stop icons for `Switch`

# 0.52.0 - 2026-05-12

- Add `Switch`

# 0.51.0 - 2026-03-19

- Export missing types
- Add peerDependency for React

# 0.50.1 - 2026-02-09

- Add focus outline to `PopoverArrow` 

# 0.50.0 - 2026-02-06

- Add `Popover`
- Refactor `useFocusTrap` 

# 0.49.0 - 2026-02-05

- Remove CommonJS

# 0.48.2 - 2026-02-04

- Workflow changes for version detection

# 0.48.1 - 2026-02-03

- README changes because of package scoping

# 0.48.0 - 2026-02-03

- Migrate m7kit to scoped package @bremmdev/m7kit

# 0.47.0 - 2026-01-30

- Remove `tapToClose` prop from `Tooltip`
- Make touch behavior on mobile optional for `Tooltip`

# 0.46.0 - 2026-01-29

- Do not import tailwindcss in exported css files
- Create separate css entry point for storybook

# 0.45.0 - 2026-01-27

- Add aria-hidden to `TooltipArrow`
- Add optional `tapToClose` to `Tooltip` for mobile devices

# 0.44.2 - 2026-01-26

- Properly reset `neverfits` variable for `Tooltip` so re-opening leads to correct placements

# 0.44.1 - 2026-01-25

- Place tooltip in the center width contrained width when no placement fits

# 0.44.0 - 2026-01-24

- Refactor Tooltip with the following improvements:
    - Add controlled mode so component can be used both controlled and uncontrolled
    - Use context for easier state management
    - Add TooltipArrow
    - Add close on Escape when opening with hover
    - If the tooltip is invoked when a pointing cursor moves over the trigger element, then it remains open as long as the cursor is over the trigger or the tooltip
    - Move the `placement` prop to `TooltipContent`
    - Use a gutter/padding to not place tooltipcontent directly against viewport edges
    - Refactor position logic to prefer smaller movement (i.e left -> center if possible) instead of flipping to the opposite side

# 0.43.1 - 2026-01-21

- Fix failing build due to dirname problem

# 0.43.0 - 2026-01-21

- Rename `CardHeader` to `CardTitle`

# 0.42.0 - 2026-01-21

- Separately export theme.css so consumers can import theme

# 0.41.0 - 2026-01-20

- Add `Card`, `CardHeader`, `CardContent`
- Fixed dark mode opacity `Button`

# 0.40.2 - 2026-01-19

- Explicitly define dark: classes for `Button`

# 0.40.1 - 2026-01-19

- Fix button imports

# 0.40.0 - 2026-01-19

- Add `Button` and use `CTAButton` as variant for this
- Remove `LoadingButton` and separate `CTAButton` component

# 0.39.2 - 2026-01-19

- Fix default export for css declaration

# 0.39.1 - 2026-01-19

- Add type declaration file for css

# 0.39.0 - 2026-01-18

- Update to Storybook 10
- Change color variables

# 0.38.1 - 2025-10-17

- Use Trusted Publisher instead of npm tokens

# 0.38.0 - 2025-10-12

- Migrate to Tailwind v4 and Storybook 9
- Change theme color names
- Fix `useFocusTrap` in combination with `SortableList`

# 0.37.2 - 2025-10-10

- Refactor `useFocusTrap` and use it in `Drawer` and `SortableList`

# 0.37.1 - 2025-10-06

- Add title attr to edit mode button in `SortableList` component
- Add screenreader text to edit mode button in `SortableList` component

# 0.37.0 - 2025-10-05

- Add `SortableList` component

# 0.36.0 - 2024-12-30

- Add `Tooltip` component

# 0.35.0 - 2024-12-26

- Rename `Breadcrumbs` to `Breadcrumb`
- Use useId in `Breadcrumb` for better accessibility
- Add `BreadcrumbCurrentItem` for current breadcrumb item
- Refactor `BreadcrumbMenu`

# 0.34.0 - 2024-12-25

- Upgrade to React 19
- Fix `OTPInput` cursor
- Remove `Slider` component
- Fix several stories and tests

# 0.33.0 - 2024-11-13

### Added

- Add `CTAButton` component

## 0.32.1 - 2024-09-12

### Changed

- Add customizable classes to `Tierlist`
- Add mobile touch support to `Tierlist`

### Fixed

- Fix mobile scrolling for `Tierlist`

## 0.32.0 - 2024-09-11

### Added

- Add `Tierlist` component

## 0.31.0 - 2024-08-25

### Add

- Add css variable for muted background color

## 0.30.0 - 2024-08-23

### Added

- Add `SegmentedControl` component

## 0.29.0 - 2024-08-20

### Added

- Add `LoadingButton` component

## 0.28.1 - 2024-08-15

### Changed

- Add `step` prop to `AnimatedCount` component
- Prevent layout shift in `AnimatedCount` component

## 0.28.0 - 2024-08-14

### Added

- Add `AnimatedCount` component

## 0.27.0 - 2024-08-12

### Added

- Add `TextAnimation` component

## 0.26.1 - 2024-08-11

### Added

- Add `resetScroll` prop to `Drawer` component
- Add `onOpen` and `onClose` props to `Drawer` component for callbacks
- Add FocusTrap to `Drawer` component

## 0.26.0 - 2024-08-10

### Added

- Add `Drawer` component
- Add `usePreventScroll` hook
- Add CSS variables clr-text-inverted and clr-bg-surface

## 0.25.2 - 2024-08-08

### Changed

- Changed stories for `LineClamp` component

## 0.25.1 - 2024-08-08

### Changed

- Only show `LineClampTrigger` when needed

## 0.25.0 - 2024-08-07

### Added

- Add `LineClamp` component
- Add `useResizeWindow` hook

## 0.24.1 - 2024-08-02

### Fixed

- Fix `Breadcrumb` click outside dropdown to close
- Fix `Breadcrumb` arrowUp and arrowDown keyboard navigation

## 0.24.0 - 2024-08-02

### Changed

- Refactor `Breadcrumb` component into subcomponents
- Add separator prop to `Breadcrumb` component
- Add `BreadcrumbMenu` component to collapse some breadcrumbs into a dropdown
- Add focus ring utilities to Tailwind config

## 0.23.0 - 2024-08-01

### Changed

- Changed global theming
- Add full support for dark mode
- Add CSS variables for theming
- Add theme toggle addon to Storybook
- Change styling for several components to use CSS variables

## 0.22.0 - 2024-07-25

### Changed

- Refactor `FolderStructure` component
- Add folder icon to `FolderStructure` component
- Add trailingSlash and open prop to `FolderStructure` component
- Change indentation for `FolderStructure` component

## 0.21.0 - 2024-05-23

### Added

- Add `ShimmerImage` component

## 0.20.0 - 2024-05-20

### Added

- Add `Marquee` component

### Changed

- rename 'Basic' to 'Default' for storybook stories
- change keyframes for `TextReveal` component

## 0.19.0 - 2024-05-14

### Added

- Add `TextReveal` component

### Changed

- rename '...remainingProps' to '...rest' for consistency

## 0.18.4 - 2024-05-08

### Fix

- Fix SSR hydration errors `Masonry` component
- Add `key` prop to `ImageShowcase` children

## Removed

- Remove sourcemaps from build

## 0.18.3 - 2024-05-07

### Fix

- Fix classNames prop for `DsBreadcrumbs` component
- Fix top position for `PageScrollIndicator` component
- Properly export `ImageShowcase` component
- Stories fixes

## 0.18.2 - 2024-05-07

### Added

- Add Github Action for publishing to npm

## 0.18.1 - 2024-05-07

### Added

- Add Readme

## 0.18.0 - 2024-05-06

### Changed

- Changed tsconfig and viteconfig for publishing to npm

## 0.17.0 - 2024-04-12

### Added

- Added `ImageShowcase` component

## 0.16.1 - 2024-04-11

### Added

- Added hover effect to `DiamondGrid` component

## 0.16.0 - 2024-04-10

### Added

- Added `DiamondGrid` component

## 0.15.0 - 2024-04-06

### Added

- Added `GalleryStack` component

### Changed

- Update dependencies

## 0.14.1 - 2024-03-16

### Added

- Added controlled mode to `Tabs` component

## 0.14.0 - 2024-03-15

### Added

- Add `Tabs` component

## 0.13.0 - 2024-03-15

### Changed

- Upgrade to Storybook 8

## 0.12.0 - 2024-03-09

### Added

- Add `Timeline` component

## 0.11.1 - 2024-02-28

### Added

- Add keyboard support to `OTPInput`
- Add aria-label and name to `OTPInput`

## 0.11.0 - 2024-02-27

### Added

- Added `OTPInput` component

## 0.10.3 - 2024-02-21

### Added

- Added responsiveness to `Masonry` component

## 0.10.2 - 2024-02-20

### Added

- Added tests for `Masonry` component

### Changed

- Make spacing prop optional for `Masonry` component

## 0.10.1 - 2024-02-20

### Changed

- Improve vertical ordering of `Masonry` component
- Use local image for `Masonry` component

## 0.10.0 - 2024-02-19

### Added

- Add `Masonry` component

## 0.9.1 - 2024-02-18

### Added

- Add darkmode to `PageScollIndicator` component

## 0.9.0 - 2024-02-17

### Added

- Add `PageScollIndicator` component

### Fixed

- Fixed exports for `Rating` component

## 0.8.3 - 2024-02-03

### Changed

- Refactor logic for calculating value and offset in `Slider` component

### Added

- Add pageUp and pageDown keyboard support to `Slider` component

## 0.8.2 - 2024-01-30

### Added

- Add variants to `Rating` component

## 0.8.1 - 2024-01-30

### Fixed

- Fixed rounding errors in `Rating` component

## 0.8.0 - 2024-01-29

### Added

- Added `Rating` component

## 0.7.4 - 2024-01-23

### Changed

- Throttle `Slider` mouseMove event

## 0.7.3 - 2024-01-22

### Added

- Add decimal support to `Slider`

## 0.7.2 - 2024-01-22

### Changed

- Refactor `Slider`, break out smaller components and use React Context

### Added

- Add vertical orientation option to `Slider`

## 0.7.1 - 2024-01-21

### Added

- Add vertical orientation option to `Slider`

## 0.7.0 - 2024-01-20

### Added

- Add `Slider` component

## 0.6.1 - 2024-01-17

### Added

- Add `Breadcrumbs` component
- Add addon-a11y
- Add lucide-react icons

### Changed

- CSS changes for `SkipLink` component

## 0.5.1 - 2024-01-16

### Added

- Add tests for `SkipLink` and `FolderStructure` components

## 0.5.0 - 2024-01-16

### Added

- Add jest and react-testing-library for testing

### Fix

- small css fix for `SkipLink` component
- change storybook preview to fullscreen

## 0.4.0 - 2024-01-15

### Added

- Add `SkipLink` component
- Add JDDoc for stories

## 0.3.0 - 2024-01-15

### Added

- Add clsx and tw-merge to allow class overrides

## 0.2.1 - 2024-01-14

### Changed

- Remove internal `Intendation` component for `FolderStructure` component
- Add indentSize prop to `FolderStructure`
- General refactoring for `FolderStructure`

## 0.2.0 - 2024-01-14

### Added

- Autodocs for Storybook

## 0.1.0 - 2024-01-13

### Added

- `FolderStructure` component
- Add TailwindCSS for styling
