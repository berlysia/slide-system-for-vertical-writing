import { defineConfig, devices } from "@playwright/test";

const isAI = !!process.env.AI;
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests",
  snapshotPathTemplate: "{testDir}/__snapshots__/{testFilePath}/{arg}{ext}",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isAI ? "line" : isCI ? "github" : [["html", { open: "never" }]],
  timeout: 30000,

  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "on",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],

  webServer: {
    command: "pnpm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !isCI,
  },
});
