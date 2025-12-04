# Change: Add Product Exclusion from Scanned Ticket List

## Why

After scanning a receipt with OCR (US-009), users get a list of all extracted products before confirming the purchase. However, real-world receipts often contain products that users don't want to track in their inventory (e.g., cleaning supplies, disposable items, personal care products that don't affect pantry planning).

Currently, users must either:
1. Accept all scanned products (clutters inventory with irrelevant items)
2. Cancel the entire scan and manually enter only relevant products (defeats the purpose of OCR automation)

This creates friction and reduces the value proposition of the ticket scanning feature.

## What Changes

Add the ability to exclude individual products from the scanned ticket list before confirming:

- **UI Enhancement**: Add a trash/delete button (🗑️) next to each product in the scanned list
- **Removal Behavior**: Clicking the button removes the product from the list (visual feedback)
- **Total Recalculation**: Update the total purchase price to reflect only remaining products
- **Confirmation**: Only products remaining in the list are registered to inventory
- **No Persistence**: Exclusions are session-specific (no "remember this exclusion" feature)

**Scope Boundaries:**
- ✅ Remove products from current scan session
- ✅ Recalculate total for remaining products
- ❌ No persistent "ignore list" across sessions
- ❌ No undo/restore functionality
- ❌ No bulk select/deselect

## Impact

### Affected Specs
- `ticket-scanning` - New requirements for product exclusion in scan results

### Affected Code
- `RegisterPurchaseModal.tsx` - Add delete button per item, handle removal
- `RegisterPurchaseModal.test.tsx` - Test exclusion behavior
- `useTicketScan.ts` - May need to handle total recalculation (if tracked)
- E2E tests - Update to verify exclusion works end-to-end

### User Impact
- **Positive**: Better control over inventory, reduces manual cleanup
- **UX**: Slightly more complex UI (additional button per item)
- **Performance**: Negligible (list manipulation only)

### Breaking Changes
**NONE** - This is an additive feature. Existing behavior (accept all products) remains unchanged.

### Migration Path
No migration needed. Feature is additive and optional.