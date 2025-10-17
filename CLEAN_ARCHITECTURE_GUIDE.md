# 🏗 Clean Architecture Guide - Shopping Manager

Esta guía explica cómo trabajar con la arquitectura Clean implementada en el proyecto Shopping Manager.

## 📚 **Tabla de Contenidos**

1. [Estructura de Capas](#estructura-de-capas)
2. [Cómo Añadir Nueva Funcionalidad](#cómo-añadir-nueva-funcionalidad)
3. [Patrones Implementados](#patrones-implementados)
4. [Testing Strategy](#testing-strategy)
5. [Mejores Prácticas](#mejores-prácticas)

---

## 🏛 **Estructura de Capas**

### **Domain Layer** (`src/domain/`)
**Responsabilidad:** Lógica de negocio pura, independiente de frameworks

```typescript
// ✅ HACER: Lógica de negocio rica
export class ItemStatusVO {
  toggle(): ItemStatusVO {
    return this.value === 'needed'
      ? ItemStatusVO.bought()
      : ItemStatusVO.needed();
  }
}

// ❌ NO HACER: Dependencias externas
import { useState } from 'react'; // ❌ React en domain
import axios from 'axios';         // ❌ HTTP client en domain
```

**Qué va aquí:**
- ✅ Entidades de negocio
- ✅ Value Objects con validaciones
- ✅ Interfaces de repositorios
- ✅ Reglas de negocio
- ❌ UI components
- ❌ Database calls
- ❌ HTTP requests

### **Application Layer** (`src/application/`)
**Responsabilidad:** Orquestar casos de uso del sistema

```typescript
// ✅ HACER: Caso de uso específico
export class UpdateQuantityUseCase {
  async execute(itemId: string, newQuantity: number): Promise<void> {
    const item = await this.repository.findById(itemId);
    const quantity = Quantity.create(newQuantity); // Domain validation
    // ... business logic
  }
}

// ❌ NO HACER: Lógica de UI
export class UpdateQuantityUseCase {
  execute(setItems: SetStateAction<Item[]>) { // ❌ React state
    // ...
  }
}
```

**Qué va aquí:**
- ✅ Use Cases (casos de uso)
- ✅ Application Services (facades)
- ✅ Orquestación de domain objects
- ✅ Transacciones y coordinación
- ❌ UI logic
- ❌ Database details
- ❌ Framework specifics

### **Infrastructure Layer** (`src/infrastructure/`)
**Responsabilidad:** Detalles técnicos e implementaciones

```typescript
// ✅ HACER: Implementar interfaces del domain
export class LocalStorageRepository implements ShoppingListRepository {
  async findAll(): Promise<ShoppingListItem[]> {
    const data = localStorage.getItem('shopping-list');
    return data ? JSON.parse(data) : [];
  }
}

// ❌ NO HACER: Lógica de negocio
export class LocalStorageRepository {
  async findAll(): Promise<ShoppingListItem[]> {
    const items = JSON.parse(localStorage.getItem('items'));
    // ❌ Business logic here
    return items.filter(item => item.isValid());
  }
}
```

**Qué va aquí:**
- ✅ Repository implementations
- ✅ API clients
- ✅ Database adapters
- ✅ External service integrations
- ✅ Framework configurations
- ❌ Business rules
- ❌ Use case logic

### **Presentation Layer** (`src/presentation/`)
**Responsabilidad:** Interface de usuario y adaptación a React

```typescript
// ✅ HACER: Hook que conecta con application layer
export function useShoppingList() {
  const service = new ShoppingListService(repository);

  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    await service.updateQuantity(id, quantity);
    await loadItems();
  }, []);
}

// ❌ NO HACER: Lógica de negocio en componentes
export function ShoppingList() {
  const updateQuantity = (id: string, quantity: number) => {
    // ❌ Business logic in component
    if (quantity <= 0) throw new Error('Invalid quantity');
    if (!Number.isInteger(quantity)) throw new Error('Must be integer');
  };
}
```

**Qué va aquí:**
- ✅ React components
- ✅ Custom hooks
- ✅ UI state management
- ✅ Event handlers
- ✅ Presentation logic
- ❌ Business rules
- ❌ Data persistence
- ❌ External API calls

---

## ⚡ **Cómo Añadir Nueva Funcionalidad**

### **Ejemplo: Añadir "Añadir Producto Nuevo"**

**Paso 1: Domain Layer**
```typescript
// src/domain/entities/Product.ts
export interface Product {
  id: string;
  name: string;
  defaultUnit: string;
  category?: string; // ✅ Nuevo campo
}

// src/domain/repositories/ProductRepository.ts
export interface ProductRepository {
  findAll(): Promise<Product[]>;
  save(product: Product): Promise<void>; // ✅ Nuevo método
}
```

**Paso 2: Application Layer**
```typescript
// src/application/use-cases/AddProductUseCase.ts
export class AddProductUseCase {
  constructor(
    private productRepo: ProductRepository,
    private shoppingListRepo: ShoppingListRepository
  ) {}

  async execute(name: string, unit: string, quantity: number): Promise<void> {
    // Validation with domain objects
    const unitVO = Unit.create(unit);
    const quantityVO = Quantity.create(quantity);

    const product = {
      id: crypto.randomUUID(),
      name,
      defaultUnit: unit
    };

    const shoppingItem = {
      id: crypto.randomUUID(),
      productName: name,
      quantity: quantityVO,
      unit: unitVO.getValue(),
      status: ItemStatusVO.needed(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.productRepo.save(product);
    await this.shoppingListRepo.save(shoppingItem);
  }
}
```

**Paso 3: Infrastructure Layer**
```typescript
// src/infrastructure/repositories/MockProductRepository.ts
export class MockProductRepository implements ProductRepository {
  // Implementation details...
}
```

**Paso 4: Presentation Layer**
```typescript
// src/presentation/hooks/useProducts.ts
export function useProducts() {
  const addProduct = useCallback(async (name: string, unit: string, quantity: number) => {
    const addProductUseCase = new AddProductUseCase(productRepo, shoppingListRepo);
    await addProductUseCase.execute(name, unit, quantity);
    await refresh();
  }, []);

  return { addProduct };
}

// src/presentation/components/AddProductForm.tsx
export function AddProductForm() {
  const { addProduct } = useProducts();
  // React component implementation...
}
```

---

## 🎯 **Patrones Implementados**

### **Repository Pattern**
```typescript
// Interface en domain (contrato)
interface ShoppingListRepository {
  findAll(): Promise<ShoppingListItem[]>;
}

// Implementation en infrastructure (detalles)
class MockShoppingListRepository implements ShoppingListRepository {
  async findAll(): Promise<ShoppingListItem[]> {
    return this.items; // Implementation detail
  }
}
```

### **Value Objects Pattern**
```typescript
// ✅ Encapsula validación y comportamiento
export class Quantity {
  private constructor(private readonly value: number) {
    if (value <= 0) throw new Error('Quantity must be positive');
  }

  static create(value: number): Quantity {
    return new Quantity(value);
  }

  add(other: Quantity): Quantity {
    return new Quantity(this.value + other.value);
  }
}
```

### **Use Case Pattern**
```typescript
// ✅ Un caso de uso = una responsabilidad
export class UpdateQuantityUseCase {
  async execute(itemId: string, newQuantity: number): Promise<void> {
    // Single responsibility: update quantity
  }
}
```

### **Adapter Pattern**
```typescript
// ✅ Convierte entre domain types y legacy types
export class ShoppingListAdapter {
  static toLegacy(domainItem: DomainShoppingListItem): LegacyShoppingListItem {
    return {
      id: domainItem.id,
      quantity: domainItem.quantity.getValue(), // Value object → primitive
      status: domainItem.status.getValue()       // Value object → primitive
    };
  }
}
```

---

## 🧪 **Testing Strategy**

### **Domain Layer Tests**
```typescript
// test/domain/value-objects/Quantity.test.ts
describe('Quantity', () => {
  it('should create valid quantity', () => {
    const quantity = Quantity.create(5);
    expect(quantity.getValue()).toBe(5);
  });

  it('should throw error for invalid quantity', () => {
    expect(() => Quantity.create(-1)).toThrow('Quantity must be positive');
  });

  it('should add quantities correctly', () => {
    const q1 = Quantity.create(3);
    const q2 = Quantity.create(2);
    const result = q1.add(q2);
    expect(result.getValue()).toBe(5);
  });
});
```

### **Application Layer Tests**
```typescript
// test/application/use-cases/UpdateQuantityUseCase.test.ts
describe('UpdateQuantityUseCase', () => {
  it('should update item quantity', async () => {
    const mockRepo = new MockShoppingListRepository();
    const useCase = new UpdateQuantityUseCase(mockRepo);

    await useCase.execute('item-1', 10);

    const item = await mockRepo.findById('item-1');
    expect(item?.quantity.getValue()).toBe(10);
  });
});
```

### **Infrastructure Layer Tests**
```typescript
// test/infrastructure/repositories/MockShoppingListRepository.test.ts
describe('MockShoppingListRepository', () => {
  it('should save and retrieve items', async () => {
    const repo = new MockShoppingListRepository();
    const item = createTestItem();

    await repo.save(item);
    const retrieved = await repo.findById(item.id);

    expect(retrieved).toEqual(item);
  });
});
```

### **Presentation Layer Tests**
```typescript
// test/presentation/hooks/useShoppingList.test.ts
describe('useShoppingList', () => {
  it('should update quantity and refresh data', async () => {
    const { result } = renderHook(() => useShoppingList());

    await act(async () => {
      await result.current.updateItemQuantity('item-1', 5);
    });

    expect(result.current.items.find(i => i.id === 'item-1')?.quantity).toBe(5);
  });
});
```

---

## ✨ **Mejores Prácticas**

### **🟢 DO (Hacer)**

**Domain Layer:**
```typescript
// ✅ Rich domain objects
export class ItemStatus {
  toggle(): ItemStatus { /* business logic */ }
  isExpired(): boolean { /* business rule */ }
}

// ✅ Factory methods
export class Product {
  static createGroceryItem(name: string): Product { /* ... */ }
  static createHouseholdItem(name: string): Product { /* ... */ }
}
```

**Application Layer:**
```typescript
// ✅ Single responsibility use cases
export class AddProductToListUseCase {
  async execute(productId: string, quantity: number): Promise<void> {
    // One clear responsibility
  }
}

// ✅ Transaction coordination
export class CompleteShoppingUseCase {
  async execute(): Promise<void> {
    await this.markAllAsBought();
    await this.updateInventory();
    await this.generateNextShoppingList();
  }
}
```

**Infrastructure Layer:**
```typescript
// ✅ Implement interfaces, don't expose internals
export class LocalStorageRepository implements ShoppingListRepository {
  private readonly STORAGE_KEY = 'shopping-list'; // Private implementation detail

  async findAll(): Promise<ShoppingListItem[]> {
    // Implementation details hidden
  }
}
```

**Presentation Layer:**
```typescript
// ✅ Thin components, use hooks
export function ShoppingList() {
  const { items, updateQuantity } = useShoppingList(); // Delegate to hook
  return <div>{/* Only UI logic here */}</div>;
}
```

### **🔴 DON'T (No Hacer)**

```typescript
// ❌ Mixing concerns
export class ShoppingListComponent {
  updateQuantity(id: string, quantity: number) {
    // ❌ Business logic in UI
    if (quantity <= 0) throw new Error('Invalid quantity');

    // ❌ Direct data access in UI
    localStorage.setItem('items', JSON.stringify(items));

    // ❌ HTTP calls in UI
    fetch('/api/items', { method: 'POST' });
  }
}

// ❌ Anemic domain model
export interface Product {
  id: string;
  name: string;
  // ❌ No behavior, just data
}

// ❌ God objects
export class ShoppingService {
  // ❌ Too many responsibilities
  addProduct() { }
  removeProduct() { }
  updateInventory() { }
  generateReports() { }
  sendEmails() { }
}
```

---

## 🚀 **Próximos Pasos Recomendados**

1. **Añadir Tests Unitarios** para cada capa
2. **Implementar LocalStorageRepository** para persistencia
3. **Crear AddProductUseCase** para nueva funcionalidad
4. **Añadir validaciones más ricas** en Value Objects
5. **Implementar error handling** consistente

---

**¿Tienes dudas sobre cómo implementar algo específico?** Consulta esta guía o pregunta siguiendo los patrones establecidos.