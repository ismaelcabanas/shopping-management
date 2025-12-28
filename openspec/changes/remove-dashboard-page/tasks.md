# Implementation Tasks

## 1. Delete Dashboard Page and Related Components
- [ ] 1.1 Delete `shopping-management-webapp/src/presentation/pages/DashboardPage.tsx`
- [ ] 1.2 Delete `shopping-management-webapp/src/presentation/features/shopping-cart/ShoppingList.tsx` (only used by Dashboard)
- [ ] 1.3 Verify no other code references these files

## 2. Remove Dashboard Route from App Router
- [ ] 2.1 Remove DashboardPage import from `src/App.tsx`
- [ ] 2.2 Remove `/dashboard` route from Routes in `src/App.tsx`
- [ ] 2.3 Verify application compiles without errors

## 3. Update Navigation Component
- [ ] 3.1 Remove LayoutDashboard icon import from `src/presentation/shared/components/Navigation.tsx`
- [ ] 3.2 Remove Dashboard navigation link from desktop menu (lines 127-138)
- [ ] 3.3 Remove Dashboard navigation link from mobile menu (lines 217-228)
- [ ] 3.4 Verify navigation renders correctly with 3 items

## 4. Update HomePage to Link to Catalog
- [ ] 4.1 Change "Gestión de Inventario" card link from `/dashboard` to `/catalog` in `src/presentation/pages/HomePage.tsx`
- [ ] 4.2 Update button test-id from `go-to-dashboard` to `go-to-catalog`
- [ ] 4.3 Update button text from "Ir al Dashboard" to "Ver Mi Despensa"

## 5. Update Unit Tests
- [ ] 5.1 Delete `src/test/presentation/pages/DashboardPage.test.tsx`
- [ ] 5.2 Delete `src/test/presentation/features/shopping-cart/ShoppingList.test.tsx`
- [ ] 5.3 Delete `src/test/presentation/router/Router.test.tsx` (tests dashboard routing extensively)
- [ ] 5.4 Update `src/test/presentation/pages/HomePage.test.tsx`:
  - Change test-id assertion from `go-to-dashboard` to `go-to-catalog`
  - Change href assertion from `/dashboard` to `/catalog`
  - Update button text assertion
- [ ] 5.5 Update `src/presentation/shared/components/Navigation.test.tsx`:
  - Remove assertions checking for `nav-dashboard` element
  - Remove tests verifying 4 navigation links (should be 3)
  - Update mobile menu tests to expect 3 links instead of 4

## 6. Update E2E Tests
- [ ] 6.1 Delete `e2e/shopping-manager.spec.ts` (entirely focused on Dashboard flows)
- [ ] 6.2 Verify no other E2E tests reference `/dashboard` or Dashboard page

## 7. Validation
- [ ] 7.1 Run `npm run build` - verify TypeScript compilation succeeds
- [ ] 7.2 Run `npm test` - verify all unit tests pass
- [ ] 7.3 Run `npm run lint` - verify no linting errors
- [ ] 7.4 Run `npm run test:e2e` - verify E2E tests pass
- [ ] 7.5 Manual testing:
  - Navigate from HomePage to Catalog via "Ver Mi Despensa" button
  - Verify navigation menu shows only 3 items (Inicio, Mi Despensa, Lista de Compras)
  - Attempt to navigate to `/dashboard` - should show 404 or redirect
  - Test mobile menu (open/close, 3 items visible)

## 8. Documentation
- [ ] 8.1 Update CHANGELOG.md with removal note
- [ ] 8.2 Verify no documentation references Dashboard page
- [ ] 8.3 Create commit with message following project conventions
