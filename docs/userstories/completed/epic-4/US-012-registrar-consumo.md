# US-012: Registrar consumo de productos

**Épica**: Épica 4 - Gestión de Consumo
**Estado**: 🔴 Pendiente
**Story Points**: 3 SP (~2-3h)
**Prioridad**: ⭐⭐⭐⭐⭐ (CRÍTICO)

---

## Historia de Usuario

**Como** usuario que usó un producto
**Quiero** registrar su consumo desde el catálogo
**Para** que el inventario refleje lo que realmente tengo

---

## Contexto

Sin tracking de consumo, el inventario se vuelve estático y pierde utilidad. Los usuarios compran productos y los agregan al inventario, pero cuando los consumen, el stock no se actualiza. Esto significa que el inventario no refleja la realidad y pierde su valor como herramienta de gestión.

**Impacto**: Esta es la pieza faltante más crítica. Sin consumo, el sistema no genera valor sostenible.

---

## Criterios de Aceptación

### 1. Registrar consumo desde catálogo
- [ ] Botón "Consumir" visible en cada producto del catálogo
- [ ] Modal para registrar cantidad consumida
- [ ] Validación: cantidad ≤ stock disponible
- [ ] Actualización inmediata del inventario

### 2. Actualización del inventario
- [ ] Stock actual se reduce por la cantidad consumida
- [ ] Si stock llega a 0, mostrar indicador visual
- [ ] Persistencia en LocalStorage

### 3. Feedback visual
- [ ] Confirmación después del registro exitoso
- [ ] Mensaje de error si cantidad inválida
- [ ] Actualización en tiempo real del stock visible

---

## Detalles Técnicos

### Nuevas Entidades/Value Objects
- `ConsumptionRecord`: Entidad para registrar el consumo
  - `id`, `product_id`, `quantity`, `date`

### Use Cases
- `RegisterConsumption`: Registrar consumo de un producto

### Componentes UI
- `RegisterConsumptionModal`: Modal para registrar consumo
- Botón de consumo en `ProductCatalogPage`

### Repositories
- Extender `InventoryRepository` con método `decreaseStock()`
- `ConsumptionRepository` para historial (opcional para US-012, requerido para US-013)

---

## Definition of Done

### Tests
- [ ] Tests unitarios para `RegisterConsumption` use case
- [ ] Tests para `ConsumptionRecord` entity
- [ ] Tests de componente para `RegisterConsumptionModal`
- [ ] Tests de integración para el flujo completo
- [ ] E2E test para registrar consumo

### Funcionalidad
- [ ] Registro de consumo funciona correctamente
- [ ] Stock se actualiza en tiempo real
- [ ] Validaciones funcionan
- [ ] Persistencia en LocalStorage

### Calidad de Código
- [ ] TDD: Tests escritos primero
- [ ] Clean Architecture mantenida
- [ ] Sin warnings de TypeScript/ESLint
- [ ] Código revisado y refactorizado

---

## Impacto del Proyecto

**🎯 CRÍTICO**: Esta historia completa el ciclo básico del producto:
```
Comprar → Almacenar → **CONSUMIR** → [Próximo: Alertar + Lista Automática]
```

Sin esta funcionalidad:
- El inventario se vuelve desactualizado rápidamente
- Los usuarios deben actualizar manualmente el stock
- Las alertas de stock bajo no serán precisas
- La lista de compras automática no funcionará

---

## Próximos Pasos

Una vez implementado US-012, desbloquea:
- **US-013**: Historial de consumo (ver patrones)
- **US-014**: Alertas de stock bajo (detectar cuando comprar)
- **US-015**: Lista de compras automática (generar qué comprar)

---

## Referencias

- [Épica 4: Gestión de Consumo](../../README.md#épica-4)
- [ROADMAP](../../../ROADMAP.md)
- OpenSpec: `implement-consumption-tracking-by-levels`
