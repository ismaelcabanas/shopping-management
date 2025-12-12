# QW-005: Dashboard con Vista de Acción

**Épica**: Quick Wins
**Estado**: 🔴 Pendiente
**Story Points**: 2 SP (~2h)
**Prioridad**: ⭐⭐⭐⭐
**Feedback Source**: Testing manual post-Sprint 8 (2025-12-12)

---

## Historia de Usuario

**Como** usuario del sistema
**Quiero** ver información accionable al entrar al dashboard
**Para** saber rápidamente qué necesito hacer sin navegar por toda la app

---

## Contexto

Actualmente el dashboard (página de inicio de "Gestión de Inventario") está vacío sin propósito claro. Durante testing manual se identificó que sería más útil como punto de entrada con información accionable.

---

## Criterios de Aceptación

### 1. Resumen de Lista de Compra
- [ ] Mostrar total de productos que necesitan compra
- [ ] Destacar productos urgentes (stock vacío)
- [ ] Botones de acción: "Ver Lista" y "Registrar Compra"

### 2. Alertas de Stock
- [ ] Mostrar top 3-5 productos con stock bajo o vacío
- [ ] Cada alerta muestra: nombre del producto + nivel de stock
- [ ] Badge visual según urgencia (bajo=amarillo, vacío=rojo)

### 3. Métricas de Inventario
- [ ] Total de productos en catálogo
- [ ] Número de productos con stock bajo/vacío
- [ ] Fecha de última compra registrada (opcional)

---

## Mockup Visual

```
┌─────────────────────────────────────┐
│ 🏠 Mi Despensa - Dashboard          │
├─────────────────────────────────────┤
│ 📋 Lista de Compra                  │
│ • 8 productos necesitan compra      │
│ • 3 urgentes (sin stock)            │
│ [Ver Lista] [Registrar Compra]      │
├─────────────────────────────────────┤
│ ⚠️ Alertas de Stock                 │
│ • Leche - Sin stock 🔴              │
│ • Huevos - Stock bajo 🟡            │
│ • Pan - Stock bajo 🟡               │
├─────────────────────────────────────┤
│ 📊 Estado del Inventario            │
│ • 45 productos en catálogo          │
│ • 12 con stock bajo/vacío           │
│ • Última compra: hace 3 días        │
└─────────────────────────────────────┘
```

---

## Impacto

Alta relación impacto/esfuerzo:
- Mejora significativa en UX (punto de entrada útil)
- Implementación rápida (solo UI, no lógica de negocio compleja)
- Aumenta adopción de features (lista de compra, registro)
- No requiere cambios en domain/application layers

---

## Detalles Técnicos

**Componentes Nuevos:**
- `DashboardSummary.tsx` - Componente principal del dashboard
- `ShoppingListSummaryCard.tsx` - Card de resumen de lista
- `StockAlertsCard.tsx` - Card de alertas
- `InventoryStatsCard.tsx` - Card de métricas

**Hooks:**
- `useDashboardStats()` - Hook para agregar datos de múltiples fuentes
  - useShoppingList() → contador de items
  - useInventory() → productos con stock bajo
  - Cálculos de métricas agregadas

**No requiere:**
- Cambios en domain models
- Nuevos use cases
- Cambios en repositorios

---

## Definition of Done

- [ ] Tests unitarios de `DashboardSummary` component
- [ ] Tests del hook `useDashboardStats`
- [ ] Dashboard funcional en desktop y mobile (responsive)
- [ ] Navegación desde dashboard a lista/registro funciona
- [ ] Datos se actualizan al volver al dashboard
- [ ] Screenshots en documentación de usuario
