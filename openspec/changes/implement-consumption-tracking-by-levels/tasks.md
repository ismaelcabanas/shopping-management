# Implementation Tasks

## 1. Domain Model & Business Logic

- [x] 1.1 Define StockLevel type
  - Create `StockLevel.ts` value object
  - Define 4 levels: 'high', 'medium', 'low', 'empty'
  - Add validation logic
  - Write unit tests (8 tests passing ✅)

- [x] 1.2 Extend InventoryItem
  - Add `stockLevel` property
  - Add `lastUpdated` property
  - Update constructor
  - Write unit tests for new properties (12 tests passing ✅)

- [x] 1.3 Create StockLevelCalculator service
  - Implement business logic for level decisions
  - Method: `shouldAddToShoppingList(level: StockLevel): boolean`
  - Method: `getLevelColor(level: StockLevel): string`
  - Method: `getLevelPercentage(level: StockLevel): number`
  - Write unit tests (6 tests passing ✅)

**Note:** ConsumptionRecord entity and history tracking removed from scope (simplified implementation)

## 2. Application Layer (Use Cases)

- [x] 2.1 Create UpdateStockLevel use case
  - Create `UpdateStockLevel.ts` in application/use-cases
  - Input: productId, newStockLevel
  - Output: updated InventoryItem
  - Business logic: update level and lastUpdated timestamp
  - Write unit tests (9 tests passing ✅)

- [x] 2.2 Create GetProductsNeedingRestock use case
  - Create `GetProductsNeedingRestock.ts`
  - Logic: filter products with 'low' or 'empty' level
  - Return list of products for shopping list
  - Write unit tests (7 tests passing ✅)

## 3. Infrastructure Layer

- [x] 3.1 Update LocalStorageInventoryRepository
  - Add support for stockLevel and lastUpdated fields
  - Migrate existing data (add default 'high' level)
  - Handle backward compatibility
  - Existing tests updated and passing ✅

## 4. Presentation Layer - Components

- [x] 4.1 Create StockLevelIndicator component
  - Visual progress bar with 4 levels
  - Color-coded: green (high), yellow (medium), red (low), gray (empty)
  - Props: level, size (small/medium/large), showLabel
  - Accessible (ARIA labels)
  - Write component tests (10 tests passing ✅)

- [x] 4.2 Create UpdateStockModal component
  - Modal dialog with 4 radio buttons
  - Props: product, currentLevel, onConfirm, onCancel
  - Show current level with indicator
  - Confirm/Cancel buttons
  - Write component tests (11 tests passing ✅)

- [x] 4.3 Update ProductListItem component
  - Add StockLevelIndicator below product name
  - Add "Update Stock" button (TrendingDown icon)
  - Handle click to trigger onUpdateStockLevel callback
  - Updated layout with flex-col for proper spacing

- [x] 4.4 Update ProductCatalogPage
  - Integrate UpdateStockModal
  - Handle stock level updates with useStockLevel hook
  - Show success/error toast notifications
  - Auto-refresh list after updates
  - All user flows working ✅

## 5. Presentation Layer - Hooks

- [x] 5.1 Create useStockLevel hook
  - State: loading, error
  - Methods: updateStockLevel, getProductsNeedingRestock
  - Encapsulate use case invocation
  - Error handling with mounted ref
  - Write hook tests (4 tests passing ✅)

## 6. Shopping List Integration

- [x] 6.1 Update shopping list logic
  - Created ShoppingListItem domain model (6 tests passing ✅)
  - Created ShoppingListRepository interface
  - Created LocalStorageShoppingListRepository (10 tests passing ✅)
  - Modified UpdateStockLevel use case to auto-manage shopping list (10 tests passing ✅)
  - Updated useStockLevel hook to include shopping list repository (4 tests passing ✅)
  - Automatically adds products with 'low' or 'empty' levels
  - Automatically removes products when level returns to 'high' or 'medium'
  - All 472 tests passing ✅
  - Build successful ✅

- [x] 6.2 Update ShoppingList UI component
  - Created useShoppingList hook (5 tests passing ✅)
  - Created ShoppingListPage component (7 tests passing ✅)
  - Implemented Opción A (simple & practical):
    - Stock level badges: "Stock bajo" (yellow), "Sin stock" (red)
    - "Comprado" button to remove items
    - Empty state with helpful message
    - Auto-added products labeled
    - Loading and error states
  - All 484 tests passing ✅
  - Build successful ✅

## 7. Initial Data Migration

- [x] 7.1 Backward compatibility (no migration needed)
  - LocalStorageInventoryRepository handles old data format
  - Defaults to 'high' if stockLevel missing (line 75)
  - Defaults to current date if lastUpdated missing (line 76)
  - Existing tests verify compatibility ✅

**Note:** No explicit migration script needed since we use LocalStorage (flexible JSON format)

## 8. Testing

- [ ] 8.1 Unit tests for domain
  - StockLevel value object
  - StockLevelCalculator service
  - Target: 100% coverage

- [ ] 8.2 Unit tests for use cases
  - UpdateStockLevel
  - GetProductsNeedingRestock
  - Target: 95%+ coverage

- [ ] 8.3 Component tests
  - StockLevelIndicator
  - UpdateStockModal
  - ProductCard updates
  - Target: 90%+ coverage

- [ ] 8.4 Integration tests
  - useStockLevel hook
  - Shopping list integration
  - Repository implementations
  - Target: 85%+ coverage

- [ ] 8.5 E2E test for consumption flow
  - Navigate to product catalog
  - Click product to update stock
  - Select new level (e.g., 'bajo')
  - Verify level updated
  - Verify product appears in shopping list
  - Complete flow test

## 9. UI/UX Polish

- [ ] 9.1 Visual design refinement
  - Color scheme for levels
  - Icon selection for levels
  - Responsive design for modal
  - Accessibility audit

- [ ] 9.2 User feedback improvements
  - Toast messages for updates
  - Loading states
  - Error messages
  - Empty states

- [ ] 9.3 Performance optimization
  - Lazy load modal
  - Optimize re-renders
  - Debounce updates if needed

## 10. Documentation

- [ ] 10.1 Update CLAUDE.md
  - Document new domain concepts
  - Add consumption tracking to architecture
  - Update conventions if needed

- [ ] 10.2 User documentation
  - How to update stock levels
  - Explanation of 4 levels
  - Shopping list integration
  - Add to README if needed

- [ ] 10.3 Technical documentation
  - API documentation for use cases
  - Component usage examples
  - Data model documentation

## 11. Validation & Deployment

- [ ] 11.1 Full test suite
  - Run all unit tests
  - Run all integration tests
  - Run all E2E tests
  - Verify 90%+ coverage

- [ ] 11.2 Build validation
  - TypeScript compilation
  - ESLint checks
  - No console errors
  - Performance check

- [ ] 11.3 Manual testing
  - Test on different screen sizes
  - Test with various products
  - Test shopping list integration
  - Test edge cases (empty states, errors)

- [ ] 11.4 Pre-commit checklist
  - All tests passing
  - Build successful
  - Lint clean
  - Git history clean

## Dependencies

- Task 2 depends on Task 1 (domain model needed for use cases)
- Task 3 depends on Tasks 1 & 2 (interfaces defined)
- Task 4 & 5 depend on Task 2 (use cases ready)
- Task 6 depends on Tasks 2, 4, 5 (all layers ready)
- Task 8 runs parallel with implementation
- Tasks 9, 10, 11 are sequential at the end

## Parallelizable Work

- Tasks 1.1, 1.2, 1.3, 1.4 can be done in any order (domain entities)
- Tasks 4.1, 4.2 can be done independently (components)
- Tasks 5.1, 5.2 can be done independently (hooks)
- Unit tests (8.1, 8.2) can be written alongside implementation

## Estimated Timeline

- **Phase 1** (Domain): 2 hours
- **Phase 2** (Use Cases): 2 hours
- **Phase 3** (Infrastructure): 1 hour
- **Phase 4** (Components): 3 hours
- **Phase 5** (Hooks): 1 hour
- **Phase 6** (Shopping List): 1 hour
- **Phase 7** (Migration): 30 minutes
- **Phase 8** (Testing): 3 hours
- **Phase 9** (Polish): 1 hour
- **Phase 10** (Documentation): 1 hour
- **Phase 11** (Validation): 30 minutes

**Total**: ~16 hours (2 days)

## Notes

- Follow TDD: Write tests before implementation
- Use baby steps: Small, incremental commits
- Keep PRs focused: One phase at a time
- Test after each phase
