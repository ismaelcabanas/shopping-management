# Change: Add Manual Product Addition to Shopping List

## Why

Users currently cannot add products to their shopping list if those products don't exist in their inventory yet. This creates friction in two real-world scenarios:

**Scenario 1: Planning Shopping Trip**
```
User realizes they need a new product (not previously bought)
  → Opens Shopping List page
  → Cannot add it (product not in catalog)
  → Must navigate to Catalog → Add Product → Return to Shopping List
```

**Scenario 2: During Shopping (Impulse Buys)**
```
User is at store, opens Active Shopping page
  → Realizes they need something not on list
  → Cannot add it on the fly
  → Must exit shopping mode → Navigate to Catalog → Add → Resume shopping
```

**User Impact:**
- Interrupts shopping flow
- Requires multiple page navigations
- Increases cognitive load
- Reduces app usefulness for spontaneous needs

**Current Workaround:**
User must go to Product Catalog, create product, set stock to empty, then return to shopping list. This is 4+ taps instead of 1.

## What Changes

Add UI capability to create new products and automatically add them to shopping list in one streamlined flow, accessible from two strategic locations:

### Change 1: Shopping List Page - Add Product Button

**Before Shopping:**
- Add "+ Añadir Producto" button in page header
- Opens modal: name + unit type inputs
- Creates product with stock='empty'
- Product auto-appears in shopping list

### Change 2: Active Shopping Page - Quick Add Button

**During Shopping:**
- Add quick "+ Añadir" button/FAB
- Same modal with simplified flow
- Minimal interruption to shopping
- Product immediately available to check off

### Technical Approach

Leverage existing domain logic:
1. Create product (existing: CreateProduct use case)
2. Create inventory item with `stock='empty'` (existing: CreateInventoryItem)
3. System automatically adds to shopping list (existing: empty stock → auto-add)

**Key Insight:** No new domain logic needed! Products with empty stock already auto-add to shopping list. This change is purely UI enhancement.

### New Components

**AddProductToListModal:**
- Simple form: product name + unit type
- Validation: check for duplicate names
- Calls existing use cases sequentially
- Shows success/error feedback

## Impact

### User-Facing Changes
- **Shopping List Page**: New "+ Añadir Producto" button in header
- **Active Shopping Page**: New quick-add button for impulse items
- **User Flow**: One-step product creation + list addition (vs. multi-page navigation)

### Affected Code
- `src/presentation/pages/ShoppingListPage.tsx` - Add button and modal
- `src/presentation/pages/ActiveShoppingPage.tsx` - Add quick-add button
- `src/presentation/components/AddProductToListModal.tsx` - NEW modal component
- Test files for pages and modal

### Breaking Changes
None. This is a purely additive feature using existing domain logic.

### Benefits
✅ **Reduces friction**: One-step process instead of 4+ page navigations
✅ **Handles impulse buys**: Can add products during active shopping
✅ **Persistent products**: New items saved to catalog for future use
✅ **Leverages existing logic**: Empty stock → auto-add (no new domain code)
✅ **Two strategic entry points**: Planning (before) and shopping (during)

### Edge Cases Handled

**Duplicate Product Names:**
- Check existing products before creating
- Warn user: "Ya existe un producto similar"
- Allow selection of existing or creation of new

**Empty Shopping List:**
- Empty state shows "+ Añadir Producto" as primary CTA
- Encourages product addition when list is empty

**Product Already in List:**
- Validation prevents adding same product twice
- Clear error message if product already exists in list
