# Change: Add OCR Provider Configuration

## Why

OCR provider is currently hardcoded in two locations within the presentation layer:
- `shopping-management-webapp/src/presentation/pages/ProductCatalogPage.tsx:48`
- `shopping-management-webapp/src/presentation/pages/ActiveShoppingPage.tsx:31`

Both files directly instantiate `GeminiVisionOCRService`, tightly coupling the infrastructure choice to the presentation layer. This creates several problems:

1. **Difficult to test different providers**: Switching from Gemini to Ollama (local/free) or Mock (testing) requires editing multiple files
2. **Code duplication**: OCR service instantiation logic is duplicated across pages
3. **Violates Hexagonal Architecture**: Infrastructure concerns (which provider) leak into presentation layer
4. **Poor developer experience**: Changing provider requires 4-6 lines of code changes across 2 files plus import statement updates

After manual testing, the need for easy provider switching became apparent, especially for:
- Local development with Ollama (free, unlimited, offline)
- Testing with Mock provider
- Production with Gemini (cloud, paid)

## What Changes

Add centralized OCR provider configuration via factory pattern:

1. **Create `OCRServiceFactory`** at `src/infrastructure/config/OCRServiceFactory.ts`
   - Centralized factory for creating OCR service instances
   - Reads provider choice from environment variable `VITE_OCR_PROVIDER`
   - Supports providers: `gemini`, `ollama`, `mock`
   - Validates configuration and provides clear error messages

2. **Add environment configuration**
   - New environment variable: `VITE_OCR_PROVIDER` (options: gemini | ollama | mock)
   - Document in `.env.example` with provider-specific settings
   - Default fallback to `gemini` for backward compatibility

3. **Refactor presentation layer**
   - Update `ProductCatalogPage.tsx` to use factory
   - Update `ActiveShoppingPage.tsx` to use factory
   - Remove direct OCR service instantiation
   - Remove provider-specific imports from pages

## Impact

**Affected specs:**
- `ticket-scanning` (ADDED requirements for configuration and factory)

**Affected code:**
- Modified: `shopping-management-webapp/src/presentation/pages/ProductCatalogPage.tsx`
- Modified: `shopping-management-webapp/src/presentation/pages/ActiveShoppingPage.tsx`
- Modified: `shopping-management-webapp/.env.example`
- Created: `shopping-management-webapp/src/infrastructure/config/OCRServiceFactory.ts`
- Created: `shopping-management-webapp/src/test/infrastructure/config/OCRServiceFactory.test.ts`

**Benefits:**
- ✅ Change provider with single environment variable (zero code changes)
- ✅ Improved testability (easier to swap providers)
- ✅ Better separation of concerns (infrastructure vs presentation)
- ✅ Reduced code duplication
- ✅ Backward compatible (defaults to current Gemini provider)

**Breaking changes:**
- None (factory defaults to gemini, existing behavior preserved)
