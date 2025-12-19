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

### Requirement: OCR Provider Configuration
The system SHALL support configurable OCR providers through environment variables, allowing operators to select the OCR service implementation without code changes.

#### Scenario: Provider selected via environment variable
- **GIVEN** environment variable `VITE_OCR_PROVIDER=ollama` is set
- **WHEN** the application initializes OCR service
- **THEN** the system creates an `OllamaVisionOCRService` instance
- **AND** ticket scanning uses the Ollama provider for text extraction

#### Scenario: Default provider when variable not set
- **GIVEN** environment variable `VITE_OCR_PROVIDER` is not set
- **WHEN** the application initializes OCR service
- **THEN** the system defaults to creating a `GeminiVisionOCRService` instance
- **AND** behavior is identical to pre-configuration system

#### Scenario: Mock provider for testing
- **GIVEN** environment variable `VITE_OCR_PROVIDER=mock` is set
- **WHEN** the application initializes OCR service
- **THEN** the system creates a `MockOCRService` instance
- **AND** ticket scanning returns mock data without external API calls

#### Scenario: Invalid provider name
- **GIVEN** environment variable `VITE_OCR_PROVIDER=invalid-provider` is set
- **WHEN** the application attempts to initialize OCR service
- **THEN** the system throws an error with message "Unknown OCR provider: invalid-provider"
- **AND** the application fails to start (fail-fast behavior)

#### Scenario: Gemini provider requires API key
- **GIVEN** environment variable `VITE_OCR_PROVIDER=gemini` is set
- **AND** environment variable `VITE_GEMINI_API_KEY` is not set
- **WHEN** the application attempts to initialize OCR service
- **THEN** the system throws an error indicating missing API key
- **AND** error message includes link to obtain API key: https://makersuite.google.com/app/apikey
- **AND** the application fails to start (fail-fast validation)

#### Scenario: Ollama provider with custom URL
- **GIVEN** environment variable `VITE_OCR_PROVIDER=ollama` is set
- **AND** environment variable `VITE_OLLAMA_URL=http://192.168.1.100:11434` is set
- **WHEN** the application initializes OCR service
- **THEN** the system creates an `OllamaVisionOCRService` with custom URL
- **AND** ticket scanning connects to the specified Ollama server

#### Scenario: Ollama provider uses default URL when not specified
- **GIVEN** environment variable `VITE_OCR_PROVIDER=ollama` is set
- **AND** environment variable `VITE_OLLAMA_URL` is not set
- **WHEN** the application initializes OCR service
- **THEN** the system creates an `OllamaVisionOCRService` with default URL `http://localhost:11434`

### Requirement: OCR Provider Factory
The system SHALL provide a centralized factory for creating OCR service instances, abstracting provider selection logic from presentation and application layers.

#### Scenario: Factory creates correct provider instance
- **GIVEN** `OCRServiceFactory.create()` is called with provider `'gemini'`
- **AND** all required environment variables are set
- **WHEN** factory executes
- **THEN** factory returns an instance of `GeminiVisionOCRService`
- **AND** instance implements `OCRService` interface
- **AND** instance is properly configured with API key and model

#### Scenario: Factory reads from environment by default
- **GIVEN** environment variable `VITE_OCR_PROVIDER=ollama` is set
- **WHEN** `OCRServiceFactory.create()` is called without arguments
- **THEN** factory reads provider from environment variable
- **AND** factory returns an instance of `OllamaVisionOCRService`

#### Scenario: Factory supports explicit provider override
- **GIVEN** environment variable `VITE_OCR_PROVIDER=gemini` is set
- **WHEN** `OCRServiceFactory.create('mock')` is called with explicit provider
- **THEN** factory ignores environment variable
- **AND** factory returns an instance of `MockOCRService`
- **AND** this enables testing without changing environment

#### Scenario: Factory validates configuration before instantiation
- **GIVEN** provider `'gemini'` is selected
- **AND** `VITE_GEMINI_API_KEY` environment variable is empty
- **WHEN** `OCRServiceFactory.create('gemini')` is called
- **THEN** factory throws descriptive error before attempting to create service
- **AND** error includes remediation steps
- **AND** no partial OCR service instance is created

#### Scenario: Factory is stateless and reusable
- **GIVEN** `OCRServiceFactory.create('mock')` has been called once
- **WHEN** `OCRServiceFactory.create('ollama')` is called subsequently
- **THEN** factory returns a new `OllamaVisionOCRService` instance
- **AND** previous mock instance does not affect the new instance
- **AND** factory has no side effects between calls

