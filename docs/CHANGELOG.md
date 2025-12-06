# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## Sprint 7 - 2025-12-05

### Added
- **[US-011](./userstories/completed/epic-3/US-011-excluir-productos-escaneados.md)**: Excluir productos del escaneo de ticket
  - Feature: Delete button on each scanned product
  - Auto-recalculate total when products are removed
  - No persistence of exclusions (clean slate on each scan)
  - E2E test coverage

### Tests
- 1 new E2E test
- Total: 393+ tests (392 unit + 12 e2e)

---

## Sprint 6 - 2025-12-04

### Added
- **[US-010](./userstories/completed/epic-3/US-010-mejorar-matching-productos.md)**: Mejorar matching de productos con catálogo
  - Feature: Advanced product name normalization
  - Remove accents, handle singulars/plurals, ignore brands/descriptions
  - Hybrid algorithm: token matching (60%) + Levenshtein (40%)
  - Confidence threshold reduced: 80% → 60%

### Improved
- Product matching accuracy significantly improved
- "PLATANO GABECERAS CANARIO" → "Plátanos" ✅
- "TOMATE ROJO RAMA" → "Tomates" ✅
- "KIWI ZESPRI" → "Kiwis" ✅

### Tests
- 6 new unit tests for product matching
- Total: 392 unit tests + 11 e2e tests

---

## Sprint 5 - 2025-11-30

### Added
- **[US-009](./userstories/completed/epic-3/US-009-escanear-ticket-registrar-compra.md)**: Escanear ticket y registrar compra (OCR)
  - Feature: OCR integration with Gemini Vision API
  - Upload ticket image and extract product information
  - 100% precision on ticket text extraction
  - Automatic purchase registration with inventory update

### Tests
- 40+ new tests (unit + integration)
- E2E test for complete OCR flow

---

## Sprint 4 - 2025-11-14

### Added
- **[US-006](./userstories/completed/epic-2/US-006-editar-producto.md)**: Editar información de un producto
  - Feature: Edit product form with validation
  - Update product catalog and inventory
  - 28 unit tests

- **[US-007](./userstories/completed/epic-2/US-007-eliminar-producto.md)**: Eliminar un producto del sistema
  - Feature: Delete product with confirmation modal
  - Remove from catalog and inventory
  - 13 unit tests

- **[US-008](./userstories/completed/epic-2/US-008-registrar-compra-actualizar-inventario.md)**: Registrar compra y actualizar inventario
  - Feature: Purchase registration modal
  - Automatic inventory quantity increase
  - Product selection with search
  - 25+ unit tests

### Milestone
- ✅ CRUD Complete (Create, Read, Update, Delete)
- ✅ Purchase management with auto-inventory update

---

## Sprint 3 - 2025-11-06

### Added
- **[US-005](./userstories/completed/epic-1/US-005-ver-catalogo-productos.md)**: Ver catálogo de productos
  - Feature: Product catalog page with list view
  - 21 unit tests

---

## Sprint 2 - 2025-11-06

### Added
- **[US-003](./userstories/completed/epic-1/US-003-ver-inventario-productos.md)**: Ver inventario de productos
  - Feature: Inventory page displaying product stock
  - 20 unit tests

- **[US-004](./userstories/completed/epic-1/US-004-anadir-producto-inventario.md)**: Añadir producto al inventario
  - Feature: Add product to catalog with inventory creation
  - Form validation and error handling
  - 14 unit tests

---

## Sprint 1 - 2025-11-06

### Added
- **[US-001](./userstories/completed/epic-1/US-001-ver-pagina-bienvenida.md)**: Ver página de bienvenida
  - Feature: Welcome page with project overview
  - 4 unit tests

- **[US-002](./userstories/completed/epic-1/US-002-navegar-entre-secciones.md)**: Navegar entre secciones
  - Feature: Navigation menu with routing
  - 11 unit tests

### Architecture
- Initial setup: React + Vite + Tailwind CSS
- Clean Architecture + DDD structure
- Test infrastructure: Vitest + React Testing Library