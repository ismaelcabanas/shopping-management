# Spec Delta: shopping-list

## ADDED Requirements

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
