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

  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "on",
  },

  projects: [
    {
      name: "desktop-1920",
      use: {
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: "desktop-1280",
      use: {
        viewport: { width: 1280, height: 720 },
      },
    },
  ],

  webServer: {
    command: "pnpm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !isCI,
  },
});
