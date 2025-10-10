# CLAUDE.md: Plan de Desarrollo para la App "Shopping Manager" (v7)

Este documento es una guía para construir una aplicación web completa, detallando su arquitectura, metodología y stack tecnológico. El objetivo es crear un sistema robusto, mantenible y alineado con la lógica de negocio a través de un desarrollo guiado por pruebas.

## 1. Descripción del Proyecto (Project Description)

La aplicación "Shopping Manager" es un sistema inteligente de gestión de inventario personal y optimización de compras. El objetivo principal es:

* **Gestión de Inventario Personal:** Llevar un registro del stock de productos que habitualmente compramos, controlando las cantidades disponibles en casa.
* **Generación Automática de Lista de Compras:** El sistema sugiere automáticamente qué productos necesitamos comprar basándose en el stock actual y patrones de consumo.
* **Optimización de Precios:** Predecir y comparar cuánto costaría la cesta de la compra en diferentes **stores**, permitiendo optimizar dónde realizar las compras.
* **Inteligencia de Compras:** Analizar históricos de precios y patrones de consumo para tomar mejores decisiones de compra.

---

## 2. Arquitectura de Software (Software Architecture)

Para asegurar un desarrollo desacoplado, mantenible y centrado en el negocio, la arquitectura seguirá los principios de **Domain-Driven Design (DDD)** y **Arquitectura Limpia (Clean Architecture / Hexagonal Architecture)**.

* **Domain-Driven Design (DDD):** Nos centraremos primero en la lógica de negocio (el "Dominio"). Definiremos un lenguaje común (**Ubiquitous Language**) y modelaremos el software en torno a los conceptos clave del dominio: `Product`, `InventoryItem`, `Store`, `PriceHistory`, `ShoppingList`, y `Purchase`.
* **Arquitectura Limpia / Hexagonal (Clean/Hexagonal Architecture):** Separaremos el código en capas. La lógica de negocio (`Domain` y `Application`) no dependerá de detalles externos como la base de datos, el framework de la API o la interfaz de usuario. Las dependencias siempre apuntarán hacia el interior, protegiendo el núcleo de la aplicación. 🛡️

---

## 3. Metodología de Desarrollo (Development Methodology)

* **Monorepo:** El proyecto se gestionará como un **monorepo**, conteniendo las carpetas `frontend` y `backend` en un único repositorio de código.
* **Test-Driven Development (TDD):** El desarrollo será guiado por pruebas. Para cada nueva funcionalidad, seguiremos el ciclo **Rojo -> Verde -> Refactor**:
    1.  **Rojo:** Escribir una prueba automatizada que falle porque la funcionalidad aún no existe.
    2.  **Verde:** Escribir el código más simple posible para que la prueba pase.
    3.  **Refactor:** Limpiar y mejorar el código manteniendo las pruebas en verde.
* **Construcción Iterativa (Iterative Build):** El desarrollo se construirá de forma **iterativa**. Empezaremos con una funcionalidad mínima y la construiremos de principio a fin, para luego añadir la siguiente de forma incremental.
* **Desarrollo Guiado por Dudas (Question-Driven Development):** Para cada paso, yo, Claude, **formularé las preguntas necesarias para aclarar cualquier duda** antes de proponer el código o la siguiente acción.

---

## 4. Stack Tecnológico (Tech Stack)

* **Frontend (Client-side):** React, Vite, Tailwind CSS, Shadcn/UI.
* **Backend (Server-side):** FastAPI (Python), SQLAlchemy, SQLite.
* **Testing:** **Pytest** para el backend y **Vitest/React Testing Library** para el frontend.

---

## 5. Modelo de Datos del Dominio (Domain Data Model)

1.  **Entidad `Product`:** `id`, `name`, `category`, `usual_consumption_rate`.
2.  **Entidad Agregada `InventoryItem` (Aggregate Root):**
    * `product_id`, `current_stock`, `minimum_stock`, `unit_type` (kg, units, liters, etc.).
3.  **Entidad `Store`:** `id`, `name`, `location`.
4.  **Entidad `PriceHistory`:** `id`, `product_id`, `store_id`, `price`, `date`.
5.  **Entidad Agregada `ShoppingList` (Aggregate Root):**
    * `id`, `created_date`, `status`, `estimated_total`.
    * Una lista de **`ShoppingListItem` (Value Objects):** `product_id`, `quantity_needed`, `estimated_price`.
6.  **Entidad Agregada `Purchase` (Aggregate Root):**
    * `id`, `store_id`, `date`, `total_price`.
    * Una lista de **`PurchaseItem` (Value Objects):** `product_id`, `quantity`, `unit_price`.

---

## 6. Estructura del Proyecto (Project Structure)

La estructura incluirá directorios específicos para las pruebas (`tests`).

shopping-manager/  (Monorepo Root)
|
├── frontend/
|   ├── src/
|   |   ├── domain/
|   |   ├── application/
|   |   ├── infrastructure/
|   |   └── presentation/
|   └── tests/              # Pruebas del frontend
|
├── backend/
|   ├── app/
|   |   ├── domain/
|   |   ├── application/
|   |   └── infrastructure/
|   ├── tests/              # Pruebas del backend (unitarias, integración)
|   ├── venv/
|   └── requirements.txt
|
└── ...

---

## 7. Convenciones de Git y Commits (Git Conventions)

Para mantener un historial de commits claro y profesional, seguiremos las **Conventional Commits** con el siguiente formato:

### **Formato de Commit Messages**

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### **Tipos de Commits (Types)**

* **feat**: Nueva funcionalidad para el usuario
* **fix**: Corrección de bugs
* **docs**: Cambios en documentación
* **style**: Cambios de formato (espacios, comas, etc.) sin afectar la lógica
* **refactor**: Refactoring de código sin añadir funcionalidades ni corregir bugs
* **test**: Añadir o modificar tests
* **chore**: Cambios en el build, configuración, dependencias, etc.

### **Scopes Sugeridos**

* **frontend**: Cambios específicos del frontend
* **backend**: Cambios específicos del backend
* **ui**: Cambios relacionados con interfaz de usuario
* **api**: Cambios en endpoints o API
* **config**: Cambios de configuración (Vite, Tailwind, etc.)
* **docs**: Documentación del proyecto

### **Ejemplos de Commits**

```bash
# Funcionalidad nueva
feat(frontend): add product quantity inline editing
feat(ui): implement shopping list item component
feat(api): add product CRUD endpoints

# Corrección de bugs
fix(frontend): resolve TypeScript import type errors
fix(ui): correct responsive layout on mobile devices

# Documentación
docs: update README with installation instructions
docs(setup): add Tailwind configuration troubleshooting

# Configuración
chore(config): update Tailwind CSS to v3.4.0
chore(deps): upgrade React to v18.3.0

# Tests
test(frontend): add unit tests for ShoppingList component
test(api): add integration tests for product endpoints
```

### **Footer Conventions**

Para commits generados con asistencia de Claude:

```
🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### **Reglas de Commit**

1. **Usar presente**: "add feature" no "added feature"
2. **Máximo 50 caracteres** en la primera línea
3. **Descripción clara** del cambio realizado
4. **Body opcional** para explicar el "por qué" del cambio
5. **Referenciar issues** cuando aplique: `Closes #123`

### **Breaking Changes**

Para cambios que rompen compatibilidad:

```bash
feat(api)!: change product endpoint response format

BREAKING CHANGE: Product API now returns snake_case instead of camelCase
```


