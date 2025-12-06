# US-006: Editar información de un producto

**Épica**: Gestión Avanzada de Inventario
**Estado**: ✅ Completada
**Prioridad**: Alta
**Sprint**: Sprint 4
**Estimación**: 3 story points (~2-3 horas)
**Fecha de Finalización**: 2025-11-14

---

## Historia de Usuario

**Como** usuario que cometió un error al crear un producto
**Quiero** poder editar el nombre y unidad de medida de un producto existente
**Para** corregir errores sin tener que eliminarlo y recrearlo

---

## Criterios de Aceptación

- [ ] Existe un botón "Editar" visible en cada producto del catálogo
- [ ] Al hacer clic en "Editar", se abre un formulario/modal con los datos actuales
- [ ] Puedo modificar: nombre del producto y unidad de medida
- [ ] Al guardar, se validan los datos igual que al crear (nombre mínimo 2 caracteres)
- [ ] No puedo cambiar a un nombre que ya existe en otro producto
- [ ] Recibo confirmación visual (toast) de que los cambios se guardaron
- [ ] Los cambios se reflejan inmediatamente en todas las vistas (catálogo, dashboard, inventario)
- [ ] Puedo cancelar la edición sin guardar cambios
- [ ] El ID del producto no cambia (inmutable)

---

## Validaciones

### Campo "Nombre"
- No puede estar vacío
- Debe tener al menos 2 caracteres
- No puede duplicar el nombre de otro producto (excepto el actual)
- Se valida en el dominio (Product entity)

### Campo "Unidad"
- Debe ser una de las opciones válidas: units, kg, liters
- Se valida en el dominio (UnitType value object)

---

## Detalles Técnicos

### Arquitectura (Clean Architecture)

```
Presentation Layer
  └─ ProductCatalogPage.tsx
      └─ EditProductModal.tsx (nuevo componente)
          └─ ProductForm.tsx (reutilizar)
              └─ useProducts() custom hook
                  └─ UpdateProduct (Use Case - NUEVO)
                      ├─ Product (Domain Entity)
                      └─ ProductRepository (Interface)
                          └─ LocalStorageProductRepository
                              └─ update() method (NUEVO)
```

### Componentes a Crear/Modificar

#### Nuevos
- **Modal/Dialog**: `EditProductModal.tsx` o inline edit
- **Use Case**: `UpdateProduct.ts` (`src/application/use-cases/UpdateProduct.ts`)

#### Modificar
- **Custom Hook**: `useProducts()` - añadir método `updateProduct()`
- **Repository**: `LocalStorageProductRepository` - añadir método `update()`
- **Página**: `ProductCatalogPage.tsx` - añadir botón de editar y manejar modal
- **Componente**: `ProductForm.tsx` - mode="edit" para prellenar datos

### Testing

Tests a implementar:

#### Use Case Tests (~5 tests)
- ✅ Actualiza producto existente correctamente
- ✅ Valida que el producto exista antes de actualizar
- ✅ Valida que el nuevo nombre no esté duplicado
- ✅ Lanza error si producto no existe
- ✅ Lanza error si nombre duplicado

#### Hook Tests (~4 tests)
- ✅ updateProduct() llama al use case correctamente
- ✅ Actualiza estado después de editar
- ✅ Maneja errores de validación
- ✅ Refetch automático después de actualizar

#### Component Tests (~6 tests)
- ✅ Botón "Editar" visible en cada producto
- ✅ Modal se abre con datos prellenados
- ✅ Permite modificar nombre y unidad
- ✅ Valida campos antes de guardar
- ✅ Muestra toast de éxito al guardar
- ✅ Cierra modal después de guardar

**Total estimado**: ~15 tests

---

## Flujo de Usuario

### Flujo Principal

1. Usuario navega a `/catalog`
2. Ve lista de productos, cada uno con botón "Editar" (ícono ✏️ o texto)
3. Hace clic en "Editar" del producto "Leche"
4. Se abre modal/formulario con datos actuales:
   - Nombre: "Leche"
   - Unidad: "litros"
5. Usuario modifica nombre a "Leche Desnatada"
6. Usuario hace clic en "Guardar"
7. **Validación**: Product entity valida el nuevo nombre
8. **Use Case**: UpdateProduct verifica que no exista duplicado
9. **Repository**: Actualiza en localStorage
10. **Hook**: Recarga lista de productos
11. **UI**: Toast ✅ "Producto actualizado exitosamente"
12. Modal se cierra
13. Lista se actualiza mostrando "Leche Desnatada"

### Flujo Alternativo: Error de Validación

1-5. (igual que flujo principal)
6. Usuario modifica nombre a "A" (< 2 caracteres)
7. **Validación falla**: Product entity lanza error
8. **UI**: Toast ❌ "El nombre debe tener al menos 2 caracteres"
9. Modal permanece abierto con mensaje de error
10. Usuario corrige el error

### Flujo Alternativo: Nombre Duplicado

1-5. (igual que flujo principal)
6. Usuario modifica nombre a "Arroz" (que ya existe)
7. **Use Case falla**: Encuentra producto con ese nombre
8. **UI**: Toast ❌ "Ya existe un producto con ese nombre"
9. Modal permanece abierto

### Flujo Alternativo: Cancelar

1-5. (igual que flujo principal)
6. Usuario hace clic en "Cancelar" o cierra modal
7. Modal se cierra sin guardar
8. Producto mantiene valores originales

---

## Flujo Técnico Detallado

```typescript
// 1. Usuario hace clic en "Editar"
onClick={() => openEditModal(product)}

// 2. Modal se abre con datos prellenados
<EditProductModal
  product={product}
  isOpen={isEditModalOpen}
  onClose={() => setIsEditModalOpen(false)}
  onSave={handleSave}
/>

// 3. Usuario modifica y guarda
const handleSave = async (updatedData: EditProductCommand) => {
  await useProducts.updateProduct({
    id: product.id.value,
    name: updatedData.name,
    unitType: updatedData.unitType
  })
}

// 4. Hook ejecuta use case
const updateProduct = async (command: UpdateProductCommand) => {
  try {
    setError(null);

    // Instanciar use case
    const repository = new LocalStorageProductRepository();
    const updateProductUseCase = new UpdateProduct(repository);

    // Ejecutar
    await updateProductUseCase.execute(command);

    // Refetch para actualizar lista
    await loadProducts();

  } catch (err) {
    setError(err);
    throw err; // Re-throw para que componente maneje
  }
}

// 5. Use Case valida y actualiza
class UpdateProduct {
  async execute(command: UpdateProductCommand): Promise<void> {
    // Obtener producto actual
    const existingProduct = await this.repository.findById(
      ProductId.fromString(command.id)
    );

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    // Verificar nombre duplicado (si cambió)
    if (existingProduct.name !== command.name) {
      const duplicate = await this.repository.findByName(command.name);
      if (duplicate && duplicate.id.value !== command.id) {
        throw new Error('Product name already exists');
      }
    }

    // Crear producto actualizado (validaciones en constructor)
    const updatedProduct = new Product(
      ProductId.fromString(command.id),
      command.name,
      UnitType.fromString(command.unitType)
    );

    // Actualizar en repositorio
    await this.repository.update(updatedProduct);
  }
}

// 6. Repository actualiza en localStorage
class LocalStorageProductRepository {
  async update(product: Product): Promise<void> {
    const products = await this.findAll();
    const index = products.findIndex(p => p.id.value === product.id.value);

    if (index === -1) {
      throw new Error('Product not found');
    }

    products[index] = product;
    localStorage.setItem(this.storageKey, JSON.stringify(
      products.map(this.toJSON)
    ));
  }
}

// 7. UI muestra feedback
toast.success('Producto actualizado exitosamente');
setIsEditModalOpen(false);
```

---

## Implementación por Pasos (TDD)

### Paso 1: Domain Layer (0.5h)
✅ Ya existe - Product entity tiene validaciones

### Paso 2: Use Case (1h)
1. **Red**: Escribir tests de UpdateProduct
   - Test: actualiza producto correctamente
   - Test: valida existencia del producto
   - Test: valida nombre no duplicado
   - Test: maneja errores

2. **Green**: Implementar UpdateProduct use case
   ```typescript
   export interface UpdateProductCommand {
     id: string;
     name: string;
     unitType: string;
   }

   export class UpdateProduct {
     constructor(private repository: ProductRepository) {}

     async execute(command: UpdateProductCommand): Promise<void> {
       // Implementación
     }
   }
   ```

3. **Refactor**: Optimizar y limpiar

### Paso 3: Infrastructure (0.5h)
1. **Red**: Escribir tests de repository.update()
2. **Green**: Implementar método update()
3. **Refactor**: Optimizar

### Paso 4: Custom Hook (0.5h)
1. **Red**: Escribir tests de useProducts.updateProduct()
2. **Green**: Añadir método updateProduct() al hook
3. **Refactor**: Verificar consistencia con addProduct()

### Paso 5: UI Components (1h)
1. **Red**: Escribir tests de EditProductModal
2. **Green**: Implementar modal/formulario
3. **Refactor**: Reutilizar ProductForm si es posible

### Paso 6: Integration (0.5h)
1. Integrar en ProductCatalogPage
2. Tests E2E
3. Verificar flujo completo

**Total estimado**: 3-4 horas

---

## Opciones de UI

### Opción A: Modal Dialog (Recomendado)
```tsx
<EditProductModal
  product={product}
  isOpen={isEditModalOpen}
  onClose={closeModal}
  onSave={handleSave}
/>
```

**Ventajas**:
- Foco claro en la edición
- Reutiliza ProductForm
- No complica el layout del catálogo

### Opción B: Inline Edit
```tsx
<ProductCard
  product={product}
  isEditing={editingId === product.id}
  onEdit={() => setEditingId(product.id)}
  onSave={handleSave}
  onCancel={() => setEditingId(null)}
/>
```

**Ventajas**:
- Edición más rápida
- No hay modal que abrir/cerrar

**Desventajas**:
- Más complejo de implementar
- Dificulta el layout

**Recomendación**: Opción A (Modal)

---

## Dependencias

### Librerías a Considerar
- **Sin nueva librería**: Usar Tailwind para modal
- **O usar**: shadcn/ui Dialog component (ya tenemos algunos componentes)

### Archivos a Modificar
1. `src/application/use-cases/UpdateProduct.ts` (nuevo)
2. `src/infrastructure/repositories/LocalStorageProductRepository.ts` (añadir update)
3. `src/presentation/hooks/useProducts.ts` (añadir updateProduct)
4. `src/presentation/pages/ProductCatalogPage.tsx` (añadir botón y modal)
5. `src/presentation/components/EditProductModal.tsx` (nuevo)

---

## Impacto en Otras Funcionalidades

### ✅ No Afecta
- Dashboard (US-003): Mostrará nombre actualizado automáticamente
- Inventario: El ProductId no cambia, relación se mantiene

### ⚠️ Consideraciones
- Si cambiamos la unidad, debería ser consistente con el inventario
- Considerar añadir validación: "¿Estás seguro de cambiar la unidad?"

---

## Definition of Done

- [x] Use Case `UpdateProduct` implementado con validaciones
- [x] Método `update()` en `LocalStorageProductRepository`
- [x] Método `updateProduct()` en hook `useProducts()`
- [x] Componente `EditProductModal` creado
- [x] Integración en `ProductCatalogPage`
- [x] 15+ tests escritos y pasando (TDD)
- [x] Validaciones de nombre y unidad funcionando
- [x] Validación de nombre duplicado funcionando
- [x] Toast notifications de éxito/error
- [x] Tests E2E verificados
- [x] Code review completado
- [x] Documentación actualizada (este archivo)
- [x] ADR actualizado si hay decisiones arquitectónicas
- [x] Desplegado y verificado en desarrollo

---

## Riesgos y Mitigaciones

### Riesgo 1: Cambiar unidad sin actualizar inventario
**Mitigación**:
- Mostrar warning al usuario
- O sincronizar cambio en InventoryItem automáticamente
- Decisión: Documentar en ADR

### Riesgo 2: Producto en uso en otras entidades futuras
**Mitigación**:
- Por ahora solo Product e InventoryItem
- Cuando añadamos ShoppingList, considerar cascade updates

### Riesgo 3: Ediciones concurrentes (futuro con backend)
**Mitigación**:
- LocalStorage no tiene este problema
- Al migrar a backend, usar optimistic locking

---

## Siguientes Pasos Después de US-006

1. **US-007**: Eliminar producto (complementa el CRUD)
2. **US-008**: Actualizar cantidad de inventario
3. Luego considerar entidades más complejas (Store, ShoppingList)

---

## Notas Adicionales

- Esta historia completa el Update del CRUD
- Reutiliza arquitectura establecida en US-004 y US-005
- Mantiene consistencia con patrones de custom hooks
- Preparado para TDD desde el inicio