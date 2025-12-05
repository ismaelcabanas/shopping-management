# Proposal: Implement Consumption Tracking by Portions (Advanced)

## Change ID
`implement-consumption-tracking-by-portions`

## Type
Feature Enhancement / Analytics System

## Status
Proposed

## Summary
Implement advanced consumption tracking using quantitative portion measurements, building upon the levels-based system. This iteration adds precise consumption analytics, pattern recognition, and predictive intelligence to optimize shopping decisions.

## Problem Statement

### Limitations of Levels-Only System

The levels-based system (first iteration) provides:
✅ Quick stock updates
✅ Automatic shopping list management
✅ Simple user experience

However, it lacks:
❌ **Precise consumption data** - Can't answer "How many grams of rice do I consume per week?"
❌ **Pattern recognition** - Can't identify consumption trends over time
❌ **Predictive intelligence** - Can't predict when products will run out
❌ **Optimal purchase quantities** - Can't suggest "Buy 2kg instead of 1kg"
❌ **Analytics insights** - Can't show consumption charts or statistics

### Real-World Scenario

**Example: Rice**
- Current (Levels): "Stock is Medio (Yellow)" → Manual judgment needed
- Desired (Portions):
  - "You consume ~200g/day"
  - "Current: 500g remaining"
  - "Will last: ~2.5 days"
  - "Suggest buy: 2kg package (lasts 10 days)"

**Example: Eggs**
- Current (Levels): "Stock is Bajo (Red)" → Add to list
- Desired (Portions):
  - "You consume 2-3 eggs/day"
  - "Current: 4 eggs remaining"
  - "Will last: ~1.5 days"
  - "Suggest buy: 12-egg carton (lasts 4-6 days)"

## Proposed Solution

### Hybrid System Architecture

The system will **coexist** with the levels-based system:

1. **Default: Levels** (Simple, fast, no configuration)
   - User updates stock level (Alto/Medio/Bajo/Vacío)
   - App auto-manages shopping list

2. **Opt-in: Portions** (Advanced, per-product)
   - User configures product for portion tracking
   - Records consumption in portions (grams, units, ml)
   - Gets analytics, predictions, and insights

### Key Concepts

#### 1. Portion Configuration (Per Product)

```typescript
interface PortionConfig {
  productId: string
  portionUnit: 'grams' | 'units' | 'ml'
  typicalPortionSize: number    // e.g., 150g of rice per meal
  portionsPerPackage: number     // e.g., 10 portions in 1.5kg package
}
```

**Example Setup**:
- Rice: `{portionUnit: 'grams', typicalPortionSize: 150, portionsPerPackage: 10}`
- Eggs: `{portionUnit: 'units', typicalPortionSize: 2, portionsPerPackage: 12}`

#### 2. Consumption Recording

```typescript
interface PortionConsumption {
  id: string
  productId: string
  portionsConsumed: number    // e.g., 1.5 portions
  timestamp: Date
  mealContext?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}
```

**User Flow**:
1. After meal: Open product detail
2. Input: "Consumed 1.5 portions" (or 225g for rice)
3. System records consumption + updates remaining stock

#### 3. Analytics & Intelligence

**A. Consumption Patterns**
```typescript
interface ConsumptionPattern {
  productId: string
  averagePortionsPerDay: number
  averagePortionsPerMeal: number
  mealFrequency: Record<MealType, number>  // Which meals use this product most
  weeklyTrend: number[]                     // Consumption by day of week
}
```

**B. Predictive Insights**
```typescript
interface PredictiveInsight {
  productId: string
  estimatedDaysRemaining: number
  predictedRunOutDate: Date
  recommendedPurchaseQuantity: number
  optimalPurchaseDate: Date
}
```

**C. Shopping Optimization**
```typescript
interface ShoppingOptimization {
  productId: string
  currentStock: number
  recommendedPackageSize: string        // "2kg bag" vs "1kg bag"
  estimatedCostSavings: number          // Buying larger package
  wasteRisk: 'low' | 'medium' | 'high' // Risk of product expiring
}
```

### User Interface Components

#### 1. Product Detail View (Enhanced)

```
┌─────────────────────────────────────┐
│ Arroz Integral                      │
├─────────────────────────────────────┤
│ Stock Level: ███▒▒ Medio (Yellow)   │ ← Existing (Levels)
│                                     │
│ ─── Portion Tracking (Optional) ─── │
│                                     │
│ Current Stock: 500g (3.3 portions)  │
│ Avg Consumption: 200g/day           │
│ Est. Remaining: 2.5 days            │
│                                     │
│ [Record Consumption]                │
│ [View Analytics]                    │
└─────────────────────────────────────┘
```

#### 2. Record Consumption Modal

```
┌─────────────────────────────────────┐
│ Record Consumption - Arroz          │
├─────────────────────────────────────┤
│ Portions Consumed:                  │
│ ┌─────┐ portions                    │
│ │ 1.5 │ (225g)                      │
│ └─────┘                             │
│                                     │
│ Meal: ◉ Lunch  ○ Breakfast          │
│       ○ Dinner ○ Snack              │
│                                     │
│ [Cancel]              [Confirm]     │
└─────────────────────────────────────┘
```

#### 3. Analytics Dashboard

```
┌─────────────────────────────────────┐
│ Consumption Analytics - Arroz       │
├─────────────────────────────────────┤
│ Last 30 Days:                       │
│                                     │
│ Total: 6kg (40 portions)            │
│ Avg/Day: 200g (1.3 portions)        │
│                                     │
│ [Chart: Daily Consumption]          │
│  ▂▄▆█▄▂▁▃▅▇█▅▃▁                      │
│                                     │
│ Most Common Meal: Lunch (60%)       │
│ Typical Portion: 150-200g           │
│                                     │
│ 💡 Insight: Buy 2kg bags            │
│    Saves 15% vs 1kg bags            │
│    Lasts ~10 days                   │
└─────────────────────────────────────┘
```

### Technical Architecture

#### Domain Layer

**New Entities**:
1. `PortionConfig` (Value Object) - Per-product portion settings
2. `PortionConsumption` (Entity) - Individual consumption record
3. `ConsumptionPattern` (Entity) - Aggregated analytics
4. `PredictiveInsight` (Entity) - AI-generated predictions

**New Services**:
1. `ConsumptionAnalytics` - Calculate patterns, averages, trends
2. `ConsumptionPredictor` - Predict run-out dates, optimal quantities
3. `ShoppingOptimizer` - Recommend package sizes, purchase timing

#### Application Layer

**New Use Cases**:
1. `ConfigurePortionTracking` - Enable portions for product
2. `RecordPortionConsumption` - Log consumption after meal
3. `GetConsumptionAnalytics` - Fetch analytics for product
4. `GetPredictiveInsights` - Get predictions and recommendations
5. `OptimizeShoppingList` - Generate optimized shopping list

#### Infrastructure Layer

**New Repositories**:
1. `PortionConfigRepository` - Store/retrieve portion configs
2. `PortionConsumptionRepository` - Store/retrieve consumption records

**Storage Strategy**:
- LocalStorage (MVP): All data client-side
- Future: Sync to cloud backend for multi-device support

### Integration with Existing System

#### Coexistence with Levels

Products can be in one of three states:

1. **Levels Only** (Default)
   - Quick stock updates
   - No configuration required
   - Auto shopping list management

2. **Portions Only** (Opt-in)
   - Detailed consumption tracking
   - Analytics and predictions
   - User configures this mode explicitly

3. **Hybrid** (Future consideration)
   - Use levels for quick updates
   - Use portions for detailed tracking
   - System syncs both approaches

#### Data Flow

```
User Records Consumption (1.5 portions)
        ↓
PortionConsumption saved
        ↓
Current stock updated (500g → 275g)
        ↓
Stock level recalculated (Medio → Bajo)
        ↓
Shopping list updated if needed
        ↓
Analytics patterns recalculated
```

## Benefits

### Immediate Benefits

1. **Precise Tracking**: Know exactly how much you consume
2. **Better Insights**: Understand consumption patterns
3. **Optimal Purchases**: Buy right quantity to minimize waste
4. **Predictive Alerts**: Know in advance when to restock

### Long-Term Benefits

5. **Cost Optimization**: Save money by buying optimal package sizes
6. **Waste Reduction**: Avoid buying too much or too little
7. **Time Savings**: Less frequent shopping trips with better planning
8. **Data-Driven Decisions**: Analytics inform better shopping habits

### Compared to Levels-Only

| Feature | Levels | Portions |
|---------|--------|----------|
| Setup Time | 0 min | 2-3 min/product |
| Update Speed | <5 sec | ~10 sec |
| Precision | Low | High |
| Analytics | None | Rich |
| Predictions | None | Yes |
| Optimization | Basic | Advanced |

## Risks & Mitigation

### Risks

1. **User Burden**: Recording portions after every meal is tedious
   - **Mitigation**: Make it optional (opt-in per product), keep levels as default

2. **Configuration Complexity**: Setting up portion config is complex
   - **Mitigation**: Provide smart defaults, guided setup wizard

3. **Data Entry Errors**: Users might input wrong portion amounts
   - **Mitigation**: Validation, typical ranges, "Undo last entry" feature

4. **Analytics Overhead**: Complex calculations may slow UI
   - **Mitigation**: Background calculations, caching, lazy loading

### Non-Risks

- **Existing System**: Levels system remains unchanged (backward compatible)
- **Data Migration**: No existing data to migrate (new feature)
- **Storage**: LocalStorage sufficient for MVP (average ~1KB/product/month)

## Success Criteria

1. ✅ User can enable portion tracking for any product
2. ✅ User can record consumption in portions after meals
3. ✅ System calculates accurate consumption patterns
4. ✅ System predicts run-out dates with ±2 day accuracy
5. ✅ System recommends optimal package sizes
6. ✅ Analytics dashboard shows consumption trends
7. ✅ Shopping list includes quantity recommendations
8. ✅ All unit tests pass (>90% coverage)
9. ✅ E2E tests cover complete consumption flow

## Out of Scope

- Machine learning models (use simple statistics for MVP)
- Multi-device synchronization (cloud backend)
- Barcode scanning for consumption recording
- Voice input for hands-free recording
- Integration with smart kitchen devices
- Expiration date tracking (separate feature)
- Recipe-based consumption prediction

## Dependencies

### Technical Dependencies
- **Requires**: `implement-consumption-tracking-by-levels` (must be completed first)
- **Builds on**: Existing repository pattern, use case architecture
- **Uses**: LocalStorage infrastructure, React hooks

### User Story Dependencies
- **Epic 4**: Consumption Management
- **After**: US-012 (Consumption tracking by levels)
- **Enables**: US-013 (Consumption history), US-016 (Analytics dashboard)

## Estimated Effort

### Development Phases

- **Phase 1**: Domain Model (PortionConfig, PortionConsumption) - 3 hours
- **Phase 2**: Analytics Engine (patterns, predictions) - 4 hours
- **Phase 3**: Use Cases (record, configure, analyze) - 3 hours
- **Phase 4**: Infrastructure (repositories, storage) - 2 hours
- **Phase 5**: UI Components (modals, analytics views) - 5 hours
- **Phase 6**: Integration with Shopping List - 2 hours
- **Phase 7**: Testing (unit + E2E) - 4 hours
- **Phase 8**: Polish & Documentation - 2 hours

**Total**: ~25 hours (3 days)

### Comparison with Levels Iteration

- **Levels**: ~16 hours (simpler, no analytics)
- **Portions**: ~25 hours (complex analytics, predictions)
- **Combined**: ~41 hours (full consumption system)

## Implementation Phases

### Phase 1: Foundation (Domain + Infrastructure)
- Create portion-related domain entities
- Implement repositories
- Write unit tests

### Phase 2: Core Features (Use Cases + Basic UI)
- Configure portion tracking use case
- Record consumption use case
- Basic consumption recording UI

### Phase 3: Analytics & Intelligence
- Consumption pattern calculation
- Predictive insights engine
- Analytics dashboard UI

### Phase 4: Integration & Optimization
- Shopping list integration
- Package size recommendations
- Quantity optimization

### Phase 5: Polish & Validation
- E2E tests for complete flow
- UI/UX refinements
- Performance optimization
- Documentation

## Next Steps

1. Review and approve this proposal
2. Create detailed task breakdown
3. Complete `implement-consumption-tracking-by-levels` first
4. Execute portions implementation in phases
5. Validate with real usage data

## References

- [Current Consumption Tracking Proposal](../implement-consumption-tracking-by-levels/)
- [US-012: Register Consumption](../../../docs/userstories/backlog/high-priority/)
- [US-013: Consumption History](../../../docs/userstories/backlog/medium-priority/)
- [Epic 4: Consumption Management](../../../docs/userstories/README.md)

## Future Enhancements (Post-MVP)

### Machine Learning Integration
- Predict consumption based on historical patterns
- Anomaly detection (unusual consumption spikes)
- Seasonal pattern recognition

### Advanced Analytics
- Cost per portion tracking
- Waste analysis (expired products)
- Nutritional insights (if product nutritional data available)

### Smart Recommendations
- "Buy this product at Store X (lowest cost per portion)"
- "Your rice consumption increased 20% this month"
- "Consider buying 2kg bags instead of 1kg (saves €2/month)"

These enhancements require backend infrastructure and are out of scope for MVP.
