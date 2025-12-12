# US-023: Validar Compras Contra Lista

**Épica**: Gestión de Consumo (Epic 4)
**Estado**: 🔴 Pendiente
**Story Points**: 3 SP (~3h)
**Prioridad**: ⭐⭐⭐⭐⭐
**Feedback Source**: Testing manual post-Sprint 8 (2025-12-12)
**Depends On**: US-022 (Marcar productos en lista)

---

## Historia de Usuario

**Como** usuario que acaba de hacer la compra
**Quiero** registrar mi compra desde la lista de compra con productos pre-seleccionados
**Para** registrar rápidamente lo que compré sin tener que buscar cada producto manualmente

---

## Contexto

Después de implementar checkboxes en la lista de compra (US-022), necesitamos mejorar el flujo de registro de compras para integrarlo con los productos marcados.

**Flujo Mejorado**:
1. Usuario marca productos en lista mientras compra (US-022)
2. Usuario click en "Registrar Compra" desde ShoppingListPage
3. ✨ Modal se abre con productos checked pre-seleccionados
4. Usuario ajusta cantidades y confirma
5. ✅ Productos checked se desmarcan/eliminan automáticamente

**Beneficios**:
- Reduce tiempo de registro (productos ya seleccionados)
- Elimina búsqueda manual de productos
- Conecta flujo de lista → compra de forma natural
- Valida que lo comprado coincide con lo planeado

---

## Criterios de Aceptación

### 1. Botón "Registrar Compra" en Shopping List

- [ ] Botón visible en ShoppingListPage con contador
- [ ] Texto: "Registrar Compra (N)" donde N = items checked
- [ ] Botón deshabilitado si no hay items checked
- [ ] Botón primario (color verde/primario de acción)

### 2. Pre-selección en RegisterPurchaseModal

- [ ] Al abrir modal desde ShoppingListPage, productos checked están pre-seleccionados
- [ ] Productos pre-seleccionados muestran:
  - Checkbox marcado
  - Cantidad = 1 (default)
  - Badge indicando origen: "De lista" o similar
- [ ] Usuario puede desmarcar productos si no los compró
- [ ] Usuario puede agregar productos adicionales (no estaban en lista)

### 3. Limpieza Post-Compra

**Opción A: Desmarcar** (Recomendado)
- [ ] Al confirmar compra, productos checked se desmarcan (checked = false)
- [ ] Productos permanecen en lista hasta que stock suba
- [ ] Permite re-usar lista si compra incompleta

**Opción B: Eliminar**
- [ ] Al confirmar compra, productos checked se eliminan de lista
- [ ] Más limpio pero puede causar problemas si compra incompleta
- [ ] Usuario pierde tracking de qué faltaba

### 4. Validación de Compra Incompleta

- [ ] Si modal tiene productos pre-seleccionados y usuario desmarca algunos
- [ ] Al confirmar, mostrar warning: "No compraste X productos de la lista"
- [ ] Opción: "Sí, continuar" / "Cancelar y revisar"
- [ ] Productos no comprados permanecen en lista

---

## Mockup Visual

### ShoppingListPage con Botón

```
┌─────────────────────────────────────┐
│ 📋 Lista de Compra                  │
├─────────────────────────────────────┤
│ ☑ Leche - Sin stock 🔴              │
│ ☑ Huevos - Stock bajo 🟡            │
│ ☐ Pan - Stock bajo 🟡               │
├─────────────────────────────────────┤
│                                      │
│ [➕ Añadir Producto]                 │
│ [✅ Registrar Compra (2)]            │  👈 Nuevo botón
└─────────────────────────────────────┘
```

### RegisterPurchaseModal Pre-seleccionado

```
┌─────────────────────────────────────┐
│ ✅ Registrar Compra                 │
├─────────────────────────────────────┤
│ Productos de tu lista: 🏷️           │
│                                      │
│ ☑ Leche         Cantidad: [1]       │
│                 Badge: "De lista"   │
│                                      │
│ ☑ Huevos        Cantidad: [1]       │
│                 Badge: "De lista"   │
├─────────────────────────────────────┤
│ Otros productos:                    │
│ [➕ Agregar otro producto]           │
├─────────────────────────────────────┤
│         [Cancelar] [Confirmar]      │
└─────────────────────────────────────┘
```

### Warning de Compra Incompleta

```
┌─────────────────────────────────────┐
│ ⚠️ Compra Incompleta                │
├─────────────────────────────────────┤
│ No compraste estos productos:       │
│ • Pan                                │
│                                      │
│ ¿Deseas continuar de todas formas?  │
│                                      │
│   [Cancelar y Revisar] [Continuar]  │
└─────────────────────────────────────┘
```

---

## Impacto

**UX:**
- ✅ Reduce tiempo de registro de compras (hasta 80%)
- ✅ Elimina búsqueda manual de productos
- ✅ Valida que compra coincide con lo planeado
- ✅ Flujo end-to-end: Lista → Compra → Inventario

**Técnico:**
- Cambio mínimo: pasar contexto a RegisterPurchaseModal
- Reutiliza lógica existente de RegisterPurchase
- No requiere cambios en use cases de dominio

---

## Detalles Técnicos

### 1. Navegación con Contexto

**ShoppingListPage → RegisterPurchaseModal**:
```typescript
// En ShoppingListPage.tsx
const checkedItems = shoppingList.items.filter(item => item.checked)

const handleRegisterPurchase = () => {
  // Abrir modal pasando contexto
  openModal('register-purchase', {
    preSelectedProducts: checkedItems.map(item => item.productId)
  })
}
```

### 2. RegisterPurchaseModal Mejorado

```typescript
interface RegisterPurchaseModalProps {
  preSelectedProducts?: string[]  // 🆕 NUEVO
}

// En modal
useEffect(() => {
  if (preSelectedProducts) {
    // Pre-seleccionar productos
    const selected = preSelectedProducts.map(productId => ({
      productId,
      quantity: 1,
      fromList: true  // Badge "De lista"
    }))
    setSelectedProducts(selected)
  }
}, [preSelectedProducts])
```

### 3. Validación de Compra Incompleta

```typescript
const handleConfirm = async () => {
  // Detectar productos de lista que se desmarcaron
  const notPurchased = preSelectedProducts.filter(
    id => !selectedProducts.find(p => p.productId === id)
  )

  if (notPurchased.length > 0) {
    // Mostrar warning modal
    const confirmed = await showWarning(
      'Compra Incompleta',
      `No compraste ${notPurchased.length} producto(s)`
    )
    if (!confirmed) return
  }

  // Proceder con registro normal
  await registerPurchase(selectedProducts)

  // Limpiar lista (Opción A: desmarcar)
  await uncheckPurchasedItems(
    selectedProducts.filter(p => p.fromList).map(p => p.productId)
  )
}
```

### 4. Hook useShoppingList

**Nuevos métodos**:
```typescript
// Desmarcar items después de compra
uncheckItems(productIds: string[]): Promise<void>

// Eliminar items después de compra (Opción B)
removeCheckedItems(productIds: string[]): Promise<void>

// Obtener solo items checked
getCheckedItems(): ShoppingListItem[]
```

---

## Decision Points

### 🤔 ¿Desmarcar o Eliminar después de compra?

**Opción A: Desmarcar (Recomendado)**
- ✅ Permite compras incompletas sin perder tracking
- ✅ Lista se limpia automáticamente cuando stock sube
- ✅ Usuario puede re-comprar fácilmente si faltó algo
- ⚠️ Lista puede acumular items si stock no se actualiza

**Opción B: Eliminar**
- ✅ Lista más limpia inmediatamente
- ❌ Pierde tracking si compra incompleta
- ❌ Puede confundir si producto se vuelve a agregar por consumo

**Decisión sugerida**: Opción A (desmarcar) para primera iteración.

### 🤔 ¿Mostrar warning siempre o solo si hay desmarcados?

**Opción A: Solo si hay desmarcados** (Recomendado)
- Menos friction en flujo normal
- Warning solo cuando necesario

**Opción B: Siempre mostrar resumen**
- Usuario ve siempre qué se compró
- Más confirmación pero más pasos

**Decisión sugerida**: Opción A (solo si desmarcados)

---

## No Requiere

- ❌ Cambios en RegisterPurchase use case
- ❌ Cambios en domain models
- ❌ Nueva lógica de negocio
- ❌ Cambios en ProductCatalogPage

---

## Definition of Done

### Tests
- [ ] Test componente: ShoppingListPage muestra botón con contador
- [ ] Test componente: Botón deshabilitado si no hay checked items
- [ ] Test componente: Modal se abre con productos pre-seleccionados
- [ ] Test componente: Productos pre-seleccionados muestran badge "De lista"
- [ ] Test componente: Warning se muestra si hay productos desmarcados
- [ ] Test integración: Confirmar compra desmarca items en lista
- [ ] Test E2E: Flujo completo (marcar → registrar → verificar)

### Implementación
- [ ] Botón "Registrar Compra (N)" en ShoppingListPage
- [ ] Modal se abre con pre-selección cuando viene de lista
- [ ] Badge "De lista" visible en productos pre-seleccionados
- [ ] Warning modal para compra incompleta
- [ ] Items checked se desmarcan después de confirmar compra
- [ ] Navegación funciona correctamente

### Validación
- [ ] Flujo funciona en desktop y mobile
- [ ] Pre-selección correcta (checked items → selected products)
- [ ] Warning solo aparece cuando necesario
- [ ] Items se desmarcan solo si fueron comprados
- [ ] Usuario puede agregar productos adicionales sin problema

---

## Casos Edge

### 1. Usuario marca items pero no registra compra
- **Resultado**: Items permanecen checked hasta que usuario los desmarca o registra compra

### 2. Usuario desmarca todos los productos pre-seleccionados
- **Resultado**: Warning "No compraste ningún producto de la lista", puede proceder igual

### 3. Usuario agrega productos adicionales (no estaban en lista)
- **Resultado**: Solo se desmarcan items que estaban en lista original

### 4. Error al registrar compra
- **Resultado**: Items permanecen checked, usuario puede reintentar

---

## Links Relacionados

- [US-022: Marcar productos en lista](./US-022-lista-compra-checkbox.md) - Historia previa (dependency)
- [US-012: Registrar consumo de productos](../completed/epic-4/US-012-registrar-consumo.md)
- [US-008: Registrar compra](../completed/epic-2/US-008-registrar-compra-actualizar-inventario.md)

---

## Notas de Implementación

### Reutilización de Código

El modal RegisterPurchaseModal ya existe y funciona. Solo necesita:
1. Prop opcional `preSelectedProducts`
2. Lógica de pre-selección en useEffect
3. Badge condicional si producto viene de lista
4. Warning modal antes de confirmar

**Estimación**: ~80% reutilización, ~20% código nuevo

### Testing Strategy

**Unit Tests**: Hooks y lógica de pre-selección
**Component Tests**: Botón, modal, badges, warnings
**E2E Test**: Flujo completo end-to-end (crítico para esta historia)

```typescript
// e2e/us-023-validate-purchases.spec.ts
test('should register purchase from shopping list', async ({ page }) => {
  // 1. Setup: productos en lista con algunos checked
  // 2. Click "Registrar Compra (2)"
  // 3. Verificar modal muestra 2 productos pre-seleccionados
  // 4. Confirmar compra
  // 5. Verificar items se desmarcaron en lista
  // 6. Verificar inventario actualizado
})
```
