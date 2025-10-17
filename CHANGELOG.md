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
