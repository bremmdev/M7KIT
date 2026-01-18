# m7kit - React Component Library

## Description

m7kit is a React component library designed to facilitate the integration of less common UI components into your React applications. It is built with React and TailwindCSS, providing a seamless development experience. This library focuses on offering unique image components, such as Masonry, GalleryStack, DiamondGrid, and ImageShowcase.

## Installation

```
npm install m7kit
```

## Usage

After installing m7kit, you can import components into your React application:

```
import { Masonry, GalleryStack, DiamondGrid, ImageShowcase } from "m7kit";
```

Additionally, you need to import the CSS file to ensure proper styling:

```
import "m7kit/css";
```

**It is recommended to import this CSS file before your own CSS files if you want to override the default styles and CSS variables.**

## Notable Components

### Masonry

Responsive masonry layout for images. Supports up to 6 columns and images can be ordered both horizontally and vertically.

### GalleryStack

GalleryStack enables you to stack images as a deck of cards with a suitable animation. It is ideal for showcasing multiple images in a compact space.

### DiamondGrid

The DiamondGrid component arranges images in a diamond grid layout, offering a visually striking alternative to traditional grid arrangements.

### ImageShowcase

ImageShowcase is designed to highlight a single image in a row of images when hovering.

## Theming

Colors are defined using theme variables in Tailwind v4. These variables are automatically available as CSS variables and utility classes. You can override these variables in your own global CSS file to match your application's theme. Start by adding the following code to your global CSS file and import this file **after** you import "m7kit/css" and change the colors you want to change.

```
@import "tailwindcss";

:root {
  --color-accent: oklch(59.2% 0.249 0.584); /* pink-600 */
  --color-surface: oklch(1 0 0); /* white */
  --color-surface-subtle: oklch(98.4% 0.003 247.858); /* slate-50 */
  --color-surface-muted: oklch(96.8% 0.007 247.896); /* slate-100 */
  --color-neutral: oklch(70.4% 0.04 256.788); /* slate-400 */
  --color-foreground: oklch(20.8% 0.042 265.755); /* slate-900 */
  --color-foreground-inverse: oklch(1 0 0); /* white */
  --color-background: oklch(1 0 0); /* white */
}

[data-theme="dark"] {
  --color-accent: oklch(79.2% 0.249 0.584); /* pink-600 */
  --color-surface: oklch(20.8% 0.042 265.755); /* slate-900 */
  --color-surface-subtle: oklch(27.9% 0.041 260.031); /* slate-800 */
  --color-surface-muted: oklch(37.2% 0.044 257.287); /* slate-700 */
  --color-neutral: oklch(55.4% 0.046 257.417); /* slate-500 */
  --color-foreground: oklch(92.9% 0.013 255.508); /* slate-200 */
  --color-foreground-inverse: oklch(12.9% 0.042 264.695); /* slate-950 */
  --color-background: oklch(13% 0.028 261.692); /* gray-950 */
}
```

### Dark mode

To enable dark mode, use a Theme Provider or JavaScript to add the `data-theme="dark"` attribute to the `html` element in your application.

## Demo

For a live demonstration of m7kit components, you can visit the [Storybook Demo](https://m7kit.bremm.dev).

## Repository

The source code for m7kit is available on [Github](https://github.com/bremmdev/m7kit). Feel free to contribute, report issues, or provide feedback.

## License

m7kit is licensed under the MIT License. Feel free to use, modify, and distribute it as needed.
