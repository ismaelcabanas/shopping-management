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

### Épica 3: Automatización de Compras

| ID | Título | Estado | Sprint | Tests |
|----|--------|--------|--------|-------|
| [US-009](./US-009-escanear-ticket-registrar-compra.md) | Escanear ticket y registrar compra (OCR) | 🟢 Completado | Sprint 5 | 40+ |
| [US-010](./US-010-mejorar-matching-productos.md) | Mejorar matching de productos con catálogo | 🟢 Completado | Sprint 6 | 6 |

**Total de tests automatizados**: 387+ tests (376 unit + 11 e2e)

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

### 📸 Épica 3: Automatización de Compras ✅ COMPLETADA
- ✅ **[US-009](./US-009-escanear-ticket-registrar-compra.md)**: Escanear ticket y registrar compra (OCR) (5 SP, ~6h) 🎉
- ✅ **[US-010](./US-010-mejorar-matching-productos.md)**: Mejorar matching de productos con catálogo (3 SP, ~2h) 🎉
  - **Como** usuario con catálogo estático de productos
  - **Quiero** que los productos del ticket se normalicen automáticamente con mi catálogo
  - **Para** evitar duplicados y mantener mi inventario limpio
  - **Solución Implementada**:
    - ✅ Normalización avanzada: acentos, singulares/plurales, marcas, descripciones
    - ✅ Algoritmo híbrido: token matching (60%) + Levenshtein (40%)
    - ✅ Threshold reducido: 80% → 60% para alta confianza
    - ✅ Casos de prueba con ejemplos reales validados
  - **Resultados**:
    - "PLATANO GABECERAS CANARIO" matchea con "Plátanos" ✅
    - "TOMATE ROJO RAMA" matchea con "Tomates" ✅
    - "KIWI ZESPRI" matchea con "Kiwis" ✅
    - "HUEVOS SUELTAS GALLINERO AL" matchea con "Huevos" ✅

**✅ Logro Sprint 5**: OCR implementado con 100% precisión usando Gemini Vision API
**✅ Logro Sprint 6**: Matching mejorado - elimina duplicados con normalización avanzada
**🎯 Impacto Total**: Reducción de friction del registro de compras de 10 min → 2-4 segundos + inventario limpio
**📊 Resultados**: 387 tests (376 unit + 11 e2e), 100% matching real-world tickets

### 🔄 Épica 4: Gestión de Consumo (🔥 ALTA PRIORIDAD - Sprint 6)
- 🔴 **US-011**: Registrar consumo de productos (3 SP, ~2-3h) ⭐⭐⭐⭐⭐
  - **Como** usuario que usó un producto
  - **Quiero** registrar su consumo desde el catálogo
  - **Para** que el inventario refleje lo que realmente tengo
  - **Impacto**: Sin consumo, el inventario es estático y pierde utilidad

- 🔴 **US-012**: Ver historial de consumo (2 SP, ~1-2h)
  - **Como** usuario
  - **Quiero** ver cuándo y cuánto he consumido de cada producto
  - **Para** entender mis patrones de uso

- 🔴 **US-013**: Alertas de stock bajo (3 SP, ~2-3h) ⭐⭐⭐⭐
  - **Como** usuario
  - **Quiero** ver alertas visuales cuando un producto está bajo de stock
  - **Para** saber qué necesito comprar sin revisarlo todo
  - **Features**: Badge rojo, filtro "stock bajo", contador

- 🔴 **US-014**: Lista de compras automática (5 SP, ~3-4h) ⭐⭐⭐⭐⭐
  - **Como** usuario
  - **Quiero** generar automáticamente una lista de compras
  - **Para** no tener que recordar qué productos me faltan
  - **Features**: Añade productos con stock < minimum_stock, cantidad sugerida, integración con RegisterPurchase
  - **Impacto**: 🚀 ALTO - Cierra el ciclo completo del producto

**🎯 Objetivo Épica 4**: Completar el ciclo → Comprar → Almacenar → **Consumir** → Alertar → Lista Automática
**⚠️ CRÍTICO**: Sin consumo, el sistema no genera valor sostenible

### 📊 Épica 5: Inteligencia de Consumo (Media Prioridad - Sprint 7+)
- 🔴 **US-015**: Dashboard con estadísticas (5 SP, ~3-4h) ⭐⭐⭐⭐
  - **Como** usuario
  - **Quiero** ver estadísticas de mi inventario
  - **Para** entender mis patrones de consumo
  - **Features**: Total productos, valor inventario, top 5 consumidos, tendencias, gráficas
  - **Stack**: Recharts o Chart.js para visualizaciones

- 🔴 **US-016**: Predicción de agotamiento (5 SP, ~3-4h) ⭐⭐⭐
  - **Como** usuario
  - **Quiero** saber cuándo se agotará un producto
  - **Para** planificar mi próxima compra
  - **Features**: Tasa de consumo promedio, predicción de fecha, alertas proactivas
  - **Tech**: Regresión lineal simple sobre historial

- 🔴 **US-017**: Sugerir cantidad óptima de compra (5 SP, ~3-4h)
  - **Como** usuario
  - **Quiero** que el sistema sugiera cuánto comprar
  - **Para** no quedarme sin stock ni sobre-comprar

**🎯 Objetivo Épica 5**: Agregar inteligencia predictiva basada en datos de consumo

### 🏪 Épica 6: Gestión de Tiendas (Baja Prioridad - Sprint 8+)
- 🔴 **US-018**: Crear y gestionar tiendas (3 SP, ~2-3h)
  - Crear tiendas (Mercadona, Carrefour, Lidl)
  - Asignar tienda al registrar compra
  - Ver historial de compras por tienda

- 🔴 **US-019**: Historial de precios por tienda (5 SP, ~3-4h)
  - Registrar precio por producto al comprar
  - Ver gráfica de evolución de precios
  - Comparar precios entre tiendas

- 🔴 **US-020**: Comparación de precios entre tiendas (5 SP, ~3-4h)
  - Calcular costo de lista de compras por tienda
  - Sugerir tienda más económica

**🎯 Objetivo Épica 6**: Optimización de precios (visión original del proyecto)
**⚠️ Nota**: Requiere datos de múltiples compras, menor prioridad que cerrar ciclo básico

### 💡 Quick Wins (Mejoras Rápidas - Alta Relación Impacto/Esfuerzo)
- 🔴 **QW-001**: Búsqueda y filtros en catálogo (2 SP, ~1-2h) ⭐⭐⭐⭐
  - Buscador por nombre, filtro por categoría, ordenar por stock/nombre/fecha

- 🔴 **QW-002**: Exportar/Importar datos (3 SP, ~2-3h) ⭐⭐⭐
  - Exportar inventario a CSV/JSON, importar productos, backup automático

- 🔴 **QW-003**: Modo oscuro (1 SP, ~30 min) ⭐⭐
  - Toggle en HomePage, persistencia, mejora accesibilidad

- 🔴 **QW-004**: PWA (Progressive Web App) (3 SP, ~2-3h) ⭐⭐⭐⭐
  - Instalar app en móvil, funciona offline, notificaciones push

**🎯 Objetivo Quick Wins**: Mejoras rápidas de UX sin cambios arquitectónicos grandes

---

## Estadísticas del Proyecto

### Por Estado
- **Completadas**: 10 historias (38%) ⬆️ +2 desde Sprint 4
- **En Progreso**: 0 historias (0%)
- **Pendientes**: 16 historias (62%)
- **Total**: 26 historias planificadas (incluyendo Quick Wins)

### Por Épica
- **Épica 1** (Gestión Inventario): 5/5 completadas ✅
- **Épica 2** (Gestión Avanzada): 3/3 completadas ✅
- **Épica 3** (Automatización Compras): 2/2 completadas ✅ COMPLETADA
- **Épica 4** (Gestión Consumo): 0/4 completadas 🔥 ALTA PRIORIDAD
- **Épica 5** (Inteligencia Consumo): 0/3 completadas
- **Épica 6** (Tiendas): 0/3 completadas
- **Quick Wins**: 0/4 completadas

### Por Prioridad
- 🔥 **Alta**: 5 historias (US-011, US-013, US-014, US-015, QW-001, QW-004)
- 🟡 **Media**: 5 historias (US-012, US-016, US-017, QW-002)
- 🟢 **Baja**: 6 historias (US-018, US-019, US-020, QW-003)

### Cobertura de Tests
- **Total tests**: 387+ tests ⬆️ +109 desde Sprint 4
- **Unit tests**: 376 tests
- **E2E tests**: 11 tests
- **Metodología**: Test-Driven Development (TDD)
- **Cobertura**: ~90% (mejorada con OCR tests)

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

### Sprint 5 ✅ COMPLETADO
- ✅ **US-009**: Escanear ticket (OCR) - 5 SP (real: 6h)
- **Story points completados**: 5 SP

**✅ Logro**: OCR con 100% precisión usando Gemini Vision API
**📊 Resultados**: 387+ tests, 15/15 productos extraídos, 2-4s de respuesta
**🎯 Impacto**: Reducción de friction del registro de compras de 10 min → 2-4 segundos

### Sprint 6 (Propuesto - CRÍTICO) 🔥
**Objetivo**: Arreglar matching y empezar ciclo de consumo

**⚠️ IMPORTANTE**: US-010 debe completarse PRIMERO (matching está roto)

**Opción A - Arreglar Matching + Consumo (8 SP, ~5-8h):**
- 🔴 **US-010**: Mejorar matching productos - 5 SP 🔥 CRÍTICA (PRIMERO)
- 🔴 **US-011**: Registrar consumo - 3 SP ⭐⭐⭐⭐⭐

**Opción B - Solo Arreglar Matching (5 SP, ~3-5h):**
- 🔴 **US-010**: Mejorar matching productos - 5 SP 🔥 CRÍTICA
  - Parte 1: Mejorar algoritmo (3 SP, ~2-3h)
  - Parte 2: UI revisión manual (2 SP, ~1-2h)

**Opción C - Arreglar Matching + Quick Win (7 SP, ~4-7h):**
- 🔴 **US-010**: Mejorar matching productos - 5 SP 🔥 CRÍTICA
- 🔴 **QW-001**: Búsqueda y filtros - 2 SP ⭐⭐⭐⭐

**Recomendación**: Opción A (arregla matching crítico + avanza en consumo)

### Sprint 7+ (Roadmap Futuro)
**Sprint 7 - Inteligencia de Datos:**
- US-015: Dashboard estadísticas (5 SP)
- US-016: Predicción agotamiento (5 SP)

**Sprint 8 - Optimización:**
- US-018: Gestión tiendas (3 SP)
- US-019: Historial precios (5 SP)
- QW-004: PWA (3 SP)

**Velocity promedio**: 9 SP/sprint (basado en Sprints 1-5)

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

## Roadmap Visual

```
✅ Sprint 1-2: Inventario Básico (CRUD de productos)
✅ Sprint 3-4: Gestión Avanzada (Editar, Eliminar, Compras)
✅ Sprint 5: Automatización OCR (Escanear tickets)

📍 ESTAMOS AQUÍ

🔥 Sprint 6 (CRÍTICO): Gestión de Consumo
    ├─ US-011: Registrar consumo ⭐⭐⭐⭐⭐
    ├─ US-013: Alertas stock bajo ⭐⭐⭐⭐
    └─ US-014: Lista automática ⭐⭐⭐⭐⭐

    ⚠️ Sin consumo, el inventario es estático y pierde valor
    ✅ Con consumo, el ciclo está completo: Comprar → Almacenar → Consumir → Alertar

📊 Sprint 7: Inteligencia de Datos
    ├─ US-015: Dashboard estadísticas
    └─ US-016: Predicción agotamiento

🏪 Sprint 8+: Optimización de Precios
    ├─ US-018: Gestión de tiendas
    ├─ US-019: Historial precios
    └─ US-020: Comparación precios

💡 Quick Wins (Paralelizables)
    ├─ QW-001: Búsqueda y filtros ⭐⭐⭐⭐
    ├─ QW-002: Export/Import datos
    ├─ QW-003: Modo oscuro
    └─ QW-004: PWA (móvil) ⭐⭐⭐⭐
```

### Decisión Recomendada para Sprint 6

**Opción A (Recomendada)**: Completar Épica 4 completa
- **Tiempo**: 7-9 horas
- **Story Points**: 11 SP
- **Impacto**: 🚀 MÁXIMO - Cierra ciclo completo del producto
- **Riesgo**: Bajo (similar a features ya implementadas)
- **Resultado**: Producto funcionalmente completo y sostenible

**Alternativa B**: Solo US-011 (Consumo)
- **Tiempo**: 2-3 horas
- **Story Points**: 3 SP
- **Impacto**: 🟡 Medio - Habilita futuras features pero no cierra ciclo
- **Ventaja**: Entrega más rápida, validación incremental

**Alternativa C**: Quick Wins (UX)
- **Tiempo**: 2-3 horas
- **Story Points**: 3 SP
- **Impacto**: 🟢 Bajo - Mejoras cosméticas sin cambiar funcionalidad core
- **Ventaja**: Satisfacción inmediata, bajo riesgo

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

---

**Última actualización**: Sprint 5 completado (2025-11-30)
**Próximo hito**: Sprint 6 - Completar ciclo de consumo
**Tests actuales**: 387+ tests (90% cobertura)
**Historias completadas**: 9/26 (35%)