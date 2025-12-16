# Implementation Tasks

## 1. Application Layer - StartShopping Use Case

- [ ] 1.1 Write tests for StartShopping use case (TDD Red)
  - [ ] Test: resets all checked items to unchecked (false)
  - [ ] Test: does not modify other item properties (productId, reason, stockLevel)
  - [ ] Test: works with empty shopping list (no-op)
  - [ ] Test: works with list where all items already unchecked
- [ ] 1.2 Implement StartShopping use case (TDD Green)
- [ ] 1.3 Refactor and ensure all tests pass

## 2. Application Layer - RecalculateShoppingList Use Case

- [ ] 2.1 Write tests for RecalculateShoppingList use case (TDD Red)
  - [ ] Test: clears existing shopping list
  - [ ] Test: queries inventory for low/empty stock
  - [ ] Test: adds items with stock 'low' to list
  - [ ] Test: adds items with stock 'empty' to list
  - [ ] Test: does NOT add items with 'medium' or 'high' stock
  - [ ] Test: marks new items as reason='auto' and checked=false
- [ ] 2.2 Implement RecalculateShoppingList use case (TDD Green)
- [ ] 2.3 Refactor and ensure all tests pass

## 3. Infrastructure Layer - Repository Updates

- [ ] 3.1 Write tests for LocalStorageShoppingListRepository methods (TDD Red)
  - [ ] Test: clear() removes all items from localStorage
  - [ ] Test: clear() does not affect other localStorage keys
  - [ ] Test: updateChecked() updates specific item's checked state
  - [ ] Test: updateChecked() persists to localStorage
- [ ] 3.2 Implement clear() and updateChecked() methods (TDD Green)
- [ ] 3.3 Refactor and ensure all tests pass

## 4. Presentation Layer - ShoppingListView Shared Component

- [ ] 4.1 Write component tests for ShoppingListView (TDD Red)
  - [ ] Test: renders items without checkboxes when readonly=true
  - [ ] Test: renders items with checkboxes when readonly=false
  - [ ] Test: calls onToggleChecked when checkbox clicked (readonly=false)
  - [ ] Test: displays stock level badges correctly
  - [ ] Test: applies correct styling to checked items (when readonly=false)
- [ ] 4.2 Implement ShoppingListView component (TDD Green)
- [ ] 4.3 Refactor ShoppingListView and ensure tests pass

## 5. Presentation Layer - Refactor ShoppingListPage

- [ ] 5.1 Write tests for simplified ShoppingListPage (TDD Red)
  - [ ] Test: renders "Iniciar Compra" button
  - [ ] Test: does NOT render checkboxes (readonly mode)
  - [ ] Test: calls StartShopping use case when button clicked
  - [ ] Test: navigates to /shopping/start after StartShopping completes
  - [ ] Test: shows empty state message when no items
- [ ] 5.2 Refactor ShoppingListPage to use ShoppingListView (TDD Green)
- [ ] 5.3 Integrate StartShopping use case with button handler
- [ ] 5.4 Remove old checkbox rendering logic
- [ ] 5.5 Ensure all tests pass

## 6. Presentation Layer - ActiveShoppingPage

- [ ] 6.1 Write component tests for ActiveShoppingPage (TDD Red)
  - [ ] Test: renders ShoppingListView with checkboxes enabled
  - [ ] Test: renders "Escanear Ticket" button
  - [ ] Test: renders "Registrar Manual" button
  - [ ] Test: renders "Cancelar" button in header
  - [ ] Test: navigates to /shopping-list when Cancel clicked
  - [ ] Test: opens TicketScanModal when Scan button clicked
  - [ ] Test: opens RegisterPurchaseModal when Manual button clicked
  - [ ] Test: header shows "🛒 Comprando..."
- [ ] 6.2 Implement ActiveShoppingPage component (TDD Green)
- [ ] 6.3 Refactor and ensure all tests pass

## 7. Presentation Layer - Modal Integration

- [ ] 7.1 Update RegisterPurchaseModal to accept onComplete callback
  - [ ] Test: calls onComplete after successful registration
  - [ ] Test: does NOT call onComplete if registration fails
  - [ ] Test: existing functionality still works (backward compatible)
- [ ] 7.2 Update TicketScanModal to accept onComplete callback
  - [ ] Test: calls onComplete after successful scan + registration
  - [ ] Test: does NOT call onComplete if scan/registration fails
  - [ ] Test: existing functionality still works (backward compatible)
- [ ] 7.3 Implement onComplete callbacks in both modals
- [ ] 7.4 Ensure all modal tests pass

## 8. Presentation Layer - Post-Purchase Integration

- [ ] 8.1 Write integration tests for post-purchase flow
  - [ ] Test: RecalculateShoppingList is called after manual registration
  - [ ] Test: RecalculateShoppingList is called after OCR registration
  - [ ] Test: Navigation to /shopping-list happens after recalculation
  - [ ] Test: Toast message shown after successful registration
  - [ ] Test: List is refreshed after navigation back
- [ ] 8.2 Implement handlePostPurchase in ActiveShoppingPage
- [ ] 8.3 Pass handlePostPurchase as onComplete to modals
- [ ] 8.4 Ensure integration tests pass

## 9. Routing - Add /shopping/start Route

- [ ] 9.1 Add /shopping/start route to App.tsx (or router config)
- [ ] 9.2 Verify navigation works correctly
- [ ] 9.3 Test browser back button navigates to /shopping-list

## 10. End-to-End Tests

- [ ] 10.1 Write E2E test for complete shopping flow with manual registration
  - [ ] Given: products in shopping list (some checked from before)
  - [ ] When: user clicks "Iniciar Compra"
  - [ ] Then: navigates to /shopping/start AND all checkboxes are unchecked
  - [ ] When: user marks some checkboxes
  - [ ] When: user clicks "Registrar Manual" and confirms purchase
  - [ ] Then: inventory updated, navigates back to /shopping-list, list recalculated
- [ ] 10.2 Write E2E test for shopping flow with OCR
  - [ ] Similar to 10.1 but using "Escanear Ticket"
  - [ ] Verify checkboxes reset at start
  - [ ] Verify list recalculates after registration
- [ ] 10.3 Write E2E test for cancel flow
  - [ ] Given: user in /shopping/start with some checkboxes marked
  - [ ] When: user clicks "Cancelar"
  - [ ] Then: navigates back to /shopping-list
  - [ ] When: user clicks "Iniciar Compra" again
  - [ ] Then: checkboxes are reset (not preserved from cancel)
- [ ] 10.4 Ensure all E2E tests pass

## 11. Validation & Documentation

- [ ] 11.1 Run `npm run build` - ensure no TypeScript errors
- [ ] 11.2 Run `npm test` - ensure all unit/component tests pass (target: 530+)
- [ ] 11.3 Run `npm run test:e2e` - ensure E2E tests pass (target: 23+)
- [ ] 11.4 Run `npm run lint` - ensure no linting errors
- [ ] 11.5 Manual testing on desktop and mobile
- [ ] 11.6 Update CHANGELOG.md with Sprint 10 entry
- [ ] 11.7 Move US-024 from backlog to completed

## Dependencies

- Tasks 1-2 can be done in parallel (different use cases)
- Task 3 must complete before tasks 1-2 (repository methods needed)
- Task 4 must complete before tasks 5-6 (shared component)
- Tasks 5-6 can be done in parallel after task 4
- Task 7 can be done in parallel with tasks 5-6
- Task 8 depends on tasks 6-7 (integration)
- Task 9 depends on task 6 (route needs component)
- Task 10 depends on tasks 1-9 (full implementation)
- Task 11 validates everything

## Estimated Time

- Task 1: 0.5 hours (StartShopping use case)
- Task 2: 1 hour (RecalculateShoppingList use case)
- Task 3: 0.5 hours (repository methods)
- Task 4: 1 hour (shared component)
- Tasks 5-6: 1.5 hours (page refactor + new page)
- Tasks 7-8: 1 hour (modal integration + post-purchase)
- Task 9: 0.5 hours (routing)
- Task 10: 1 hour (E2E tests - 3 scenarios)
- Task 11: 0.5 hours (validation)

**Total**: ~7.5 hours (over 5 SP estimate, but includes buffer for unknowns)

## Notes

- StartShopping use case is critical for clean UX (reset checkboxes)
- RecalculateShoppingList ensures list always reflects inventory reality
- Both use cases are small, focused, and testable
- Backward compatibility maintained (modals work with/without onComplete)
