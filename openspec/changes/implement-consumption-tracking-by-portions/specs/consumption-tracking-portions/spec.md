# consumption-tracking-portions Specification Delta

## ADDED Requirements

### Requirement: Portion Configuration Management
The system SHALL allow users to configure portion-based tracking for individual products, defining portion units, typical portion sizes, and portions per package.

#### Scenario: User enables portion tracking for a product
- **GIVEN** a product exists in the inventory
- **AND** portion tracking is not yet enabled for this product
- **WHEN** the user configures portion tracking
- **THEN** the system SHALL prompt for portionUnit (grams, units, ml)
- **AND** the system SHALL prompt for typicalPortionSize (positive number)
- **AND** the system SHALL prompt for portionsPerPackage (positive number)
- **AND** the system SHALL validate all inputs are positive numbers
- **AND** the system SHALL save the PortionConfig
- **AND** the system SHALL enable portion tracking for the product

#### Scenario: User updates portion configuration
- **GIVEN** a product has portion tracking enabled
- **WHEN** the user updates portion configuration
- **THEN** the system SHALL allow changing any configuration value
- **AND** the system SHALL preserve historical consumption records
- **AND** the system SHALL recalculate analytics with new configuration

#### Scenario: User disables portion tracking
- **GIVEN** a product has portion tracking enabled
- **WHEN** the user disables portion tracking
- **THEN** the system SHALL remove the PortionConfig
- **AND** the system SHALL optionally archive consumption history
- **AND** the system SHALL revert to levels-based tracking

### Requirement: Portion Consumption Recording
Users SHALL be able to record consumption in quantitative portions after meals, with optional meal context.

#### Scenario: User records consumption after a meal
- **GIVEN** a product has portion tracking enabled
- **AND** the PortionConfig defines portionUnit and typicalPortionSize
- **WHEN** the user records consumption of 1.5 portions
- **THEN** the system SHALL create a PortionConsumption record
- **AND** the record SHALL include productId, portionsConsumed (1.5), timestamp
- **AND** the record SHALL optionally include mealContext (breakfast/lunch/dinner/snack)
- **AND** the system SHALL calculate consumed quantity (1.5 × typicalPortionSize)
- **AND** the system SHALL update product current stock
- **AND** the system SHALL trigger analytics recalculation

#### Scenario: System validates consumption input
- **GIVEN** a user is recording consumption
- **WHEN** the user enters portions consumed
- **THEN** the system SHALL validate portions is a positive number
- **AND** the system SHALL validate portions is within reasonable range (0.1 to 10)
- **AND** the system SHALL show equivalent quantity (e.g., "1.5 portions = 225g")
- **AND** the system SHALL prevent negative or zero values

#### Scenario: User can undo last consumption entry
- **GIVEN** a user just recorded consumption
- **WHEN** the user realizes it was incorrect
- **THEN** the system SHALL provide "Undo Last Entry" action
- **AND** the system SHALL restore previous stock level
- **AND** the system SHALL delete the erroneous PortionConsumption record
- **AND** the system SHALL recalculate analytics

### Requirement: Consumption Pattern Analytics
The system SHALL analyze consumption history to identify patterns, averages, and trends.

#### Scenario: System calculates consumption pattern for a product
- **GIVEN** a product has multiple PortionConsumption records over time
- **WHEN** analytics are requested
- **THEN** the system SHALL calculate averagePortionsPerDay
- **AND** the system SHALL calculate averagePortionsPerMeal
- **AND** the system SHALL calculate mealFrequency (breakfast, lunch, dinner, snack percentages)
- **AND** the system SHALL calculate weeklyTrend (consumption by day of week)
- **AND** the system SHALL create a ConsumptionPattern entity

#### Scenario: Analytics handle insufficient data
- **GIVEN** a product has fewer than 7 days of consumption data
- **WHEN** analytics are requested
- **THEN** the system SHALL calculate what it can with available data
- **AND** the system SHALL indicate low confidence due to insufficient data
- **AND** the system SHALL suggest recording more consumption to improve accuracy

#### Scenario: Analytics update incrementally
- **GIVEN** a product has existing ConsumptionPattern
- **WHEN** a new PortionConsumption is recorded
- **THEN** the system SHALL update the pattern incrementally
- **AND** the system SHALL not recalculate from scratch (performance)
- **AND** the system SHALL maintain a rolling 30-day window

### Requirement: Predictive Insights Generation
The system SHALL generate predictions about when products will run out and recommend optimal purchase quantities.

#### Scenario: System predicts run-out date
- **GIVEN** a product has current stock and ConsumptionPattern
- **WHEN** predictive insights are requested
- **THEN** the system SHALL calculate estimatedDaysRemaining
- **AND** estimatedDaysRemaining SHALL equal (currentStock / averagePerDay)
- **AND** the system SHALL calculate predictedRunOutDate
- **AND** predictedRunOutDate SHALL equal (today + estimatedDaysRemaining)
- **AND** predictions SHALL have ±2 day accuracy margin

#### Scenario: System recommends purchase quantity
- **GIVEN** a product has ConsumptionPattern
- **AND** available package sizes are known
- **WHEN** purchase recommendations are requested
- **THEN** the system SHALL recommend optimal package size
- **AND** recommendation SHALL balance longevity vs waste risk
- **AND** recommendation SHALL prefer packages that last 7-14 days
- **AND** the system SHALL explain recommendation rationale

#### Scenario: System assesses waste risk
- **GIVEN** a recommended purchase quantity
- **AND** average consumption rate
- **WHEN** waste risk is assessed
- **THEN** the system SHALL calculate product longevity
- **AND** longevity < 7 days SHALL result in "low" waste risk
- **AND** longevity 7-21 days SHALL result in "medium" waste risk
- **AND** longevity > 21 days SHALL result in "high" waste risk
- **AND** high risk SHALL trigger warning to user

### Requirement: Shopping List Optimization
The system SHALL enhance shopping list with quantity recommendations based on consumption analytics.

#### Scenario: Optimized shopping list includes quantity recommendations
- **GIVEN** multiple products need restocking
- **AND** some products have portion tracking enabled
- **WHEN** shopping list is generated
- **THEN** portion-tracked products SHALL show recommended quantity
- **AND** recommendation format SHALL be "Product Name - Buy Xkg/units (lasts ~Y days)"
- **AND** level-tracked products SHALL show basic restock indicator
- **AND** the list SHALL be sorted by urgency (days remaining)

#### Scenario: User can optimize entire shopping list
- **GIVEN** a shopping list with multiple products
- **WHEN** user clicks "Optimize List" button
- **THEN** the system SHALL recalculate optimal quantities for all portion-tracked products
- **AND** the system SHALL show before/after comparison
- **AND** the system SHALL show total estimated cost (if prices available)
- **AND** the system SHALL allow user to accept or reject optimization

#### Scenario: System suggests cost savings
- **GIVEN** a product has multiple available package sizes
- **AND** pricing information is available for each size
- **WHEN** recommendations are generated
- **THEN** the system SHALL calculate cost per portion for each size
- **AND** the system SHALL recommend most cost-effective size within reasonable longevity
- **AND** the system SHALL display estimated savings (e.g., "Save €2 by buying 2kg")

### Requirement: Hybrid System Coexistence
Products SHALL be able to use either levels-based or portions-based tracking, and both systems SHALL coexist without conflicts.

#### Scenario: Product switches from levels to portions
- **GIVEN** a product is using levels-based tracking
- **WHEN** user enables portion tracking
- **THEN** the system SHALL preserve current stock level
- **AND** the system SHALL continue showing stock level indicator
- **AND** the system SHALL add portion tracking capabilities
- **AND** both systems SHALL update stock consistently

#### Scenario: Product uses both levels and portions
- **GIVEN** a product has both levels and portion tracking
- **WHEN** consumption is recorded via portions
- **THEN** the system SHALL update portions-based stock
- **AND** the system SHALL recalculate corresponding stock level
- **AND** stock level SHALL be (currentStock / totalCapacity) × 100
- **AND** both views SHALL remain synchronized

#### Scenario: Shopping list handles mixed tracking methods
- **GIVEN** some products use levels, some use portions
- **WHEN** shopping list is generated
- **THEN** level-tracked products SHALL show "Producto - Stock Bajo"
- **AND** portion-tracked products SHALL show "Producto - Buy Xkg (lasts Yd)"
- **AND** the list SHALL clearly distinguish tracking methods
- **AND** both SHALL trigger automatic list inclusion correctly

### Requirement: Analytics Dashboard Visualization
The system SHALL provide a visual dashboard displaying consumption analytics, patterns, and insights for portion-tracked products.

#### Scenario: User views analytics dashboard for a product
- **GIVEN** a product has portion tracking enabled
- **AND** sufficient consumption data exists (7+ days)
- **WHEN** user opens analytics dashboard
- **THEN** the system SHALL display total consumption (last 30 days)
- **AND** the system SHALL display average consumption per day
- **AND** the system SHALL display most common meal (breakfast/lunch/dinner/snack)
- **AND** the system SHALL display typical portion size
- **AND** the system SHALL optionally display consumption trend chart

#### Scenario: Dashboard shows predictive insights
- **GIVEN** analytics dashboard is open
- **WHEN** predictive insights are available
- **THEN** the dashboard SHALL display days remaining
- **AND** the dashboard SHALL display predicted run-out date
- **AND** the dashboard SHALL display recommended purchase quantity
- **AND** the dashboard SHALL display cost optimization suggestions (if applicable)

#### Scenario: Dashboard handles empty state
- **GIVEN** a product has portion tracking enabled
- **AND** no consumption has been recorded yet
- **WHEN** user opens analytics dashboard
- **THEN** the system SHALL show empty state message
- **AND** the system SHALL prompt user to record first consumption
- **AND** the system SHALL explain benefits of recording consumption

## MODIFIED Requirements

### Requirement: InventoryItem Data Model (Extended for Portions)
InventoryItem SHALL be extended to support optional portion-based tracking information.

**Previous Behavior**: InventoryItem had stockLevel and lastUpdated for levels-based tracking.

**New Behavior**: InventoryItem can optionally include portion-based tracking data if PortionConfig exists.

#### Scenario: InventoryItem with portion tracking
- **GIVEN** a product has portion tracking enabled
- **WHEN** InventoryItem is retrieved
- **THEN** it SHALL include all level-based fields (stockLevel, lastUpdated)
- **AND** it MAY include portionConfig reference
- **AND** it MAY include currentStockInPortions (calculated field)
- **AND** both representations SHALL be consistent

```typescript
interface InventoryItem {
  productId: string
  currentQuantity: number
  minimumStock: number
  unitType: string
  // From levels iteration:
  stockLevel: 'alto' | 'medio' | 'bajo' | 'vacio'
  lastUpdated: Date
  // NEW - Optional portion tracking:
  portionConfig?: PortionConfig
  currentStockInPortions?: number  // Calculated: currentQuantity / typicalPortionSize
}
```

### Requirement: Shopping List Generation (Enhanced with Quantities)
Shopping list generation SHALL include recommended quantities for portion-tracked products.

**Previous Behavior**: Shopping list included products when stock level was "Bajo" or "Vacío".

**New Behavior**: Shopping list includes products with specific quantity recommendations when portion tracking is enabled.

#### Scenario: Shopping list with mixed tracking types
- **GIVEN** products use both levels and portions
- **WHEN** shopping list is generated
- **THEN** level-tracked products SHALL appear when stockLevel is 'bajo' or 'vacio'
- **AND** portion-tracked products SHALL appear when estimatedDaysRemaining < 3
- **AND** portion-tracked items SHALL include recommendedPurchaseQuantity
- **AND** the list SHALL be sorted by urgency

```typescript
interface ShoppingListItem {
  productId: string
  productName: string
  // Existing:
  reason: 'manual' | 'stock_bajo' | 'stock_vacio'
  // NEW:
  trackingMethod: 'levels' | 'portions'
  recommendedQuantity?: string  // e.g., "2kg bag"
  estimatedDaysRemaining?: number
}
```

## REMOVED Requirements

None. This change extends existing functionality without removing requirements.

## Data Model

### New Entities

```typescript
// PortionConfig (Value Object)
interface PortionConfig {
  productId: string
  portionUnit: 'grams' | 'units' | 'ml'
  typicalPortionSize: number      // e.g., 150 for 150g rice
  portionsPerPackage: number       // e.g., 10 portions in 1.5kg
}

// PortionConsumption (Entity)
interface PortionConsumption {
  id: string
  productId: string
  portionsConsumed: number         // e.g., 1.5
  timestamp: Date
  mealContext?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}

// ConsumptionPattern (Entity)
interface ConsumptionPattern {
  productId: string
  averagePortionsPerDay: number
  averagePortionsPerMeal: number
  mealFrequency: {
    breakfast: number
    lunch: number
    dinner: number
    snack: number
  }
  weeklyTrend: number[]            // 7 values for each day of week
  lastCalculated: Date
}

// PredictiveInsight (Entity)
interface PredictiveInsight {
  productId: string
  estimatedDaysRemaining: number
  predictedRunOutDate: Date
  recommendedPurchaseQuantity: number
  optimalPackageSize?: string      // e.g., "2kg bag"
  estimatedCostSavings?: number    // If pricing available
}
```

## Implementation Notes

### Analytics Calculation Strategy

**Pattern Calculation**:
```typescript
// Rolling 30-day window
const last30Days = consumptions.filter(c =>
  c.timestamp >= subtractDays(now, 30)
)

// Average per day
const totalPortions = sum(last30Days.map(c => c.portionsConsumed))
const daysCovered = uniqueDays(last30Days).length
const avgPerDay = totalPortions / daysCovered
```

**Prediction Strategy**:
```typescript
// Run-out prediction
const daysRemaining = currentStock / (avgPerDay * typicalPortionSize)
const runOutDate = addDays(now, daysRemaining)
```

**Optimization Strategy**:
```typescript
// Optimal package size (target 7-14 days longevity)
const targetQuantity = avgPerDay * typicalPortionSize * 10  // 10 days
const optimalPackage = findClosestPackageSize(targetQuantity, availableSizes)
```

### Storage Strategy

**LocalStorage Keys**:
- `portion_configs` - Map of productId → PortionConfig
- `portion_consumptions` - Array of PortionConsumption (indexed by productId)
- `consumption_patterns` - Map of productId → ConsumptionPattern (cached)

**Data Size Estimation**:
- PortionConfig: ~100 bytes/product
- PortionConsumption: ~150 bytes/record
- 30 days × 3 meals = ~90 records/product/month = ~13.5KB/product/month

For 50 products with portion tracking, total storage ≈ 700KB/month (well within LocalStorage limits).

### Performance Considerations

- **Cache analytics**: ConsumptionPattern cached, recalculated only on new consumption
- **Incremental updates**: Update rolling averages incrementally, not full recalculation
- **Lazy load**: Analytics dashboard loads only when opened
- **Pagination**: If consumption history grows large (>1000 records), implement pagination

## Validation

- [ ] User can enable portion tracking for any product
- [ ] User can configure portionUnit, typicalPortionSize, portionsPerPackage
- [ ] User can record consumption in portions after meals
- [ ] System calculates accurate consumption patterns (±5% error)
- [ ] System predicts run-out dates with ±2 day accuracy
- [ ] System recommends optimal package sizes
- [ ] Analytics dashboard displays all required metrics
- [ ] Shopping list includes quantity recommendations
- [ ] Both levels and portions coexist without conflicts
- [ ] All unit tests pass (>90% coverage)
- [ ] E2E test covers complete portion tracking flow

## Migration Path

### From Levels to Portions

1. User has product with levels-based tracking
2. User clicks "Enable Portion Tracking"
3. System shows configuration wizard
4. User inputs: portionUnit, typicalPortionSize, portionsPerPackage
5. System saves PortionConfig
6. Product now has both levels and portions
7. User can record consumption via portions
8. Analytics become available after 7+ days of data

### Data Compatibility

- Existing products continue using levels (no migration required)
- New PortionConfig is additive (doesn't modify InventoryItem schema)
- Consumption records are separate from levels (no conflict)
- Shopping list handles both methods transparently
