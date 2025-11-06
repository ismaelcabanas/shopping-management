# ADR 001: Clean Architecture con Domain-Driven Design

**Estado:** Aceptado
**Fecha:** 2024-11-06
**Autores:** Equipo de Desarrollo

## Contexto

El proyecto Shopping Manager requiere una arquitectura que permita:
- Mantener la lógica de negocio independiente de frameworks y librerías
- Facilitar el testing exhaustivo
- Permitir cambios en la infraestructura sin afectar el núcleo del negocio
- Escalar a medida que crecen las funcionalidades

## Decisión

Adoptamos **Clean Architecture** combinada con principios de **Domain-Driven Design (DDD)** como arquitectura base del proyecto.

### Estructura de Capas

```
src/
├── domain/              # Capa de Dominio (independiente)
│   ├── model/          # Entidades y Value Objects
│   └── repositories/   # Interfaces de repositorios
├── application/        # Capa de Aplicación
│   └── use-cases/     # Casos de uso del negocio
├── infrastructure/     # Capa de Infraestructura
│   └── repositories/  # Implementaciones concretas
└── presentation/       # Capa de Presentación
    ├── features/      # Componentes organizados por feature
    ├── pages/         # Páginas de la aplicación
    └── hooks/         # Custom hooks de React
```

### Reglas de Dependencia

Las dependencias fluyen hacia adentro:
- `presentation/` → `application/` → `domain/`
- `infrastructure/` → `application/` → `domain/`
- `domain/` no depende de nadie

## Consecuencias

### Positivas

- ✅ **Testabilidad**: Cada capa puede testearse independientemente
- ✅ **Mantenibilidad**: La lógica de negocio está aislada y protegida
- ✅ **Flexibilidad**: Podemos cambiar frameworks, bases de datos o UI sin afectar el dominio
- ✅ **Claridad**: La separación de responsabilidades es explícita
- ✅ **Escalabilidad**: Fácil añadir nuevas funcionalidades siguiendo el mismo patrón

### Negativas

- ⚠️ **Curva de aprendizaje**: Requiere entender Clean Architecture y DDD
- ⚠️ **Más archivos**: Mayor número de archivos comparado con arquitecturas más simples
- ⚠️ **Overhead inicial**: Setup inicial más complejo

### Mitigaciones

- Documentación clara en ARCHITECTURE_ANALYSIS.md
- Ejemplos concretos en el código
- TDD para facilitar el entendimiento de cada capa