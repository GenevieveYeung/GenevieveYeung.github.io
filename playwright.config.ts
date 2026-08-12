import { defineConfig, devices } from "@playwright/test";

const port = 3101;
const externalServer = process.env.PORTFOLIO_QA_SERVER === "1";

export default defineConfig({
  testDir: "./tests",
  timeout: 180_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { outputFolder: "qa-artifacts/report", open: "never" }],
    ["json", { outputFile: "qa-artifacts/playwright-results.json" }],
  ],
  outputDir: "qa-artifacts/test-results",
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    actionTimeout: 8_000,
    navigationTimeout: 30_000,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "off",
    colorScheme: "light",
  },
  ...(externalServer ? {} : {
    webServer: {
      command: `node node_modules/next/dist/bin/next start -p ${port}`,
      url: `http://127.0.0.1:${port}`,
      timeout: 120_000,
      reuseExistingServer: false,
      gracefulShutdown: { signal: "SIGTERM", timeout: 5_000 },
    },
  }),
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
