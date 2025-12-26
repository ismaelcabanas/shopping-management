# Spec: UI Feedback Components

**Capability**: `ui-feedback`
**Status**: Proposed
**Version**: 1.0.0
**Last Updated**: 2025-12-27

---

## Overview

This specification defines standardized user feedback components for the Shopping Manager application. These components provide consistent, accessible, and reusable patterns for communicating with users through empty states, alerts, badges, loading states, and error handling.

**Purpose**: Replace ad-hoc feedback implementations with a cohesive system that improves user experience, maintainability, and accessibility.

**Scope**: Frontend presentation layer only (React components and hooks).

---

## ADDED Requirements

### Requirement: Empty State Standardization

The system SHALL provide a standardized EmptyState component that displays consistent empty state UI across all features.

The EmptyState component SHALL support the following capabilities:
- Icon display (emoji string or Lucide React icon component)
- Title text (required, clear heading)
- Optional description text (additional context)
- Optional action button with callback
- Three size variants: compact, default, and large
- Customizable styling via className prop

The component SHALL be accessible with:
- Semantic HTML (section element)
- ARIA role="status" attribute
- ARIA live region (aria-live="polite") for dynamic updates
- Keyboard-accessible action button (when provided)

####  Scenario: Empty product catalog
**GIVEN** the user has no products in their inventory
**WHEN** they navigate to the Product Catalog page
**THEN** the system SHALL display an EmptyState component with:
- Package icon (Lucide Package component)
- Title: "No hay productos en tu despensa"
- Description: "Agrega tu primer producto para comenzar a gestionar tu inventario"
- Action button labeled "Agregar Producto" that navigates to Add Product page
- Default size variant

#### Scenario: Empty shopping list with auto-population explanation
**GIVEN** the user has an empty shopping list
**AND** the auto-population feature is enabled
**WHEN** they navigate to the Shopping List page
**THEN** the system SHALL display an EmptyState component with:
- ShoppingBag icon
- Title: "Lista de compras vacía"
- Description explaining automatic addition based on stock levels
- No action button (list populates automatically)
- Default size variant

#### Scenario: Empty dashboard on first use
**GIVEN** a new user with no activity data
**WHEN** they navigate to the Dashboard page
**THEN** the system SHALL display an EmptyState component with:
- LayoutDashboard icon
- Title: "¡Bienvenido a Shopping Manager!"
- Description: "Comienza agregando productos a tu inventario para ver estadísticas aquí"
- Action button labeled "Ir al Catálogo"
- Large size variant for hero-style empty state

#### Scenario: Compact empty state in modal or card
**GIVEN** a feature requires empty state in a constrained space (modal, card, drawer)
**WHEN** rendering the empty state in compact variant
**THEN** the system SHALL display an EmptyState with:
- Smaller padding and margins
- Smaller icon size
- Reduced text size
- Appropriate for sidebars and drawers

---

### Requirement: Persistent Alert Component

The system SHALL provide a persistent Alert component for displaying important information that requires user attention or acknowledgment.

The Alert component SHALL support:
- Four semantic variants: info, success, warning, and error
- Optional title text (bold heading)
- Children content (ReactNode for flexible messaging)
- Optional icon (auto-selected based on variant or custom icon component)
- Closable functionality with X button
- Optional onClose callback
- Full-width or contained layout options

The component SHALL use appropriate ARIA attributes:
- role="alert" for error and warning variants (assertive)
- role="status" for info and success variants (polite)
- aria-live="assertive" or "polite" based on variant
- aria-label for close button

#### Scenario: API key missing warning
**GIVEN** the user attempts to use the ticket scanning feature
**AND** the Gemini API key is not configured
**WHEN** they open the ticket scan modal
**THEN** the system SHALL display a warning Alert component with:
- Variant: warning
- Auto icon: AlertTriangle (Lucide)
- Title: "Clave de API no configurada"
- Content explaining where to configure the API key
- Closable: true
- Full-width: false (contained within modal)

#### Scenario: Network error with retry
**GIVEN** a network request fails due to connectivity issues
**WHEN** the error occurs
**THEN** the system SHALL display an error Alert component with:
- Variant: error
- Auto icon: XCircle (Lucide)
- Title: "Error de conexión"
- Content: "No se pudo conectar al servidor. Por favor, verifica tu conexión a internet e intenta de nuevo."
- Action button labeled "Reintentar" that triggers retry callback
- Closable: true
- Full-width: true (spans page width)

#### Scenario: Success confirmation for important action
**GIVEN** the user completes a critical action (e.g., data export, bulk update)
**WHEN** the action succeeds
**THEN** the system SHALL display a success Alert component with:
- Variant: success
- Auto icon: CheckCircle (Lucide)
- Title: "Operación completada"
- Content describing what was accomplished
- Closable: true
- Auto-dismiss after 5 seconds (optional, configurable)

#### Scenario: Informational offline mode notice
**GIVEN** the PWA service worker detects the app is offline
**WHEN** the user is browsing while offline
**THEN** the system SHALL display an info Alert component with:
- Variant: info
- Auto icon: Info (Lucide)
- Content: "Estás trabajando sin conexión. Los cambios se sincronizarán cuando vuelvas a estar en línea."
- Closable: false (persistent until online)
- Full-width: true (fixed at top of viewport)

---

### Requirement: Reusable Badge Component

The system SHALL provide a Badge component for displaying status indicators, labels, and category tags throughout the application.

The Badge component SHALL support:
- Six color variants: default (gray), primary (blue), success (green), warning (yellow), danger (red), info (light blue)
- Three size variants: sm, md, lg
- Optional icon (ReactNode prepended to text)
- Pill style option (more rounded borders)
- Children content (text or ReactNode)
- Customizable styling via className prop

The component SHALL use:
- Semantic text content (not icon-only)
- aria-label for icon-only badges (if needed)
- Sufficient color contrast (WCAG AA: ≥4.5:1 ratio)
- Visual distinction beyond color (icons, text patterns)

#### Scenario: Stock level badge in shopping list
**GIVEN** a product in the shopping list has low stock
**WHEN** rendering the shopping list item
**THEN** the system SHALL display a Badge component with:
- Variant: warning
- Size: sm
- Text: "Stock bajo"
- No icon
- Default rounded style

**AND WHEN** the product has no stock
**THEN** the Badge SHALL use:
- Variant: danger
- Text: "Sin stock"

#### Scenario: New product indicator
**GIVEN** a product was recently added (within last 24 hours)
**WHEN** displaying the product in the catalog
**THEN** the system SHALL display a Badge component with:
- Variant: primary
- Size: sm
- Text: "Nuevo"
- No icon
- Pill style (rounded-full)

#### Scenario: Category labels with icons
**GIVEN** products have assigned categories
**WHEN** displaying product cards
**THEN** the system SHALL display Badge components with:
- Variant: default (neutral gray)
- Size: md
- Optional category icon prepended to text
- Text: Category name (e.g., "Lácteos", "Verduras")
- Default rounded style

#### Scenario: Notification count badge
**GIVEN** there are pending notifications or updates
**WHEN** displaying a notification indicator
**THEN** the system SHALL display a Badge component with:
- Variant: danger (high visibility)
- Size: sm
- Text: Count number (e.g., "3")
- Pill style
- Positioned absolutely on parent element

---

### Requirement: Flexible Skeleton Loading Component

The system SHALL provide a Skeleton component for displaying loading placeholders while content is being fetched or processed.

The Skeleton component SHALL support:
- Multiple shape variants: text, card, avatar, button, custom
- Configurable width and height (string or number)
- Count parameter to repeat the skeleton N times
- Pulse animation (Tailwind animate-pulse)
- Accessible loading indication

The component SHALL use:
- aria-busy="true" on container
- aria-label="Loading..." for screen readers
- Smooth pulse animation (not aggressive, vestibular-friendly)
- Colors matching application theme (gray-200/gray-300)

#### Scenario: Loading product list
**GIVEN** the user navigates to the Product Catalog page
**AND** products are being fetched from the repository
**WHEN** the loading state is active
**THEN** the system SHALL display 3 Skeleton components with:
- Variant: card
- Height: "120px" (matches ProductListItem height)
- Width: "100%" (full container width)
- Pulse animation enabled
- Vertical spacing (space-y-3) matching actual product list

#### Scenario: Loading shopping list items
**GIVEN** the shopping list is being fetched
**WHEN** the loading state is active
**THEN** the system SHALL display 5 Skeleton components with:
- Variant: card
- Height: "80px"
- Count: 5
- Pulse animation enabled

#### Scenario: Loading text placeholder
**GIVEN** a component needs text loading placeholder
**WHEN** rendering the skeleton
**THEN** the system SHALL display Skeleton components with:
- Variant: text
- Height: "16px" (h-4 in Tailwind)
- Width: random varied widths (e.g., "100%", "80%", "60%") for natural look
- Count: number of expected text lines

#### Scenario: Custom skeleton for complex layout
**GIVEN** a component has a unique loading layout
**WHEN** using custom variant
**THEN** the system SHALL support:
- Custom width and height values
- Ability to compose multiple Skeleton components
- Customizable className for specific shapes (rounded-full for circular, etc.)

---

### Requirement: Error Boundary for React Error Handling

The system SHALL provide an ErrorBoundary component that catches JavaScript errors anywhere in the React component tree and displays a fallback UI.

The ErrorBoundary component SHALL:
- Catch errors during rendering, in lifecycle methods, and in constructors
- Display a fallback UI (ErrorState component or custom fallback)
- Prevent the entire application from crashing (white screen)
- Support error reset mechanism to recover and re-render
- Call an optional onError callback for error logging/reporting
- Preserve error information for debugging in development mode

The ErrorBoundary SHALL NOT catch errors in:
- Event handlers (use try-catch manually)
- Asynchronous code (setTimeout, promises without proper handling)
- Server-side rendering
- Errors thrown in the ErrorBoundary itself

#### Scenario: Component rendering error with recovery
**GIVEN** a component throws an error during rendering
**WHEN** the error occurs within an ErrorBoundary
**THEN** the system SHALL:
- Catch the error without crashing the app
- Display the ErrorState fallback UI
- Show user-friendly message: "Algo salió mal. No te preocupes, puedes intentar de nuevo."
- Provide "Reintentar" button that resets the error boundary
- Log the error to console (development) or error service (production)

**AND WHEN** the user clicks "Reintentar"
**THEN** the system SHALL:
- Reset the error boundary state
- Re-render the component tree
- Hide the error UI if successful
- Show the error UI again if the error persists

#### Scenario: Top-level error boundary in App.tsx
**GIVEN** the application has a top-level ErrorBoundary wrapping all routes
**WHEN** any unhandled error occurs in the component tree
**THEN** the system SHALL:
- Catch the error at the top level
- Display a full-page ErrorState component
- Preserve navigation functionality (allow user to navigate away)
- Allow recovery without full page refresh

#### Scenario: Nested error boundaries for critical sections
**GIVEN** a critical section (e.g., ticket scanning, OCR processing) has its own ErrorBoundary
**WHEN** an error occurs within that section
**THEN** the system SHALL:
- Catch the error in the nested boundary (not top-level)
- Display localized error UI (within the section, not full page)
- Allow the rest of the application to continue functioning
- Preserve context and state outside the error boundary

#### Scenario: Error logging for production debugging
**GIVEN** an error occurs in production
**WHEN** the ErrorBoundary catches the error
**THEN** the system SHALL:
- Call the onError callback with error details
- Log error stack trace (for debugging)
- Include component stack (React error boundary provides this)
- Optionally send to error tracking service (e.g., Sentry, if configured)

---

### Requirement: Accessibility Compliance for All Feedback Components

The system SHALL ensure all feedback components (EmptyState, Alert, Badge, Skeleton, ErrorBoundary/ErrorState) meet WCAG 2.1 Level AA accessibility standards.

All components SHALL:
- Use appropriate ARIA attributes (role, aria-label, aria-live, aria-busy, etc.)
- Ensure keyboard navigation works (Tab, Enter, Escape where applicable)
- Provide sufficient color contrast (≥4.5:1 for normal text, ≥3:1 for large text)
- Not rely on color alone to convey information (use icons, text, patterns)
- Support screen readers (VoiceOver on iOS/macOS, TalkBack on Android, NVDA on Windows)
- Include focus indicators for interactive elements (≥3:1 contrast ratio)
- Use semantic HTML elements (section, button, etc.)

#### Scenario: Screen reader announces empty state
**GIVEN** a blind user navigates to a page with an empty state
**WHEN** the EmptyState component renders
**THEN** the screen reader SHALL:
- Announce the role: "status"
- Read the title text
- Read the description text (if present)
- Announce the action button as "button" with its label (if present)
- Use polite aria-live region (non-intrusive announcement)

#### Scenario: Keyboard-only user interacts with alert
**GIVEN** a keyboard-only user encounters an Alert component
**WHEN** the alert is closable
**THEN** the user SHALL be able to:
- Tab to the close button
- See a visible focus indicator on the close button
- Press Enter or Space to close the alert
- Continue navigating to other interactive elements after closing

#### Scenario: Color contrast verification for badges
**GIVEN** Badge components use various color variants
**WHEN** displaying badges in the UI
**THEN** each variant SHALL meet WCAG AA contrast requirements:
- Default (gray): ≥4.5:1 contrast with background
- Primary (blue): ≥4.5:1 contrast with background
- Success (green): ≥4.5:1 contrast with background
- Warning (yellow): ≥4.5:1 contrast with background (use darker yellow or text color adjustment)
- Danger (red): ≥4.5:1 contrast with background
- Info (light blue): ≥4.5:1 contrast with background

#### Scenario: Error state provides clear keyboard navigation
**GIVEN** an ErrorState component is displayed with a retry button
**WHEN** a keyboard-only user encounters the error
**THEN** the system SHALL:
- Place focus on the retry button automatically (or first focusable element)
- Provide visible focus indicator on the button
- Allow user to press Enter to retry
- Announce error via screen reader (role="alert", aria-live="assertive")
- Provide Escape key to dismiss (if dismissable)

#### Scenario: Skeleton loading respects vestibular motion preferences
**GIVEN** a user has enabled "reduce motion" in their OS accessibility settings
**WHEN** Skeleton components are displayed
**THEN** the system SHALL:
- Detect prefers-reduced-motion media query
- Disable or reduce the pulse animation intensity
- Still indicate loading state visually (static placeholder)
- Announce "Loading" to screen readers (aria-busy, aria-label)

---

## Cross-Cutting Concerns

### Performance

**Bundle Size:**
- All components SHALL contribute <10KB gzipped to the bundle
- No new external dependencies (use existing React, Tailwind, Lucide)
- Tree-shaking enabled (ES modules)

**Runtime Performance:**
- Animations SHALL use CSS transforms (GPU-accelerated, 60fps target)
- No layout thrashing from frequent DOM manipulations
- Skeleton pulse SHALL not cause excessive repaints

### Browser Compatibility

**Supported Browsers:**
- Chrome/Edge 90+ (Chromium-based)
- Firefox 88+
- Safari 14+ (iOS Safari 14+)
- React 18 features (no IE11 support)

**Fallbacks:**
- CSS Grid and Flexbox (widely supported)
- Tailwind CSS utilities (autoprefixer handles vendor prefixes)

### Testing

**Unit Tests (Vitest + React Testing Library):**
- All components SHALL have >90% test coverage
- Test rendering with all variants/props
- Test user interactions (clicks, keyboard)
- Test accessibility (ARIA attributes, roles)
- Test error scenarios (ErrorBoundary)

**E2E Tests (Playwright):**
- Test empty states in real page contexts (ProductCatalogPage, ShoppingListPage)
- Test alert interactions (close, action buttons)
- Test error boundary recovery flows
- Test keyboard navigation end-to-end

**Visual Regression Tests (Manual):**
- Verify components match design tokens (colors, spacing, typography)
- Check responsive behavior (mobile, tablet, desktop)
- Validate animations are smooth (60fps)

### Styling Conventions

**Design Tokens (from tailwind.config.js):**
- Colors: primary, success, warning, danger (with hover variants)
- Shadows: card, card-hover
- Spacing: page, section
- Animations: fade-in, scale-in (if needed)

**Utility-First:**
- Use Tailwind utility classes (no custom CSS files)
- Use `cn()` helper for conditional classnames (from lib/utils.ts)
- Follow existing component patterns (Button, Card, Modal)

---

## Dependencies

**Internal:**
- Button component (for action buttons, retry buttons)
- Lucide React icons (Info, CheckCircle, AlertTriangle, XCircle, Package, ShoppingBag, LayoutDashboard, X)
- Tailwind CSS (design system)
- TypeScript (type safety)

**External:**
- None (no new dependencies)

---

## Acceptance Criteria

### Functional

- ✅ All 6 components implemented (EmptyState, Alert, Badge, Skeleton, ErrorBoundary, ErrorState)
- ✅ All components have TypeScript interfaces
- ✅ ProductList refactored to use EmptyState and Skeleton
- ✅ ShoppingListView refactored to use Badge and EmptyState
- ✅ ErrorBoundary added to App.tsx and critical pages
- ✅ All existing tests pass (590+)
- ✅ All new components have unit tests (>90% coverage)
- ✅ E2E tests pass (empty-states, alerts, error-handling)

### Non-Functional

- ✅ WCAG 2.1 Level AA compliance verified (axe DevTools)
- ✅ Screen reader compatible (VoiceOver, NVDA tested)
- ✅ Keyboard navigation works for all interactive elements
- ✅ Color contrast ≥4.5:1 (text), ≥3:1 (large text, focus indicators)
- ✅ No performance regression (Lighthouse score maintained)
- ✅ Bundle size increase <10KB gzipped
- ✅ Zero TypeScript errors (npm run build)
- ✅ Zero ESLint errors (npm run lint)
- ✅ Documentation complete (JSDoc, CLAUDE.md)

---

## Out of Scope

**Not Covered in This Spec:**
- Form validation components (separate concern)
- Search and filter UI components (future story)
- Data tables or advanced grids
- Modal or dialog enhancements
- Backend error handling or API retry logic
- Toast notification changes (already well-implemented)

---

## Related Specs

**None** - This is a new capability.

**Future Related Specs (Potential):**
- `form-validation` - May use Alert and Badge components
- `search-filters` - May use Badge for filter chips
- `data-visualization` - May use Skeleton for chart loading

---

## References

**Design Patterns:**
- [Material Design: Empty States](https://material.io/design/communication/empty-states.html)
- [iOS Human Interface Guidelines: Alerts](https://developer.apple.com/design/human-interface-guidelines/alerts)
- [WCAG 2.1 Level AA](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.1&levels=aa)

**Existing Code:**
- Button component: `shopping-management-webapp/src/presentation/shared/components/Button.tsx`
- Card component: `shopping-management-webapp/src/presentation/shared/components/Card.tsx`
- Modal component: `shopping-management-webapp/src/presentation/shared/components/Modal.tsx`
- Tailwind config: `shopping-management-webapp/tailwind.config.js`

---

[Back to Change Proposal](../../proposal.md)
