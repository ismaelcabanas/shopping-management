# Change: Reorganize Purchase Recording Actions

## Why

The ProductCatalogPage (`/catalog` - "Mi Despensa") currently serves dual purposes that create UX confusion:

**Problem 1: Mixed Purposes on Single Page**
- **Inventory viewing**: Browse products, check stock levels, manage catalog
- **Purchase recording**: Register purchases manually or via ticket scanning

These are fundamentally different user activities happening at different times:
- Inventory viewing = "What do I have at home?" (checking pantry)
- Purchase recording = "What did I buy at the store?" (after shopping)

**Problem 2: Wrong Mental Model**
Current user flow is counterintuitive:
```
1. User goes shopping at store
2. User comes home with groceries
3. User opens Catalog page (pantry view) ← Wrong context!
4. User clicks "Registrar Compra"
```

Natural user flow should be:
```
1. User goes shopping
2. User comes home
3. User opens Shopping List ← "Did I get everything I needed?"
4. User records purchases right there
```

**Problem 3: Visual Clutter**
ProductCatalogPage header has competing actions:
- "Escanear Ticket" button
- "Registrar Compra" button
- Back button
- Plus FAB and 4 inline actions per product

= **7+ actions on one page**, reducing focus and usability

**Problem 4: Industry Standards Violation**
Analyzed similar grocery/pantry apps:
- **Bring!**: Scan receipts from shopping list context
- **Out of Milk**: Purchase entry on shopping list page
- **AnyList**: Receipt scanning integrated with shopping list
- **Pantry Check**: Separate input pages from inventory view

**Industry pattern**: Purchase recording happens in shopping/list context, NOT in inventory/pantry view.

## What Changes

Move "Registrar Compra" and "Escanear Ticket" buttons from ProductCatalogPage to ShoppingListPage, establishing clear information architecture:

### Page Purpose Redefinition

| Page | NEW Purpose | Actions |
|------|------------|---------|
| **Mi Despensa (Catalog)** | VIEW & MANAGE inventory | View products, Update stock, Edit, Delete, Add new product (FAB) |
| **Lista de Compras** | PLAN & RECORD shopping | View needed items, **Register purchases**, **Scan tickets**, Start shopping |

### Specific Changes

**ProductCatalogPage** (Simplify):
- ❌ Remove "Registrar Compra" button
- ❌ Remove "Escanear Ticket" button
- ❌ Remove OCR warning alert
- ✅ Keep FAB for adding new products
- ✅ Keep inline actions (update stock, edit, delete)
- ✅ Cleaner, focused on inventory management

**ShoppingListPage** (Enhance):
- ✅ Add "Registrar Compra" button in header
- ✅ Add "Escanear Ticket" button in header
- ✅ Integrate RegisterPurchaseModal
- ✅ Integrate TicketScanModal
- ✅ Add OCR warning alert (if API key missing)
- ✅ Becomes central hub for purchase-related activities

### User Flow Improvement

**Before** (current):
```
Home → Catalog → Click "Registrar Compra" → Modal
```

**After** (proposed):
```
Home → Shopping List → Click "Registrar Compra" → Modal
```

Benefits:
- More contextually appropriate (after shopping, check list first)
- Aligns with natural mental model
- Follows industry best practices

## Impact

### User-Facing Changes
- **Visual**: Purchase recording buttons move from Catalog to Shopping List
- **Navigation**: Users naturally navigate to Shopping List after shopping
- **Functionality**: ZERO functional changes - all modals and flows work identically

### Affected Code
- `src/presentation/pages/ProductCatalogPage.tsx` - Remove buttons, simplify header
- `src/presentation/pages/ShoppingListPage.tsx` - Add buttons, integrate modals
- Test files for both pages

### Breaking Changes
None. This is a pure UX reorganization with no API, data model, or business logic changes.

### Benefits
✅ **Clearer mental models**: Catalog = view inventory, Shopping List = record purchases
✅ **Reduced visual clutter**: Each page has focused purpose
✅ **Better UX**: Actions in contextually appropriate locations
✅ **Industry alignment**: Follows patterns from Bring!, Out of Milk, AnyList
✅ **Scalability**: Easier to add features without overcrowding pages

### Migration Strategy
No user data migration needed. The change is purely presentational:
- Existing users may initially look for buttons on Catalog page
- Quick discovery: Shopping List is one tap away in navigation
- Optional: Add subtle hint in Catalog "Register purchases in Shopping List" for first visit

### Addressed Concerns

**Concern**: "I sometimes register purchases without planning a shopping list"
**Answer**: You can still access Shopping List page anytime to register purchases, regardless of whether you used the list for planning.

**Concern**: "Extra navigation step to reach buttons"
**Answer**: After shopping, users naturally check Shopping List to see "did I get everything?". The buttons are exactly where they're needed at that moment.

**Concern**: "What if I'm browsing catalog and want to scan a ticket?"
**Answer**: One tap to Shopping List in navigation. This is a rare edge case vs. the primary flow (shop → check list → record purchases).
