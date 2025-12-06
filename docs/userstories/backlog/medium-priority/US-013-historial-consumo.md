# US-013: Ver historial de consumo

**Épica**: Épica 4 - Gestión de Consumo
**Estado**: 🔴 Pendiente
**Story Points**: 2 SP (~1-2h)
**Prioridad**: 🟡 Media

---

## Historia de Usuario

**Como** usuario
**Quiero** ver cuándo y cuánto he consumido de cada producto
**Para** entender mis patrones de uso

---

## Criterios de Aceptación

- [ ] Vista de historial de consumo por producto
- [ ] Mostrar fecha, cantidad y producto consumido
- [ ] Ordenar por fecha (más reciente primero)
- [ ] Filtrar por producto o rango de fechas

---

## Detalles Técnicos

- Entidad `ConsumptionRecord` con persistencia
- `ConsumptionRepository` para almacenar historial
- Nueva página o sección en el producto

---

## Definition of Done

- [ ] Tests completos
- [ ] Historial visible y funcional
- [ ] Persistencia en LocalStorage

---

## Referencias

- Depende de: US-012 (consumo debe registrarse primero)
