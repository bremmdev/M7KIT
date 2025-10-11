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

Colors are defined using CSS variables, allowing you to customize the appearance of m7kit components. You can override these variables in your own CSS files to match your application's theme. The following CSS variables are available:

```
@layer base {
  :root {
    --accent: 37 99 235; /* blue-600 */
    --clr-bg: 248 250 252; /* slate-50 */
    --clr-border: 148 163 184; /* slate-400 */
    --clr-text: 51 65 85; /* slate-700 */
  }

  :root[data-theme="dark"] {
    --accent: 253 230 138; /* amber-200 */
    --clr-bg: 15 23 42 /* slate-900 */;
    --clr-border: 100 116 139; /* slate-500 */
    --clr-text: 226 232 240; /* slate-200 */
  }
}

```

These follow the [Tailwind guidelines of defining colors](https://tailwindcss.com/docs/customizing-colors#using-css-variables) using only the color channels in order to
be able to use the opacity modifier syntax.

### Overriding CSS Variables

To override these variables, you can define them in your own CSS file by copying the variables above into your own CSS file and changing the values to match your desired theme.

### Dark mode

To enable dark mode, use a Theme Provider or JavaScript to add the `data-theme="dark"` attribute to the `html` element in your application.

## Demo

For a live demonstration of m7kit components, you can visit the [Storybook Demo](https://m7kit.bremm.dev).

## Repository

The source code for m7kit is available on [Github](https://github.com/bremmdev/m7kit). Feel free to contribute, report issues, or provide feedback.

## License

m7kit is licensed under the MIT License. Feel free to use, modify, and distribute it as needed.
