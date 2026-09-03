import type { KnipConfig } from "knip";

const config: KnipConfig = {
  project: ["src/**/*.{ts,tsx,css}", "!src/i18n/global.ts", "scripts/**/*.ts"],
  ignoreDependencies: ["sharp"],
  ignoreExportsUsedInFile: true,
};

export default config;
