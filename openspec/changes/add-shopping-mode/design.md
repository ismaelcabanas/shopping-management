# Design: Shopping Mode Architecture

## Context

The shopping list feature (US-022) introduced checkboxes but they exist in isolation. Users want a clear workflow: plan → shop → register. Current implementation forces users to manually search products during registration, creating friction.

## Goals / Non-Goals

### Goals
- Clear separation between planning (`/shopping-list`) and execution (`/shopping/start`)
- Natural browser navigation (back button works as expected)
- Automatic list cleanup after purchase registration
- Reusable component for list rendering (DRY principle)

### Non-Goals
- Checkbox state does NOT affect purchase registration (user freedom)
- No validation that purchased items match the list
- No purchase history tracking (future feature)
- No multi-session shopping (single active session at a time)

## Decisions

### Decision 1: Separate Page vs. Modal vs. State Toggle

**Chosen**: Separate page (`/shopping/start`)

**Alternatives considered**:
- **A) Same page with state toggle** - More code complexity in single component, harder to test
- **B) Full-screen modal** - Breaks browser navigation, weird UX on desktop
- **C) Separate page** ✅ - Clean separation, natural navigation, easier testing

**Rationale**: Separate pages align with user mental model ("I'm doing something different") and leverage browser navigation naturally. Each page has single responsibility.

### Decision 2: Checkbox Behavior During Registration

**Chosen**: Checkboxes are decorative (do NOT affect registration)

**Rationale**:
- User may decide to buy products not on list (offers, forgot items)
- User may skip products on list (out of stock, changed mind)
- Forcing validation creates friction
- List is a helper tool, not a contract

### Decision 3: Post-Purchase List Management

**Chosen**: Complete clear + recalculate (not incremental update)

**Alternatives considered**:
- **A) Remove only purchased items** - Requires matching logic, complex
- **B) Keep list unchanged** - User must manually clean, tedious
- **C) Clear + recalculate** ✅ - Simple, reliable, matches stock reality

**Rationale**: Complete recalculation ensures list reflects true inventory state. Simpler logic, no edge cases.

### Decision 4: Component Reusability

**Chosen**: Extract `ShoppingListView` shared component

**Rationale**:
- `ShoppingListPage` and `ActiveShoppingPage` render same data structure
- Only difference: `readonly` prop to show/hide checkboxes
- DRY principle: maintain rendering logic once
- Easier to test: component takes props, pages handle navigation

## Architecture

```
┌────────────────────────────────────────────────┐
│  ShoppingListPage (/shopping-list)             │
│  - Read-only view                              │
│  - Button: "Iniciar Compra" → navigate        │
│  - Uses: ShoppingListView(readonly=true)      │
└────────────────────────────────────────────────┘
                      ↓
┌────────────────────────────────────────────────┐
│  ActiveShoppingPage (/shopping/start)          │
│  - Active shopping session                     │
│  - Checkboxes enabled                          │
│  - Buttons: Scan/Manual/Cancel                 │
│  - Uses: ShoppingListView(readonly=false)     │
└────────────────────────────────────────────────┘
                      ↓
┌────────────────────────────────────────────────┐
│  RegisterPurchaseModal / TicketScanModal       │
│  - Existing modals (NO CHANGES to logic)       │
│  - New: onComplete callback                    │
│  - Callback triggers: RecalculateShoppingList  │
└────────────────────────────────────────────────┘
                      ↓
┌────────────────────────────────────────────────┐
│  RecalculateShoppingList (Use Case)            │
│  - Clear current list                          │
│  - Query inventory for low/empty stock         │
│  - Rebuild list with fresh data                │
└────────────────────────────────────────────────┘
```

## Component Design

### ShoppingListView (Shared Component)

```typescript
interface ShoppingListViewProps {
  items: ShoppingListItemWithDetails[]
  readonly: boolean
  onToggleChecked?: (productId: ProductId) => void
}

// Usage:
// ShoppingListPage: <ShoppingListView items={...} readonly={true} />
// ActiveShoppingPage: <ShoppingListView items={...} readonly={false} onToggleChecked={...} />
```

### ActiveShoppingPage (New)

```typescript
export function ActiveShoppingPage() {
  const { items, toggleChecked } = useShoppingList()
  const navigate = useNavigate()

  const handlePostPurchase = async () => {
    await recalculateShoppingList()
    navigate('/shopping-list')
    toast.success('Compra registrada y lista actualizada')
  }

  return (
    <>
      <ShoppingListView items={items} readonly={false} onToggleChecked={toggleChecked} />
      <Button onClick={() => openScanModal()}>Escanear Ticket</Button>
      <Button onClick={() => openManualModal()}>Registrar Manual</Button>
      <Button onClick={() => navigate('/shopping-list')}>Cancelar</Button>
    </>
  )
}
```

### StartShopping (Use Case - NEW)

```typescript
export class StartShopping {
  constructor(private shoppingListRepository: ShoppingListRepository) {}

  async execute(): Promise<void> {
    // 1. Get all shopping list items
    const items = await this.shoppingListRepository.findAll()

    // 2. Reset all checkboxes to false (start clean)
    for (const item of items) {
      await this.shoppingListRepository.updateChecked(item.productId, false)
    }

    // 3. Mark shopping session start (for future analytics)
    // Note: timestamp tracking is optional, not implemented in MVP
  }
}
```

**Rationale**: Resetting checkboxes ensures each shopping session starts clean. User won't be confused by checkboxes from a previous abandoned session.

### RecalculateShoppingList (Use Case)

```typescript
export class RecalculateShoppingList {
  async execute(): Promise<void> {
    // 1. Clear existing list
    await this.shoppingListRepository.clear()

    // 2. Get all inventory items
    const inventory = await this.inventoryRepository.findAll()

    // 3. Filter low/empty stock
    const needRestock = inventory.filter(
      item => item.stockLevel === 'low' || item.stockLevel === 'empty'
    )

    // 4. Add to list
    for (const item of needRestock) {
      await this.shoppingListRepository.add(
        new ShoppingListItem(
          item.productId,
          'auto',
          item.stockLevel,
          new Date(),
          false // checked = false
        )
      )
    }
  }
}
```

## Data Flow

```
User Journey:
1. /shopping-list → View planning list (readonly)
2. Click "Iniciar Compra" → StartShopping.execute() (reset checkboxes)
3. Navigate to /shopping/start
4. /shopping/start → Mark checkboxes while shopping (optional)
5. Click "Escanear Ticket" or "Registrar Manual"
6. Modal opens → Register products (may differ from list)
7. Confirm registration → Inventory updated
8. onComplete callback → RecalculateShoppingList.execute()
9. Navigate back to /shopping-list → See updated list
```

## Risks / Trade-offs

### Risk 1: User expects checkboxes to affect registration
**Probability**: Medium
**Mitigation**:
- Clear UI messaging: "Marca productos mientras compras"
- Checkboxes are visual helpers, not inputs to registration
- User testing to validate this doesn't confuse users

### Risk 2: Recalculation performance with large lists
**Probability**: Low (typical list: 5-20 products)
**Mitigation**:
- LocalStorage operations are fast (<50ms)
- If needed: add loading state during recalculation

### Risk 3: List churn (items disappear/reappear frequently)
**Probability**: Low (depends on user behavior)
**Mitigation**:
- This is desired behavior (list reflects reality)
- Users control stock levels, so they control list

## Migration Plan

No migration needed. Existing data compatible.

**Rollout**:
1. Deploy new route + components
2. Update existing modals to call recalculation
3. User experience improves immediately

**Rollback**:
- Remove route from router
- Revert modal changes
- No data cleanup needed

## Open Questions

None. Design is straightforward and aligned with user story requirements.
