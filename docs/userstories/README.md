# Historias de Usuario - Shopping Manager

Este directorio contiene las historias de usuario del proyecto Shopping Manager, organizadas como documentos individuales siguiendo las mejores prácticas de Product Management y Agile.

---

## 📚 Quick Navigation

- **[📊 ROADMAP](../ROADMAP.md)** - Project roadmap and high-level overview (< 1 min read)
- **[📝 CHANGELOG](../CHANGELOG.md)** - Release history and shipped features
- **[✅ Completed Stories](./completed/)** - What's been built (13 stories)
- **[📋 Backlog](./backlog/)** - What's next (17 stories)

---

## Formato de Historias de Usuario

Cada historia sigue el formato estándar:

```
Como [rol/persona]
Quiero [acción/funcionalidad]
Para [beneficio/objetivo]
```

Cada archivo incluye:
- **Épica**: Agrupación de alto nivel
- **Estado**: 🟢 Completado / 🟡 En Progreso / 🔴 Pendiente
- **Criterios de Aceptación**: Lista verificable
- **Detalles Técnicos**: Arquitectura, componentes, tests
- **Definition of Done**: Checklist de completitud

---

## Historias Completadas ✅ (13/30)

### Épica 1: Gestión de Inventario Personal ✅

| ID | Título | Sprint | Tests |
|----|--------|--------|-------|
| [US-001](./completed/epic-1/US-001-ver-pagina-bienvenida.md) | Ver página de bienvenida | Sprint 1 | 4 |
| [US-002](./completed/epic-1/US-002-navegar-entre-secciones.md) | Navegar entre secciones | Sprint 1 | 11 |
| [US-003](./completed/epic-1/US-003-ver-inventario-productos.md) | Ver inventario de productos | Sprint 2 | 20 |
| [US-004](./completed/epic-1/US-004-anadir-producto-inventario.md) | Añadir producto al inventario | Sprint 2 | 14 |
| [US-005](./completed/epic-1/US-005-ver-catalogo-productos.md) | Ver catálogo de productos | Sprint 3 | 21 |

### Épica 2: Gestión Avanzada de Inventario ✅

| ID | Título | Sprint | Tests |
|----|--------|--------|-------|
| [US-006](./completed/epic-2/US-006-editar-producto.md) | Editar información de un producto | Sprint 4 | 28 |
| [US-007](./completed/epic-2/US-007-eliminar-producto.md) | Eliminar un producto del sistema | Sprint 4 | 13 |
| [US-008](./completed/epic-2/US-008-registrar-compra-actualizar-inventario.md) | Registrar compra y actualizar inventario | Sprint 4 | 25+ |

**🎯 Achievement**: CRUD Complete + Purchase management

### Épica 3: Automatización de Compras ✅

| ID | Título | Sprint | Tests |
|----|--------|--------|-------|
| [US-009](./completed/epic-3/US-009-escanear-ticket-registrar-compra.md) | Escanear ticket y registrar compra (OCR) | Sprint 5 | 40+ |
| [US-010](./completed/epic-3/US-010-mejorar-matching-productos.md) | Mejorar matching de productos con catálogo | Sprint 6 | 6 |
| [US-011](./completed/epic-3/US-011-excluir-productos-escaneados.md) | Excluir productos del escaneo de ticket | Sprint 7 | 1 E2E |

**🎯 Achievement**: OCR with 100% precision + Smart product matching

### Épica 4: Gestión de Consumo 🔄

| ID | Título | Sprint | Tests |
|----|--------|--------|-------|
| [US-012](./completed/epic-4/US-012-registrar-consumo.md) | Registrar consumo de productos (by levels) | Sprint 8 | 484 unit + 8 E2E |
| [US-022](./completed/epic-4/US-022-lista-compra-checkbox.md) | Marcar productos en lista de compra | Sprint 9 | 497 unit + 21 E2E |

**🎯 Achievement**: Complete product lifecycle + Natural shopping UX

---

## Backlog 📋 (17 stories)

### 🔥 High Priority (6 stories)

**Post-Sprint 9 Priorities**:
- [US-024: Modo Compra con Página Dedicada](./backlog/high-priority/US-024-shopping-mode.md) ⭐⭐⭐⭐⭐ (5 SP)
- [QW-005: Dashboard con vista de acción](./backlog/high-priority/QW-005-dashboard-accionable.md) ⭐⭐⭐⭐ (2 SP)

**Épica 4: Gestión de Consumo** (Deferred):
- [US-014: Alertas de stock bajo](./backlog/high-priority/US-014-alertas-stock-bajo.md) ⭐⭐⭐⭐
- [US-015: Lista de compras automática](./backlog/high-priority/US-015-lista-compras-automatica.md) ⭐⭐⭐⭐⭐

**Quick Wins**
- [QW-001: Búsqueda y filtros en catálogo](./backlog/high-priority/QW-001-busqueda-filtros.md) ⭐⭐⭐⭐
- [QW-004: PWA (Progressive Web App)](./backlog/high-priority/QW-004-pwa.md) ⭐⭐⭐⭐

### 🟡 Medium Priority (5 stories)

**Épica 4: Gestión de Consumo**
- [US-013: Ver historial de consumo](./backlog/medium-priority/US-013-historial-consumo.md)

**Épica 5: Inteligencia de Consumo**
- [US-016: Dashboard con estadísticas](./backlog/medium-priority/US-016-dashboard-estadisticas.md) ⭐⭐⭐⭐
- [US-017: Predicción de agotamiento](./backlog/medium-priority/US-017-prediccion-agotamiento.md) ⭐⭐⭐
- [US-018: Sugerir cantidad óptima de compra](./backlog/medium-priority/US-018-cantidad-optima-compra.md)

**Quick Wins**
- [QW-002: Exportar/Importar datos](./backlog/medium-priority/QW-002-exportar-importar.md) ⭐⭐⭐

### 🟢 Low Priority (4 stories)

**Épica 6: Gestión de Tiendas**
- [US-019: Crear y gestionar tiendas](./backlog/low-priority/US-019-gestionar-tiendas.md)
- [US-020: Historial de precios por tienda](./backlog/low-priority/US-020-historial-precios.md)
- [US-021: Comparación de precios entre tiendas](./backlog/low-priority/US-021-comparacion-precios.md)

**Quick Wins**
- [QW-003: Modo oscuro](./backlog/low-priority/QW-003-modo-oscuro.md) ⭐⭐

---

## Estadísticas del Proyecto

### Progress
- **Completadas**: 13/30 (43%)
- **Alta prioridad**: 6 stories
- **Media prioridad**: 5 stories
- **Baja prioridad**: 4 stories

### Testing
- **Total tests**: 518+ (497 unit + 21 E2E)
- **Methodology**: Test-Driven Development (TDD)
- **Coverage**: ~90%

### By Epic
- ✅ **Épica 1** (Gestión Inventario): 5/5
- ✅ **Épica 2** (Gestión Avanzada): 3/3
- ✅ **Épica 3** (Automatización Compras): 3/3
- 🚧 **Épica 4** (Gestión Consumo): 2/4
- ⏳ **Épica 5** (Inteligencia Consumo): 0/6
- ⏳ **Épica 6** (Gestión Tiendas): 0/3
- ⏳ **Quick Wins**: 0/4

---

## Arquitectura

Todas las historias completadas siguen **Clean Architecture + DDD**:

```
┌─────────────────────────────────────┐
│   Presentation Layer                │
│   - Pages, Hooks, Components        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Application Layer                 │
│   - Use Cases                       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Domain Layer                      │
│   - Entities, Value Objects         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Infrastructure Layer              │
│   - Repositories (LocalStorage)     │
└─────────────────────────────────────┘
```

---

## Patrones Establecidos

### Custom Hooks Pattern
- ✅ `useProducts()` - Product management
- ✅ `useInventory()` - Inventory management

**Features**:
- Consistent state: `{ data, isLoading, error, refetch }`
- Memory leak prevention
- Use case encapsulation
- Comprehensive tests

### Component Organization
- **Features**: Vertical organization by functionality
- **Shared**: Reusable components
- **Pages**: Feature orchestrators

---

## Cómo Crear una Nueva Historia

### 1. Create the file in appropriate location
```bash
# High priority
touch docs/userstories/backlog/high-priority/US-XXX-titulo.md

# Medium priority
touch docs/userstories/backlog/medium-priority/US-XXX-titulo.md

# Low priority
touch docs/userstories/backlog/low-priority/US-XXX-titulo.md

# Completed (after implementation)
touch docs/userstories/completed/epic-X/US-XXX-titulo.md
```

### 2. Use the template
```markdown
# US-XXX: Título de la Historia

**Épica**: [Nombre de la Épica]
**Estado**: 🔴 Pendiente
**Story Points**: X SP
**Prioridad**: ⭐⭐⭐⭐⭐

---

## Historia de Usuario

**Como** [rol]
**Quiero** [acción]
**Para** [beneficio]

---

## Criterios de Aceptación

- [ ] Criterio 1
- [ ] Criterio 2

---

## Detalles Técnicos

[Details...]

---

## Definition of Done

- [ ] Tests completos
- [ ] Código implementado
- [ ] Documentación actualizada
```

### 3. Update this README
Add the new story to the appropriate section.

---

## Métricas de Velocity

| Sprint | Stories | Story Points | Highlights |
|--------|---------|--------------|------------|
| Sprint 1 | 2 | 5 | Initial setup |
| Sprint 2 | 2 | 13 | Inventory CRUD |
| Sprint 3 | 1 | 8 | Product catalog |
| Sprint 4 | 3 | 10 | Advanced management |
| Sprint 5 | 1 | 5 | OCR implementation |
| Sprint 6 | 1 | 3 | Product matching |
| Sprint 7 | 1 | 2 | Product exclusion |

**Velocity average**: ~6 SP/sprint

---

## Referencias

- [📊 ROADMAP](../ROADMAP.md) - High-level project overview
- [📝 CHANGELOG](../CHANGELOG.md) - Release history
- [🏗️ ARCHITECTURE_ANALYSIS.md](../ARCHITECTURE_ANALYSIS.md) - Full architecture analysis
- [🧪 TESTING_STRATEGY.md](../TESTING_STRATEGY.md) - Testing strategy
- [⚛️ FRONTEND_ARCHITECTURE.md](../FRONTEND_ARCHITECTURE.md) - Frontend architecture
- [📐 ADRs](../adr/) - Architecture Decision Records

---

**Last updated**: Sprint 9 (2025-12-15)
**Next milestone**: Continue UX Improvements (US-023, QW-005)
**Tests**: 518+ (497 unit + 21 E2E)
