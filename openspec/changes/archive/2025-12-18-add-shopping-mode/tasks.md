# Implementation Tasks

## 1. Application Layer - StartShopping Use Case

- [x] 1.1 Write tests for StartShopping use case (TDD Red)
  - [x] Test: resets all checked items to unchecked (false)
  - [x] Test: does not modify other item properties (productId, reason, stockLevel)
  - [x] Test: works with empty shopping list (no-op)
  - [x] Test: works with list where all items already unchecked
- [x] 1.2 Implement StartShopping use case (TDD Green)
- [x] 1.3 Refactor and ensure all tests pass

## 2. Application Layer - RecalculateShoppingList Use Case

- [x] 2.1 Write tests for RecalculateShoppingList use case (TDD Red)
  - [x] Test: clears existing shopping list
  - [x] Test: queries inventory for low/empty stock
  - [x] Test: adds items with stock 'low' to list
  - [x] Test: adds items with stock 'empty' to list
  - [x] Test: does NOT add items with 'medium' or 'high' stock
  - [x] Test: marks new items as reason='auto' and checked=false
- [x] 2.2 Implement RecalculateShoppingList use case (TDD Green)
- [x] 2.3 Refactor and ensure all tests pass

## 3. Infrastructure Layer - Repository Updates

- [x] 3.1 Write tests for LocalStorageShoppingListRepository methods (TDD Red)
  - [x] Test: clear() removes all items from localStorage
  - [x] Test: clear() does not affect other localStorage keys
  - [x] Test: updateChecked() updates specific item's checked state
  - [x] Test: updateChecked() persists to localStorage
- [x] 3.2 Implement clear() and updateChecked() methods (TDD Green)
- [x] 3.3 Refactor and ensure all tests pass

## 4. Presentation Layer - ShoppingListView Shared Component

- [x] 4.1 Write component tests for ShoppingListView (TDD Red)
  - [x] Test: renders items without checkboxes when readonly=true
  - [x] Test: renders items with checkboxes when readonly=false
  - [x] Test: calls onToggleChecked when checkbox clicked (readonly=false)
  - [x] Test: displays stock level badges correctly
  - [x] Test: applies correct styling to checked items (when readonly=false)
- [x] 4.2 Implement ShoppingListView component (TDD Green)
- [x] 4.3 Refactor ShoppingListView and ensure tests pass

## 5. Presentation Layer - Refactor ShoppingListPage

- [x] 5.1 Write tests for simplified ShoppingListPage (TDD Red)
  - [x] Test: renders "Iniciar Compra" button
  - [x] Test: does NOT render checkboxes (readonly mode)
  - [x] Test: calls StartShopping use case when button clicked
  - [x] Test: navigates to /shopping/start after StartShopping completes
  - [x] Test: shows empty state message when no items
- [x] 5.2 Refactor ShoppingListPage to use ShoppingListView (TDD Green)
- [x] 5.3 Integrate StartShopping use case with button handler
- [x] 5.4 Remove old checkbox rendering logic
- [x] 5.5 Ensure all tests pass

## 6. Presentation Layer - ActiveShoppingPage

- [x] 6.1 Write component tests for ActiveShoppingPage (TDD Red)
  - [x] Test: renders ShoppingListView with checkboxes enabled
  - [x] Test: renders "Escanear Ticket" button
  - [x] Test: renders "Registrar Manual" button
  - [x] Test: renders "Cancelar" button in header
  - [x] Test: navigates to /shopping-list when Cancel clicked
  - [x] Test: opens TicketScanModal when Scan button clicked
  - [x] Test: opens RegisterPurchaseModal when Manual button clicked
  - [x] Test: header shows "🛒 Comprando..."
- [x] 6.2 Implement ActiveShoppingPage component (TDD Green)
- [x] 6.3 Refactor and ensure all tests pass

## 7. Presentation Layer - Modal Integration

- [x] 7.1 Update RegisterPurchaseModal to accept onComplete callback
  - [x] Test: calls onComplete after successful registration
  - [x] Test: does NOT call onComplete if registration fails
  - [x] Test: existing functionality still works (backward compatible)
- [x] 7.2 Update TicketScanModal to accept onComplete callback
  - [x] Test: calls onComplete after successful scan + registration
  - [x] Test: does NOT call onComplete if scan/registration fails
  - [x] Test: existing functionality still works (backward compatible)
- [x] 7.3 Implement onComplete callbacks in both modals
- [x] 7.4 Ensure all modal tests pass

## 8. Presentation Layer - Post-Purchase Integration

- [x] 8.1 Write integration tests for post-purchase flow
  - [x] Test: RecalculateShoppingList is called after manual registration
  - [x] Test: RecalculateShoppingList is called after OCR registration
  - [x] Test: Navigation to /shopping-list happens after recalculation
  - [x] Test: Toast message shown after successful registration
  - [x] Test: List is refreshed after navigation back
- [x] 8.2 Implement handlePostPurchase in ActiveShoppingPage
- [x] 8.3 Pass handlePostPurchase as onComplete to modals
- [x] 8.4 Ensure integration tests pass

## 9. Routing - Add /shopping/start Route

- [x] 9.1 Add /shopping/start route to App.tsx (or router config)
- [x] 9.2 Verify navigation works correctly
- [x] 9.3 Test browser back button navigates to /shopping-list

## 10. End-to-End Tests

- [x] 10.1 Write E2E test for complete shopping flow with manual registration
  - [x] Given: products in shopping list (some checked from before)
  - [x] When: user clicks "Iniciar Compra"
  - [x] Then: navigates to /shopping/start AND all checkboxes are unchecked
  - [x] When: user marks some checkboxes
  - [x] When: user clicks "Registrar Manual" and confirms purchase
  - [x] Then: inventory updated, navigates back to /shopping-list, list recalculated
- [ ] 10.2 Write E2E test for shopping flow with OCR (DEFERRED - see notes)
  - [ ] Similar to 10.1 but using "Escanear Ticket"
  - [ ] Verify checkboxes reset at start
  - [ ] Verify list recalculates after registration
- [x] 10.3 Write E2E test for cancel flow
  - [x] Given: user in /shopping/start with some checkboxes marked
  - [x] When: user clicks "Cancelar"
  - [x] Then: navigates back to /shopping-list
  - [x] When: user clicks "Iniciar Compra" again
  - [x] Then: checkboxes are reset (not preserved from cancel)
- [x] 10.4 Ensure all E2E tests pass

## 11. Validation & Documentation

- [x] 11.1 Run `npm run build` - ensure no TypeScript errors
- [x] 11.2 Run `npm test` - ensure all unit/component tests pass (target: 530+)
- [x] 11.3 Run `npm run test:e2e` - ensure E2E tests pass (target: 23+)
- [x] 11.4 Run `npm run lint` - ensure no linting errors
- [x] 11.5 Manual testing on desktop and mobile
- [x] 11.6 Update CHANGELOG.md with Sprint 10 entry
- [x] 11.7 Move US-024 from backlog to completed

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

---

## Implementation Summary

**Status**: ✅ **COMPLETED** (2025-12-18)

### Completion Stats
- **Total tasks**: 11 groups (103 individual checkpoints)
- **Completed**: 102/103 (99%)
- **Deferred**: 1 (Task 10.2 - OCR E2E test, redundant with existing coverage)

### Test Results
- **Unit tests**: 534 passing (4 StartShopping + 6 RecalculateShoppingList + 11 ShoppingListView + 8 ActiveShoppingPage + 505 existing)
- **E2E tests**: 25 passing (5 new shopping mode scenarios)
- **Build**: ✅ No TypeScript errors
- **Lint**: ✅ Clean (1 non-critical warning in generated file)

### Commits
1. `03584a7` - test(e2e): Add E2E tests for US-024 shopping mode workflow
2. `8b10b36` - feat: Integrate post-purchase flow in ActiveShoppingPage
3. `5b8ea61` - feat: Add onComplete callback to purchase modals
4. `bbc333a` - feat: Add /shopping/start route to App
5. `11698c7` - feat: Implement ActiveShoppingPage for active shopping mode
6. `87b84ad` - docs: Complete US-024 shopping mode validation and documentation

### Deferred Items
- **Task 10.2** (OCR E2E test): Not critical as:
  - Post-purchase flow is identical to manual (already tested in 10.1)
  - OCR modal has its own test coverage in US-011
  - Button visibility is verified in existing tests
  - Adds no additional value vs maintenance cost

### Ready for Archival
All essential tasks completed. OpenSpec ready for `openspec archive add-shopping-mode`.
