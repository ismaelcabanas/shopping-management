# US-011: Excluir productos del escaneo de ticket

**Épica**: Épica 3 - Automatización de Compras
**Estado**: 🟢 Completado (Sprint 7)
**Story Points**: 2 SP (~1-2h)
**Prioridad**: ⭐⭐⭐⭐

---

## Historia de Usuario

**Como** usuario que escanea tickets de compra
**Quiero** poder eliminar productos del listado escaneado antes de confirmar
**Para** añadir a mi inventario solo los productos relevantes para mi despensa

---

## Contexto

Después de escanear un ticket con OCR (US-009), los usuarios obtienen una lista de todos los productos extraídos. Sin embargo, los tickets del mundo real a menudo contienen productos que los usuarios no desean rastrear en su inventario (por ejemplo, artículos de limpieza, productos desechables, artículos de cuidado personal que no afectan la planificación de la despensa).

Anteriormente, los usuarios debían:
1. Aceptar todos los productos escaneados (llena el inventario con elementos irrelevantes)
2. Cancelar el escaneo completo y agregar manualmente solo los productos relevantes (anula el propósito de la automatización OCR)

---

## Criterios de Aceptación

### 1. Botón de eliminación por producto
- ✅ Cada producto en la lista escaneada tiene un botón de papelera (🗑️)
- ✅ El botón es visible y accesible
- ✅ El botón tiene feedback visual al pasar el cursor

### 2. Comportamiento de eliminación
- ✅ Hacer clic en el botón elimina el producto de la lista
- ✅ El producto desaparece inmediatamente (sin confirmación adicional)
- ✅ La eliminación tiene feedback visual claro

### 3. Recalcular total
- ✅ El total de la compra se actualiza automáticamente
- ✅ El total refleja solo los productos restantes
- ✅ El cálculo es correcto en tiempo real

### 4. Confirmación
- ✅ Solo los productos restantes se registran en el inventario
- ✅ Los productos eliminados no afectan el inventario
- ✅ El registro de compra funciona correctamente con la lista filtrada

### 5. Sin persistencia
- ✅ Las exclusiones no se guardan entre sesiones
- ✅ Cada nuevo escaneo comienza con una lista limpia
- ✅ No hay "lista de ignorados" persistente

---

## Scope Boundaries

**In Scope:**
- ✅ Eliminar productos de la sesión de escaneo actual
- ✅ Recalcular el total para los productos restantes

**Out of Scope:**
- ❌ No hay lista persistente de "ignorados" entre sesiones
- ❌ No hay funcionalidad de deshacer/restaurar
- ❌ No hay selección/deselección masiva

---

## Detalles Técnicos

### Componentes Afectados

1. **RegisterPurchaseModal.tsx**
   - Agregar botón de eliminación por elemento
   - Manejar la eliminación de productos
   - Recalcular el total automáticamente

2. **Tests**
   - Pruebas unitarias para el comportamiento de eliminación
   - E2E test para verificar el flujo completo

### Cambios de Arquitectura

**NINGUNO** - Esta es una característica aditiva. El comportamiento existente (aceptar todos los productos) permanece sin cambios.

---

## Definition of Done

### Tests
- ✅ Tests unitarios para RegisterPurchaseModal
- ✅ E2E test para el flujo de exclusión de productos
- ✅ Todos los tests existentes pasan

### Funcionalidad
- ✅ Botón de eliminar visible en cada producto
- ✅ Eliminación funciona correctamente
- ✅ Total se recalcula automáticamente
- ✅ Solo productos restantes se registran

### Calidad de Código
- ✅ Código cumple estándares del proyecto
- ✅ Sin warnings de ESLint/TypeScript
- ✅ Clean Architecture mantenida

### Documentación
- ✅ Cambios documentados en CHANGELOG.md
- ✅ User story actualizada
- ✅ OpenSpec archivado

---

## Tests Implementados

### E2E Tests (1)
- ✅ Test completo del flujo de exclusión de productos

### Total
- **393+ tests** (392 unit + 12 e2e)
- **Cobertura**: Mantenida en niveles altos

---

## Resultados

### Impacto en Usuario
- **Positivo**: Mejor control sobre el inventario, reduce la limpieza manual
- **UX**: UI ligeramente más compleja (botón adicional por elemento)
- **Performance**: Insignificante (solo manipulación de listas)

### Métricas
- **Tiempo de implementación**: ~1-2 horas
- **Tests agregados**: 1 E2E
- **Breaking changes**: Ninguno

---

## Links Relacionados

- [US-009: Escanear ticket y registrar compra](./US-009-escanear-ticket-registrar-compra.md)
- [OpenSpec Archived](../../../openspec/changes/archive/2025-12-05-add-exclude-scanned-products/)
- [CHANGELOG](../../CHANGELOG.md)
