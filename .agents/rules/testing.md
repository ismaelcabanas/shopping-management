# Testing Rules for React/TypeScript Project

## Test-Driven Development Rules

### TDD Approach
- **Failing Test First**: Always start with a failing test before implementing new functionality.
- **Single Test**: Write only one test at a time; never create more than one test per change.
- **Complete Coverage**: Ensure every new feature or bugfix is covered by a test.

### Test Structure & Style
- **Test Runner**: Use Vitest as the test runner.
- **Testing Library**: Use React Testing Library for component testing.
- **Type Safety**: All test functions and helpers must have full type hints.
- **Focused Tests**: Keep each test focused and under 20 lines.
- **Clear Naming**: Use clear, descriptive names for test functions and variables.
- **No Comments**: Avoid comments; make code self-documenting through naming.
- **Simple Helpers**: Use helper methods (e.g., test data builders/factories) for repeated setup, but keep them simple and typed.

### Test Simplicity & Maintainability
- **Simplest Setup**: Prefer the simplest test setup that covers the requirement.
- **Refactor Tests**: Refactor tests to remove duplication and improve readability.
- **Consistent Patterns**: Use consistent patterns throughout the test suite.
- **Extract Helpers**: If a test setup is repeated, extract a helper or custom render function.
- **Readable Tests**: Always keep tests readable and easy to modify.

### Test Process & Output
- **Single Test Display**: Only show one test at a time; never present multiple tests in a single step.
- **Single File Display**: Never show more than one file at a time.
- **Self-Contained Tests**: Each test should be self-contained and not depend on the order of execution.
- **Clarify Requirements**: If in doubt about requirements, ask for clarification before writing the test.
- **Verify Failure**: After writing a test, run it to ensure it fails before implementing the feature.
- **Automatic Test Running**: After every code or test change, always run the relevant tests using `npm test`. Do not ask for permission to run tests—just do it.

### Test Naming & Coverage
- **Descriptive Names**: Test names should clearly describe the scenario and expected outcome.
- **Purpose-Driven Variables**: Use descriptive variable names that reflect their purpose in the test.
- **Incremental Coverage**: Ensure all code paths and edge cases are eventually covered by tests, but add them incrementally.

### Test Review & Refactoring
- **Post-Pass Review**: After a test passes, review for opportunities to simplify or clarify.
- **Helper Refactoring**: Refactor test helpers as needed to keep the suite DRY and maintainable.

## Testing Commands

- `npm test` — Run all tests
- `npm test -- <path>` — Run specific test file
- `npm test -- --coverage` — Run tests with coverage report
- `npm run build` — Verify TypeScript compilation

## Testing Best Practices

### Unit Tests (Domain & Application Layers)
- Test business logic in isolation
- Mock external dependencies
- Focus on pure functions and use cases
- Test edge cases and error conditions

### Integration Tests (Infrastructure Layer)
- Test repository implementations with real/mock storage
- Test API integrations
- Keep minimal - only test critical integration points

### Component Tests (Presentation Layer)
- Use React Testing Library
- Test user interactions and UI behavior
- Mock hooks and services
- Test accessibility

### E2E Tests (Full System)
- Use Playwright for critical user journeys
- Keep minimal - only test happy paths and critical flows
- Run separately from unit tests

## Test Organization

```
src/
  domain/
    model/
      Product.ts
  application/
    use-cases/
      AddProductToInventory.ts
test/
  domain/
    model/
      Product.test.ts
  application/
    use-cases/
      AddProductToInventory.test.ts
```

Tests mirror the source structure in a separate `test/` directory.