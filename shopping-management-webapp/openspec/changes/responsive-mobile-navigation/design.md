# Design: Responsive Mobile Navigation

**Change ID**: `responsive-mobile-navigation`
**Status**: Draft
**Last Updated**: 2025-12-26

## Architecture Overview

This change implements responsive navigation patterns using **mobile-first responsive design** principles while maintaining Clean Architecture and DDD patterns.

### Design Principles
1. **Progressive Enhancement**: Desktop experience unchanged, mobile gets enhanced UX
2. **Mobile-First**: Design for smallest screens, enhance for larger viewports
3. **Accessibility-First**: Keyboard navigation and screen readers prioritized
4. **Performance**: Minimal JavaScript, leverage CSS transforms for animations
5. **Maintainability**: Single Navigation component handles both mobile and desktop states

## Component Architecture

### High-Level Structure

```
Navigation (Presentation Layer)
├── Desktop View (≥ 768px)
│   ├── Full Brand Text + Icon
│   ├── Horizontal Nav Links (current behavior)
│   └── No state management needed
│
└── Mobile View (< 768px)
    ├── Hamburger Button (collapsed state)
    ├── Brand Icon Only
    └── Mobile Menu Drawer (expanded state)
        ├── Menu State (useState)
        ├── Focus Trap (keyboard nav)
        └── Backdrop Overlay
```

### Component Responsibility Matrix

| Component | Responsibility | Layer | State |
|-----------|---------------|-------|-------|
| `Navigation.tsx` | Main nav container, responsive orchestration | Presentation | Mobile menu open/closed |
| `MobileMenuButton` | Hamburger icon button (inline or separate) | Presentation | None |
| `MobileMenuDrawer` | Slide-in menu overlay (inline or separate) | Presentation | None (controlled by Navigation) |
| `NavLink` | Navigation link item (reusable for both modes) | Presentation | Active route state (from router) |

### Decision: Single Component vs. Separate Components

**Approach**: Keep Navigation as single component with inline mobile menu state

**Rationale**:
- **Simplicity**: Only 4 navigation links, no complex sub-menus
- **Cohesion**: Desktop and mobile share same navigation logic (routes, active state)
- **Performance**: No additional component mounting overhead
- **Maintainability**: Single file to update when routes change

**Trade-off**: Component will be ~150-200 lines (acceptable, within limit of 200 lines)

## State Management Design

### Mobile Menu State

```typescript
// In Navigation.tsx
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev)
const closeMobileMenu = () => setIsMobileMenuOpen(false)
```

**State Scope**: Local component state (useState)
- **Rationale**: Menu state is ephemeral, doesn't need persistence or cross-component sharing
- **Alternative Rejected**: Zustand store (over-engineering for simple boolean state)

### Route State

Existing `useLocation()` hook from React Router - no changes needed.

### Body Scroll Lock (Mobile Menu Open)

When mobile menu is open, prevent body scrolling:

```typescript
useEffect(() => {
  if (isMobileMenuOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'unset'
  }
  return () => {
    document.body.style.overflow = 'unset'
  }
}, [isMobileMenuOpen])
```

## Responsive Breakpoints

Using Tailwind's default `md:` breakpoint (768px):

| Viewport | Breakpoint | Layout |
|----------|------------|--------|
| Mobile | < 768px | Hamburger menu + icon-only brand |
| Tablet/Desktop | ≥ 768px | Horizontal navigation (current) |

**Rationale for 768px**:
- Matches Tailwind's `md:` breakpoint (consistency)
- Aligns with iPad portrait (768px width)
- Sufficient space for horizontal nav on tablets

## Mobile Menu Design

### Visual Design

**Slide-In Drawer from Left**:
```
┌─────────────────────┐
│ [X]  Shopping Mgr   │ ← Header (fixed)
├─────────────────────┤
│                     │
│  🏠 Inicio          │ ← Touch-friendly (56px)
│                     │
│  📦 Mi Despensa     │
│                     │
│  🛒 Lista Compras   │
│                     │
│  📊 Dashboard       │
│                     │
│                     │
│     (backdrop)      │
└─────────────────────┘
   ←80% width→
```

**Specifications**:
- **Width**: 80% of viewport (max 320px on large phones)
- **Height**: Full viewport height (100vh)
- **Position**: Fixed, left: 0, top: 0, z-index: 50
- **Background**: White (#ffffff)
- **Shadow**: Large shadow (shadow-2xl) for depth
- **Animation**: Slide-in from left (transform: translateX)
- **Duration**: 250ms (medium speed)
- **Easing**: `ease-in-out` (smooth start and end)

### Backdrop Overlay

```
┌─────────────────────────┐
│ [Drawer]  │  [Backdrop] │
│           │             │
│  Menu     │  Semi-trans │ ← Click to close
│  Items    │  Black      │
│           │  (40% opacity)
│           │             │
└─────────────────────────┘
```

**Specifications**:
- **Position**: Fixed, covers entire viewport
- **Z-Index**: 40 (below drawer which is 50)
- **Background**: `bg-black bg-opacity-40`
- **Click Behavior**: Closes menu when clicked

## Accessibility Design

### Keyboard Navigation

| Key | Action |
|-----|--------|
| **Tab** | Navigate through menu items (forward) |
| **Shift+Tab** | Navigate through menu items (backward) |
| **Enter/Space** | Activate link or toggle menu |
| **Escape** | Close mobile menu (if open) |

### Focus Management

**Focus Trap Pattern**:
1. When menu opens: Focus moves to first menu item (or close button)
2. Tab cycles within menu only (doesn't escape to page content)
3. When menu closes: Focus returns to hamburger button

**Implementation**: Use `useEffect` to manage focus:
```typescript
useEffect(() => {
  if (isMobileMenuOpen) {
    // Find first focusable element in menu
    const firstFocusable = menuRef.current?.querySelector('a, button')
    firstFocusable?.focus()
  }
}, [isMobileMenuOpen])
```

### ARIA Attributes

```tsx
{/* Hamburger Button */}
<button
  aria-label="Abrir menú de navegación"
  aria-expanded={isMobileMenuOpen}
  aria-controls="mobile-menu"
  onClick={toggleMobileMenu}
>
  {/* Icon */}
</button>

{/* Mobile Menu Drawer */}
<nav
  id="mobile-menu"
  role="navigation"
  aria-label="Navegación principal móvil"
  aria-hidden={!isMobileMenuOpen}
>
  {/* Menu items */}
</nav>

{/* Backdrop */}
<div
  aria-hidden="true"
  onClick={closeMobileMenu}
/>
```

## Animation Design

### Menu Open Animation

```css
/* Initial state (closed) */
transform: translateX(-100%)

/* Open state */
transform: translateX(0)

/* Transition */
transition: transform 250ms ease-in-out
```

### Backdrop Fade-In

```css
/* Initial state */
opacity: 0

/* Visible state */
opacity: 1 (bg-opacity-40)

/* Transition */
transition: opacity 250ms ease-in-out
```

### Implementation Strategy

Use Tailwind's transition utilities + conditional classes:
```tsx
<div className={`
  fixed inset-0 bg-black transition-opacity duration-250
  ${isMobileMenuOpen ? 'opacity-40' : 'opacity-0 pointer-events-none'}
`}>
```

## Brand/Logo Responsive Design

### Desktop (≥ 768px)
```tsx
<div className="flex items-center gap-2">
  <ShoppingCart className="w-6 h-6 text-primary" />
  <span className="hidden md:inline text-xl font-bold">
    Shopping Manager
  </span>
</div>
```

### Mobile (< 768px)
```tsx
<div className="flex items-center gap-2">
  <ShoppingCart className="w-6 h-6 text-primary" />
  <span className="md:hidden text-lg font-bold">
    SM
  </span>
</div>
```

**Alternative**: Icon only on mobile (no "SM" text)
- Saves even more space
- Icon is recognizable enough
- **Decision**: Start with icon-only, add "SM" if user feedback requests it

## Touch Target Optimization

### Mobile Menu Items

Following iOS Human Interface Guidelines:
- **Minimum**: 44px (standard touch target)
- **Recommended**: 56px (`min-h-touch-lg` from tailwind.config.js)
- **Applied**: Use 56px for better usability

```tsx
<Link
  className="flex items-center gap-3 px-6 py-4 min-h-touch-lg hover:bg-gray-100"
>
  <Icon className="w-5 h-5" />
  <span className="text-base">Label</span>
</Link>
```

### Hamburger Button

```tsx
<button className="p-2 min-h-touch focus:ring-2">
  <Menu className="w-6 h-6" />
</button>
```

## Testing Strategy

### Unit Tests (Vitest + React Testing Library)

**Navigation.test.tsx**:
```typescript
describe('Navigation - Desktop', () => {
  it('renders horizontal navigation on desktop viewport')
  it('shows full brand text on desktop')
  it('highlights active route')
})

describe('Navigation - Mobile', () => {
  it('renders hamburger button on mobile viewport')
  it('shows abbreviated brand on mobile')
  it('opens menu when hamburger clicked')
  it('closes menu when backdrop clicked')
  it('closes menu when link clicked')
  it('closes menu when Escape pressed')
})

describe('Navigation - Accessibility', () => {
  it('traps focus within open mobile menu')
  it('returns focus to hamburger when menu closes')
  it('has proper ARIA attributes')
  it('supports keyboard navigation')
})
```

**Testing Viewport Sizes**:
```typescript
// Vitest doesn't support responsive breakpoints directly
// Mock window.matchMedia or use CSS media query mocking

beforeEach(() => {
  window.matchMedia = vi.fn().mockImplementation(query => ({
    matches: query.includes('min-width: 768px'), // Desktop
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  }))
})
```

**Alternative**: Test DOM structure directly (presence of mobile menu elements)

### Manual Testing

**Device Testing Matrix**:
- **Mobile**: iPhone (Safari), Android (Chrome)
- **Tablet**: iPad (Safari), Android tablet (Chrome)
- **Desktop**: Chrome, Firefox, Safari (latest versions)

**Test Scenarios**:
1. Hamburger menu opens/closes on mobile
2. Navigation links work in both desktop and mobile modes
3. Keyboard navigation (Tab, Escape) works
4. Screen reader announces menu state changes
5. Animations are smooth (60fps) on mid-range devices

## Performance Considerations

### Bundle Size Impact

**Estimated increase**: ~2-3 KB (minified)
- New state management: ~0.5 KB
- Additional JSX for mobile menu: ~1.5 KB
- Animation styles: ~1 KB

**Total app size**: Negligible impact (<1% increase)

### Runtime Performance

**Concerns**:
- Menu open/close animations (60fps target)
- Body scroll lock/unlock (reflow potential)
- Event listeners (click outside, keyboard)

**Optimizations**:
- Use CSS transforms (GPU-accelerated, no reflow)
- Debounce scroll lock (not needed, single toggle)
- Remove event listeners on unmount (cleanup in useEffect)

### Memory

**Concerns**: None expected
- Single boolean state (4 bytes)
- No heavy computations or data structures

## Implementation Phases

### Phase 1: Basic Mobile Menu (MVP)
- Hamburger button toggle
- Slide-in drawer with links
- Close on link click
- No animations (instant show/hide)

### Phase 2: Animations & Polish
- Slide-in animation (250ms)
- Backdrop fade-in
- Focus management

### Phase 3: Accessibility
- Keyboard navigation (Escape, Tab)
- ARIA attributes
- Focus trap

### Phase 4: Testing & QA
- Unit tests (mobile/desktop states)
- Manual testing (real devices)
- Accessibility testing (keyboard, screen reader)

**Total Phases**: Deliver incrementally, test after each phase

## Open Technical Decisions

Need clarification before implementation:

1. **Component Structure**:
   - **Option A**: Single `Navigation.tsx` with inline mobile state (~180 lines)
   - **Option B**: Separate `Navigation.tsx` + `MobileNav.tsx` (~100 lines each)
   - **Recommendation**: Option A (simpler, less indirection)

2. **Icon Library**:
   - Use existing Lucide icons (Menu, X) or custom hamburger SVG?
   - **Recommendation**: Lucide `Menu` and `X` icons (already installed)

3. **Transition Library**:
   - Plain CSS transitions or headlessui Transition component?
   - **Recommendation**: Plain CSS (no new dependencies, simpler)

4. **Close Button Position**:
   - Top-right of drawer (standard)
   - Top-left (mirror hamburger position)
   - **Recommendation**: Top-right (standard pattern, thumb-friendly)

## Risks & Constraints

### Technical Constraints

1. **Tailwind Breakpoints**: Limited to `md:` (768px) - no custom breakpoints needed
2. **Test Environment**: jsdom doesn't support all CSS features (workaround: mock matchMedia)
3. **iOS Safari**: Viewport height with bottom bar (use `100dvh` if needed)

### Known Issues (Potential)

1. **Focus Trap Implementation**: May need third-party library (focus-trap-react) if complex
   - **Mitigation**: Start with simple implementation, add library if needed

2. **Swipe Gestures**: Not implemented in MVP (future enhancement)
   - **Mitigation**: Document as future work in backlog

3. **Nested Navigation**: Current implementation doesn't support sub-menus
   - **Mitigation**: Not needed now, design accommodates future extension

## Rollback Plan

If critical issues arise post-deployment:

1. **Feature Flag** (if implemented): Toggle responsive nav off, revert to desktop-only
2. **Git Revert**: Single commit with all changes, easy to revert
3. **Hotfix Branch**: Quick fix for specific issues (e.g., focus trap bugs)

**Monitoring**: Check for:
- Console errors (JavaScript exceptions)
- Accessibility complaints (keyboard nav broken)
- Visual bugs (layout shifts, animations janky)

## Future Enhancements

Outside scope of this change, consider for future:

1. **Bottom Navigation Bar** (mobile pattern for large phones)
2. **Swipe to Open/Close** menu
3. **Transition Animations** (more sophisticated, spring physics)
4. **Nested Navigation** (if product hierarchy grows)
5. **Responsive Typography** (global scale, not just navigation)
6. **Dark Mode** support for navigation

## Conclusion

This design provides a **minimal, maintainable, accessible** solution for responsive navigation. It leverages existing tools (Tailwind, React, Lucide icons) and follows project conventions (Clean Architecture, TDD, mobile-first).

**Next Step**: Create spec deltas and tasks.md for implementation.