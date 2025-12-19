# Change: Add Manual Shopping List Management

## Why

Currently, users can only view shopping list items that are automatically added when product stock levels reach 'low' or 'empty'. The domain model already supports manual items (`ShoppingListItem.createManual()`) and the repository has an `add()` method, but there is no UI to expose this functionality to users.

After manual testing, users need the ability to:
1. **Manually add products from inventory to shopping list** - Sometimes users want to buy items before stock runs low (e.g., preparing for a trip, taking advantage of sales)
2. **Quick access from product catalog** - Add to shopping list directly from the inventory view without navigating away

Current limitations:
- Users must wait until stock is low/empty for products to appear in shopping list
- No way to proactively plan shopping beyond automatic stock-level triggers
- Manual items are supported in the domain but completely inaccessible via UI

## What Changes

Add manual shopping list management capability with quick actions UI:

1. **Create `AddManualShoppingListItem` use case** at `src/application/use-cases/AddManualShoppingListItem.ts`
   - Validates product exists
   - Checks for duplicates (prevents adding same product twice)
   - Creates manual shopping list item with `reason='manual'`
   - Persists to repository

2. **Update `useShoppingList` hook**
   - Add `addManual(productId)` method
   - Handle errors (duplicates, not found)
   - Refresh list after addition

3. **Add "Add to Shopping List" button to product cards**
   - Icon button (`ShoppingCart` icon) on each product card
   - Positioned with existing action buttons (edit, delete, update stock)
   - Disabled/grayed out when product already in shopping list
   - Tooltip indicating action or current state

4. **Update UI components**
   - Modify `ProductListItem.tsx` to include new button
   - Modify `ProductList.tsx` to pass shopping list state
   - Modify `ProductCatalogPage.tsx` to wire up functionality
   - Add toast notifications for feedback

5. **Duplicate prevention**
   - Check if product already in shopping list before adding
   - Visual feedback (disabled button) for products in list
   - Error handling with user-friendly messages

## Impact

**Affected specs:**
- `shopping-list` (ADDED requirements for manual addition, duplicate prevention, UI quick actions)

**Affected code:**
- Modified: `shopping-management-webapp/src/presentation/pages/ProductCatalogPage.tsx`
- Modified: `shopping-management-webapp/src/presentation/components/ProductList.tsx`
- Modified: `shopping-management-webapp/src/presentation/components/ProductListItem.tsx`
- Modified: `shopping-management-webapp/src/presentation/hooks/useShoppingList.ts`
- Created: `shopping-management-webapp/src/application/use-cases/AddManualShoppingListItem.ts`
- Created: `shopping-management-webapp/src/test/application/use-cases/AddManualShoppingListItem.test.ts`

**Benefits:**
- ✅ Users can proactively plan shopping trips
- ✅ Quick access from inventory (no page navigation needed)
- ✅ Clear visual feedback (button disabled when already in list)
- ✅ Prevents duplicates automatically
- ✅ Leverages existing domain model (`reason='manual'`)
- ✅ Consistent with shopping mode workflow

**Breaking changes:**
- None (purely additive feature)

**User flow:**
1. User views product catalog (`/products`)
2. User sees product with high stock but wants to buy more
3. User clicks shopping cart icon on product card
4. Toast confirms "Producto añadido a la lista de la compra"
5. Button becomes disabled/grayed with tooltip "Ya en lista"
6. Product appears in shopping list with `reason='manual'`
