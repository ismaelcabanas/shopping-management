# Proposal: Implement MSW for E2E Testing

## Change ID
`implement-msw-for-e2e-testing`

## Type
Technical Debt / Infrastructure Improvement

## Status
Proposed

## Summary
Replace current E2E testing approach (localStorage flags + mock service classes) with **Mock Service Worker (MSW)** to intercept HTTP requests at the network level. This provides a more professional, scalable, and maintainable solution for mocking external services in E2E tests.

## Problem Statement

### Current Approach Limitations

The current E2E testing setup has several issues:

1. **Tight Coupling**: Components need conditional logic to detect E2E mode
   ```typescript
   // ProductCatalogPage.tsx - CURRENT
   const isE2ETestMode = localStorage.getItem('e2e_test_mode') === 'true'
   const ocrService = isE2ETestMode
     ? new MockOCRServiceForE2E()
     : new GeminiVisionOCRService(apiKey, model)
   ```

2. **Code Pollution**: Production code contains test-specific logic
   - `e2e_test_mode` flag checks scattered across components
   - Mock service classes (`MockOCRServiceForE2E`) exist alongside production services
   - Conditional service instantiation based on environment

3. **Not Scalable**:
   - Adding new external services requires new mock classes
   - Each service needs its own flag/detection mechanism
   - When repositories move to HTTP APIs, the problem multiplies

4. **Difficult to Configure**:
   - Cannot easily customize responses per test
   - Mock data is hardcoded in mock service classes
   - No way to simulate different API responses (errors, delays, etc.)

5. **Future Problem**:
   - When `ProductRepository` and `InventoryRepository` use HTTP APIs (planned backend)
   - Will need similar mocking approach for each repository
   - Complexity grows exponentially

### Why MSW is the Industry Standard

**Mock Service Worker** is used by Microsoft, Shopify, Netflix, and thousands of companies because:

- ✅ **Network-level interception**: Works at the Service Worker level (browser) or Node level (tests)
- ✅ **Zero code changes**: Production code doesn't know MSW exists
- ✅ **Realistic testing**: Uses same HTTP calls as production
- ✅ **Flexible configuration**: Different responses per test
- ✅ **Single source of truth**: One handler definition for all test types
- ✅ **Scales effortlessly**: Adding new API mocks is just adding handlers

## Proposed Solution

### Architecture

```
┌─────────────────────────────────────────────┐
│  Production (NO MSW)                        │
│                                             │
│  GeminiVisionOCRService                     │
│         ↓                                   │
│  fetch('https://generativelanguage...')    │
│         ↓                                   │
│  Real Gemini API                            │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  E2E Tests (WITH MSW)                       │
│                                             │
│  GeminiVisionOCRService                     │
│         ↓                                   │
│  fetch('https://generativelanguage...')    │
│         ↓                                   │
│  MSW intercepts → Returns mock response     │
│  (Gemini API never called)                  │
└─────────────────────────────────────────────┘
```

### Key Changes

1. **Install MSW**: Add `msw` as dev dependency
2. **Create HTTP Handlers**: Define mock responses for Gemini API
3. **Setup MSW in Playwright**: Configure service worker for E2E tests
4. **Remove Test-Specific Code**: Clean up `ProductCatalogPage` and other components
5. **Delete Mock Classes**: Remove `MockOCRServiceForE2E` (no longer needed)

### File Structure

```
shopping-management-webapp/
├── src/
│   └── mocks/
│       ├── handlers.ts           # Shared HTTP mock handlers
│       ├── browser.ts             # Browser setup (optional, for dev)
│       └── node.ts                # Node setup (for Playwright)
├── tests/
│   └── e2e/
│       ├── setup/
│       │   └── msw-setup.ts      # MSW integration with Playwright
│       └── us-011-exclude-scanned-products.spec.ts  # Updated test
└── playwright.config.ts           # Configure MSW setup
```

## Benefits

### Immediate Benefits

1. **Cleaner Code**: Remove all `isE2ETestMode` checks from production code
2. **Easier Testing**: Customize API responses per test without changing production code
3. **Better DX**: Developers can run tests without API keys or network access

### Long-Term Benefits

4. **Future-Proof**: When backend is implemented, adding API mocks is trivial
5. **Consistent Approach**: Same mocking strategy for all HTTP services
6. **Standard Pattern**: Industry-standard approach, familiar to most developers

## Risks & Mitigation

### Risks

1. **Learning Curve**: Team needs to learn MSW API
   - **Mitigation**: MSW has excellent docs, simple API, examples in proposal

2. **Service Worker Limitations**: Some browsers might have issues
   - **Mitigation**: MSW works in all modern browsers, fallback to Node mode

3. **Debugging**: Network errors harder to trace
   - **Mitigation**: MSW has built-in logging, can see intercepted requests

### Non-Risks

- **Performance**: MSW adds <50ms overhead (negligible)
- **Maintenance**: Less code to maintain than current approach
- **Breaking Changes**: MSW is stable (v2.x), maintained by Microsoft

## Success Criteria

1. ✅ All E2E tests pass with MSW
2. ✅ No `isE2ETestMode` checks in production code
3. ✅ `MockOCRServiceForE2E` class deleted
4. ✅ Can customize OCR responses per test
5. ✅ Tests run without real API keys
6. ✅ Build time unchanged or faster
7. ✅ Zero test regressions

## Out of Scope

- Context API implementation (separate change)
- Backend API implementation
- Unit test changes (MSW can be used, but not required)
- Development mode mocking (optional, not required)

## Dependencies

- None (standalone change)
- Can be implemented independently
- Does not block other work

## Estimated Effort

- **Implementation**: 2-3 hours
- **Testing & Validation**: 1 hour
- **Documentation**: 30 minutes
- **Total**: ~4 hours

## Next Steps

1. Review and approve this proposal
2. Create implementation tasks
3. Implement MSW setup
4. Migrate existing E2E tests
5. Remove old mocking code
6. Document new approach

## References

- [MSW Official Docs](https://mswjs.io/)
- [MSW Playwright Integration](https://mswjs.io/docs/integrations/node)
- [Current E2E Test](../../../shopping-management-webapp/e2e/us-011-exclude-scanned-products.spec.ts)
- [GeminiVisionOCRService](../../../shopping-management-webapp/src/infrastructure/services/ocr/GeminiVisionOCRService.ts)