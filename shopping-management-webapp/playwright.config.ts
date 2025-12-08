import { defineConfig, devices } from '@playwright/test'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  // MSW global setup/teardown
  globalSetup: resolve(__dirname, './e2e/setup/msw-setup.ts'),

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    env: {
      // Mock environment variables for e2e tests to avoid requiring real API keys
      VITE_OCR_PROVIDER: 'gemini',
      VITE_GEMINI_API_KEY: 'mock-api-key-for-e2e-tests',
      VITE_GEMINI_MODEL: 'gemini-2.0-flash',
      // Enable MSW for E2E tests
      VITE_ENABLE_MSW: 'true',
    },
  },
})

