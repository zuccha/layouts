import react from "@vitejs/plugin-react";
// import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules/@chakra-ui")) return "chakra-ui";
          if (id.includes("node_modules/@zip.js/zip.js")) return "zip-js";
          if (id.includes("node_modules/zod")) return "zod";
          if (id.endsWith("src/dnd/dnd-spells/dnd-spells.ts")) return "spells";
          return null;
        },
      },
      plugins: [
        // visualizer({
        //   brotliSize: true,
        //   gzipSize: true,
        //   open: true,
        // }),
      ],
    },
  },
  plugins: [react(), svgr()],
});
