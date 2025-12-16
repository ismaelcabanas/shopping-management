# Épica 4: Gestión de Consumo

**Estado**: En Progreso (2/4 historias completadas)

## Descripción
Sistema de seguimiento de consumo y gestión automática de lista de compras basado en niveles de stock.

## Historias Completadas (2)

### [US-012: Registrar consumo de productos](US-012-registrar-consumo.md)
**Estado**: ✅ Completada (Sprint 8 - 2025-12-12)

Sistema de tracking de consumo usando 4 niveles de stock (Alto, Medio, Bajo, Vacío):
- Actualización rápida de niveles de stock (2 taps, <5 segundos)
- Gestión automática de lista de compras
- Indicadores visuales con barras de progreso coloreadas
- Badges de urgencia en shopping list
- Auto-agregado/eliminación según nivel de stock

**Implementación**: First iteration (by levels)
**Tests**: 484 unit tests + 8 E2E tests ✅
**Documentación**: User guide + Technical docs

---

### [US-022: Marcar productos en lista de compra](US-022-lista-compra-checkbox.md)
**Estado**: ✅ Completada (Sprint 9 - 2025-12-15)

**Descripción**: Sistema de checkboxes para gestión natural de lista de compras durante el proceso de compra en el supermercado.

**Funcionalidades**:
- Checkbox por item reemplazando botón "Comprado"
- Items permanecen visibles al ser marcados (no desaparecen)
- Diferenciación visual: line-through + opacity 0.6
- Estado checked persistente en localStorage
- Flujo natural replicando comportamiento real del supermercado

**Implementación**:
- Domain: Campo `checked: boolean` + método `toggleChecked()`
- Infrastructure: DTO con backward compatibility
- Presentation: Componente ShoppingListPage con checkbox UX

**Tests**: 497 unit tests + 21 E2E tests ✅
**OpenSpec**: Archived as `2025-12-15-add-shopping-list-checkbox`
**Commits**: 4 commits implementing full feature

---

## Historias Pendientes (2)

- **US-014**: Recibir alertas de stock bajo
- **US-015**: Generar lista de compras automáticamente

## Progreso

Completadas: 2/4 (50%)
Sprint actual: 9
Próxima: US-024 (Modo Compra) → Luego US-014 o US-015

## Siguiente Iteración

**Consumption Tracking by Portions** (Segunda iteración):
- Sistema híbrido: Niveles + Porciones
- Análisis de patrones de consumo
- Predicciones de días restantes
- Lista de compras predictiva

Ver: `openspec/changes/implement-consumption-tracking-by-portions/`
