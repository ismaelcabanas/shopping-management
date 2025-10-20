# Frontend Architecture - Hybrid Approach

## Overview

This project uses a **hybrid architecture** that combines the best of Clean Architecture/DDD with Feature-Sliced Design principles.

---

## Architecture Philosophy

### Backend: Clean Architecture + DDD (Horizontal Layers)
```
backend/
├── domain/          # Business logic, entities
├── application/     # Use cases
└── infrastructure/  # APIs, repositories
```

### Frontend: Clean Architecture + Feature Organization (Hybrid)
```
src/
├── domain/              # Business logic (shared across features)
├── application/         # Use cases (when needed)
├── infrastructure/      # API clients, repositories
└── presentation/        # UI layer organized by features
    ├── features/        # ⭐ Feature-based organization
    ├── shared/          # Shared UI components
    └── pages/           # Page orchestrators
```

---

## Why Hybrid?

### ✅ Advantages of This Approach

1. **Maintains Clean Architecture principles**
   - Domain logic is independent and testable
   - Clear separation of concerns
   - Follows DDD as defined in CLAUDE.md

2. **Scales well for teams**
   - Features are isolated and easy to find
   - Multiple developers can work on different features
   - Easy to add/remove features

3. **Best of both worlds**
   - Horizontal layers for business logic (Clean Architecture)
   - Vertical slices for UI features (Feature-Sliced Design)

---

## Directory Structure

### Current Structure

```
shopping-management-webapp/
├── src/
│   ├── domain/                      # Clean Architecture Layer
│   │   └── utils/
│   │       ├── priceCalculator.ts
│   │       └── priceCalculator.test.ts
│   │
│   ├── application/                 # Clean Architecture Layer (future)
│   │   └── use-cases/
│   │
│   ├── infrastructure/              # Clean Architecture Layer (future)
│   │   ├── api/
│   │   └── repositories/
│   │
│   └── presentation/                # UI Layer (Feature-organized)
│       │
│       ├── features/                # ⭐ Feature modules
│       │   │
│       │   ├── product-list/        # Feature: Product List
│       │   │   ├── ProductCard.tsx
│       │   │   └── ProductCard.test.tsx
│       │   │
│       │   └── shopping-cart/       # Feature: Shopping Cart
│       │       ├── ShoppingList.tsx
│       │       └── ShoppingList.test.tsx
│       │
│       ├── shared/                  # Shared UI resources
│       │   ├── components/          # Reusable components
│       │   │   └── Navigation.tsx
│       │   └── hooks/               # Reusable hooks (future)
│       │
│       ├── pages/                   # Page components
│       │   ├── HomePage.tsx
│       │   ├── HomePage.test.tsx
│       │   ├── DashboardPage.tsx
│       │   └── DashboardPage.test.tsx
│       │
│       └── router/                  # Routing logic
│           └── Router.test.tsx
│
├── e2e/                             # End-to-End tests
│   └── shopping-manager.spec.ts
│
└── public/
```

---

## Feature Organization Rules

### What Goes in a Feature?

A **feature** is a self-contained piece of functionality. Each feature should contain:

```
features/
└── feature-name/
    ├── ComponentName.tsx           # Feature components
    ├── ComponentName.test.tsx      # Component tests
    ├── useFeatureName.ts           # Feature-specific hooks (optional)
    ├── useFeatureName.test.ts      # Hook tests (optional)
    └── types.ts                    # Feature-specific types (optional)
```

### Examples of Features

#### Current Features:
- **`product-list`** - Display and interact with product cards
- **`shopping-cart`** - Manage shopping cart and list

#### Future Features:
- **`product-filters`** - Filter products by category, price, stock
- **`inventory-management`** - Add/edit/delete products from inventory
- **`price-comparison`** - Compare prices across stores
- **`purchase-history`** - View past purchases

---

## What Goes in Shared?

### `shared/components/`
Components used across **multiple features** or pages:
- Navigation bars
- Footers
- Modals
- Buttons
- Form inputs
- Loading spinners

**Example:**
```typescript
// ✅ Good: Navigation is used in all pages
shared/components/Navigation.tsx

// ❌ Bad: ProductCard is only used in product-list feature
shared/components/ProductCard.tsx  // Should be in features/product-list/
```

### `shared/hooks/`
Hooks used across **multiple features**:
- `useLocalStorage` - Persist data
- `useDebounce` - Debounce inputs
- `useAuth` - Authentication logic
- `useMediaQuery` - Responsive design

---

## Dependency Rules

### ✅ Allowed Dependencies

```
domain/          → (no dependencies)
application/     → domain/
infrastructure/  → domain/, application/
presentation/    → domain/, application/, infrastructure/
```

### Feature-Level Dependencies

```
features/shopping-cart/  → features/product-list/  ✅ (OK)
features/product-list/   → features/shopping-cart/ ❌ (NO circular deps)
```

**Rule:** Features can import from other features, but avoid circular dependencies.

### Shared Dependencies

All features can import from `shared/`:
```typescript
// ✅ Good
import { Navigation } from '../../shared/components/Navigation'
import { useDebounce } from '../../shared/hooks/useDebounce'
```

---

## Import Path Examples

### From a Feature Component

```typescript
// features/shopping-cart/ShoppingList.tsx

// ✅ Import from domain
import { formatPrice } from '../../../domain/utils/priceCalculator'

// ✅ Import from another feature
import { ProductCard } from '../product-list/ProductCard'

// ✅ Import from shared
import { Button } from '../../shared/components/Button'

// ✅ Import from infrastructure (when available)
import { ProductService } from '../../../infrastructure/api/ProductService'
```

### From a Page Component

```typescript
// pages/DashboardPage.tsx

// ✅ Import features
import { ShoppingList } from '../features/shopping-cart/ShoppingList'
import { ProductFilters } from '../features/product-filters/ProductFilters'

// ✅ Import shared
import { LoadingSpinner } from '../shared/components/LoadingSpinner'
```

---

## When to Create a New Feature

Create a new feature when:
1. ✅ It represents a **distinct user capability**
2. ✅ It has **3+ related components**
3. ✅ It has **its own state or logic**
4. ✅ Multiple pages might use it

**Examples:**
- ✅ `product-filters` - Filtering is a distinct capability
- ✅ `shopping-cart` - Cart management is self-contained
- ❌ `button` - Too small, should be in `shared/components/`

---

## Testing Strategy with Hybrid Architecture

### Unit Tests
**Location:** `domain/utils/*.test.ts`
- Test pure functions
- No dependencies on features

### Component Tests
**Location:** `features/*/ComponentName.test.tsx`
- Test feature components in isolation
- Mock dependencies from other features

### Integration Tests
**Location:** `features/*/FeatureName.test.tsx`
- Test multiple components within a feature
- Test interaction between features

### Page Tests
**Location:** `pages/*.test.tsx`
- Test complete pages
- Test feature composition

### E2E Tests
**Location:** `e2e/*.spec.ts`
- Test complete user workflows
- Test across multiple features and pages

---

## Migration from Old Structure

### Before (Old Structure)
```
src/presentation/
├── components/
│   ├── ProductCard.tsx
│   ├── ShoppingList.tsx
│   └── Navigation.tsx
└── pages/
    └── DashboardPage.tsx
```

### After (New Hybrid Structure)
```
src/presentation/
├── features/
│   ├── product-list/
│   │   └── ProductCard.tsx
│   └── shopping-cart/
│       └── ShoppingList.tsx
├── shared/
│   └── components/
│       └── Navigation.tsx
└── pages/
    └── DashboardPage.tsx
```

---

## Benefits Summary

| Aspect | Clean Architecture Only | Hybrid Approach |
|--------|------------------------|-----------------|
| **Domain Logic** | ✅ Independent | ✅ Independent |
| **Feature Isolation** | ❌ All in one folder | ✅ Separated by feature |
| **Team Scalability** | ⚠️ Conflicts likely | ✅ Parallel work easy |
| **Code Discovery** | ⚠️ Large folders | ✅ Easy to navigate |
| **Testability** | ✅ Easy to test | ✅ Easy to test |
| **Maintenance** | ⚠️ Hard with many features | ✅ Easy per-feature |

---

## Future Considerations

### When to Move to Full Feature-Sliced Design

Consider migrating to full FSD when:
1. You have 30+ features
2. You have 10+ developers
3. Features become completely independent modules
4. You want to extract features to separate packages

### How to Evolve

The hybrid approach can evolve in two directions:

**Option A: Stay with Hybrid** (Recommended for most projects)
- Keep Clean Architecture for backend
- Keep hybrid for frontend
- Scale by adding more features

**Option B: Full Feature-Sliced Design**
- Migrate domain logic into features
- Each feature becomes a vertical slice
- More suitable for very large applications

---

## Resources

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Feature-Sliced Design](https://feature-sliced.design/)

---

## Conclusion

This hybrid approach gives you:
- ✅ Clean Architecture principles for business logic
- ✅ Feature organization for scalable UI
- ✅ Clear separation of concerns
- ✅ Easy to test and maintain
- ✅ Room to grow and evolve

**Start building features now with confidence!** 🚀

