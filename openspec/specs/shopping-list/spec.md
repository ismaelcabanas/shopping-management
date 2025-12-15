# shopping-list Specification

## Purpose
TBD - created by archiving change add-shopping-list-checkbox. Update Purpose after archive.
## Requirements
### Requirement: Shopping List Item Checked State
Shopping list items SHALL maintain a checked state that persists across sessions and page navigations.

#### Scenario: User checks item while shopping
- **GIVEN** a shopping list with 3 items (Milk, Eggs, Bread)
- **WHEN** user clicks checkbox next to "Milk"
- **THEN** "Milk" checkbox shows checkmark (✓)
- **AND** "Milk" text has strikethrough decoration (line-through)
- **AND** "Milk" text opacity reduces to 0.6
- **AND** "Milk" remains visible in the list
- **AND** other items (Eggs, Bread) remain unchecked

#### Scenario: User unchecks previously checked item
- **GIVEN** shopping list item "Eggs" is checked
- **WHEN** user clicks checkbox next to "Eggs"
- **THEN** "Eggs" checkbox becomes unchecked
- **AND** "Eggs" strikethrough decoration is removed
- **AND** "Eggs" text returns to full opacity (1.0)

#### Scenario: Checked state persists after page reload
- **GIVEN** user has checked "Milk" and "Bread" in shopping list
- **WHEN** user navigates away to Product Catalog page
- **AND** user navigates back to Shopping List page
- **THEN** "Milk" and "Bread" remain checked
- **AND** "Eggs" remains unchecked

#### Scenario: New items default to unchecked
- **GIVEN** shopping list with 2 checked items
- **WHEN** new product "Tomatoes" is auto-added (low stock)
- **THEN** "Tomatoes" appears unchecked
- **AND** existing checked items remain checked

#### Scenario: Existing data without checked field
- **GIVEN** localStorage contains shopping list items without "checked" field (legacy data)
- **WHEN** application loads shopping list
- **THEN** all items default to checked = false
- **AND** no errors occur

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

