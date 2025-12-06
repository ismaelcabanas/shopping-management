# US-014: Alertas de stock bajo

**Épica**: Épica 4 - Gestión de Consumo
**Estado**: 🔴 Pendiente
**Story Points**: 3 SP (~2-3h)
**Prioridad**: ⭐⭐⭐⭐

---

## Historia de Usuario

**Como** usuario
**Quiero** ver alertas visuales cuando un producto está bajo de stock
**Para** saber qué necesito comprar sin revisarlo todo

---

## Criterios de Aceptación

### 1. Indicadores visuales de stock bajo
- [ ] Badge rojo en productos con stock < minimum_stock
- [ ] Indicador en lista de inventario
- [ ] Indicador en catálogo de productos

### 2. Filtro de stock bajo
- [ ] Botón/filtro "Stock Bajo" en inventario
- [ ] Mostrar solo productos que necesitan reposición
- [ ] Contador de productos con stock bajo

### 3. Lógica de alerta
- [ ] Alert cuando: `current_stock < minimum_stock`
- [ ] Diferentes niveles: crítico (0), bajo (<min), normal (≥min)
- [ ] Colores distintivos por nivel

---

## Detalles Técnicos

### Componentes
- Actualizar `InventoryPage` con filtro de stock bajo
- Badge component para alertas visuales
- Contador en navigation o header

### Lógica
- Función `isLowStock(item)`: `item.quantity < item.minimum_stock`
- Filtrado en el frontend (no requiere cambios en repositorio)

---

## Definition of Done

- [ ] Tests unitarios y de componente
- [ ] Alertas visibles y claras
- [ ] Filtro funcional
- [ ] E2E test

---

## Referencias

- Depende de: US-012 (consumo debe estar funcionando)
- Habilita: US-015 (lista de compras automática)
