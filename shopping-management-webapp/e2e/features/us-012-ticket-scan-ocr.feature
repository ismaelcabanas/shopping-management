Feature: Ticket Scanning with OCR and Automatic Purchase Registration
  As a user who wants to quickly register purchases
  I want to scan my shopping receipt with my phone camera
  So that products and quantities are automatically detected and I can register them with minimal effort

  # Note: This feature describes the complete ticket scanning workflow for E2E testing.
  # The OCR service is mocked in E2E tests for speed and determinism.
  # Real OCR integration (Ollama) is tested manually (see docs/testing/manual-testing-checklist.md).

  Background:
    Given I have the following products in my catalog:
      | Product ID | Product Name  | Unit Type |
      | prod-001   | Leche Entera  | units     |
      | prod-002   | Pan de Molde  | units     |
      | prod-003   | Arroz Integral| kg        |
    And my current inventory is:
      | Product Name  | Stock |
      | Leche Entera  | 2     |
      | Pan de Molde  | 1     |
      | Arroz Integral| 0     |

  @smoke @critical
  Scenario: Successfully scan ticket and register purchase with matched products
    Given I am on the Product Catalog page
    When I click the "Escanear Ticket" button
    Then the Ticket Scan modal opens

    When I upload a ticket image "receipt-supermarket.jpg"
    Then I see a loading indicator while the image is being processed

    When the OCR processing completes successfully
    Then I see the detected items:
      | Product Name  | Quantity | Match Status |
      | Leche Entera  | 2        | matched      |
      | Pan de Molde  | 3        | matched      |
      | Arroz Integral| 1        | matched      |
    And the matched products show a green checkmark indicator

    When I click the "Confirmar Items" button
    Then the Ticket Scan modal closes
    And the Register Purchase modal opens
    And the modal is pre-filled with the detected items:
      | Product Name  | Quantity |
      | Leche Entera  | 2        |
      | Pan de Molde  | 3        |
      | Arroz Integral| 1        |

    When I click "Guardar Compra"
    Then I see a success message "Compra registrada exitosamente"
    And the Register Purchase modal closes
    And my inventory is updated to:
      | Product Name  | Stock |
      | Leche Entera  | 4     |
      | Pan de Molde  | 4     |
      | Arroz Integral| 1     |

  @critical
  Scenario: Scan ticket with mix of matched and unmatched products
    Given I am on the Product Catalog page
    When I click the "Escanear Ticket" button
    And I upload a ticket image "receipt-mixed-products.jpg"

    Then I see the detected items:
      | Product Name | Quantity | Match Status |
      | Leche Entera | 2        | matched      |
      | Tomates      | 5        | unmatched    |
    And the matched product "Leche Entera" shows a green checkmark
    And the unmatched product "Tomates" shows a warning indicator

    When I click "Confirmar Items"
    Then the Register Purchase modal opens with:
      | Product Name | Quantity | New Product Badge |
      | Leche Entera | 2        | No                |
      | Tomates      | 5        | Yes "(nuevo)"     |

    When I click "Guardar Compra"
    Then a new product "Tomates" is created automatically
    And the purchase is registered successfully
    And my inventory includes the new product "Tomates" with stock 5

  @edge-case
  Scenario: Scan ticket with only unmatched products (all new)
    Given I am on the Product Catalog page
    And my catalog is empty
    When I click the "Escanear Ticket" button
    And I upload a ticket image "receipt-new-products.jpg"

    Then I see the detected items:
      | Product Name | Quantity | Match Status |
      | Manzanas     | 3        | unmatched    |
      | Plátanos     | 2        | unmatched    |
    And all products show warning indicators

    When I click "Confirmar Items"
    Then the Register Purchase modal opens
    And all items show "(nuevo)" badge

    When I click "Guardar Compra"
    Then new products are created:
      | Product Name | Initial Stock |
      | Manzanas     | 3             |
      | Plátanos     | 2             |
    And the purchase is registered successfully

  @happy-path
  Scenario: Edit detected items before registering purchase
    Given I am on the Product Catalog page
    When I click the "Escanear Ticket" button
    And I upload a ticket image "receipt-simple.jpg"

    Then I see the detected items:
      | Product Name | Quantity |
      | Leche Entera | 2        |
      | Pan de Molde | 1        |

    When I click "Confirmar Items"
    Then the Register Purchase modal opens with pre-filled items

    When I manually add "Arroz Integral" with quantity 3
    And I remove "Pan de Molde" from the list
    Then the purchase list shows:
      | Product Name   | Quantity |
      | Leche Entera   | 2        |
      | Arroz Integral | 3        |

    When I click "Guardar Compra"
    Then the purchase is registered with the edited items
    And my inventory reflects the changes

  @error-handling
  Scenario: OCR processing fails gracefully
    Given I am on the Product Catalog page
    When I click the "Escanear Ticket" button
    And I upload a ticket image "receipt-corrupted.jpg"

    When the OCR processing fails
    Then I see an error message "Error al procesar el ticket"
    And I remain in the Ticket Scan modal
    And I can try uploading a different image

  @error-handling
  Scenario: No products detected in ticket
    Given I am on the Product Catalog page
    When I click the "Escanear Ticket" button
    And I upload a ticket image "receipt-blank.jpg"

    When the OCR returns no products
    Then I see a message "No se detectaron productos en el ticket"
    And the "Confirmar Items" button is disabled
    And I can upload a different image

  @user-workflow
  Scenario: Cancel ticket scan workflow
    Given I am on the Product Catalog page
    When I click the "Escanear Ticket" button
    And I upload a ticket image "receipt-simple.jpg"
    And the detected items are displayed

    When I click the "Cerrar" or "X" button on the modal
    Then the Ticket Scan modal closes
    And no purchase is registered
    And my inventory remains unchanged

  @user-workflow
  Scenario: Cancel from Register Purchase modal after ticket scan
    Given I have scanned a ticket successfully
    And the Register Purchase modal is open with pre-filled items

    When I click "Cancelar"
    Then the Register Purchase modal closes
    And no purchase is registered
    And my inventory remains unchanged

  @integration
  Scenario: Complete flow from ticket scan to inventory verification
    Given I am on the Product Catalog page
    And my "Leche Entera" inventory is 2 units

    When I scan a ticket with "Leche Entera | 3"
    And I confirm the detected items
    And I save the purchase

    Then I see "Compra registrada exitosamente"
    And the Product Catalog page shows updated inventory
    And "Leche Entera" now has 5 units
    And the product card reflects the new quantity

  @performance
  Scenario: Fast ticket scanning workflow (with mocked OCR)
    Given I am on the Product Catalog page
    When I start the timer
    And I click "Escanear Ticket"
    And I upload a ticket image
    And I confirm the detected items
    And I save the purchase

    Then the entire workflow completes in less than 5 seconds
    And I see the success confirmation

  @accessibility
  Scenario: Ticket scanning is accessible via keyboard navigation
    Given I am on the Product Catalog page
    When I navigate to "Escanear Ticket" button using Tab key
    And I press Enter to open the modal
    And I use Tab to navigate to file upload
    And I upload an image using keyboard shortcuts

    Then the flow completes successfully
    And all interactive elements are keyboard-accessible

  # Future scenarios (not yet implemented)

  @future @ml-improvement
  Scenario: Learn from user corrections to improve matching
    # When users correct OCR mismatches, the system learns
    # and improves future product matching accuracy

  @future @multiple-stores
  Scenario: Detect store from ticket and suggest prices
    # OCR could detect store name and link to store-specific pricing

  @future @receipt-history
  Scenario: Save scanned receipts for future reference
    # Users might want to keep digital copies of receipts
