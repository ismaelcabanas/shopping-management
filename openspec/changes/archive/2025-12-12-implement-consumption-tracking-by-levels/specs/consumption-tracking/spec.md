# consumption-tracking Specification Delta

## ADDED Requirements

### Requirement: Stock Level Tracking
The system SHALL track product inventory using 4 discrete stock levels (Alto, Medio, Bajo, Vacío) that users can update after consuming products.

#### Scenario: User updates product stock level after consumption
- **GIVEN** a product exists in inventory with current stock level "Alto"
- **WHEN** user consumes the product and updates level to "Bajo"
- **THEN** the system SHALL update product stock level to "Bajo"
- **AND** the system SHALL record the change in consumption history
- **AND** the system SHALL display the new level in product catalog

#### Scenario: Stock level determines product appearance
- **GIVEN** products with different stock levels
- **WHEN** viewing the product catalog
- **THEN** each product SHALL display a visual indicator showing its level:
  - Alto: Green progress bar at 75-100%
  - Medio: Yellow progress bar at 25-75%
  - Bajo: Red progress bar at 1-25%
  - Vacío: Gray empty bar at 0%
- **AND** the color SHALL be clearly distinguishable

#### Scenario: New products start with full stock
- **GIVEN** a user adds a new product to inventory
- **WHEN** the product is created
- **THEN** the stock level SHALL default to "Alto"
- **AND** the lastUpdated timestamp SHALL be set to current time

### Requirement: Automatic Shopping List Flagging
Products with stock level "Bajo" or "Vacío" SHALL be automatically flagged for the shopping list.

#### Scenario: Low stock triggers shopping list addition
- **GIVEN** a product with stock level "Medio"
- **WHEN** user updates level to "Bajo"
- **THEN** the system SHALL automatically add product to shopping list
- **AND** the product SHALL be marked with "Stock bajo" indicator
- **AND** a notification SHALL confirm the action

#### Scenario: Replenished stock removes from shopping list
- **GIVEN** a product in shopping list with level "Bajo"
- **AND** user purchases the product (stock resets to "Alto")
- **WHEN** the purchase is registered
- **THEN** the system SHALL remove product from shopping list
- **AND** the "Stock bajo" indicator SHALL be removed

#### Scenario: Empty stock always needs purchase
- **GIVEN** a product with stock level "Vacío"
- **WHEN** viewing shopping list
- **THEN** the product SHALL appear in shopping list
- **AND** SHALL be marked as "Sin stock" (higher priority)
- **AND** SHALL remain until stock is replenished

### Requirement: Quick Stock Update Interface
The system SHALL provide a quick, mobile-friendly interface to update stock levels in under 5 seconds.

#### Scenario: User accesses stock update from catalog
- **GIVEN** user views product catalog
- **WHEN** user clicks/taps on a product
- **THEN** an update stock modal SHALL open
- **AND** the modal SHALL display current stock level
- **AND** 4 radio button options SHALL be shown (Alto, Medio, Bajo, Vacío)
- **AND** the modal SHALL be touch-friendly on mobile devices

#### Scenario: Stock update completes in 2 interactions
- **GIVEN** the update stock modal is open
- **WHEN** user selects new level (1 tap)
- **AND** confirms the update (1 tap)
- **THEN** the update SHALL complete in under 3 seconds
- **AND** visual feedback SHALL confirm the change
- **AND** the modal SHALL close automatically

#### Scenario: User can cancel stock update
- **GIVEN** the update stock modal is open
- **WHEN** user clicks "Cancelar" or closes modal
- **THEN** no changes SHALL be saved
- **AND** the modal SHALL close
- **AND** product stock level SHALL remain unchanged

### Requirement: Consumption History Recording
The system SHALL maintain a history of all stock level changes for future analysis and auditing.

#### Scenario: Every stock update is logged
- **GIVEN** a product with stock level "Alto"
- **WHEN** user updates level to "Bajo"
- **THEN** a ConsumptionRecord SHALL be created with:
  - Unique ID
  - Product ID
  - Previous level ("Alto")
  - New level ("Bajo")
  - Timestamp
- **AND** the record SHALL be persisted to storage

#### Scenario: History can be retrieved by product
- **GIVEN** multiple stock updates for "Arroz" product
- **WHEN** requesting consumption history for "Arroz"
- **THEN** all ConsumptionRecords SHALL be returned
- **AND** records SHALL be ordered by timestamp (most recent first)
- **AND** previous and new levels SHALL be included

#### Scenario: History persists across sessions
- **GIVEN** user updates stock and closes application
- **WHEN** user reopens application later
- **THEN** all consumption history SHALL still be available
- **AND** no data SHALL be lost

### Requirement: Visual Stock Level Indicators
Stock levels SHALL be displayed using color-coded visual indicators that are accessible and intuitive.

#### Scenario: Stock level bar shows current state
- **GIVEN** a product with stock level "Medio"
- **WHEN** viewing the product in catalog
- **THEN** a horizontal progress bar SHALL be shown
- **AND** the bar SHALL be 50% filled (representing "Medio")
- **AND** the bar SHALL be yellow
- **AND** the level name "Medio" SHALL be displayed

#### Scenario: Color coding follows traffic light pattern
- **GIVEN** products with different stock levels
- **WHEN** viewing the catalog
- **THEN** level colors SHALL be:
  - Alto: Green (#10B981 or equivalent)
  - Medio: Yellow/Amber (#F59E0B or equivalent)
  - Bajo: Red (#EF4444 or equivalent)
  - Vacío: Gray (#9CA3AF or equivalent)
- **AND** colors SHALL meet WCAG 2.1 AA contrast requirements

#### Scenario: Indicators are accessible
- **GIVEN** a screen reader user views product catalog
- **WHEN** focusing on a product
- **THEN** the screen reader SHALL announce product name
- **AND** SHALL announce stock level (e.g., "Stock nivel: Alto")
- **AND** SHALL announce if product needs purchase
- **AND** visual indicators SHALL not be the only means of conveying information

### Requirement: Data Migration for Existing Inventory
Existing inventory items SHALL be migrated to include stock level information without data loss.

#### Scenario: Existing products get default stock level
- **GIVEN** inventory contains products without stock level
- **WHEN** the system loads inventory data
- **THEN** missing stock levels SHALL default to "Alto"
- **AND** lastUpdated SHALL be set to migration time
- **AND** no existing data SHALL be lost

#### Scenario: Migration is backward compatible
- **GIVEN** the old data format without stock levels
- **WHEN** application starts with new code
- **THEN** the system SHALL read old data successfully
- **AND** apply migrations transparently
- **AND** save data in new format on next update

## MODIFIED Requirements

### Requirement: Inventory Item Data Model
The InventoryItem entity SHALL include stock level tracking fields in addition to existing quantity information.

**Previous Behavior**: InventoryItem only tracked current quantity and minimum stock as numbers.

**New Behavior**: InventoryItem also tracks stock level (qualitative) and last update timestamp.

#### Scenario: InventoryItem includes stock tracking fields
- **GIVEN** an InventoryItem in the system
- **WHEN** accessing its properties
- **THEN** it SHALL include existing fields (productId, currentQuantity, minimumStock)
- **AND** it SHALL include new field `stockLevel` (Alto/Medio/Bajo/Vacío)
- **AND** it SHALL include new field `lastUpdated` (Date)
- **AND** both fields SHALL be required

## REMOVED Requirements

None. This change adds new functionality without removing existing features.

## Implementation Notes

### Stock Level Mapping

```typescript
enum StockLevel {
  ALTO = 'alto',    // 75-100% → Green
  MEDIO = 'medio',  // 25-75%  → Yellow
  BAJO = 'bajo',    // 1-25%   → Red (add to shopping list)
  VACIO = 'vacio'   // 0%      → Gray (add to shopping list)
}
```

### Business Rules

1. **Initial Level**: New products → "Alto"
2. **After Purchase**: Reset to → "Alto"
3. **Shopping List Trigger**: "Bajo" OR "Vacío"
4. **History**: Record every level change

### UI Component Structure

```typescript
// StockLevelIndicator.tsx
<div className="stock-indicator">
  <div className={`progress-bar ${levelColor}`} style={{ width: percentage }} />
  <span>{levelName}</span>
</div>

// UpdateStockModal.tsx
<Modal>
  <h3>Actualizar Stock: {productName}</h3>
  <div>Nivel actual: {currentLevel}</div>
  <RadioGroup options={[alto, medio, bajo, vacio]} />
  <Button onClick={confirm}>Confirmar</Button>
</Modal>
```

### Data Storage

```typescript
// LocalStorage keys
'inventory_items'      // Updated to include stockLevel
'consumption_records'  // NEW: Array of ConsumptionRecord
```

## Validation

- [ ] Can update stock level in <5 seconds
- [ ] Stock level visible in catalog
- [ ] Products with "Bajo"/"Vacío" in shopping list
- [ ] Consumption history recorded
- [ ] Visual indicators clear and accessible
- [ ] WCAG 2.1 AA compliant
- [ ] All tests pass (unit + E2E)
- [ ] No regressions in existing features
- [ ] Data migration successful

## Out of Scope (Future Iteration)

These features are NOT included in this iteration:
- Portion-based tracking
- Consumption analytics
- Pattern recognition
- Predictive features ("days remaining")
- Consumption rate calculations
- Advanced shopping list logic
- Push notifications

See `implement-consumption-tracking-by-portions` for these features.
