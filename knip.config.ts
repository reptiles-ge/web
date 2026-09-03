import type { KnipConfig } from "knip";

const config: KnipConfig = {
  project: ["src/**/*.{ts,tsx,css}", "scripts/**/*.ts"],
  ignoreDependencies: ["sharp"],
  ignoreExportsUsedInFile: true,
};

export default config;
