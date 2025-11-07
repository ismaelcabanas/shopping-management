# US-008: Registrar compra y actualizar inventario

**Épica**: Gestión Avanzada de Inventario
**Estado**: 🔴 Pendiente
**Prioridad**: Alta
**Sprint**: Sprint 4 (Planificado)
**Estimación**: 5 story points (~3-4 horas)

---

## Historia de Usuario

**Como** usuario que acaba de hacer la compra
**Quiero** registrar los productos comprados y sus cantidades
**Para** que mi inventario se actualice automáticamente sin tener que hacerlo manualmente producto por producto

---

## Criterios de Aceptación

- [ ] Existe una opción visible para "Registrar compra" en el catálogo
- [ ] Puedo acceder a un formulario para seleccionar productos comprados
- [ ] Puedo indicar la cantidad comprada de cada producto
- [ ] Puedo añadir múltiples productos en una sola compra
- [ ] Al guardar, el stock de cada producto se incrementa automáticamente
- [ ] Veo confirmación visual de que la compra fue registrada
- [ ] El inventario se actualiza inmediatamente en todas las vistas
- [ ] Si un producto no tiene inventario previo, se crea con la cantidad comprada
- [ ] Puedo cancelar el registro sin que se actualice nada
- [ ] Las cantidades deben ser números positivos mayores a 0
- [ ] Recibo mensajes de error claros si algo falla

---

## Validaciones

### Pre-registro
- La compra debe tener al menos un producto
- Todas las cantidades deben ser > 0
- Los productos seleccionados deben existir en el catálogo

### Post-registro
- El inventario debe reflejar las cantidades sumadas
- Si el producto no tenía inventario, se crea nuevo InventoryItem
- No se debe crear duplicados de InventoryItem

---

## Detalles Técnicos

### Arquitectura (Clean Architecture)

```
Presentation Layer
  └─ ProductCatalogPage.tsx
      └─ RegisterPurchaseModal.tsx (nuevo componente)
          └─ PurchaseProductSelector.tsx (nuevo componente)
              └─ useInventory() custom hook
                  └─ RegisterPurchase (Use Case - NUEVO)
                      ├─ ProductRepository (Interface)
                      │   └─ LocalStorageProductRepository
                      └─ InventoryRepository (Interface)
                          └─ LocalStorageInventoryRepository
                              └─ updateOrCreate() method (NUEVO)
```

### Entidades del Dominio

#### Nueva: Purchase (Entidad Agregada)
```typescript
// src/domain/model/Purchase.ts
export class Purchase {
  constructor(
    public readonly id: PurchaseId,
    public readonly purchaseDate: Date,
    public readonly items: PurchaseItem[] // Value Objects
  ) {}

  get totalQuantity(): number {
    return this.items.reduce((sum, item) => sum + item.quantity.value, 0);
  }

  validate(): void {
    if (this.items.length === 0) {
      throw new Error('Purchase must have at least one item');
    }
  }
}
```

#### Nuevo: PurchaseItem (Value Object)
```typescript
// src/domain/model/PurchaseItem.ts
export class PurchaseItem {
  constructor(
    public readonly productId: ProductId,
    public readonly quantity: Quantity
  ) {
    if (quantity.value <= 0) {
      throw new Error('Purchase quantity must be greater than 0');
    }
  }
}
```

### Componentes a Crear/Modificar

#### Nuevos
- **Modal**: `RegisterPurchaseModal.tsx` - Modal principal para registrar compra
- **Component**: `PurchaseProductSelector.tsx` - Selector de productos con cantidades
- **Use Case**: `RegisterPurchase.ts` (`src/application/use-cases/RegisterPurchase.ts`)
- **Entities**:
  - `Purchase.ts` (`src/domain/model/Purchase.ts`)
  - `PurchaseItem.ts` (`src/domain/model/PurchaseItem.ts`)
  - `PurchaseId.ts` (`src/domain/model/PurchaseId.ts`)

#### Modificar
- **Custom Hook**: `useInventory()` - añadir método `registerPurchase()`
- **Repository**: `LocalStorageInventoryRepository` - añadir método `updateOrCreate()`
- **Página**: `ProductCatalogPage.tsx` - añadir botón "Registrar compra"

### Testing

Tests a implementar:

#### Use Case Tests (~8 tests)
- ✅ Registra compra con un producto y actualiza inventario
- ✅ Registra compra con múltiples productos
- ✅ Crea InventoryItem si no existía previamente
- ✅ Suma cantidades al inventario existente correctamente
- ✅ Valida que la compra tenga al menos un producto
- ✅ Valida que todas las cantidades sean > 0
- ✅ Lanza error si un producto no existe
- ✅ Maneja errores de repositories gracefully

#### Repository Tests (~5 tests)
- ✅ updateOrCreate() actualiza inventario existente
- ✅ updateOrCreate() crea nuevo inventario si no existe
- ✅ updateOrCreate() suma cantidades correctamente
- ✅ Mantiene otros items de inventario intactos
- ✅ Respeta el unitType del producto

#### Hook Tests (~4 tests)
- ✅ registerPurchase() llama al use case correctamente
- ✅ Actualiza estado después de registrar (refetch)
- ✅ Maneja errores correctamente
- ✅ No actualiza estado si componente desmontado

#### Component Tests (~8 tests)
- ✅ Botón "Registrar compra" visible en catálogo
- ✅ Click en botón abre modal
- ✅ Modal muestra lista de productos disponibles
- ✅ Puedo seleccionar productos y añadir cantidades
- ✅ Puedo añadir múltiples productos
- ✅ Botón guardar deshabilitado si no hay productos
- ✅ Valida que cantidades sean números positivos
- ✅ Muestra mensaje de éxito al guardar

**Total estimado**: ~25 tests

---

## Flujo de Usuario

### Flujo Principal (Registro Exitoso)

1. Usuario navega a `/catalog`
2. Ve botón "Registrar compra" (ícono 🛒 o texto)
3. Hace clic en "Registrar compra"
4. Se abre modal con formulario:
   ```
   📦 Registrar Compra

   Selecciona los productos que compraste:

   [Dropdown: Seleccionar producto]
   [Input: Cantidad] [Botón: Añadir]

   Productos añadidos:
   ┌─────────────────────────────────┐
   │ Leche - 2 litros      [Eliminar]│
   │ Pan - 3 unidades      [Eliminar]│
   └─────────────────────────────────┘

   [Cancelar]  [Guardar Compra]
   ```
5. Usuario selecciona "Leche" y añade cantidad "2"
6. Usuario selecciona "Pan" y añade cantidad "3"
7. Usuario hace clic en "Guardar Compra"
8. **Use Case ejecuta**:
   - Valida que hay productos en la compra
   - Para cada producto:
     * Verifica que el producto exista
     * Busca InventoryItem existente
     * Si existe: suma la cantidad
     * Si no existe: crea nuevo con la cantidad
   - Guarda todos los cambios
9. **Hook**: Recarga lista de productos con inventario
10. **UI**: Toast ✅ "Compra registrada. Inventario actualizado"
11. Modal se cierra
12. Catálogo muestra cantidades actualizadas

### Flujo Alternativo: Sin Productos
1-4. (igual que flujo principal)
5. Usuario no añade ningún producto
6. Botón "Guardar Compra" está deshabilitado
7. Usuario hace clic en "Cancelar"
8. Modal se cierra sin cambios

### Flujo Alternativo: Cantidad Inválida
1-5. (igual que flujo principal)
6. Usuario intenta añadir cantidad "0" o "-1"
7. Muestra error: "La cantidad debe ser mayor a 0"
8. No añade el producto a la lista
9. Usuario corrige la cantidad
10. Continúa flujo normal

### Flujo Alternativo: Producto No Existe
1-7. (igual que flujo principal)
8. **Use Case falla**: Producto "Leche" no encontrado
9. **UI**: Toast ❌ "Error: Producto no encontrado"
10. Modal permanece abierto
11. Usuario puede corregir o cancelar

---

## Flujo Técnico Detallado

```typescript
// 1. Usuario hace clic en "Registrar compra"
<button onClick={() => setIsRegisterPurchaseOpen(true)}>
  🛒 Registrar Compra
</button>

// 2. Modal de registro
interface PurchaseItemInput {
  productId: string;
  quantity: number;
}

<RegisterPurchaseModal
  isOpen={isRegisterPurchaseOpen}
  products={availableProducts}
  onCancel={() => setIsRegisterPurchaseOpen(false)}
  onSave={handleRegisterPurchase}
/>

// 3. Usuario añade productos y guarda
const handleRegisterPurchase = async (items: PurchaseItemInput[]) => {
  try {
    await useInventory.registerPurchase(items);
    toast.success('Compra registrada. Inventario actualizado');
    setIsRegisterPurchaseOpen(false);
  } catch (error) {
    toast.error('Error al registrar la compra');
  }
}

// 4. Hook ejecuta use case
const registerPurchase = async (items: PurchaseItemInput[]) => {
  try {
    setError(null);

    const productRepository = new LocalStorageProductRepository();
    const inventoryRepository = new LocalStorageInventoryRepository();
    const registerPurchaseUseCase = new RegisterPurchase(
      productRepository,
      inventoryRepository
    );

    await registerPurchaseUseCase.execute({ items });
    await loadProducts(); // Refetch
  } catch (err) {
    if (isMountedRef.current) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
    }
    throw err;
  }
}

// 5. Use Case coordina actualización
export interface RegisterPurchaseCommand {
  items: PurchaseItemInput[];
}

export class RegisterPurchase {
  constructor(
    private productRepository: ProductRepository,
    private inventoryRepository: InventoryRepository
  ) {}

  async execute(command: RegisterPurchaseCommand): Promise<void> {
    // Validar que hay items
    if (command.items.length === 0) {
      throw new Error('Purchase must have at least one item');
    }

    // Crear entidad Purchase para validaciones de dominio
    const purchaseItems = await Promise.all(
      command.items.map(async item => {
        const productId = ProductId.fromString(item.productId);

        // Verificar que el producto existe
        const product = await this.productRepository.findById(productId);
        if (!product) {
          throw new Error(`Product with id ${item.productId} not found`);
        }

        return new PurchaseItem(
          productId,
          Quantity.create(item.quantity)
        );
      })
    );

    const purchase = new Purchase(
      PurchaseId.generate(),
      new Date(),
      purchaseItems
    );

    purchase.validate();

    // Actualizar inventario para cada producto
    for (const purchaseItem of purchase.items) {
      const product = await this.productRepository.findById(purchaseItem.productId);
      if (!product) continue;

      const existingInventory = await this.inventoryRepository.findByProductId(
        purchaseItem.productId
      );

      if (existingInventory) {
        // Sumar cantidad al inventario existente
        const newQuantity = Quantity.create(
          existingInventory.currentStock.value + purchaseItem.quantity.value
        );
        const updatedInventory = new InventoryItem(
          existingInventory.productId,
          newQuantity,
          existingInventory.unitType
        );
        await this.inventoryRepository.save(updatedInventory);
      } else {
        // Crear nuevo inventario
        const newInventory = new InventoryItem(
          purchaseItem.productId,
          purchaseItem.quantity,
          product.unitType
        );
        await this.inventoryRepository.save(newInventory);
      }
    }
  }
}

// 6. Repository implementa updateOrCreate() (opcional, o reusar save)
class LocalStorageInventoryRepository {
  async save(item: InventoryItem): Promise<void> {
    const items = await this.findAll();
    const existingIndex = items.findIndex(
      i => i.productId.equals(item.productId)
    );

    if (existingIndex !== -1) {
      // Actualizar existente (upsert)
      items[existingIndex] = item;
    } else {
      // Crear nuevo
      items.push(item);
    }

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(items.map(this.toJSON))
    );
  }
}
```

---

## Implementación por Pasos (TDD)

### Paso 1: Entidades del Dominio (0.5h)
1. **Red**: Tests para Purchase y PurchaseItem
2. **Green**: Implementar entidades con validaciones
3. **Refactor**: Optimizar y documentar

### Paso 2: Use Case (1.5h)
1. **Red**: Escribir tests de RegisterPurchase
   - Test: registra compra con un producto
   - Test: registra compra con múltiples productos
   - Test: crea inventario si no existe
   - Test: suma a inventario existente
   - Test: valida items vacíos
   - Test: valida cantidades > 0
   - Test: valida producto existe
2. **Green**: Implementar RegisterPurchase use case
3. **Refactor**: Manejo de errores y consistencia

### Paso 3: Infrastructure (0.5h)
1. **Red**: Escribir tests de repository (save como upsert)
2. **Green**: Verificar que save() funciona como upsert
3. **Refactor**: Optimizar

### Paso 4: Custom Hook (0.5h)
1. **Red**: Escribir tests de useInventory.registerPurchase()
2. **Green**: Añadir método registerPurchase()
3. **Refactor**: Consistencia con otros métodos

### Paso 5: UI Components (1.5h)
1. **Red**: Tests de RegisterPurchaseModal
2. **Green**: Implementar modal con selector de productos
3. **Refactor**: Mejorar UX y validaciones

### Paso 6: Integration (0.5h)
1. Integrar en ProductCatalogPage
2. Tests E2E
3. Verificar flujo completo

**Total estimado**: 5 horas

---

## Componente Principal

### RegisterPurchaseModal

```tsx
interface PurchaseItemInput {
  productId: string;
  productName: string;
  quantity: number;
}

interface RegisterPurchaseModalProps {
  isOpen: boolean;
  products: Product[];
  onCancel: () => void;
  onSave: (items: PurchaseItemInput[]) => Promise<void>;
}

export function RegisterPurchaseModal({
  isOpen,
  products,
  onCancel,
  onSave
}: RegisterPurchaseModalProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItemInput[]>([]);
  const [error, setError] = useState<string>('');

  const handleAddProduct = () => {
    if (!selectedProduct) {
      setError('Selecciona un producto');
      return;
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }

    const product = products.find(p => p.id.value === selectedProduct);
    if (!product) return;

    // Verificar si ya está añadido
    const existingIndex = purchaseItems.findIndex(
      item => item.productId === selectedProduct
    );

    if (existingIndex !== -1) {
      // Sumar cantidad al existente
      const updated = [...purchaseItems];
      updated[existingIndex].quantity += qty;
      setPurchaseItems(updated);
    } else {
      // Añadir nuevo
      setPurchaseItems([
        ...purchaseItems,
        {
          productId: selectedProduct,
          productName: product.name,
          quantity: qty
        }
      ]);
    }

    // Limpiar form
    setSelectedProduct('');
    setQuantity('');
    setError('');
  };

  const handleRemoveProduct = (productId: string) => {
    setPurchaseItems(purchaseItems.filter(item => item.productId !== productId));
  };

  const handleSave = async () => {
    try {
      await onSave(purchaseItems);
      setPurchaseItems([]);
    } catch (err) {
      setError('Error al guardar la compra');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">📦 Registrar Compra</h2>

        {/* Selector de producto */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Selecciona los productos que compraste:
          </label>
          <div className="flex gap-2">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
            >
              <option value="">Seleccionar producto...</option>
              {products.map(product => (
                <option key={product.id.value} value={product.id.value}>
                  {product.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Cantidad"
              className="w-24 border rounded px-3 py-2"
              min="1"
            />
            <button
              onClick={handleAddProduct}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Añadir
            </button>
          </div>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>

        {/* Lista de productos añadidos */}
        {purchaseItems.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Productos añadidos:</h3>
            <div className="space-y-2">
              {purchaseItems.map(item => (
                <div
                  key={item.productId}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded"
                >
                  <span>
                    {item.productName} - {item.quantity}
                  </span>
                  <button
                    onClick={() => handleRemoveProduct(item.productId)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={purchaseItems.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Guardar Compra
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## Consideraciones de UX

### Facilidad de Uso
- ✅ Dropdown con todos los productos disponibles
- ✅ Input numérico para cantidad con validación
- ✅ Botón "Añadir" para ir construyendo la compra
- ✅ Lista visual de productos añadidos
- ✅ Opción de eliminar productos de la lista antes de guardar
- ✅ Botón guardar deshabilitado si lista vacía

### Validaciones en Tiempo Real
- ✅ Cantidad debe ser número entero > 0
- ✅ Producto debe estar seleccionado
- ✅ Mensajes de error claros
- ✅ Feedback visual inmediato

### Feedback
- ✅ Toast de confirmación después de guardar
- ✅ Cantidades actualizadas visibles inmediatamente
- ✅ Modal se cierra automáticamente al guardar

---

## Mejoras Futuras (No incluidas en esta US)

### Fase 2: Con Tienda y Precio
- Seleccionar tienda donde se hizo la compra
- Registrar precio de cada producto
- Calcular total de la compra
- Historial de precios por tienda

### Fase 3: OCR de Ticket
- Fotografiar/escanear ticket de compra
- Extraer productos y cantidades automáticamente
- Matching inteligente con productos existentes
- Opción de añadir nuevos productos desde el ticket

### Fase 4: Historial de Compras
- Ver compras anteriores
- Repetir compra anterior
- Estadísticas de frecuencia de compra

---

## Definition of Done

- [ ] Entidades `Purchase`, `PurchaseItem`, `PurchaseId` implementadas
- [ ] Use Case `RegisterPurchase` implementado con validaciones
- [ ] Método `registerPurchase()` en hook `useInventory()`
- [ ] Componente `RegisterPurchaseModal` creado
- [ ] Integración en `ProductCatalogPage`
- [ ] 25+ tests escritos y pasando (TDD)
- [ ] Modal con selector de productos y cantidades
- [ ] Validaciones de entrada funcionando
- [ ] Actualización automática de inventario
- [ ] Creación de inventario si no existe
- [ ] Toast notifications de éxito/error
- [ ] Tests E2E verificados
- [ ] Code review completado
- [ ] Documentación actualizada
- [ ] Desplegado y verificado en desarrollo

---

## Riesgos y Mitigaciones

### Riesgo 1: Usuario añade producto equivocado
**Mitigación**:
- ✅ Opción de eliminar productos antes de guardar
- ✅ Lista visible de productos añadidos
- Futuro: Opción de editar compra después de registrada

### Riesgo 2: Cantidades incorrectas
**Mitigación**:
- ✅ Validación en tiempo real
- ✅ Input numérico con mínimo de 1
- Futuro: Historial para verificar compras anteriores

### Riesgo 3: Producto no existe (datos inconsistentes)
**Mitigación**:
- ✅ Validación en use case
- ✅ Manejo de errores robusto
- ✅ Mensaje de error claro al usuario

---

## Métricas de Éxito

- [ ] Tiempo promedio de registro < 2 minutos
- [ ] 0 errores de actualización de inventario
- [ ] Reducción del 80% en tiempo vs actualización manual
- [ ] Alta satisfacción del usuario con el flujo

---

## Notas Adicionales

- Esta historia introduce la entidad `Purchase` al dominio
- Establece la base para funcionalidades futuras (tiendas, precios, OCR)
- Mantiene simplicidad inicial (sin precio/tienda)
- Preparado para TDD desde el inicio
- El método `save()` del InventoryRepository ya funciona como upsert
