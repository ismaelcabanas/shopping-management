# Implementation Tasks

## 1. Update ProductCatalogPage Layout

- [ ] 1.1 Remove separate header section with white background and border
- [ ] 1.2 Change all instances of `max-w-2xl` to `max-w-4xl` (3 locations: header, alert, content)
- [ ] 1.3 Add `py-8` to main container (remove from nested div)
- [ ] 1.4 Create unified header structure:
  - Back button + action buttons in flex row (`mb-4`)
  - H1 title with consistent styling (`text-3xl font-bold text-gray-800`)
  - Product count subtitle (`text-gray-600 mt-2`)
- [ ] 1.5 Wrap content area in semantic `<main>` tag
- [ ] 1.6 Keep FAB (floating action button) unchanged
- [ ] 1.7 Verify all modals still work (RegisterPurchaseModal, UpdateStockModal, etc.)

## 2. Update ShoppingListPage Layout

- [ ] 2.1 Add `max-w-4xl` to container div
- [ ] 2.2 Wrap H1 in semantic `<header>` tag with `mb-8`
- [ ] 2.3 Add product count subtitle below H1:
  - Text: `{itemCount} producto{itemCount !== 1 ? 's' : ''} pendiente{itemCount !== 1 ? 's' : ''}`
  - Styling: `text-gray-600 mt-2`
- [ ] 2.4 Wrap ShoppingListView in semantic `<main>` tag
- [ ] 2.5 Update header spacing from `mb-6` to `mb-8` for consistency

## 3. Apply Spacing System Consistently

- [ ] 3.1 Verify ProductCatalogPage uses:
  - `py-8` on main container
  - `mb-8` on header
  - `mb-4` on button row
  - `px-4` for horizontal padding
- [ ] 3.2 Verify ShoppingListPage uses:
  - `py-8` on main container (already present)
  - `mb-8` on header
  - `px-4` for horizontal padding (already present)

## 4. Update Unit Tests

- [ ] 4.1 Review `src/test/presentation/pages/ProductCatalogPage.test.tsx`
  - Update any layout-specific assertions if needed
  - Verify tests still pass after layout changes
- [ ] 4.2 Review `src/test/presentation/pages/ShoppingListPage.test.tsx`
  - Update any layout-specific assertions if needed
  - Verify tests still pass after adding max-width

## 5. Update E2E Tests

- [ ] 5.1 Review `e2e/us-008-register-purchase.spec.ts` (ProductCatalog interactions)
- [ ] 5.2 Review `e2e/us-011-exclude-scanned-products.spec.ts` (ProductCatalog scanning)
- [ ] 5.3 Review `e2e/us-012-consumption-tracking.spec.ts` (Stock level updates)
- [ ] 5.4 Review `e2e/us-024-shopping-mode.spec.ts` (ShoppingList interactions)
- [ ] 5.5 Update selectors if header structure changes affect them
- [ ] 5.6 Verify E2E tests pass

## 6. Visual Regression Testing (Manual)

- [ ] 6.1 Test ProductCatalogPage on mobile (viewport < 640px):
  - Header renders correctly
  - Products list displays properly
  - FAB is accessible
  - All modals work
- [ ] 6.2 Test ProductCatalogPage on tablet (768px - 1024px):
  - Content is centered with max-width
  - Header actions are accessible
  - Layout looks clean
- [ ] 6.3 Test ProductCatalogPage on desktop (1920px):
  - Content is centered at 896px width
  - No cramped appearance
  - Better use of horizontal space vs current
- [ ] 6.4 Test ShoppingListPage on mobile:
  - Header displays product count
  - List renders correctly
  - "Iniciar Compra" button is accessible
- [ ] 6.5 Test ShoppingListPage on tablet:
  - Content is centered with max-width
  - Consistent with ProductCatalog
- [ ] 6.6 Test ShoppingListPage on desktop:
  - Content is centered at 896px width
  - Consistent with ProductCatalog

## 7. Validation

- [ ] 7.1 Run `npm run build` - verify TypeScript compilation succeeds
- [ ] 7.2 Run `npm test` - verify all unit tests pass
- [ ] 7.3 Run `npm run lint` - verify no linting errors
- [ ] 7.4 Run `npm run test:e2e` - verify E2E tests pass

## 8. Documentation

- [ ] 8.1 Update CHANGELOG.md with layout consistency improvement
- [ ] 8.2 Consider adding design system documentation (future task)
- [ ] 8.3 Create commit with proper message format

## 9. Responsive Breakpoint Testing

- [ ] 9.1 Test viewport transitions (resize browser):
  - 320px (mobile S) → Full width with padding
  - 640px (mobile L) → Full width with padding
  - 768px (tablet) → Constrained to max-w-4xl, centered
  - 1024px (desktop S) → Constrained to max-w-4xl, centered
  - 1920px (desktop L) → Constrained to max-w-4xl, centered
- [ ] 9.2 Verify no horizontal scrollbars at any breakpoint
- [ ] 9.3 Verify consistent padding and spacing at all breakpoints

## Notes

- Focus on layout changes only - no functional modifications
- Preserve all existing features, buttons, and interactions
- If tests fail due to selectors, update selectors (not logic)
- FAB stays on ProductCatalog as mobile quick-action pattern
