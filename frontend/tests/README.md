# Testing Architecture

This document outlines the testing structure and strategy for the Shopping Manager frontend application.

## Test Structure Overview

Our testing architecture follows frontend industry standards with a clear separation between different types of tests:

```
frontend/
├── src/                          # Source code with co-located unit tests
│   ├── domain/
│   │   └── value-objects/
│   │       ├── ItemStatus.ts
│   │       └── ItemStatus.test.ts    # Unit tests co-located with code
│   ├── application/
│   │   ├── services/
│   │   │   ├── ShoppingListService.ts
│   │   │   └── ShoppingListService.test.ts
│   │   └── use-cases/
│   │       ├── BulkActionsUseCase.ts
│   │       └── BulkActionsUseCase.test.ts
│   └── infrastructure/
│       └── repositories/
│           ├── MockShoppingListRepository.ts
│           └── MockShoppingListRepository.test.ts
│
└── tests/                        # Integration, E2E, and test utilities
    ├── integration/              # Integration tests
    │   └── ShoppingList.integration.test.ts
    ├── e2e/                      # End-to-end tests
    │   └── ShoppingList.e2e.test.ts
    ├── fixtures/                 # Test data and fixtures
    │   └── shoppingListData.ts
    ├── utils/                    # Test utilities and helpers
    │   └── testHelpers.ts
    └── README.md                 # This file
```

## Test Types

### 1. Unit Tests (Co-located)
- **Location**: Next to the source files they test (`src/**/*.test.ts`)
- **Purpose**: Test individual units in isolation
- **Environment**: Node.js (fast execution)
- **Scope**: Domain logic, use cases, services, value objects
- **Run with**: `npm run test:unit`

### 2. Integration Tests
- **Location**: `tests/integration/`
- **Purpose**: Test component integration and user workflows
- **Environment**: jsdom (DOM simulation)
- **Scope**: Component interaction, data flow, user interactions
- **Run with**: `npm run test:integration`

### 3. End-to-End Tests
- **Location**: `tests/e2e/`
- **Purpose**: Test complete user journeys in browser-like environment
- **Environment**: Placeholder (Playwright/Cypress recommended for real E2E)
- **Scope**: Full application workflows, cross-browser testing, accessibility
- **Run with**: `npm run test:e2e`

## Test Strategy

### Test Pyramid
```
    /\
   /  \    E2E Tests (Few)
  /____\   - Complete user journeys
 /      \  - Cross-browser testing
/________\ - Accessibility testing

/        \ Integration Tests (Some)
/          \ - Component interactions
/__________\ - User workflow testing

/            \ Unit Tests (Many)
/              \ - Domain logic
/________________\ - Business rules
                   - Value objects
                   - Use cases
```

### Why Co-located Unit Tests?

We follow React/Next.js industry standards by placing unit tests next to the code they test:

1. **Discoverability**: Easy to find tests related to specific code
2. **Maintenance**: When code changes, tests are right there
3. **Refactoring**: Moving code automatically moves related tests
4. **Developer Experience**: Better IDE support and faster navigation
5. **Industry Standard**: Matches React, Next.js, and modern frontend practices

### Configuration Files

- **vitest.config.ts**: Main configuration for unit tests
- **vitest.integration.config.ts**: Specialized configuration for integration tests
- **Different environments**: Node for unit tests, jsdom for integration tests

## Running Tests

```bash
# Unit tests only (fast)
npm run test:unit

# Integration tests only (slower, with DOM)
npm run test:integration

# E2E tests (placeholder - requires additional setup)
npm run test:e2e

# All tests
npm run test:all

# Watch mode
npm run test:watch                    # Unit tests
npm run test:watch:integration        # Integration tests

# Coverage reports
npm run test:coverage                 # Unit test coverage
npm run test:coverage:integration     # Integration test coverage

# CI pipeline
npm run test:ci                       # Runs all tests for CI
```

## Test Data Management

### Fixtures (`tests/fixtures/`)
Centralized test data that can be reused across integration and E2E tests:
- Domain entities
- Edge cases
- Legacy format data
- Performance test data

### Test Helpers (`tests/utils/`)
Reusable utilities for testing:
- Custom render functions
- User event setup
- Mock generators
- Assertion helpers
- Performance measurement
- Accessibility checks

## Best Practices

### Unit Tests
- **Fast**: No DOM, no external dependencies
- **Isolated**: Test one unit at a time
- **Focused**: Test business logic and domain rules
- **Co-located**: Keep tests next to the code they test

### Integration Tests
- **User-focused**: Test from user perspective
- **Component integration**: Test how components work together
- **DOM testing**: Use React Testing Library patterns
- **Realistic data**: Use fixtures for consistent test data

### E2E Tests
- **Complete journeys**: Test full user workflows
- **Browser compatibility**: Test across different browsers
- **Accessibility**: Ensure application is accessible
- **Performance**: Monitor load times and responsiveness

## Migration Notes

This structure represents a migration from separated test directories to industry-standard co-located testing:

- **Before**: Tests in `src/test/` separated from source code
- **After**: Unit tests co-located, integration/E2E tests in dedicated `tests/` directory
- **Benefits**: Better maintainability, follows React/Next.js standards, clearer separation of test types

## Future Enhancements

1. **Real E2E Testing**: Integrate Playwright or Cypress for actual browser testing
2. **Visual Regression**: Add screenshot testing for UI components
3. **Performance Testing**: Implement automated performance monitoring
4. **A11y Testing**: Integrate axe-core for comprehensive accessibility testing
5. **Component Library Testing**: Add Storybook testing integration