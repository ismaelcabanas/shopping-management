# Design: Reorganize Purchase Recording Actions

## Context

The Shopping Manager application currently places purchase recording functionality (manual entry and ticket scanning) on the ProductCatalogPage, which primarily serves as an inventory viewing/management page. This creates UX confusion and violates information architecture principles.

**Current Architecture:**
- ProductCatalogPage: Inventory VIEW + Purchase RECORDING (mixed purposes)
- ShoppingListPage: Shows products needing restock

**Stakeholders:**
- End users managing home inventory (mobile-first)
- Developers maintaining consistent UX patterns

## Goals / Non-Goals

### Goals
- ✅ Establish clear information architecture (view vs. input pages)
- ✅ Place purchase recording in contextually appropriate location
- ✅ Reduce visual clutter on Catalog page
- ✅ Follow industry standards for grocery/pantry apps
- ✅ Maintain all existing functionality (zero functional changes)

### Non-Goals
- ❌ NOT changing modal implementations (RegisterPurchaseModal, TicketScanModal)
- ❌ NOT modifying domain logic or use cases
- ❌ NOT redesigning the shopping list interface itself
- ❌ NOT adding new features (pure reorganization)

## Decisions

### Decision 1: Move Purchase Recording to Shopping List Page

**Rationale:**

**Industry Analysis:**
Analyzed 4 comparable apps to understand standard patterns:

| App | Purchase Recording Location | Pattern |
|-----|----------------------------|---------|
| **Bring!** | Shopping list page | Scan receipts in shopping context |
| **Out of Milk** | Shopping list page | Add purchases after shopping trip |
| **AnyList** | Shopping list page | Receipt scanning integrated with list |
| **Pantry Check** | Dedicated "Add" page | Separate from pantry view |

**Common Pattern**: 100% of analyzed apps place purchase/scan actions in shopping/list context, NOT in pantry/inventory views.

**User Mental Model:**
```
Shopping Journey:
1. Plan (create shopping list)
2. Shop (go to store)
3. Return (come home with groceries)
4. Record (update what was bought) ← Happens in list context
5. View (check pantry inventory) ← Separate activity
```

Purchase recording is the **closing action** of the shopping journey, naturally paired with the shopping list.

**Alternatives Considered:**

**A. Keep on ProductCatalog** (Status Quo):
- ❌ Wrong context (viewing != inputting)
- ❌ Visual clutter
- ❌ Violates single responsibility principle
- ❌ Not industry standard

**B. Create separate "Purchases" navigation item**:
- ❌ Navigation bloat (4 items: Home, Catalog, List, Purchases)
- ❌ Not used frequently enough to warrant permanent nav space
- ❌ Disconnects from shopping list workflow

**C. Add to Active Shopping page**:
- ❌ Active Shopping is DURING shopping (in-store)
- ❌ Purchase recording is AFTER shopping (at home)
- ❌ Wrong timing in user journey

**Decision**: Move to ShoppingListPage - contextually correct, industry-aligned, reduces clutter.

### Decision 2: Button Placement on Shopping List Page

**Header Integration Pattern:**
```tsx
<header className="mb-8">
  <h1>Lista de Compras</h1>
  <p>{itemCount} productos pendientes</p>

  {/* Purchase recording actions */}
  <div className="flex gap-2 mt-4">
    <Button variant="primary">
      <ShoppingCart /> Registrar Compra
    </Button>
    <Button variant="secondary">
      <Camera /> Escanear Ticket
    </Button>
  </div>
</header>
```

**Rationale:**
- **Prominent placement**: Primary actions visible immediately
- **Logical grouping**: Both buttons related to purchase recording
- **Visual hierarchy**: Primary button (manual) more prominent than secondary (scan)
- **Mobile-friendly**: Buttons stack vertically on small screens

**Alternative Placements Considered:**

**A. Below shopping list content**:
- ❌ Requires scrolling (hidden below fold)
- ❌ Less discoverable

**B. Floating Action Button (FAB)**:
- ❌ Only one FAB possible (can't have two actions)
- ❌ Hides important distinction (manual vs. scan)

**C. Inline with "Iniciar Compra" button**:
- ❌ Confusing (start shopping vs. record purchase are different actions)
- ❌ Wrong timing (before shopping vs. after shopping)

**Decision**: Header placement with clear visual hierarchy.

### Decision 3: Modal Reuse (No Changes)

**Rationale:**
RegisterPurchaseModal and TicketScanModal are **already modal components** that can be triggered from any page. No redesign needed.

**Technical Implementation:**
```tsx
// ShoppingListPage gains:
const [showRegisterPurchaseModal, setShowRegisterPurchaseModal] = useState(false)
const [showTicketScanModal, setShowTicketScanModal] = useState(false)

// Import existing modals (no changes to modals themselves):
import { RegisterPurchaseModal } from '../components/RegisterPurchaseModal'
import { TicketScanModal } from '../components/TicketScanModal'
```

**Benefits:**
- Zero changes to modal logic
- Consistent behavior across pages
- Easier maintenance (single implementation)

### Decision 4: OCR Warning Alert Placement

**Current**: OCR warning alert shows on ProductCatalogPage if API key missing

**New**: Move OCR warning alert to ShoppingListPage header (before buttons)

**Rationale:**
- Warning is contextually relevant to "Escanear Ticket" button
- Shows where the action button lives
- Avoids showing warning on page where scanning isn't available

## Risks / Trade-offs

### Risk: Users Look for Buttons on Catalog Page

**Likelihood:** Medium (existing users accustomed to current location)
**Impact:** Low (easy to discover - one tap to Shopping List)
**Mitigation:**
- Shopping List is already in main navigation (high visibility)
- Natural user flow leads to Shopping List after shopping
- Optional: Add onboarding hint "Purchase recording moved to Shopping List" on first visit

**Trade-off**: Temporary confusion for existing users vs. long-term better UX and scalability.

### Risk: One Extra Navigation Tap

**Likelihood:** High (users on Catalog page need to navigate to Shopping List)
**Impact:** Very Low (one tap in persistent navigation bar)
**Mitigation:**
- Most users naturally go to Shopping List after shopping anyway
- Can add quick link in Catalog: "¿Compraste algo? → Ir a Lista"
- One extra tap is acceptable for correct information architecture

**Trade-off**: One extra tap vs. visual clutter and mixed purposes on Catalog page.

### Risk: Confusion About Page Purposes

**Likelihood:** Low (clear naming: "Mi Despensa" vs. "Lista de Compras")
**Impact:** Low (users will quickly learn)
**Mitigation:**
- Clear page titles and descriptions
- Logical action placement reinforces purpose
- Consistent with industry patterns (users have prior mental models)

## Migration Plan

### Phase 1: Update ShoppingListPage

**1.1 Add Button State:**
```tsx
const [showRegisterPurchaseModal, setShowRegisterPurchaseModal] = useState(false)
const [showTicketScanModal, setShowTicketScanModal] = useState(false)
const [ocrAvailable] = useState(!!import.meta.env.VITE_GEMINI_API_KEY)
```

**1.2 Import Modals:**
```tsx
import { RegisterPurchaseModal } from '../components/RegisterPurchaseModal'
import { TicketScanModal } from '../components/TicketScanModal'
import { Alert } from '../shared/components/Alert'
```

**1.3 Add Header Buttons:**
- OCR warning alert (if `!ocrAvailable`)
- "Registrar Compra" button (primary)
- "Escanear Ticket" button (secondary)

**1.4 Add Modal Handlers:**
- Copy handlers from ProductCatalogPage
- `handleTicketScanComplete` integrates with RegisterPurchaseModal
- `handlePurchaseComplete` refreshes shopping list

### Phase 2: Simplify ProductCatalogPage

**2.1 Remove Button State:**
```tsx
// Delete these:
const [showRegisterPurchaseModal, setShowRegisterPurchaseModal] = useState(false)
const [showTicketScanModal, setShowTicketScanModal] = useState(false)
const [ocrAvailable] = useState(!!import.meta.env.VITE_GEMINI_API_KEY)
```

**2.2 Remove Imports:**
```tsx
// Delete these:
import { RegisterPurchaseModal } from '../components/RegisterPurchaseModal'
import { TicketScanModal } from '../components/TicketScanModal'
import { Alert } from '../shared/components/Alert'
import { Camera } from 'lucide-react'
```

**2.3 Remove UI Elements:**
- Delete OCR warning alert section (lines 320-331)
- Delete "Escanear Ticket" button (lines 350-359)
- Delete "Registrar Compra" button (lines 360-369)
- Delete modal renders at bottom of component

**2.4 Remove Handlers:**
- Delete `handleTicketScanComplete`
- Delete `handlePurchaseComplete` (keep stock-related handlers)

### Phase 3: Update Tests

**3.1 ProductCatalogPage Tests:**
- Remove tests for "Registrar Compra" button
- Remove tests for "Escanear Ticket" button
- Remove tests for OCR warning alert
- Keep tests for FAB, inline actions, product list

**3.2 ShoppingListPage Tests:**
- Add tests for "Registrar Compra" button
- Add tests for "Escanear Ticket" button
- Add tests for modal integrations
- Add tests for OCR warning alert

**3.3 E2E Tests:**
- Update `us-008-register-purchase.spec.ts`: Navigate to Shopping List first
- Update `us-011-exclude-scanned-products.spec.ts`: Navigate to Shopping List first
- Verify complete purchase flow from Shopping List

### Phase 4: Validation

**4.1 Build Validation:**
```bash
npm run build  # Verify TypeScript compiles
```

**4.2 Unit Tests:**
```bash
npm test  # All tests pass
```

**4.3 E2E Tests:**
```bash
npm run test:e2e  # User flows work end-to-end
```

**4.4 Manual Testing:**
- Navigate to Shopping List
- Click "Registrar Compra" → Modal opens
- Complete purchase → Updates inventory
- Click "Escanear Ticket" → Scan modal opens
- Verify OCR warning if API key missing

### Rollback Plan

If issues arise:
1. Git revert is clean (pure component changes, no DB migrations)
2. No API or data model changes to worry about
3. Modals themselves unchanged (easy to re-wire)
4. Tests validate no functional regressions

## Technical Implementation Details

### File Changes Summary

**ProductCatalogPage.tsx** (`-150 lines`):
- Remove modal state (3 lines)
- Remove modal imports (3 lines)
- Remove OCR check (1 line)
- Remove alert section (12 lines)
- Remove scan button (10 lines)
- Remove register button (10 lines)
- Remove modal handlers (40 lines)
- Remove modal renders (40 lines)
- Simplify header structure (30 lines)

**ShoppingListPage.tsx** (`+150 lines`):
- Add modal state (3 lines)
- Add modal imports (3 lines)
- Add OCR check (1 line)
- Add alert section (12 lines)
- Add scan button (10 lines)
- Add register button (10 lines)
- Add modal handlers (40 lines)
- Add modal renders (40 lines)
- Enhance header structure (30 lines)

**Net Impact**: Zero lines added/removed (pure relocation), but clearer architecture.

## Open Questions

None. Design is straightforward relocation with established patterns.
