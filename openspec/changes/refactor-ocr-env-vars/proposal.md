# Change: Abstract OCR Environment Variables from Gemini-Specific Names

## Why

The current implementation uses Gemini-specific environment variable names (`VITE_GEMINI_API_KEY` and `VITE_GEMINI_MODEL`), which creates tight coupling to the Gemini provider. This makes it harder to switch to alternative LLM providers in the future and doesn't align with the existing abstraction layer that already supports multiple OCR providers (Gemini, Ollama, Mock).

By renaming these variables to provider-agnostic names (`VITE_OCR_LLM_API_KEY` and `VITE_OCR_LLM_MODEL`), we improve consistency with the existing `VITE_OCR_PROVIDER` variable and make the configuration more intuitive for users who may want to switch providers.

## What Changes

- Rename `VITE_GEMINI_API_KEY` → `VITE_OCR_LLM_API_KEY`
- Rename `VITE_GEMINI_MODEL` → `VITE_OCR_LLM_MODEL`
- Update all references in code, tests, and configuration files
- Update error messages to reference the new variable names
- Add migration notes in `.env.example` for existing users
- **BREAKING**: Existing `.env` files will require manual update

## Impact

### Affected Specifications
- `ticket-scanning` - Updates to "OCR Provider Configuration" requirement and related scenarios

### Affected Code
- `shopping-management-webapp/src/infrastructure/config/OCRServiceFactory.ts`
- `shopping-management-webapp/src/test/infrastructure/config/OCRServiceFactory.test.ts`
- `shopping-management-webapp/playwright.config.ts`
- `shopping-management-webapp/.env.example`

### Breaking Changes
This is a **breaking configuration change**. Users with existing `.env` files will need to:
1. Rename `VITE_GEMINI_API_KEY` to `VITE_OCR_LLM_API_KEY`
2. Rename `VITE_GEMINI_MODEL` to `VITE_OCR_LLM_MODEL` (if customized)

The application will fail to initialize OCR services if the old variable names are used, with clear error messages guiding users to the new names.

### Migration Path
1. Users will receive error messages if old variables are present but new ones are missing
2. `.env.example` will include migration notes
3. Commit message will clearly indicate the breaking change