Feature: Product Catalog - Domain Behavior
  As a domain model
  I want to enforce business rules for products and inventory
  So that the system maintains data integrity and consistency

  # ===== Product Value Objects =====

  @domain @value-object
  Scenario: Create a valid ProductId from UUID
    Given a valid UUID "550e8400-e29b-41d4-a716-446655440000"
    When I create a ProductId
    Then the ProductId is created successfully
    And it contains the correct UUID value

  @domain @value-object
  Scenario: Reject invalid ProductId format
    Given an invalid UUID "not-a-uuid"
    When I try to create a ProductId
    Then I receive a validation error "Invalid UUID format"

  @domain @value-object
  Scenario: Create UnitType with "units"
    Given the unit type "units"
    When I create a UnitType
    Then the UnitType is created successfully
    And it has the value "units"

  @domain @value-object
  Scenario: Reject invalid UnitType
    Given an invalid unit type "kilograms"
    When I try to create a UnitType
    Then I receive a validation error "Invalid unit type. Only 'units' is allowed"

  @domain @value-object
  Scenario: Create valid Quantity with zero
    Given a quantity value of 0
    When I create a Quantity
    Then the Quantity is created successfully
    And it has the value 0

  @domain @value-object
  Scenario: Create valid Quantity with positive number
    Given a quantity value of 10
    When I create a Quantity
    Then the Quantity is created successfully
    And it has the value 10

  @domain @value-object
  Scenario: Reject negative Quantity
    Given a quantity value of -5
    When I try to create a Quantity
    Then I receive a validation error "Quantity cannot be negative"

  # ===== Product Entity =====

  @domain @entity
  Scenario: Create a valid Product
    Given a ProductId "550e8400-e29b-41d4-a716-446655440000"
    And a product name "Milk"
    And a unit type "units"
    When I create a Product
    Then the Product is created successfully
    And the Product has the correct ID "550e8400-e29b-41d4-a716-446655440000"
    And the Product has the name "Milk"
    And the Product has unit type "units"

  @domain @entity @validation
  Scenario: Reject Product with empty name
    Given a ProductId "550e8400-e29b-41d4-a716-446655440000"
    And an empty product name
    And a unit type "units"
    When I try to create a Product
    Then I receive a validation error "Product name cannot be empty"

  @domain @entity @validation
  Scenario: Reject Product with name shorter than 2 characters
    Given a ProductId "550e8400-e29b-41d4-a716-446655440000"
    And a product name "M"
    And a unit type "units"
    When I try to create a Product
    Then I receive a validation error "Product name must be at least 2 characters"

  @domain @entity @validation
  Scenario: Product names are trimmed
    Given a ProductId "550e8400-e29b-41d4-a716-446655440000"
    And a product name "  Milk  "
    And a unit type "units"
    When I create a Product
    Then the Product is created successfully
    And the Product has the name "Milk"

  # ===== InventoryItem Aggregate =====

  @domain @aggregate
  Scenario: Create an InventoryItem with initial stock
    Given a ProductId "550e8400-e29b-41d4-a716-446655440000"
    And an initial quantity of 5
    And a unit type "units"
    When I create an InventoryItem
    Then the InventoryItem is created successfully
    And the current stock is 5
    And the unit type is "units"

  @domain @aggregate
  Scenario: Create an InventoryItem with zero stock
    Given a ProductId "550e8400-e29b-41d4-a716-446655440000"
    And an initial quantity of 0
    And a unit type "units"
    When I create an InventoryItem
    Then the InventoryItem is created successfully
    And the current stock is 0

  @domain @aggregate
  Scenario: Update InventoryItem stock
    Given an existing InventoryItem with stock 5
    When I update the stock to 10
    Then the current stock is 10

  @domain @aggregate
  Scenario: Reduce InventoryItem stock
    Given an existing InventoryItem with stock 10
    When I update the stock to 3
    Then the current stock is 3

  @domain @aggregate @validation
  Scenario: Cannot set negative stock
    Given an existing InventoryItem with stock 5
    When I try to update the stock to -2
    Then I receive a validation error "Quantity cannot be negative"
    And the current stock remains 5

  # ===== Repository Behavior =====

  @domain @repository
  Scenario: Save and retrieve a Product
    Given a Product "Milk" with ID "550e8400-e29b-41d4-a716-446655440000"
    When I save the Product to the repository
    And I retrieve the Product by ID "550e8400-e29b-41d4-a716-446655440000"
    Then I get the Product "Milk"

  @domain @repository
  Scenario: Retrieve all Products returns empty list when no products exist
    Given the repository is empty
    When I retrieve all Products
    Then I get an empty list

  @domain @repository
  Scenario: Retrieve all Products returns all saved products
    Given I have saved products "Milk", "Bread", "Eggs"
    When I retrieve all Products
    Then I get 3 products
    And the products are "Milk", "Bread", "Eggs"

  @domain @repository
  Scenario: Product not found returns null
    Given the repository is empty
    When I retrieve a Product by ID "550e8400-e29b-41d4-a716-446655440000"
    Then I get null

  @domain @repository
  Scenario: Save and retrieve an InventoryItem
    Given an InventoryItem for ProductId "550e8400-e29b-41d4-a716-446655440000" with stock 5
    When I save the InventoryItem to the repository
    And I retrieve the InventoryItem by ProductId "550e8400-e29b-41d4-a716-446655440000"
    Then I get the InventoryItem with stock 5

  @domain @repository
  Scenario: Update existing InventoryItem in repository
    Given an InventoryItem for ProductId "550e8400-e29b-41d4-a716-446655440000" with stock 5
    And the InventoryItem is saved
    When I update the stock to 10
    And I save the InventoryItem again
    And I retrieve the InventoryItem by ProductId "550e8400-e29b-41d4-a716-446655440000"
    Then I get the InventoryItem with stock 10

  # ===== Use Case: AddProductToInventory =====

  @domain @use-case
  Scenario: Successfully add a new product to inventory
    Given a product name "Milk"
    And an initial quantity of 2
    And the product does not exist in the catalog
    When I execute AddProductToInventory
    Then a new Product is created with name "Milk"
    And a new InventoryItem is created with quantity 2
    And both are saved to their respective repositories

  @domain @use-case @validation
  Scenario: Cannot add duplicate product
    Given a product "Milk" already exists in the catalog
    And I want to add a product named "Milk" with quantity 3
    When I execute AddProductToInventory
    Then I receive a domain error "A product with that name already exists"
    And no new product is created
    And no new inventory item is created

  @domain @use-case @validation
  Scenario: Cannot add product with invalid name
    Given a product name "M"
    And an initial quantity of 5
    When I execute AddProductToInventory
    Then I receive a validation error "Product name must be at least 2 characters"

  @domain @use-case
  Scenario: Add product with zero initial quantity
    Given a product name "Coffee"
    And an initial quantity of 0
    And the product does not exist in the catalog
    When I execute AddProductToInventory
    Then a new Product is created with name "Coffee"
    And a new InventoryItem is created with quantity 0

  # ===== Use Case: GetAllProducts =====

  @domain @use-case
  Scenario: Get all products returns empty when catalog is empty
    Given the catalog is empty
    When I execute GetAllProducts
    Then I receive an empty list

  @domain @use-case
  Scenario: Get all products returns all products with their inventory
    Given the following products exist in the catalog:
      | Name  | Quantity |
      | Milk  | 2        |
      | Bread | 1        |
      | Eggs  | 12       |
    When I execute GetAllProducts
    Then I receive 3 products
    And each product includes its inventory quantity

  @domain @use-case
  Scenario: Get all products returns products sorted alphabetically
    Given the following products exist in the catalog:
      | Name   | Quantity |
      | Eggs   | 12       |
      | Milk   | 2        |
      | Bread  | 1        |
    When I execute GetAllProducts
    Then the products are returned in alphabetical order:
      | Name  |
      | Bread |
      | Eggs  |
      | Milk  |
