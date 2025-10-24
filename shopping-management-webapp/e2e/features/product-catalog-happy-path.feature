Feature: Product Catalog - Critical User Journeys
  As a user of Shopping Manager
  I want to add products to my pantry
  So that I can track what I have at home

  Background:
    Given the application is running
    And localStorage is cleared

  @e2e @critical @happy-path
  Scenario: User adds first product to empty catalog
    Given I navigate to "http://localhost:5173/catalog"
    And the catalog is empty
    Then I see the empty state message "No products in your pantry"
    And I see the floating "Add Product" button

    When I click the floating "Add Product" button
    Then I am on the "Add Product" page
    And I see the product form

    When I fill in the "Name" field with "Milk"
    And I fill in the "Quantity" field with "2"
    And I click the "Save" button
    Then I am redirected to the "My Pantry" page
    And I see the product "Milk" in the list
    And the product "Milk" shows quantity "2 units"

  @e2e @critical @happy-path
  Scenario: User adds multiple products and sees them sorted
    Given I navigate to "http://localhost:5173/catalog"

    # Add first product
    When I click the floating "Add Product" button
    And I add a product with name "Eggs" and quantity "12"
    Then I see "Eggs" with "12 units" in the catalog

    # Add second product
    When I click the floating "Add Product" button
    And I add a product with name "Milk" and quantity "2"
    Then I see "Milk" with "2 units" in the catalog

    # Add third product
    When I click the floating "Add Product" button
    And I add a product with name "Bread" and quantity "1"
    Then I see "Bread" with "1 units" in the catalog

    # Verify alphabetical order
    And the products are displayed in this order:
      | Name  |
      | Bread |
      | Eggs  |
      | Milk  |

  @e2e @critical @persistence
  Scenario: Products persist after page reload
    Given I navigate to "http://localhost:5173/catalog"

    # Add products
    When I add a product with name "Milk" and quantity "2"
    And I add a product with name "Bread" and quantity "1"
    Then I see 2 products in the catalog

    # Reload page
    When I reload the page
    Then I still see 2 products in the catalog
    And I see "Milk" with "2 units" in the catalog
    And I see "Bread" with "1 units" in the catalog

  @e2e @mobile @touch-friendly
  Scenario: Mobile user can easily interact with touch elements
    Given I am using a mobile viewport (375px width)
    And I navigate to "http://localhost:5173/catalog"

    # Verify FAB is touch-friendly
    Then the floating "Add Product" button has minimum size 56x56px

    When I click the floating "Add Product" button
    Then I am on the "Add Product" page

    # Verify inputs don't cause zoom
    When I tap on the "Name" input field
    Then the input is focused
    And no involuntary zoom occurs
    And the input font size is at least 16px

    # Verify form submission works on mobile
    When I fill in the "Name" field with "Milk"
    And I fill in the "Quantity" field with "2"
    And I tap the "Save" button
    Then I am redirected to the "My Pantry" page
    And I see the product "Milk" in the list

# ====================================================================
# NOTE: These scenarios are for DOCUMENTATION purposes only.
#
# Implementation plan:
# - The domain behavior is tested with unit tests (Vitest)
# - Component behavior is tested with React Testing Library
# - These E2E tests validate the critical happy paths only
#
# These scenarios can be implemented later with Playwright when needed.
# For now, they serve as specification and acceptance criteria.
# ====================================================================