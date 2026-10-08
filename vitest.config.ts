import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  cacheDir: path.resolve(__dirname, "node_modules/.vite"),
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
    coverage: {
      exclude: [
        "src/**/*.test.ts",
        "src/**/*.d.ts",
        "src/**/*.generated.ts",
        "src/content/**",
        "src/components/**",
        "src/app/**/page.tsx",
        "src/app/**/layout.tsx",
        "src/app/**/not-found.tsx",
        "src/app/**/error.tsx",
        "src/app/**/loading.tsx",
        "src/app/**/opengraph-image.tsx",
        "src/app/admin/**",
        "src/app/api/admin/**",
        "src/app/api/dev/**",
        "src/lib/admin*.ts",
        "src/lib/contentEditor*.ts",
        "src/lib/speciesPageAnalysis.ts",
        "src/lib/speciesTextProcessing.ts",
        "src/lib/quizDraft.ts",
        "src/lib/axeDev.ts",
        "src/lib/codexProcess.ts",
        "src/lib/create*Route.tsx",
        "src/lib/focusTrap.ts",
        "src/lib/use*.ts",
        "src/instrumentation*.ts",
        "src/worker.ts",
        "src/app/RootDocument.tsx",
        "src/i18n/request.ts",
      ],
      include: ["src/**/*.{ts,tsx}"],
      provider: "v8",
      reporter: ["text-summary", "json-summary"],
      reportsDirectory: "coverage",
      thresholds: { branches: 82, functions: 91, lines: 93, statements: 90 },
    },
    environment: "node",
    fileParallelism: false,
    include: ["src/**/*.test.ts"],
    pool: "forks",
    server: { deps: { inline: ["next-intl"] } },
  },
});
