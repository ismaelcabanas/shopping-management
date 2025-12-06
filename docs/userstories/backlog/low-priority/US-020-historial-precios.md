# US-020: Historial de precios por tienda

**Épica**: Épica 6 - Gestión de Tiendas
**Estado**: 🔴 Pendiente
**Story Points**: 5 SP (~3-4h)
**Prioridad**: 🟢 Baja

---

## Historia de Usuario

**Como** usuario
**Quiero** ver el historial de precios de productos por tienda
**Para** detectar tendencias y mejores momentos de compra

---

## Criterios de Aceptación

- [ ] Registrar precio por producto al comprar
- [ ] Ver gráfica de evolución de precios
- [ ] Comparar precios históricos entre tiendas
- [ ] Detectar subidas/bajadas significativas

---

## Detalles Técnicos

- Entidad `PriceHistory`
- Actualizar `Purchase` para registrar precios unitarios
- Gráficas temporales (Recharts)

---

## Definition of Done

- [ ] Tests completos
- [ ] Historial visible y útil
- [ ] Gráficas funcionales

---

## Referencias

- Depende de: US-019
- Requiere datos históricos (varias semanas de uso)
