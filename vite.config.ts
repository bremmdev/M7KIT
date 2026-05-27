import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import { copyFileSync } from "fs";

//  __dirname isn't available in ES module environments, so we need to use fileURLToPath to get the directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    //Specifies that the output of the build will be a library.
    lib: {
      //Defines the entry point for the library build
      entry: path.resolve(__dirname, "index.ts"),
      //Output only ES module format
      formats: ["es"],
      fileName: () => "index.es.js"
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "clsx", "tailwind-merge", "lucide-react"]
    },
    sourcemap: false,
    //Clears the output directory before building.
    emptyOutDir: true
  },
  //react() enables React support.
  //dts() generates TypeScript declaration files (*.d.ts)
  //during the build.
  plugins: [
    react(),
    dts({ copyDtsFiles: true }),
    tailwindcss(),
    {
      name: "copy-css-files",
      closeBundle() {
        // Skip on Vercel - css files are only needed for npm publish
        if (process.env.VERCEL) return;

        // Copy css files to dist for consumers to import
        const srcPathTheme = path.resolve(__dirname, "src/theme.css");
        const srcPathIndex = path.resolve(__dirname, "src/index.css");
        const destPath = path.resolve(__dirname, "dist");

        copyFileSync(srcPathTheme, path.resolve(destPath, "theme.css"));
        copyFileSync(srcPathIndex, path.resolve(destPath, "m7kit.css"));
      }
    }
  ]
});
