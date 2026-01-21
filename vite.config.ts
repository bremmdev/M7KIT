import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import { copyFileSync, existsSync } from "fs";

//  __dirname isn't available in ES module environments, so we need to use fileURLToPath to get the directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    //Specifies that the output of the build will be a library.
    lib: {
      //Defines the entry point for the library build
      entry: path.resolve(__dirname, "index.ts"),
      name: "m7kit",
      //A function that generates the output file
      //name for different formats during the build
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          tailwindcss: "tailwindcss",
        },
      },
    },
    sourcemap: false,
    //Clears the output directory before building.
    emptyOutDir: true,
  },
  //react() enables React support.
  //dts() generates TypeScript declaration files (*.d.ts)
  //during the build.
  plugins: [
    react(),
    dts({ copyDtsFiles: true }),
    tailwindcss(),
    {
      name: "copy-theme-css",
      closeBundle() {
        // Copy theme.css to dist for consumers to import but only if the file exists (it does not exist on the Vercel Storybook deployment)
        const srcPath = path.resolve(__dirname, "src/theme.css");
        const destPath = path.resolve(__dirname, "dist/theme.css");
        if (existsSync(srcPath)) {
          copyFileSync(srcPath, destPath);
        }
      },
    },
  ],
});
