# US-015: Lista de compras automática

**Épica**: Épica 4 - Gestión de Consumo
**Estado**: 🔴 Pendiente
**Story Points**: 5 SP (~3-4h)
**Prioridad**: ⭐⭐⭐⭐⭐ (ALTO IMPACTO)

---

## Historia de Usuario

**Como** usuario
**Quiero** generar automáticamente una lista de compras
**Para** no tener que recordar qué productos me faltan

---

## Criterios de Aceptación

### 1. Generación automática
- [ ] Añade automáticamente productos con `stock < minimum_stock`
- [ ] Calcula cantidad sugerida: `minimum_stock - current_stock`
- [ ] Permite ajustar cantidades manualmente

### 2. Vista de lista de compras
- [ ] Página dedicada para la lista
- [ ] Muestra productos pendientes de comprar
- [ ] Permite marcar como "comprado" o eliminar de la lista

### 3. Integración con registro de compra
- [ ] Botón para ir directamente al registro de compra
- [ ] Pre-llenar el modal con productos de la lista
- [ ] Marcar automáticamente como "comprado" después de registrar

---

## Impacto

🚀 **ALTO** - Esta historia cierra el ciclo completo del producto:
```
Comprar → Almacenar → Consumir → Alertar → **Lista Automática** → Comprar...
```

---

## Detalles Técnicos

### Nuevas Entidades
- `ShoppingList`: Entity agregada
- `ShoppingListItem`: Value object

### Use Cases
- `GenerateShoppingList`: Genera lista basada en stock
- `UpdateShoppingList`: Actualizar cantidades
- `MarkAsPurchased`: Marcar items como comprados

### Componentes
- `ShoppingListPage`: Nueva página
- Integración con `RegisterPurchaseModal`

---

## Definition of Done

- [ ] Tests completos (unit, integration, E2E)
- [ ] Lista se genera automáticamente
- [ ] Integración con compra funciona
- [ ] Persistencia en LocalStorage

---

## Referencias

- Depende de: US-012, US-014
- OpenSpec: `implement-consumption-tracking-by-levels`
