📋 PLAN DE TESTING ESTRATÉGICO

🎯 Objetivos del Plan de Testing

1. Demostrar ventajas de Clean Architecture - cada capa testeable independientemente
2. Cobertura completa - desde Value Objects hasta Components
3. Tests rápidos y confiables - sin dependencias externas
4. Documentación viva - tests como especificación del comportamiento

🏗 Estructura de Testing por Capas

📊 Cobertura Estimada por Capa:

| Capa           | Archivos a testear           | Tests estimados | Complejidad            |
| -------------- | ---------------------------- | --------------- | ---------------------- |
| Domain         | 3 Value Objects + 2 Entities | ~15 tests       | 🟢 Baja (sin deps)     |
| Application    | 4 Use Cases + 1 Service      | ~12 tests       | 🟡 Media (mock repos)  |
| Infrastructure | 1 Repository + 1 Adapter     | ~8 tests        | 🟡 Media (integration) |
| Presentation   | 1 Hook + 2 Components        | ~10 tests       | 🔴 Alta (React/DOM)    |
| TOTAL          | 11 archivos                  | ~45 tests       | -                      |

🧠 1. Domain Layer Tests (Empezar aquí - más fácil)

Value Objects Tests:

// ItemStatus.test.ts - ~5 tests
✅ should create needed status
✅ should create bought status
✅ should toggle from needed to bought
✅ should validate only valid statuses
✅ should compare statuses correctly

// Quantity.test.ts - ~6 tests
✅ should create valid quantity
✅ should reject negative quantities
✅ should reject non-integer quantities
✅ should add quantities correctly
✅ should subtract quantities correctly
✅ should prevent subtraction resulting in negative

// Unit.test.ts - ~4 tests
✅ should create valid units
✅ should reject invalid units
✅ should provide factory methods (units(), kilograms(), etc.)
✅ should compare units correctly

⚙️ 2. Application Layer Tests (Lógica de negocio)

Use Cases Tests:

// UpdateQuantityUseCase.test.ts - ~3 tests
✅ should update item quantity successfully
✅ should throw error when item not found
✅ should validate quantity with domain rules

// ToggleItemStatusUseCase.test.ts - ~3 tests
✅ should toggle from needed to bought
✅ should toggle from bought to needed
✅ should throw error when item not found

// GetShoppingListUseCase.test.ts - ~3 tests
✅ should return all items
✅ should filter needed items correctly
✅ should filter bought items correctly

// BulkActionsUseCase.test.ts - ~2 tests
✅ should mark all items as bought
✅ should mark all items as needed

// ShoppingListService.test.ts - ~1 integration test
✅ should coordinate use cases correctly

🔧 3. Infrastructure Layer Tests (Implementaciones)

Repository Tests:

// MockShoppingListRepository.test.ts - ~5 tests
✅ should save and retrieve items
✅ should find item by id
✅ should update existing items
✅ should delete items
✅ should handle bulk operations

// ShoppingListAdapter.test.ts - ~3 tests
✅ should convert domain to legacy format
✅ should convert legacy to domain format
✅ should handle arrays correctly

🎨 4. Presentation Layer Tests (React components)

Hook Tests:

// useShoppingList.test.ts - ~5 tests
✅ should load items on mount
✅ should update quantity and refresh
✅ should toggle status and refresh
✅ should handle loading states
✅ should handle errors gracefully

// Component Tests - ~5 tests
✅ should render shopping list correctly
✅ should display needed vs bought sections
✅ should handle user interactions
✅ should show loading state
✅ should handle empty states

🛠 Setup y Configuración

Testing Stack:

- Vitest - Fast test runner (compatible con Vite)
- @testing-library/react - React component testing
- @testing-library/jest-dom - Additional matchers
- @testing-library/user-event - User interaction simulation

Configuración necesaria:

// vitest.config.ts
// Test setup files
// Mock configurations
// Coverage settings

📈 Estrategia de Implementación

Fase 1: Domain Tests (30 min)

- Value Objects tests (más fácil, sin mocks)
- Base sólida para el resto

Fase 2: Application Tests (45 min)

- Use Cases con repository mocks
- Service integration tests

Fase 3: Infrastructure Tests (30 min)

- Repository implementation tests
- Adapter conversion tests

Fase 4: Presentation Tests (45 min)

- Custom hook tests
- Component integration tests

Fase 5: Coverage & CI (15 min)

- Coverage reports
- Test scripts en package.json

🎯 Beneficios Esperados

Demostración de Clean Architecture:

- Domain tests sin dependencias externas
- Application tests con mocks simples
- Infrastructure tests aislados
- Presentation tests enfocados en UI

Calidad de código:

- Cobertura objetivo: >85%
- Tests rápidos: <5 segundos total
- Feedback inmediato durante desarrollo
- Documentación del comportamiento esperado

🔮 Plan de Ejecución

¿Te parece bien este plan? Mi propuesta es:

1. Empezar con Domain Layer (más fácil, éxito rápido)
2. Configurar Vitest mientras hacemos los primeros tests
3. Continuar layer por layer hasta cobertura completa
4. Documentar los resultados en el SETUP_LOG.md
