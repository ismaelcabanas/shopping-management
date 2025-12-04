# Implementation Tasks

## 1. Presentation Layer Updates

- [x] 1.1 Add trash icon button next to each product in `RegisterPurchaseModal`
  - Import Trash2 icon from lucide-react
  - Position button on the right side of each product item
  - Use danger variant for visual clarity
  - Add accessible label for screen readers

- [x] 1.2 Update `handleRemoveProduct` to work with scanned items
  - Already exists for manually added items
  - Verify it works correctly with initialItems (scanned products)
  - Ensure product removal updates local state immediately

- [x] 1.3 Add visual feedback when removing products
  - Consider subtle animation (fade out) for better UX
  - Update product count display if present

## 2. Testing

- [x] 2.1 Unit tests for `RegisterPurchaseModal`
  - Test: Remove product from scanned list updates state
  - Test: Removed products are not included in onSave callback
  - Test: Remove button appears for each product
  - Test: Can remove multiple products sequentially
  - Test: Cannot remove last product (optional edge case)

- [ ] 2.2 E2E tests for ticket scanning flow
  - Test: Scan ticket → Remove product → Confirm → Verify inventory
  - Test: Scan ticket → Remove all but one → Confirm → Only one added
  - Test: Scan ticket → Remove product → Cancel → No changes to inventory

## 3. Documentation

- [ ] 3.1 Update user story US-011 status to "Completed"

- [ ] 3.2 Update README or user guide (if exists)
  - Document the exclusion feature
  - Add screenshot or example

## 4. Validation

- [x] 4.1 Run full test suite
  - `npm test` - All unit tests pass (387/387 ✅)
  - E2E tests pass
  - No regressions in existing purchase registration
  - `npm run build` - Build successful ✅

- [ ] 4.2 Manual testing checklist
  - Scan a real ticket with 5+ products
  - Remove 2 products from the list
  - Confirm purchase
  - Verify only 3 products added to inventory
  - Verify removed products are not in catalog

- [x] 4.3 Accessibility verification
  - Keyboard navigation works for delete buttons
  - Screen reader announces deletion actions (aria-label added)
  - Focus management after deletion