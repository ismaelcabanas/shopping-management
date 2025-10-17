# E2E Testing Guide

## Overview
This directory contains End-to-End (E2E) tests using Playwright. These tests simulate real user interactions with the application running in a browser.

## Running Tests Locally

### Prerequisites
- Ensure dependencies are installed: `npm install`
- Playwright browsers will be installed automatically when running tests for the first time

### Available Commands

```bash
# Run all E2E tests in headless mode
npm run test:e2e

# Run tests with interactive UI (recommended for development)
npm run test:e2e:ui

# Run tests with browser visible (useful for debugging)
npm run test:e2e:headed

# Run tests in debug mode (step-by-step execution)
npm run test:e2e:debug
```

### Recommended Workflow for Development

1. **During development**: Use `npm run test:e2e:ui`
   - Provides a visual interface to run and debug tests
   - Shows test results, screenshots, and traces
   - Allows you to run individual tests

2. **Before committing**: Run `npm run test:e2e`
   - Runs all tests in headless mode
   - Simulates how tests will run in CI

3. **Debugging failed tests**: Use `npm run test:e2e:debug`
   - Opens Playwright Inspector
   - Allows step-by-step execution
   - Shows selectors and actions

## CI Integration

E2E tests are automatically executed in the CI pipeline:

1. **When**: On every push to `main` and on pull requests
2. **Where**: GitHub Actions workflow (`.github/workflows/shopping-management-webapp-ci.yml`)
3. **What happens**:
   - Install dependencies
   - Install Playwright browsers (Chromium)
   - Build the application
   - Run unit tests
   - Start the dev server
   - Run E2E tests
   - Upload test reports as artifacts

### Viewing CI Test Results

If E2E tests fail in CI:
1. Go to the GitHub Actions tab in your repository
2. Click on the failed workflow run
3. Download the "playwright-report" artifact
4. Extract and open `index.html` to view the detailed report with screenshots and traces

## Test Structure

```
e2e/
├── shopping-manager.spec.ts  # Main E2E test suite
└── README.md                 # This file
```

## Writing E2E Tests

### Best Practices

1. **Use data-testid attributes** for reliable selectors
   ```typescript
   await page.getByTestId('add-to-cart-button').click()
   ```

2. **Test user flows**, not implementation details
   ```typescript
   test('user can add product to cart', async ({ page }) => {
     await page.goto('/dashboard')
     await page.getByTestId('add-to-cart-button').first().click()
     await expect(page.getByTestId('cart-count')).toContainText('1')
   })
   ```

3. **Use descriptive test names** that explain the user behavior
   ```typescript
   test('should display low stock warning for products with insufficient stock')
   ```

4. **Keep tests independent** - each test should work in isolation

### Example Test

```typescript
test('should add product to shopping cart', async ({ page }) => {
  // Navigate to page
  await page.goto('/dashboard')
  
  // Verify initial state
  await expect(page.getByTestId('cart-count')).toContainText('0')
  
  // Perform action
  await page.getByTestId('add-to-cart-button').first().click()
  
  // Verify result
  await expect(page.getByTestId('cart-count')).toContainText('1')
})
```

## Configuration

E2E tests are configured in `playwright.config.ts`:
- Base URL: `http://localhost:5173`
- Browser: Chromium
- Auto-start dev server before tests
- Generate HTML reports
- Capture traces on first retry

## Troubleshooting

### Tests fail locally but pass in CI (or vice versa)
- Check if the dev server is running on the correct port
- Ensure all dependencies are installed
- Clear browser cache: `npx playwright clean`

### Tests are flaky
- Add proper wait conditions
- Use `waitFor()` for dynamic content
- Avoid hard-coded timeouts

### Can't find elements
- Verify selectors using Playwright Inspector: `npm run test:e2e:debug`
- Check if elements are visible: `await expect(element).toBeVisible()`
- Use more specific selectors with `data-testid`

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)

