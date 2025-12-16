# US-022: Marcar Productos en Lista de Compra

**Épica**: Gestión de Consumo (Epic 4)
**Estado**: ✅ Completada (Sprint 9 - 2025-12-15)
**Story Points**: 3 SP (~3h)
**Prioridad**: ⭐⭐⭐⭐⭐
**Feedback Source**: Testing manual post-Sprint 8 (2025-12-12)
**Depends On**: US-012 (Registrar consumo de productos)

---

## Historia de Usuario

**Como** usuario comprando en el supermercado
**Quiero** marcar los productos de mi lista conforme los voy añadiendo al carrito
**Para** llevar control de qué he cogido sin eliminar items prematuramente de la lista

---

## Contexto

El flujo actual de la lista de compra tiene un problema de UX identificado durante testing manual:

**Flujo Actual (Problemático)**:
1. Usuario ve lista de compra
2. Click en "Comprado" → producto desaparece inmediatamente
3. ❌ **Problema**: En el supermercado, necesito ver la lista mientras compro

**Flujo Real (Esperado)**:
1. Usuario ve lista de compra con checkboxes
2. Usuario marca checkbox conforme añade producto al carrito
3. Usuario continúa viendo todos los productos (marcados y sin marcar)
4. Al finalizar, usuario registra la compra desde la lista
5. ✅ **Resultado**: Flujo natural que replica el comportamiento real

---

## Criterios de Aceptación

### 1. Checkbox en Cada Item
- [ ] Cada producto en la lista de compra muestra un checkbox a la izquierda
- [ ] Checkbox es fácilmente accesible (touch target ≥44x44px en mobile)
- [ ] Estado del checkbox se persiste en localStorage

### 2. Comportamiento de Marcado
- [ ] Click en checkbox marca el producto como "checked"
- [ ] Productos marcados muestran estilo visual diferenciado:
  - Checkbox con checkmark ✓
  - Texto con opacidad reducida (opacity: 0.6)
  - Mantienen badge de urgencia visible
- [ ] Click en checkbox marcado desmarca el producto

### 3. Estado Persistente
- [ ] Estado "checked" se guarda en ShoppingListItem
- [ ] Estado persiste al recargar la página
- [ ] Estado persiste al navegar entre secciones

### 4. Eliminación del Botón "Comprado"
- [ ] Eliminar botón individual "Comprado" de cada item
- [ ] Mantener botón de eliminar item (🗑️) sin cambios

---

## Mockup Visual

```
┌─────────────────────────────────────┐
│ 📋 Lista de Compra                  │
├─────────────────────────────────────┤
│ ☐ Leche - Sin stock 🔴             │
│   [🗑️ Eliminar]                     │
├─────────────────────────────────────┤
│ ☑ Huevos - Stock bajo 🟡           │ (checked, con opacidad)
│   [🗑️ Eliminar]                     │
├─────────────────────────────────────┤
│ ☐ Pan - Stock bajo 🟡               │
│   [🗑️ Eliminar]                     │
├─────────────────────────────────────┤
│                                      │
│ [➕ Añadir Producto]                 │
│ [✅ Registrar Compra (2)]            │  (contador de checked)
└─────────────────────────────────────┘
```

---

## Impacto

**UX:**
- ✅ Flujo natural que replica comportamiento del supermercado
- ✅ Reduce error de "comprado por accidente"
- ✅ Permite revisar lista completa durante compras

**Técnico:**
- Cambio mínimo en modelo de datos (agregar campo `checked`)
- No requiere cambios en domain/application layers
- Solo actualización de componente ShoppingListPage

---

## Detalles Técnicos

### 1. Modelo de Datos

**ShoppingListItem** (existing entity):
```typescript
interface ShoppingListItem {
  productId: string
  reason: 'auto' | 'manual'
  stockLevel?: StockLevel
  addedAt: Date
  checked: boolean  // 🆕 NUEVO CAMPO
}
```

### 2. Componentes Actualizados

**ShoppingListPage.tsx**:
- Reemplazar botón "Comprado" por checkbox
- Agregar estilos visuales para items checked
- Mantener lógica de eliminación sin cambios
- Agregar contador de items checked en botón "Registrar Compra"

### 3. Repositorio

**LocalStorageShoppingListRepository.ts**:
- DTO incluye campo `checked` (default: false)
- Método `toggleChecked(productId: string)` para cambiar estado
- Método `getCheckedItems()` para obtener productos marcados

### 4. Hook

**useShoppingList.ts**:
- Agregar método `toggleChecked(productId: string)`
- Agregar computed property `checkedCount`
- Mantener compatibilidad con lógica existente

---

## No Requiere

- ❌ Cambios en domain models (Product, InventoryItem)
- ❌ Nuevos use cases
- ❌ Cambios en LocalStorageInventoryRepository
- ❌ Cambios en UpdateStockLevel use case

---

## Definition of Done

### Tests
- [x] Test unitario: ShoppingListItem con campo `checked`
- [x] Test unitario: LocalStorageShoppingListRepository.toggleChecked()
- [x] Test unitario: useShoppingList.toggleChecked()
- [x] Test componente: ShoppingListPage muestra checkboxes
- [x] Test componente: Click en checkbox cambia estado
- [x] Test componente: Estado checked persiste en localStorage

### Implementación
- [x] Checkbox visible en cada item
- [x] Estado checked persiste al recargar
- [x] Estilos visuales para items checked (opacidad)
- [x] Botón "Comprado" eliminado
- [x] Contador de items checked en botón "Registrar Compra"

### Validación
- [x] Funcional en desktop y mobile (responsive)
- [x] Touch target de checkbox ≥44x44px en mobile
- [x] Estado persiste entre navegaciones
- [x] Compatible con flujo existente de agregar/eliminar items

---

## Notas de Implementación

### Compatibilidad con Datos Existentes

```typescript
// Al cargar shopping list existente sin campo 'checked'
const item = storage.get<ShoppingListItemDTO>('shopping-list')
// Si checked es undefined, default a false
item.checked = item.checked ?? false
```

### Orden de Visualización

Considerar dos opciones (decidir con usuario):

**Opción A**: Items sin cambio de orden
- Mantiene orden cronológico (addedAt)
- Items checked se muestran con menor opacidad

**Opción B**: Items checked al final
- Items sin marcar primero (ordenados por urgencia)
- Items checked al final de la lista
- Facilita foco en pendientes

**Recomendación**: Opción A para primera iteración (simplicidad)

---

## Links Relacionados

- [US-012: Registrar consumo de productos](../completed/epic-4/US-012-registrar-consumo.md)
- [US-024: Modo Compra con Página Dedicada](../../backlog/high-priority/US-024-shopping-mode.md) - Historia siguiente
- [QW-005: Dashboard accionable](../../backlog/high-priority/QW-005-dashboard-accionable.md)
