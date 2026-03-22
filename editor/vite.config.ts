import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { assetsApiPlugin } from "./src/server/assets-api";

export default defineConfig({
  root: "editor",
  publicDir: path.resolve(__dirname, "../public"),
  plugins: [react(), assetsApiPlugin({ publicDir: path.resolve(__dirname, "../public") })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "../dist-editor"),
    emptyOutDir: true,
  },
  server: {
    port: 3001,
  },
  optimizeDeps: {
    include: ["remotion", "@remotion/player", "@remotion/transitions"],
  },
});
