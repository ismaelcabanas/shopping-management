# Implementation Tasks

## 1. Setup & Installation

- [x] 1.1 Install MSW dependency
  - Run `npm install --save-dev msw@latest`
  - Verify installation in package.json
  - Lock version in package-lock.json

## 2. Create MSW Infrastructure

- [x] 2.1 Create handlers directory structure
  - Create `src/mocks/` directory
  - Create `src/mocks/handlers.ts` file
  - Create `src/mocks/node.ts` file
  - Add exports and basic structure

- [x] 2.2 Implement Gemini API mock handler
  - Define handler for Gemini generateContent endpoint
  - Mock successful response with sample ticket data
  - Include proper response structure (candidates, content, parts)
  - Support configurable response data

- [x] 2.3 Create MSW setup for Playwright
  - Create `tests/e2e/setup/` directory
  - Create `msw-setup.ts` with server configuration
  - Export custom test fixture with MSW
  - Configure server lifecycle (listen, reset, close)

## 3. Integrate MSW with Playwright

- [x] 3.1 Update Playwright configuration
  - Configure MSW setup as global setup
  - Ensure proper cleanup between tests
  - Add MSW logging for debugging (optional)

- [x] 3.2 Create test helper utilities
  - Create utility to override handlers per test
  - Create utility to customize mock responses
  - Document usage patterns

## 4. Migrate Existing E2E Tests

- [x] 4.1 Update US-011 E2E test
  - Remove `localStorage.setItem('e2e_test_mode', 'true')`
  - Import custom test from `msw-setup`
  - Verify test passes with MSW
  - Test with customized responses (if needed)

- [x] 4.2 Update US-008 E2E test (if exists)
  - Apply same MSW migration
  - Remove E2E mode flags
  - Verify test passes

- [x] 4.3 Update any other E2E tests
  - Search for `e2e_test_mode` usage
  - Migrate all tests to MSW
  - Verify all tests pass

## 5. Remove Old Mocking Code

- [x] 5.1 Clean up ProductCatalogPage
  - Remove `isE2ETestMode` variable
  - Remove conditional OCR service instantiation
  - Always use `GeminiVisionOCRService` (MSW intercepts)
  - Simplify service initialization

- [x] 5.2 Delete MockOCRServiceForE2E
  - Delete `src/infrastructure/services/MockOCRServiceForE2E.ts`
  - Remove exports from barrel files (if any)
  - Update imports in test files

- [x] 5.3 Clean up TicketScanModal (if needed)
  - Review dependency injection approach
  - Consider if changes are still needed
  - Document any remaining DI patterns

## 6. Testing & Validation

- [x] 6.1 Run full E2E test suite
  - Execute `npm run test:e2e`
  - Verify all tests pass
  - Check for any flaky tests

- [x] 6.2 Test with custom responses
  - Create test with empty ticket response
  - Create test with error response
  - Create test with large ticket (10+ products)
  - Verify all scenarios work

- [x] 6.3 Run build and unit tests
  - Execute `npm run build`
  - Execute `npm test`
  - Ensure no regressions

## 7. Documentation

- [x] 7.1 Update README-SETUP.md
  - Document MSW usage for E2E tests
  - Explain how to add new mock handlers
  - Provide examples of customizing responses

- [x] 7.2 Add code comments
  - Comment handler definitions
  - Explain MSW setup in test files
  - Document override patterns

- [x] 7.3 Update project.md
  - Add MSW to "Testing & Quality" section
  - Update E2E testing conventions
  - Document mock handler patterns

## 8. Validation Checklist

- [x] 8.1 Code quality checks
  - No TypeScript errors
  - ESLint passes
  - All tests pass (unit + E2E)
  - Build succeeds

- [x] 8.2 Functionality verification
  - E2E tests run without real API calls
  - Can customize responses per test
  - No production code has test-specific logic
  - Tests are faster (no network delays)

- [x] 8.3 Clean-up verification
  - No `e2e_test_mode` references in production code
  - No `MockOCRServiceForE2E` references
  - No conditional service instantiation
  - Simplified dependency injection

## Dependencies

- Task 2 depends on Task 1 (need MSW installed)
- Task 4 depends on Tasks 2 & 3 (need MSW infrastructure)
- Task 5 depends on Task 4 (migrate tests before removing old code)
- Task 6 depends on Tasks 4 & 5 (validate after changes)
- Task 7 can be done in parallel with Tasks 4-6

## Parallelizable Work

- Tasks 2.1, 2.2, 2.3 can be done in any order (handlers, setup)
- Tasks 4.1, 4.2, 4.3 can be done independently (test migration)
- Task 7 documentation can start after Task 2 (infrastructure exists)

## Notes

- **Testing Strategy**: Migrate one test at a time, verify it works before proceeding
- **Rollback Plan**: Keep old code until all tests pass with MSW
- **Validation**: Run full test suite after each major change
- **Documentation**: Update docs as you implement, not at the end