Feature: Product Catalog - Manual Management (Iteration 1)
  As a Shopping Manager user
  I want to manually add products to my catalog with their initial quantity
  So that I can manage my pantry inventory

  Background:
    Given I am in the Shopping Manager application
    And the product catalog is empty

  @iteration-1 @happy-path
  Scenario: View empty catalog at start
    When I navigate to the "My Pantry" page
    Then I see the message "No products in your pantry"
    And I see a floating button to "Add Product"

  @iteration-1 @happy-path
  Scenario: Add a new product with initial quantity
    Given I am on the "My Pantry" page
    When I click the "Add Product" button
    Then I navigate to the "Add Product" page
    And I see a form with the following fields:
      | Field    | Type   | Placeholder           |
      | Name     | text   | e.g. Milk, Bread...   |
      | Quantity | number | 0                     |
    When I fill in the "Name" field with "Milk"
    And I fill in the "Quantity" field with "2"
    And I click the "Save" button
    Then the product "Milk" is saved in the catalog
    And I navigate back to the "My Pantry" page
    And I see the product "Milk" in the list with quantity "2 units"

  @iteration-1 @happy-path
  Scenario: Add multiple products to the catalog
    Given I am on the "Add Product" page
    When I add the product "Milk" with quantity "2"
    And I navigate back to "My Pantry"
    And I click the "Add Product" button
    And I add the product "Bread" with quantity "1"
    And I navigate back to "My Pantry"
    And I click the "Add Product" button
    And I add the product "Eggs" with quantity "12"
    Then I see the following products in the catalog:
      | Name  | Quantity   |
      | Bread | 1 units    |
      | Eggs  | 12 units   |
      | Milk  | 2 units    |
    And the products are sorted alphabetically

  @iteration-1 @happy-path
  Scenario: Add product with initial quantity zero
    Given I am on the "Add Product" page
    When I fill in the "Name" field with "Coffee"
    And I fill in the "Quantity" field with "0"
    And I click the "Save" button
    Then the product "Coffee" is saved in the catalog
    And I see the product "Coffee" in the list with quantity "0 units"

  @iteration-1 @validation
  Scenario: Try to add product without name
    Given I am on the "Add Product" page
    When I leave the "Name" field empty
    And I fill in the "Quantity" field with "5"
    And I click the "Save" button
    Then I see an error message "Name is required"
    And the form is not submitted
    And I remain on the "Add Product" page

  @iteration-1 @validation
  Scenario: Try to add product with very short name
    Given I am on the "Add Product" page
    When I fill in the "Name" field with "A"
    And I fill in the "Quantity" field with "5"
    And I click the "Save" button
    Then I see an error message "Name must be at least 2 characters"
    And the form is not submitted

  @iteration-1 @validation
  Scenario: Try to add product with negative quantity
    Given I am on the "Add Product" page
    When I fill in the "Name" field with "Sugar"
    And I fill in the "Quantity" field with "-3"
    And I click the "Save" button
    Then I see an error message "Quantity cannot be negative"
    And the form is not submitted

  @iteration-1 @validation
  Scenario: Try to add duplicate product
    Given the product "Milk" exists in the catalog
    And I am on the "Add Product" page
    When I fill in the "Name" field with "Milk"
    And I fill in the "Quantity" field with "1"
    And I click the "Save" button
    Then I see an error message "A product with that name already exists"
    And the form is not submitted
    And I remain on the "Add Product" page

  @iteration-1 @navigation
  Scenario: Go back to catalog without saving
    Given I am on the "Add Product" page
    And I have filled in the "Name" field with "Rice"
    And I have filled in the "Quantity" field with "3"
    When I click the "Back" button
    Then I navigate to the "My Pantry" page
    And the product "Rice" does NOT appear in the catalog
    And no changes have been saved

  @iteration-1 @persistence
  Scenario: Data persistence in localStorage
    Given I have added the following products:
      | Name     | Quantity |
      | Milk     | 2        |
      | Bread    | 1        |
      | Tomatoes | 5        |
    When I close the application
    And I reopen the application
    And I navigate to the "My Pantry" page
    Then I see the following products in the catalog:
      | Name     | Quantity   |
      | Bread    | 1 units    |
      | Milk     | 2 units    |
      | Tomatoes | 5 units    |

  @iteration-1 @mobile @ui
  Scenario: Mobile-friendly form without involuntary zoom
    Given I am using an iOS mobile device
    And I am on the "Add Product" page
    When I tap on the "Name" field
    Then the field is focused correctly
    And NO involuntary zoom occurs on the page
    And the input font size is at least 16px

  @iteration-1 @mobile @ui
  Scenario: Touch-friendly buttons
    Given I am using a mobile device
    And I am on the "My Pantry" page
    When I observe the floating "Add Product" button
    Then the button has a minimum size of 56x56px
    And it is easy to tap with a finger

  @iteration-1 @mobile @ui
  Scenario: Touch-friendly product list
    Given I have several products in the catalog
    And I am on the "My Pantry" page
    When I observe the list items
    Then each item has a minimum height of 60px
    And the items have generous padding for easy reading

  @iteration-1 @ui @loading
  Scenario: Show skeleton loader while loading products
    Given I am loading the "My Pantry" page
    And there are products saved in localStorage
    When the page is loading
    Then I see a skeleton loader
    And the skeleton simulates the structure of the product list
    When the products finish loading
    Then the skeleton disappears
    And I see the real product list

  @iteration-1 @ui @empty-state
  Scenario: Empty state with call-to-action
    Given the catalog is empty
    And I am on the "My Pantry" page
    Then I see a representative illustration or icon
    And I see the message "No products in your pantry"
    And I see the text "Add your first product by tapping the + button"
    And I see the floating button clearly visible