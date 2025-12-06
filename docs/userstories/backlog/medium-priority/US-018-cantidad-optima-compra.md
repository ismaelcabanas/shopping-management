# US-018: Sugerir cantidad óptima de compra

**Épica**: Épica 5 - Inteligencia de Consumo
**Estado**: 🔴 Pendiente
**Story Points**: 5 SP (~3-4h)
**Prioridad**: 🟡 Media

---

## Historia de Usuario

**Como** usuario
**Quiero** que el sistema sugiera cuánto comprar
**Para** no quedarme sin stock ni sobre-comprar

---

## Criterios de Aceptación

- [ ] Calcular cantidad óptima basada en:
  - Tasa de consumo promedio
  - Frecuencia de compra
  - Stock mínimo deseado
- [ ] Sugerencia visible en lista de compras
- [ ] Permitir ajuste manual

---

## Detalles Técnicos

- Use case `CalculateOptimalPurchaseQuantity`
- Algoritmo considerando múltiples factores
- Integración con US-015 (lista de compras)

---

## Definition of Done

- [ ] Tests con escenarios variados
- [ ] Sugerencias precisas y útiles
- [ ] Integración con lista de compras

---

## Referencias

- Depende de: US-012, US-013, US-015
