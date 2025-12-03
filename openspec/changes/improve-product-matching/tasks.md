# Implementation Tasks

## 1. Test Setup
- [ ] 1.1 Add test cases with real user examples to `ProductMatcher.test.ts`
  - [ ] "PLATANO GABECERAS CANARIO" → "Plátanos" (should match)
  - [ ] "TOMATE ROJO RAMA" → "Tomates" (should match)
  - [ ] "KIWI ZESPRI" → "Kiwis" (should match)
  - [ ] "HUEVOS SUELTAS GALLINERO AL" → "Huevos" (should match)
  - [ ] "BRÓCOLI 500G" → "Huevos" (should NOT match)
- [ ] 1.2 Verify all new tests FAIL (Red phase of TDD)

## 2. Algorithm Implementation
- [ ] 2.1 Add `normalizeProductName()` private method to `ProductMatcher`
  - [ ] Remove common stopwords (de, el, la, pack, il, entera, etc.)
  - [ ] Remove quantity indicators (6U, x6, 500G, etc.)
  - [ ] Remove brand names (configurable list: pascual, hacendado, zespri, etc.)
  - [ ] Trim and lowercase
- [ ] 2.2 Add `tokenBasedSimilarity()` private method
  - [ ] Split by spaces, filter short tokens (<3 chars)
  - [ ] Match tokens using substring matching
  - [ ] Return ratio of matched tokens
- [ ] 2.3 Modify `calculateSimilarity()` to use hybrid approach
  - [ ] Apply normalization to both strings
  - [ ] Calculate token similarity (60% weight)
  - [ ] Calculate Levenshtein similarity (40% weight)
  - [ ] Return weighted average
- [ ] 2.4 Update `ConfidenceThresholds.default()`
  - [ ] Change highConfidence: 0.8 → 0.6
  - [ ] Keep mediumConfidence: 0.5 (unchanged)

## 3. Verification
- [ ] 3.1 Run unit tests - all tests pass (Green phase)
- [ ] 3.2 Run full test suite (`npm test`) - no regressions
- [ ] 3.3 Manual testing with real ticket (if available)

## 4. Refactoring
- [ ] 4.1 Extract stopwords to constant array (if needed)
- [ ] 4.2 Extract brand names to constant array (if needed)
- [ ] 4.3 Add JSDoc comments to new methods (if complex)
- [ ] 4.4 Verify code follows <20 lines per function guideline

## 5. Quality Checks (MANDATORY before commit)
- [ ] 5.1 TypeScript compilation passes (`npm run build`)
- [ ] 5.2 All tests pass (`npm test`)
- [ ] 5.3 ESLint passes (`npm run lint`)
- [ ] 5.4 Code coverage maintained at 90%+

## 6. Documentation
- [ ] 6.1 Update `docs/userstories/US-010-[name].md` to mark as completed (create if doesn't exist)
- [ ] 6.2 Update `docs/userstories/README.md` Sprint 6 section
- [ ] 6.3 Document matching algorithm changes in code comments (if complex logic)

## Notes
- Follow TDD strictly: Red → Green → Refactor
- Baby steps: Implement one method at a time
- Test each method in isolation before integration
- Use existing test structure as template
- No UI changes required - this is pure domain logic