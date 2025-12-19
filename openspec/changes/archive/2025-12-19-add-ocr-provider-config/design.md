# Design: OCR Provider Configuration

## Context

The application uses OCR (Optical Character Recognition) to extract text from grocery receipt images. Currently, three OCR service implementations exist:

1. **GeminiVisionOCRService** - Google Gemini Vision API (cloud, paid, 60 req/min free tier)
2. **OllamaVisionOCRService** - Local Ollama with LLaVA model (local, free, unlimited, offline)
3. **MockOCRService** - Testing mock (returns hardcoded data)

All three implement the `OCRService` interface (hexagonal architecture port), located at:
- `src/application/ports/OCRService.ts`

**Current problem:** OCR provider choice is hardcoded in presentation layer:
```typescript
// ProductCatalogPage.tsx:48
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash';
const ocrService = new GeminiVisionOCRService(apiKey, model);
```

This violates hexagonal architecture principles by coupling infrastructure decisions to the presentation layer.

## Goals / Non-Goals

**Goals:**
- Centralize OCR provider selection in infrastructure layer
- Enable zero-code provider switching via environment variable
- Maintain backward compatibility (default to current Gemini behavior)
- Provide clear error messages for configuration issues
- Support all three existing providers: gemini, ollama, mock

**Non-Goals:**
- Runtime provider switching (no UI to change provider)
- Multiple concurrent providers
- Provider auto-detection or fallback chains
- Provider-specific feature flags or capabilities

## Decisions

### Decision 1: Factory Pattern with Environment Variables

**Chosen approach:** Factory pattern reading `VITE_OCR_PROVIDER` environment variable.

```typescript
// src/infrastructure/config/OCRServiceFactory.ts
export type OCRProviderType = 'gemini' | 'ollama' | 'mock'

export class OCRServiceFactory {
  static create(provider?: OCRProviderType): OCRService {
    const selectedProvider = provider ||
      (import.meta.env.VITE_OCR_PROVIDER as OCRProviderType) ||
      'gemini' // default fallback

    switch (selectedProvider) {
      case 'gemini':
        // ...validate and create GeminiVisionOCRService
      case 'ollama':
        // ...create OllamaVisionOCRService
      case 'mock':
        // ...create MockOCRService
      default:
        throw new Error(`Unknown OCR provider: ${selectedProvider}`)
    }
  }
}
```

**Rationale:**
- ✅ Simple, minimal complexity
- ✅ Environment variables are standard for configuration
- ✅ Factory pattern is well-understood
- ✅ Zero code changes to switch providers
- ✅ Testable (can pass provider explicitly)

**Alternatives considered:**

1. **React Context Provider**
   - ❌ Adds React-specific complexity
   - ❌ Requires provider wrapper in component tree
   - ❌ Overkill for simple configuration
   - ✅ Would enable runtime switching (not needed)

2. **Configuration file (config.ts)**
   - ❌ Requires importing config in multiple places
   - ❌ Less conventional than environment variables
   - ✅ Type-safe at build time
   - ❌ Still requires code changes to modify

3. **Dependency Injection Container**
   - ❌ Significant overhead for single dependency
   - ❌ Adds complexity without clear benefit
   - ✅ Would scale better for many services (not needed yet)

### Decision 2: Configuration Validation Strategy

**Chosen approach:** Fail-fast validation in factory with clear error messages.

```typescript
case 'gemini':
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) {
    throw new Error(
      'VITE_GEMINI_API_KEY is required when VITE_OCR_PROVIDER=gemini. ' +
      'Get your key at: https://makersuite.google.com/app/apikey'
    )
  }
  return new GeminiVisionOCRService(apiKey, model)
```

**Rationale:**
- ✅ Fail fast at initialization, not during first use
- ✅ Clear, actionable error messages
- ✅ Includes links to documentation/setup
- ✅ Prevents partial initialization

**Alternatives considered:**

1. **Lazy validation** (only check when OCR is used)
   - ❌ Errors appear late in user flow
   - ❌ Poor developer experience
   - ✅ Faster startup (not relevant here)

2. **Silent fallback** (switch to mock if misconfigured)
   - ❌ Hides configuration errors
   - ❌ Unexpected behavior
   - ❌ Hard to debug

### Decision 3: Default Provider

**Chosen approach:** Default to `gemini` (current production provider).

**Rationale:**
- ✅ Backward compatible (no breaking changes)
- ✅ Preserves current production behavior
- ✅ Users can explicitly opt-in to alternative providers
- ✅ Safest default (known to work)

### Decision 4: Environment Variable Structure

**Chosen approach:** Single `VITE_OCR_PROVIDER` with provider-specific vars.

```bash
# OCR Provider Configuration
VITE_OCR_PROVIDER=gemini  # Options: gemini | ollama | mock

# Gemini Configuration (when VITE_OCR_PROVIDER=gemini)
VITE_GEMINI_API_KEY=your_key_here
VITE_GEMINI_MODEL=gemini-2.0-flash

# Ollama Configuration (when VITE_OCR_PROVIDER=ollama)
VITE_OLLAMA_URL=http://localhost:11434
VITE_OLLAMA_MODEL=llava
```

**Rationale:**
- ✅ Clear primary configuration (`VITE_OCR_PROVIDER`)
- ✅ Provider-specific settings only loaded when needed
- ✅ Existing Gemini variables remain unchanged
- ✅ Self-documenting configuration

## Risks / Trade-offs

### Risk 1: Environment variable not set
**Mitigation:** Default to `gemini` (current behavior). Clear documentation in `.env.example`.

### Risk 2: Invalid provider name
**Mitigation:** TypeScript type checking + runtime validation with clear error message.

### Risk 3: Missing provider-specific configuration
**Mitigation:** Fail-fast validation in factory with helpful error messages including setup links.

### Risk 4: E2E tests may need mock provider
**Mitigation:** E2E tests can set `VITE_OCR_PROVIDER=mock` in test environment. Existing MSW mocking remains unchanged.

## Migration Plan

### Phase 1: Add Factory (Backward Compatible)
1. Create `OCRServiceFactory.ts`
2. Write unit tests for factory
3. Factory defaults to `gemini` - no behavior change

### Phase 2: Update Pages
1. Refactor `ProductCatalogPage.tsx` to use factory
2. Refactor `ActiveShoppingPage.tsx` to use factory
3. Remove direct OCR service instantiation
4. All existing tests continue to pass

### Phase 3: Documentation
1. Update `.env.example` with new variables
2. Add comments explaining provider options
3. Update README-SETUP.md if needed

### Rollback Strategy
- Factory pattern is additive, not breaking
- If issues arise, pages can temporarily revert to direct instantiation
- Environment variable can be left unset (uses default)

## Open Questions

None - design is straightforward and well-scoped.
