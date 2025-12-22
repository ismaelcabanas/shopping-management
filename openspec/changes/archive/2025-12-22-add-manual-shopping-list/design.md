# Design: Manual Shopping List Management

## Context

The shopping list feature currently operates in two modes:
1. **Planning mode** (`/shopping-list`) - Read-only view of items needing purchase
2. **Active shopping mode** (`/shopping/start`) - Interactive mode during shopping trip

Items are added to the shopping list automatically when stock levels reach 'low' or 'empty' via the `UpdateStockLevel` use case. The domain model supports manual items (`ShoppingListItem.createManual(productId)`) but no UI exists to create them.

**Current flow:**
```
User updates stock → System detects 'low'/'empty' → Auto-adds to shopping list
```

**Desired flow:**
```
User clicks "Add to Shopping List" → System creates manual item → Appears in shopping list
```

## Goals / Non-Goals

**Goals:**
- Enable manual addition of products from inventory to shopping list
- Prevent duplicate entries (same product can't be added twice)
- Provide clear visual feedback (button state, toasts)
- Maintain consistency with existing shopping list behavior
- Simple, intuitive UI (single button click)

**Non-Goals:**
- Bulk selection (add multiple products at once) - future enhancement
- Add products from outside inventory (must exist in inventory first)
- Remove from shopping list from product catalog (use shopping list page)
- Quantity specification for manual items (use purchase registration for that)

## Decisions

### Decision 1: UI Placement - Button on Each Product Card

**Chosen approach:** Add shopping cart icon button to each product card alongside existing action buttons.

**Rationale:**
- ✅ Consistent with existing action button pattern (edit, delete, update stock)
- ✅ Zero clicks to add (no navigation, no modal)
- ✅ Clear visual hierarchy (icon + tooltip)
- ✅ Easy to implement (extend existing ProductListItem component)

**Alternatives considered:**

1. **Bulk selection mode** (checkboxes + batch action)
   - ❌ More complex UX (two-step process)
   - ❌ Over-engineered for typical use case (adding 1-2 items)
   - ✅ Better for adding many items (future enhancement)

2. **Action menu/dropdown**
   - ❌ Requires extra click
   - ❌ Hides functionality
   - ✅ Saves space (not a concern here)

### Decision 2: Duplicate Prevention Strategy

**Chosen approach:** Check `ShoppingListRepository.exists()` before adding + disable button for products already in list.

```typescript
// Use case validation
const exists = await this.shoppingListRepository.exists(productId)
if (exists) {
  throw new Error('Product already in shopping list')
}

// UI prevention
<button disabled={isInShoppingList} ...>
```

**Rationale:**
- ✅ Prevents duplicates at both use case and UI levels
- ✅ Clear visual feedback (disabled button)
- ✅ Graceful error handling (toast message)
- ✅ Leverages existing repository method

**Alternatives considered:**

1. **Allow duplicates**
   - ❌ Confusing UX (why is item listed twice?)
   - ❌ Complicates shopping list logic
   - ❌ No clear user benefit

2. **Silent no-op** (don't add, don't show error)
   - ❌ Confusing (user clicks, nothing happens)
   - ❌ Poor feedback

### Decision 3: State Management

**Chosen approach:** Pass Set of product IDs in shopping list from page to components.

```typescript
// ProductCatalogPage
const { items: shoppingListItems } = useShoppingList()
const productsInShoppingList = useMemo(() =>
  new Set(shoppingListItems.map(item => item.productId.value)),
  [shoppingListItems]
)

// ProductList
<ProductList productsInShoppingList={productsInShoppingList} />

// ProductListItem
<button disabled={isInShoppingList} />
```

**Rationale:**
- ✅ Simple, no additional state management library needed
- ✅ Efficient O(1) lookup with Set
- ✅ Single source of truth (useShoppingList hook)
- ✅ Automatic updates when shopping list changes

**Alternatives considered:**

1. **Query repository in each ProductListItem**
   - ❌ N queries (one per product)
   - ❌ Performance impact
   - ❌ Unnecessary API calls

2. **React Context for shopping list**
   - ❌ Over-engineered for simple prop passing
   - ✅ Would scale better with many consumers (not needed yet)

## Risks / Trade-offs

### Risk 1: UI clutter with additional button
**Mitigation:** Icon-only button with tooltip, consistent with existing action buttons. Visual consistency reduces perceived clutter.

### Risk 2: Confusion between auto and manual items
**Mitigation:** Shopping list already tracks `reason='auto'` vs `reason='manual'`. Future enhancement could show badges/icons to differentiate.

### Risk 3: Stale shopping list state
**Mitigation:** `useShoppingList` hook automatically refreshes after `addManual()`. Real-time sync ensured.

## Migration Plan

### Phase 1: Use Case (TDD)
1. Create `AddManualShoppingListItem` use case with tests
2. Test duplicate detection, error handling
3. Use case is independent, no breaking changes

### Phase 2: Hook Integration
1. Update `useShoppingList` hook with `addManual` method
2. Test hook integration
3. Hook changes are additive (new method)

### Phase 3: UI Components
1. Update `ProductListItem` with new button (backward compatible via optional prop)
2. Update `ProductList` to pass shopping list state
3. Update `ProductCatalogPage` to wire everything together
4. Components use optional props, non-breaking

### Rollback Strategy
- Each phase is independently deployable
- If issues arise, feature can be disabled by not passing `onAddToShoppingList` prop
- Use case and hook remain available for future use

## Open Questions

None - design is straightforward and well-scoped.
