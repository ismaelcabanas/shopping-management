# ADR 008: LocalStorage como Persistencia Inicial

**Estado:** Aceptado (temporal)
**Fecha:** 2024-11-06
**Autores:** Equipo de Desarrollo

## Contexto

Necesitamos persistencia de datos para el MVP sin tener backend:
- Opción A: LocalStorage (síncrono, ~5MB límite)
- Opción B: IndexedDB (asíncrono, ~50MB+ límite)
- Opción C: Backend desde el inicio

## Decisión

Usar **LocalStorage** como solución de persistencia inicial, con plan de migración a IndexedDB y luego a backend.

### Implementación

```typescript
// infrastructure/repositories/LocalStorageProductRepository.ts
export class LocalStorageProductRepository implements ProductRepository {
  private readonly storageKey = 'shopping_manager_products';

  async findAll(): Promise<Product[]> {
    const data = localStorage.getItem(this.storageKey);
    if (!data) return [];

    const json = JSON.parse(data);
    return json.map(this.toDomain);
  }

  async save(product: Product): Promise<void> {
    const products = await this.findAll();
    const updated = [...products, product];
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }

  private toDomain(json: any): Product {
    // Transformación de JSON a entidad de dominio
  }
}
```

### Repositorios Implementados

- ✅ `LocalStorageProductRepository`
- ✅ `LocalStorageInventoryRepository`

## Consecuencias

### Positivas

- ✅ **Desarrollo rápido**: No requiere backend ni setup complejo
- ✅ **API síncrona simple**: Fácil de usar
- ✅ **Sin dependencias**: Nativo del browser
- ✅ **Suficiente para MVP**: ~5MB es suficiente para centenares de productos
- ✅ **Arquitectura preparada**: Repository pattern facilita migración futura

### Negativas

- ⚠️ **Límite de 5MB**: No escala para grandes volúmenes
- ⚠️ **Síncrono**: Puede bloquear UI con muchos datos
- ⚠️ **No compartido**: Datos solo locales, no sincroniza entre devices
- ⚠️ **Fácil de borrar**: Usuario puede limpiar localStorage
- ⚠️ **Sin relaciones**: No hay queries complejas

### Plan de Migración

#### Fase 1: MVP (Actual)
```
Presentation → Use Cases → LocalStorage Repositories
```

#### Fase 2: Mejor UX (~Sprint 10)
```
Presentation → Use Cases → IndexedDB Repositories
```
Beneficios:
- Más capacidad (~50MB+)
- API asíncrona (no bloquea UI)
- Queries más eficientes

#### Fase 3: Multi-device (~Sprint 20)
```
Presentation → Use Cases → API Repositories → Backend (FastAPI)
```
Beneficios:
- Sincronización entre devices
- Backup en cloud
- Autenticación
- Analytics

### Preparación para Migración

El patrón Repository permite cambiar implementación sin tocar use cases:

```typescript
// Cambio solo aquí:
const productRepository = new IndexedDBProductRepository();
// En lugar de:
// const productRepository = new LocalStorageProductRepository();

// Use cases no cambian:
const getAllProducts = new GetAllProducts(productRepository);
```