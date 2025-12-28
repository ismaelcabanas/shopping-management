# Implementation Tasks

## 1. Create AddProductToListModal Component

- [ ] 1.1 Create component file: `src/presentation/components/AddProductToListModal.tsx`
- [ ] 1.2 Implement modal structure with form:
  - Product name input (required, text)
  - Unit type select (required, default 'unidades')
  - Submit button ("Añadir a la Lista")
  - Cancel/Close button
- [ ] 1.3 Add form validation:
  - Name required (min 2 characters)
  - Unit type required
  - Trim whitespace
- [ ] 1.4 Implement submit handler:
  - Call CreateProduct use case
  - Call CreateInventoryItem use case (stock='empty')
  - Handle success (call onSuccess callback)
  - Handle errors (show error message)
- [ ] 1.5 Add loading state during submission
- [ ] 1.6 Add error display for validation/submission errors
- [ ] 1.7 Implement duplicate detection (optional enhancement):
  - Check for similar product names before creating
  - Show warning dialog with options
  - Allow user to select existing or create new

## 2. Create Unit Tests for Modal

- [ ] 2.1 Create test file: `src/presentation/components/AddProductToListModal.test.tsx`
- [ ] 2.2 Test: "should render form when open"
- [ ] 2.3 Test: "should not render when closed"
- [ ] 2.4 Test: "should validate required fields"
- [ ] 2.5 Test: "should call onSuccess when product created"
- [ ] 2.6 Test: "should show error message on failure"
- [ ] 2.7 Test: "should close modal when cancelled"
- [ ] 2.8 Test: "should disable submit button while submitting"
- [ ] 2.9 Test: "should trim whitespace from product name"

## 3. Integrate with ShoppingListPage

- [ ] 3.1 Add modal state to ShoppingListPage:
  - `useState` for `showAddProductModal`
- [ ] 3.2 Import AddProductToListModal component
- [ ] 3.3 Add "+ Añadir Producto" button to header:
  - Place in header alongside title
  - Use `Plus` icon from lucide-react
  - Primary or secondary button style
- [ ] 3.4 Implement success handler:
  - Refetch shopping list
  - Show success toast
  - Close modal
- [ ] 3.5 Add modal to JSX (before closing div)
- [ ] 3.6 Update header layout for responsive design:
  - Button visible on all screen sizes
  - Stack vertically on mobile if needed

## 4. Update ShoppingListPage Tests

- [ ] 4.1 Add test: "should render add product button"
- [ ] 4.2 Add test: "should open modal when add button clicked"
- [ ] 4.3 Add test: "should refresh list after product added"
- [ ] 4.4 Add test: "should show success toast after product added"
- [ ] 4.5 Add test: "should close modal after successful addition"

## 5. Integrate with ActiveShoppingPage

- [ ] 5.1 Add modal state to ActiveShoppingPage:
  - `useState` for `showAddProductModal`
- [ ] 5.2 Import AddProductToListModal component
- [ ] 5.3 Add quick-add button:
  - FAB or inline button
  - Position: fixed bottom-20 right-6 (or context-appropriate)
  - Use `Plus` icon
  - Label: "+ Añadir" or icon-only
- [ ] 5.4 Implement success handler:
  - Refetch shopping list items
  - Show success toast
  - Product immediately available to check off
- [ ] 5.5 Add modal to JSX

## 6. Update ActiveShoppingPage Tests

- [ ] 6.1 Add test: "should render quick-add button"
- [ ] 6.2 Add test: "should open modal when quick-add clicked"
- [ ] 6.3 Add test: "should refresh items after product added"
- [ ] 6.4 Add test: "should allow checking off newly added product"

## 7. Update EmptyState for ShoppingList

- [ ] 7.1 Modify ShoppingListPage empty state:
  - Add "+ Añadir Producto" as primary CTA button
  - Make it prominent and inviting
  - Update EmptyState message if needed

## 8. Optional: Duplicate Detection Enhancement

- [ ] 8.1 Create utility function: `findSimilarProducts(name: string)`
  - Case-insensitive search
  - Fuzzy matching or contains logic
- [ ] 8.2 Create ConfirmDialog for duplicate warning:
  - Show list of similar products
  - Options: "Use existing" or "Create new"
- [ ] 8.3 Integrate with AddProductToListModal:
  - Check before creating
  - Show dialog if duplicates found
  - Respect user choice
- [ ] 8.4 Add tests for duplicate detection

## 9. Update Existing Use Cases (If Needed)

- [ ] 9.1 Review CreateProduct use case:
  - Ensure it handles all required fields
  - No changes expected (already complete)
- [ ] 9.2 Review CreateInventoryItem use case:
  - Ensure it accepts currentStock parameter
  - Ensure it correctly sets stockLevel='empty' when stock=0
  - No changes expected (already complete)
- [ ] 9.3 Verify auto-add logic:
  - Confirm empty stock triggers AddAutoShoppingListItem
  - Test in isolation if unsure

## 10. E2E Tests

- [ ] 10.1 Create or update E2E test: `e2e/add-manual-products.spec.ts`
- [ ] 10.2 Test scenario: Add product from Shopping List page
  - Navigate to Shopping List
  - Click "+ Añadir Producto"
  - Fill form
  - Submit
  - Verify product appears in list
- [ ] 10.3 Test scenario: Add product from Active Shopping page
  - Start shopping
  - Click quick-add button
  - Fill form
  - Submit
  - Verify product appears
  - Check off product
- [ ] 10.4 Test scenario: Add product with duplicate name
  - Create product "Leche"
  - Try to create another "Leche"
  - Verify warning shown (if duplicate detection implemented)

## 11. Validation

- [ ] 11.1 Run `npm run build` - TypeScript compilation succeeds
- [ ] 11.2 Run `npm test` - All unit tests pass
- [ ] 11.3 Run `npm run lint` - No linting errors
- [ ] 11.4 Run `npm run test:e2e` - All E2E tests pass

## 12. Manual Testing

- [ ] 12.1 Test on mobile viewport:
  - Button accessible
  - Modal displays correctly
  - Form inputs work
  - Success flow works
- [ ] 12.2 Test on tablet viewport:
  - Layout appropriate
  - All interactions work
- [ ] 12.3 Test on desktop:
  - Modal centered
  - Button visible
  - Form UX smooth
- [ ] 12.4 Test complete user flow:
  - Add product from Shopping List
  - Product appears immediately
  - Navigate to Catalog → See product with empty stock
  - Return to Shopping List → Product still there

## 13. Documentation

- [ ] 13.1 Update CHANGELOG.md:
  - Add entry: "Feature: Add products to shopping list directly"
  - Explain functionality briefly
- [ ] 13.2 Update user documentation (if exists):
  - Document new button locations
  - Explain product creation flow
- [ ] 13.3 Create commit with proper message format

## Notes

- All products created have stock='empty' (triggers auto-add)
- Products persist to catalog for future use
- No new domain logic required (leverages existing)
- Focus on UX simplicity (minimal form fields)
