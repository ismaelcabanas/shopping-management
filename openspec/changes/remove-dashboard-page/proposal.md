# Change: Remove Redundant Dashboard Page

## Why

The Dashboard page (`/dashboard`) is a prototype component that was never integrated with the application's Clean Architecture implementation. It serves no functional purpose and creates user confusion:

- Uses hardcoded mock data (Leche, Pan, Huevos, Manzanas) instead of real product data
- NOT connected to domain model, use cases, or LocalStorage repositories
- Data exists only in memory (lost on page refresh)
- Duplicates the purpose of ProductCatalogPage (`/catalog` - "Mi Despensa"), which is the actual, fully-functional inventory management page

Users are confused about which page to use for inventory management, as both appear in navigation but only one works correctly.

## What Changes

- Remove Dashboard page component and its dependencies
- Remove `/dashboard` route from application router
- Remove Dashboard navigation links from desktop and mobile menus
- Update HomePage "Gestión de Inventario" card to link directly to ProductCatalog (`/catalog`)
- Clean up all Dashboard-related tests (unit + E2E)

**Navigation before**: Inicio | Mi Despensa | Lista de Compras | Dashboard
**Navigation after**: Inicio | Mi Despensa | Lista de Compras

## Impact

### Affected Specs
- **responsive-navigation**: Navigation menu will have 3 items instead of 4

### Affected Code
- `src/presentation/pages/DashboardPage.tsx` - DELETE
- `src/presentation/features/shopping-cart/ShoppingList.tsx` - DELETE (only used by Dashboard)
- `src/presentation/shared/components/Navigation.tsx` - MODIFY (remove Dashboard link)
- `src/App.tsx` - MODIFY (remove Dashboard route)
- `src/presentation/pages/HomePage.tsx` - MODIFY (redirect link to Catalog)
- Multiple test files - DELETE or MODIFY

### Breaking Changes
None. The Dashboard page was never documented in specifications, was not part of user stories, and is not used in production workflows. Users should use ProductCatalogPage (Mi Despensa) for inventory management.

### Migration Path
Users navigating to `/dashboard` will encounter a 404. No migration needed - this was a prototype that should never have been accessible.
