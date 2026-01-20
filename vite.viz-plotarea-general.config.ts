import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/viz-plotarea-general.ts",
      name: "viz-plotarea-general.js",
      formats: ["iife"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
      },
    },
    outDir: "dist",
    emptyOutDir: false,
  },
});
