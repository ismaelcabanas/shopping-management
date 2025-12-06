# QW-001: Búsqueda y filtros en catálogo

**Épica**: Quick Wins
**Estado**: 🔴 Pendiente
**Story Points**: 2 SP (~1-2h)
**Prioridad**: ⭐⭐⭐⭐

---

## Historia de Usuario

**Como** usuario con muchos productos en el catálogo
**Quiero** buscar y filtrar productos fácilmente
**Para** encontrar rápidamente lo que necesito

---

## Criterios de Aceptación

### 1. Buscador por nombre
- [ ] Campo de búsqueda en catálogo
- [ ] Búsqueda en tiempo real
- [ ] Búsqueda case-insensitive

### 2. Filtro por categoría
- [ ] Dropdown/selector de categorías
- [ ] Mostrar solo productos de la categoría seleccionada
- [ ] Opción "Todas las categorías"

### 3. Ordenamiento
- [ ] Ordenar por nombre (A-Z, Z-A)
- [ ] Ordenar por stock (mayor a menor, menor a mayor)
- [ ] Ordenar por fecha de creación

---

## Impacto

Alta relación impacto/esfuerzo:
- Mejora significativa en UX
- Implementación rápida
- No requiere cambios arquitectónicos

---

## Detalles Técnicos

- Actualizar `ProductCatalogPage` con controles de búsqueda/filtros
- Lógica de filtrado en el frontend
- Estado local para mantener filtros activos

---

## Definition of Done

- [ ] Tests para búsqueda y filtros
- [ ] UI responsiva y accesible
- [ ] Feedback visual claro
