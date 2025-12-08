/**
 * MSW Node.js Server Setup
 *
 * Configures MSW to run in Node.js environment (for Playwright E2E tests).
 * This server intercepts HTTP requests made by the application during testing.
 */

import { setupServer } from 'msw/node'
import { handlers } from './handlers'

/**
 * Create MSW server with default handlers
 * This server will intercept network requests during E2E tests
 */
export const server = setupServer(...handlers)

/**
 * Server lifecycle management
 * Import these functions in Playwright test setup
 */
export const setupMSW = () => {
  // Start server before all tests
  server.listen({
    onUnhandledRequest: 'warn' // Warn about unhandled requests for debugging
  })
}

export const resetMSW = () => {
  // Reset handlers after each test to ensure test isolation
  server.resetHandlers()
}

export const teardownMSW = () => {
  // Close server after all tests
  server.close()
}
