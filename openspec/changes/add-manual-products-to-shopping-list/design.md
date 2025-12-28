# Design: Add Manual Product Addition to Shopping List

## Context

Users need ability to add products to shopping list that don't yet exist in their product catalog. Current workaround requires multi-page navigation (Catalog → Add Product → Return to Shopping List).

**Stakeholders:**
- End users managing home inventory (mobile-first)
- Developers maintaining consistent UX patterns

## Goals / Non-Goals

### Goals
- ✅ Enable one-step product creation + list addition
- ✅ Support two scenarios: planning (before shopping) and impulse (during shopping)
- ✅ Leverage existing domain logic (empty stock → auto-add)
- ✅ Maintain data integrity (products persisted to catalog)

### Non-Goals
- ❌ NOT creating temporary shopping items (all products must persist)
- ❌ NOT changing domain logic for auto-add behavior
- ❌ NOT supporting bulk product creation (one at a time)

## Decisions

### Decision 1: Create Product with Empty Stock

**Rationale:**
Leverage existing domain rule: products with `stock='empty'` automatically add to shopping list.

**Implementation Flow:**
```
User submits form (name, unitType)
  → CreateProduct use case (creates Product entity)
  → CreateInventoryItem use case (currentStock=0, stockLevel='empty')
  → UpdateStockLevel triggers AddAutoShoppingListItem ✨ (existing logic)
  → Product appears in shopping list
```

**Benefits:**
- Zero new domain logic required
- Follows DDD constraints (products must exist before list items)
- Product persists for future use
- Consistent with existing auto-add behavior

**Alternatives Considered:**

**A. Create temporary shopping items (no product):**
- ❌ Violates DDD constraint (ShoppingListItem requires ProductId)
- ❌ No persistence (one-time use)
- ❌ Requires new domain logic

**B. Manual addition without auto-add:**
- ❌ Requires explicit AddManualShoppingListItem call
- ❌ More complex (3 use cases vs. 2)
- ❌ Doesn't leverage existing logic

**Decision:** Use empty stock to trigger auto-add (simplest, leverages existing).

### Decision 2: Two UI Entry Points

**Shopping List Page** (before shopping):
```tsx
<Button onClick={openModal}>
  <Plus /> Añadir Producto
</Button>
```
- Header placement (prominent)
- Planning context (less urgent)
- Full form with validation

**Active Shopping Page** (during shopping):
```tsx
<button className="fixed bottom-20 right-6 ...">
  <Plus /> Añadir
</button>
```
- FAB or quick-add button (accessible)
- Shopping context (urgent)
- Same form, streamlined presentation

**Rationale:**
- Two distinct user contexts require different entry points
- Same modal/form logic (DRY principle)
- Strategic placement based on user mental state

### Decision 3: Minimal Form Fields

**Required:**
- Product name (text input)
- Unit type (select: unidades, kg, litros, gramos)

**Hidden:**
- Stock level (fixed to 'empty')

**Rationale:**
- User is focused on "what I need" not "inventory details"
- Can edit full details later in Product Catalog
- Reduces friction (2 fields vs. 5+)
- Defaults to 'unidades' for fastest flow

### Decision 4: Duplicate Handling

**Problem:** User creates "Leche" when "Leche desnatada" already exists

**Solution:**
```tsx
// Before creating product
const similarProducts = await findSimilarProducts(name)
if (similar Products.length > 0) {
  showWarning("Ya existe un producto similar:")
  showOptions([
    ...similarProducts.map(p => `Usar "${p.name}"`),
    "Crear nuevo producto"
  ])
}
```

**Rationale:**
- Prevents accidental duplicates
- Helps catalog cleanliness
- User maintains control (can still create new)

**Implementation:** Simple string match (case-insensitive contains)

## Technical Implementation

### Component: AddProductToListModal

**Location:** `src/presentation/components/AddProductToListModal.tsx`

**Props:**
```typescript
interface AddProductToListModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (productId: ProductId) => void
}
```

**State:**
```typescript
const [name, setName] = useState('')
const [unitType, setUnitType] = useState<UnitType>('unidades')
const [isSubmitting, setIsSubmitting] = useState(false)
const [error, setError] = useState<string | null>(null)
```

**Submit Handler:**
```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)
  setError(null)

  try {
    // 1. Check for duplicates (optional enhancement)
    const similar = await checkSimilarProducts(name)
    if (similar.length > 0) {
      // Show warning dialog
      const confirmed = await confirmCreation(similar)
      if (!confirmed) return
    }

    // 2. Create product
    const productId = await createProduct({ name, unitType })

    // 3. Create inventory with empty stock
    await createInventoryItem({
      productId,
      currentStock: 0,
      unitType
    })

    // 4. Stock='empty' triggers auto-add to shopping list ✨

    // 5. Success
    onSuccess(productId)
    onClose()
    toast.success('Producto añadido a la lista')

  } catch (error) {
    setError(error.message)
    toast.error('Error al crear producto')
  } finally {
    setIsSubmitting(false)
  }
}
```

### Use Case Integration

**Option A: Use existing use cases sequentially** (Recommended):
```typescript
// Simple, no new use case needed
const createProduct = new CreateProduct(productRepository)
const createInventoryItem = new CreateInventoryItem(inventoryRepository)

const productId = await createProduct.execute({ name, unitType })
await createInventoryItem.execute({ productId, currentStock: 0, unitType })
// Auto-add happens via domain logic
```

**Option B: Create composite use case** (If reused in multiple places):
```typescript
class CreateProductAndAddToList {
  async execute(command: { name: string, unitType: UnitType }): Promise<ProductId> {
    const productId = await this.createProduct.execute(command)
    await this.createInventoryItem.execute({
      productId,
      currentStock: 0,
      unitType: command.unitType
    })
    return productId
  }
}
```

**Recommendation:** Start with Option A (simpler), refactor to Option B if pattern repeats.

### Page Integration

**ShoppingListPage:**
```tsx
// Add button state
const [showAddModal, setShowAddModal] = useState(false)

// Success handler
const handleProductAdded = (productId: ProductId) => {
  refetchShoppingList()  // Refresh list to show new item
}

// Render
<Button onClick={() => setShowAddModal(true)}>
  <Plus /> Añadir Producto
</Button>

<AddProductToListModal
  isOpen={showAddModal}
  onClose={() => setShowAddModal(false)}
  onSuccess={handleProductAdded}
/>
```

**ActiveShoppingPage:** Same pattern, different button styling.

## Risks / Trade-offs

### Risk: Duplicate Products Clutter Catalog

**Likelihood:** Medium
**Impact:** Medium (catalog becomes messy)
**Mitigation:**
- Implement duplicate detection before creation
- Show warning with similar products
- Allow user to select existing or create new

**Trade-off:** Extra validation step vs. cleaner catalog

### Risk: Users Create Products with Generic Names

**Example:** "Leche" vs. "Leche Desnatada Pascual 1L"

**Likelihood:** High (users in hurry during shopping)
**Impact:** Low (can edit later)
**Mitigation:**
- Placeholder text shows good examples
- Can edit product name later in Catalog
- Products are useful even with generic names

**Trade-off:** Quick creation vs. detailed catalog

### Risk: Stock Level Confusion

**Concern:** Users might not understand why product is "empty"

**Likelihood:** Low (stock level hidden in this flow)
**Impact:** Very Low (can update stock after shopping)
**Mitigation:**
- Stock level not exposed in add modal
- Natural flow: add to list → shop → register purchase → stock updates
- Documentation explains the flow

## Migration Plan

### Phase 1: Create AddProductToListModal Component
1. Create new modal component
2. Implement form with validation
3. Wire up to existing use cases
4. Add unit tests

### Phase 2: Integrate with ShoppingListPage
1. Add button to header
2. Add modal state management
3. Implement success handler
4. Add tests for integration

### Phase 3: Integrate with ActiveShoppingPage
1. Add quick-add button (FAB or inline)
2. Reuse same modal component
3. Test shopping flow

### Phase 4: Optional Enhancements
1. Duplicate detection
2. Empty state with prominent "+ Add Product" CTA
3. Product name suggestions/autocomplete

### Rollback Plan
- Pure UI addition, no domain changes
- Easy to hide buttons if issues arise
- No database migrations or data changes

## Open Questions

None. Design is straightforward with clear implementation path.
