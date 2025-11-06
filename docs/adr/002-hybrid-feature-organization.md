# ADR 002: Organización Híbrida de Presentación

**Estado:** Aceptado
**Fecha:** 2024-11-06
**Autores:** Equipo de Desarrollo

## Contexto

La capa de presentación puede organizarse de dos maneras principales:
1. **Por tipo de componente** (components/, pages/, hooks/)
2. **Por feature** (feature-sliced design)

Necesitamos una organización que:
- Facilite encontrar código relacionado
- Escale bien cuando el equipo crezca
- Mantenga los principios de Clean Architecture

## Decisión

Adoptamos una **organización híbrida** que combina:
- **Capas horizontales** (domain, application, infrastructure) para lógica de negocio
- **Features verticales** en la capa de presentación para UI

### Estructura de Presentación

```
presentation/
├── features/           # Features auto-contenidos
│   ├── product-list/
│   │   ├── ProductCard.tsx
│   │   └── ProductCard.test.tsx
│   └── shopping-cart/
│       ├── ShoppingList.tsx
│       └── ShoppingList.test.tsx
├── shared/            # Recursos compartidos
│   ├── components/    # Componentes UI reutilizables
│   └── hooks/        # Custom hooks compartidos
└── pages/            # Orquestadores de features
    ├── HomePage.tsx
    └── DashboardPage.tsx
```

## Consecuencias

### Positivas

- ✅ **Colocation**: Código relacionado está junto
- ✅ **Escalabilidad**: Múltiples desarrolladores pueden trabajar en paralelo
- ✅ **Descubrimiento**: Fácil encontrar dónde está cada funcionalidad
- ✅ **Aislamiento**: Features independientes son fáciles de modificar o eliminar
- ✅ **Mantiene Clean Architecture**: La lógica de negocio sigue en capas horizontales

### Negativas

- ⚠️ **Duplicación potencial**: Risk de duplicar componentes similares entre features
- ⚠️ **Decisiones extra**: Hay que decidir qué va en feature vs shared

### Mitigaciones

- Reglas claras documentadas en FRONTEND_ARCHITECTURE.md
- Code reviews para detectar duplicación
- Mover a `shared/` cuando un componente se use en 3+ features