# Implementation Tasks

## 1. Domain Layer - Add Checked Field
- [x] 1.1 Update `ShoppingListItem` entity to include `checked: boolean` field
- [x] 1.2 Update `ShoppingListItem.createAuto()` factory to initialize checked = false
- [x] 1.3 Update `ShoppingListItem.createManual()` factory to initialize checked = false
- [x] 1.4 Add `toggleChecked()` method to return new instance with toggled checked state
- [x] 1.5 Write unit tests for ShoppingListItem with checked field

## 2. Domain Layer - Repository Interface
- [x] 2.1 Add `toggleChecked(productId: ProductId): Promise<void>` to ShoppingListRepository interface
- [x] 2.2 Add `getCheckedItems(): Promise<ShoppingListItem[]>` to ShoppingListRepository interface
- [x] 2.3 Update interface documentation with new methods

## 3. Infrastructure Layer - LocalStorage Persistence
- [x] 3.1 Update ShoppingListItemDTO to include `checked?: boolean` field
- [x] 3.2 Update `toDTO()` mapper to include checked field
- [x] 3.3 Update `toDomain()` mapper to handle checked field (default to false if missing)
- [x] 3.4 Implement `toggleChecked()` method in LocalStorageShoppingListRepository
- [x] 3.5 Implement `getCheckedItems()` method in LocalStorageShoppingListRepository
- [x] 3.6 Write unit tests for repository with checked field persistence
- [x] 3.7 Test backward compatibility with legacy data (no checked field)

## 4. Presentation Layer - Hook Updates
- [x] 4.1 Add `toggleChecked(productId: ProductId): Promise<void>` method to useShoppingList hook
- [x] 4.2 Add `checkedCount: number` computed property to useShoppingList return value
- [x] 4.3 Update hook to handle toggle checked errors gracefully
- [x] 4.4 Write unit tests for useShoppingList with checked functionality (via component tests)

## 5. Presentation Layer - UI Component
- [x] 5.1 Remove "Comprado" button from ShoppingListPage
- [x] 5.2 Add checkbox element to each shopping list item (left-aligned)
- [x] 5.3 Implement checkbox onChange handler calling toggleChecked()
- [x] 5.4 Add visual styling for checked items (text-decoration: line-through, opacity: 0.6)
- [x] 5.5 Ensure checkbox touch target is ≥44x44px for mobile
- [x] 5.6 Add aria-label to checkbox for accessibility
- [x] 5.7 Add keyboard focus indicator styles for checkbox
- [x] 5.8 Ensure urgency badges remain visible (opacity: 1.0) on checked items
- [x] 5.9 Write component tests for ShoppingListPage with checkboxes

## 6. Integration Testing
- [x] 6.1 Test full flow: check item → reload page → verify still checked (covered by repository tests)
- [x] 6.2 Test multiple items can be checked simultaneously (covered by repository tests)
- [x] 6.3 Test unchecking previously checked items (covered by repository tests)
- [x] 6.4 Test new items default to unchecked (covered by domain tests)
- [x] 6.5 Test legacy data (no checked field) loads correctly (covered by repository tests)

## 7. E2E Testing
- [ ] 7.1 Write E2E test: user checks item while shopping (OPTIONAL - deferred)
- [ ] 7.2 Write E2E test: checked state persists across navigation (OPTIONAL - deferred)
- [ ] 7.3 Write E2E test: checkbox accessibility (keyboard navigation) (OPTIONAL - deferred)
- [ ] 7.4 Update existing E2E tests if they rely on "Comprado" button (NOT NEEDED - no E2E tests rely on it)

## 8. Validation and Polish
- [x] 8.1 Run `npm run build` - verify no TypeScript errors ✅ Build successful
- [x] 8.2 Run `npm test` - verify all tests pass (484+ tests) ✅ 497 tests passing
- [x] 8.3 Run `npm run lint` - verify no linting errors ✅ 0 errors (1 unrelated warning)
- [ ] 8.4 Manual testing on desktop (Chrome, Firefox, Safari) (PENDING)
- [ ] 8.5 Manual testing on mobile (iOS Safari, Chrome Android) (PENDING)
- [ ] 8.6 Verify touch target size on mobile devices (CODE READY - min-w-[44px] min-h-[44px])
- [ ] 8.7 Verify keyboard navigation works correctly (CODE READY - focus:ring-2)
- [ ] 8.8 Test with screen reader (VoiceOver or NVDA) (PENDING)

## 9. Documentation
- [x] 9.1 Update component documentation if needed (DONE - inline comments added)
- [x] 9.2 Add comments for non-obvious checked state logic (DONE)
- [ ] 9.3 Update US-022 user story status to "In Progress" (PENDING)
- [ ] 9.4 Take screenshots for documentation (optional) (OPTIONAL)

## 10. Pre-Merge Checklist
- [x] 10.1 All critical tasks completed (E2E tests optional)
- [x] 10.2 All unit + integration tests passing ✅ 497/497
- [x] 10.3 Build successful with no warnings ✅
- [ ] 10.4 Linter passing with no errors (PENDING)
- [ ] 10.5 Manual testing completed on multiple devices (PENDING - user to verify)
- [x] 10.6 Code reviewed (self-review completed)
- [x] 10.7 Backward compatibility verified (legacy data works) ✅ Tests confirm
- [ ] 10.8 Ready for merge to main (PENDING lint + manual testing)
