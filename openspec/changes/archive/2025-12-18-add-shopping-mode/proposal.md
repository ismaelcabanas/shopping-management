# Change: Add Shopping Mode with Dedicated Page

## Why

Currently, the shopping list and purchase registration are disconnected:
- Shopping list shows checkboxes always (US-022) but they serve no purpose in the purchase flow
- Users must manually search for products when registering purchases
- No clear workflow from planning (shopping list) to execution (actual shopping) to recording (purchase registration)

This creates friction in the user journey: users plan what to buy, go shopping, but then start from scratch when registering their purchase.

## What Changes

Add a dedicated "shopping mode" that creates a clear workflow from list → active shopping → purchase registration:

1. **New page `/shopping/start`** - Active shopping session with checkboxes enabled
2. **Modified `/shopping-list`** - Simplified to read-only view with "Iniciar Compra" button
3. **New component `ShoppingListView`** - Shared component for displaying list (with/without checkboxes)
4. **New use case `RecalculateShoppingList`** - Clears and regenerates list based on inventory stock levels
5. **Post-purchase hook** - Automatically clears and recalculates list after successful purchase registration

**Key principle**: Shopping list is a support tool (not restrictive). Users can buy products not on the list. Checkboxes are personal helpers, they don't affect what gets registered.

## Impact

### Affected Specs
- **shopping-list**: Add new requirements for navigation, active shopping page, post-purchase recalculation

### Affected Code
- **New**: `src/presentation/pages/ActiveShoppingPage.tsx` - Dedicated page for active shopping
- **New**: `src/presentation/components/ShoppingListView.tsx` - Shared list component
- **New**: `src/application/use-cases/RecalculateShoppingList.ts` - Use case for list cleanup
- **Modified**: `src/presentation/pages/ShoppingListPage.tsx` - Simplified to read-only
- **Modified**: `src/presentation/components/RegisterPurchaseModal.tsx` - Add post-purchase callback
- **Modified**: `src/presentation/components/TicketScanModal.tsx` - Add post-purchase callback
- **Modified**: `src/infrastructure/repositories/LocalStorageShoppingListRepository.ts` - Add `clear()` method
- **Modified**: App routing to include `/shopping/start` route

### Migration
No breaking changes. Existing shopping list data remains compatible.

### Dependencies
- Depends on US-022 (shopping list checkboxes) - already implemented
- Depends on US-012 (stock level tracking) - already implemented
