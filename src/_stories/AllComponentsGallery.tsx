import React from "react";
import { Info } from "lucide-react";
import {
  AnimatedCount,
  Breadcrumb,
  BreadcrumbCurrentItem,
  BreadcrumbItem,
  BreadcrumbMenu,
  Button,
  Card,
  CardContent,
  CardTitle,
  Drawer,
  DrawerContent,
  DrawerRoot,
  DrawerTrigger,
  FolderStructure,
  GalleryStack,
  LineClamp,
  LineClampRoot,
  LineClampTrigger,
  Marquee,
  OTPInput,
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
  Progress,
  Rating,
  SegmentedControl,
  SortableList,
  Switch,
  Tabs,
  TextAnimation,
  TextReveal,
  ThemeToggle,
  Tierlist,
  Timeline,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "../../index";
import image001 from "../_data/images/picture001.jpg";
import image002 from "../_data/images/picture002.jpg";
import NextIcon from "../_data/icons/next.svg";
import ReactIcon from "../_data/icons/react.svg";
import StorybookIcon from "../_data/icons/storybook.svg";
import TailwindIcon from "../_data/icons/tailwind.svg";
import TypeScriptIcon from "../_data/icons/typescript.svg";

const images = [image001, image002];

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section aria-labelledby={`gallery-${title}`} className="flex flex-col gap-3">
    <h2 id={`gallery-${title}`} className="text-sm font-bold uppercase tracking-wide">
      {title}
    </h2>
    <div className="flex flex-wrap items-start gap-6">{children}</div>
  </section>
);

const Example = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-2">
    <span className="text-xs">{label}</span>
    {children}
  </div>
);

/**
 * Every component on one page, in the states that look different: selected, checked, disabled, loading, read-only, open.
 * Overlays are rendered open, except the Drawer, which is modal: the high contrast screenshot script opens it separately.
 * Keep it deterministic: the screenshots of this page are compared over time.
 *
 * DiamondGrid, ImageShowcase, Masonry and ShimmerImage are left out on purpose: they only lay out images or add effects
 * (filters, a gradient) that forced colors don't change, and their photos would make the screenshots several times larger.
 * Add a component like that once it gets its own colors, borders or controls. GalleryStack stays for its buttons.
 */
export const AllComponentsGallery = () => (
  <div className="flex max-w-5xl flex-col gap-10 text-foreground">
    <Section title="Button">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="cta">Call to action</Button>
      <Button disabled>Disabled</Button>
      <Button isLoading>Loading</Button>
      <Button as="a" href="#gallery-Button">
        Link
      </Button>
    </Section>

    <Section title="Switch and ThemeToggle">
      <Example label="Off">
        <Switch aria-label="Off" />
      </Example>
      <Example label="On">
        <Switch aria-label="On" defaultChecked thumbIndicators="check" />
      </Example>
      <Example label="Disabled">
        <Switch aria-label="Disabled" disabled defaultChecked />
      </Example>
      <Example label="Read-only">
        <Switch aria-label="Read-only" readOnly defaultChecked />
      </Example>
      <Example label="ThemeToggle off">
        <ThemeToggle />
      </Example>
      <Example label="ThemeToggle on">
        <ThemeToggle defaultChecked blackAndWhite />
      </Example>
      <Example label="ThemeToggle disabled">
        <ThemeToggle disabled />
      </Example>
    </Section>

    <Section title="SegmentedControl and Tabs">
      <SegmentedControl aria-label="View">
        <SegmentedControl.Button defaultSelected>Day</SegmentedControl.Button>
        <SegmentedControl.Button>Week</SegmentedControl.Button>
        <SegmentedControl.Button>Month</SegmentedControl.Button>
      </SegmentedControl>
      <Tabs defaultValue="first">
        <Tabs.List aria-label="Example tabs">
          <Tabs.Tab label="first">First</Tabs.Tab>
          <Tabs.Tab label="second">Second</Tabs.Tab>
        </Tabs.List>
        <Tabs.Content label="first">Content of the first tab</Tabs.Content>
        <Tabs.Content label="second">Content of the second tab</Tabs.Content>
      </Tabs>
    </Section>

    <Section title="Progress and Rating">
      <div className="w-64">
        <Progress label="Fill" value={40} />
      </div>
      <div className="w-64">
        <Progress label="Outline" value={60} variant="outline" />
      </div>
      <div className="w-64">
        <Progress label="Indeterminate" />
      </div>
      <Rating value={3.5} />
      <Rating value={3} variant="heart" />
      <Rating value={2.5} variant="circle-black" />
      <Rating value={2.5} variant="circle-gray" />
    </Section>

    <Section title="OTPInput">
      <OTPInput value="123" maxLength={6} />
    </Section>

    <Section title="Popover">
      <div className="h-40">
        <Popover open onOpenChange={() => {}}>
          <PopoverTrigger aria-label="Popover information">
            <Info size={24} />
          </PopoverTrigger>
          <PopoverContent placement="bottom left">
            <PopoverTitle>Popover</PopoverTitle>
            <p>Content of an open popover.</p>
          </PopoverContent>
        </Popover>
      </div>
    </Section>

    <Section title="Tooltip">
      <div className="h-32">
        <Tooltip open onOpenChange={() => {}}>
          <TooltipTrigger aria-label="Tooltip information">
            <Info size={24} />
          </TooltipTrigger>
          <TooltipContent placement="bottom left">Content of an open tooltip.</TooltipContent>
        </Tooltip>
      </div>
    </Section>

    <Section title="Drawer">
      <DrawerRoot>
        <DrawerTrigger className="focus-ring rounded-md border border-neutral px-4 py-2" data-gallery-drawer-trigger>
          Open drawer
        </DrawerTrigger>
        <Drawer>
          <DrawerContent>
            <h2 className="mb-2 text-xl font-bold">Drawer</h2>
            <p>Content of an open drawer.</p>
          </DrawerContent>
        </Drawer>
      </DrawerRoot>
    </Section>

    <Section title="Breadcrumb">
      <Breadcrumb>
        <BreadcrumbItem href="#gallery-Breadcrumb">Home</BreadcrumbItem>
        <BreadcrumbMenu>
          <BreadcrumbItem href="#gallery-Breadcrumb">Library</BreadcrumbItem>
        </BreadcrumbMenu>
        <BreadcrumbItem href="#gallery-Breadcrumb">Components</BreadcrumbItem>
        <BreadcrumbCurrentItem>Breadcrumb</BreadcrumbCurrentItem>
      </Breadcrumb>
    </Section>

    <Section title="Card, Timeline and FolderStructure">
      <Card>
        <CardTitle>Card</CardTitle>
        <CardContent>Without an image</CardContent>
      </Card>
      <Card image={image001} imageAlt="" imageHeight={100} className="w-56">
        <CardTitle>Card</CardTitle>
        <CardContent>With an image</CardContent>
      </Card>
      <Timeline className="p-2 pl-12">
        <Timeline.Item>
          <h3 className="font-bold">First</h3>
          <p>Content</p>
        </Timeline.Item>
        <Timeline.Item>
          <h3 className="font-bold">Second</h3>
          <p>Content</p>
        </Timeline.Item>
      </Timeline>
      <FolderStructure
        className="my-0"
        data={[
          { name: "src", children: [{ name: "index.ts" }, { name: "components", children: [{ name: "Button.tsx" }] }] }
        ]}
      />
    </Section>

    <Section title="SortableList and Tierlist">
      <SortableList title="Sortable list" items={["First", "Second", "Third"]} />
      <Tierlist aria-label="Tierlist" className="w-[32rem]">
        {[ReactIcon, NextIcon, StorybookIcon, TailwindIcon, TypeScriptIcon].map((icon, idx) => (
          <img src={icon} alt="" className="h-12 w-12" key={idx} />
        ))}
      </Tierlist>
    </Section>

    <Section title="LineClamp">
      <LineClampRoot className="max-w-md">
        <LineClamp lines={2}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat.
        </LineClamp>
        <LineClampTrigger />
      </LineClampRoot>
    </Section>

    <Section title="Text">
      <TextAnimation as="p">Text animation</TextAnimation>
      <TextReveal>
        <span>Text reveal</span>
        <span>Second line</span>
      </TextReveal>
      <AnimatedCount count={42} duration={500} />
    </Section>

    <Section title="GalleryStack and Marquee">
      {/* GalleryStack sizes itself, with room for the rotated images and the buttons: a narrower parent shrinks the images */}
      <GalleryStack>
        {images.map((src, idx) => (
          <img src={src} alt="" width={200} height={200} className="size-50 object-cover" key={idx} />
        ))}
      </GalleryStack>
      <Marquee className="w-96" pauseOnHover={false}>
        {["First", "Second", "Third", "Fourth"].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </Marquee>
    </Section>
  </div>
);
