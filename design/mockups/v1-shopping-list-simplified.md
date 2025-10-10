# Mockup v1: Lista de Compras Simplificada

**Fecha:** 2025-10-10
**Iteración:** 1 (MVP)
**Objetivo:** Página principal con lista de compras básica y ajuste de cantidades

## Wireframe

```
┌─────────────────────────────────────────────────────────┐
│  🛒 Shopping Manager - Lista de Compras                │
│                                          [+ Producto]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📋 Productos Necesarios (5)                           │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Pan                            [2] ud    [Edit] │    │
│  │ Estado: ⚠️ Stock bajo                            │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Leche Entera                   [1] L     [Edit] │    │
│  │ Estado: ⚠️ Stock bajo                            │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Tomates                        [1] kg    [Edit] │    │
│  │ Estado: ⚠️ Stock bajo                            │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Brócoli                        [1] ud    [Edit] │    │
│  │ Estado: ⚠️ Stock bajo                            │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Plátanos                       [6] ud    [Edit] │    │
│  │ Estado: ⚠️ Stock bajo                            │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Marcar Todos como Comprados] [Limpiar Lista]         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Funcionalidades MVP:

1. **Lista de productos** con estado "Stock bajo" (todos por defecto)
2. **Edición de cantidades** directa (click en [Edit])
3. **Añadir productos** nuevos con botón [+ Producto]
4. **Marcar como comprados** (acción grupal por simplicidad)
5. **Limpiar lista** para empezar de nuevo

## Elementos simplificados vs. diseño anterior:

- ❌ No hay comparación de precios (futuras iteraciones)
- ❌ No hay optimización de compra (futuras iteraciones)
- ❌ No hay rutas (futuras iteraciones)
- ✅ Mantiene funcionalidad core: lista + cantidades
- ✅ Base sólida para construir funcionalidades avanzadas

## Datos iniciales:

**Productos base:**
- Pan (2 unidades)
- Leche Entera (1 litro)
- Tomates (1 kg)
- Brócoli (1 unidad)
- Plátanos (6 unidades)

**Tiendas (para futuras iteraciones):**
- Mercadona
- Panadería Masa Madre
- AhorraMas
- Frutería Salmantina
- Carrefour