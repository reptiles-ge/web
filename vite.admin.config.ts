import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));

const PUBLIC_ENV_KEYS = [
  "NEXT_PUBLIC_API_ORIGIN",
  "NEXT_PUBLIC_SITE_URL",
  "VERCEL_ENV",
] as const;

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, root, ""), ...process.env };
  return {
    build: {
      emptyOutDir: true,
      outDir: path.join(root, "dist-admin"),
    },
    define: Object.fromEntries(
      PUBLIC_ENV_KEYS.map((key) => [
        `process.env.${key}`,
        JSON.stringify(env[key] ?? ""),
      ]),
    ),
    plugins: [react()],
    resolve: {
      alias: { "@": path.join(root, "src") },
    },
    root: path.join(root, "src/admin"),
    server: { port: 3002, strictPort: true },
  };
});
