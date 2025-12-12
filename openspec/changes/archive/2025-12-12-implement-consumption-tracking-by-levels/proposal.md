# Proposal: Implement Product Consumption Tracking (by Levels)

## Change ID
`implement-consumption-tracking-by-levels`

## Type
Feature / User Story Implementation

## Status
Proposed

## Summary
Implement a simple consumption tracking system using 4 stock levels (Alto, Medio, Bajo, Vacío) that allows users to update product inventory after consuming items. When stock reaches "Bajo" level, products are automatically flagged for the shopping list. This is the First Iteration version focused on simplicity and quick implementation.

## Problem Statement

### Current Limitation

Currently, the inventory system only tracks:
- ✅ **Purchases**: Adding products to inventory
- ❌ **Consumption**: No way to register when products are used

**Impact**:
```
User buys 12 eggs → Inventory: 12 eggs
User consumes 3 eggs → Inventory: Still 12 eggs ❌
Result: Inventory becomes stale, loses usefulness
```

Without consumption tracking:
- Inventory doesn't reflect reality
- Can't identify when to buy more
- Can't analyze consumption patterns
- System loses value over time

### User Need

**User Story (US-012)**:
- **As a** user who consumes products from inventory
- **I want** to register consumption easily after meals
- **So that** inventory reflects what I actually have and the app can suggest when to buy more

**Key Requirements**:
- ⚡ **Fast**: Register consumption in <5 seconds
- 🎯 **Simple**: No complex calculations or inputs
- 🤖 **Automatic**: App decides when to add to shopping list
- 📱 **Mobile-friendly**: Easy to use after cooking/eating

## Proposed Solution (by Levels)

### Stock Level System

**4 Levels** with visual indicators:

```
┌─────────────────────────────────┐
│ Alto (Green)    ████████████    │  75-100% of package
│ Medio (Yellow)  ████████░░░░    │  25-75% of package
│ Bajo (Red)      ████░░░░░░░░    │  1-25% of package  → Add to shopping list
│ Vacío (Gray)    ░░░░░░░░░░░░    │  0% - Out of stock
└─────────────────────────────────┘
```

**Decision Rules**:
- **Alto**: Don't buy, plenty in stock
- **Medio**: Normal usage, monitor
- **Bajo**: ⚠️ Buy soon → Automatically flagged for shopping list
- **Vacío**: Out of stock → Must buy

### User Interface

#### Product Catalog View
```
┌─────────────────────────────────┐
│ 📦 Mi Despensa                  │
│                                 │
│ Leche               ████████    │ Alto
│ Huevos              ████░░░░    │ Bajo ⚠️
│ Arroz               ████████    │ Alto
│ Café                ░░░░░░░░    │ Vacío ⚠️
│                                 │
└─────────────────────────────────┘
```

#### Quick Consumption Update
```
Click on product →
┌─────────────────────────────────┐
│ Huevos                          │
│ Nivel actual: ████░░░░ (Bajo)   │
│                                 │
│ Actualizar nivel:               │
│ ○ Alto   (bien de stock)        │
│ ○ Medio  (nivel normal)         │
│ ● Bajo   (comprar pronto)       │
│ ○ Vacío  (sin stock)            │
│                                 │
│ [Confirmar]  [Cancelar]         │
└─────────────────────────────────┘
```

**Interaction Flow**:
1. User clicks product in catalog
2. Modal opens with current level + 4 radio buttons
3. User selects new level (1 tap)
4. Confirms (1 tap)
5. Done in 2 taps (~3 seconds)

### Automatic Shopping List Integration

**Logic**:
```typescript
if (stockLevel === 'Bajo' || stockLevel === 'Vacío') {
  addToShoppingList(product)
} else {
  removeFromShoppingList(product)
}
```

**User Experience**:
```
After updating Huevos to "Bajo":
┌─────────────────────────────────┐
│ ✅ Stock actualizado             │
│                                 │
│ Huevos marcados para comprar    │
│                                 │
│ [Ver Lista de Compra]           │
└─────────────────────────────────┘
```

## Benefits

### Immediate Benefits (by Levels)

1. **Closes Product Lifecycle**:
   ```
   Buy → Store → Consume → Alert → Auto-generate list ✅
   ```

2. **Simple & Fast**: 2 taps to update, no thinking required

3. **Automatic Decisions**: App flags products for shopping list

4. **Visual Feedback**: See at a glance what needs buying

### Long-Term Benefits

5. **Foundation for Analytics**: Stock levels can be analyzed over time

6. **Consumption History**: Track when products were updated

7. **Upgrade Path**: Can evolve to portion-based tracking later (separate spec)

## Scope

### In Scope (by Levels)

- ✅ 4 stock levels (Alto, Medio, Bajo, Vacío)
- ✅ Update stock level from product catalog
- ✅ Visual indicators (color-coded progress bars)
- ✅ Automatic shopping list flagging
- ✅ Consumption history recording (timestamp only)
- ✅ Product catalog shows current level

### Out of Scope (by Levels)

- ❌ Portion-based tracking (future: hybrid system)
- ❌ Consumption analytics/patterns
- ❌ Prediction ("days remaining")
- ❌ Consumption rate calculations
- ❌ Advanced shopping list features
- ❌ Notifications/alerts

### Future Enhancements (Separate Spec)

- 🔮 Hybrid system: Levels + Portions
- 🔮 Consumption pattern analysis
- 🔮 Predictive shopping list
- 🔮 Smart recommendations

## Technical Approach

### Data Model

```typescript
// Extend existing InventoryItem
interface InventoryItem {
  productId: string
  currentQuantity: number      // EXISTING
  minimumStock: number         // EXISTING
  unitType: string             // EXISTING

  // NEW: Stock level tracking
  stockLevel: StockLevel       // 'alto' | 'medio' | 'bajo' | 'vacio'
  lastUpdated: Date            // When level was updated
}

type StockLevel = 'alto' | 'medio' | 'bajo' | 'vacio'

// NEW: Consumption history
interface ConsumptionRecord {
  id: string
  productId: string
  previousLevel: StockLevel
  newLevel: StockLevel
  timestamp: Date
}
```

### Business Rules

1. **Initial Stock Level**: New products start at "Alto"
2. **After Purchase**: Stock level resets to "Alto"
3. **Shopping List Trigger**: "Bajo" or "Vacío" levels
4. **History Recording**: Every level change is logged

### Architecture (Clean Architecture)

```
presentation/
├── components/
│   ├── StockLevelIndicator.tsx      # Visual level bar
│   ├── UpdateStockModal.tsx         # Update modal
│   └── ProductCard.tsx              # MODIFIED: Show level
└── hooks/
    └── useConsumption.ts            # NEW: Consumption logic

application/
└── use-cases/
    ├── UpdateStockLevel.ts          # NEW
    └── GetProductsNeedingRestock.ts # NEW

domain/
├── model/
│   └── ConsumptionRecord.ts         # NEW: Value Object
└── services/
    └── StockLevelCalculator.ts      # NEW: Business logic

infrastructure/
└── repositories/
    └── LocalStorageConsumptionRepository.ts  # NEW
```

## Risks & Mitigation

### Risks

1. **Less Precise Than Portions**: Only 4 levels vs exact quantities
   - **Mitigation**: Sufficient for First Iteration, can upgrade later
   - **First Iteration Goal**: Simplicity > Precision

2. **User Discipline Required**: Users must remember to update
   - **Mitigation**: Visual reminders, quick access from catalog
   - **Future**: Push notifications (out of scope)

3. **Subjective Levels**: "Alto" means different things for different products
   - **Mitigation**: Acceptable for First Iteration, portion system addresses this later
   - **User Learning**: Users develop intuition quickly

### Non-Risks

- **Implementation Complexity**: Low (simple CRUD)
- **Performance**: Minimal (just updating a field)
- **Data Migration**: None (new feature, additive only)

## Success Criteria

1. ✅ User can update stock level in <5 seconds
2. ✅ Stock level visible in product catalog
3. ✅ Products with "Bajo" or "Vacío" flagged for shopping list
4. ✅ Consumption history recorded
5. ✅ Visual indicators clear and intuitive
6. ✅ No regressions in existing features
7. ✅ All tests pass (unit + E2E)

## Out of Scope (Explicit)

These are NOT part of First Iteration (separate spec exists):
- Portion-based tracking
- Consumption analytics
- Pattern recognition
- Predictive features
- Advanced shopping list
- Notifications

## Dependencies

- None (standalone feature)
- Builds on existing inventory system
- Compatible with future hybrid system

## Estimated Effort

### Implementation
- Domain Model: 1 hour
- Use Cases: 2 hours
- UI Components: 3 hours
- Repository: 1 hour
- **Subtotal**: 7 hours

### Testing
- Unit Tests: 2 hours
- Integration Tests: 1 hour
- E2E Tests: 1 hour
- **Subtotal**: 4 hours

### Documentation
- User documentation: 30 minutes
- Technical docs: 30 minutes
- **Subtotal**: 1 hour

**Total Estimated Effort**: ~12 hours (1.5 days)

## Implementation Phases

### Phase 1: Domain & Data Model (2 hours)
- Create ConsumptionRecord entity
- Extend InventoryItem with stockLevel
- Business rules for stock levels

### Phase 2: Use Cases (2 hours)
- UpdateStockLevel use case
- GetProductsNeedingRestock use case
- Repository implementation

### Phase 3: UI Components (3 hours)
- StockLevelIndicator component
- UpdateStockModal component
- Integrate with ProductCatalog

### Phase 4: Testing (4 hours)
- Unit tests for all layers
- E2E test for consumption flow
- Validate shopping list integration

### Phase 5: Refinement (1 hour)
- Polish UI/UX
- Performance optimization
- Final validation

## Next Steps

1. Review and approve this proposal
2. Create detailed task list
3. Implement with TDD
4. User testing
5. Deploy First Iteration
6. Gather feedback for hybrid system

## References

- [US-012: Registrar consumo de productos](../../../docs/userstories/README.md)
- [Current Inventory System](../../../shopping-management-webapp/src/domain/model/InventoryItem.ts)
- [Product Catalog UI](../../../shopping-management-webapp/src/presentation/pages/ProductCatalogPage.tsx)

## Related Specifications

- **Future**: `implement-consumption-tracking-hybrid` (Levels + Portions system)
  - Adds portion-based tracking
  - Consumption analytics
  - Predictive features