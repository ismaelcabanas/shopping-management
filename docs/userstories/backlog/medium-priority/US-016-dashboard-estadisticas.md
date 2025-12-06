# US-016: Dashboard con estadísticas

**Épica**: Épica 5 - Inteligencia de Consumo
**Estado**: 🔴 Pendiente
**Story Points**: 5 SP (~3-4h)
**Prioridad**: 🟡 Media (⭐⭐⭐⭐)

---

## Historia de Usuario

**Como** usuario
**Quiero** ver estadísticas de mi inventario
**Para** entender mis patrones de consumo

---

## Criterios de Aceptación

### 1. Métricas básicas
- [ ] Total de productos en catálogo
- [ ] Valor total del inventario
- [ ] Productos con stock bajo

### 2. Top consumidos
- [ ] Top 5 productos más consumidos
- [ ] Top 5 productos más comprados
- [ ] Tendencias del mes

### 3. Visualizaciones
- [ ] Gráficas de consumo por categoría
- [ ] Evolución del inventario en el tiempo
- [ ] Distribución de stock

---

## Detalles Técnicos

**Stack**: Recharts o Chart.js para visualizaciones
- Nueva página `DashboardPage`
- Use case `GetInventoryStatistics`
- Agregación de datos de consumo y compras

---

## Definition of Done

- [ ] Tests completos
- [ ] Dashboard funcional con gráficas
- [ ] Performance optimizada (cálculos eficientes)
