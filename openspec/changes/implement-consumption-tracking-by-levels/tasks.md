# Implementation Tasks

## 1. Domain Model & Business Logic

- [ ] 1.1 Define StockLevel type
  - Create `StockLevel.ts` value object
  - Define 4 levels: 'alto', 'medio', 'bajo', 'vacio'
  - Add validation logic
  - Write unit tests

- [ ] 1.2 Create ConsumptionRecord entity
  - Create `ConsumptionRecord.ts` in domain/model
  - Properties: id, productId, previousLevel, newLevel, timestamp
  - Add factory method
  - Write unit tests

- [ ] 1.3 Extend InventoryItem
  - Add `stockLevel` property
  - Add `lastUpdated` property
  - Update constructor
  - Write unit tests for new properties

- [ ] 1.4 Create StockLevelCalculator service
  - Implement business logic for level decisions
  - Method: `shouldAddToShoppingList(level: StockLevel): boolean`
  - Method: `getLevelColor(level: StockLevel): string`
  - Method: `getLevelPercentage(level: StockLevel): number`
  - Write unit tests

## 2. Application Layer (Use Cases)

- [ ] 2.1 Create UpdateStockLevel use case
  - Create `UpdateStockLevel.ts` in application/use-cases
  - Input: productId, newStockLevel
  - Output: updated InventoryItem
  - Business logic: update level, record history
  - Write unit tests

- [ ] 2.2 Create GetProductsNeedingRestock use case
  - Create `GetProductsNeedingRestock.ts`
  - Logic: filter products with 'bajo' or 'vacio' level
  - Return list of products for shopping list
  - Write unit tests

- [ ] 2.3 Create GetConsumptionHistory use case
  - Create `GetConsumptionHistory.ts`
  - Input: productId (optional), dateRange (optional)
  - Return list of ConsumptionRecords
  - Write unit tests

## 3. Infrastructure Layer

- [ ] 3.1 Create ConsumptionRepository interface
  - Define in domain/repositories/
  - Methods: save, findByProductId, findAll, delete
  - Document interface contract

- [ ] 3.2 Implement LocalStorageConsumptionRepository
  - Create in infrastructure/repositories/
  - Implement all interface methods
  - Use localStorage key: 'consumption_records'
  - Handle serialization/deserialization
  - Write integration tests

- [ ] 3.3 Update LocalStorageInventoryRepository
  - Add support for stockLevel field
  - Migrate existing data (add default 'alto' level)
  - Handle backward compatibility
  - Write migration tests

## 4. Presentation Layer - Components

- [ ] 4.1 Create StockLevelIndicator component
  - Visual progress bar with 4 levels
  - Color-coded: green (alto), yellow (medio), red (bajo), gray (vacio)
  - Props: level, size (small/medium/large)
  - Accessible (ARIA labels)
  - Write component tests

- [ ] 4.2 Create UpdateStockModal component
  - Modal dialog with 4 radio buttons
  - Props: product, currentLevel, onConfirm, onCancel
  - Show current level
  - Confirm button
  - Write component tests

- [ ] 4.3 Update ProductCard component
  - Add StockLevelIndicator
  - Add "Actualizar Stock" button
  - Handle click to open UpdateStockModal
  - Write updated tests

- [ ] 4.4 Update ProductCatalogPage
  - Integrate UpdateStockModal
  - Handle stock level updates
  - Show success toast after update
  - Handle "needs restock" badge/indicator
  - Write integration tests

## 5. Presentation Layer - Hooks

- [ ] 5.1 Create useConsumption hook
  - State: loading, error
  - Methods: updateStockLevel, getProductsNeedingRestock
  - Encapsulate use case invocation
  - Error handling
  - Write hook tests

- [ ] 5.2 Create useConsumptionHistory hook
  - State: history, loading, error
  - Methods: fetchHistory, filterByProduct, filterByDateRange
  - Encapsulate GetConsumptionHistory use case
  - Write hook tests

## 6. Shopping List Integration

- [ ] 6.1 Update shopping list logic
  - Automatically add products with 'bajo' or 'vacio' levels
  - Remove products when level returns to 'alto' or 'medio'
  - Show reason: "Stock bajo" badge
  - Write integration tests

- [ ] 6.2 Create ShoppingListItem component update
  - Show why product is on list (manual vs auto)
  - Distinguish manual additions from auto-flagged
  - Write component tests

## 7. Initial Data Migration

- [ ] 7.1 Create migration script
  - Add stockLevel='alto' to existing inventory items
  - Add lastUpdated=now to existing items
  - Test migration with sample data

- [ ] 7.2 Handle backward compatibility
  - Default to 'alto' if stockLevel missing
  - Graceful handling of old data format
  - Write compatibility tests

## 8. Testing

- [ ] 8.1 Unit tests for domain
  - StockLevel value object
  - ConsumptionRecord entity
  - StockLevelCalculator service
  - Target: 100% coverage

- [ ] 8.2 Unit tests for use cases
  - UpdateStockLevel
  - GetProductsNeedingRestock
  - GetConsumptionHistory
  - Target: 95%+ coverage

- [ ] 8.3 Component tests
  - StockLevelIndicator
  - UpdateStockModal
  - ProductCard updates
  - Target: 90%+ coverage

- [ ] 8.4 Integration tests
  - useConsumption hook
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
