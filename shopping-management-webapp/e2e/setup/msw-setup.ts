/**
 * MSW Setup for Playwright E2E Tests
 *
 * Configures Mock Service Worker to intercept API calls during E2E testing.
 * This setup provides a custom test fixture that manages MSW lifecycle.
 */

import { test as base } from '@playwright/test'
import { setupMSW, resetMSW, teardownMSW } from '../../src/mocks/node'

/**
 * Custom test fixture with MSW integration
 *
 * Usage in test files:
 * ```typescript
 * import { test, expect } from './setup/msw-setup'
 *
 * test('my test', async ({ page }) => {
 *   // MSW automatically intercepts API calls
 * })
 * ```
 */
export const test = base.extend({
  // Auto-fixture that runs before each test
  autoTestFixture: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      // Setup: Reset handlers before each test
      resetMSW()

      // Run the test
      await use()

      // Teardown: Nothing needed per-test (handled globally)
    },
    { auto: true }
  ]
})

export { expect } from '@playwright/test'

/**
 * Global setup function
 * Called automatically by Playwright before all tests
 */
export default async function globalSetup() {
  setupMSW()
  console.log('✓ MSW server started for E2E tests')

  // Return global teardown function
  return async () => {
    teardownMSW()
    console.log('✓ MSW server stopped')
  }
}
