# Historias de Usuario - Shopping Manager

Este directorio contiene las historias de usuario del proyecto Shopping Manager, organizadas como documentos individuales siguiendo las mejores prácticas de Product Management y Agile.

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

## Historias Completadas ✅

### Épica 1: Gestión de Inventario Personal

| ID | Título | Estado | Sprint | Tests |
|----|--------|--------|--------|-------|
| [US-001](./US-001-ver-pagina-bienvenida.md) | Ver página de bienvenida | 🟢 Completado | Sprint 1 | 4 |
| [US-002](./US-002-navegar-entre-secciones.md) | Navegar entre secciones | 🟢 Completado | Sprint 1 | 11 |
| [US-003](./US-003-ver-inventario-productos.md) | Ver inventario de productos | 🟢 Completado | Sprint 2 | 20 |
| [US-004](./US-004-anadir-producto-inventario.md) | Añadir producto al inventario | 🟢 Completado | Sprint 2 | 14 |
| [US-005](./US-005-ver-catalogo-productos.md) | Ver catálogo de productos | 🟢 Completado | Sprint 3 | 21 |

### Épica 2: Gestión Avanzada de Inventario

| ID | Título | Estado | Sprint | Tests |
|----|--------|--------|--------|-------|
| [US-006](./US-006-editar-producto.md) | Editar información de un producto | 🟢 Completado | Sprint 4 | 28 |
| [US-007](./US-007-eliminar-producto.md) | Eliminar un producto del sistema | 🟢 Completado | Sprint 4 | 13 |
| [US-008](./US-008-registrar-compra-actualizar-inventario.md) | Registrar compra y actualizar inventario | 🟢 Completado | Sprint 4 | 25+ |

**Total de tests automatizados**: 278+ tests

---

## Épicas y Roadmap

### 📦 Épica 1: Gestión de Inventario Personal ✅ COMPLETADA
- ✅ **US-001**: Ver página de bienvenida
- ✅ **US-002**: Navegar entre secciones
- ✅ **US-003**: Ver inventario de productos
- ✅ **US-004**: Añadir producto al inventario
- ✅ **US-005**: Ver catálogo de productos

### 🔧 Épica 2: Gestión Avanzada de Inventario ✅ COMPLETADA
- ✅ **[US-006](./US-006-editar-producto.md)**: Editar información de un producto (3 SP, ~2-3h)
- ✅ **[US-007](./US-007-eliminar-producto.md)**: Eliminar un producto del sistema (2 SP, ~1-2h)
- ✅ **[US-008](./US-008-registrar-compra-actualizar-inventario.md)**: Registrar compra y actualizar inventario (5 SP, ~3-4h)

**🎯 CRUD Completo**: ✅ Create, Read, Update, Delete
**🛒 Gestión de Compras**: ✅ Registro de compras con actualización automática de inventario

### 📸 Épica 3: Automatización de Compras (Sprint 5 - CRÍTICA) 🔥
- 🔴 **[US-009](./US-009-escanear-ticket-registrar-compra.md)**: Escanear ticket y registrar compra (OCR) (5 SP, ~3-4h) 🔥
- 🔴 **US-010**: Mejorar matching de productos (OCR v2) (5 SP, ~3-4h)

**🎯 Objetivo**: Reducir friction del registro de compras de 10 min → <3 min
**⚠️ Validación Crítica**: Esta épica determina el éxito del producto

### 🔄 Épica 4: Gestión de Consumo (Alta Prioridad)
- 🔴 **US-011**: Registrar consumo de productos (3 SP, ~2-3h)
- 🔴 **US-012**: Ver historial de consumo (2 SP, ~1-2h)
- 🔴 **US-013**: Alertas de stock bajo (3 SP, ~2-3h)
- 🔴 **US-014**: Añadir automáticamente a lista de compras (5 SP, ~3-4h)

**🎯 CRUD Completo del Ciclo**: Comprar → Almacenar → **Consumir** → Alertar

### 📊 Épica 5: Inteligencia de Consumo (Media Prioridad)
- 🔴 **US-015**: Calcular tasa de consumo promedio (3 SP)
- 🔴 **US-016**: Predecir cuándo se agotará un producto (5 SP)
- 🔴 **US-017**: Sugerir cantidad óptima de compra (5 SP)

### 🏪 Épica 6: Gestión de Tiendas (Baja Prioridad)
- 🔴 **US-018**: Crear una tienda (3 SP)
- 🔴 **US-019**: Registrar precio de producto en tienda (3 SP)
- 🔴 **US-020**: Comparar precios entre tiendas (5 SP)

### 📝 Épica 7: Lista de Compras Inteligente (Futuro)
- 🔴 **US-021**: Generar lista de compras automática (5 SP)
- 🔴 **US-022**: Optimizar lista por tienda más económica (8 SP)

---

## Estadísticas del Proyecto

### Por Estado
- **Completadas**: 8 historias (36%)
- **En Progreso**: 0 historias (0%)
- **Pendientes**: 14 historias (64%)
- **Total**: 22 historias planificadas

### Por Épica
- **Épica 1** (Gestión Inventario): 5/5 completadas ✅
- **Épica 2** (Gestión Avanzada): 3/3 completadas ✅
- **Épica 3** (Automatización Compras): 0/2 completadas 🔥
- **Épica 4** (Gestión Consumo): 0/4 completadas
- **Épica 5** (Inteligencia Consumo): 0/3 completadas
- **Épica 6** (Tiendas): 0/3 completadas
- **Épica 7** (Lista Inteligente): 0/2 completadas

### Por Prioridad
- 🔥 **Crítica**: 1 historia (US-009 - OCR)
- 🔴 **Alta**: 7 historias (Épica 3-4)
- 🟡 **Media**: 3 historias (Épica 5)
- 🟢 **Baja**: 3 historias (Épica 6-7)

### Cobertura de Tests
- **Total tests**: 278+ tests
- **Metodología**: Test-Driven Development (TDD)
- **Cobertura**: ~85%

---

## Arquitectura de las Historias Implementadas

Todas las historias completadas siguen **Clean Architecture + DDD**:

```
┌─────────────────────────────────────┐
│   Presentation Layer                │
│   - Pages                           │
│   - Custom Hooks (useProducts,     │
│     useInventory)                   │
│   - Components (EditProductModal)   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Application Layer                 │
│   - Use Cases                       │
│     • GetAllProducts                │
│     • GetProductsWithInventory      │
│     • AddProductToInventory         │
│     • UpdateProduct                 │
│     • DeleteProduct                 │
│     • RegisterPurchase ✨ NEW       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Domain Layer                      │
│   - Entities (Product,              │
│     InventoryItem, Purchase)        │
│   - Value Objects (ProductId,       │
│     Quantity, UnitType,             │
│     PurchaseId, PurchaseItem)       │
│   - Repository Interfaces           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Infrastructure Layer              │
│   - LocalStorageProductRepository   │
│   - LocalStorageInventoryRepository │
└─────────────────────────────────────┘
```

---

## Patrones Establecidos

### Custom Hooks Pattern
- ✅ `useProducts()` - Gestión de productos
- ✅ `useInventory()` - Gestión de inventario

**Características**:
- Estados consistentes: `{ data, isLoading, error, refetch }`
- Prevención de memory leaks
- Encapsulación de use cases
- Tests exhaustivos

### Component Organization
- **Features**: Organización vertical por funcionalidad
- **Shared**: Componentes reutilizables
- **Pages**: Orquestadores de features

---

## Cómo Crear una Nueva Historia

### 1. Crear el archivo
```bash
touch docs/userstories/US-XXX-titulo-kebab-case.md
```

### 2. Usar la plantilla
```markdown
# US-XXX: Título de la Historia

**Épica**: [Nombre de la Épica]
**Estado**: 🔴 Pendiente
**Prioridad**: [Alta/Media/Baja]
**Sprint**: Sprint X

---

## Historia de Usuario

**Como** [rol]
**Quiero** [acción]
**Para** [beneficio]

---

## Criterios de Aceptación

- [ ] Criterio 1
- [ ] Criterio 2
- [ ] Criterio 3

---

## Detalles Técnicos

[Detalles de implementación...]

---

## Definition of Done

- [ ] Código implementado
- [ ] Tests escritos y pasando
- [ ] Code review completado
- [ ] Documentación actualizada
- [ ] Desplegado y verificado
```

### 3. Actualizar este README
Añadir la nueva historia a la tabla correspondiente.

---

## Métricas de Velocity

### Sprint 1
- Historias completadas: 2
- Story points: 5

### Sprint 2
- Historias completadas: 2
- Story points: 13

### Sprint 3
- Historias completadas: 1
- Story points: 8

### Sprint 4
- Historias completadas: 3
- Story points: 10 (US-006: 3 SP, US-007: 2 SP, US-008: 5 SP)

### Sprint 5 (Planificado - CRÍTICO) 🔥
- **US-009**: Escanear ticket (OCR) - 5 SP 🔥
- **US-011**: Registrar consumo - 3 SP
- **US-012**: Ver historial consumo - 2 SP
- **Total planificado**: 10 SP

**Objetivo Sprint 5**: Validar OCR como factor crítico de éxito + cerrar ciclo de consumo

**Velocity promedio**: ~9 story points/sprint

---

## Priorización

Las historias se priorizan usando:

1. **Valor de negocio**: Impacto en objetivos principales
2. **Dependencias**: Requisitos técnicos
3. **Riesgo**: Complejidad e incertidumbre
4. **Feedback**: Necesidades de usuarios

### Matriz de Priorización

```
Alta Prioridad + Alto Valor → Hacer Ahora
Alta Prioridad + Bajo Valor → Planificar
Baja Prioridad + Alto Valor → Considerar
Baja Prioridad + Bajo Valor → Backlog
```

---

## Referencias

- [ARCHITECTURE_ANALYSIS.md](../ARCHITECTURE_ANALYSIS.md) - Análisis arquitectónico completo
- [TESTING_STRATEGY.md](../TESTING_STRATEGY.md) - Estrategia de testing
- [FRONTEND_ARCHITECTURE.md](../FRONTEND_ARCHITECTURE.md) - Arquitectura frontend
- [ADRs](../adr/) - Decisiones arquitectónicas

---

## Contacto y Contribución

Para sugerir nuevas historias, reportar issues, o discutir cambios:
- Crear issue en GitHub
- Discutir en planning meetings
- Proponer en retrospectivas