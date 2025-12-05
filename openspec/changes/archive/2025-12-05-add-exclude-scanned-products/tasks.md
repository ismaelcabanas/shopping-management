# Implementation Tasks

## 1. Presentation Layer Updates

- [x] 1.1 Add trash icon button next to each product in `TicketResultsView`
  - Import Trash2 icon from lucide-react
  - Position button on the right side of each product item
  - Use danger variant for visual clarity
  - Add accessible label for screen readers

- [x] 1.2 Add state management for displayed items
  - Use useState to manage displayedItems (initialized from props.items)
  - Create handleRemoveItem function to filter items by id
  - Ensure product removal updates local state immediately

- [x] 1.3 Add visual feedback when removing products
  - Update product count display dynamically (displayedItems.length)
  - Pass only displayedItems to onConfirm callback
  - Disable confirm button when no products remain

## 2. Testing

- [x] 2.1 Unit tests for `TicketResultsView`
  - Test: Trash icon button visible for each product
  - Test: Remove product from list updates state
  - Test: Product count updates after removal
  - Test: onConfirm only includes remaining products
  - Test: Confirm button disabled when all products removed

- [x] 2.2 E2E tests for ticket scanning flow
  - [x] Created test file: `e2e/us-011-exclude-scanned-products.spec.ts`
  - [x] Implemented dependency injection in TicketScanModal
  - [x] Created MockOCRServiceForE2E service for E2E testing
  - [x] Fixed UUID validation error (invalid product ID)
  - [x] Verified OCR mock service is working correctly (products detected)
  - [x] Fixed text selectors using `data-status` attribute context
  - [x] Test passing: Scan ticket → Remove product → Confirm → Verify inventory ✅
  
## 3. Documentation

- [x] 3.1 Update user story US-011 status to "Completed"
  - Updated docs/userstories/README.md
  - Marked US-011 as completed in Épica 3
  - Updated statistics: 11/27 completed (41%), Épica 3: 3/3 completed ✅
  - Updated test counts: 393+ tests (392 unit + 12 e2e)

- [x] 3.2 Update README or user guide (if exists)
  - Document the exclusion feature
  - Add screenshot or example
  - Updated shopping-management-webapp/README.md with feature documentation

## 4. Validation

- [x] 4.1 Run full test suite
  - `npm test` - All unit tests pass (392/392 ✅)
  - E2E tests pass
  - No regressions in existing purchase registration
  - `npm run build` - Build successful ✅

**Note**: Initial implementation incorrectly added trash icon to RegisterPurchaseModal.
Corrected in commit 136d6bb to use TicketResultsView (where scanned products are actually shown).

- [x] 4.2 Manual testing checklist
  - Scan a real ticket with 5+ products
  - Remove 2 products from the list
  - Confirm purchase
  - Verify only 3 products added to inventory
  - Verify removed products are not in catalog

- [x] 4.3 Accessibility verification
  - Keyboard navigation works for delete buttons
  - Screen reader announces deletion actions (aria-label added)
  - Focus management after deletion