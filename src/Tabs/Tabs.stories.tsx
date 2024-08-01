import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";

/**
 * The `Tabs` component allows for intuitive navigation between different content sections. Each tab is automatically activated and its associated content panel is displayed when the tab receives focus. It uses user-provided labels to associate tabs with their content panels.
 *
 * ## Features
 * - Automatically activates tabs and displays its associated panel when the tab receives focus
 * - Conforms to the WAI-ARIA Tab Panel Design Pattern
 * - Supports keyboard navigation
 * - allows a default selected tab
 * - allows controlled and uncontrolled usage
 *
 * ## Usage
 *
 * ```tsx
 * <Tabs.Root defaultValue="second">
 *  <Tabs.List>
 *   <Tabs.Tab label="first">First</Tabs.Tab>
 *   <Tabs.Tab label="second">Second</Tabs.Tab>
 *   <Tabs.Tab label="third">Third</Tabs.Tab>
 *  </Tabs.List>
 *  <Tabs.Content label="first">
 *   Content 1
 *  </Tabs.Content>
 *  <Tabs.Content label="second">
 *   Content 2
 *  </Tabs.Content>
 *  <Tabs.Content label="third">
 *   Content 3
 *  </Tabs.Content>
 * </Tabs.Root>
 *  ```
 */

const meta: Meta<typeof Tabs> = {
  component: Tabs,
  title: "Components/Tabs",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  args: {},
  render: () => (
    <div className="p-4">
      <h2 id="tabs-title" className="text-lg font-medium my-4 text-clr-text">
        Frontend frameworks
      </h2>
      <Tabs.Root
        defaultValue="astro"
        onValueChange={(val: string) => console.log(val)}
      >
        <Tabs.List aria-labelledby="tabs-title">
          <Tabs.Tab label="react">React</Tabs.Tab>
          <Tabs.Tab label="astro">Astro</Tabs.Tab>
          <Tabs.Tab label="svelte">Svelte</Tabs.Tab>
        </Tabs.List>
        <Tabs.Content label="react">
          <h3 className="font-medium mb-2">React</h3>
          <p>
            React is a popular JavaScript library for building user interfaces,
            particularly for single-page applications. It's used for handling
            the view layer for web and mobile apps. React allows you to design
            simple views for each state in your application.
            <a
              className="block w-fit underline text-blue-600 focus-visible:outline-blue-600"
              href="https://reactjs.org"
            >
              React
            </a>
          </p>
        </Tabs.Content>
        <Tabs.Content label="astro">
          <h3 className="font-medium mb-2">Astro</h3>
          <p>
            Astro is a front-end framework that allows you to build faster
            websites with less client-side JavaScript. It allows you to write
            components using your favorite JavaScript framework, or just HTML
            and CSS, and then renders your site as static HTML at build time.
            <a
              className="block w-fit underline text-blue-600 focus-visible:outline-blue-600"
              href="https://astro.build"
            >
              Astro
            </a>
          </p>
        </Tabs.Content>
        <Tabs.Content label="svelte">
          <h3 className="font-medium mb-2">Svelte</h3>
          <p>
            Svelte is a radical new approach to building user interfaces.
            Whereas traditional frameworks like React and Vue do the bulk of
            their work in the browser, Svelte shifts that work into a compile
            step that happens when you build your app.
            <a
              className="block w-fit underline text-blue-600 focus-visible:outline-blue-600"
              href="https://svelte.dev"
            >
              Svelte
            </a>
          </p>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  ),
};
