import { defineConfig, devices } from "@playwright/test";

const port = 3000;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: true,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  reporter: process.env.CI ? "github" : "list",
  retries: process.env.CI ? 2 : 0,
  testDir: "e2e",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: process.env.CI ? "pnpm start" : "pnpm build && pnpm start",
    reuseExistingServer:
      !process.env.CI || process.env.PW_REUSE_SERVER === "1",
    timeout: 180_000,
    url: baseURL,
  },
  workers: process.env.CI ? 2 : undefined,
});
