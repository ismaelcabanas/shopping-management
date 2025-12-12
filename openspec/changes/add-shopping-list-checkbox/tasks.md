# Implementation Tasks

## 1. Domain Layer - Add Checked Field
- [ ] 1.1 Update `ShoppingListItem` entity to include `checked: boolean` field
- [ ] 1.2 Update `ShoppingListItem.createAuto()` factory to initialize checked = false
- [ ] 1.3 Update `ShoppingListItem.createManual()` factory to initialize checked = false
- [ ] 1.4 Add `toggleChecked()` method to return new instance with toggled checked state
- [ ] 1.5 Write unit tests for ShoppingListItem with checked field

## 2. Domain Layer - Repository Interface
- [ ] 2.1 Add `toggleChecked(productId: ProductId): Promise<void>` to ShoppingListRepository interface
- [ ] 2.2 Add `getCheckedItems(): Promise<ShoppingListItem[]>` to ShoppingListRepository interface
- [ ] 2.3 Update interface documentation with new methods

## 3. Infrastructure Layer - LocalStorage Persistence
- [ ] 3.1 Update ShoppingListItemDTO to include `checked?: boolean` field
- [ ] 3.2 Update `toDTO()` mapper to include checked field
- [ ] 3.3 Update `toDomain()` mapper to handle checked field (default to false if missing)
- [ ] 3.4 Implement `toggleChecked()` method in LocalStorageShoppingListRepository
- [ ] 3.5 Implement `getCheckedItems()` method in LocalStorageShoppingListRepository
- [ ] 3.6 Write unit tests for repository with checked field persistence
- [ ] 3.7 Test backward compatibility with legacy data (no checked field)

## 4. Presentation Layer - Hook Updates
- [ ] 4.1 Add `toggleChecked(productId: ProductId): Promise<void>` method to useShoppingList hook
- [ ] 4.2 Add `checkedCount: number` computed property to useShoppingList return value
- [ ] 4.3 Update hook to handle toggle checked errors gracefully
- [ ] 4.4 Write unit tests for useShoppingList with checked functionality

## 5. Presentation Layer - UI Component
- [ ] 5.1 Remove "Comprado" button from ShoppingListPage
- [ ] 5.2 Add checkbox element to each shopping list item (left-aligned)
- [ ] 5.3 Implement checkbox onChange handler calling toggleChecked()
- [ ] 5.4 Add visual styling for checked items (text-decoration: line-through, opacity: 0.6)
- [ ] 5.5 Ensure checkbox touch target is ≥44x44px for mobile
- [ ] 5.6 Add aria-label to checkbox for accessibility
- [ ] 5.7 Add keyboard focus indicator styles for checkbox
- [ ] 5.8 Ensure urgency badges remain visible (opacity: 1.0) on checked items
- [ ] 5.9 Write component tests for ShoppingListPage with checkboxes

## 6. Integration Testing
- [ ] 6.1 Test full flow: check item → reload page → verify still checked
- [ ] 6.2 Test multiple items can be checked simultaneously
- [ ] 6.3 Test unchecking previously checked items
- [ ] 6.4 Test new items default to unchecked
- [ ] 6.5 Test legacy data (no checked field) loads correctly

## 7. E2E Testing
- [ ] 7.1 Write E2E test: user checks item while shopping
- [ ] 7.2 Write E2E test: checked state persists across navigation
- [ ] 7.3 Write E2E test: checkbox accessibility (keyboard navigation)
- [ ] 7.4 Update existing E2E tests if they rely on "Comprado" button

## 8. Validation and Polish
- [ ] 8.1 Run `npm run build` - verify no TypeScript errors
- [ ] 8.2 Run `npm test` - verify all tests pass (484+ tests)
- [ ] 8.3 Run `npm run lint` - verify no linting errors
- [ ] 8.4 Manual testing on desktop (Chrome, Firefox, Safari)
- [ ] 8.5 Manual testing on mobile (iOS Safari, Chrome Android)
- [ ] 8.6 Verify touch target size on mobile devices
- [ ] 8.7 Verify keyboard navigation works correctly
- [ ] 8.8 Test with screen reader (VoiceOver or NVDA)

## 9. Documentation
- [ ] 9.1 Update component documentation if needed
- [ ] 9.2 Add comments for non-obvious checked state logic
- [ ] 9.3 Update US-022 user story status to "In Progress"
- [ ] 9.4 Take screenshots for documentation (optional)

## 10. Pre-Merge Checklist
- [ ] 10.1 All tasks above completed
- [ ] 10.2 All tests passing (unit + integration + E2E)
- [ ] 10.3 Build successful with no warnings
- [ ] 10.4 Linter passing with no errors
- [ ] 10.5 Manual testing completed on multiple devices
- [ ] 10.6 Code reviewed (self-review at minimum)
- [ ] 10.7 Backward compatibility verified (legacy data works)
- [ ] 10.8 Ready for merge to main
