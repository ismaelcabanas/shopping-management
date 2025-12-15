# Change: Add Checkbox Functionality to Shopping List

## Why

Current shopping list UX has a critical flaw identified during Sprint 8 manual testing: when users click "Comprado" (Purchased) on an item, it disappears immediately from the list. This doesn't match real-world supermarket behavior where shoppers need to keep their shopping list visible while shopping to verify they've got everything.

**Problem**: Users lose visibility of their shopping list items as they mark them purchased, making it hard to track what they still need to buy.

**User Feedback**: "In the supermarket, I need to see the list while I shop. The items disappearing immediately is confusing."

## What Changes

- Add `checked` field to `ShoppingListItem` entity (boolean, default: false)
- Add checkbox UI element to each shopping list item
- Persist checked state in localStorage
- Replace individual "Comprado" buttons with checkboxes
- Add visual differentiation for checked items (reduced opacity)
- Items remain visible when checked (don't disappear)
- Checked items can be unchecked if needed
- Add "Registrar Compra (N)" button showing count of checked items (next story: US-023)

**Benefits**:
- Natural shopping flow: check items as you add them to cart
- Keep full list visible during shopping
- Reduce accidental "purchased" taps
- Enable future purchase validation (US-023)

## Impact

**Affected Specs**:
- `shopping-list` (new capability spec to be created)

**Affected Code**:
- Domain: `ShoppingListItem` entity (add checked field)
- Infrastructure: `LocalStorageShoppingListRepository` (persist checked state)
- Presentation: `ShoppingListPage` component (checkbox UI)
- Hooks: `useShoppingList` hook (toggle checked method)

**Breaking Changes**: None - backward compatible (checked defaults to false)

**Dependencies**: None (standalone change)

**Related Stories**:
- Blocks: US-023 (Validar Compras Contra Lista) - will use checked items for pre-selection
