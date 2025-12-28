# Implementation Tasks

## 1. Update Test Files (TDD Approach)
- [ ] 1.1 Update `shopping-management-webapp/src/test/infrastructure/config/OCRServiceFactory.test.ts`
  - [ ] Replace all `vi.stubEnv('VITE_GEMINI_API_KEY', ...)` with `vi.stubEnv('VITE_OCR_LLM_API_KEY', ...)`
  - [ ] Replace all `vi.stubEnv('VITE_GEMINI_MODEL', ...)` with `vi.stubEnv('VITE_OCR_LLM_MODEL', ...)`
  - [ ] Update test expectations for error messages referencing new variable names
  - [ ] Run tests to verify they fail appropriately (RED phase)

- [ ] 1.2 Update `shopping-management-webapp/playwright.config.ts`
  - [ ] Change `VITE_GEMINI_API_KEY` to `VITE_OCR_LLM_API_KEY` in test environment configuration
  - [ ] Change `VITE_GEMINI_MODEL` to `VITE_OCR_LLM_MODEL` in test environment configuration

## 2. Update Implementation Code
- [ ] 2.1 Update `shopping-management-webapp/src/infrastructure/config/OCRServiceFactory.ts`
  - [ ] Change `import.meta.env.VITE_GEMINI_API_KEY` to `import.meta.env.VITE_OCR_LLM_API_KEY` (line ~62)
  - [ ] Change `import.meta.env.VITE_GEMINI_MODEL` to `import.meta.env.VITE_OCR_LLM_MODEL` (line ~71)
  - [ ] Update error message to reference `VITE_OCR_LLM_API_KEY` instead of `VITE_GEMINI_API_KEY`
  - [ ] Run tests to verify they pass (GREEN phase)

## 3. Update Configuration Files
- [ ] 3.1 Update `shopping-management-webapp/.env.example`
  - [ ] Rename `VITE_GEMINI_API_KEY` to `VITE_OCR_LLM_API_KEY`
  - [ ] Rename `VITE_GEMINI_MODEL` to `VITE_OCR_LLM_MODEL`
  - [ ] Add migration note comment explaining the change
  - [ ] Add comment noting that despite generic name, currently only Gemini is supported

## 4. Run Test Suite
- [ ] 4.1 Run unit tests: `npm test` in `shopping-management-webapp/`
  - [ ] Verify all OCRServiceFactory tests pass
  - [ ] Verify no regressions in other tests

- [ ] 4.2 Run E2E tests: `npm run test:e2e` in `shopping-management-webapp/`
  - [ ] Verify ticket scanning E2E tests pass with new configuration

## 5. Manual Verification
- [ ] 5.1 Test with real environment variables
  - [ ] Set `VITE_OCR_LLM_API_KEY` with valid Gemini API key
  - [ ] Set `VITE_OCR_LLM_MODEL=gemini-2.0-flash`
  - [ ] Verify ticket scanning works in development mode

- [ ] 5.2 Test error handling
  - [ ] Unset `VITE_OCR_LLM_API_KEY`
  - [ ] Verify descriptive error message appears
  - [ ] Verify error message references the new variable name

## 6. Documentation
- [ ] 6.1 Review and update any documentation mentioning old variable names
  - [ ] Check `docs/userstories/completed/epic-3/US-010-escanear-ticket.md`
  - [ ] Check README files for environment setup instructions

## 7. Code Quality
- [ ] 7.1 Refactor if needed (REFACTOR phase)
  - [ ] Review code for any improvements
  - [ ] Ensure consistent naming throughout
  - [ ] Verify error messages are helpful

## 8. Git Operations
- [ ] 8.1 Stage and commit changes
  - [ ] `git add .`
  - [ ] `git commit -m "refactor(ocr): rename VITE_GEMINI_* to VITE_OCR_LLM_*

BREAKING CHANGE: Environment variables renamed for provider abstraction
- VITE_GEMINI_API_KEY → VITE_OCR_LLM_API_KEY
- VITE_GEMINI_MODEL → VITE_OCR_LLM_MODEL

Users must update their .env files accordingly."`

- [ ] 8.2 Create pull request
  - [ ] `gh pr create --title "Refactor: Abstract OCR environment variables" --body "<PR description>"`
  - [ ] Link PR to OpenSpec proposal