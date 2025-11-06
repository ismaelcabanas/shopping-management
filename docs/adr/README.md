# Architecture Decision Records (ADR)

Este directorio contiene los registros de decisiones arquitectónicas (ADR) del proyecto Shopping Manager.

## ¿Qué es un ADR?

Un ADR (Architecture Decision Record) es un documento que captura una decisión arquitectónica importante junto con su contexto y consecuencias. Sirve como documentación histórica de por qué se tomaron ciertas decisiones.

## Formato

Cada ADR sigue esta estructura:
- **Estado**: Propuesto / Aceptado / Rechazado / Obsoleto
- **Fecha**: Cuándo se tomó la decisión
- **Contexto**: Por qué necesitábamos tomar esta decisión
- **Decisión**: Qué decidimos hacer
- **Consecuencias**: Impactos positivos y negativos de la decisión

---

## Índice de ADRs

### Arquitectura

- [**ADR-001**: Clean Architecture con Domain-Driven Design](./001-clean-architecture-with-ddd.md)
  - Adopción de Clean Architecture + DDD como base arquitectónica
  - Define estructura de capas y reglas de dependencia
  - **Estado**: ✅ Aceptado

- [**ADR-002**: Organización Híbrida de Presentación](./002-hybrid-feature-organization.md)
  - Combina capas horizontales con features verticales
  - Estructura: features/ + shared/ + pages/
  - **Estado**: ✅ Aceptado

- [**ADR-003**: Custom Hooks para Abstracción de Use Cases](./003-custom-hooks-for-use-case-abstraction.md)
  - Patrón de custom hooks para desacoplar componentes de use cases
  - Gestión consistente de estados (loading, error, data)
  - **Estado**: ✅ Aceptado

- [**ADR-008**: LocalStorage como Persistencia Inicial](./008-localstorage-as-initial-persistence.md)
  - Uso de LocalStorage para MVP
  - Plan de migración a IndexedDB y backend
  - **Estado**: ✅ Aceptado (temporal)

### Testing

- [**ADR-004**: Test-Driven Development como Metodología Principal](./004-tdd-as-primary-methodology.md)
  - TDD con ciclo Red-Green-Refactor
  - Aplicado en todas las capas
  - **Estado**: ✅ Aceptado

- [**ADR-005**: Mockear Use Cases, No Repositorios](./005-mock-use-cases-not-repositories.md)
  - Estrategia de mocking respetando Clean Architecture
  - Presentación solo mockea use cases
  - **Estado**: ✅ Aceptado

- [**ADR-006**: Vitest + React Testing Library + Playwright](./006-vitest-react-testing-library-playwright.md)
  - Stack de testing completo
  - Vitest para unit/component, Playwright para E2E
  - **Estado**: ✅ Aceptado

- [**ADR-007**: Prevención de Memory Leaks en Custom Hooks](./007-memory-leak-prevention-in-hooks.md)
  - Patrón con useRef para prevenir memory leaks
  - Requerido en todos los hooks con async
  - **Estado**: ✅ Aceptado

---

## Estadísticas

- **Total ADRs**: 8
- **Aceptados**: 8
- **Temporales**: 1 (ADR-008)
- **Última actualización**: 2024-11-06

---

## Cómo Crear un Nuevo ADR

1. Copia la plantilla (ver abajo)
2. Crea un nuevo archivo: `NNN-titulo-kebab-case.md`
3. Llena todas las secciones
4. Actualiza este README con el nuevo ADR
5. Crea un PR para revisión del equipo

### Plantilla ADR

```markdown
# ADR NNN: Título de la Decisión

**Estado:** Propuesto
**Fecha:** YYYY-MM-DD
**Autores:** Nombre(s)

## Contexto

¿Qué problema o necesidad motivó esta decisión?
¿Qué opciones consideramos?

## Decisión

¿Qué decidimos hacer?
¿Cómo se implementará?

## Consecuencias

### Positivas
- ✅ Beneficio 1
- ✅ Beneficio 2

### Negativas
- ⚠️ Trade-off 1
- ⚠️ Trade-off 2

### Mitigaciones
Cómo minimizamos las consecuencias negativas
```

---

## Referencias

- [Documentación de ADRs](https://adr.github.io/)
- [Michael Nygard - Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)