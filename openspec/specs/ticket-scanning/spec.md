# ticket-scanning Specification

## Purpose
TBD - created by archiving change add-exclude-scanned-products. Update Purpose after archive.
## Requirements
### Requirement: Product Exclusion from Scanned List
The system SHALL allow users to exclude individual products from the scanned ticket list before confirming the purchase registration.

#### Scenario: User removes product from scanned list
- **GIVEN** a ticket has been scanned and OCR extracted 5 products
- **AND** the scanned product list is displayed in RegisterPurchaseModal
- **WHEN** the user clicks the delete/trash button next to a product
- **THEN** the product is removed from the list immediately
- **AND** the list displays only 4 products (one less)
- **AND** the deleted product is NOT registered when the user confirms the purchase

#### Scenario: User removes multiple products from scanned list
- **GIVEN** a ticket has been scanned with products: ["Plátanos", "Papel higiénico", "Lejía", "Leche"]
- **AND** the user wants to track only food items in inventory
- **WHEN** the user clicks delete on "Papel higiénico"
- **AND** clicks delete on "Lejía"
- **THEN** only ["Plátanos", "Leche"] remain in the list
- **AND** when confirmed, only these 2 products are added to inventory

#### Scenario: Delete button is visible for each scanned product
- **GIVEN** the RegisterPurchaseModal displays a list of scanned products
- **WHEN** the modal is rendered
- **THEN** each product row SHALL display a trash/delete icon button
- **AND** the button SHALL be positioned on the right side of the product row
- **AND** the button SHALL have accessible label text for screen readers

### Requirement: Purchase Total Recalculation
When products are excluded, the system SHALL recalculate the purchase total to reflect only the remaining products.

#### Scenario: Total price updates after removing products
- **GIVEN** scanned products with prices:
  - "Leche" - 1.50€
  - "Pan" - 0.80€
  - "Huevos" - 2.20€
- **AND** initial total is 4.50€
- **WHEN** user removes "Pan" (0.80€)
- **THEN** the total price is updated to 3.70€
- **AND** the total reflects only "Leche" + "Huevos"

#### Scenario: Total displays zero when all products removed
- **GIVEN** scanned products ["Producto A", "Producto B"]
- **WHEN** user removes both products
- **THEN** the total price displays 0.00€
- **AND** the confirm button MAY be disabled (implementation choice)

