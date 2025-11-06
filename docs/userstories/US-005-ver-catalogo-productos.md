# US-005: Ver catálogo completo de productos

**Épica**: Gestión de Inventario Personal
**Estado**: 🟢 Completado
**Prioridad**: Alta
**Sprint**: Sprint 3

---

## Historia de Usuario

**Como** usuario de la aplicación
**Quiero** ver todos los productos disponibles en el sistema
**Para** conocer qué productos puedo gestionar

---

## Criterios de Aceptación

- [x] Se muestra una lista/grid de todos los productos
- [x] Cada producto muestra: nombre, unidad de medida
- [x] Si no hay productos, se muestra un mensaje apropiado
- [x] Hay un botón o enlace para añadir un nuevo producto
- [x] La visualización es clara y fácil de escanear
- [x] Los productos se ordenan alfabéticamente

---

## Detalles Técnicos

### Arquitectura (Clean Architecture)

```
Presentation Layer
  └─ ProductCatalogPage.tsx
      └─ useProducts() custom hook
          └─ GetAllProducts (Use Case)
              └─ ProductRepository (Interface)
                  └─ LocalStorageProductRepository
```

### Componentes

- **Página**: `ProductCatalogPage.tsx` (`src/presentation/pages/ProductCatalogPage.tsx`)
- **Custom Hook**: `useProducts()` (`src/presentation/hooks/useProducts.ts`)
- **Lista**: `ProductList.tsx` (`src/presentation/features/product-list/ProductList.tsx`)
- **Item**: `ProductListItem.tsx` (`src/presentation/features/product-list/ProductListItem.tsx`)
- **Card**: `ProductCard.tsx` (`src/presentation/features/product-list/ProductCard.tsx`)
- **Use Case**: `GetAllProducts` (`src/application/use-cases/GetAllProducts.ts`)

### Testing

- ✅ **4 tests** de ProductCatalogPage
- ✅ **9 tests** de useProducts hook
  - Loading states
  - Success scenarios (con/sin productos)
  - Error handling
  - Refetch functionality
  - Cleanup y memory leak prevention
- ✅ **Tests adicionales** de componentes de lista

---

## Flujo Técnico

```
1. Usuario navega a /catalog
2. ProductCatalogPage se monta
3. useProducts() se ejecuta automáticamente
4. loadProducts() inicia:
   - setIsLoading(true)
   - setError(null)
5. GetAllProducts use case:
   - LocalStorageProductRepository.findAll()
   - Obtiene productos de localStorage
   - Convierte JSON a entidades Product
6. Hook actualiza estado:
   - setProducts(fetchedProducts)
   - setIsLoading(false)
7. ProductCatalogPage renderiza:
   - ProductList → ProductListItem (para cada producto)
```

---

## Estructura del Custom Hook useProducts

```typescript
interface UseProductsReturn {
  products: Product[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef<boolean>(true);

  // loadProducts implementation...
  // refetch implementation...
  // useEffect with cleanup...

  return { products, isLoading, error, refetch };
}
```

### Características del Hook

- ✅ **Encapsulación**: Oculta detalles de repositorios y use cases
- ✅ **Memory leak prevention**: Usa `isMountedRef` para cleanup
- ✅ **Refetch**: Permite recargar datos manualmente
- ✅ **Estados consistentes**: loading, error, data pattern
- ✅ **Documentación**: JSDoc completo con ejemplos

---

## Estados de la UI

### Loading State
```
┌──────────────────────────┐
│  Cargando productos...   │
│  [Spinner animation]     │
└──────────────────────────┘
```

### Empty State
```
┌────────────────────────────────────┐
│   No hay productos registrados     │
│                                    │
│   [Botón: Añadir primer producto]  │
└────────────────────────────────────┘
```

### Success State (con productos)
```
┌────────────────────────────────────┐
│  Catálogo de Productos             │
│                                    │
│  ┌──────────────────┐             │
│  │ Aceite           │             │
│  │ Litros           │             │
│  └──────────────────┘             │
│                                    │
│  ┌──────────────────┐             │
│  │ Arroz            │             │
│  │ Kilogramos       │             │
│  └──────────────────┘             │
│                                    │
│  ┌──────────────────┐             │
│  │ Leche            │             │
│  │ Litros           │             │
│  └──────────────────┘             │
│                                    │
│  [Botón: Añadir Producto]          │
└────────────────────────────────────┘
```

### Error State
```
┌────────────────────────────────────┐
│  ❌ Error al cargar productos      │
│                                    │
│  [Botón: Reintentar]               │
└────────────────────────────────────┘
```

---

## Organización de Componentes (Feature-Based)

Siguiendo el patrón híbrido:

```
presentation/
└── features/
    └── product-list/
        ├── ProductCard.tsx
        ├── ProductCard.test.tsx
        ├── ProductList.tsx
        └── ProductListItem.tsx
```

**Beneficio**: Todo el código relacionado con "lista de productos" está junto.

---

## Ejemplo de Uso del Hook

```typescript
function ProductCatalogPage() {
  const { products, isLoading, error, refetch } = useProducts();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (products.length === 0) return <EmptyState />;

  return (
    <div>
      <h1>Catálogo de Productos</h1>
      <ProductList products={products} />
      <Button onClick={() => navigate('/add-product')}>
        Añadir Producto
      </Button>
    </div>
  );
}
```

---

## Ordenamiento

Los productos se ordenan alfabéticamente por nombre (case-insensitive):

```typescript
products.sort((a, b) =>
  a.name.toLowerCase().localeCompare(b.name.toLowerCase())
)
```

---

## Performance

- **Carga inicial**: ~30ms (desde localStorage)
- **Re-renders**: Optimizado con React keys
- **Memory**: Cleanup automático al desmontar

---

## Patrón Establecido

Este hook establece el patrón para futuros hooks:
- ✅ `useProducts()` - Completado
- ✅ `useInventory()` - Completado
- 🔜 `useStores()` - Por implementar
- 🔜 `useShoppingList()` - Por implementar

---

## Definition of Done

- [x] Código implementado siguiendo Clean Architecture
- [x] Custom hook reutilizable (useProducts)
- [x] Patrón de estados consistente (loading, error, data)
- [x] Tests exhaustivos (13+ tests)
- [x] Memory leak prevention
- [x] Documentación JSDoc completa
- [x] Tests E2E verificados
- [x] Code review completado
- [x] Desplegado y verificado