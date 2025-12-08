/**
 * MSW Browser Setup
 *
 * Configures MSW to run in the browser (for E2E tests with Playwright).
 * This worker intercepts HTTP requests made by the application in the browser.
 */

import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

/**
 * Create MSW browser worker with default handlers
 * This worker will intercept network requests in the browser during E2E tests
 */
export const worker = setupWorker(...handlers)
