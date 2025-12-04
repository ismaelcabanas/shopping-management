<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# CLAUDE.md: Plan de Desarrollo para la App "Shopping Manager" (v7)

Este documento es una guía para construir una aplicación web completa, detallando su arquitectura, metodología y stack tecnológico. El objetivo es crear un sistema robusto, mantenible y alineado con la lógica de negocio a través de un desarrollo guiado por pruebas.

---

## 0. AI Development Rules (for all AI Agents)

**IMPORTANTE:** Antes de comenzar cualquier tarea, todos los agentes de IA (Claude, Cursor, GitHub Copilot, etc.) deben leer y seguir las reglas de desarrollo ubicadas en `.agents/rules/`:

- **`.agents/rules/base.md`** - Reglas generales de desarrollo: TDD, baby steps, calidad de código, estándares
- **`.agents/rules/testing.md`** - Reglas específicas de testing: Vitest, React Testing Library, cobertura
- **`.agents/rules/architecture.md`** - Reglas de arquitectura: DDD, Clean Architecture, estructura de capas
- **`.agents/rules/git-workflow.md`** - Workflow de Git: branching, commits, pull requests
- **`.agents/rules/feedback-learning-loop.md`** - Sistema de feedback y mejora continua de las reglas

Estas reglas son **obligatorias** y sobrescriben cualquier comportamiento por defecto. El contenido específico de este documento (CLAUDE.md) complementa las reglas generales.

### Sistema de Mejora Continua

El sistema de reglas está diseñado para evolucionar con el tiempo. Los agentes de IA deben:
1. **Aprender activamente** de cada interacción con el usuario
2. **Proponer mejoras** a las reglas cuando identifiquen oportunidades de refinamiento
3. **Esperar aprobación explícita** antes de modificar cualquier regla
4. Ver `.agents/rules/feedback-learning-loop.md` para el proceso completo

---

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


