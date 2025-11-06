# ADR 005: Mockear Use Cases, No Repositorios

**Estado:** Aceptado
**Fecha:** 2024-11-06
**Autores:** Equipo de Desarrollo

## Contexto

Al testear la capa de presentación (componentes React), necesitamos decidir qué mockear:
- Opción A: Mockear repositorios y usar use cases reales
- Opción B: Mockear use cases directamente

Clean Architecture establece que la presentación debe conocer solo la capa de aplicación, no la infraestructura.

## Decisión

En tests de la capa de presentación, **mockear únicamente use cases**, nunca repositorios.

### Patrón de Testing

```typescript
// ✅ CORRECTO: Mock del use case
const mockExecute = vi.fn();
vi.mock('../../../application/use-cases/AddProductToInventory', () => ({
  AddProductToInventory: vi.fn().mockImplementation(() => ({
    execute: mockExecute,
  })),
}));

describe('AddProductPage', () => {
  it('should call use case when form is submitted', async () => {
    mockExecute.mockResolvedValue(undefined);

    render(<AddProductPage />);
    // ... submit form ...

    expect(mockExecute).toHaveBeenCalledWith({
      id: expect.any(String),
      name: 'Leche',
      initialQuantity: 10,
    });
  });
});
```

```typescript
// ❌ INCORRECTO: Mock de repositorio
const mockProductRepo = { save: vi.fn() };
const mockInventoryRepo = { save: vi.fn() };

describe('AddProductPage', () => {
  it('should save to repository', async () => {
    render(<AddProductPage />);
    // ... submit form ...

    // ❌ Componente no debe conocer repositorios
    expect(mockProductRepo.save).toHaveBeenCalled();
  });
});
```

## Consecuencias

### Positivas

- ✅ **Respeta Clean Architecture**: Presentación solo conoce use cases
- ✅ **Tests rápidos**: ~30ms vs ~2000ms (20x más rápido)
- ✅ **Encapsulación preservada**: Detalles de infraestructura ocultos
- ✅ **Resiliente a cambios**: Cambiar de localStorage a IndexedDB no rompe tests
- ✅ **Testa el contrato**: Verifica la interacción correcta con use cases
- ✅ **Fácil testear errores**: Mock del use case puede simular cualquier error

### Negativas

- ⚠️ **No testa integración real**: No verifica que localStorage funcione
- ⚠️ **Requiere tests adicionales**: Necesitamos tests de integración separados

### Mitigaciones

- Tests de integración en capa de infraestructura verifican repositorios
- E2E tests verifican flujo completo con persistencia real
- Tests de use cases verifican la orchestration correcta

### Capas y Testing

| Capa | Qué Mockear | Qué Testear |
|------|-------------|-------------|
| **Presentation** | Use Cases | UI, interacción, contrato con use cases |
| **Application** | Repositories | Orchestration, lógica de aplicación |
| **Infrastructure** | External services | Implementación de repositorios |
| **Domain** | Nada | Reglas de negocio puras |