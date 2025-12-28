# Implementation Tasks

## 1. Update Test Files (TDD Approach)
- [x] 1.1 Update `shopping-management-webapp/src/test/infrastructure/config/OCRServiceFactory.test.ts`
  - [x] Replace all `vi.stubEnv('VITE_GEMINI_API_KEY', ...)` with `vi.stubEnv('VITE_OCR_LLM_API_KEY', ...)`
  - [x] Replace all `vi.stubEnv('VITE_GEMINI_MODEL', ...)` with `vi.stubEnv('VITE_OCR_LLM_MODEL', ...)`
  - [x] Update test expectations for error messages referencing new variable names
  - [x] Run tests to verify they fail appropriately (RED phase)

- [x] 1.2 Update `shopping-management-webapp/playwright.config.ts`
  - [x] Change `VITE_GEMINI_API_KEY` to `VITE_OCR_LLM_API_KEY` in test environment configuration
  - [x] Change `VITE_GEMINI_MODEL` to `VITE_OCR_LLM_MODEL` in test environment configuration

## 2. Update Implementation Code
- [x] 2.1 Update `shopping-management-webapp/src/infrastructure/config/OCRServiceFactory.ts`
  - [x] Change `import.meta.env.VITE_GEMINI_API_KEY` to `import.meta.env.VITE_OCR_LLM_API_KEY` (line ~62)
  - [x] Change `import.meta.env.VITE_GEMINI_MODEL` to `import.meta.env.VITE_OCR_LLM_MODEL` (line ~71)
  - [x] Update error message to reference `VITE_OCR_LLM_API_KEY` instead of `VITE_GEMINI_API_KEY`
  - [x] Run tests to verify they pass (GREEN phase)

## 3. Update Configuration Files
- [x] 3.1 Update `shopping-management-webapp/.env.example`
  - [x] Rename `VITE_GEMINI_API_KEY` to `VITE_OCR_LLM_API_KEY`
  - [x] Rename `VITE_GEMINI_MODEL` to `VITE_OCR_LLM_MODEL`
  - [x] Add migration note comment explaining the change
  - [x] Add comment noting that despite generic name, currently only Gemini is supported

## 4. Run Test Suite
- [x] 4.1 Run unit tests: `npm test` in `shopping-management-webapp/`
  - [x] Verify all OCRServiceFactory tests pass
  - [x] Verify no regressions in other tests

- [x] 4.2 Run E2E tests: `npm run test:e2e` in `shopping-management-webapp/`
  - [x] Verify ticket scanning E2E tests pass with new configuration

## 5. Manual Verification
- [x] 5.1 Test with real environment variables
  - [x] Set `VITE_OCR_LLM_API_KEY` with valid Gemini API key
  - [x] Set `VITE_OCR_LLM_MODEL=gemini-2.0-flash`
  - [x] Verify ticket scanning works in development mode

- [x] 5.2 Test error handling
  - [x] Unset `VITE_OCR_LLM_API_KEY`
  - [x] Verify descriptive error message appears
  - [x] Verify error message references the new variable name

## 6. Documentation
- [x] 6.1 Review and update any documentation mentioning old variable names
  - [x] Check `docs/userstories/completed/epic-3/US-010-escanear-ticket.md`
  - [x] Check README files for environment setup instructions

## 7. Code Quality
- [x] 7.1 Refactor if needed (REFACTOR phase)
  - [x] Review code for any improvements
  - [x] Ensure consistent naming throughout
  - [x] Verify error messages are helpful

## 8. Git Operations
- [x] 8.1 Stage and commit changes
  - [x] `git add .`
  - [x] `git commit -m "refactor(ocr): rename VITE_GEMINI_* to VITE_OCR_LLM_*

BREAKING CHANGE: Environment variables renamed for provider abstraction
- VITE_GEMINI_API_KEY → VITE_OCR_LLM_API_KEY
- VITE_GEMINI_MODEL → VITE_OCR_LLM_MODEL

Users must update their .env files accordingly."`

- [x] 8.2 Create pull request
  - [x] `gh pr create --title "Refactor: Abstract OCR environment variables" --body "<PR description>"`
  - [x] Link PR to OpenSpec proposal