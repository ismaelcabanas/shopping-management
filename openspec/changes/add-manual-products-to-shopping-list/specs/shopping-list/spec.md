# Shopping List Spec Delta

## ADDED Requirements

### Requirement: Manual Product Addition

The Shopping List page SHALL provide the ability to manually add new products to the shopping list, including products that do not yet exist in the user's product catalog. The system SHALL create these products with empty stock, automatically adding them to the shopping list.

#### Scenario: User adds product from Shopping List page before shopping

**Given** the user is planning their shopping trip
**And** the user navigates to the Shopping List page
**And** the user needs a product not in their inventory
**When** the user clicks the "+ Añadir Producto" button
**Then** the AddProductToListModal SHALL open
**And** the user SHALL be able to enter product name and unit type
**And** upon submission, the system SHALL create the product with stock='empty'
**And** the system SHALL automatically add the product to the shopping list
**And** the system SHALL display a success message
**And** the product SHALL appear immediately in the shopping list

#### Scenario: User adds product during active shopping

**Given** the user is actively shopping (Active Shopping page)
**And** the user realizes they need a product not on their list
**When** the user clicks the quick-add button
**Then** the AddProductToListModal SHALL open
**And** the user SHALL be able to enter product name and unit type
**And** upon submission, the system SHALL create the product with stock='empty'
**And** the system SHALL add the product to the active shopping list
**And** the product SHALL be immediately available to check off
**And** the system SHALL display a success message

#### Scenario: User sees product addition button in empty shopping list

**Given** the user navigates to the Shopping List page
**And** the shopping list is empty (no products)
**Then** the system SHALL display an EmptyState component
**And** the EmptyState SHALL include a prominent "+ Añadir Producto" call-to-action button
**And** clicking the button SHALL open the AddProductToListModal
**And** the user SHALL be able to add their first product

#### Scenario: System validates product creation

**Given** the user opens the AddProductToListModal
**When** the user attempts to submit the form
**Then** the system SHALL validate that product name is required (minimum 2 characters)
**And** the system SHALL validate that unit type is selected
**And** the system SHALL trim whitespace from product name
**And** if validation fails, the system SHALL display validation error messages
**And** if validation passes, the system SHALL create the product and add to shopping list

#### Scenario: Product creation with duplicate name (optional enhancement)

**Given** the user enters a product name in the AddProductToListModal
**And** a similar product already exists in the catalog (case-insensitive match)
**When** the user submits the form
**Then** the system MAY warn the user about the duplicate
**And** the system MAY show existing similar products
**And** the system MAY allow the user to select existing product or create new
**And** if the user chooses to create new, the system SHALL proceed with creation

#### Scenario: Manual product addition button placement

**Given** the user navigates to the Shopping List page
**Then** the "+ Añadir Producto" button SHALL be displayed in the page header
**And** the button SHALL be placed prominently below the shopping list title
**And** the button SHALL use appropriate visual hierarchy (Plus icon + text label)
**And** the button SHALL be accessible on all device sizes (mobile, tablet, desktop)
**And** on mobile, the button SHALL have adequate touch target size (minimum 44px height)

#### Scenario: Quick-add button in Active Shopping page

**Given** the user is on the Active Shopping page
**Then** the quick-add button SHALL be visible and accessible
**And** the button SHALL be positioned for easy access during shopping
**And** the button SHALL use a Plus icon to indicate addition
**And** clicking the button SHALL open the same AddProductToListModal
**And** the button SHALL not interfere with existing shopping list functionality
