# US-004: Añadir un producto nuevo al inventario

**Épica**: Gestión de Inventario Personal
**Estado**: 🟢 Completado
**Prioridad**: Alta
**Sprint**: Sprint 2

---

## Historia de Usuario

**Como** usuario que hace la compra
**Quiero** añadir productos nuevos a mi inventario
**Para** empezar a trackear lo que tengo en casa

---

## Criterios de Aceptación

- [x] Existe un formulario con campos para: nombre del producto, cantidad inicial, unidad
- [x] El nombre del producto es obligatorio
- [x] La cantidad por defecto es 0
- [x] Puedo seleccionar entre diferentes unidades (unidades, kg, litros)
- [x] Al enviar el formulario, el producto se guarda correctamente
- [x] Recibo una confirmación visual de que el producto fue añadido
- [x] Después de añadir, soy redirigido al catálogo
- [x] Si ya existe un producto con el mismo nombre, recibo un error claro

---

## Validaciones

### Campo "Nombre"
- ✅ No puede estar vacío
- ✅ Debe tener al menos 2 caracteres
- ✅ No puede existir otro producto con el mismo nombre

### Campo "Cantidad"
- ✅ Debe ser un número
- ✅ No puede ser negativo
- ✅ Valor por defecto: 0

### Campo "Unidad"
- ✅ Debe seleccionarse una opción válida
- ✅ Opciones: units (unidades), kg (kilogramos), liters (litros)

---

## Detalles Técnicos

### Arquitectura (Clean Architecture)

```
Presentation Layer
  └─ AddProductPage.tsx
      └─ ProductForm.tsx
          └─ useInventory() custom hook
              └─ AddProductToInventory (Use Case)
                  ├─ Product (Domain Entity)
                  ├─ InventoryItem (Domain Entity)
                  ├─ ProductRepository (Interface)
                  │   └─ LocalStorageProductRepository
                  └─ InventoryRepository (Interface)
                      └─ LocalStorageInventoryRepository
```

### Componentes

- **Página**: `AddProductPage.tsx` (`src/presentation/pages/AddProductPage.tsx`)
- **Formulario**: `ProductForm.tsx` (`src/presentation/components/ProductForm.tsx`)
- **Custom Hook**: `useInventory()` - método `addProduct()`
- **Use Case**: `AddProductToInventory` (`src/application/use-cases/AddProductToInventory.ts`)

### Domain Entities

- **Product**: Entidad de dominio con validaciones
- **InventoryItem**: Entidad que representa stock
- **Value Objects**: `ProductId`, `Quantity`, `UnitType`

### Testing

- ✅ **5 tests** de AddProductPage
- ✅ **9 tests** de ProductForm
  - Validaciones de campos
  - Envío de formulario
  - Manejo de errores
  - Integración con use case

---

## Flujo de Usuario

1. Usuario navega a `/add-product`
2. Ve el formulario con campos vacíos (cantidad = 0 por defecto)
3. Completa nombre: "Leche"
4. Ajusta cantidad: 3
5. Selecciona unidad: "litros"
6. Hace clic en "Agregar Producto"
7. **Validación en el dominio**: Product y InventoryItem se crean
8. **Use Case ejecuta**: Verifica que no exista, guarda en repositorios
9. **Notificación**: Toast de éxito ✅ "Producto agregado exitosamente"
10. **Redirección**: Usuario es llevado a `/catalog`

---

## Flujo Técnico Detallado

```typescript
// 1. Usuario completa formulario
onSubmit(formData)

// 2. AddProductPage valida y llama al hook
await useInventory.addProduct({
  id: crypto.randomUUID(),
  name: 'Leche',
  initialQuantity: 3,
  unitType: 'liters'
})

// 3. Hook ejecuta use case
const useCase = new AddProductToInventory(productRepo, inventoryRepo)
await useCase.execute(command)

// 4. Use case valida y crea entidades
const product = new Product(
  ProductId.fromString(id),
  name,
  UnitType.fromString(unitType)
)

const inventoryItem = new InventoryItem(
  product.id,
  new Quantity(initialQuantity),
  unitType
)

// 5. Verifica duplicados
const existing = await productRepository.findByName(name)
if (existing) throw new Error('Product already exists')

// 6. Guarda en repositorios
await productRepository.save(product)
await inventoryRepository.save(inventoryItem)

// 7. Hook recarga datos
await loadProductsWithInventory()

// 8. Notificación y redirección
toast.success('Producto agregado exitosamente')
navigate('/catalog')
```

---

## Manejo de Errores

### Error: Producto duplicado
```
❌ Error: Ya existe un producto con el nombre "Leche"
```

### Error: Nombre inválido
```
❌ El nombre del producto debe tener al menos 2 caracteres
```

### Error: Cantidad negativa
```
❌ La cantidad no puede ser negativa
```

### Error: Guardado fallido
```
❌ Error al guardar el producto. Inténtalo de nuevo.
```

---

## Notificaciones (Toast)

Utilizamos `react-hot-toast`:

```typescript
// Éxito
toast.success('Producto agregado exitosamente')

// Error
toast.error('Error al agregar producto')
```

---

## Validaciones de Dominio

Las validaciones están en las entidades de dominio, no en el formulario:

```typescript
// Product entity
if (!name || name.trim().length < 2) {
  throw new Error('Invalid product name')
}

// Quantity value object
if (value < 0) {
  throw new Error('Quantity cannot be negative')
}
```

---

## Performance y UX

- **Validación client-side**: Inmediata (formulario)
- **Validación domain**: Al enviar (entidades)
- **Feedback visual**: Toast notifications
- **Redirección**: 1.5s delay para que usuario vea el toast
- **Loading state**: Botón deshabilitado durante guardado

---

## Definition of Done

- [x] Código implementado con Clean Architecture + DDD
- [x] Validaciones en entidades de dominio
- [x] Tests unitarios (14 tests)
- [x] Manejo de errores robusto
- [x] Notificaciones de usuario
- [x] Tests E2E verificados
- [x] Code review completado
- [x] Documentación técnica actualizada
- [x] Desplegado y verificado