import type { KnipConfig } from "knip";

const config: KnipConfig = {
  project: ["src/**/*.{ts,tsx,css}", "!src/i18n/global.ts", "scripts/**/*.ts"],
  ignoreDependencies: ["sharp", "prettier-plugin-tailwindcss"],
  ignoreExportsUsedInFile: true,
};

export default config;
