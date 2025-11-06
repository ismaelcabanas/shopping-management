# ADR 006: Vitest + React Testing Library + Playwright

**Estado:** Aceptado
**Fecha:** 2024-11-06
**Autores:** Equipo de Desarrollo

## Contexto

Necesitamos herramientas de testing que:
- Sean rápidas y eficientes
- Integren bien con Vite
- Permitan tests unitarios, de componentes, integración y E2E
- Tengan buen soporte de la comunidad

## Decisión

Stack de testing elegido:

### 1. Vitest
**Para:** Tests unitarios y de componentes

**Razones:**
- Integración nativa con Vite (misma configuración)
- ~10x más rápido que Jest
- API compatible con Jest (fácil migración)
- Hot module reload en tests
- Soporte nativo de ESM y TypeScript

### 2. React Testing Library
**Para:** Tests de componentes React

**Razones:**
- Testing basado en comportamiento, no implementación
- Fomenta buenas prácticas (testar como un usuario)
- Queries accesibles por defecto
- Mantenido por la comunidad de Testing Library

### 3. Playwright
**Para:** Tests End-to-End

**Razones:**
- Soporte multi-browser (Chromium, Firefox, WebKit)
- Auto-wait (no más `sleep()` hardcodeados)
- Debugging excelente con UI mode
- Parallelización automática
- Screenshots y videos en fallos

### Configuración

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    exclude: ['e2e/**'],
  },
});

// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
  },
});
```

## Consecuencias

### Positivas

- ✅ **Rendimiento**: Tests unitarios ejecutan en ~30ms
- ✅ **DX mejorado**: HMR en tests, UI mode en E2E
- ✅ **Confiabilidad**: Auto-waiting reduce flakiness
- ✅ **Integración Vite**: Sin configuración extra
- ✅ **CI/CD**: 211 tests ejecutan en <2min en CI
- ✅ **Debugging**: UI mode de Playwright es excelente

### Negativas

- ⚠️ **Ecosistema más nuevo**: Menos ejemplos que Jest
- ⚠️ **Playwright pesado**: Descarga browsers (~300MB)

### Métricas

- **211 tests** pasando en total
- **Test unitarios**: ~30ms promedio
- **Test de componentes**: ~50ms promedio
- **Test E2E**: ~500ms promedio
- **Pipeline CI completo**: <2 minutos

### Comandos

```bash
# Tests unitarios/componentes (watch mode)
npm run test

# Tests unitarios/componentes (CI)
npm run test:unit

# E2E con UI (desarrollo)
npm run test:e2e:ui

# E2E headless (CI)
npm run test:e2e
```