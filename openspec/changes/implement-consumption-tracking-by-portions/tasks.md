# Implementation Tasks

## 1. Domain Model - Portion Entities

- [ ] 1.1 Create PortionConfig value object
  - Create `PortionConfig.ts` in domain/model
  - Properties: productId, portionUnit, typicalPortionSize, portionsPerPackage
  - Add validation logic (positive numbers, valid units)
  - Write unit tests

- [ ] 1.2 Create PortionConsumption entity
  - Create `PortionConsumption.ts` in domain/model
  - Properties: id, productId, portionsConsumed, timestamp, mealContext
  - Add factory method
  - Write unit tests

- [ ] 1.3 Create ConsumptionPattern entity
  - Create `ConsumptionPattern.ts` in domain/model
  - Properties: productId, averagePortionsPerDay, mealFrequency, weeklyTrend
  - Add calculation methods
  - Write unit tests

- [ ] 1.4 Create PredictiveInsight entity
  - Create `PredictiveInsight.ts` in domain/model
  - Properties: productId, estimatedDaysRemaining, predictedRunOutDate, recommendedQuantity
  - Add factory method
  - Write unit tests

## 2. Domain Services - Analytics & Intelligence

- [ ] 2.1 Create ConsumptionAnalytics service
  - Create `ConsumptionAnalytics.ts` in domain/services
  - Method: `calculatePattern(consumptions: PortionConsumption[]): ConsumptionPattern`
  - Method: `getAveragePerDay(consumptions: PortionConsumption[]): number`
  - Method: `getMealFrequency(consumptions: PortionConsumption[]): Record<MealType, number>`
  - Write unit tests with mock data

- [ ] 2.2 Create ConsumptionPredictor service
  - Create `ConsumptionPredictor.ts` in domain/services
  - Method: `predictRunOutDate(currentStock, pattern): Date`
  - Method: `estimateDaysRemaining(currentStock, avgPerDay): number`
  - Method: `recommendPurchaseQuantity(pattern, packageSizes): number`
  - Write unit tests with various scenarios

- [ ] 2.3 Create ShoppingOptimizer service
  - Create `ShoppingOptimizer.ts` in domain/services
  - Method: `calculateOptimalPackageSize(pattern, availableSizes): string`
  - Method: `estimateCostSavings(smallPackage, largePackage): number`
  - Method: `assessWasteRisk(quantity, consumptionRate): 'low' | 'medium' | 'high'`
  - Write unit tests

## 3. Infrastructure Layer

- [ ] 3.1 Create PortionConfigRepository interface
  - Define in domain/repositories/
  - Methods: save, findByProductId, delete, findAll
  - Document interface contract

- [ ] 3.2 Implement LocalStoragePortionConfigRepository
  - Create in infrastructure/repositories/
  - Implement all interface methods
  - Use localStorage key: 'portion_configs'
  - Handle serialization/deserialization
  - Write integration tests

- [ ] 3.3 Create PortionConsumptionRepository interface
  - Define in domain/repositories/
  - Methods: save, findByProductId, findByDateRange, delete, findAll
  - Document interface contract

- [ ] 3.4 Implement LocalStoragePortionConsumptionRepository
  - Create in infrastructure/repositories/
  - Implement all interface methods
  - Use localStorage key: 'portion_consumptions'
  - Handle date range queries efficiently
  - Write integration tests

## 4. Application Layer - Use Cases

- [ ] 4.1 Create ConfigurePortionTracking use case
  - Create `ConfigurePortionTracking.ts` in application/use-cases
  - Input: productId, portionUnit, typicalPortionSize, portionsPerPackage
  - Output: PortionConfig
  - Validate configuration before saving
  - Write unit tests

- [ ] 4.2 Create RecordPortionConsumption use case
  - Create `RecordPortionConsumption.ts`
  - Input: productId, portionsConsumed, mealContext
  - Output: PortionConsumption
  - Update product stock based on portions consumed
  - Trigger analytics recalculation
  - Write unit tests

- [ ] 4.3 Create GetConsumptionAnalytics use case
  - Create `GetConsumptionAnalytics.ts`
  - Input: productId, dateRange (optional)
  - Output: ConsumptionPattern
  - Use ConsumptionAnalytics service
  - Write unit tests

- [ ] 4.4 Create GetPredictiveInsights use case
  - Create `GetPredictiveInsights.ts`
  - Input: productId
  - Output: PredictiveInsight
  - Use ConsumptionPredictor service
  - Write unit tests

- [ ] 4.5 Create OptimizeShoppingList use case
  - Create `OptimizeShoppingList.ts`
  - Input: productIds (optional, all if not provided)
  - Output: OptimizedShoppingList with quantity recommendations
  - Use ShoppingOptimizer service
  - Write unit tests

- [ ] 4.6 Create DisablePortionTracking use case
  - Create `DisablePortionTracking.ts`
  - Input: productId
  - Delete PortionConfig
  - Optionally archive consumption history
  - Write unit tests

## 5. Presentation Layer - Hooks

- [ ] 5.1 Create usePortionTracking hook
  - State: config, isEnabled, loading, error
  - Methods: enableTracking, disableTracking, updateConfig
  - Encapsulate ConfigurePortionTracking use case
  - Error handling
  - Write hook tests

- [ ] 5.2 Create usePortionConsumption hook
  - State: loading, error, lastConsumption
  - Methods: recordConsumption, getRecentConsumptions
  - Encapsulate RecordPortionConsumption use case
  - Error handling
  - Write hook tests

- [ ] 5.3 Create useConsumptionAnalytics hook
  - State: pattern, insights, loading, error
  - Methods: fetchAnalytics, fetchInsights, refreshData
  - Encapsulate analytics use cases
  - Caching strategy
  - Write hook tests

## 6. Presentation Layer - Components

- [ ] 6.1 Create PortionConfigModal component
  - Form for configuring portion tracking
  - Fields: portionUnit (dropdown), typicalPortionSize (number), portionsPerPackage (number)
  - Validation and error messages
  - Props: product, onConfirm, onCancel
  - Write component tests

- [ ] 6.2 Create RecordConsumptionModal component
  - Input field for portions consumed
  - Radio buttons for meal context
  - Show equivalent quantity (e.g., "1.5 portions = 225g")
  - Props: product, portionConfig, onConfirm, onCancel
  - Write component tests

- [ ] 6.3 Create ConsumptionAnalyticsDashboard component
  - Display consumption pattern
  - Show average per day, meal frequency
  - Chart component for trends (optional: use recharts or simple CSS)
  - Predictive insights section
  - Props: productId
  - Write component tests

- [ ] 6.4 Create PredictiveInsightCard component
  - Display days remaining
  - Show predicted run-out date
  - Recommended purchase quantity
  - Visual indicators (color-coded urgency)
  - Props: insight
  - Write component tests

- [ ] 6.5 Create OptimizedShoppingListView component
  - Enhanced shopping list with quantity recommendations
  - Show "Buy 2kg bag" instead of just "Rice"
  - Display cost savings if available
  - Props: optimizedList
  - Write component tests

- [ ] 6.6 Update ProductCard component
  - Add "Enable Portion Tracking" button (if not enabled)
  - Add "Record Consumption" button (if enabled)
  - Add "View Analytics" button (if enabled)
  - Show portion-based stock info when enabled
  - Write updated tests

- [ ] 6.7 Update ProductDetailPage (or create if doesn't exist)
  - Tab view: Overview | Analytics | History
  - Overview: Stock level + portion info
  - Analytics: ConsumptionAnalyticsDashboard
  - History: List of consumption records
  - Write integration tests

## 7. Shopping List Integration

- [ ] 7.1 Enhance shopping list with quantity recommendations
  - If product has portion tracking, show recommended quantity
  - Example: "Arroz - Buy 2kg bag (lasts ~10 days)"
  - Use OptimizeShoppingList use case
  - Write integration tests

- [ ] 7.2 Update ShoppingListItem component
  - Show quantity recommendation when available
  - Show predictive insight (days remaining)
  - Distinguish portion-tracked from level-tracked products
  - Write component tests

- [ ] 7.3 Add "Optimize List" button
  - Recalculate optimal quantities for all products
  - Show before/after comparison
  - Confirm optimization
  - Write integration tests

## 8. Data Migration & Compatibility

- [ ] 8.1 Ensure backward compatibility
  - Products without PortionConfig continue using levels
  - No breaking changes to existing data structures
  - Write compatibility tests

- [ ] 8.2 Handle mixed states
  - Product can have both level and portion tracking
  - Sync stock updates between both systems
  - Test concurrent updates
  - Write integration tests

- [ ] 8.3 Create portion config wizard
  - Guided setup for first-time users
  - Smart defaults based on product type
  - Example configurations
  - Write UI tests

## 9. Testing

- [ ] 9.1 Unit tests for domain entities
  - PortionConfig validation
  - PortionConsumption creation
  - ConsumptionPattern calculations
  - PredictiveInsight logic
  - Target: 100% coverage

- [ ] 9.2 Unit tests for domain services
  - ConsumptionAnalytics calculations
  - ConsumptionPredictor predictions
  - ShoppingOptimizer recommendations
  - Edge cases and error conditions
  - Target: 95%+ coverage

- [ ] 9.3 Unit tests for use cases
  - ConfigurePortionTracking
  - RecordPortionConsumption
  - GetConsumptionAnalytics
  - GetPredictiveInsights
  - OptimizeShoppingList
  - Target: 95%+ coverage

- [ ] 9.4 Integration tests for repositories
  - LocalStoragePortionConfigRepository
  - LocalStoragePortionConsumptionRepository
  - Date range queries
  - Data persistence
  - Target: 90%+ coverage

- [ ] 9.5 Component tests
  - PortionConfigModal
  - RecordConsumptionModal
  - ConsumptionAnalyticsDashboard
  - PredictiveInsightCard
  - OptimizedShoppingListView
  - Target: 90%+ coverage

- [ ] 9.6 E2E test for complete portion flow
  - Navigate to product catalog
  - Enable portion tracking for product
  - Configure portion settings
  - Record consumption multiple times
  - View analytics dashboard
  - Verify predictions
  - Check shopping list recommendations
  - Complete flow test

- [ ] 9.7 E2E test for hybrid usage
  - Some products use levels
  - Some products use portions
  - Verify both work independently
  - Verify shopping list handles both

## 10. Performance Optimization

- [ ] 10.1 Analytics calculation caching
  - Cache ConsumptionPattern per product
  - Invalidate cache on new consumption
  - Lazy recalculation
  - Write tests for caching logic

- [ ] 10.2 Optimize date range queries
  - Index consumption records by date
  - Efficient localStorage queries
  - Pagination for large datasets
  - Write performance tests

- [ ] 10.3 Lazy load analytics dashboard
  - Load only when user opens analytics
  - Background calculation
  - Loading states
  - Write tests

## 11. UI/UX Polish

- [ ] 11.1 Visual design refinement
  - Color scheme for analytics
  - Chart styling (if using charts)
  - Icons for insights
  - Responsive design for all modals
  - Accessibility audit

- [ ] 11.2 User feedback improvements
  - Toast messages for actions
  - Loading states for calculations
  - Error messages with helpful guidance
  - Empty states (no consumption data yet)
  - Success animations

- [ ] 11.3 Onboarding flow
  - Tutorial for first-time portion tracking
  - Example products with pre-filled configs
  - Tooltip hints
  - Help documentation

## 12. Documentation

- [ ] 12.1 Update CLAUDE.md
  - Document portion tracking architecture
  - Add analytics concepts
  - Update domain model documentation
  - Explain hybrid system

- [ ] 12.2 User documentation
  - How to enable portion tracking
  - How to record consumption
  - Understanding analytics
  - Interpreting predictions
  - Add to README if needed

- [ ] 12.3 Technical documentation
  - API documentation for new use cases
  - Component usage examples
  - Analytics algorithm documentation
  - Data model documentation

- [ ] 12.4 Code comments
  - Document complex analytics calculations
  - Explain prediction algorithms
  - Document optimization strategies

## 13. Validation & Deployment

- [ ] 13.1 Full test suite
  - Run all unit tests
  - Run all integration tests
  - Run all E2E tests
  - Verify 90%+ coverage

- [ ] 13.2 Build validation
  - TypeScript compilation
  - ESLint checks
  - No console errors
  - Performance check

- [ ] 13.3 Manual testing
  - Test on different screen sizes
  - Test with various products
  - Test analytics with real data
  - Test edge cases (zero consumption, high consumption)

- [ ] 13.4 Data validation
  - Test with 1 week of data
  - Test with 1 month of data
  - Test with irregular patterns
  - Verify predictions accuracy

- [ ] 13.5 Pre-commit checklist
  - All tests passing
  - Build successful
  - Lint clean
  - Git history clean

## Dependencies

- **Task 2 depends on Task 1** (domain entities needed for services)
- **Task 3 depends on Tasks 1 & 2** (interfaces defined)
- **Task 4 depends on Tasks 1, 2, 3** (all domain + infrastructure ready)
- **Task 5 & 6 depend on Task 4** (use cases ready)
- **Task 7 depends on Tasks 4, 5, 6** (all layers ready)
- **Task 8 runs parallel with implementation**
- **Task 9 runs parallel with implementation**
- **Tasks 10, 11, 12, 13 are sequential at the end**

## Parallelizable Work

- Tasks 1.1, 1.2, 1.3, 1.4 can be done in any order (domain entities)
- Tasks 2.1, 2.2, 2.3 can be done in any order (domain services)
- Tasks 3.1 & 3.3 can be done simultaneously (interface definitions)
- Tasks 3.2 & 3.4 can be done in parallel (repository implementations)
- Tasks 4.1-4.6 can be done independently (use cases)
- Tasks 5.1, 5.2, 5.3 can be done independently (hooks)
- Tasks 6.1-6.7 can be done independently (components)
- Unit tests (9.1-9.5) can be written alongside implementation

## Estimated Timeline

- **Phase 1** (Domain Entities): 3 hours
- **Phase 2** (Domain Services): 4 hours
- **Phase 3** (Infrastructure): 2 hours
- **Phase 4** (Use Cases): 3 hours
- **Phase 5** (Hooks): 2 hours
- **Phase 6** (Components): 5 hours
- **Phase 7** (Shopping List): 2 hours
- **Phase 8** (Compatibility): 1 hour
- **Phase 9** (Testing): 4 hours
- **Phase 10** (Performance): 1 hour
- **Phase 11** (Polish): 1 hour
- **Phase 12** (Documentation): 1 hour
- **Phase 13** (Validation): 1 hour

**Total**: ~25 hours (3 days)

## Notes

- **Prerequisite**: `implement-consumption-tracking-by-levels` must be completed first
- Follow TDD: Write tests before implementation
- Use baby steps: Small, incremental commits
- Keep PRs focused: One phase at a time
- Test after each phase
- Validate predictions with real usage data after implementation
