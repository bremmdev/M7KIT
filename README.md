# m7kit - React Component Library

## Description

m7kit is a React component library designed to facilitate the integration of less common UI components into your React applications. It is built with React and TailwindCSS, providing a seamless development experience. This library focuses on offering unique image components, such as Masonry, GalleryStack, DiamondGrid, and ImageShowcase.

## Installation

```
npm install @bremmdev/m7kit
```

## Usage

After installing m7kit, import components from the JavaScript package:

```ts
import { Masonry, GalleryStack, DiamondGrid, ImageShowcase } from "@bremmdev/m7kit";
```

Then import the CSS from your application's Tailwind CSS entry file, for example `src/index.css` or `src/app.css`:

```css
@import "tailwindcss";
@import "@bremmdev/m7kit/css";
@import "@bremmdev/m7kit/theme";
```

The CSS exports are Tailwind CSS v4 source files. They include Tailwind directives such as `@source`, `@theme`, `@variant`, and `@utility`, so they should be imported into a CSS file that is processed by Tailwind. Do not import them from JavaScript unless your bundler runs imported CSS through Tailwind v4.

## Theming

Colors, animations, and design tokens are defined using Tailwind v4 theme variables. These variables are available both as CSS variables and as Tailwind utility classes, such as `bg-accent`, `text-foreground`, and `animate-shimmer`.

There are two ways to use the theme.

### 1. Import the default theme

Use this if you want m7kit's default tokens and dark-mode variables:

```css
@import "tailwindcss";
@import "@bremmdev/m7kit/css";
@import "@bremmdev/m7kit/theme";
```

`@bremmdev/m7kit/css` contains the component styles and tells Tailwind to scan m7kit's built component files for class names.
`@bremmdev/m7kit/theme` contains the default `@theme` block and `[data-theme="dark"]` variable overrides.

### 2. Provide your own theme

Use this if you want full control over the design tokens. Import the component CSS, then define the theme variables yourself:

```css
@import "tailwindcss";
@import "@bremmdev/m7kit/css";

@variant dark (&:where([data-theme="dark"], [data-theme="dark"] *)); /* for dark-mode with data-theme="dark" */

@theme {
    --color-accent: oklch(59.2% 0.249 0.584);
    /* pink-600 */
    --color-button-accent: oklch(59.2% 0.249 0.584);
    /* pink-600 */
    --color-surface: oklch(1 0 0);
    /* white */
    --color-surface-subtle: oklch(98.4% 0.003 247.858);
    /* slate-50 */
    --color-surface-muted: oklch(96.8% 0.007 247.896);
    /* slate-100 */
    --color-neutral: oklch(70.4% 0.04 256.788);
    /* slate-400 */
    --color-foreground: oklch(20.8% 0.042 265.755);
    /* slate-900 */
    --color-foreground-inverse: oklch(1 0 0);
    /* white */
    --color-background: oklch(1 0 0);
    /* white */
}

@layer theme {
    [data-theme="dark"] {
        --color-accent: oklch(79.2% 0.249 0.584);
        /* pink-600 */
        --color-button-accent: oklch(59.2% 0.249 0.584);
        /* pink-600 */
        --color-surface: oklch(20.8% 0.042 265.755);
        /* slate-900 */
        --color-surface-subtle: oklch(27.9% 0.041 260.031);
        /* slate-800 */
        --color-surface-muted: oklch(37.2% 0.044 257.287);
        /* slate-700 */
        --color-neutral: oklch(55.4% 0.046 257.417);
        /* slate-500 */
        --color-foreground: oklch(92.9% 0.013 255.508);
        /* slate-200 */
        --color-foreground-inverse: oklch(12.9% 0.042 264.695);
        /* slate-950 */
        --color-background: oklch(13% 0.028 261.692);
        /* gray-950 */
    }
}
```

In both cases, colors can also be changed by overriding the generated CSS variables:

```css
:root {
    --color-accent: red;
    --color-button-accent: red;
}


[data-theme="dark"] {
    --color-accent: yellow;
    --color-button-accent: yellow;
}
```

accent-color and button-accent color are the same color, but accent-color is 20% lighter in dark mode to ensure proper contrast. When using custom color, keep this
distinction in mind.

Instead of changing the colors, individual components can also be overridden using the `className` prop.

### Dark mode

To enable dark mode, use a Theme Provider or JavaScript to add the `data-theme="dark"` attribute to the `html` element in your application.

## Notable Components

### Masonry

Responsive masonry layout for images. Supports up to 6 columns and images can be ordered both horizontally and vertically.

### GalleryStack

GalleryStack enables you to stack images as a deck of cards with a suitable animation. It is ideal for showcasing multiple images in a compact space.

### DiamondGrid

The DiamondGrid component arranges images in a diamond grid layout, offering a visually striking alternative to traditional grid arrangements.

### ImageShowcase

ImageShowcase is designed to highlight a single image in a row of images when hovering.

## Demo

For a live demonstration of m7kit components, you can visit the [Storybook Demo](https://m7kit.bremm.dev).

## Repository

The source code for m7kit is available on [Github](https://github.com/bremmdev/m7kit). Feel free to contribute, report issues, or provide feedback.

## License

m7kit is licensed under the MIT License. Feel free to use, modify, and distribute it as needed.
