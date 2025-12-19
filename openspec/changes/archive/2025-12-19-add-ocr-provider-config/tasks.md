# Tasks: Add OCR Provider Configuration

## 1. Implementation

### 1.1 Create OCRServiceFactory (TDD)
- [x] 1.1.1 Write failing test: Factory creates GeminiVisionOCRService when provider='gemini'
- [x] 1.1.2 Write failing test: Factory creates OllamaVisionOCRService when provider='ollama'
- [x] 1.1.3 Write failing test: Factory creates MockOCRService when provider='mock'
- [x] 1.1.4 Write failing test: Factory throws error for invalid provider
- [x] 1.1.5 Write failing test: Factory throws error when Gemini API key missing
- [x] 1.1.6 Write failing test: Factory reads from VITE_OCR_PROVIDER env variable
- [x] 1.1.7 Write failing test: Factory defaults to 'gemini' when env variable not set
- [x] 1.1.8 Write failing test: Factory uses explicit provider over environment
- [x] 1.1.9 Implement `src/infrastructure/config/OCRServiceFactory.ts`
- [x] 1.1.10 Verify all tests pass

### 1.2 Update Environment Configuration
- [x] 1.2.1 Add `VITE_OCR_PROVIDER` to `.env.example` with documentation
- [x] 1.2.2 Add `VITE_OLLAMA_URL` to `.env.example` with default value
- [x] 1.2.3 Add `VITE_OLLAMA_MODEL` to `.env.example` with default value
- [x] 1.2.4 Add comments explaining each provider option and when to use it
- [x] 1.2.5 Add section header "OCR Provider Configuration" for clarity

### 1.3 Refactor ProductCatalogPage
- [x] 1.3.1 Add import for `OCRServiceFactory`
- [x] 1.3.2 Replace direct `GeminiVisionOCRService` instantiation with `OCRServiceFactory.create()`
- [x] 1.3.3 Remove unused imports (`GeminiVisionOCRService`, env variable reads for Gemini)
- [x] 1.3.4 Verify existing unit tests pass
- [x] 1.3.5 Update tests to mock factory if needed (not needed - tests still pass)

### 1.4 Refactor ActiveShoppingPage
- [x] 1.4.1 Add import for `OCRServiceFactory`
- [x] 1.4.2 Replace direct `GeminiVisionOCRService` instantiation with `OCRServiceFactory.create()`
- [x] 1.4.3 Remove unused imports (`GeminiVisionOCRService`, env variable reads for Gemini)
- [x] 1.4.4 Verify existing unit tests pass
- [x] 1.4.5 Update tests to mock factory if needed (not needed - tests still pass)

### 1.5 Integration Testing
- [ ] 1.5.1 Manual test: Set `VITE_OCR_PROVIDER=gemini` and verify ticket scanning works (requires manual user testing)
- [ ] 1.5.2 Manual test: Set `VITE_OCR_PROVIDER=ollama` and verify ticket scanning works (requires Ollama running + manual user testing)
- [ ] 1.5.3 Manual test: Set `VITE_OCR_PROVIDER=mock` and verify mock data returned (requires manual user testing)
- [ ] 1.5.4 Manual test: Set invalid provider and verify clear error message (requires manual user testing)
- [ ] 1.5.5 Manual test: Remove `VITE_GEMINI_API_KEY` and verify clear error when using Gemini (requires manual user testing)

## 2. Validation
- [x] 2.1 Run `openspec validate add-ocr-provider-config --strict` and resolve all issues
- [x] 2.2 Verify all unit tests pass: `npm test` (546 tests passed)
- [x] 2.3 Verify E2E tests pass: `npm run test:e2e` (25 passed, 1 skipped, 0 failed)
- [x] 2.4 Verify no TypeScript errors: `npm run build` (build passed successfully)
- [x] 2.5 Verify linting passes: `npm run lint` (passed, 1 unrelated warning)

## 3. Documentation
- [x] 3.1 README-SETUP.md already documents OCR provider configuration (no changes needed)
- [x] 3.2 Add inline JSDoc comments to OCRServiceFactory
- [x] 3.3 Ensure error messages are self-documenting with links

## Notes

### Dependencies
- Task 1.1 must complete before 1.3 and 1.4 (pages depend on factory)
- Tasks 1.3 and 1.4 can be done in parallel
- Task 1.2 can be done in parallel with 1.1

### Testing Strategy
- Unit tests: Test factory logic in isolation
- Integration tests: Manual testing with real providers
- E2E tests: Should continue to work (may need mock provider env var)

### Rollback Plan
If issues arise during implementation:
1. Factory is additive, not breaking
2. Pages can temporarily revert to direct instantiation
3. Environment variable can be left unset (uses default)
