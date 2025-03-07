import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mdx from "@mdx-js/rollup";
import slidesPlugin from "./src/vite-plugin-slides";

// https://vite.dev/config/
export default defineConfig(async () => ({
  base: "./",
  resolve: {
    alias: {
      "@components": "/src/slide-components",
    },
  },
  plugins: [
    mdx({
      jsx: true,
      jsxImportSource: "react",
      providerImportSource: "@mdx-js/react",
    }),
    react(),
    await slidesPlugin({
      slidesDir: "slides",
      collection: process.env.SLIDE_PATH || undefined,
    }),
  ],
  optimizeDeps: {
    // Add virtual module to optimization
    include: ["virtual:slides.jsx"],
  },
}));
