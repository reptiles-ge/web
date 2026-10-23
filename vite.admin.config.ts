import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: path.join(root, "dist-admin"),
  },
  plugins: [react()],
  resolve: {
    alias: { "@": path.join(root, "src") },
  },
  root: path.join(root, "src/admin"),
  server: { port: 3002, strictPort: true },
});
