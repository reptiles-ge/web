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
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
