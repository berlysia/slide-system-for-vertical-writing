import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mdx from "@mdx-js/rollup";
import * as path from "node:path";
import slidesPlugin from "./src/vite-plugin-slides";

export default defineConfig(async () => {
  return {
    base: "./",
    resolve: {
      alias: {
        "@components": path.resolve(
          import.meta.dirname,
          "src/slide-components",
        ),
      },
    },
    plugins: [
      await slidesPlugin({
        slidesDir:
          process.env.SLIDES_DIR || path.resolve(import.meta.dirname, "slides"),
        collection:
          process.env.SLIDE_NAME || (process.env.isAI ? "vrt-test" : undefined),
      }),
      mdx({
        jsx: true,
        jsxImportSource: "react",
        providerImportSource: "@mdx-js/react",
      }),
      react(),
    ],
    optimizeDeps: {
      // Add virtual module to optimization
      // include: ["virtual:slides.js", "virtual:slides-page-*.js"],
    },
  };
});
