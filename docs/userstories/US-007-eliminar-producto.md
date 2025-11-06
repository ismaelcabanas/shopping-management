# US-007: Eliminar un producto del sistema

**Épica**: Gestión Avanzada de Inventario
**Estado**: 🔴 Pendiente
**Prioridad**: Alta
**Sprint**: Sprint 4 (Planificado)
**Estimación**: 2 story points (~1-2 horas)

---

## Historia de Usuario

**Como** usuario que ya no usa un producto
**Quiero** eliminarlo del sistema completamente
**Para** mantener mi catálogo limpio y relevante

---

## Criterios de Aceptación

- [ ] Existe un botón "Eliminar" visible en cada producto del catálogo
- [ ] Al hacer clic en "Eliminar", aparece un diálogo de confirmación
- [ ] El mensaje de confirmación indica claramente que se eliminará el producto y su inventario
- [ ] El mensaje muestra el nombre del producto a eliminar
- [ ] Si confirmo la eliminación, el producto se elimina tanto de productos como de inventario
- [ ] Recibo confirmación visual (toast) de que el producto fue eliminado
- [ ] El producto desaparece inmediatamente de todas las listas (catálogo, dashboard, inventario)
- [ ] Puedo cancelar la eliminación sin que nada cambie
- [ ] Si hay un error, recibo un mensaje claro y el producto no se elimina

---

## Validaciones

### Pre-eliminación
- Verificar que el producto existe
- Verificar que tengo los permisos necesarios (futuro)

### Post-eliminación
- Producto eliminado de Product repository
- InventoryItem eliminado de Inventory repository
- Cascada: eliminar referencias en otras entidades (futuro: ShoppingList, PriceHistory)

---

## Detalles Técnicos

### Arquitectura (Clean Architecture)

```
Presentation Layer
  └─ ProductCatalogPage.tsx
      └─ DeleteConfirmationDialog.tsx (nuevo componente)
          └─ useProducts() custom hook
              └─ DeleteProduct (Use Case - NUEVO)
                  ├─ ProductRepository (Interface)
                  │   └─ LocalStorageProductRepository
                  │       └─ delete() method (NUEVO)
                  └─ InventoryRepository (Interface)
                      └─ LocalStorageInventoryRepository
                          └─ deleteByProductId() method (NUEVO)
```

### Componentes a Crear/Modificar

#### Nuevos
- **Dialog**: `DeleteConfirmationDialog.tsx` o usar shadcn/ui Alert Dialog
- **Use Case**: `DeleteProduct.ts` (`src/application/use-cases/DeleteProduct.ts`)

#### Modificar
- **Custom Hook**: `useProducts()` - añadir método `deleteProduct()`
- **Repositories**:
  - `LocalStorageProductRepository` - añadir método `delete(productId)`
  - `LocalStorageInventoryRepository` - añadir método `deleteByProductId(productId)`
- **Página**: `ProductCatalogPage.tsx` - añadir botón de eliminar y manejar confirmación

### Testing

Tests a implementar:

#### Use Case Tests (~6 tests)
- ✅ Elimina producto y su inventario correctamente
- ✅ Valida que el producto exista antes de eliminar
- ✅ Lanza error si producto no existe
- ✅ Elimina producto pero mantiene otros productos intactos
- ✅ Maneja errores de repositories gracefully
- ✅ Rollback si falla eliminación de inventario (transaccionalidad)

#### Repository Tests (~4 tests)
- ✅ delete() elimina producto correcto
- ✅ delete() lanza error si producto no existe
- ✅ deleteByProductId() elimina inventario correcto
- ✅ Otros productos permanecen intactos

#### Hook Tests (~4 tests)
- ✅ deleteProduct() llama al use case correctamente
- ✅ Actualiza estado después de eliminar (refetch)
- ✅ Maneja errores correctamente
- ✅ No actualiza estado si componente desmontado (memory leak)

#### Component Tests (~5 tests)
- ✅ Botón "Eliminar" visible en cada producto
- ✅ Click en eliminar muestra diálogo de confirmación
- ✅ Diálogo muestra nombre del producto correcto
- ✅ Cancelar cierra diálogo sin eliminar
- ✅ Confirmar elimina producto y muestra toast de éxito

**Total estimado**: ~19 tests

---

## Flujo de Usuario

### Flujo Principal (Eliminación Exitosa)

1. Usuario navega a `/catalog`
2. Ve lista de productos, cada uno con botón "Eliminar" (ícono 🗑️ o texto)
3. Hace clic en "Eliminar" del producto "Leche"
4. Se abre diálogo de confirmación:
   ```
   ⚠️ ¿Estás seguro?

   Vas a eliminar el producto "Leche".
   Esta acción también eliminará su inventario
   y no se puede deshacer.

   [Cancelar]  [Eliminar]
   ```
5. Usuario hace clic en "Eliminar"
6. **Use Case ejecuta**:
   - Verifica que producto exista
   - Elimina de ProductRepository
   - Elimina de InventoryRepository
7. **Hook**: Recarga lista de productos
8. **UI**: Toast ✅ "Producto eliminado exitosamente"
9. Diálogo se cierra
10. Producto desaparece de la lista

### Flujo Alternativo: Cancelar

1-4. (igual que flujo principal)
5. Usuario hace clic en "Cancelar" o cierra diálogo (X)
6. Diálogo se cierra sin eliminar
7. Producto permanece en la lista

### Flujo Alternativo: Producto No Existe

1-5. (igual que flujo principal)
6. **Use Case falla**: Producto no encontrado
7. **UI**: Toast ❌ "Error: El producto no existe"
8. Diálogo se cierra
9. Lista se recarga (sin el producto fantasma)

### Flujo Alternativo: Error de Eliminación

1-5. (igual que flujo principal)
6. **Use Case falla**: Error al eliminar de localStorage
7. **UI**: Toast ❌ "Error al eliminar el producto. Inténtalo de nuevo"
8. Diálogo se cierra
9. Producto permanece en la lista

---

## Flujo Técnico Detallado

```typescript
// 1. Usuario hace clic en "Eliminar"
onClick={() => openDeleteDialog(product)}

// 2. Diálogo de confirmación
<DeleteConfirmationDialog
  isOpen={isDeleteDialogOpen}
  productName={selectedProduct?.name}
  onCancel={() => setIsDeleteDialogOpen(false)}
  onConfirm={handleDeleteConfirm}
/>

// 3. Usuario confirma eliminación
const handleDeleteConfirm = async () => {
  try {
    await useProducts.deleteProduct(selectedProduct.id.value);
    toast.success('Producto eliminado exitosamente');
    setIsDeleteDialogOpen(false);
  } catch (error) {
    toast.error('Error al eliminar el producto');
  }
}

// 4. Hook ejecuta use case
const deleteProduct = async (productId: string) => {
  try {
    setError(null);

    // Instanciar repositories y use case
    const productRepository = new LocalStorageProductRepository();
    const inventoryRepository = new LocalStorageInventoryRepository();
    const deleteProductUseCase = new DeleteProduct(
      productRepository,
      inventoryRepository
    );

    // Ejecutar
    await deleteProductUseCase.execute({ productId });

    // Refetch para actualizar lista
    await loadProducts();

  } catch (err) {
    if (isMountedRef.current) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
    }
    throw err; // Re-throw para que componente maneje
  }
}

// 5. Use Case coordina eliminación
export interface DeleteProductCommand {
  productId: string;
}

export class DeleteProduct {
  constructor(
    private productRepository: ProductRepository,
    private inventoryRepository: InventoryRepository
  ) {}

  async execute(command: DeleteProductCommand): Promise<void> {
    const productId = ProductId.fromString(command.productId);

    // Verificar que el producto existe
    const existingProduct = await this.productRepository.findById(productId);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    try {
      // Eliminar inventario primero (para mantener consistencia)
      await this.inventoryRepository.deleteByProductId(productId);

      // Eliminar producto
      await this.productRepository.delete(productId);

    } catch (error) {
      // En un sistema real, aquí haríamos rollback
      // Con localStorage, si falla es mejor no hacer nada
      throw new Error('Failed to delete product');
    }
  }
}

// 6. Repositories implementan delete()
class LocalStorageProductRepository {
  async delete(productId: ProductId): Promise<void> {
    const products = await this.findAll();
    const filtered = products.filter(p => p.id.value !== productId.value);

    if (filtered.length === products.length) {
      throw new Error('Product not found');
    }

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(filtered.map(this.toJSON))
    );
  }
}

class LocalStorageInventoryRepository {
  async deleteByProductId(productId: ProductId): Promise<void> {
    const items = await this.findAll();
    const filtered = items.filter(
      item => item.productId.value !== productId.value
    );

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(filtered.map(this.toJSON))
    );
  }
}

// 7. UI muestra feedback
toast.success('Producto eliminado exitosamente');
setIsDeleteDialogOpen(false);
// Lista se actualiza automáticamente (refetch)
```

---

## Implementación por Pasos (TDD)

### Paso 1: Use Case (1h)
1. **Red**: Escribir tests de DeleteProduct
   - Test: elimina producto y su inventario
   - Test: valida existencia del producto
   - Test: maneja error si no existe
   - Test: rollback si falla eliminación de inventario
   - Test: mantiene otros productos intactos

2. **Green**: Implementar DeleteProduct use case
   ```typescript
   export interface DeleteProductCommand {
     productId: string;
   }

   export class DeleteProduct {
     constructor(
       private productRepository: ProductRepository,
       private inventoryRepository: InventoryRepository
     ) {}

     async execute(command: DeleteProductCommand): Promise<void> {
       // Implementación
     }
   }
   ```

3. **Refactor**: Manejar transaccionalidad y errores

### Paso 2: Infrastructure (0.5h)
1. **Red**: Escribir tests de repository.delete()
2. **Green**: Implementar métodos delete()
3. **Refactor**: Optimizar y manejar edge cases

### Paso 3: Custom Hook (0.5h)
1. **Red**: Escribir tests de useProducts.deleteProduct()
2. **Green**: Añadir método deleteProduct() al hook
3. **Refactor**: Verificar consistencia con otros métodos

### Paso 4: UI Components (1h)
1. **Red**: Escribir tests de DeleteConfirmationDialog
2. **Green**: Implementar diálogo de confirmación
3. **Refactor**: Mejorar UX y accesibilidad

### Paso 5: Integration (0.5h)
1. Integrar en ProductCatalogPage
2. Tests E2E
3. Verificar flujo completo

**Total estimado**: 3.5 horas

---

## Componente de Confirmación

### Opción A: Dialog Modal Simple (Recomendado)

```tsx
interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  productName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmationDialog({
  isOpen,
  productName,
  onCancel,
  onConfirm
}: DeleteConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md">
        <h2 className="text-xl font-bold mb-4">⚠️ ¿Estás seguro?</h2>
        <p className="mb-4">
          Vas a eliminar el producto <strong>"{productName}"</strong>.
        </p>
        <p className="text-sm text-gray-600 mb-6">
          Esta acción también eliminará su inventario y no se puede deshacer.
        </p>
        <div className="flex gap-4 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Opción B: Usar shadcn/ui Alert Dialog

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>⚠️ ¿Estás seguro?</AlertDialogTitle>
      <AlertDialogDescription>
        Vas a eliminar el producto "{productName}".
        Esta acción no se puede deshacer.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction onClick={onConfirm}>Eliminar</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

**Recomendación**: Opción B si ya usamos shadcn/ui, Opción A si queremos mantenerlo simple.

---

## Consideraciones de Transaccionalidad

### Problema
LocalStorage no soporta transacciones. Si falla la eliminación del inventario después de eliminar el producto, quedamos en estado inconsistente.

### Soluciones

#### Opción 1: Delete Inventory First (Recomendado)
```typescript
// Eliminar inventario primero
await this.inventoryRepository.deleteByProductId(productId);

// Luego eliminar producto
await this.productRepository.delete(productId);
```

**Ventaja**: Si falla eliminar producto, el inventario huérfano no es crítico.

#### Opción 2: Two-Phase Delete
```typescript
// Fase 1: Validar que ambos existen
const product = await productRepo.findById(id);
const inventory = await inventoryRepo.findByProductId(id);

// Fase 2: Eliminar ambos
await Promise.all([
  productRepo.delete(id),
  inventoryRepo.deleteByProductId(id)
]);
```

**Desventaja**: Si uno falla, el otro ya se eliminó.

#### Opción 3: Soft Delete (Futuro con Backend)
- Marcar como `deleted: true` en lugar de eliminar
- Permite rollback
- Requiere cambios en el modelo

**Decisión**: Usar Opción 1 para MVP con LocalStorage.

---

## Impacto en Otras Funcionalidades

### ✅ Funcionalidades Actuales
- **Dashboard (US-003)**: Producto desaparece automáticamente
- **Catálogo (US-005)**: Producto desaparece de la lista
- **Formulario (US-004)**: Nombre del producto eliminado vuelve a estar disponible

### ⚠️ Funcionalidades Futuras (Considerar)

Cuando implementemos estas features, debemos eliminar cascada:

- **ShoppingList**: Eliminar items que referencien el producto
- **PriceHistory**: Eliminar histórico de precios
- **Purchase**: ¿Mantener histórico de compras? (soft delete)

**Decisión**: Documentar en ADR cuando llegue el momento.

---

## Consideraciones de UX

### Accesibilidad
- ✅ Diálogo modal trap focus
- ✅ ESC key cierra diálogo (cancel)
- ✅ Enter key en diálogo confirma (peligroso, mejor no)
- ✅ Botón eliminar tiene `aria-label`

### Visual Design
- ✅ Botón eliminar en rojo/destructivo
- ✅ Ícono de advertencia en diálogo
- ✅ Texto claro sobre irreversibilidad
- ✅ Botón "Eliminar" destacado en rojo

### Feedback
- ✅ Toast de confirmación después de eliminar
- ✅ Loading state durante eliminación (opcional)
- ✅ Animación al desaparecer de lista (opcional)

---

## Alternativas Consideradas

### Alternativa 1: Soft Delete
**Descripción**: Marcar como eliminado en lugar de borrar.

**Pros**:
- Reversible
- Mantiene histórico
- Más seguro

**Contras**:
- Más complejo
- Requiere filtrado en queries
- No necesario para MVP

**Decisión**: No implementar ahora, considerar para v2.0

### Alternativa 2: Papelera de Reciclaje
**Descripción**: Mover a papelera, eliminar después de X días.

**Pros**:
- Muy user-friendly
- Reduce errores

**Contras**:
- Requiere job programado
- Más complejidad
- Overkill para MVP

**Decisión**: No implementar, considerar para futuro

---

## Definition of Done

- [ ] Use Case `DeleteProduct` implementado con validaciones
- [ ] Método `delete()` en `LocalStorageProductRepository`
- [ ] Método `deleteByProductId()` en `LocalStorageInventoryRepository`
- [ ] Método `deleteProduct()` en hook `useProducts()`
- [ ] Componente `DeleteConfirmationDialog` creado
- [ ] Integración en `ProductCatalogPage`
- [ ] 19+ tests escritos y pasando (TDD)
- [ ] Diálogo de confirmación con mensaje claro
- [ ] Eliminación cascada de producto e inventario
- [ ] Toast notifications de éxito/error
- [ ] Accesibilidad verificada (focus trap, ESC key)
- [ ] Tests E2E verificados
- [ ] Code review completado
- [ ] Documentación actualizada (este archivo)
- [ ] Desplegado y verificado en desarrollo

---

## Riesgos y Mitigaciones

### Riesgo 1: Eliminación accidental
**Mitigación**:
- ✅ Diálogo de confirmación obligatorio
- ✅ Mensaje claro sobre irreversibilidad
- Considerar: Soft delete en v2.0

### Riesgo 2: Estado inconsistente (fallo parcial)
**Mitigación**:
- ✅ Eliminar inventario primero (menos crítico si falla)
- ✅ Manejo de errores robusto
- Futuro: Transacciones con backend

### Riesgo 3: Producto en uso en otras entidades
**Mitigación**:
- Actual: Solo Product e InventoryItem
- Futuro: Validar referencias antes de eliminar
- Considerar: Restricción de eliminación si está en ShoppingList activa

### Riesgo 4: Pérdida de datos
**Mitigación**:
- Usuario debe confirmar explícitamente
- Mensaje claro sobre pérdida de inventario
- Futuro: Backup automático o soft delete

---

## Métricas de Éxito

- [ ] 0 eliminaciones accidentales reportadas
- [ ] Tiempo promedio de eliminación < 5 segundos
- [ ] 0 estados inconsistentes (producto sin inventario o viceversa)
- [ ] Satisfacción del usuario con el flujo de confirmación

---

## Siguientes Pasos Después de US-007

Con US-006 y US-007 completados, tendremos el CRUD completo de productos:
- ✅ **Create** (US-004)
- ✅ **Read** (US-005)
- 🔜 **Update** (US-006)
- 🔜 **Delete** (US-007)

**Siguiente lógico**: **US-008** - Actualizar cantidad de inventario

---

## Notas Adicionales

- Esta historia completa el Delete del CRUD
- Es la más simple de la épica 2 (por eso se hace segunda)
- Establece patrón para eliminaciones futuras
- Preparado para TDD desde el inicio
- Considera transaccionalidad aunque LocalStorage no la soporte