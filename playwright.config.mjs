import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  workers: 1,
  timeout: 60_000,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4325', trace: 'retain-on-failure' },
  webServer: {
    command: 'pnpm dev --ignore-lock --host 127.0.0.1 --port 4325',
    url: 'http://127.0.0.1:4325',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'chromium-mobile', use: { ...devices['iPhone 13'], browserName: 'chromium' } },
    { name: 'chromium-desktop', use: { browserName: 'chromium', viewport: { width: 1440, height: 900 } } },
    {
      name: 'webkit-mobile',
      use: {
        ...devices['iPhone 13'],
        browserName: 'webkit',
        launchOptions: process.env.MOTION_WEBKIT_PATH ? { executablePath: process.env.MOTION_WEBKIT_PATH } : {},
      },
    },
  ],
});
