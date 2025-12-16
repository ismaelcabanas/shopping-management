# US-024: Modo Compra con Página Dedicada

**Épica**: Gestión de Consumo (Epic 4)
**Estado**: 🔴 Pendiente
**Story Points**: 5 SP (~5h)
**Prioridad**: ⭐⭐⭐⭐⭐
**Depends On**: US-022 (Marcar productos en lista)
**Sprint**: 10 (Propuesto)

---

## Historia de Usuario

**Como** usuario que va a hacer la compra
**Quiero** iniciar un "modo compra" que me lleve a una página dedicada para marcar productos conforme los añado al carrito
**Para** tener una experiencia guiada que conecte mi lista de planificación con el registro final de la compra

---

## Contexto

Actualmente existe una desconexión entre la **lista de compra** (planificación) y el **registro de compra** (ejecución):

**Problema Actual:**
```
📋 Shopping List              🛒 Registro de Compra
- Ver productos               - Proceso independiente
- Checkboxes siempre visibles - No usa la lista
- Sin botones de registro     - Usuario empieza desde cero
```

**Solución Propuesta:**
```
📋 /shopping-list                   🛒 /shopping/start
- Lista solo lectura                - Página dedicada para comprar
- Botón "Iniciar Compra"           - Checkboxes activos
                                    - Botones de registro visibles
↓ Click "Iniciar Compra"           ↓ Registrar o Cancelar

✅ Registro → Actualiza stock → Lista VACÍA y RECALCULA → Navega a /shopping-list
```

---

## Principios de Diseño

**1. Separación de Responsabilidades**
- `/shopping-list`: Vista de consulta (solo lectura)
- `/shopping/start`: Vista de ejecución (compra activa)
- Cada página tiene un propósito claro

**2. Lista como APOYO (no restrictivo)**
- Usuario puede ignorar productos de la lista
- Usuario puede comprar productos NO listados
- Checkboxes son herramienta personal, no afectan registro

**3. Registro = FUENTE DE VERDAD**
- Lo que se registra (OCR o manual) es lo que realmente se compró
- Checkboxes NO pre-seleccionan productos en modal
- Registro funciona igual que ahora (sin cambios en lógica)

**4. Post-Compra: Limpieza Automática**
- Lista se VACÍA completamente
- Lista se RECALCULA basada en stock actualizado
- Navegación automática a `/shopping-list`
- Ciclo limpio para próxima compra

---

## Criterios de Aceptación

### 1. Página de Lista (`/shopping-list`) - Solo Lectura

- [ ] Lista muestra productos SIN checkboxes
- [ ] Productos tienen formato: `□ Nombre - Badge Stock`
- [ ] Badge de urgencia visible (🔴 Sin stock, 🟡 Stock bajo)
- [ ] Botón "🛒 Iniciar Compra" visible y primario
- [ ] NO hay botones de registro visibles
- [ ] Mensaje informativo si lista vacía
- [ ] Al click "Iniciar Compra" → navega a `/shopping/start`

### 2. Nueva Página de Compra Activa (`/shopping/start`)

- [ ] Ruta: `/shopping/start`
- [ ] Header: "🛒 Comprando..."
- [ ] Lista muestra productos CON checkboxes habilitados
- [ ] Checkboxes funcionan (marcar/desmarcar)
- [ ] Estado de checkboxes persiste en localStorage
- [ ] Botones visibles:
  - [ ] `[📷 Escanear Ticket]` - Botón primario verde
  - [ ] `[📝 Registrar Manual]` - Botón secundario
  - [ ] `[❌ Cancelar Compra]` - Botón terciario
- [ ] Layout responsive (mobile + desktop)

### 3. Navegación y Flujo

- [ ] `/shopping-list` → botón "Iniciar Compra" → `/shopping/start`
- [ ] `/shopping/start` → botón "Cancelar" → `/shopping-list`
- [ ] Browser back en `/shopping/start` → vuelve a `/shopping-list`
- [ ] Después de registrar compra → navega a `/shopping-list`

### 4. Integración con Registro (OCR o Manual)

- [ ] Botón "📷 Escanear Ticket" abre TicketScanModal (existente)
- [ ] Botón "📝 Registrar Manual" abre RegisterPurchaseModal (existente)
- [ ] Modales NO reciben productos pre-seleccionados
- [ ] Usuario registra productos libremente (con o sin relación a la lista)
- [ ] Al confirmar registro exitoso → trigger post-compra

### 5. Post-Compra: Limpieza y Recalculo

- [ ] Después de confirmar registro exitoso:
  - [ ] Inventario actualizado (ya funciona)
  - [ ] Lista de compra se VACÍA completamente
  - [ ] Lista se RECALCULA desde inventario actualizado
  - [ ] Productos con stock bajo/vacío vuelven a aparecer
  - [ ] Todos los checkboxes reseteados
  - [ ] Navega automáticamente a `/shopping-list`
- [ ] Toast de confirmación: "✅ Compra registrada y lista actualizada"

### 6. Cancelar Compra

- [ ] Botón "❌ Cancelar Compra" visible en `/shopping/start`
- [ ] Al cancelar:
  - [ ] Navega a `/shopping-list`
  - [ ] Estado de checkboxes se MANTIENE (por si retoma)
  - [ ] NO se limpian los checks previos
  - [ ] Usuario puede volver a iniciar compra

---

## Mockup Visual

### Página 1: `/shopping-list` (Solo Lectura)

```
┌─────────────────────────────────────┐
│ 📋 Lista de Compra                  │
├─────────────────────────────────────┤
│                                      │
│ □ Leche - Stock bajo 🟡             │
│ □ Huevos - Sin stock 🔴             │
│ □ Pan - Stock bajo 🟡               │
│                                      │
│                                      │
│ [🛒 Iniciar Compra]                  │
│                                      │
└─────────────────────────────────────┘
```

### Página 2: `/shopping/start` (Compra Activa)

```
┌─────────────────────────────────────┐
│ 🛒 Comprando...         [❌ Cancelar]│
├─────────────────────────────────────┤
│                                      │
│ ☐ Leche - Stock bajo 🟡             │
│ ☑ Huevos - Sin stock 🔴             │
│ ☑ Pan - Stock bajo 🟡               │
│                                      │
│                                      │
│ [📷 Escanear Ticket]                 │
│ [📝 Registrar Manual]                │
│                                      │
└─────────────────────────────────────┘
```

### Post-Registro: Vuelve a `/shopping-list`

```
┌─────────────────────────────────────┐
│ 📋 Lista de Compra                  │
├─────────────────────────────────────┤
│                                      │
│ □ Café - Stock bajo 🟡               │  ← Nuevo item
│                                      │    (stock bajó)
│                                      │
│ [🛒 Iniciar Compra]                  │
│                                      │
└─────────────────────────────────────┘

Toast: "✅ Compra registrada y lista actualizada"
```

---

## Detalles Técnicos

### 1. Estructura de Componentes

```
src/presentation/
├── pages/
│   ├── ShoppingListPage.tsx          ← Página existente (modificar)
│   └── ActiveShoppingPage.tsx        ← NUEVA página
├── components/
│   └── ShoppingListView.tsx          ← NUEVO componente compartido
└── hooks/
    └── useShoppingList.ts             ← Existente (agregar método)
```

### 2. ShoppingListView.tsx (Nuevo Componente Compartido)

```typescript
// Componente reutilizable para mostrar lista
interface ShoppingListViewProps {
  items: ShoppingListItemWithDetails[]
  readonly: boolean  // true = sin checkboxes, false = con checkboxes
  onToggleChecked?: (productId: ProductId) => void
}

export function ShoppingListView({ items, readonly, onToggleChecked }: ShoppingListViewProps) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.productId.value}>
          {/* Checkbox solo si NO es readonly */}
          {!readonly && (
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => onToggleChecked?.(item.productId)}
            />
          )}

          {/* Nombre y badge */}
          <span>{item.productName}</span>
          {getStockLevelBadge(item.stockLevel)}
        </li>
      ))}
    </ul>
  )
}
```

### 3. ShoppingListPage.tsx (Modificar)

```typescript
// Simplificar: solo vista de lectura
export function ShoppingListPage() {
  const { items, isLoading, error } = useShoppingList()
  const navigate = useNavigate()

  const handleStartShopping = () => {
    navigate('/shopping/start')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">📋 Lista de Compra</h1>

      {items.length === 0 ? (
        <EmptyListMessage />
      ) : (
        <ShoppingListView items={items} readonly={true} />
      )}

      <Button
        onClick={handleStartShopping}
        className="mt-6"
        variant="primary"
      >
        🛒 Iniciar Compra
      </Button>
    </div>
  )
}
```

### 4. ActiveShoppingPage.tsx (Nueva)

```typescript
// Página dedicada para compra activa
export function ActiveShoppingPage() {
  const { items, isLoading, error, toggleChecked } = useShoppingList()
  const navigate = useNavigate()
  const [showOCRModal, setShowOCRModal] = useState(false)
  const [showManualModal, setShowManualModal] = useState(false)

  const handleCancel = () => {
    navigate('/shopping-list')
  }

  const handleRegisterComplete = async () => {
    // Después de confirmar compra (desde cualquier modal)
    await recalculateShoppingList.execute()
    toast.success('✅ Compra registrada y lista actualizada')
    navigate('/shopping-list')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🛒 Comprando...</h1>
        <Button variant="ghost" onClick={handleCancel}>
          ❌ Cancelar
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyListMessage />
      ) : (
        <ShoppingListView
          items={items}
          readonly={false}
          onToggleChecked={toggleChecked}
        />
      )}

      <div className="mt-6 space-y-3">
        <Button
          onClick={() => setShowOCRModal(true)}
          className="w-full"
          variant="primary"
        >
          📷 Escanear Ticket
        </Button>

        <Button
          onClick={() => setShowManualModal(true)}
          className="w-full"
          variant="secondary"
        >
          📝 Registrar Manual
        </Button>
      </div>

      {/* Modales (reutilizan existentes) */}
      {showOCRModal && (
        <TicketScanModal
          onClose={() => setShowOCRModal(false)}
          onComplete={handleRegisterComplete}
        />
      )}

      {showManualModal && (
        <RegisterPurchaseModal
          onClose={() => setShowManualModal(false)}
          onComplete={handleRegisterComplete}
        />
      )}
    </div>
  )
}
```

### 5. Router (App.tsx)

```typescript
// Agregar nueva ruta
<Routes>
  {/* Rutas existentes */}
  <Route path="/" element={<WelcomePage />} />
  <Route path="/catalog" element={<ProductCatalogPage />} />
  <Route path="/inventory" element={<InventoryPage />} />
  <Route path="/shopping-list" element={<ShoppingListPage />} />

  {/* NUEVA ruta */}
  <Route path="/shopping/start" element={<ActiveShoppingPage />} />
</Routes>
```

### 6. Nuevos Use Cases

**RecalculateShoppingList.ts**:
```typescript
// Application Layer
export class RecalculateShoppingList {
  constructor(
    private inventoryRepository: InventoryRepository,
    private shoppingListRepository: ShoppingListRepository
  ) {}

  async execute(): Promise<void> {
    // 1. Obtener todos los productos del inventario
    const inventoryItems = await this.inventoryRepository.findAll()

    // 2. Filtrar productos con stock bajo/vacío
    const productsNeedingRestock = inventoryItems.filter(
      item => item.stockLevel === 'low' || item.stockLevel === 'empty'
    )

    // 3. Limpiar lista actual
    await this.shoppingListRepository.clear()

    // 4. Agregar productos con stock bajo a la lista
    for (const item of productsNeedingRestock) {
      await this.shoppingListRepository.add(
        new ShoppingListItem(
          item.productId,
          'auto',
          item.stockLevel,
          new Date(),
          false // checked = false por defecto
        )
      )
    }
  }
}
```

### 7. Repositorio Actualizado

**LocalStorageShoppingListRepository.ts**:
```typescript
// Nuevo método
async clear(): Promise<void> {
  await this.localStorageClient.clear()
}
```

### 8. Hook Actualizado

**useShoppingList.ts**:
```typescript
// Agregar método de recalculo
const recalculate = useCallback(async (): Promise<void> => {
  const recalculateUseCase = new RecalculateShoppingList(
    inventoryRepository,
    shoppingListRepository
  )
  await recalculateUseCase.execute()
  await loadShoppingList() // Refresh data
}, [inventoryRepository, shoppingListRepository, loadShoppingList])

return {
  items,
  isLoading,
  error,
  toggleChecked,
  checkedCount,
  recalculate, // NUEVO
  refresh
}
```

---

## Casos Edge

### 1. Lista vacía al iniciar compra
**Comportamiento**: Permite navegar a `/shopping/start` igual
- Usuario puede registrar compra aunque lista esté vacía
- Útil si quiere registrar productos no planificados
- Mensaje: "Tu lista está vacía, pero puedes registrar tu compra de todas formas"

### 2. Usuario marca checkboxes pero no registra
**Comportamiento**: Checkboxes permanecen marcados
- Estado persiste en localStorage
- Si vuelve a `/shopping/start`, checkboxes siguen ahí

### 3. Registro falla (error de red, etc.)
**Comportamiento**: Permanece en `/shopping/start`
- Checkboxes mantienen estado
- Usuario puede reintentar
- NO se limpia lista
- NO navega de vuelta

### 4. Usuario cancela compra
**Comportamiento**: Navega a `/shopping-list`
- Checkboxes permanecen marcados (estado guardado)
- Puede retomar después sin perder progreso

### 5. Durante registro, compra productos NO listados
**Comportamiento**: Funciona normal
- Registro acepta cualquier producto del catálogo
- Lista no se valida contra registro
- Lista se recalcula después basada solo en stock

### 6. Usuario accede directamente a `/shopping/start` (URL manual)
**Comportamiento**: Funciona normal
- Carga la lista actual
- Permite usar la página normalmente
- No requiere pasar por `/shopping-list` primero

### 7. Browser back desde `/shopping/start`
**Comportamiento**: Vuelve a `/shopping-list`
- Equivalente a "Cancelar Compra"
- Checkboxes se mantienen

---

## Impacto

**UX:**
- ✅ Separación clara: Planificación vs. Ejecución
- ✅ Browser back/forward funciona naturalmente
- ✅ URL expresa el estado actual (`/shopping/start`)
- ✅ Cada página tiene un propósito único
- ✅ Checkboxes tienen propósito claro (ayuda durante compra)
- ✅ No hay validaciones molestas (flexible)

**Técnico:**
- ✅ Componentes simples con responsabilidad única
- ✅ Fácil de testear (páginas independientes)
- ✅ Reutiliza código existente (modales, use cases)
- ✅ Arquitectura escalable (fácil agregar `/shopping/history`, etc.)
- ✅ No rompe nada existente (solo agrega funcionalidad)

**Producto:**
- ✅ Completa el ciclo: Consumo → Lista → Compra → Inventario
- ✅ Épica 4 avanza: 2/4 → 3/4
- ✅ Desbloquea futuras features (US-014: Alertas, Dashboard)

---

## Testing

### Unit Tests (~15 tests)

**RecalculateShoppingList.ts**:
- ✅ Limpia lista existente antes de recalcular
- ✅ Agrega productos con stock 'low' a la lista
- ✅ Agrega productos con stock 'empty' a la lista
- ✅ NO agrega productos con stock 'medium' o 'high'
- ✅ Marca items como reason='auto'
- ✅ Marca items con checked=false por defecto

**LocalStorageShoppingListRepository.ts**:
- ✅ Método clear() limpia localStorage correctamente
- ✅ Clear no afecta otros prefijos de localStorage

### Component Tests (~12 tests)

**ShoppingListPage.tsx**:
- ✅ Renderiza lista sin checkboxes
- ✅ Botón "Iniciar Compra" visible
- ✅ Click en botón navega a /shopping/start
- ✅ Mensaje correcto si lista vacía

**ActiveShoppingPage.tsx**:
- ✅ Renderiza lista con checkboxes
- ✅ Checkboxes funcionan (toggle)
- ✅ Botones de registro visibles
- ✅ Botón "Cancelar" navega a /shopping-list
- ✅ Click "Escanear Ticket" abre modal
- ✅ Click "Registrar Manual" abre modal

**ShoppingListView.tsx**:
- ✅ Renderiza sin checkboxes cuando readonly=true
- ✅ Renderiza con checkboxes cuando readonly=false

### Integration Tests (~4 tests)

- ✅ Navegación: /shopping-list → /shopping/start → cancelar
- ✅ Flujo completo: inicio → marcar → registrar manual → lista recalculada
- ✅ Flujo completo: inicio → escanear OCR → lista recalculada
- ✅ Browser back desde /shopping/start vuelve a /shopping-list

### E2E Tests (~2 tests)

```typescript
// e2e/us-024-shopping-mode.spec.ts
test('should complete shopping flow with manual registration', async ({ page }) => {
  // 1. Preparar: productos en inventario con stock bajo
  // 2. Navegar a /shopping-list → lista tiene 2 productos
  // 3. Click "Iniciar Compra" → navega a /shopping/start
  // 4. Marcar checkboxes
  // 5. Click "Registrar Manual"
  // 6. Seleccionar productos (incluye uno NO listado)
  // 7. Confirmar
  // 8. Verificar: vuelve a /shopping-list, lista recalculada, inventario actualizado
})

test('should complete shopping flow with OCR', async ({ page }) => {
  // Similar pero usando "Escanear Ticket"
})
```

**Total estimado**: ~33 tests

---

## Definition of Done

### Tests
- [ ] 15 unit tests para RecalculateShoppingList y repository
- [ ] 12 component tests para ShoppingListPage, ActiveShoppingPage, ShoppingListView
- [ ] 4 integration tests para flujos de navegación
- [ ] 2 E2E tests (manual + OCR)
- [ ] Todos los tests pasando (target: 530+ unit, 23 E2E)

### Implementación
- [ ] Componente ShoppingListView creado y testeado
- [ ] ActiveShoppingPage creada en `/shopping/start`
- [ ] ShoppingListPage simplificada (solo lectura)
- [ ] Ruta `/shopping/start` configurada en router
- [ ] Botón "Iniciar Compra" navega correctamente
- [ ] Botones de registro solo en ActiveShoppingPage
- [ ] Botón "Cancelar" funciona
- [ ] Post-registro: lista vacía, recalculada, navegación automática
- [ ] Toast de confirmación visible
- [ ] Browser back funciona naturalmente

### Validación
- [ ] Funciona en desktop y mobile (responsive)
- [ ] Navegación fluida entre páginas
- [ ] Estado persiste correctamente
- [ ] Lista recalcula correctamente después de compra
- [ ] Checkboxes resetean después de registro
- [ ] URL refleja estado correctamente

### Documentación
- [ ] User story completada y movida a `completed/epic-4/`
- [ ] ROADMAP.md actualizado
- [ ] CHANGELOG.md con entrada de Sprint 10
- [ ] US-023 eliminada del backlog
- [ ] Screenshots en US si necesario

---

## Implementación por Pasos (TDD)

### Fase 1: RecalculateShoppingList Use Case (1h)
1. **Red**: Tests de RecalculateShoppingList
2. **Green**: Implementar lógica de recalculo
3. **Red**: Tests de repository.clear()
4. **Green**: Implementar clear()
5. **Refactor**: Optimizar queries

### Fase 2: ShoppingListView Component (1h)
1. **Red**: Tests de ShoppingListView (readonly modes)
2. **Green**: Implementar componente compartido
3. **Refactor**: Extraer estilos comunes

### Fase 3: ActiveShoppingPage (1.5h)
1. **Red**: Tests de ActiveShoppingPage
2. **Green**: Implementar nueva página
3. **Red**: Tests de navegación
4. **Green**: Configurar ruta en router
5. **Refactor**: Limpiar código

### Fase 4: ShoppingListPage (Simplificar) (0.5h)
1. **Red**: Tests actualizados (sin checkboxes)
2. **Green**: Refactorizar usando ShoppingListView
3. **Refactor**: Limpiar código legacy

### Fase 5: Integración Post-Compra (1h)
1. **Red**: Tests de integración con RegisterPurchase
2. **Green**: Llamar RecalculateShoppingList + navegación
3. **Red**: Tests con TicketScan
4. **Green**: Misma lógica para OCR
5. **Refactor**: Extraer lógica compartida

### Fase 6: E2E Tests (0.5h)
1. E2E para flujo manual
2. E2E para flujo OCR
3. Validación manual
4. Ajustes finales de UX

**Total estimado**: 5.5 horas (redondeado a 5 SP)

---

## Riesgos y Mitigaciones

### Riesgo 1: Usuario confundido por dos páginas
**Probabilidad**: Baja
**Impacto**: Bajo
**Mitigación**:
- ✅ Botón "Iniciar Compra" muy claro
- ✅ Botón "Cancelar" prominente en ActiveShopping
- ✅ Browser back funciona naturalmente
- ✅ Transición suave entre páginas

### Riesgo 2: Lista recalcula mal (bugs en lógica)
**Probabilidad**: Baja
**Impacto**: Alto
**Mitigación**:
- ✅ Tests exhaustivos de RecalculateShoppingList
- ✅ Validación manual con múltiples escenarios
- ✅ Logging de operaciones para debug

### Riesgo 3: Estado de checkboxes se pierde al navegar
**Probabilidad**: Muy baja
**Impacto**: Medio
**Mitigación**:
- ✅ Estado persiste en localStorage
- ✅ Se mantiene entre navegaciones
- ✅ Solo se resetea después de registro exitoso

---

## Mejoras Futuras (Post-Sprint 10)

**No incluidas en US-024, considerar para futuro:**

### Sprint 11+
- [ ] **US-025: Shopping History** - Ver historial de compras (`/shopping/history`)
- [ ] **US-026: Quick Actions** - Botones rápidos en `/shopping-list` para productos frecuentes
- [ ] **US-027: Smart Recalculation** - Solo recalcular productos afectados (performance)
- [ ] **US-028: Shopping Timer** - Trackear tiempo en modo compra (analytics)

---

## Referencias

- [US-012: Registrar consumo de productos](../../completed/epic-4/US-012-registrar-consumo.md)
- [US-022: Marcar productos en lista](../../completed/epic-4/US-022-lista-compra-checkbox.md)
- [US-008: Registrar compra](../../completed/epic-2/US-008-registrar-compra-actualizar-inventario.md)
- [US-009: Escanear ticket (OCR)](../../completed/epic-3/US-009-escanear-ticket-registrar-compra.md)
- [ROADMAP](../../../ROADMAP.md)
- [CLAUDE.md](../../../../CLAUDE.md)

---

**Last updated**: 2025-12-16
**Sprint propuesto**: Sprint 10
**Estimación validada**: 5 SP (~5 horas)
**Tests estimados**: 33 tests (15 unit + 12 component + 4 integration + 2 E2E)
**Arquitectura**: Nueva página `/shopping/start` + componente compartido `ShoppingListView`
