# Change: Improve Page Layout Consistency

## Why

The application currently has inconsistent layout designs between `/catalog` (ProductCatalogPage - "Mi Despensa") and `/shopping-list` (ShoppingListPage), creating a fragmented user experience:

**Current Problems:**
- **ProductCatalogPage** uses `max-w-2xl` (672px), appearing cramped and mobile-like even on desktop
- **ShoppingListPage** uses fluid width (`container mx-auto`), inconsistent with ProductCatalog
- Different header structures: ProductCatalog has separate header bar with border, ShoppingList uses inline header
- Inconsistent spacing patterns and visual hierarchy

**User Impact:**
- Confusing navigation experience - pages feel disconnected
- Poor desktop experience - ProductCatalog wastes 65% of screen width on large displays (1920px)
- Lack of design system coherence

**Target Audience:**
The application is primarily for mobile users, with occasional desktop usage (mainly development mode). Industry standards for such apps (Todoist, Notion mobile, Trello) use responsive containers with optimal max-width constraints.

## What Changes

Establish a unified page layout design system following industry standards for mobile-first applications:

### 1. Standardize Container Width
- Change ProductCatalogPage from `max-w-2xl` (672px) to `max-w-4xl` (896px)
- Add `max-w-4xl` to ShoppingListPage
- Use `container mx-auto px-4` pattern consistently
- **Rationale**: 896px is industry standard "comfortable reading width" - wide enough for desktop, not overwhelming

### 2. Unified Header Pattern
- Remove ProductCatalog's separate sticky header bar (white bg with border)
- Integrate headers into page flow using semantic `<header>` tags
- Consistent spacing: `mb-8` for all page headers
- Keep back button but inline with actions (not in separate bar)

### 3. Consistent Page Structure
Apply to both pages:
```tsx
<div className="min-h-screen bg-gray-50 py-8">
  <div className="container mx-auto px-4 max-w-4xl">
    <header className="mb-8">
      {/* Title + actions */}
    </header>
    <main>
      {/* Content */}
    </main>
  </div>
</div>
```

### 4. Design System: Spacing Standards
Establish consistent spacing tokens:
- `py-8` → Main container vertical padding (32px)
- `mb-8` → Header bottom margin (32px)
- `mb-4` → Section bottom margin (16px)
- `gap-2` → Small inline gaps (8px)
- `gap-4` → Medium component gaps (16px)
- `px-4` → Horizontal padding (16px)

## Impact

### Affected Code
- `src/presentation/pages/ProductCatalogPage.tsx` - Layout restructure
- `src/presentation/pages/ShoppingListPage.tsx` - Add max-width, wrap header
- Test files for both pages

### User-Facing Changes
- **Visual**: Both pages now have consistent width, spacing, and header styling
- **Responsive**: Mobile (full width), Tablet/Desktop (896px centered)
- **No functional changes**: All features, buttons, and interactions remain identical

### Breaking Changes
None. This is a purely presentational improvement with no API, data model, or functionality changes.

### Benefits
- ✅ Consistent user experience across pages
- ✅ Better desktop experience (wider but still comfortable)
- ✅ Follows industry standards for mobile-first apps
- ✅ Establishes foundation for design system
- ✅ Improved maintainability with shared patterns
