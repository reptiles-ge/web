import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignoreDependencies: [
    "eslint-plugin-import",
    "eslint-plugin-jsx-a11y",
    "eslint-plugin-react-hooks",
    "sharp",
  ],
  ignoreExportsUsedInFile: true,
  ignoreFiles: [
    "src/**/*.test.ts",
    "src/data/search-index.generated.ts",
    "tests/stubs/**",
  ],
  project: ["src/**/*.{ts,tsx,css}", "!src/i18n/global.ts", "scripts/**/*.ts"],
};

export default config;
