import type { Meta, StoryObj } from "@storybook/react-vite";
import { AllComponentsGallery } from "./AllComponentsGallery";

/**
 * Every component on one page, in the states that look different: selected, checked, disabled, loading, read-only and open.
 *
 * ## High contrast
 * The **High Contrast** story shows this page in forced colors mode (Windows high contrast), in the dark and light palette
 * of Chromium's emulation. Forced colors replace the theme's colors, so the library's light and dark theme look the same there.
 * A page can't turn on forced colors itself, so these are screenshots. Regenerate them after changing a component:
 *
 * ```sh
 * npm run screenshots:high-contrast
 * ```
 *
 * The command builds Storybook, opens the **Default** story in Chromium with Playwright, emulates forced colors and
 * saves the screenshots to `src/_stories/high-contrast/`. Commit them with the change.
 *
 * To check the live page instead, open the Default story and turn on DevTools → Rendering →
 * "Emulate CSS media feature forced-colors". See `docs/ACCESSIBILITY.md` for what to look for.
 */
const meta: Meta = {
  title: "Overview/All Components",
  parameters: {
    layout: "fullscreen"
  }
};

export default meta;

type Story = StoryObj;

/** The live page. The high contrast screenshots are taken of this story */
export const Default: Story = {
  render: () => (
    <div className="p-6">
      <AllComponentsGallery />
    </div>
  )
};

type Screenshot = { file: string; title: string };

type Manifest = {
  generatedAt: string;
  screenshots: Array<Screenshot>;
};

// Globs don't fail when the folder is empty, so Storybook still builds before the first screenshots exist
const manifests = import.meta.glob<Manifest>("./high-contrast/manifest.json", { eager: true, import: "default" });
const imageUrls = import.meta.glob<string>("./high-contrast/*.png", { eager: true, import: "default", query: "?url" });

const manifest = Object.values(manifests)[0];

const HighContrastScreenshots = () => {
  if (!manifest) {
    return (
      <p className="text-foreground">
        No screenshots yet. Run <code>npm run screenshots:high-contrast</code> to generate them.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-foreground">
      <p>
        Generated on {new Date(manifest.generatedAt).toLocaleString()} with{" "}
        <code>npm run screenshots:high-contrast</code>. Chromium's emulated palettes differ from the real Windows
        contrast themes.
      </p>
      {manifest.screenshots.map(({ file, title }) => (
        <figure key={file} className="flex flex-col gap-2">
          <figcaption className="font-bold">{title}</figcaption>
          <img
            src={imageUrls[`./high-contrast/${file}`]}
            alt={`All components, ${title}`}
            className="max-w-full self-start border border-neutral"
          />
        </figure>
      ))}
    </div>
  );
};

/** Screenshots of the Default story in forced colors mode (Windows high contrast). Regenerate with `npm run screenshots:high-contrast` */
export const HighContrast: Story = {
  name: "High Contrast",
  render: () => (
    <div className="p-6">
      <HighContrastScreenshots />
    </div>
  )
};
