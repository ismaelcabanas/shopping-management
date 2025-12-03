# Change: Improve Product Matching Algorithm for Ticket Scanning

## Why

The current product matching algorithm has a too-strict similarity threshold (80%) that fails to match ticket products with catalog products when there are brand names, descriptions, or singular/plural variations. This causes catalog pollution with duplicate products.

**Problem Examples:**
- "PLATANO GABECERAS CANARIO" doesn't match "Plátanos" → creates duplicate
- "TOMATE ROJO RAMA" doesn't match "Tomates" → creates duplicate
- "KIWI ZESPRI" doesn't match "Kiwis" → creates duplicate
- "HUEVOS SUELTAS GALLINERO AL" doesn't match "Huevos" → creates duplicate

**Impact on Users:**
- Catalog becomes polluted with near-duplicate products
- Defeats the purpose of having a static catalog (20-30 products)
- Users must manually merge/delete duplicates
- Reduces trust in OCR feature

## What Changes

### Algorithm Improvements
- **Text Normalization**: Remove brand names, stopwords, quantity indicators, and descriptors
- **Singular/Plural Handling**: Normalize singular and plural forms before matching
- **Token-Based Matching**: Match by first significant word (e.g., "PLATANO" → "Plátanos")
- **Hybrid Similarity**: Combine token matching (60% weight) + Levenshtein (40% weight)
- **Lower Threshold**: Reduce from 80% to 60% for high confidence matches
- **Confidence Levels**: Keep existing three-tier system (high/medium/unmatched)

### New Test Cases
- Add unit tests with real-world examples from user tickets
- Test singular/plural variations
- Test brand name filtering
- Test multi-word product names with descriptors

### No UI Changes Required
- Matching algorithm is internal to `ProductMatcher` domain service
- Existing UI flows remain unchanged
- Future work (not this change): Add manual review UI for low-confidence matches

## Impact

### Affected Specs
- `specs/product-matching/spec.md` (NEW) - ADDED requirements for matching algorithm

### Affected Code
- `src/domain/services/ProductMatcher.ts` - Core algorithm changes
- `src/test/domain/services/ProductMatcher.test.ts` - New test cases
- `src/domain/model/ConfidenceThresholds.ts` - Update default thresholds

### Breaking Changes
- **NONE** - This is an internal algorithm improvement
- Existing matched products remain unchanged
- Only affects future matching operations

### Migration Plan
- **NONE** - No data migration needed
- Algorithm changes are transparent to users
- Catalog may stop growing with duplicates after deploy

### Risk Assessment
- **Low Risk**: Pure domain logic change with comprehensive tests
- **Rollback**: Easy - revert ProductMatcher.ts to previous version
- **Testing**: TDD approach with real user examples ensures correctness