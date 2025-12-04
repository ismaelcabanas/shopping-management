# product-matching Specification

## Purpose
TBD - created by archiving change improve-product-matching. Update Purpose after archive.
## Requirements
### Requirement: Text Normalization for Product Matching
The product matching algorithm SHALL normalize product names before calculating similarity to handle variations in formatting, brands, and descriptions.

#### Scenario: Remove brand names from product text
- **GIVEN** a ticket product "PLATANO GABECERAS CANARIO"
- **WHEN** normalizing the product name
- **THEN** the result is "platano" (brand "GABECERAS CANARIO" removed)

#### Scenario: Remove quantity indicators from product text
- **GIVEN** a ticket product "LECHUGA 6U"
- **WHEN** normalizing the product name
- **THEN** the result is "lechuga" (quantity "6U" removed)

#### Scenario: Remove stopwords from product text
- **GIVEN** a ticket product "LECHE PASCUAL IL ENTERA"
- **WHEN** normalizing the product name
- **THEN** the result is "leche" (stopwords "IL", "ENTERA" and brand "PASCUAL" removed)

### Requirement: Token-Based Matching
The product matching algorithm SHALL use token-based matching to handle multi-word product names with descriptors or brand names.

#### Scenario: Match by first significant token
- **GIVEN** a ticket product "TOMATE ROJO RAMA" (normalized: "tomate")
- **AND** a catalog product "Tomates" (normalized: "tomates")
- **WHEN** calculating token similarity
- **THEN** at least 50% of tokens match (accounting for singular/plural)

#### Scenario: Match with brand name present
- **GIVEN** a ticket product "KIWI ZESPRI" (normalized: "kiwi")
- **AND** a catalog product "Kiwis" (normalized: "kiwis")
- **WHEN** calculating token similarity
- **THEN** at least 50% of tokens match

### Requirement: Hybrid Similarity Calculation
The product matching algorithm SHALL combine token-based matching with Levenshtein distance using weighted averaging.

#### Scenario: Calculate hybrid similarity for perfect match after normalization
- **GIVEN** normalized ticket product "leche" and catalog product "leche"
- **WHEN** calculating hybrid similarity
- **THEN** the similarity score is 1.0 (100%)

#### Scenario: Calculate hybrid similarity with token match and Levenshtein distance
- **GIVEN** normalized ticket product "platano" (tokens: ["platano"])
- **AND** normalized catalog product "plátanos" (tokens: ["plátanos"])
- **WHEN** calculating hybrid similarity
- **THEN** the similarity score is at least 0.6 (60% threshold)
- **AND** the score is calculated as: (token_similarity * 0.6) + (levenshtein_similarity * 0.4)

### Requirement: Adjusted Confidence Thresholds
The product matching algorithm SHALL use adjusted confidence thresholds that are more lenient than the previous 80% requirement.

#### Scenario: High confidence match with normalized product
- **GIVEN** a similarity score of 0.65 (65%)
- **WHEN** evaluating confidence level
- **THEN** the match is classified as "high confidence"
- **AND** the match status is "matched"

#### Scenario: Medium confidence match
- **GIVEN** a similarity score of 0.55 (55%)
- **WHEN** evaluating confidence level
- **THEN** the match is classified as "medium confidence"
- **AND** the match status is "low-confidence"

#### Scenario: No match with dissimilar products
- **GIVEN** ticket product "BRÓCOLI 500G" (normalized: "brócoli")
- **AND** catalog product "Huevos" (normalized: "huevos")
- **WHEN** calculating similarity
- **THEN** the similarity score is below 0.5 (50%)
- **AND** the match status is "unmatched"

### Requirement: Real-World Ticket Product Matching
The product matching algorithm SHALL correctly match real-world ticket products from Spanish supermarkets with the user's catalog products.

#### Scenario: Match banana with brand and origin
- **GIVEN** ticket product "PLATANO GABECERAS CANARIO"
- **AND** catalog contains product "Plátanos"
- **WHEN** matching products
- **THEN** the products are matched with high confidence (≥60%)

#### Scenario: Match tomato with variety description
- **GIVEN** ticket product "TOMATE ROJO RAMA"
- **AND** catalog contains product "Tomates"
- **WHEN** matching products
- **THEN** the products are matched with high confidence (≥60%)

#### Scenario: Match kiwi with brand name
- **GIVEN** ticket product "KIWI ZESPRI"
- **AND** catalog contains product "Kiwis"
- **WHEN** matching products
- **THEN** the products are matched with high confidence (≥60%)

#### Scenario: Match eggs with full product description
- **GIVEN** ticket product "HUEVOS SUELTAS GALLINERO AL"
- **AND** catalog contains product "Huevos"
- **WHEN** matching products
- **THEN** the products are matched with high confidence (≥60%)

#### Scenario: Do not match dissimilar products
- **GIVEN** ticket product "BRÓCOLI 500G"
- **AND** catalog contains product "Huevos"
- **WHEN** matching products
- **THEN** the products are NOT matched (similarity <50%)
- **AND** the match status is "unmatched"

### Requirement: Backward Compatibility
The product matching algorithm changes SHALL NOT break existing functionality or require data migration.

#### Scenario: Existing matched products remain unchanged
- **GIVEN** previously matched products in the system
- **WHEN** the algorithm is updated
- **THEN** existing product links are NOT modified
- **AND** only new matching operations use the improved algorithm

#### Scenario: ConfidenceThresholds API remains stable
- **GIVEN** code using `ConfidenceThresholds.default()`
- **WHEN** the default thresholds are updated
- **THEN** the API signature remains unchanged
- **AND** existing code continues to work without modification

