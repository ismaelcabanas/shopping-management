# shopping-list Specification

## Purpose
TBD - created by archiving change add-shopping-list-checkbox. Update Purpose after archive.
## Requirements
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

### Requirement: Checkbox User Interface
Each shopping list item SHALL display a checkbox that is easily accessible and provides clear visual feedback.

#### Scenario: Checkbox meets accessibility standards
- **GIVEN** shopping list item displayed on mobile device
- **WHEN** user attempts to tap checkbox
- **THEN** touch target is at least 44x44 pixels
- **AND** checkbox has visible focus indicator when focused via keyboard
- **AND** checkbox has aria-label describing the action

#### Scenario: Visual differentiation for checked items
- **GIVEN** shopping list with mixed checked and unchecked items
- **WHEN** user views the list
- **THEN** checked items display text with strikethrough decoration (line-through)
- **AND** checked items display with reduced opacity (0.6)
- **AND** checked items show checkmark (✓) in checkbox
- **AND** urgency badges (stock level) remain fully visible on checked items
- **AND** unchecked items display with normal opacity (1.0) and no strikethrough

#### Scenario: Checkbox positioned consistently
- **GIVEN** shopping list with multiple items
- **WHEN** user views the list
- **THEN** checkbox appears at the left of each item
- **AND** checkbox aligns vertically with product name
- **AND** checkbox spacing is consistent across all items

### Requirement: Replace Individual Purchased Buttons
The individual "Comprado" (Purchased) button on each item SHALL be removed and replaced with checkbox interaction.

#### Scenario: Purchased button is not visible
- **GIVEN** shopping list item displayed
- **WHEN** user views the item
- **THEN** no "Comprado" button is visible
- **AND** checkbox is the primary interaction method
- **AND** delete button (🗑️) remains available

#### Scenario: Items remain in list when checked
- **GIVEN** shopping list with 5 items
- **WHEN** user checks 3 items
- **THEN** all 5 items remain visible in the list
- **AND** checked items do not disappear
- **AND** list count shows "5 productos"

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

### Requirement: Manual Shopping List Addition from Inventory
The system SHALL allow users to manually add products from their inventory to the shopping list, independent of stock level automation.

#### Scenario: User adds product to shopping list from inventory
- **GIVEN** user is viewing product catalog page (`/products`)
- **AND** product "Chocolate" exists in inventory with stock level "high"
- **AND** "Chocolate" is NOT currently in shopping list
- **WHEN** user clicks "Add to Shopping List" button on "Chocolate" product card
- **THEN** system creates a shopping list item with `reason='manual'` for "Chocolate"
- **AND** "Chocolate" appears in shopping list
- **AND** success toast displays "Producto añadido a la lista de la compra"
- **AND** "Add to Shopping List" button becomes disabled for "Chocolate"

#### Scenario: Manual item persists across sessions
- **GIVEN** user added "Bread" to shopping list manually
- **WHEN** user closes the application
- **AND** user reopens the application later
- **THEN** "Bread" remains in shopping list with `reason='manual'`
- **AND** manual items persist in localStorage

#### Scenario: Manual item shown in planning mode
- **GIVEN** user added "Coffee" manually to shopping list
- **WHEN** user navigates to `/shopping-list` (planning mode)
- **THEN** "Coffee" appears in the shopping list
- **AND** displays without differentiation from auto-added items
- **AND** shows stock level badge if applicable

#### Scenario: Manual item participates in shopping mode
- **GIVEN** shopping list contains manual item "Eggs" and auto item "Milk"
- **WHEN** user clicks "Iniciar Compra"
- **THEN** both "Eggs" and "Milk" appear on `/shopping/start` page
- **AND** both items have checkboxes (treated equally)
- **AND** manual items follow same shopping mode behavior as auto items

#### Scenario: Manual item removed after purchase registration
- **GIVEN** shopping list contains manual item "Sugar"
- **WHEN** user registers purchase including "Sugar"
- **THEN** `RecalculateShoppingList` use case executes
- **AND** shopping list regenerates based on inventory stock levels
- **AND** "Sugar" is removed from list (unless stock is low/empty)

### Requirement: Duplicate Prevention
The system SHALL prevent users from adding the same product to the shopping list multiple times, providing clear feedback when duplication is attempted.

#### Scenario: Button disabled for products already in shopping list
- **GIVEN** product "Milk" is already in shopping list (auto or manual)
- **AND** user is viewing product catalog page
- **WHEN** page renders "Milk" product card
- **THEN** "Add to Shopping List" button is disabled
- **AND** button appears grayed out (reduced opacity)
- **AND** tooltip displays "Ya en lista" when hovering over button
- **AND** cursor shows "not-allowed" when hovering over button

#### Scenario: Duplicate check at use case level
- **GIVEN** product "Eggs" is already in shopping list
- **WHEN** `AddManualShoppingListItem` use case is called for "Eggs"
- **THEN** use case checks `ShoppingListRepository.exists(productId)`
- **AND** use case throws error with message "Product already in shopping list"
- **AND** no duplicate item is created

#### Scenario: User feedback for duplicate attempt
- **GIVEN** product "Bread" is already in shopping list
- **AND** somehow user triggers add action (edge case: race condition, stale UI)
- **WHEN** system attempts to add "Bread" again
- **THEN** error is caught by UI
- **AND** info toast displays "Este producto ya está en tu lista de la compra"
- **AND** no duplicate item appears in shopping list

#### Scenario: Button re-enabled after product removed from list
- **GIVEN** product "Coffee" is in shopping list (button disabled)
- **WHEN** user removes "Coffee" from shopping list via shopping list page
- **AND** user returns to product catalog page
- **THEN** "Add to Shopping List" button becomes enabled for "Coffee"
- **AND** button shows normal styling (full opacity)
- **AND** tooltip displays "Añadir a lista de compra"

### Requirement: Shopping List Quick Actions UI
The system SHALL provide intuitive quick action buttons on product cards in the inventory catalog, allowing users to add products to the shopping list without navigation.

#### Scenario: Add to shopping list button appears on each product card
- **GIVEN** user is viewing product catalog page
- **WHEN** product cards are rendered
- **THEN** each product card displays an "Add to Shopping List" button
- **AND** button shows shopping cart icon (`ShoppingCart` from lucide-react)
- **AND** button is positioned with other action buttons (edit, delete, update stock)
- **AND** button appears on right side of product card

#### Scenario: Button provides accessible interaction
- **GIVEN** product card displays "Add to Shopping List" button
- **WHEN** user interacts with button
- **THEN** button has `aria-label` describing action: "Añadir [ProductName] a la lista de la compra"
- **AND** button has visible tooltip on hover
- **AND** button is keyboard accessible (focusable via Tab)
- **AND** button activates on Enter/Space key press

#### Scenario: Button visual feedback on hover
- **GIVEN** "Add to Shopping List" button is enabled
- **WHEN** user hovers over button
- **THEN** button background changes to green-50 (light green)
- **AND** icon color changes to green-600
- **AND** cursor changes to pointer
- **AND** tooltip appears after brief delay

#### Scenario: Button consistent styling with other actions
- **GIVEN** product card displays multiple action buttons (edit, delete, update stock, add to list)
- **WHEN** user views product card
- **THEN** all action buttons have consistent size (same height/width)
- **AND** all buttons use icon-only design with tooltips
- **AND** buttons align horizontally with consistent spacing
- **AND** button colors follow semantic conventions (blue=edit, red=delete, orange=update, green=add to list)

#### Scenario: Loading state during add operation
- **GIVEN** user clicks "Add to Shopping List" button
- **WHEN** operation is in progress (async)
- **THEN** button shows loading indicator (optional - depends on implementation speed)
- **OR** button becomes temporarily disabled to prevent double-clicks
- **AND** operation completes quickly (<500ms expected)

### Requirement: Manual Addition Error Handling
The system SHALL handle error conditions gracefully when users attempt to manually add products to the shopping list, providing clear feedback and recovery options.

#### Scenario: Product not found error
- **GIVEN** product ID exists in UI but product was deleted from repository
- **WHEN** user clicks "Add to Shopping List"
- **THEN** use case throws error "Product not found"
- **AND** error toast displays "Error al añadir a la lista. Por favor, intenta de nuevo."
- **AND** product list refreshes to reflect current state
- **AND** deleted product is removed from UI

#### Scenario: Repository failure error
- **GIVEN** localStorage is full or unavailable
- **WHEN** user attempts to add product to shopping list
- **THEN** repository throws error
- **AND** error is caught by UI layer
- **AND** error toast displays "Error al añadir a la lista. Por favor, intenta de nuevo."
- **AND** shopping list state remains unchanged

#### Scenario: Network error for repository (future-proof)
- **GIVEN** shopping list repository uses remote API (future scenario)
- **WHEN** user attempts to add product and network fails
- **THEN** error is handled gracefully
- **AND** user receives clear feedback about network issue
- **AND** system suggests retry or offline mode

#### Scenario: Graceful degradation when shopping list unavailable
- **GIVEN** shopping list repository fails to load initially
- **WHEN** user views product catalog
- **THEN** "Add to Shopping List" buttons are hidden or disabled
- **AND** user can still view products and perform other actions
- **AND** system logs error for debugging

