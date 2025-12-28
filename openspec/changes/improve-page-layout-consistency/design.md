# Design: Page Layout Consistency

## Context

The Shopping Manager application currently has two main pages with inconsistent layout patterns:
- **ProductCatalogPage** (`/catalog` - "Mi Despensa"): Manages inventory with CRUD operations, OCR scanning, stock tracking
- **ShoppingListPage** (`/shopping-list`): Displays products needing restock, initiates shopping mode

The application targets primarily mobile users with occasional desktop usage (development mode). Current layout inconsistencies create fragmented UX and poor desktop experience.

**Stakeholders:**
- End users (mobile-first consumers managing home inventory)
- Developers (need consistent patterns for maintenance and new features)

## Goals / Non-Goals

### Goals
- ✅ Establish consistent page layout pattern for all main pages
- ✅ Optimize for mobile while improving desktop experience
- ✅ Follow industry standards for mobile-first productivity apps
- ✅ Create foundation for design system (spacing, containers)
- ✅ Zero functional regressions - pure visual improvement

### Non-Goals
- ❌ NOT redesigning component internals (ProductListItem, ShoppingListView)
- ❌ NOT creating full design system (just layout/spacing basics)
- ❌ NOT making responsive grid layouts (keep list views as-is)
- ❌ NOT changing navigation, routing, or any domain logic

## Decisions

### Decision 1: Container Width - `max-w-4xl` (896px)

**Rationale:**
Analyzed industry standards for mobile-first productivity apps:

| App | Desktop Max Width | Pattern |
|-----|------------------|----------|
| Todoist | ~900px | Constrained center column |
| Notion (mobile view) | ~880px | Reading-optimized width |
| Trello (list view) | ~1000px | Comfortable card scanning |
| Google Keep | ~864px | Grid with max-width |

**Why `max-w-4xl` (896px)?**
- Current `max-w-2xl` (672px) too narrow → wastes desktop space
- `max-w-6xl` (1152px) too wide → hard to read on large screens
- `max-w-4xl` (896px) is Goldilocks zone:
  - 33% wider than current (better desktop UX)
  - Still maintains focus and readability
  - Industry standard sweet spot

**Alternatives Considered:**
- `max-w-5xl` (1024px): Slightly wider, but less common in mobile-first apps
- `max-w-3xl` (768px): Too close to current, minimal improvement
- No max-width: Anti-pattern for reading/scanning interfaces

**Decision:** Use `max-w-4xl` (896px) for both pages

### Decision 2: Unified Header Pattern

**Current State:**
- ProductCatalogPage: Separate header bar (white bg, border-bottom, fixed width)
- ShoppingListPage: Inline H1 in content flow

**Rationale for Unified Pattern:**
- Cognitive load: Users shouldn't need to adapt to different header patterns
- Maintenance: Single pattern easier to update and extend to new pages
- Semantic HTML: Proper `<header>` and `<main>` tags improve accessibility

**New Pattern:**
```tsx
<header className="mb-8">
  <div className="flex items-center justify-between mb-4">
    {/* Back button (if applicable) + Action buttons */}
  </div>
  <h1 className="text-3xl font-bold text-gray-800">Page Title</h1>
  <p className="text-gray-600 mt-2">Subtitle / Count</p>
</header>
```

**Benefits:**
- Consistent vertical rhythm (`mb-8` header spacing)
- Actions visible and accessible (not hidden in separate bar)
- Subtitle pattern (product count) works for both pages
- Semantic HTML structure

**Decision:** Remove ProductCatalog's separate header bar, use inline header for both pages

### Decision 3: Spacing System

**Rationale:**
Establish repeatable spacing tokens to prevent ad-hoc values creeping in over time.

**Spacing Scale (Tailwind-based):**
```
px-4  (16px) → Horizontal padding (mobile-friendly touch targets)
py-8  (32px) → Main container vertical padding
mb-8  (32px) → Major section spacing (headers)
mb-4  (16px) → Minor section spacing (sub-sections)
gap-2 (8px)  → Inline element gaps (button groups)
gap-4 (16px) → Component gaps (cards, items)
space-y-3 (12px) → Card list vertical spacing
```

**Decision:** Apply spacing system consistently across both pages

### Decision 4: Keep Floating Action Button (FAB)

**Rationale:**
ProductCatalogPage has FAB (bottom-right) for quick add product on mobile. This is a mobile UX pattern (Material Design) that works well for the primary action.

**Decision:** Keep FAB on ProductCatalog, consider adding to ShoppingList in future if needed

## Risks / Trade-offs

### Risk: Desktop Users Prefer Current ProductCatalog Layout
**Likelihood:** Low
**Impact:** Low
**Mitigation:**
- Current 672px is objectively too narrow for desktop
- 896px is industry standard, validated by major apps
- Easy to adjust if user feedback indicates issues

**Trade-off:** Slightly wider layout requires more horizontal eye movement, but gain is better content visibility

### Risk: Tests Break Due to Layout Changes
**Likelihood:** Medium
**Impact:** Low
**Mitigation:**
- Tests use semantic selectors (data-testid, roles)
- Layout changes don't affect testable behavior
- Update test selectors if needed (minor effort)

### Risk: Future Pages Need Different Layouts
**Likelihood:** Low
**Impact:** Low
**Mitigation:**
- Established pattern works for list/detail views (most of the app)
- Special cases (dashboards, reports) can deviate with justification
- Document pattern in design.md for future reference

## Migration Plan

### Phase 1: Update ProductCatalogPage
1. Remove separate header bar section
2. Change `max-w-2xl` → `max-w-4xl` (3 locations)
3. Add `py-8` to main container
4. Move header content into unified pattern
5. Keep FAB, all modals, all functionality

### Phase 2: Update ShoppingListPage
1. Add `max-w-4xl` to container
2. Wrap H1 in semantic `<header>` tag
3. Add product count subtitle
4. Add `mb-8` spacing after header
5. Wrap content in `<main>` tag

### Phase 3: Validation
1. Visual regression testing (manual - mobile, tablet, desktop)
2. Run unit tests (update selectors if needed)
3. Run E2E tests (verify no functional regressions)
4. Build validation (`npm run build`)

### Rollback Plan
If issues arise:
1. Git revert is clean (pure CSS changes, no logic)
2. No database migrations or API changes to worry about
3. Tests validate no functional breakage

## Open Questions

None. Design is straightforward and well-validated by industry patterns.
