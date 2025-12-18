## ADDED Requirements

### Requirement: Shopping List Planning View
The shopping list SHALL provide a read-only planning view that allows users to review their shopping needs before initiating an active shopping session.

#### Scenario: User views shopping list in planning mode
- **GIVEN** shopping list contains 3 items (Milk-low, Eggs-empty, Bread-low)
- **AND** user is on `/shopping-list` page
- **WHEN** user views the list
- **THEN** items are displayed without checkboxes
- **AND** each item shows product name and stock level badge
- **AND** "Iniciar Compra" button is visible
- **AND** no purchase registration buttons are visible

#### Scenario: Empty shopping list planning view
- **GIVEN** shopping list is empty (no products with low/empty stock)
- **AND** user is on `/shopping-list` page
- **WHEN** user views the page
- **THEN** empty state message is displayed
- **AND** "Iniciar Compra" button is still visible (can start shopping anyway)

### Requirement: Start Shopping Session
The system SHALL allow users to initiate an active shopping session that prepares the current shopping list for use during the shopping trip by resetting checkbox states.

#### Scenario: User initiates shopping session with existing checked items
- **GIVEN** shopping list contains 3 items (Milk, Eggs, Bread)
- **AND** some items have checked=true from previous abandoned session
- **AND** user is on `/shopping-list` page
- **WHEN** user clicks "Iniciar Compra" button
- **THEN** StartShopping use case executes
- **AND** all item checkboxes are reset to unchecked (checked=false)
- **AND** user navigates to `/shopping/start` page
- **AND** list content remains the same (only checkboxes reset)

#### Scenario: Start shopping with empty list
- **GIVEN** shopping list is empty
- **AND** user is on `/shopping-list` page
- **WHEN** user clicks "Iniciar Compra" button
- **THEN** StartShopping use case executes without error
- **AND** user navigates to `/shopping/start` page
- **AND** empty state is shown on active shopping page

### Requirement: Active Shopping Page
The system SHALL provide a dedicated page for active shopping sessions where users can mark products as they add them to their physical cart.

#### Scenario: User views active shopping page
- **GIVEN** user navigated to `/shopping/start`
- **WHEN** page loads
- **THEN** header displays "🛒 Comprando..."
- **AND** shopping list items are displayed with enabled checkboxes
- **AND** all checkboxes are unchecked (from StartShopping reset)
- **AND** "Escanear Ticket" button is visible (primary)
- **AND** "Registrar Manual" button is visible (secondary)
- **AND** "Cancelar" button is visible in header

#### Scenario: User marks products while shopping
- **GIVEN** user is on `/shopping/start` with 3 items
- **WHEN** user checks "Milk" checkbox
- **THEN** "Milk" checkbox shows checkmark
- **AND** "Milk" text has strikethrough (line-through)
- **AND** "Milk" opacity reduces to 0.6
- **AND** checked state persists in localStorage
- **AND** other items remain unchecked

#### Scenario: User cancels active shopping session
- **GIVEN** user is on `/shopping/start`
- **AND** user has marked 2 of 3 checkboxes
- **WHEN** user clicks "Cancelar" button
- **THEN** user navigates back to `/shopping-list`
- **AND** list returns to planning view (readonly)
- **AND** checkbox states are preserved in localStorage

### Requirement: Purchase Registration from Active Shopping
The system SHALL allow users to register their purchase directly from the active shopping page using either OCR scanning or manual entry, independent of checkbox states.

#### Scenario: User registers purchase via ticket scan
- **GIVEN** user is on `/shopping/start`
- **AND** user has marked some checkboxes
- **WHEN** user clicks "Escanear Ticket" button
- **THEN** TicketScanModal opens
- **AND** user can scan ticket and register products
- **AND** checkboxes do NOT affect what products are registered
- **WHEN** registration completes successfully
- **THEN** RecalculateShoppingList use case executes
- **AND** user navigates back to `/shopping-list`
- **AND** success toast displays "Compra registrada y lista actualizada"

#### Scenario: User registers purchase manually
- **GIVEN** user is on `/shopping/start`
- **AND** user has marked some checkboxes
- **WHEN** user clicks "Registrar Manual" button
- **THEN** RegisterPurchaseModal opens
- **AND** user can select and register products
- **AND** checkboxes do NOT affect what products are registered
- **WHEN** registration completes successfully
- **THEN** RecalculateShoppingList use case executes
- **AND** user navigates back to `/shopping-list`
- **AND** success toast displays "Compra registrada y lista actualizada"

#### Scenario: User registers products not on current shopping list
- **GIVEN** user is on `/shopping/start` with list containing [Milk, Eggs]
- **WHEN** user clicks "Registrar Manual"
- **AND** user selects and registers [Bread, Milk, Chocolate]
- **THEN** registration succeeds for all 3 products
- **AND** inventory is updated for all 3 products
- **AND** no validation error about products not being on list

### Requirement: Post-Purchase List Regeneration
After a successful purchase registration, the system SHALL automatically regenerate the shopping list for the next planned shopping trip based on the updated inventory state.

#### Scenario: Shopping list regenerates with new low-stock items
- **GIVEN** before purchase:
  - Inventory: Milk(low), Eggs(empty), Bread(high), Coffee(high)
  - Shopping list: [Milk, Eggs]
- **WHEN** user registers purchase of [Milk x2, Eggs x12]
- **AND** inventory updates to: Milk(high), Eggs(high), Bread(high), Coffee(high)
- **THEN** RecalculateShoppingList use case executes
- **AND** current shopping list is cleared completely
- **AND** inventory is queried for low/empty stock items
- **AND** shopping list is regenerated (empty in this case - all items have high stock)
- **AND** user navigates back to `/shopping-list`
- **AND** sees empty list message

#### Scenario: New items appear in regenerated list
- **GIVEN** before purchase:
  - Inventory: Milk(low), Eggs(empty), Coffee(high)
  - Shopping list: [Milk, Eggs]
- **WHEN** user registers purchase of [Milk x2, Eggs x12]
- **AND** separately (different flow), Coffee was consumed and now has Coffee(low)
- **AND** inventory updates to: Milk(high), Eggs(high), Coffee(low)
- **THEN** RecalculateShoppingList executes
- **AND** shopping list is regenerated with [Coffee-low]
- **AND** Milk and Eggs are removed (now high stock)
- **AND** all regenerated items have checked=false

#### Scenario: Some items remain in regenerated list
- **GIVEN** before purchase:
  - Inventory: Milk(low), Eggs(empty), Bread(low)
  - Shopping list: [Milk, Eggs, Bread]
- **WHEN** user registers purchase of [Milk x2, Eggs x12]
- **AND** inventory updates to: Milk(high), Eggs(high), Bread(low)
- **THEN** RecalculateShoppingList executes
- **AND** shopping list is regenerated with [Bread-low]
- **AND** Milk and Eggs are removed
- **AND** Bread remains (still low stock)
- **AND** Bread has checked=false (reset in regeneration)

#### Scenario: Shopping list regenerated even if purchase unrelated
- **GIVEN** shopping list contains [Milk-low, Eggs-empty]
- **WHEN** user registers purchase of [Chocolate, Tomatoes]
- **AND** inventory updates: Chocolate(high), Tomatoes(high), Milk(low), Eggs(empty)
- **THEN** RecalculateShoppingList executes
- **AND** shopping list regenerates with [Milk-low, Eggs-empty]
- **AND** list content same as before but all checkboxes reset to false

### Requirement: Browser Navigation Integration
The shopping mode SHALL integrate naturally with browser navigation, allowing users to use back/forward buttons as expected.

#### Scenario: Browser back button from active shopping
- **GIVEN** user is on `/shopping/start`
- **WHEN** user clicks browser back button
- **THEN** user navigates to `/shopping-list`
- **AND** list displays in planning mode (readonly)

#### Scenario: Direct URL access to active shopping page
- **GIVEN** user enters `/shopping/start` directly in browser
- **WHEN** page loads
- **THEN** active shopping page displays correctly
- **AND** shopping list loads from localStorage
- **AND** all shopping mode features work normally

## MODIFIED Requirements

### Requirement: Shopping List Item Checked State
Shopping list items SHALL maintain a checked state that persists across sessions and page navigations. Checked state is reset when starting a new shopping session and when list is regenerated after purchase.

#### Scenario: Checked state resets when starting new shopping session
- **GIVEN** shopping list has 3 items with [Milk-checked, Eggs-unchecked, Bread-checked]
- **AND** user is on `/shopping-list` page
- **WHEN** user clicks "Iniciar Compra"
- **THEN** StartShopping use case executes
- **AND** all items are reset to checked=false
- **AND** user navigates to `/shopping/start` with all checkboxes unchecked

#### Scenario: Checked state persists during active shopping session
- **GIVEN** user is on `/shopping/start`
- **WHEN** user checks "Milk" and "Eggs"
- **AND** user navigates away (clicks Cancel or browser back)
- **AND** user returns to `/shopping/start` (without clicking "Iniciar Compra" again)
- **THEN** "Milk" and "Eggs" remain checked
- **AND** checked state persisted in localStorage

#### Scenario: Checked state cleared when list regenerates
- **GIVEN** user has checked items on `/shopping/start`
- **AND** user abandons session (clicks Cancel)
- **AND** shopping list has [Milk-checked, Eggs-checked, Bread-unchecked]
- **WHEN** user (in a later flow) successfully registers any purchase
- **THEN** RecalculateShoppingList executes
- **AND** shopping list is regenerated with all items checked=false
- **AND** previous checkbox states are lost

#### Scenario: User checks item while shopping
- **GIVEN** shopping list with 3 items (Milk, Eggs, Bread)
- **AND** user is on `/shopping/start` page
- **WHEN** user clicks checkbox next to "Milk"
- **THEN** "Milk" checkbox shows checkmark (✓)
- **AND** "Milk" text has strikethrough decoration (line-through)
- **AND** "Milk" text opacity reduces to 0.6
- **AND** "Milk" remains visible in the list
- **AND** other items (Eggs, Bread) remain unchecked

#### Scenario: User unchecks previously checked item
- **GIVEN** shopping list item "Eggs" is checked on `/shopping/start`
- **WHEN** user clicks checkbox next to "Eggs"
- **THEN** "Eggs" checkbox becomes unchecked
- **AND** "Eggs" strikethrough decoration is removed
- **AND** "Eggs" text returns to full opacity (1.0)
