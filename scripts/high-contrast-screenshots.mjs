/**
 * Screenshots of the "Overview/All Components" story in forced colors mode (Windows high contrast),
 * shown by its "High Contrast" story. A page can't turn on forced colors itself, so Playwright emulates it.
 *
 *   npm run screenshots:high-contrast              builds Storybook, then takes the screenshots
 *   npm run screenshots:high-contrast -- --url http://localhost:6006
 *                                                  uses a running Storybook instead (faster)
 *
 * Needs Playwright's Chromium: `npx playwright install chromium`. To use another Chromium build,
 * set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH.
 */
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  createReadStream,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync
} from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(root, "src/_stories/high-contrast");
const tempDir = `${outputDir}.tmp`;
const storybookDir = path.join(root, "node_modules/.cache/high-contrast-storybook");
const storyId = "overview-all-components--default";

// Chromium's emulated dark and light palettes. Forced colors replace the theme's colors, so the library's light and dark
// theme give the same screenshots: only the light theme is used
const variants = [
  { file: "dark-palette.png", title: "Dark palette", colorScheme: "dark", theme: "light" },
  { file: "light-palette.png", title: "Light palette", colorScheme: "light", theme: "light" }
];

// The Drawer is modal, so it's opened separately
const drawerVariants = [
  { file: "drawer-dark-palette.png", title: "Drawer, dark palette", colorScheme: "dark", theme: "light" },
  { file: "drawer-light-palette.png", title: "Drawer, light palette", colorScheme: "light", theme: "light" }
];

// Taller than the story, so overlays have room below them
const fullPageViewportHeight = 5000;

const urlArgIndex = process.argv.indexOf("--url");
const externalUrl = urlArgIndex === -1 ? undefined : process.argv[urlArgIndex + 1];

const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2"
};

function buildStorybook() {
  console.log("Building Storybook…");
  const result = spawnSync("npx", ["storybook", "build", "--test", "--quiet", "--output-dir", storybookDir], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32"
  });

  if (result.status !== 0) {
    throw new Error("Storybook build failed");
  }
}

/** Serves the static Storybook build on a free port */
function serveStorybook() {
  const server = createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const filePath = path.join(storybookDir, pathname === "/" ? "index.html" : pathname);

    if (!filePath.startsWith(storybookDir) || !existsSync(filePath) || !statSync(filePath).isFile()) {
      response.writeHead(404).end();
      return;
    }

    response.writeHead(200, { "Content-Type": mimeTypes[path.extname(filePath)] ?? "application/octet-stream" });
    createReadStream(filePath).pipe(response);
  });

  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

async function openStory(browser, baseUrl, { colorScheme, theme }, viewportHeight = 900) {
  const page = await browser.newPage({ viewport: { width: 1200, height: viewportHeight } });
  page.on("pageerror", (error) => console.warn(`Page error: ${error.message}`));

  await page.emulateMedia({ forcedColors: "active", colorScheme, reducedMotion: "reduce" });
  await page.goto(`${baseUrl}/iframe.html?id=${storyId}&viewMode=story&globals=theme:${theme}`, {
    waitUntil: "networkidle"
  });
  await page.locator("#storybook-root").getByRole("heading", { name: "Button" }).waitFor();
  // Images, fonts and the JavaScript animations (AnimatedCount, TextReveal) need to settle
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1000);

  return page;
}

async function takeScreenshots(baseUrl) {
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined
  });

  // Written next to the output folder first, so a failed run keeps the previous screenshots
  rmSync(tempDir, { recursive: true, force: true });
  mkdirSync(tempDir, { recursive: true });

  try {
    for (const variant of variants) {
      // Popover and Tooltip open upward when there's no room below them in the viewport, and would cover other components,
      // so the viewport is taller than the page, and the screenshot is cropped to the story
      const page = await openStory(browser, baseUrl, variant, fullPageViewportHeight);
      const height = await page.evaluate(() =>
        Math.ceil(document.querySelector("#storybook-root").getBoundingClientRect().bottom)
      );
      await page.screenshot({
        path: path.join(tempDir, variant.file),
        clip: { x: 0, y: 0, width: 1200, height: Math.min(height, fullPageViewportHeight) },
        animations: "disabled"
      });
      await page.close();
      console.log(`Saved ${variant.file}`);
    }

    for (const variant of drawerVariants) {
      const page = await openStory(browser, baseUrl, variant);
      await page.locator("[data-gallery-drawer-trigger]").click();
      await page.locator("dialog[open]").waitFor();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(tempDir, variant.file), animations: "disabled" });
      await page.close();
      console.log(`Saved ${variant.file}`);
    }

    const screenshots = [...variants, ...drawerVariants].map(({ file, title }) => ({ file, title }));
    writeFileSync(
      path.join(tempDir, "manifest.json"),
      `${JSON.stringify({ generatedAt: new Date().toISOString(), screenshots }, null, 2)}\n`
    );

    // Copied into the existing folder instead of replacing it: a running Storybook's file watcher loses track of a
    // replaced folder (on Windows), and would keep showing the previous screenshots. The manifest goes last, so the
    // story only picks up the new screenshots once all of them are in place
    mkdirSync(outputDir, { recursive: true });
    const newFiles = [...screenshots.map(({ file }) => file), "manifest.json"];
    for (const file of readdirSync(outputDir)) {
      if (!newFiles.includes(file)) rmSync(path.join(outputDir, file), { recursive: true, force: true });
    }
    for (const file of newFiles) {
      copyFileSync(path.join(tempDir, file), path.join(outputDir, file));
    }
  } finally {
    await browser.close();
    rmSync(tempDir, { recursive: true, force: true });
  }
}

if (externalUrl) {
  await takeScreenshots(externalUrl.replace(/\/$/, ""));
} else {
  buildStorybook();
  const server = await serveStorybook();

  try {
    await takeScreenshots(`http://127.0.0.1:${server.address().port}`);
  } finally {
    server.close();
  }
}

console.log(`\nScreenshots saved to ${path.relative(root, outputDir)}/ (${readdirSync(outputDir).length} files)`);
