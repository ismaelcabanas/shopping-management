# Épica 4: Gestión de Consumo

**Estado**: En Progreso (1/4 historias completadas)

## Descripción
Sistema de seguimiento de consumo y gestión automática de lista de compras basado en niveles de stock.

## Historias Completadas (1)

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

## Historias Pendientes (3)

Las siguientes historias implementarán la segunda iteración (tracking por porciones y analytics):

- **US-013**: Ver historial de consumo
- **US-014**: Recibir alertas de stock bajo
- **US-015**: Generar lista de compras automáticamente

## Progreso de la Épica

```
Completadas: 1/4 (25%)
Sprint actual: 8
Fecha inicio: 2025-12-12
```

## Siguiente Iteración

**Consumption Tracking by Portions** (Segunda iteración):
- Sistema híbrido: Niveles + Porciones
- Análisis de patrones de consumo
- Predicciones de días restantes
- Lista de compras predictiva

Ver: `openspec/changes/implement-consumption-tracking-by-portions/`
