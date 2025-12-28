# Implementation Tasks

## 1. Update ShoppingListPage - Add Purchase Recording

- [ ] 1.1 Add modal state management:
  - `useState` for `showRegisterPurchaseModal`
  - `useState` for `showTicketScanModal`
  - OCR availability check (`!!import.meta.env.VITE_GEMINI_API_KEY`)

- [ ] 1.2 Import required components:
  - `RegisterPurchaseModal` from '../components/RegisterPurchaseModal'
  - `TicketScanModal` from '../components/TicketScanModal'
  - `Alert` from '../shared/components/Alert'
  - Icons: `ShoppingCart`, `Camera` from 'lucide-react'

- [ ] 1.3 Add OCR warning alert in header (if API key missing):
  - Place before action buttons
  - Same styling as ProductCatalog alert
  - Message: "Configure su API key para habilitar el escaneo de tickets"
  - Closable with `onClose` handler

- [ ] 1.4 Add action buttons to header:
  - "Registrar Compra" button (primary variant)
  - "Escanear Ticket" button (secondary variant)
  - Wrap in `<div className="flex gap-2 mt-4">`
  - Place after product count subtitle

- [ ] 1.5 Implement modal handlers:
  - `handleTicketScanComplete`: Receives matched items, opens RegisterPurchaseModal with pre-filled data
  - `handlePurchaseComplete`: Refreshes shopping list after purchase registration
  - `handleCloseModals`: Closes both modals and resets state

- [ ] 1.6 Add modal components to JSX:
  - RegisterPurchaseModal with proper handlers
  - TicketScanModal with proper handlers
  - Place before closing div of component

- [ ] 1.7 Add hooks for data refetching:
  - Import `useProducts` if needed for autocomplete
  - Ensure shopping list refreshes after purchase

## 2. Simplify ProductCatalogPage - Remove Purchase Recording

- [ ] 2.1 Remove modal state:
  - Delete `showRegisterPurchaseModal` state
  - Delete `showTicketScanModal` state
  - Delete `ocrAvailable` state

- [ ] 2.2 Remove modal imports:
  - Remove `RegisterPurchaseModal` import
  - Remove `TicketScanModal` import
  - Remove `Alert` import (keep if used elsewhere)
  - Remove `Camera` icon import

- [ ] 2.3 Remove OCR warning alert section:
  - Delete lines 320-331 (alert rendering)
  - Clean up surrounding whitespace

- [ ] 2.4 Remove "Escanear Ticket" button:
  - Delete lines 350-359 (button + icon)
  - Update flex layout if needed

- [ ] 2.5 Remove "Registrar Compra" button:
  - Delete lines 360-369 (button + icon)
  - Simplify header button area

- [ ] 2.6 Remove modal handlers:
  - Delete `handleTicketScanComplete` function
  - Delete `handlePurchaseComplete` function
  - Keep stock-related handlers (not purchase-related)

- [ ] 2.7 Remove modal renders:
  - Delete RegisterPurchaseModal JSX
  - Delete TicketScanModal JSX
  - Clean up closing tags

- [ ] 2.8 Simplify header structure:
  - Header should only have: Back button + Product count
  - Remove complex button grouping
  - Cleaner, focused layout

## 3. Update Unit Tests

### ProductCatalogPage Tests
- [ ] 3.1 Remove test: "should render Registrar Compra button"
- [ ] 3.2 Remove test: "should render Escanear Ticket button"
- [ ] 3.3 Remove test: "should show OCR warning when API key missing"
- [ ] 3.4 Remove test: "should open RegisterPurchaseModal when button clicked"
- [ ] 3.5 Remove test: "should open TicketScanModal when button clicked"
- [ ] 3.6 Verify remaining tests pass (FAB, inline actions, product list)

### ShoppingListPage Tests
- [ ] 3.7 Add test: "should render Registrar Compra button"
- [ ] 3.8 Add test: "should render Escanear Ticket button"
- [ ] 3.9 Add test: "should show OCR warning when API key missing"
- [ ] 3.10 Add test: "should open RegisterPurchaseModal when Registrar Compra clicked"
- [ ] 3.11 Add test: "should open TicketScanModal when Escanear Ticket clicked"
- [ ] 3.12 Add test: "should refresh shopping list after purchase complete"
- [ ] 3.13 Add test: "should pre-fill RegisterPurchaseModal after ticket scan"

## 4. Update E2E Tests

- [ ] 4.1 Update `e2e/us-008-register-purchase.spec.ts`:
  - Change navigation: Start from Shopping List page, not Catalog
  - Update selectors if needed
  - Verify purchase registration flow

- [ ] 4.2 Update `e2e/us-011-exclude-scanned-products.spec.ts`:
  - Change navigation: Start from Shopping List page
  - Update selectors for scan button
  - Verify OCR ticket scanning flow

- [ ] 4.3 Review other E2E tests for Purchase/Scan references:
  - `e2e/us-012-consumption-tracking.spec.ts` (if affects purchase flow)
  - `e2e/us-024-shopping-mode.spec.ts` (if tests purchase recording)

- [ ] 4.4 Verify E2E tests pass with new navigation flow

## 5. Responsive Design Testing

- [ ] 5.1 Test ShoppingListPage header buttons on mobile (< 640px):
  - Buttons should stack vertically or wrap gracefully
  - Touch targets adequate (44px min height)
  - Text readable, icons visible

- [ ] 5.2 Test ShoppingListPage header on tablet (768px - 1024px):
  - Buttons displayed horizontally
  - Adequate spacing between buttons
  - Header layout balanced

- [ ] 5.3 Test ShoppingListPage header on desktop (> 1024px):
  - Buttons prominently displayed
  - Consistent with new layout consistency standards (max-w-4xl)
  - Visual hierarchy clear (primary vs secondary buttons)

- [ ] 5.4 Verify ProductCatalogPage simplified header:
  - Cleaner appearance without purchase buttons
  - Adequate whitespace
  - Focused on inventory management

## 6. User Flow Testing

- [ ] 6.1 Test complete purchase registration flow from Shopping List:
  - Navigate to Shopping List
  - Click "Registrar Compra"
  - Fill out modal
  - Verify inventory updates
  - Verify shopping list updates

- [ ] 6.2 Test OCR ticket scanning flow from Shopping List:
  - Navigate to Shopping List
  - Click "Escanear Ticket" (if OCR available)
  - Upload ticket image
  - Verify OCR processing
  - Review detected items
  - Confirm → Opens RegisterPurchaseModal
  - Complete purchase → Verify updates

- [ ] 6.3 Test OCR unavailable scenario:
  - Mock missing API key
  - Navigate to Shopping List
  - Verify warning alert displayed
  - Verify "Escanear Ticket" button disabled or hidden
  - Verify "Registrar Compra" still works

- [ ] 6.4 Test Catalog page simplified flow:
  - Navigate to Catalog
  - Verify NO purchase recording buttons
  - Verify FAB still works for adding products
  - Verify inline actions work (edit, delete, update stock, add to list)

## 7. Validation

- [ ] 7.1 Run `npm run build` - TypeScript compilation succeeds
- [ ] 7.2 Run `npm test` - All unit tests pass
- [ ] 7.3 Run `npm run lint` - No linting errors
- [ ] 7.4 Run `npm run test:e2e` - All E2E tests pass

## 8. Documentation

- [ ] 8.1 Update CHANGELOG.md:
  - Add entry: "UX: Move purchase recording actions to Shopping List page"
  - Explain change rationale briefly
  - Note improved information architecture

- [ ] 8.2 Check if user documentation mentions button locations:
  - Update README-SETUP.md if it references Catalog page buttons
  - Update any onboarding materials

- [ ] 8.3 Create commit with proper message format

## 9. Optional Enhancements (Future)

- [ ] 9.1 Consider adding subtle hint in Catalog page:
  - "¿Compraste algo? → Ir a Lista de Compras"
  - Only show on first few visits (localStorage flag)
  - Helps discoverability for existing users

- [ ] 9.2 Consider analytics tracking:
  - Track button usage on Shopping List page
  - Compare with previous Catalog page usage
  - Validate improved discoverability

- [ ] 9.3 Consider A/B testing (if user base large enough):
  - Show 50% of users new location
  - Measure task completion rates
  - Validate hypothesis before full rollout

## Notes

- Focus on pure relocation - no functional changes
- Modals remain unchanged (work from any page)
- Domain logic and use cases unchanged
- Zero breaking changes to API or data model
