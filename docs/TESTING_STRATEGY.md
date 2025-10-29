# Testing Strategy - Shopping Manager

## Overview

This document outlines the complete testing strategy for the Shopping Manager project, including current implementation and future test types needed for a robust testing architecture.

---

## Current Testing Architecture ✅

### 1. Unit Tests
**Purpose:** Test individual functions in isolation without dependencies.

**Location:** `src/domain/utils/*.test.ts`

**What we test:**
- Pure functions (no side effects)
- Business logic calculations
- Data transformations

**Example:**
```typescript
// priceCalculator.test.ts
describe('calculateTotal', () => {
  it('should calculate the total of items correctly', () => {
    const items = [
      { price: 10, quantity: 2 },
      { price: 5, quantity: 3 },
    ]
    const result = calculateTotal(items)
    expect(result).toBe(35) // (10*2) + (5*3)
  })
})
```

**Tools:** Vitest

**When to use:**
- Testing business logic functions
- Testing utility functions
- Testing calculations and validations

---

### 2. Component Tests
**Purpose:** Test React components in isolation with user interactions.

**Location:** `src/presentation/features/*/ComponentName.test.tsx`

**What we test:**
- Component rendering
- Props handling
- User interactions (clicks, inputs)
- Conditional rendering
- CSS classes and styles
- Event handlers

**Example:**
```typescript
// features/product-list/ProductCard.test.tsx
describe('ProductCard - Component Tests', () => {
  it('should call onAddToCart when button is clicked', () => {
    const onAddToCart = vi.fn()
    render(<ProductCard {...props} onAddToCart={onAddToCart} />)
    
    fireEvent.click(screen.getByTestId('add-to-cart-button'))
    
    expect(onAddToCart).toHaveBeenCalledTimes(1)
  })
})
```

**Tools:** Vitest + React Testing Library

**When to use:**
- Testing UI components
- Testing component state
- Testing user interactions
- Testing visual behavior

---

### 3. Integration Tests
**Purpose:** Test how multiple components work together.

**Location:** `src/presentation/features/*/FeatureName.test.tsx`

**What we test:**
- Communication between components
- State management across components
- Data flow between parent and child components
- Complex user workflows

**Example:**
```typescript
// features/shopping-cart/ShoppingList.test.tsx
describe('ShoppingList - Integration Tests', () => {
  it('should add a product to the list when button is clicked', () => {
    render(<ShoppingList products={mockProducts} />)
    
    const addButtons = screen.getAllByTestId('add-to-cart-button')
    fireEvent.click(addButtons[0])
    
    expect(screen.getByTestId('cart-count')).toHaveTextContent('1')
  })
})
```

**Tools:** Vitest + React Testing Library

**When to use:**
- Testing features that span multiple components
- Testing data flow
- Testing state updates across components

---

### 4. Router/Navigation Tests
**Purpose:** Test routing and navigation between pages.

**Location:** `src/presentation/router/*.test.tsx`

**What we test:**
- Route navigation
- Active link highlighting
- URL changes
- Route parameters
- Navigation guards (when implemented)

**Example:**
```typescript
// Router.test.tsx
describe('Router - Integration Tests', () => {
  it('should navigate from Home to Dashboard when clicking nav link', async () => {
    render(<AppWithRouter />)
    
    fireEvent.click(screen.getByTestId('nav-dashboard'))
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard - Mis Productos')).toBeInTheDocument()
    })
  })
})
```

**Tools:** Vitest + React Testing Library + React Router (MemoryRouter)

**When to use:**
- Testing page navigation
- Testing route configuration
- Testing navigation behavior

---

### 5. Page Tests
**Purpose:** Test complete pages with all their components.

**Location:** `src/presentation/pages/*.test.tsx`

**What we test:**
- Page rendering
- Page structure
- Integration of components within the page
- Data passed to child components

**Example:**
```typescript
// DashboardPage.test.tsx
describe('DashboardPage - Integration Tests', () => {
  it('should render the dashboard title', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    )
    
    expect(screen.getByText('Dashboard - Mis Productos')).toBeInTheDocument()
  })
})
```

**Tools:** Vitest + React Testing Library + MemoryRouter

**When to use:**
- Testing complete page functionality
- Testing page-level state
- Testing page composition

---

### 6. E2E (End-to-End) Tests
**Purpose:** Test the entire application as a user would use it in a real browser.

**Location:** `e2e/*.spec.ts`

**What we test:**
- Complete user workflows
- Real browser behavior
- Navigation flows
- Form submissions
- Multi-page interactions

**Example:**
```typescript
// shopping-manager.spec.ts
test('should navigate through the complete user flow', async ({ page }) => {
  await page.goto('/')
  
  await expect(page.locator('h1')).toContainText('Bienvenido a Shopping Manager')
  
  await page.getByTestId('go-to-dashboard').click()
  
  await expect(page).toHaveURL('/dashboard')
})
```

**Tools:** Playwright

**When to use:**
- Testing critical user journeys
- Testing cross-browser compatibility
- Testing real-world scenarios
- Smoke testing deployments

**Commands:**
- `npm run test:e2e` - Run E2E tests (headless)
- `npm run test:e2e:ui` - Run with UI (recommended for development)
- `npm run test:e2e:headed` - Run with visible browser
- `npm run test:e2e:debug` - Debug mode

---

## Testing Configuration

### Vitest Configuration
**File:** `vitest.config.ts`

**Key settings:**
- Environment: jsdom (simulates browser)
- Globals: true (no need to import describe/it/expect)
- Setup file: `src/test/setup.ts`
- Excludes: e2e/ folder (prevents conflicts with Playwright)

### Playwright Configuration
**File:** `playwright.config.ts`

**Key settings:**
- Base URL: http://localhost:5173
- Browser: Chromium
- Auto-start dev server
- Generate HTML reports
- Upload artifacts in CI

---

## CI/CD Integration ✅

**File:** `.github/workflows/shopping-management-webapp-ci.yml`

**Pipeline stages:**
1. Install dependencies
2. Install Playwright browsers
3. TypeScript compilation check
4. ESLint code quality check
5. Run unit tests (`npm run test:unit`)
6. Run E2E tests (`npm run test:e2e`)
7. Upload Playwright report (on failure)

**Triggers:**
- Push to `main` branch
- Pull requests to `main`
- Only when files in `shopping-management-webapp/` change

---

## Future Testing Types (To Implement) 🚀

### 7. Custom Hook Tests
**Status:** ⏳ Not yet needed (no custom hooks implemented)

**Purpose:** Test custom React hooks in isolation.

**When to implement:**
When you create reusable hooks like:
- `useShoppingCart` - Cart logic
- `useProductFilters` - Filter/search logic
- `useLocalStorage` - Persistence logic
- `useDebounce` - Input debouncing

**Example:**
```typescript
import { renderHook, act } from '@testing-library/react'

test('useShoppingCart should add items', () => {
  const { result } = renderHook(() => useShoppingCart())
  
  act(() => {
    result.current.addItem({ id: '1', name: 'Leche' })
  })
  
  expect(result.current.items).toHaveLength(1)
})
```

**Tools:** Vitest + @testing-library/react-hooks

**Why important:**
- Tests logic once, reused in multiple components
- Faster than testing each component that uses the hook
- Easier to identify bugs

---

### 8. React Query Hook Tests
**Status:** ⏳ Not yet needed (no API calls implemented)

**Purpose:** Test data fetching, caching, and state management.

**When to implement:**
When you create hooks for API calls:
- `useProducts` - Fetch products from backend
- `useInventory` - Fetch inventory data
- `useStores` - Fetch store information
- `usePriceHistory` - Fetch price history

**Example:**
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

test('useProducts fetches and returns products', async () => {
  const queryClient = new QueryClient()
  
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
  
  const { result } = renderHook(() => useProducts(), { wrapper })
  
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true)
  })
  
  expect(result.current.data).toHaveLength(4)
})
```

**Tools:** Vitest + React Query + MSW (Mock Service Worker)

**Why important:**
- Data fetching is critical and error-prone
- Handles loading states, errors, retries
- Cache behavior needs verification

---

### 9. Zustand Store Tests
**Status:** ⏳ Not yet needed (no global state implemented)

**Purpose:** Test global state management.

**When to implement:**
When you need shared state across the app:
- `useInventoryStore` - Global inventory state
- `useAuthStore` - User authentication
- `useCartStore` - Persistent shopping cart
- `useSettingsStore` - User preferences

**Example:**
```typescript
import { renderHook, act } from '@testing-library/react'
import { useCartStore } from './useCartStore'

test('should add item to cart', () => {
  const { result } = renderHook(() => useCartStore())
  
  act(() => {
    result.current.addItem({ id: '1', name: 'Leche', price: 1.5 })
  })
  
  expect(result.current.items).toHaveLength(1)
  expect(result.current.total).toBe(1.5)
})
```

**Tools:** Vitest + Zustand

**Why important:**
- Global state bugs affect the entire app
- Complex state updates need verification
- Prevents race conditions

---

### 10. API/Service Tests
**Status:** ⏳ Not yet needed (no backend integration)

**Purpose:** Test the infrastructure layer (HTTP calls, data mapping).

**When to implement:**
When you create service/API classes:
- `ProductService` - CRUD operations for products
- `InventoryService` - Inventory management API
- `AuthService` - Authentication API
- `StoreService` - Store data API

**Example:**
```typescript
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { ProductService } from './ProductService'

const server = setupServer(
  rest.get('/api/products', (req, res, ctx) => {
    return res(ctx.json([
      { id: '1', name: 'Leche', price: 1.5 }
    ]))
  })
)

test('ProductService.getAll fetches products', async () => {
  const products = await ProductService.getAll()
  
  expect(products).toHaveLength(1)
  expect(products[0].name).toBe('Leche')
})
```

**Tools:** Vitest + MSW (Mock Service Worker)

**Why important:**
- API calls can fail in many ways
- Data transformation needs verification
- Error handling must be tested

---

### 11. Domain/Entity Tests
**Status:** ⏳ Not yet needed (no domain models with logic)

**Purpose:** Test domain entities and business rules.

**When to implement:**
When you model domain entities with behavior:
- `Product` class with validation
- `InventoryItem` with restock logic
- `ShoppingList` with business rules
- `Purchase` with calculation logic

**Example:**
```typescript
import { InventoryItem } from '@/domain/entities/InventoryItem'

describe('InventoryItem', () => {
  test('should indicate low stock when below minimum', () => {
    const item = new InventoryItem({
      productId: '1',
      currentStock: 3,
      minimumStock: 5
    })
    
    expect(item.isLowStock()).toBe(true)
  })
  
  test('should not allow negative stock', () => {
    const item = new InventoryItem({
      productId: '1',
      currentStock: 5,
      minimumStock: 2
    })
    
    expect(() => item.removeStock(10)).toThrow('Insufficient stock')
  })
})
```

**Tools:** Vitest

**Why important:**
- Business rules are the core of the application
- Domain logic must be bulletproof
- Follows Domain-Driven Design principles

---

### 12. Form Validation Tests
**Status:** ⏳ Not yet needed (no complex forms)

**Purpose:** Test form validation logic.

**When to implement:**
When you create forms with validation:
- Add product form
- Edit inventory form
- Purchase form
- User settings form

**Example:**
```typescript
test('should show error for invalid price', async () => {
  const user = userEvent.setup()
  render(<AddProductForm onSubmit={mockSubmit} />)
  
  await user.type(screen.getByTestId('price-input'), '-10')
  await user.click(screen.getByTestId('submit-button'))
  
  expect(screen.getByTestId('error-message'))
    .toHaveTextContent('Price must be greater than 0')
  expect(mockSubmit).not.toHaveBeenCalled()
})
```

**Tools:** Vitest + React Testing Library + @testing-library/user-event

**Why important:**
- Prevents invalid data from entering the system
- Improves user experience
- Reduces backend errors

---

## Clean Architecture Testing Principles ⭐

### Mocking Strategy for Presentation Layer

**Core Principle:** Mock the **contract** (use cases), NOT the **implementation** (repositories).

#### Why This Matters

Following Clean Architecture, the presentation layer should ONLY know about use cases. Repositories are implementation details hidden behind the Application layer.

```
┌─────────────────────────────────────────┐
│     Presentation Layer (Components)     │
│                                         │
│   ✅ Knows: Use Cases                   │
│   ❌ Doesn't know: Repositories         │
└─────────────┬───────────────────────────┘
              │
              │ Calls Use Case
              ▼
┌─────────────────────────────────────────┐
│    Application Layer (Use Cases)        │
│                                         │
│   Uses: Repositories (interfaces)       │
└─────────────┬───────────────────────────┘
              │
              │ Calls Repository
              ▼
┌─────────────────────────────────────────┐
│   Infrastructure Layer (Repositories)   │
│                                         │
│   Implements: Repository interfaces     │
│   Uses: localStorage, APIs, etc.        │
└─────────────────────────────────────────┘
```

#### ✅ CORRECT: Mock Use Cases

```typescript
// ✅ Mock ONLY the use case
const mockExecute = vi.fn();
vi.mock('../../../application/use-cases/AddProductToInventory', () => ({
  AddProductToInventory: vi.fn().mockImplementation(() => ({
    execute: mockExecute,
  })),
}));

describe('AddProductPage', () => {
  it('should call use case when form is submitted', async () => {
    mockExecute.mockResolvedValue(undefined);

    render(<AddProductPage />);

    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Leche' } });
    fireEvent.click(screen.getByRole('button', { name: /agregar/i }));

    // ✅ Verify the contract with the use case
    await waitFor(() => {
      expect(mockExecute).toHaveBeenCalledWith({
        id: expect.any(String),
        name: 'Leche',
        initialQuantity: 10,
      });
    });
  });

  it('should show success message after use case succeeds', async () => {
    mockExecute.mockResolvedValue(undefined);

    render(<AddProductPage />);
    // ... submit form ...

    // ✅ Verify user-visible behavior
    await waitFor(() => {
      expect(screen.getByText(/producto agregado exitosamente/i)).toBeInTheDocument();
    });
  });
});
```

**Benefits:**
- ⚡ Fast tests (~30ms vs ~2000ms)
- 🏛️ Respects Clean Architecture
- 🔒 Encapsulation preserved
- 🛡️ Resilient to implementation changes
- ✅ Tests the actual contract

#### ❌ INCORRECT: Mock Repositories or Test Implementation

```typescript
// ❌ WRONG: Component should not know about repositories
const mockProductRepo = { save: vi.fn() };
const mockInventoryRepo = { save: vi.fn() };

describe('AddProductPage', () => {
  it('should save to repository', async () => {
    render(<AddProductPage />);
    // ... submit form ...

    // ❌ WRONG: Testing implementation details
    expect(mockProductRepo.save).toHaveBeenCalled();
  });

  it('should save to localStorage', async () => {
    render(<AddProductPage />);
    // ... submit form ...

    // ❌ WRONG: Verifying infrastructure layer details
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    expect(products).toHaveLength(1);
  });
});
```

**Problems:**
- ❌ Violates Clean Architecture
- ❌ Breaks encapsulation
- ❌ Tests are slow (needs real localStorage)
- ❌ Fragile (breaks if we change from localStorage to IndexedDB)
- ❌ Presentation layer knows too much

### Timers in Tests

**Rule:** Avoid fake timers in component tests. Use `waitFor` instead.

#### ✅ CORRECT: Use waitFor

```typescript
it('should navigate after successful submission', async () => {
  mockExecute.mockResolvedValue(undefined);

  render(<AddProductPage />);
  // ... submit form ...

  // ✅ waitFor handles the wait automatically
  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith('/catalog');
  }, { timeout: 2000 });
});
```

**Benefits:**
- Simple and clear
- No timer management
- Focuses on behavior, not implementation

#### ❌ INCORRECT: Use Fake Timers

```typescript
it('should navigate after 1500ms', async () => {
  vi.useFakeTimers(); // ❌ Unnecessary complexity

  render(<AddProductPage />);
  // ... submit form ...

  vi.advanceTimersByTime(1500); // ❌ Couples test to implementation

  expect(mockNavigate).toHaveBeenCalled();

  vi.useRealTimers(); // ❌ Easy to forget cleanup
});
```

**Problems:**
- ❌ Couples test to implementation (1500ms is a detail)
- ❌ More complex
- ❌ Can cause timing issues
- ❌ Risk of forgetting cleanup

**Exception:** Only use fake timers when absolutely necessary (e.g., testing debounce logic).

### Real Example: AddProductPage Refactoring

**Before (Anti-pattern):**
```typescript
// ❌ No mocking, uses localStorage directly
describe('AddProductPage - Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear(); // ❌ Depends on infrastructure
  });

  it('should save product to localStorage', async () => {
    render(<AddProductPage />);
    // ... submit form ...

    // ❌ Tests infrastructure layer from presentation
    await waitFor(() => {
      const products = JSON.parse(localStorage.getItem('shopping_manager_products') || '[]');
      expect(products).toHaveLength(1);
    }, { timeout: 2000 }); // ❌ Long timeout
  });
});
```

**After (Correct pattern):**
```typescript
// ✅ Mock only the use case
const mockExecute = vi.fn();
vi.mock('../../../application/use-cases/AddProductToInventory', () => ({
  AddProductToInventory: vi.fn().mockImplementation(() => ({
    execute: mockExecute,
  })),
}));

describe('AddProductPage - Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExecute.mockResolvedValue(undefined); // ✅ Default success case
  });

  it('should call use case with correct parameters', async () => {
    render(<AddProductPage />);

    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Leche' } });
    fireEvent.change(screen.getByLabelText(/cantidad/i), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: /agregar/i }));

    // ✅ Verify contract
    await waitFor(() => {
      expect(mockExecute).toHaveBeenCalledWith({
        id: expect.any(String),
        name: 'Leche',
        initialQuantity: 10,
      });
    });
  });

  it('should show error when use case fails', async () => {
    // ✅ Mock error scenario
    mockExecute.mockRejectedValue(new Error('Product already exists'));

    render(<AddProductPage />);
    // ... submit form ...

    // ✅ Verify user-visible error handling
    await waitFor(() => {
      expect(screen.getByText(/ya existe un producto/i)).toBeInTheDocument();
    });
  });
});
```

**Improvements:**
- ✅ 20x faster (~30ms vs ~2000ms)
- ✅ Respects architecture boundaries
- ✅ Tests contract, not implementation
- ✅ Easy to test error scenarios
- ✅ No infrastructure dependencies

### Summary: Testing by Layer

| Layer | What to Mock | What to Test | Tools |
|-------|--------------|--------------|-------|
| **Presentation** | Use Cases | UI behavior, user interactions, contract with use cases | Vitest + RTL |
| **Application** | Repositories (interfaces) | Business logic orchestration, data transformation | Vitest |
| **Infrastructure** | Nothing (or external services) | Repository implementations, API calls | Vitest + MSW |
| **Domain** | Nothing | Business rules, validations, calculations | Vitest |

---

## Testing Best Practices

### 1. Test Naming Convention
```typescript
// ✅ Good: Descriptive and clear
it('should display low stock warning when stock is below minimum')

// ❌ Bad: Vague
it('test stock warning')
```

### 2. AAA Pattern (Arrange-Act-Assert)
```typescript
test('should add product to cart', () => {
  // Arrange: Setup
  const product = { id: '1', name: 'Leche' }
  render(<ProductCard product={product} />)
  
  // Act: Perform action
  fireEvent.click(screen.getByTestId('add-button'))
  
  // Assert: Verify result
  expect(screen.getByTestId('cart-count')).toHaveTextContent('1')
})
```

### 3. Use data-testid for Stable Selectors
```typescript
// ✅ Good: Won't break if text changes
screen.getByTestId('add-to-cart-button')

// ❌ Bad: Breaks if text changes
screen.getByText('Agregar a la lista')
```

### 4. Test Behavior, Not Implementation
```typescript
// ✅ Good: Tests what user sees
expect(screen.getByText('Product added')).toBeVisible()

// ❌ Bad: Tests internal state
expect(component.state.productAdded).toBe(true)
```

### 5. Keep Tests Independent
```typescript
// ✅ Good: Each test is independent
beforeEach(() => {
  // Reset state before each test
})

// ❌ Bad: Tests depend on execution order
```

---

## Running Tests

### Development
```bash
# Run all unit/integration tests in watch mode
npm run test

# Run tests once (for CI)
npm run test:unit

# Run E2E tests with UI (recommended)
npm run test:e2e:ui

# Run E2E tests in headless mode
npm run test:e2e
```

### CI/CD
Tests run automatically on:
- Every push to `main`
- Every pull request to `main`
- Only when frontend files change

---

## Test Pyramid

```
        /\
       /E2E\       <- Few (8 tests) - Slow, expensive
      /------\
     /  Int.  \    <- Some (20 tests) - Medium speed
    /----------\
   /   Unit     \  <- Many (9 tests) - Fast, cheap
  /--------------\
```

**Current distribution:**
- Unit: 9 tests (16%)
- Integration: 20 tests (34%)
- E2E: 8 tests (14%)
- Router: 11 tests (19%)
- Pages: 8 tests (14%)

**Target distribution (when all features are implemented):**
- Unit: 60%
- Integration: 30%
- E2E: 10%

---

## Next Steps

### Immediate (Current Phase)
1. ✅ Maintain existing tests
2. ✅ Follow TDD for new features
3. ✅ Keep test coverage high

### When Backend Integration Starts
1. Implement API Service tests
2. Add React Query hook tests
3. Mock API responses with MSW

### When Complex Features Are Added
1. Implement Custom Hook tests
2. Add Domain Entity tests
3. Implement Zustand Store tests (if needed)

### When Forms Are Implemented
1. Add Form Validation tests
2. Test complex form interactions
3. Test file uploads (if needed)

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [TDD Guide](https://martinfowler.com/bliki/TestDrivenDevelopment.html)

---

## Summary

**Current State:**
- ✅ Solid testing foundation with 58 tests
- ✅ Covers Unit, Component, Integration, Router, Page, and E2E testing
- ✅ CI/CD pipeline fully configured
- ✅ Ready to start building features with TDD

**Future State:**
As the application grows, implement additional test types:
- Custom Hook tests (when hooks are extracted)
- React Query tests (when API integration is added)
- Zustand tests (when global state is needed)
- API Service tests (when backend is connected)
- Domain Entity tests (when business logic grows)

**Philosophy:**
Write tests that give confidence, not just coverage. Focus on testing behavior that matters to users and business logic that's critical.
