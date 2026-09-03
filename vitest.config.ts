import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "next-intl/navigation": path.resolve(
        __dirname,
        "tests/stubs/next-intl-navigation.ts",
      ),
      "next/navigation": path.resolve(
        __dirname,
        "tests/stubs/next-navigation.ts",
      ),
    },
  },
  test: {
    cache: {
      dir: path.resolve(__dirname, "node_modules/.vitest"),
    },
    environment: "node",
    fileParallelism: false,
    include: ["src/**/*.test.ts"],
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
});
