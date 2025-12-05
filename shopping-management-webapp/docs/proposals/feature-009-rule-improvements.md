# Feature 009 - Propuestas de Mejora de Reglas de Desarrollo

**Fecha:** 2025-11-30
**Feature Analizada:** US-009 Escanear Ticket y Registrar Compra
**Agente:** feedback-learning-loop

---

## Resumen Ejecutivo

Basado en el desarrollo completo de Feature 009 (Ticket Scanning con OCR), se han identificado **5 áreas clave** para mejorar las reglas de desarrollo que mejorarán la colaboración IA-humano, calidad de código y eficiencia del desarrollo.

---

## Análisis de Feature 009

### ✅ Qué Funcionó Bien

1. **Clean Architecture con Ports & Adapters** - La interfaz `IOCRService` permitió cambiar proveedores sin problemas
2. **Documentación Primero** - Crear `ocr-providers.md` capturó el proceso de evaluación y decisiones
3. **Metodología TDD** - 376 unit tests + 11 e2e tests pasando
4. **Conciencia de Seguridad** - Manejo correcto de API keys (.env en .gitignore, .env.example)
5. **Testing Pragmático** - Estrategia de mocking para servicios que requieren API keys funcionó bien
6. **Documentación de Deuda Técnica** - Factory Pattern identificado y documentado para TicketScanModal

### ⚠️ Qué Podría Mejorarse

1. **Proceso de Evaluación de Proveedores** - Sin guía documentada sobre cómo evaluar y comparar proveedores externos
2. **Gestión de Deuda Técnica** - Sin reglas explícitas sobre cuándo/cómo documentar deuda técnica vs arreglarla inmediatamente
3. **Configuración de Entorno** - Sin guías sobre gestión de API keys y seguridad de variables de entorno
4. **Architecture Decision Records** - La evaluación de proveedores OCR debería haber sido un ADR, no solo documentación
5. **Testing de Servicios Externos** - Sin reglas explícitas sobre estrategias de testing para APIs externas (mocking, integration tests, contract testing)

---

## Propuestas de Mejora

### Propuesta 1: Proceso de Evaluación de Proveedores Externos

**Archivo Objetivo:** `.agents/rules/architecture.md`
**Prioridad:** 🔴 Alta
**Sección:** Nueva sección después de "When to Question the Architecture"

#### Texto Propuesto

```markdown
## External Service Provider Evaluation

When integrating external services (APIs, LLMs, cloud providers), follow this systematic evaluation process:

### Evaluation Criteria

Before implementing any external service integration, document:

1. **Functional Requirements** - What the service must do (e.g., OCR accuracy, quantity detection)
2. **Non-Functional Requirements** - Performance, cost, privacy, availability
3. **Provider Comparison Matrix** - Compare at least 2-3 alternatives using objective criteria
4. **Proof of Concept Testing** - Test with real data before committing
5. **Decision Documentation** - Record why a provider was chosen/rejected

### Documentation Requirements

Create a comparison document in `docs/architecture/` that includes:

- **Requirements** - Clear, measurable criteria
- **Provider Options** - List of evaluated alternatives
- **Testing Results** - Real-world metrics from POC testing
- **Cost Analysis** - Projected costs at expected usage levels
- **Recommendation Matrix** - Table showing which provider fits which scenario
- **Architecture Impact** - How the integration affects system design

### Example Structure

```markdown
# [Service Type] Provider Options (e.g., OCR Provider Options)

## Requirements
1. Extract text from images
2. <100ms response time
3. <$10/month for 1000 requests

## Provider Comparison
| Provider | Cost | Speed | Accuracy | Privacy |
|----------|------|-------|----------|---------|
| Option A | $5   | 50ms  | 95%      | Cloud   |
| Option B | $10  | 30ms  | 98%      | Local   |

## Testing Results
**Option A:** Tested with 10 real receipts...
**Option B:** Tested with 10 real receipts...

## Recommendation
Use Option B for production because...
```

### When to Skip Detailed Evaluation

- **Development/prototype phase** - Use the fastest option to validate concept
- **Well-established standard** - Industry-standard solutions (e.g., PostgreSQL, Redis)
- **No alternatives exist** - Only one viable option available

### Anti-Patterns

❌ Don't:
- Choose a provider without testing with real data
- Make decisions based only on documentation
- Ignore cost implications for production scale
- Skip documenting the evaluation process

✅ Do:
- Test multiple providers with actual use cases
- Document rejection reasons (e.g., "Ollama: unreliable for receipts")
- Consider switching costs and vendor lock-in
- Create abstraction layers (interfaces) to enable provider switching
```

#### Justificación

Feature 009 reveló que probamos Ollama, encontramos que no era confiable, cambiamos a Gemini, y documentamos la evaluación en `ocr-providers.md`. Sin embargo, este proceso no fue guiado por reglas existentes. Tener criterios explícitos de evaluación:
- Previene compromisos prematuros con proveedores inadecuados
- Crea artefactos de comparación reutilizables para referencia futura
- Asegura toma de decisiones consistente entre diferentes servicios externos
- Ahorra tiempo al adelantar el trabajo de evaluación

#### Impacto Esperado

Integraciones futuras (procesadores de pago, analytics, bases de datos) tendrán elecciones de proveedores documentadas y defendibles con rutas claras de cambio.

---

### Propuesta 2: Estándares de Documentación de Deuda Técnica

**Archivo Objetivo:** `.agents/rules/base.md`
**Prioridad:** 🔴 Alta
**Sección:** Nueva sección después de "7. Documentation Standards"

#### Texto Propuesto

```markdown
## 8. Technical Debt Management

### When Technical Debt is Acceptable

Technical debt is acceptable when:
1. **Time-to-market is critical** - Shipping a working feature quickly
2. **Requirements are uncertain** - Waiting for user feedback before optimizing
3. **Cost of fixing > cost of carrying** - Refactoring effort exceeds maintenance burden
4. **Enables learning** - Quick implementation validates concept before investing in perfect design

### When to Fix Debt Immediately

Fix technical debt immediately if:
1. **Security vulnerability** - Hardcoded secrets, injection risks
2. **Data integrity risk** - Could corrupt user data
3. **Blocks other work** - Prevents implementing upcoming features
4. **Simple fix** - <30 minutes to resolve properly

### Documentation Requirements

When introducing technical debt, MUST document:

1. **Create an Issue** - In `docs/issues/` or issue tracker
2. **Include Context:**
   ```markdown
   # Issue: [Brief Title]

   ## Current Implementation
   [Describe what exists now]

   ## Problem
   [Why is this technical debt?]

   ## Proposed Solution
   [How should it be fixed?]

   ## Priority
   - [ ] Critical - Fix before next release
   - [ ] High - Fix within 2 sprints
   - [ ] Medium - Fix when convenient
   - [ ] Low - Nice to have

   ## Acceptance Criteria
   [How do we know it's fixed?]
   ```

3. **Add TODO Comment in Code:**
   ```typescript
   // TODO(issue-123): TicketScanModal should use Factory Pattern
   // Current: Direct instantiation of GeminiVisionOCRService
   // Target: Use OCRServiceFactory for provider abstraction
   // See: docs/issues/issue-123.md
   ```

### Anti-Patterns

❌ Don't:
- Introduce debt without documenting it
- Use "we'll refactor later" without specifics
- Accumulate debt that blocks future features
- Skip the "why" explanation

✅ Do:
- Be explicit about trade-offs made
- Set clear criteria for when to address debt
- Link code comments to issue documentation
- Review debt regularly (monthly)

### Example: Feature 009 Technical Debt

**Good:** TicketScanModal uses direct service instantiation instead of Factory Pattern. Documented in issue with:
- Current implementation details
- Proposed Factory Pattern solution
- Acceptance criteria for resolution
- Priority: Medium (fix when refactoring modal logic)

**Bad:** "This code needs refactoring" (no context, no plan)
```

#### Justificación

Feature 009 identificó Factory Pattern como deuda técnica en TicketScanModal. Esto fue correctamente documentado, pero no tenemos reglas explícitas sobre:
- Cuándo la deuda técnica es aceptable vs debe arreglarse inmediatamente
- Cómo documentar deuda consistentemente
- Cómo priorizar la resolución de deuda

#### Impacto Esperado

- Toma de decisiones más clara sobre cuándo aceptar deuda
- Documentación consistente de deuda que es fácil de rastrear
- Mejor priorización del trabajo de refactoring

---

### Propuesta 3: Gestión de Variables de Entorno y Secretos

**Archivo Objetivo:** `.agents/rules/base.md`
**Prioridad:** 🔴 Crítica
**Sección:** Ampliar "8. Security Considerations"

#### Texto Actual (líneas 88-93)

```markdown
### Security Considerations
- **Security by Design**: Consider security implications in all design decisions.
- **Input Validation**: Always validate and sanitize user inputs and external data.
- **Secrets Management**: Never hardcode secrets; use proper secret management systems.
- **Dependency Security**: Regularly update dependencies and monitor for security vulnerabilities.
```

#### Modificación Propuesta

```markdown
### Security Considerations
- **Security by Design**: Consider security implications in all design decisions.
- **Input Validation**: Always validate and sanitize user inputs and external data.
- **Secrets Management**: Never hardcode secrets; use proper secret management systems.
- **Dependency Security**: Regularly update dependencies and monitor for security vulnerabilities.

#### API Keys & Environment Variables

**Setup Requirements:**

1. **Never Commit Secrets**
   ```bash
   # .gitignore (MUST include)
   .env
   .env.local
   .env.*.local
   ```

2. **Provide Template**
   ```bash
   # .env.example (MUST include)
   # Google Gemini Vision API
   VITE_GEMINI_API_KEY=your-api-key-here

   # OCR Provider Selection
   VITE_OCR_PROVIDER=gemini  # Options: gemini, ollama, mock
   ```

3. **Document Setup in README**
   ```markdown
   ## Environment Setup

   1. Copy `.env.example` to `.env`:
      ```bash
      cp .env.example .env
      ```

   2. Add your API keys to `.env`:
      ```
      VITE_GEMINI_API_KEY=your-actual-key
      ```

   3. Get API keys from:
      - Gemini: https://makersuite.google.com/app/apikey
   ```

**Validation:**

Before committing ANY feature that uses API keys:
1. Verify `.env` is in `.gitignore`
2. Verify `.env.example` exists with dummy values
3. Verify README documents setup steps
4. Search codebase for hardcoded keys: `git grep -i "api.*key.*="`

**Testing Without Keys:**

Provide mock implementations for testing:
```typescript
// MockOCRService for tests
export class MockOCRService implements IOCRService {
  async extractText(imageData: string): Promise<string> {
    return "Leche | 2\nPan | 1";
  }
}
```

**Anti-Patterns:**

❌ Don't:
- Commit `.env` files with real keys
- Put keys directly in code
- Share keys in pull request descriptions
- Use production keys in tests

✅ Do:
- Use environment variables exclusively
- Provide `.env.example` templates
- Document where to obtain keys
- Use mocks for testing
- Rotate keys if accidentally committed
```

#### Justificación

Feature 009 manejó correctamente las API keys, pero esto no fue guiado por reglas existentes. Agregamos:
- `.env` a `.gitignore`
- Template `.env.example`
- MockOCRService para testing
- Documentación en README

Tener reglas explícitas prevendría incidentes de seguridad y aseguraría manejo consistente en todas las integraciones.

#### Impacto Esperado

- Riesgo cero de commits accidentales de secretos
- Onboarding más rápido (instrucciones claras de setup)
- Prácticas de seguridad consistentes entre features

---

### Propuesta 4: Architecture Decision Records (ADRs)

**Archivo Objetivo:** `.agents/rules/base.md`
**Prioridad:** 🟡 Media
**Sección:** Ampliar "7. Documentation Standards"

#### Texto Actual (líneas 69-72)

```markdown
## 7. Documentation Standards

- **User-Focused README**: README.md must be user-focused, containing only information relevant to end users.
- **Separate Dev Docs**: All developer documentation must be placed in separate files (e.g., docs/development.md), with a clear link from the README.
- **Error Examples**: User-facing documentation should include example error messages for common validation failures to help users quickly resolve issues.
```

#### Adición Propuesta

```markdown
## 7. Documentation Standards

- **User-Focused README**: README.md must be user-focused, containing only information relevant to end users.
- **Separate Dev Docs**: All developer documentation must be placed in separate files (e.g., docs/development.md), with a clear link from the README.
- **Error Examples**: User-facing documentation should include example error messages for common validation failures to help users quickly resolve issues.

### Architecture Decision Records (ADRs)

**When to Create an ADR:**

Create an ADR for decisions that:
1. **Affect architecture** - Layer structure, dependency flow, patterns
2. **Choose between alternatives** - External providers, frameworks, libraries
3. **Have long-term impact** - Hard to reverse, affect multiple features
4. **Are non-obvious** - Require explanation of trade-offs
5. **Set precedent** - Will guide similar future decisions

**ADR Format:**

```markdown
# ADR-XXX: [Decision Title]

## Status
[Proposed | Accepted | Deprecated | Superseded by ADR-YYY]

## Context
What problem are we solving? Why is this decision needed?

## Decision
What did we decide to do?

## Alternatives Considered
1. **Option A:** [Description] - Rejected because [reason]
2. **Option B:** [Description] - Rejected because [reason]
3. **Option C (chosen):** [Description] - Chosen because [reason]

## Consequences

### Positive
- Benefit 1
- Benefit 2

### Negative
- Trade-off 1
- Trade-off 2

### Neutral
- Implication 1

## Related Decisions
- ADR-001: Clean Architecture
- ADR-004: TDD Methodology
```

**ADR Storage:**

- Location: `docs/adr/`
- Naming: `XXX-short-decision-title.md` (e.g., `009-gemini-ocr-provider.md`)
- Index: Maintain `docs/adr/README.md` with list of all ADRs

**Examples of ADR-Worthy Decisions:**

✅ Do create ADR for:
- "Use Gemini Vision instead of Ollama for OCR"
- "Implement Repository Pattern for data access"
- "Choose Vitest over Jest for testing"
- "Use LocalStorage instead of IndexedDB"

❌ Don't create ADR for:
- "Add a new button to the UI"
- "Fix a typo in documentation"
- "Update dependency version"
- "Rename a variable for clarity"

**Lightweight Documentation vs ADR:**

| Characteristic | Lightweight Doc | ADR |
|----------------|----------------|-----|
| **Reversibility** | Easy to change | Hard to reverse |
| **Scope** | Single feature | Multiple features |
| **Alternatives** | 1-2 options | 3+ options compared |
| **Impact** | Local | System-wide |

**Example: Feature 009 Should Have Been ADR:**

The OCR provider selection (`docs/architecture/ocr-providers.md`) should have been:
- **ADR-009: Gemini Vision for Production OCR**
- Includes: Requirements, tested alternatives (Ollama, OpenAI, Claude), rejection reasons, cost analysis
- Status: Accepted
- References: Testing results, performance benchmarks
```

#### Justificación

Feature 009 creó excelente documentación en `ocr-providers.md`, pero no sigue el formato ADR. Los ADRs proporcionan:
- Estructura consistente para decisiones arquitectónicas
- Tracking claro de estado (propuesto → aceptado → superseded)
- Referencia fácil para futuros mantenedores
- Contexto histórico de "¿por qué elegimos X?"

La elección de proveedor OCR cumple todos los criterios ADR:
- Afecta arquitectura (integración de servicio externo)
- Múltiples alternativas consideradas (Ollama, Gemini, OpenAI)
- Impacto a largo plazo (difícil cambiar proveedores)
- No obvio (requiere explicación de trade-offs)

#### Impacto Esperado

- Decisiones arquitectónicas fácilmente descubribles
- Desarrolladores futuros entienden "por qué" no solo "qué"
- Documentación consistente de decisiones en el proyecto
- Más fácil revisar decisiones cuando el contexto cambia

---

### Propuesta 5: Testing de Servicios Externos e Integraciones API

**Archivo Objetivo:** `.agents/rules/testing.md`
**Prioridad:** 🔴 Alta
**Sección:** Nueva sección después de "Testing Strategy: When to Simplify vs When to Persist"

#### Texto Propuesto

```markdown
## Testing External Service Integrations

### Strategy for Third-Party APIs

When integrating external services (APIs, LLMs, cloud providers), use a **layered testing approach**:

#### 1. Interface Testing (Unit Tests)

Test the interface contract WITHOUT calling the real service:

```typescript
// Unit test with mock
describe('TicketParser', () => {
  it('should parse OCR text into inventory items', () => {
    const mockOCRService: IOCRService = {
      extractText: vi.fn().mockResolvedValue('Leche | 2\nPan | 1')
    };

    const parser = new TicketParser(mockOCRService);
    // Test logic without external dependency
  });
});
```

**What to test:**
- Interface contract compliance
- Error handling (mock errors from service)
- Data transformation logic
- Edge cases (empty responses, malformed data)

#### 2. Service Implementation Testing

Test the adapter implementation with **careful mocking**:

```typescript
// Test GeminiVisionOCRService without real API calls
describe('GeminiVisionOCRService', () => {
  it('should format request correctly', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({
        candidates: [{ content: { parts: [{ text: 'Leche | 2' }] } }]
      })
    });

    const service = new GeminiVisionOCRService('test-key');
    await service.extractText('data:image/jpeg;base64,abc123');

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('gemini'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
    );
  });
});
```

**What to test:**
- Request formatting
- Response parsing
- Error handling (network errors, API errors)
- Configuration (API keys, endpoints)

#### 3. Integration Testing (Optional, Gated)

For critical integrations, create optional integration tests:

```typescript
// integration/GeminiVisionOCRService.integration.test.ts
describe('GeminiVisionOCRService Integration', () => {
  // Skip if API key not available
  const apiKey = process.env.GEMINI_API_KEY;
  const runIntegrationTests = apiKey && process.env.RUN_INTEGRATION_TESTS;

  it.skipIf(!runIntegrationTests)(
    'should extract text from real receipt image',
    async () => {
      const service = new GeminiVisionOCRService(apiKey!);
      const result = await service.extractText(REAL_IMAGE_DATA);

      expect(result).toContain('|');
      expect(result.split('\n').length).toBeGreaterThan(0);
    },
    { timeout: 10000 } // Longer timeout for real API
  );
});
```

**Integration test characteristics:**
- **Skipped by default** - Only run when `RUN_INTEGRATION_TESTS=true`
- **Requires credentials** - Checks for API keys
- **Longer timeouts** - Real APIs are slower
- **Separate from unit tests** - Don't block CI pipeline
- **Cost-aware** - Minimize API calls (use cached responses)

#### 4. Contract Testing (Advanced, Optional)

For mission-critical integrations, use contract testing:

```typescript
// Verify API contract hasn't changed
describe('Gemini API Contract', () => {
  it('should match expected response schema', async () => {
    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [{ text: 'Extracted text' }]
          }
        }
      ]
    };

    // Validate against JSON schema
    expect(mockResponse).toMatchSchema(GeminiResponseSchema);
  });
});
```

### Mocking Guidelines for External Services

**When to mock:**
- ✅ Unit tests - Always mock external services
- ✅ CI/CD pipeline - Always use mocks
- ✅ Local development - Provide mock option
- ⚠️ Integration tests - Use real service with flags
- ⚠️ E2E tests - Consider using real service for critical paths

**How to provide mock implementations:**

```typescript
// infrastructure/services/ocr/OCRServiceFactory.ts
export function createOCRService(): IOCRService {
  const provider = import.meta.env.VITE_OCR_PROVIDER || 'mock';

  switch (provider) {
    case 'gemini':
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('Gemini API key not found, using mock');
        return new MockOCRService();
      }
      return new GeminiVisionOCRService(apiKey);

    case 'mock':
    default:
      return new MockOCRService();
  }
}
```

**Mock service requirements:**
- Implement same interface
- Provide realistic responses
- Support error scenarios (optional flags)
- Fast (<10ms response time)
- No external dependencies

### Cost Management for Integration Tests

**Best practices:**
1. **Cache responses** - Record real API responses, replay in tests
2. **Rate limiting** - Add delays between integration test runs
3. **Conditional execution** - Only run when explicitly enabled
4. **Free tier awareness** - Stay within free limits
5. **Use cheaper models** - Test with `gemini-flash` not `gemini-pro`

### Anti-Patterns

❌ Don't:
- Make real API calls in unit tests
- Block CI pipeline with integration tests
- Test without rate limiting
- Ignore API costs in test suite
- Skip mocking for "quick prototypes"

✅ Do:
- Mock all external services in unit tests
- Provide fallback mock implementations
- Gate integration tests behind environment flags
- Document setup for integration tests
- Monitor API usage from tests

### Example: Feature 009 OCR Testing

**Good practices used:**
- ✅ `IOCRService` interface for abstraction
- ✅ `MockOCRService` for testing without API keys
- ✅ Factory pattern switches between mock/real based on config
- ✅ All unit tests pass without API keys

**Could be improved:**
- ⚠️ Add optional integration test with real Gemini API
- ⚠️ Document how to run integration tests locally
- ⚠️ Add contract test for Gemini response schema
```

#### Justificación

Feature 009 manejó bien el testing de servicios externos (mocking), pero no hay reglas explícitas guiando este enfoque. La propuesta:
- Codifica la estrategia exitosa de mocking usada
- Agrega guía para testing de integración opcional
- Proporciona consideraciones de gestión de costos
- Distingue entre unit/integration/contract testing

#### Impacto Esperado

- Enfoque consistente de testing para todas las integraciones externas
- Guía clara sobre cuándo mockear vs integrar
- Estrategias de testing costo-efectivas
- Pipelines CI más rápidos (sin llamadas API costosas en unit tests)

---

## Resumen de Propuestas

| # | Archivo de Reglas | Sección | Tipo | Prioridad | Impacto Esperado |
|---|-------------------|---------|------|-----------|------------------|
| 1 | `architecture.md` | External Service Provider Evaluation | Adición | 🔴 Alta | Evaluación sistemática de proveedores, documentación reutilizable |
| 2 | `base.md` | Technical Debt Management | Adición | 🔴 Alta | Documentación clara de deuda, framework de priorización |
| 3 | `base.md` | Security (API Keys) | Mejora | 🔴 Crítica | Riesgo cero de leaks de secretos, seguridad consistente |
| 4 | `base.md` | Documentation (ADRs) | Adición | 🟡 Media | Mejor tracking de decisiones arquitectónicas |
| 5 | `testing.md` | Testing External Services | Adición | 🔴 Alta | Testing consistente de servicios externos, control de costos |

---

## Evaluación de Impacto en Reglas Fundamentales

### Propuestas 2, 3, 4 modifican `base.md` (regla fundamental)

**Ajustes correlativos potencialmente necesarios:**
- `CLAUDE.md` sección 0 (AI Development Rules) - Agregar referencia a nuevos estándares de ADR y deuda técnica
- `README.md` - Agregar instrucciones de setup de entorno (ya referenciado en Propuesta 3)
- No se necesitan cambios en `testing.md` o `architecture.md` para modificaciones de base.md

### Propuesta 1 agrega a `architecture.md` (regla fundamental)

**Ajustes correlativos potencialmente necesarios:**
- Podría referenciarse desde `base.md` "Security Considerations" al elegir proveedores externos
- Sin conflictos con reglas de arquitectura existentes

### Propuesta 5 agrega a `testing.md` (regla fundamental)

**Ajustes correlativos potencialmente necesarios:**
- Se alinea con sección existente "Testing Strategy Distinction"
- Extiende la filosofía de testing pragmático ya establecida
- Sin conflictos con reglas de testing existentes

---

## Próximos Pasos

**Estas propuestas esperan tu revisión y aprobación antes de aplicar cualquier cambio a las reglas.**

Por favor, revisa cada propuesta y proporciona feedback sobre:
1. Qué propuestas aprobar (todas, algunas, o ninguna)
2. Modificaciones necesarias al texto propuesto
3. Si implementar cambios aprobados inmediatamente o por etapas

Una vez aprobadas:
1. Se aplicarán los cambios exactos a los archivos de reglas especificados
2. Se actualizarán secciones correlativas identificadas en la evaluación de impacto
3. Se confirmará la finalización de cada actualización

---

## Referencias

- **Feature Analizada:** US-009 Escanear Ticket y Registrar Compra
- **Documentación Creada:** `docs/architecture/ocr-providers.md`
- **Deuda Técnica Documentada:** `docs/issues/ocr-service-factory-refactor.md`
- **Implementaciones:**
  - `src/infrastructure/services/ocr/GeminiVisionOCRService.ts`
  - `src/infrastructure/services/ocr/OllamaVisionOCRService.ts`
  - `src/infrastructure/services/MockOCRService.ts`
  - `src/domain/services/IOCRService.ts`