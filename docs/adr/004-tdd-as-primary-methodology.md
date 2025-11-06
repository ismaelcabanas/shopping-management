# ADR 004: Test-Driven Development como Metodología Principal

**Estado:** Aceptado
**Fecha:** 2024-11-06
**Autores:** Equipo de Desarrollo

## Contexto

Necesitamos una metodología de desarrollo que:
- Garantice alta calidad del código
- Facilite el refactoring seguro
- Documente el comportamiento esperado
- Prevenga regresiones

## Decisión

Adoptamos **Test-Driven Development (TDD)** como metodología principal de desarrollo, siguiendo el ciclo Red-Green-Refactor:

### Ciclo TDD

1. **🔴 Red**: Escribir un test que falle
2. **🟢 Green**: Escribir el código mínimo para que pase
3. **🔵 Refactor**: Mejorar el código manteniendo tests en verde

### Aplicación por Capa

```
Domain Layer:
1. Escribir test de entidad/value object
2. Implementar lógica de negocio
3. Refactorizar

Application Layer:
1. Escribir test de use case
2. Implementar orchestration
3. Refactorizar

Presentation Layer:
1. Escribir test de componente/hook
2. Implementar UI/interacción
3. Refactorizar
```

### Ejemplo Real

Implementación de `useProducts` custom hook:
1. **Red**: 9 tests escritos primero (todos fallando)
2. **Green**: Implementación del hook (105 líneas)
3. **Refactor**: Mejora de TypeScript types
4. **Resultado**: 9/9 tests pasando ✅

## Consecuencias

### Positivas

- ✅ **Confianza**: 211 tests pasando dan seguridad para refactorizar
- ✅ **Documentación viva**: Tests documentan comportamiento esperado
- ✅ **Diseño mejorado**: TDD fuerza a pensar en la API antes de implementar
- ✅ **Menos bugs**: Problemas detectados en desarrollo, no en producción
- ✅ **Refactoring seguro**: Tests verifican que nada se rompe
- ✅ **Cobertura alta**: ~85% de cobertura de código

### Negativas

- ⚠️ **Tiempo inicial**: Escribir tests primero parece más lento al inicio
- ⚠️ **Curva de aprendizaje**: Requiere práctica para hacerlo bien
- ⚠️ **Mantenimiento**: Tests también requieren mantenimiento

### Mitigaciones

- Inversión en tiempo de desarrollo compensa con menos bugs
- Documentación detallada en TESTING_STRATEGY.md
- Ejemplos de tests en el código existente
- CI/CD ejecuta tests automáticamente