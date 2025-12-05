# e2e-testing Specification Delta

## ADDED Requirements

### Requirement: HTTP Mocking via Service Worker
The testing infrastructure SHALL use Mock Service Worker (MSW) to intercept HTTP requests at the network level for E2E tests, enabling realistic test scenarios without calling real external APIs.

#### Scenario: MSW intercepts Gemini API calls during E2E tests
- **GIVEN** an E2E test is running
- **AND** the application makes a request to Gemini Vision API
- **WHEN** `fetch('https://generativelanguage.googleapis.com/...')` is called
- **THEN** MSW SHALL intercept the request before it reaches the network
- **AND** return a mocked response with ticket data
- **AND** the real Gemini API SHALL NOT be called
- **AND** the application SHALL process the mock response as if it were real

#### Scenario: Test can customize mock response per scenario
- **GIVEN** an E2E test needs specific ticket data
- **WHEN** the test overrides the MSW handler with custom data
```typescript
server.use(
  http.post('**/generateContent', () => {
    return HttpResponse.json({
      candidates: [{
        content: {
          parts: [{ text: 'Custom Product | 5' }]
        }
      }]
    })
  })
)
```
- **THEN** the OCR service SHALL receive the custom response
- **AND** subsequent tests SHALL NOT be affected (handler reset)

#### Scenario: Tests run without API keys or network access
- **GIVEN** no Gemini API key is configured
- **AND** no internet connection is available
- **WHEN** E2E tests are executed
- **THEN** all tests SHALL pass successfully
- **AND** OCR functionality SHALL work using mocked responses
- **AND** no network errors SHALL occur

### Requirement: Zero Production Code Contamination
Production code SHALL NOT contain test-specific logic, flags, or conditional behavior for E2E testing. All mocking SHALL be handled transparently at the infrastructure level.

#### Scenario: Production components have no E2E mode checks
- **GIVEN** production code in `ProductCatalogPage` or other components
- **WHEN** the code is inspected
- **THEN** there SHALL NOT be any `e2e_test_mode` checks
- **AND** there SHALL NOT be any `isE2ETestMode` variables
- **AND** there SHALL NOT be any conditional service instantiation for testing
- **AND** services SHALL always be instantiated the same way

#### Scenario: Services use real implementation in both environments
- **GIVEN** the `GeminiVisionOCRService` service
- **WHEN** instantiated in production
- **THEN** it SHALL use the real Gemini API endpoint
- **WHEN** instantiated in E2E tests
- **THEN** it SHALL use the same implementation
- **AND** MSW SHALL transparently intercept the HTTP calls
- **AND** the service SHALL NOT know it's being mocked

### Requirement: Scalable Mock Handler Architecture
The mock handler architecture SHALL support adding new external service mocks without code changes to production components or existing tests.

#### Scenario: Adding new API mock requires only handler definition
- **GIVEN** a new HTTP-based service is added (e.g., ProductRepository API)
- **WHEN** E2E tests need to mock the new service
- **THEN** developers SHALL only add a new handler in `src/mocks/handlers.ts`
```typescript
http.get('https://api.myapp.com/products', () => {
  return HttpResponse.json([...mockProducts])
})
```
- **AND** NO changes SHALL be required in production code
- **AND** NO changes SHALL be required in existing tests
- **AND** NO new mock service classes SHALL be needed

#### Scenario: Multiple API endpoints share handler configuration
- **GIVEN** handlers for Gemini API, Product API, and Inventory API
- **WHEN** tests run
- **THEN** all handlers SHALL be active simultaneously
- **AND** each API SHALL be mocked independently
- **AND** handlers SHALL NOT interfere with each other
- **AND** tests can override any handler individually

### Requirement: Test Isolation and Handler Lifecycle
MSW SHALL properly manage handler lifecycle to ensure test isolation, preventing mock responses from leaking between tests.

#### Scenario: Handlers reset between tests
- **GIVEN** Test A overrides a handler with custom response
- **WHEN** Test A completes
- **THEN** the handler SHALL be reset to default
- **WHEN** Test B runs
- **THEN** Test B SHALL receive the default mock response
- **AND** Test B SHALL NOT be affected by Test A's overrides

#### Scenario: MSW server lifecycle managed by Playwright
- **GIVEN** the E2E test suite starts
- **WHEN** tests are executed
- **THEN** MSW server SHALL start before any test runs
- **AND** handlers SHALL reset after each test
- **AND** MSW server SHALL close after all tests complete
- **AND** no background processes SHALL remain

### Requirement: Backward Compatibility with Existing Tests
The migration to MSW SHALL NOT break existing E2E test functionality. All tests SHALL pass without modification to their core logic.

#### Scenario: US-011 test works with MSW without logic changes
- **GIVEN** the existing US-011 E2E test for product exclusion
- **WHEN** migrated to use MSW
- **THEN** the test logic (click buttons, verify products) SHALL NOT change
- **AND** only the setup (remove localStorage flags) SHALL change
- **AND** the test SHALL pass with the same assertions
- **AND** the test SHALL verify the same user behavior

#### Scenario: All E2E tests pass after MSW migration
- **GIVEN** all existing E2E tests (US-008, US-011, etc.)
- **WHEN** migrated to MSW
- **THEN** 100% of tests SHALL pass
- **AND** no test regressions SHALL occur
- **AND** test execution time SHALL be same or faster
- **AND** tests SHALL be more reliable (no network flakiness)

## REMOVED Requirements

### Requirement: E2E Mode Detection via LocalStorage (DEPRECATED)
~~Production code uses `localStorage.getItem('e2e_test_mode')` to detect test environment and conditionally instantiate mock services.~~

**Rationale**: This approach couples production code with testing infrastructure. MSW removes the need for E2E mode detection entirely.

### Requirement: Mock Service Classes for E2E (DEPRECATED)
~~E2E tests use dedicated mock service classes (e.g., `MockOCRServiceForE2E`) that implement service interfaces with hardcoded test data.~~

**Rationale**: MSW handlers replace mock service classes. The real service implementation is used in tests, with HTTP interception providing mocked responses.

## MODIFIED Requirements

None. This change adds new testing infrastructure requirements without modifying existing functional requirements.

## Implementation Notes

### MSW Handler Structure
```typescript
// src/mocks/handlers.ts
export const handlers = [
  http.post(
    'https://generativelanguage.googleapis.com/v1beta/models/:model:generateContent',
    async ({ params, request }) => {
      // Default mock response for Gemini API
      return HttpResponse.json({
        candidates: [{
          content: {
            parts: [{ text: 'Milk | 3\nBread | 4\nRice | 1\nEggs | 6' }]
          }
        }]
      })
    }
  )
]
```

### Playwright Integration
```typescript
// tests/e2e/setup/msw-setup.ts
import { test as base } from '@playwright/test'
import { setupServer } from 'msw/node'
import { handlers } from '../../../src/mocks/handlers'

const server = setupServer(...handlers)

export const test = base.extend({
  page: async ({ page }, use) => {
    server.listen({ onUnhandledRequest: 'bypass' })
    await use(page)
    server.resetHandlers()
    server.close()
  }
})
```

### Test Usage
```typescript
// e2e/us-011-exclude-scanned-products.spec.ts
import { test, expect } from './setup/msw-setup' // Use MSW-enabled test

test('should exclude product', async ({ page }) => {
  // No localStorage flags needed!
  // Just write the test logic
  await page.goto('http://localhost:5173')
  // ... rest of test
})
```

## Validation

- [ ] All E2E tests pass with MSW
- [ ] No `e2e_test_mode` in production code
- [ ] `MockOCRServiceForE2E` deleted
- [ ] Can customize responses per test
- [ ] Tests run without API key
- [ ] Build and unit tests still pass