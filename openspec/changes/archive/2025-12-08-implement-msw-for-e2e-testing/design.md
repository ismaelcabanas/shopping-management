# Design Document: MSW Implementation for E2E Testing

## Overview

This document outlines the architectural decisions and design rationale for implementing Mock Service Worker (MSW) as the HTTP mocking solution for E2E tests, replacing the current localStorage-based approach.

## Context & Problem

### Current Architecture Issues

```
┌─────────────────────────────────────────────┐
│  ProductCatalogPage.tsx (CURRENT)           │
│                                             │
│  const isE2E = localStorage.getItem(...)    │ ← Test logic in production
│  const ocr = isE2E                          │
│    ? new MockOCRServiceForE2E()             │ ← Conditional instantiation
│    : new GeminiVisionOCRService()           │
└─────────────────────────────────────────────┘
```

**Problems**:
1. Production code contains test-specific logic
2. Tight coupling between components and test infrastructure
3. Mock service classes must implement full service interface
4. Difficult to customize mock responses per test
5. Not scalable when adding more HTTP-based services

### Future Challenge

When repositories migrate to HTTP APIs:
```typescript
// Future API-based repositories (planned)
const productRepo = new HttpProductRepository('https://api.myapp.com')
const inventoryRepo = new HttpInventoryRepository('https://api.myapp.com')
```

Current approach would require:
- More localStorage flags
- More mock repository classes
- More conditional instantiation logic
- Exponential complexity growth

## Proposed Architecture

### MSW Network-Level Interception

```
┌──────────────────────────────────────────────────────────┐
│  PRODUCTION                                              │
│                                                          │
│  GeminiVisionOCRService                                  │
│         ↓                                                │
│  fetch('https://generativelanguage.googleapis.com/...') │
│         ↓                                                │
│  Network Request → Gemini API                            │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  E2E TESTS (with MSW)                                    │
│                                                          │
│  GeminiVisionOCRService (SAME CODE)                      │
│         ↓                                                │
│  fetch('https://generativelanguage.googleapis.com/...') │
│         ↓                                                │
│  ┌────────────────────────────────────────┐             │
│  │ MSW Service Worker (intercepts)        │             │
│  │  - Matches URL pattern                 │             │
│  │  - Returns mock response               │             │
│  │  - Never touches network               │             │
│  └────────────────────────────────────────┘             │
│         ↓                                                │
│  Mock Response                                           │
└──────────────────────────────────────────────────────────┘
```

## Design Decisions

### Decision 1: Use MSW Node Mode for Playwright

**Options Considered**:

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **Browser Mode** | Service Worker in browser | Most realistic | Requires service worker registration, complex setup |
| **Node Mode** (✅) | Intercept at Node.js level | Simple, fast, Playwright-native | Slightly less realistic (but sufficient) |
| **Playwright Route** | Use `page.route()` | Playwright-native | Verbose, must be configured per test |

**Decision**: Use MSW Node Mode (`msw/node`)

**Rationale**:
- Playwright tests run in Node.js context
- `setupServer()` is designed for Node environments
- Simpler setup than browser Service Worker
- No need to register service worker in browser
- Sufficient realism for E2E tests (HTTP is HTTP)

### Decision 2: Centralized Handlers with Per-Test Overrides

**Architecture**:
```typescript
// src/mocks/handlers.ts (centralized)
export const handlers = [
  http.post('**/generateContent', () => defaultResponse)
]

// tests/e2e/some-test.spec.ts (per-test override)
server.use(
  http.post('**/generateContent', () => customResponse)
)
```

**Rationale**:
- **Centralized**: Default responses work for 80% of tests
- **Flexible**: Can override per test when needed
- **DRY**: Don't repeat handler definitions
- **Maintainable**: Single source of truth for default mocks

### Decision 3: Custom Playwright Test Fixture

**Pattern**:
```typescript
// tests/e2e/setup/msw-setup.ts
export const test = base.extend({
  page: async ({ page }, use) => {
    server.listen()
    await use(page)
    server.resetHandlers()
    server.close()
  }
})
```

**Rationale**:
- **Automatic Lifecycle**: Server starts/stops automatically
- **Test Isolation**: Handlers reset between tests
- **Transparent**: Tests just import custom `test` fixture
- **Playwright Idiomatic**: Follows Playwright's fixture pattern

### Decision 4: Keep Real Service Implementations

**Decision**: Do NOT create a `HttpService` abstraction or service factory pattern yet.

**Rationale**:
- MSW makes service abstraction unnecessary for testing
- Services can use real HTTP implementation
- YAGNI: Don't add complexity until needed
- If Context API is needed later (for other reasons), it's independent

**What We're NOT Doing**:
```typescript
// ❌ NOT doing this (unnecessary with MSW)
interface OCRService {
  extractText(file: File): Promise<string>
}

class RealOCRService implements OCRService { ... }
class MockOCRService implements OCRService { ... }

// Context to swap implementations
const ocrService = useContext(OCRServiceContext)
```

**What We ARE Doing**:
```typescript
// ✅ Simple, direct instantiation (MSW intercepts HTTP)
const ocrService = new GeminiVisionOCRService(apiKey, model)
```

### Decision 5: Delete Mock Service Classes

**Decision**: Remove `MockOCRServiceForE2E` entirely.

**Rationale**:
- MSW handlers replace mock service classes
- Real `GeminiVisionOCRService` works in tests
- Less code to maintain
- No interface/implementation duplication

**Migration Path**:
1. Implement MSW handlers
2. Update all E2E tests to use MSW
3. Delete `MockOCRServiceForE2E.ts`
4. Remove conditional instantiation logic

## Implementation Strategy

### Phase 1: Setup Infrastructure (1 hour)
```
[Install MSW] → [Create handlers] → [Create Playwright setup]
```

### Phase 2: Migrate Tests (1 hour)
```
[Migrate US-011] → [Verify] → [Migrate US-008] → [Verify] → [All tests]
```

### Phase 3: Clean Up (1 hour)
```
[Remove MockOCRServiceForE2E] → [Clean ProductCatalogPage] → [Remove flags]
```

### Phase 4: Validate & Document (1 hour)
```
[Run full suite] → [Update docs] → [Final validation]
```

## Trade-offs

### Advantages of MSW

| Aspect | Before | After (MSW) |
|--------|--------|-------------|
| **Production Code** | Has test logic | Clean, no test logic |
| **Mock Configuration** | Hardcoded in mock class | Flexible per test |
| **Adding New Services** | New mock class needed | Add handler only |
| **Scalability** | Poor (N classes for N services) | Excellent (just add handlers) |
| **Debugging** | Confusion (which service?) | Clear (see MSW logs) |
| **Maintenance** | High (duplicate implementations) | Low (one handler per endpoint) |

### Disadvantages & Mitigations

| Disadvantage | Mitigation |
|--------------|------------|
| Learning curve (MSW API) | Excellent docs, simple API, examples provided |
| Service Worker browser compat | Using Node mode (no browser SW needed) |
| Debugging intercepted requests | MSW has built-in logging (`--debug` flag) |
| Overhead (~50ms per request) | Negligible for E2E tests |

## Future Extensions

### When Backend is Implemented

```typescript
// src/mocks/handlers.ts (future extension)
export const handlers = [
  // Existing: Gemini API
  http.post('**/generateContent', ...),

  // NEW: Product API (when backend exists)
  http.get('https://api.myapp.com/products', () => {
    return HttpResponse.json([
      { id: '1', name: 'Milk', quantity: 5 }
    ])
  }),

  // NEW: Inventory API (when backend exists)
  http.post('https://api.myapp.com/inventory', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ success: true }, { status: 201 })
  })
]
```

**No changes needed in**:
- Production code (services still use real HTTP)
- Test logic (just works with new APIs)
- MSW setup (handlers automatically active)

### Optional: Development Mode Mocking

If developers want to develop without backend:

```typescript
// src/mocks/browser.ts (OPTIONAL, future)
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS === 'true') {
  worker.start()
}
```

**Benefits**:
- Develop frontend independently
- No backend/API keys needed for dev
- Same mocks as E2E tests (consistency)

## Validation Checklist

### Technical Validation
- [ ] MSW intercepts Gemini API calls
- [ ] Tests pass without API key
- [ ] Can override handlers per test
- [ ] Handlers reset between tests
- [ ] No production code has test logic
- [ ] Build and lint pass
- [ ] All E2E tests pass

### Code Quality Validation
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Test coverage maintained/improved
- [ ] Code is simpler than before
- [ ] Documentation updated

### Functional Validation
- [ ] US-011 test works (exclude products)
- [ ] US-008 test works (register purchase)
- [ ] OCR functionality works in tests
- [ ] Custom responses work
- [ ] Error scenarios testable

## References

- [MSW Official Documentation](https://mswjs.io/)
- [MSW Node Integration](https://mswjs.io/docs/integrations/node)
- [Playwright Fixtures](https://playwright.dev/docs/test-fixtures)
- [Current E2E Tests](../../../shopping-management-webapp/e2e/)