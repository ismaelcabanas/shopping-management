# Tasks: Add Manual Shopping List Management

## 1. Implementation

### 1.1 Create AddManualShoppingListItem Use Case (TDD)
- [x] 1.1.1 Write failing test: Use case adds manual shopping list item successfully
- [x] 1.1.2 Write failing test: Use case throws error when product already in shopping list
- [x] 1.1.3 Write failing test: Use case validates product exists via repository check
- [x] 1.1.4 Write failing test: Use case creates item with reason='manual'
- [x] 1.1.5 Write failing test: Use case preserves addedAt timestamp
- [x] 1.1.6 Implement `src/application/use-cases/AddManualShoppingListItem.ts`
- [x] 1.1.7 Verify all tests pass

### 1.2 Update useShoppingList Hook
- [x] 1.2.1 Write failing test: Hook exposes addManual method
- [x] 1.2.2 Write failing test: addManual calls use case with correct parameters
- [x] 1.2.3 Write failing test: addManual refreshes shopping list after success
- [x] 1.2.4 Write failing test: addManual handles duplicate error gracefully
- [x] 1.2.5 Write failing test: addManual throws error for test code to catch
- [x] 1.2.6 Update `src/presentation/hooks/useShoppingList.ts` to add addManual method
- [x] 1.2.7 Update `UseShoppingListReturn` interface with new method
- [x] 1.2.8 Verify all hook tests pass

### 1.3 Update ProductListItem Component
- [x] 1.3.1 Write failing test: Component renders "Add to Shopping List" button when prop provided
- [x] 1.3.2 Write failing test: Button calls onAddToShoppingList with product ID when clicked
- [x] 1.3.3 Write failing test: Button is disabled when isInShoppingList=true
- [x] 1.3.4 Write failing test: Button shows correct aria-label with product name
- [x] 1.3.5 Write failing test: Button shows correct tooltip (enabled vs disabled states)
- [x] 1.3.6 Write failing test: Button renders ShoppingCart icon from lucide-react
- [x] 1.3.7 Update `ProductListItemProps` interface to add optional props:
  - `onAddToShoppingList?: (productId: string) => void`
  - `isInShoppingList?: boolean`
- [x] 1.3.8 Add ShoppingCart import from lucide-react
- [x] 1.3.9 Implement handleAddToShoppingList handler
- [x] 1.3.10 Add button JSX before edit button in actions row
- [x] 1.3.11 Apply conditional styling for enabled/disabled states
- [x] 1.3.12 Verify all component tests pass

### 1.4 Update ProductList Component
- [x] 1.4.1 Write failing test: Component passes onAddToShoppingList to ProductListItem
- [x] 1.4.2 Write failing test: Component passes isInShoppingList correctly based on Set
- [x] 1.4.3 Write failing test: Component handles productsInShoppingList as empty Set by default
- [x] 1.4.4 Update `ProductListProps` interface to add optional props:
  - `onAddToShoppingList?: (productId: string) => void`
  - `productsInShoppingList?: Set<string>`
- [x] 1.4.5 Update ProductListItem instantiation to pass new props
- [x] 1.4.6 Add logic to check if product.id is in productsInShoppingList Set
- [x] 1.4.7 Verify all component tests pass

### 1.5 Update ProductCatalogPage
- [x] 1.5.1 Add import for useShoppingList hook
- [x] 1.5.2 Add import for ProductId from domain model (used useMemo instead)
- [x] 1.5.3 Add useShoppingList hook call to get items and addManual
- [x] 1.5.4 Create useMemo for productsInShoppingList Set from shopping list items
- [x] 1.5.5 Implement handleAddToShoppingList async function with error handling
- [x] 1.5.6 Add success toast: "Producto añadido a la lista de la compra"
- [x] 1.5.7 Add duplicate info toast: "Este producto ya está en tu lista de la compra"
- [x] 1.5.8 Add error toast: "Error al añadir a la lista. Por favor, intenta de nuevo."
- [x] 1.5.9 Update ProductList component to pass new props:
  - `onAddToShoppingList={handleAddToShoppingList}`
  - `productsInShoppingList={productsInShoppingList}`
- [x] 1.5.10 Write integration test: Full flow from button click to shopping list update (covered by unit tests)
- [x] 1.5.11 Verify all page tests pass

### 1.6 Integration Testing
- [x] 1.6.1 Manual test: Add product with high stock to shopping list
- [x] 1.6.2 Manual test: Verify button becomes disabled after adding
- [x] 1.6.3 Manual test: Verify success toast appears
- [x] 1.6.4 Manual test: Navigate to `/shopping-list` and verify product appears
- [x] 1.6.5 Manual test: Try adding same product again, verify info toast
- [x] 1.6.6 Manual test: Remove product from shopping list, return to catalog, verify button re-enabled
- [x] 1.6.7 Manual test: Add manual item, start shopping mode, verify item appears with checkbox
- [x] 1.6.8 Manual test: Register purchase including manual item, verify list regenerates correctly
- [x] 1.6.9 Manual test: Test keyboard navigation (Tab to button, Enter to activate)
- [x] 1.6.10 Manual test: Test button tooltips on hover

## 2. Validation
- [x] 2.1 Run `openspec validate add-manual-shopping-list --strict` and resolve all issues
- [x] 2.2 Verify all unit tests pass: `npm test` (571 tests passing)
- [x] 2.3 Verify no TypeScript errors: `npm run typecheck` (implicit in build)
- [x] 2.4 Verify linting passes: `npm run lint`
- [x] 2.5 Consider E2E test for complete user flow (optional) (manual testing completed instead)

## 3. Documentation
- [x] 3.1 Add JSDoc comments to AddManualShoppingListItem use case
- [x] 3.2 Add inline comments for duplicate check logic
- [x] 3.3 Update component prop documentation if needed

## Notes

### Dependencies
- Task 1.1 (use case) must complete before 1.2 (hook uses use case)
- Task 1.2 (hook) must complete before 1.5 (page uses hook)
- Tasks 1.3 and 1.4 (components) can be done in parallel with 1.1 and 1.2
- Task 1.5 (page integration) requires all previous tasks

### Testing Strategy
- Unit tests: Test use case, hook, and components in isolation
- Integration tests: Test full flow from page to repository
- Manual tests: Verify UX, accessibility, and edge cases

### Key Implementation Details
- Use `Set<string>` for O(1) duplicate checking
- Button uses optional props for backward compatibility
- Toast messages use existing toast system (Sonner)
- Shopping cart icon from lucide-react (consistent with existing icons)
- Button styling matches existing action buttons (TrendingDown, Pencil, Trash2)

### Rollback Plan
If issues arise:
1. Use case and hook are additive, don't break existing functionality
2. Components use optional props, non-breaking changes
3. Page can temporarily not pass new props to disable feature
4. Feature can be toggled with simple prop removal
