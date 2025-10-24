# Plan: Feature "Catálogo de Productos" - Iteración 1

**Fecha:** 2025-10-22
**Iteración:** 1
**Objetivo:** Permitir al usuario añadir productos simples (basados en unidades) a su despensa y ver el catálogo de productos disponibles, siguiendo arquitectura DDD y metodología TDD con enfoque mobile-first.

---

## 🎯 Alcance de la Iteración 1

### ✅ Incluido
- Añadir producto nuevo con: `id (uuid)`, `name`, `unitType` (solo "units")
- Añadir cantidad inicial al inventario al crear producto
- Ver lista de productos del catálogo con su cantidad actual
- Persistencia con localStorage (sin backend)
- UI mobile-first (formularios optimizados, botones 44px+)
- Unidades soportadas: **SOLO `units`** (unidades genéricas)

### ❌ Excluido (futuras iteraciones)
- Editar/Eliminar productos
- Categorías
- Otros tipos de unidades (liters, packages, kg, etc.)
- Imágenes de productos
- Backend/API
- Sincronización avanzada
- Lectura de ticket de compra

---

## 🏗️ Arquitectura (Clean Architecture + DDD)

Seguiremos la estructura del proyecto ya definida:

```
src/
├── domain/
│   ├── entities/
│   │   ├── Product.ts           # Entidad Product
│   │   └── InventoryItem.ts     # Agregado InventoryItem
│   ├── value-objects/
│   │   ├── ProductId.ts         # UUID del producto
│   │   ├── UnitType.ts          # Solo "units" por ahora
│   │   └── Quantity.ts          # Value Object para cantidad
│   └── repositories/
│       ├── ProductRepository.ts      # Interface
│       └── InventoryRepository.ts    # Interface
│
├── application/
│   └── use-cases/
│       ├── AddProductToInventory.ts  # Caso de uso principal
│       └── GetAllProducts.ts         # Caso de uso listado
│
├── infrastructure/
│   ├── repositories/
│   │   ├── LocalStorageProductRepository.ts
│   │   └── LocalStorageInventoryRepository.ts
│   └── storage/
│       └── LocalStorageClient.ts     # Wrapper de localStorage
│
└── presentation/
    ├── pages/
    │   ├── ProductCatalog.tsx        # Lista de productos
    │   └── AddProduct.tsx            # Formulario añadir
    └── components/
        ├── ProductList.tsx           # Componente lista
        ├── ProductListItem.tsx       # Item individual
        └── ProductForm.tsx           # Formulario reutilizable
```

---

## 📋 Modelo de Datos

### Product (Entidad)
```typescript
{
  id: ProductId (uuid)
  name: string
  unitType: UnitType ("units")
}
```

### InventoryItem (Agregado)
```typescript
{
  productId: ProductId
  currentStock: Quantity (number)
  unitType: UnitType ("units")
}
```

---

## 🔴 Fase 1: Domain Layer (TDD - Empezar aquí)

### 1.1 Crear Value Objects

**Tests primero:**
- `ProductId.test.ts`: Validar formato UUID
- `UnitType.test.ts`: Validar solo permite "units"
- `Quantity.test.ts`: Validar cantidad >= 0

**Implementación:**
```typescript
// domain/value-objects/ProductId.ts
// domain/value-objects/UnitType.ts (solo "units")
// domain/value-objects/Quantity.ts
```

### 1.2 Crear Entidades

**Tests primero:**
- `Product.test.ts`: Crear producto válido, validaciones
- `InventoryItem.test.ts`: Crear item, actualizar stock

**Implementación:**
```typescript
// domain/entities/Product.ts
// domain/entities/InventoryItem.ts
```

### 1.3 Definir Interfaces de Repositorios

**Sin tests (solo interfaces):**
```typescript
// domain/repositories/ProductRepository.ts
interface ProductRepository {
  save(product: Product): Promise<void>
  findAll(): Promise<Product[]>
  findById(id: ProductId): Promise<Product | null>
}

// domain/repositories/InventoryRepository.ts
interface InventoryRepository {
  save(item: InventoryItem): Promise<void>
  findByProductId(productId: ProductId): Promise<InventoryItem | null>
  findAll(): Promise<InventoryItem[]>
}
```

---

## 🟡 Fase 2: Application Layer (Use Cases con TDD)

### 2.1 Caso de Uso: AddProductToInventory

**Test primero:**
- `AddProductToInventory.test.ts`
  - ✅ Dado un producto nuevo, lo guarda en repositorio de productos
  - ✅ Dado un producto nuevo, crea item en inventario con cantidad inicial
  - ✅ Dado un producto duplicado (mismo nombre), lanza error
  - ✅ Dado una cantidad inicial 0, lo permite (inventario vacío)

**Implementación:**
```typescript
// application/use-cases/AddProductToInventory.ts
class AddProductToInventory {
  constructor(
    private productRepo: ProductRepository,
    private inventoryRepo: InventoryRepository
  ) {}

  async execute(input: {
    name: string
    initialQuantity: number
  }): Promise<Product> {
    // 1. Validar que no exista producto con mismo nombre
    // 2. Crear Product (unitType siempre "units")
    // 3. Guardar Product
    // 4. Crear InventoryItem
    // 5. Guardar InventoryItem
    // 6. Retornar Product
  }
}
```

### 2.2 Caso de Uso: GetAllProducts

**Test primero:**
- `GetAllProducts.test.ts`
  - ✅ Retorna lista vacía si no hay productos
  - ✅ Retorna lista de productos ordenados por nombre
  - ✅ Incluye información de inventario (cantidad actual)

**Implementación:**
```typescript
// application/use-cases/GetAllProducts.ts
class GetAllProducts {
  constructor(
    private productRepo: ProductRepository,
    private inventoryRepo: InventoryRepository
  ) {}

  async execute(): Promise<ProductWithInventory[]> {
    // 1. Obtener todos los productos
    // 2. Obtener inventario de cada producto
    // 3. Combinar información
    // 4. Ordenar por nombre
    // 5. Retornar
  }
}
```

---

## 🟠 Fase 3: Infrastructure Layer

### 3.1 LocalStorage Client (helper)

**Test primero:**
- `LocalStorageClient.test.ts`
  - ✅ Puede guardar y recuperar objetos JSON
  - ✅ Retorna null si la clave no existe
  - ✅ Puede limpiar storage

**Implementación:**
```typescript
// infrastructure/storage/LocalStorageClient.ts
class LocalStorageClient {
  get<T>(key: string): T | null
  set<T>(key: string, value: T): void
  remove(key: string): void
  clear(): void
}
```

### 3.2 Implementar Repositorios

**Tests primero:**
- `LocalStorageProductRepository.test.ts`
  - ✅ Guarda y recupera productos
  - ✅ findAll retorna todos los productos
  - ✅ findById retorna producto por id

- `LocalStorageInventoryRepository.test.ts`
  - ✅ Guarda y recupera items de inventario
  - ✅ findByProductId retorna item por productId
  - ✅ findAll retorna todos los items

**Implementación:**
```typescript
// infrastructure/repositories/LocalStorageProductRepository.ts
// Clave: "shopping_manager_products"

// infrastructure/repositories/LocalStorageInventoryRepository.ts
// Clave: "shopping_manager_inventory"
```

---

## 🟢 Fase 4: Presentation Layer (Mobile-First)

### 4.1 Componente ProductForm (con TDD)

**Tests primero:**
- `ProductForm.test.tsx`
  - ✅ Renderiza campos: name, quantity
  - ✅ Valida nombre requerido (min 2 caracteres)
  - ✅ Valida cantidad >= 0
  - ✅ Llama a onSubmit con datos correctos
  - ✅ Muestra errores de validación

**Implementación mobile-first:**
```typescript
// presentation/components/ProductForm.tsx
- Input text para nombre (font-size >= 16px)
- Input number para cantidad (inputmode="numeric")
- Botón submit (min 44x44px, touch-friendly)
- Mensajes de error claros
- Estado de loading
```

**Implementar Fase 3.3 del plan PWA:**
- Inputs con tipos correctos
- `inputmode="numeric"` para cantidad
- Botones mínimo 44px altura
- Font-size >= 16px para prevenir zoom en iOS

### 4.2 Página AddProduct

**Tests (opcional, más integración):**
- `AddProduct.test.tsx`
  - ✅ Renderiza formulario
  - ✅ Al submit exitoso, navega a catálogo
  - ✅ Muestra error si producto duplicado

**Implementación:**
```typescript
// presentation/pages/AddProduct.tsx
- Header con título "Añadir Producto"
- Botón "Volver" al catálogo
- ProductForm
- Integra con use case AddProductToInventory
- Manejo de loading state
- Manejo de errores (toast o mensaje)
- Navegación tras éxito
```

### 4.3 Componente ProductListItem

**Tests primero:**
- `ProductListItem.test.tsx`
  - ✅ Muestra nombre del producto
  - ✅ Muestra cantidad actual con unidad
  - ✅ Es touch-friendly (altura mínima)

**Implementación:**
```typescript
// presentation/components/ProductListItem.tsx
- Card/Item de lista
- Muestra: nombre, cantidad + "ud"
- Altura mínima 60px (touch-friendly)
- Padding generoso
```

### 4.4 Componente ProductList

**Tests primero:**
- `ProductList.test.tsx`
  - ✅ Muestra mensaje "No hay productos" si lista vacía
  - ✅ Renderiza lista de productos
  - ✅ Muestra skeleton loader mientras carga

**Implementación:**
```typescript
// presentation/components/ProductList.tsx
- Lista responsive
- ProductListItem por cada producto
- Estado vacío con ilustración/mensaje
- Skeleton loader
```

**Implementar Fase 3.5 del plan PWA:**
- Skeleton loader mientras carga
- Estado vacío amigable con call-to-action

### 4.5 Página ProductCatalog

**Tests:**
- `ProductCatalog.test.tsx`
  - ✅ Muestra ProductList
  - ✅ Tiene botón para añadir producto
  - ✅ Integra con use case GetAllProducts

**Implementación:**
```typescript
// presentation/pages/ProductCatalog.tsx
- Header con título "Mi Despensa"
- ProductList
- Botón flotante (FAB) para añadir producto (min 56x56px)
- Integra con use case GetAllProducts
- Loading state con skeleton
- Navegación a AddProduct
```

### 4.6 Routing

```typescript
// Añadir rutas en router principal
<Route path="/catalog" element={<ProductCatalog />} />
<Route path="/catalog/add" element={<AddProduct />} />
```

---

## 🎨 Fase 5: Styling Mobile-First (Tailwind)

### 5.1 Tokens y Utilities Mobile

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      // Touch targets mínimos
      minHeight: {
        'touch': '44px',
        'touch-lg': '56px',
      },
      minWidth: {
        'touch': '44px',
      },
      // Espaciado mobile-friendly
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      }
    }
  }
}
```

### 5.2 Componentes con Estilos Mobile-First

- Botones principales: `min-h-touch` (44px)
- FAB: `min-h-touch-lg min-w-touch-lg` (56x56px)
- Inputs: `text-base` (16px) para prevenir zoom
- Listas: padding generoso para touch (py-4)
- Formularios: espaciado vertical amplio (space-y-6)

---

## ✅ Checklist de Implementación (Orden TDD)

### Dominio (Domain Layer)
- [ ] Test + Implementar `ProductId` value object
- [ ] Test + Implementar `UnitType` value object (solo "units")
- [ ] Test + Implementar `Quantity` value object
- [ ] Test + Implementar entidad `Product`
- [ ] Test + Implementar entidad `InventoryItem`
- [ ] Definir interfaces `ProductRepository` e `InventoryRepository`

### Aplicación (Application Layer)
- [ ] Test + Implementar use case `AddProductToInventory`
- [ ] Test + Implementar use case `GetAllProducts`

### Infraestructura (Infrastructure Layer)
- [ ] Test + Implementar `LocalStorageClient`
- [ ] Test + Implementar `LocalStorageProductRepository`
- [ ] Test + Implementar `LocalStorageInventoryRepository`

### Presentación (Presentation Layer)
- [ ] Test + Implementar componente `ProductForm`
- [ ] Implementar página `AddProduct`
- [ ] Test + Implementar componente `ProductListItem`
- [ ] Test + Implementar componente `ProductList`
- [ ] Implementar página `ProductCatalog`
- [ ] Configurar routing

### Mobile-First & Styling
- [ ] Configurar utilities mobile en Tailwind
- [ ] Aplicar estilos mobile-first a formularios
- [ ] Aplicar estilos touch-friendly a botones (44px+)
- [ ] Añadir skeleton loaders
- [ ] Estado vacío con mensaje amigable
- [ ] Probar en viewport móvil (Chrome DevTools 375px)

### Testing Final
- [ ] Ejecutar todos los tests unitarios (`npm run test:unit`)
- [ ] Test manual en mobile (Chrome DevTools responsive)
- [ ] Verificar que localStorage persiste datos
- [ ] Verificar formularios no causan zoom (font-size >= 16px)
- [ ] Verificar todos los botones son touch-friendly (44px+)

---

## 🚀 Orden de Ejecución Recomendado

**Seguir estrictamente este orden para TDD:**

### Día 1: Domain Layer completo (1-2 horas)
1. ProductId value object (test + código)
2. UnitType value object (test + código)
3. Quantity value object (test + código)
4. Product entity (test + código)
5. InventoryItem entity (test + código)
6. Repository interfaces (sin tests)

### Día 2: Application Layer (1-2 horas)
1. AddProductToInventory use case (test + código)
2. GetAllProducts use case (test + código)

### Día 3: Infrastructure (1-2 horas)
1. LocalStorageClient (test + código)
2. LocalStorageProductRepository (test + código)
3. LocalStorageInventoryRepository (test + código)

### Día 4: Presentation - Formulario (2-3 horas)
1. ProductForm component (test + código)
2. AddProduct page (código + integración)
3. Estilos mobile-first

### Día 5: Presentation - Lista (2-3 horas)
1. ProductListItem component (test + código)
2. ProductList component (test + código)
3. ProductCatalog page (código + integración)
4. Routing

### Día 6: Polish Mobile-First (1-2 horas)
1. Skeleton loaders
2. Estado vacío
3. Ajustes finales de estilos
4. Testing en mobile (Chrome DevTools)
5. Testing manual completo

---

## 📝 Notas Importantes

1. **TDD estricto**: Rojo → Verde → Refactor en cada paso
2. **Mobile-first**: Diseñar primero para móvil (375px width), luego desktop
3. **Simplicidad**: Esta es iteración 1, mantener scope reducido
4. **localStorage**: Los datos se pierden si se borra caché del navegador
5. **Sin backend**: Todos los datos son locales por ahora
6. **Solo "units"**: No implementar otros tipos de unidades aún
7. **No editar/eliminar**: Fuera del scope de esta iteración

---

## 🎯 Criterios de Aceptación

Al finalizar esta iteración, el usuario debe poder:

✅ **Ver catálogo vacío** - Abrir la app y ver mensaje "No hay productos aún"
✅ **Añadir producto** - Pulsar FAB → Formulario → Guardar
✅ **Rellenar formulario** - Nombre del producto + cantidad inicial en unidades
✅ **Ver producto en lista** - Producto aparece en el catálogo con su cantidad
✅ **Persistencia** - Cerrar y abrir la app, los productos persisten
✅ **Mobile-friendly** - Todo funciona perfectamente en móvil (375px width)
✅ **Touch-friendly** - Todos los botones son fáciles de pulsar (44px+)
✅ **No zoom involuntario** - Inputs no causan zoom en iOS (font-size >= 16px)

---

## 🔗 Documentos Relacionados

- **Gherkin Specs:** `docs/iteration-1-product-catalog.feature`
- **Mockup UI:** `design/mockups/iteration-1-product-catalog.md`
- **Plan PWA Mobile-First:** `docs/mobile-first-implementation-plan.md`
- **Instrucciones del Proyecto:** `CLAUDE.md`

---

**Última actualización:** 2025-10-22