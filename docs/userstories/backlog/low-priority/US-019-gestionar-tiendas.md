# US-019: Crear y gestionar tiendas

**Épica**: Épica 6 - Gestión de Tiendas
**Estado**: 🔴 Pendiente
**Story Points**: 3 SP (~2-3h)
**Prioridad**: 🟢 Baja

---

## Historia de Usuario

**Como** usuario
**Quiero** crear y gestionar tiendas
**Para** organizar mis compras por establecimiento

---

## Criterios de Aceptación

- [ ] Crear tiendas (nombre, ubicación opcional)
- [ ] Listar tiendas disponibles
- [ ] Editar y eliminar tiendas
- [ ] Asignar tienda al registrar compra
- [ ] Ver historial de compras por tienda

---

## Detalles Técnicos

- Entidad `Store`
- `StoreRepository`
- Actualizar `Purchase` para incluir `store_id`
- Nueva página o sección para gestión

---

## Definition of Done

- [ ] Tests completos
- [ ] CRUD de tiendas funcional
- [ ] Integración con registro de compras

---

## Referencias

- Parte de la visión original (optimización de precios)
- Baja prioridad: requiere datos de múltiples compras
