# Architecture Rules

## Domain-Driven Design & Clean Architecture

This project follows **Domain-Driven Design (DDD)** principles and **Clean Architecture** (also known as Hexagonal Architecture).

## Core Architecture Principles

1. **Dependency Rule**: Dependencies must point inward. Domain layer has no dependencies. Application layer depends only on Domain. Infrastructure and Presentation depend on Application and Domain.

2. **Domain Independence**: The Domain layer must not depend on any framework, library, or external concern. It contains only pure TypeScript/JavaScript.

3. **Application Independence**: The Application layer (use cases) should not depend on UI frameworks or data persistence details.

4. **Interface Segregation**: Define interfaces (ports) in the Domain/Application layers. Implementations (adapters) live in Infrastructure/Presentation layers.

## Layer Responsibilities

### Domain Layer (`src/domain/`)
- **Entities**: Core business objects (Product, InventoryItem, Store, etc.)
- **Value Objects**: Immutable objects defined by their values (ProductId, Money, Quantity)
- **Aggregates**: Clusters of entities with a root (ShoppingList, Purchase)
- **Domain Services**: Business logic that doesn't belong to a single entity
- **Repository Interfaces**: Contracts for data persistence (defined here, implemented in Infrastructure)
- **Domain Events**: Important state changes in the domain

**Rules:**
- No imports from Application, Infrastructure, or Presentation
- No framework dependencies
- Pure TypeScript/JavaScript
- All business rules live here

### Application Layer (`src/application/`)
- **Use Cases**: Application-specific business logic (AddProductToInventory, GenerateShoppingList)
- **DTOs**: Data Transfer Objects for input/output
- **Service Interfaces**: Contracts for external services

**Rules:**
- Can import from Domain layer only
- No imports from Infrastructure or Presentation
- No framework-specific code (React, FastAPI, etc.)
- Orchestrates domain objects to fulfill use cases

### Infrastructure Layer (`src/infrastructure/`)
- **Repository Implementations**: Concrete implementations of domain repository interfaces
- **API Clients**: External service integrations
- **Persistence**: Database/storage implementations (LocalStorage, IndexedDB, etc.)
- **Configuration**: App configuration and environment variables

**Rules:**
- Can import from Domain and Application layers
- Contains all framework and library-specific code for data access
- Implements interfaces defined in Domain/Application

### Presentation Layer (`src/presentation/`)
- **Components**: React components (pages, UI components, modals, etc.)
- **Hooks**: React hooks for state management and side effects
- **View Models**: Data structures optimized for UI rendering
- **Routing**: Application routing configuration

**Rules:**
- Can import from Domain, Application, and Infrastructure layers
- Contains all UI framework-specific code (React)
- Handles user interaction and presentation logic
- Uses Application layer use cases to perform operations

## Dependency Flow

```
Presentation  ──→  Application  ──→  Domain
    ↓                                  ↑
Infrastructure  ───────────────────────┘
```

## Example Structure

```
src/
├── domain/
│   ├── model/
│   │   ├── Product.ts
│   │   ├── ProductId.ts
│   │   └── InventoryItem.ts
│   ├── repository/
│   │   └── ProductRepository.ts  (interface)
│   └── services/
│       └── StockCalculator.ts
├── application/
│   └── use-cases/
│       ├── AddProductToInventory.ts
│       └── GetProductsByCategory.ts
├── infrastructure/
│   └── repositories/
│       └── LocalStorageProductRepository.ts  (implements ProductRepository)
└── presentation/
    ├── components/
    │   └── ProductList.tsx
    ├── hooks/
    │   └── useInventory.ts
    └── pages/
        └── InventoryPage.tsx
```

## Key Patterns

### Repository Pattern
- Define interface in Domain: `ProductRepository`
- Implement in Infrastructure: `LocalStorageProductRepository`
- Inject into Use Cases via constructor/dependency injection

### Use Case Pattern
- Each use case represents one application operation
- Single responsibility: one public method
- Clear input/output DTOs
- Example: `AddProductToInventory.execute(product)`

### Dependency Injection
- Use constructor injection for dependencies
- Inject repository implementations into use cases
- Inject use cases into React hooks/components

## Anti-Patterns to Avoid

❌ **Don't:**
- Import React in Domain or Application layers
- Import repository implementations directly in components
- Put business logic in components or hooks
- Create circular dependencies between layers
- Skip defining interfaces in Domain/Application

✅ **Do:**
- Keep Domain layer pure and framework-agnostic
- Define interfaces where dependencies are needed
- Implement interfaces in outer layers
- Inject dependencies from outside
- Keep business logic in Domain and Application layers

## Testing Strategy by Layer

- **Domain**: Pure unit tests, no mocks needed
- **Application**: Unit tests with mocked repositories
- **Infrastructure**: Integration tests with real/mock storage
- **Presentation**: Component tests with mocked hooks/use cases

## When to Question the Architecture

If you find yourself:
- Importing React into Application layer → Stop, refactor
- Importing a repository implementation into a component → Use dependency injection
- Adding business logic to a component → Move to Use Case or Domain Service
- Creating circular dependencies → Rethink the design

Always ask before violating the dependency rule.