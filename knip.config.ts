import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignoreDependencies: ["sharp", "prettier-plugin-tailwindcss"],
  ignoreExportsUsedInFile: true,
  project: ["src/**/*.{ts,tsx,css}", "!src/i18n/global.ts", "scripts/**/*.ts"],
};

export default config;
