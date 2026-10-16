import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";
import { Tabs } from "./Tabs";

/**
 * The `Tabs` component allows for intuitive navigation between different content sections. Each tab is automatically activated and its associated content panel is displayed when the tab receives focus. It uses user-provided labels to associate tabs with their content panels.
 *
 * ## Features
 * - Automatically activates tabs and displays its associated panel when the tab receives focus
 * - Conforms to the WAI-ARIA Tab Panel Design Pattern
 * - Supports keyboard navigation
 * - allows a default selected tab. Without one, or when it matches no enabled tab, the first enabled tab is selected, so the tabs can always be reached with the keyboard
 * - allows controlled and uncontrolled usage. With `value`, the selected tab only changes when `value` does, so update it in `onValueChange`
 * - In right-to-left text the arrow keys follow the order on screen: Left Arrow moves to the next tab
 * - The arrow keys, Home and End are ignored with Alt, Ctrl, Meta or Shift, so browser and screen reader shortcuts keep working
 * - Labels can contain spaces, and several `Tabs` on a page can use the same labels: the ids of tabs and panels are generated
 * - Props such as `aria-label` (needed for a tab with only an icon), `disabled`, `onClick` and `ref` are passed to the tab's `<button>`
 * - Disabled tabs are skipped by the arrow keys, Home and End
 * - In forced colors mode (Windows high contrast), the underline of the selected tab uses `Highlight`, unselected tabs get a `Highlight` underline on hover, and disabled tabs are `GrayText`
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
  tags: ["autodocs"]
};
export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  args: {},
  render: () => (
    <div className="p-4">
      <h2 id="tabs-title" className="text-lg font-medium my-4 text-foreground">
        Frontend frameworks
      </h2>
      <Tabs.Root defaultValue="astro" onValueChange={(val: string) => action("Tab changed")(val)}>
        <Tabs.List aria-labelledby="tabs-title">
          <Tabs.Tab label="react">React</Tabs.Tab>
          <Tabs.Tab label="astro">Astro</Tabs.Tab>
          <Tabs.Tab label="svelte">Svelte</Tabs.Tab>
        </Tabs.List>
        <Tabs.Content label="react">
          <h3 className="font-medium mb-2">React</h3>
          <p>
            React is a popular JavaScript library for building user interfaces, particularly for single-page
            applications. It's used for handling the view layer for web and mobile apps. React allows you to design
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
            Astro is a front-end framework that allows you to build faster websites with less client-side JavaScript. It
            allows you to write components using your favorite JavaScript framework, or just HTML and CSS, and then
            renders your site as static HTML at build time.
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
            Svelte is a radical new approach to building user interfaces. Whereas traditional frameworks like React and
            Vue do the bulk of their work in the browser, Svelte shifts that work into a compile step that happens when
            you build your app.
            <a className="block w-fit underline text-blue-600 focus-visible:outline-blue-600" href="https://svelte.dev">
              Svelte
            </a>
          </p>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
};

/**
 * A disabled tab can't be selected, and the arrow keys, Home and End skip it.
 */
export const DisabledTab: Story = {
  args: {},
  render: () => (
    <div className="p-4">
      <h2 id="tabs-disabled-title" className="text-lg font-medium my-4 text-foreground">
        Account
      </h2>
      <Tabs.Root defaultValue="profile" onValueChange={(val: string) => action("Tab changed")(val)}>
        <Tabs.List aria-labelledby="tabs-disabled-title">
          <Tabs.Tab label="profile">Profile</Tabs.Tab>
          <Tabs.Tab label="billing" disabled>
            Billing
          </Tabs.Tab>
          <Tabs.Tab label="notifications">Notifications</Tabs.Tab>
        </Tabs.List>
        <Tabs.Content label="profile">Your name, photo and contact details.</Tabs.Content>
        <Tabs.Content label="billing">Your plan and invoices.</Tabs.Content>
        <Tabs.Content label="notifications">Which emails and alerts you get.</Tabs.Content>
      </Tabs.Root>
    </div>
  )
};

const ControlledTabs = () => {
  const [value, setValue] = React.useState("monthly");

  return (
    <div className="p-4">
      <h2 id="tabs-controlled-title" className="text-lg font-medium my-4 text-foreground">
        Billing period
      </h2>
      <Tabs.Root
        value={value}
        onValueChange={(val: string) => {
          action("Tab changed")(val);
          setValue(val);
        }}
      >
        <Tabs.List aria-labelledby="tabs-controlled-title">
          <Tabs.Tab label="monthly">Monthly</Tabs.Tab>
          <Tabs.Tab label="yearly">Yearly</Tabs.Tab>
        </Tabs.List>
        <Tabs.Content label="monthly">Billed every month.</Tabs.Content>
        <Tabs.Content label="yearly">Billed once a year, two months free.</Tabs.Content>
      </Tabs.Root>
      <p className="mt-4 text-foreground">Selected: {value}</p>
    </div>
  );
};

/**
 * With `value`, the parent owns the selected tab and updates it in `onValueChange`.
 */
export const Controlled: Story = {
  args: {},
  render: () => <ControlledTabs />
};

/**
 * In right-to-left text the first tab is on the right, and Left Arrow moves to the next tab.
 */
export const RightToLeft: Story = {
  args: {},
  render: () => (
    <div className="p-4" dir="rtl" lang="ar">
      <h2 id="tabs-rtl-title" className="text-lg font-medium my-4 text-foreground">
        الحساب
      </h2>
      <Tabs.Root defaultValue="profile">
        <Tabs.List aria-labelledby="tabs-rtl-title">
          <Tabs.Tab label="profile">الملف الشخصي</Tabs.Tab>
          <Tabs.Tab label="billing">الفواتير</Tabs.Tab>
          <Tabs.Tab label="notifications">الإشعارات</Tabs.Tab>
        </Tabs.List>
        <Tabs.Content label="profile">اسمك وصورتك وبيانات الاتصال.</Tabs.Content>
        <Tabs.Content label="billing">خطتك وفواتيرك.</Tabs.Content>
        <Tabs.Content label="notifications">الرسائل والتنبيهات التي تصلك.</Tabs.Content>
      </Tabs.Root>
    </div>
  )
};
