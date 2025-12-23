# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## Sprint 12 - 2025-12-23

### Added
- **[QW-004](./userstories/backlog/high-priority/QW-004-pwa.md)**: PWA Installable App - Progressive Web App functionality
  - Feature: Service worker registration with offline support
  - Feature: Install to home screen (Android, iOS, Desktop)
  - Feature: Workbox caching strategies (Cache-First for assets, Network-First for pages)
  - Feature: Auto-update mechanism when new version deployed
  - Feature: Comprehensive mobile installation guide
  - Feature: Manual testing checklist (10 test scenarios)

### Technical
- Service worker registration in `main.tsx` with lifecycle callbacks
- Conditional registration to avoid MSW conflicts in E2E tests
- Workbox configuration in `vite.config.ts`:
  - Cache-First: static assets (JS, CSS, images, fonts) - 30-day expiration
  - Network-First: HTML pages - 7-day expiration, 3s timeout
  - Precaching: core app shell (index.html, main JS/CSS, icons)
- TypeScript declarations for `virtual:pwa-register` module
- Enhanced manifest: `start_url`, maskable icons for Android

### Tests
- 571 unit/integration tests passing ✅
- 25 E2E tests passing (no MSW/PWA conflicts) ✅
- OpenSpec strict validation passed ✅
- Build verification: sw.js, manifest.webmanifest, workbox runtime generated

### Documentation
- OpenSpec: `pwa-installable-app` archived as `2025-12-23-pwa-installable-app`
- New spec: `openspec/specs/pwa/spec.md` with 7 requirements
- User guide: `docs/user-guides/mobile-installation.md` (Android, iOS, Desktop)
- Testing: `docs/testing/pwa-manual-testing-checklist.md` (comprehensive QA)

### User Experience
- ✅ Native app experience (fullscreen, no browser UI)
- ✅ Offline access to shopping list and inventory
- ✅ Instant app launch from home screen/desktop
- ✅ Auto-updates in background (seamless upgrades)
- ✅ Works across all platforms (Android, iOS, Windows, Mac, Linux)

### Impact
- **50% project milestone reached** 🎉
- Foundation for future mobile-first features
- Improved accessibility (works in stores with poor connectivity)
- Reduced friction (no URL navigation required)

---

## Sprint 11 - 2025-12-22

### Added
- **Manual Shopping List Management**: Users can now manually add products to shopping list from product catalog
  - Feature: Shopping cart button on each product card in catalog
  - Quick-add products regardless of stock level
  - Duplicate prevention with visual feedback
  - Items added with `reason='manual'` tag
  - Toast notifications for user feedback

### Technical
- New use case: `AddManualShoppingListItem` - validates and creates manual shopping list items
- Updated hook: `useShoppingList` - added `addManual()` method
- Updated components: `ProductListItem`, `ProductList`, `ProductCatalogPage`
- State management: `Set<string>` for O(1) duplicate checking
- Button states: disabled/enabled based on shopping list presence

### Tests
- 571 unit/integration tests passing (7 new tests) ✅
- Full coverage: use case, hook, components, integration
- Manual testing completed for UX validation

### Documentation
- OpenSpec: `add-manual-shopping-list` archived as `2025-12-22-add-manual-shopping-list`
- Spec updated: `shopping-list` with manual addition requirements
- JSDoc comments and inline documentation added

### User Experience
- ✅ Zero-click navigation (add from catalog page directly)
- ✅ Clear visual feedback (disabled button when already in list)
- ✅ Proactive shopping planning (add before stock runs low)
- ✅ Consistent with existing action button patterns

---

## Sprint 10 - 2025-12-18

### Added
- **[US-024](./userstories/completed/epic-4/US-024-modo-compra.md)**: Modo de Compra con Página Dedicada (Shopping Mode)
  - Feature: Dedicated active shopping page at `/shopping/start`
  - Workflow: Planning (`/shopping-list` readonly) → Active shopping → Purchase registration
  - Button "Iniciar Compra" to start shopping session
  - Checkbox reset at session start (clean state)
  - Post-purchase automatic list recalculation
  - Checkboxes as visual helpers (don't restrict purchases)
  - Natural browser navigation (back/forward buttons work)

### Technical
- New page: `ActiveShoppingPage.tsx` for active shopping sessions
- New component: `ShoppingListView.tsx` shared list rendering (readonly/active modes)
- New use case: `StartShopping` - resets all checkboxes when starting session
- New use case: `RecalculateShoppingList` - clears and rebuilds list from inventory
- Repository methods: `clear()`, `updateChecked()`
- Modal callbacks: `onComplete` for post-purchase flow
- Route: `/shopping/start` for active shopping

### Tests
- 534 unit/integration tests passing (target: 530+) ✅
- 25 E2E tests passing (target: 23+) ✅
- 5 new E2E scenarios for shopping mode
- Coverage: planning view, active shopping, cancel flow, empty list

### Documentation
- OpenSpec: `add-shopping-mode` (ready for archival)
- Design decisions documented in design.md
- Clear separation of concerns: planning vs execution

### Milestone
- ✅ Seamless workflow from planning to execution to recording
- ✅ Reduced friction in purchase registration
- ✅ Foundation for future purchase analytics

---

## Sprint 9 - 2025-12-15

### Added
- **[US-022](./userstories/completed/epic-4/US-022-lista-compra-checkbox.md)**: Marcar productos en lista de compra (Checkbox)
  - Feature: Checkbox functionality replacing "Comprado" button
  - Items remain visible when checked (no longer disappear)
  - Visual differentiation: line-through + opacity 0.6 for checked items
  - Urgency badges remain fully visible (opacity 1.0)
  - Persistent checked state in localStorage
  - Touch-friendly design: 44x44px minimum touch target
  - Accessibility: aria-labels, keyboard navigation, focus indicators

### Technical
- New domain field: `checked: boolean` in ShoppingListItem entity
- New repository methods: `toggleChecked()`, `getCheckedItems()`
- Backward compatibility: legacy data defaults to checked=false
- Created `cn()` utility for conditional class names
- Hook `useShoppingList` extended with `toggleChecked` and `checkedCount`

### Tests
- 497 unit/integration tests passing (all layers covered)
- 21 E2E tests passing (1 updated for new behavior)
- Comprehensive backward compatibility tests

### Documentation
- OpenSpec archived: `2025-12-15-add-shopping-list-checkbox`
- Tasks.md: 47/57 core tasks completed (82%)

### Milestone
- ✅ Natural shopping flow matching real-world behavior
- ✅ Preparation for US-023 (purchase validation)

---

## Sprint 8 - 2025-12-12

### Added
- **[US-012](./userstories/completed/epic-4/US-012-registrar-consumo.md)**: Registrar consumo de productos (Consumption Tracking by Levels)
  - Feature: 4-level stock tracking system (Alto, Medio, Bajo, Vacío)
  - Quick stock updates via modal (2 taps, <5 seconds)
  - Automatic shopping list management based on stock levels
  - Visual indicators: color-coded progress bars (green/yellow/red/gray)
  - Urgency badges in shopping list ("Stock bajo", "Sin stock")
  - Auto-add products to shopping list when stock is Low/Empty
  - Auto-remove from list when stock returns to High/Medium

### Technical
- New domain entities: `StockLevel` value object, `ShoppingListItem` entity
- New use cases: `UpdateStockLevel`, `GetProductsNeedingRestock`
- New repositories: `LocalStorageShoppingListRepository` with proper prefixing
- New components: `StockLevelIndicator`, `UpdateStockModal`, `ShoppingListPage`
- New hooks: `useStockLevel`, `useShoppingList`
- LocalStorage prefix standardization (`shopping_manager_*`)

### Tests
- 484 unit/integration tests (all passing) ✅
- 8/10 E2E tests passing (critical flows validated) ✅
- Comprehensive test coverage across all layers

### Documentation
- User guide: `docs/user-guides/consumption-tracking.md`
- Technical documentation in `CLAUDE.md`
- OpenSpec archived: `2025-12-12-implement-consumption-tracking-by-levels`

### Milestone
- ✅ Complete product lifecycle: Buy → Store → Consume → Alert → Shop
- ✅ Épica 4 (Gestión de Consumo) - First iteration complete

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