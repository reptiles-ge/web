import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignore: ["src/lib/creditAuthors.ts"],
  ignoreBinaries: ["codex"],
  ignoreDependencies: [
    "@cloudflare/workers-response-store",
    "eslint-plugin-import",
    "eslint-plugin-jsx-a11y",
    "eslint-plugin-react-hooks",
    "sharp",
  ],
  ignoreExportsUsedInFile: true,
  project: ["src/**/*.{ts,tsx,css}", "!src/i18n/global.ts", "scripts/**/*.ts"],
};

export default config;
