# US-017: Predicción de agotamiento

**Épica**: Épica 5 - Inteligencia de Consumo
**Estado**: 🔴 Pendiente
**Story Points**: 5 SP (~3-4h)
**Prioridad**: 🟡 Media (⭐⭐⭐)

---

## Historia de Usuario

**Como** usuario
**Quiero** saber cuándo se agotará un producto
**Para** planificar mi próxima compra

---

## Criterios de Aceptación

- [ ] Calcular tasa de consumo promedio por producto
- [ ] Predecir fecha de agotamiento
- [ ] Mostrar alerta proactiva "se agotará en X días"
- [ ] Actualizar predicción con cada consumo

---

## Detalles Técnicos

**Tech**: Regresión lineal simple sobre historial
- Use case `PredictStockDepletion`
- Algoritmo de predicción basado en historial
- Mostrar en la vista de producto

---

## Definition of Done

- [ ] Tests con datos simulados
- [ ] Predicción visible y precisa
- [ ] Algoritmo validado

---

## Referencias

- Depende de: US-012, US-013 (necesita historial de consumo)
