# Shopping List Spec Delta

## ADDED Requirements

### Requirement: Purchase Recording Integration

The Shopping List page SHALL provide integrated purchase recording functionality to allow users to register purchases (manually or via ticket scanning) after shopping trips, updating inventory accordingly.

#### Scenario: User registers purchase manually from shopping list

**Given** the user has completed a shopping trip
**And** the user navigates to the Shopping List page
**When** the user clicks the "Registrar Compra" button
**Then** the RegisterPurchaseModal SHALL open
**And** the user SHALL be able to enter purchased products and quantities
**And** upon confirmation, the system SHALL update inventory stock levels
**And** the system SHALL recalculate the shopping list based on new stock levels

#### Scenario: User scans ticket from shopping list with OCR available

**Given** the user has completed a shopping trip
**And** the OCR service is configured (API key present)
**And** the user navigates to the Shopping List page
**When** the user clicks the "Escanear Ticket" button
**Then** the TicketScanModal SHALL open
**And** the user SHALL be able to upload a receipt image
**And** the system SHALL process the image with OCR
**And** the system SHALL display detected products for review
**And** upon confirmation, the system SHALL open RegisterPurchaseModal with pre-filled items
**And** the user SHALL be able to confirm or adjust the detected items
**And** upon final confirmation, the system SHALL update inventory and recalculate shopping list

#### Scenario: User sees OCR warning when API key not configured

**Given** the OCR service is NOT configured (API key missing)
**And** the user navigates to the Shopping List page
**Then** the system SHALL display a warning alert
**And** the alert SHALL inform the user that OCR scanning requires configuration
**And** the alert SHALL be closable
**And** the "Escanear Ticket" button SHALL still be visible but may indicate unavailability

#### Scenario: Purchase recording buttons are prominently displayed

**Given** the user navigates to the Shopping List page
**Then** the "Registrar Compra" button SHALL be displayed in the page header
**And** the "Escanear Ticket" button SHALL be displayed in the page header
**And** the buttons SHALL be placed below the shopping list title and count
**And** the buttons SHALL use appropriate visual hierarchy (primary for manual entry, secondary for scanning)
**And** the buttons SHALL be accessible on all device sizes (mobile, tablet, desktop)
