Feature: Register Purchase and Update Inventory
  As a user who just finished shopping
  I want to register purchased products and their quantities
  So that my inventory is automatically updated without manual effort

  # Note: This feature describes the behavior for E2E testing.
  # Validation rules and edge cases are covered by unit and integration tests.

  Background:
    Given I have the following products in my inventory:
      | Product | Current Stock |
      | Milk    | 5             |
      | Bread   | 2             |
      | Rice    | 0             |

  @smoke @critical
  Scenario: Register purchase updates inventory
    When I register a purchase containing:
      | Product | Quantity |
      | Milk    | 3        |
      | Bread   | 4        |
    Then my inventory shows:
      | Product | Stock |
      | Milk    | 8     |
      | Bread   | 6     |
    And I receive confirmation that the purchase was registered

  @smoke @critical
  Scenario: Build purchase incrementally and confirm
    Given I am preparing a purchase
    When I add 3 units of Milk
    And I add 4 units of Bread
    And I confirm the purchase
    Then my inventory shows:
      | Product | Stock |
      | Milk    | 8     |
      | Bread   | 6     |

  @critical
  Scenario: Cancel purchase leaves inventory unchanged
    Given I am preparing a purchase of 3 units of Milk
    When I cancel the purchase
    Then my Milk inventory remains at 5 units
    And I do not receive any confirmation message

  # Validation rules are tested at unit/integration level
  # These scenarios document the expected behavior but may not need E2E automation

  @unit-covered
  Scenario: Cannot register purchase with invalid quantity
    When I attempt to register a purchase of 0 units of Milk
    Then the purchase is rejected with an appropriate error message
    # Covered by: RegisterPurchase.test.ts

  @unit-covered
  Scenario: Cannot register purchase for non-existent product
    When I attempt to register a purchase of 5 units of UnknownProduct
    Then the purchase is rejected with an appropriate error message
    # Covered by: RegisterPurchase.test.ts

  @unit-covered
  Scenario: Purchase creates inventory record when none exists
    Given Eggs is in my catalog but has no inventory record
    When I register a purchase of 6 units of Eggs
    Then an inventory record is created for Eggs with 6 units
    # Covered by: RegisterPurchase.test.ts

  @integration-covered
  Scenario: Purchase maintains data integrity on failure
    When I attempt to register a purchase with invalid data
    Then the entire purchase is rejected atomically
    And no partial updates are applied
    # Covered by: RegisterPurchase.test.ts
