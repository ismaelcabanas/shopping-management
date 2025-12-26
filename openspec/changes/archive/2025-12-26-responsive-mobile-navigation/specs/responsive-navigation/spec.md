# Spec: Responsive Navigation

**Capability**: `responsive-navigation`
**Status**: Proposed
**Version**: 1.0.0
**Last Updated**: 2025-12-26

## Overview

This spec defines the responsive navigation capability for the Shopping Manager application, enabling optimal navigation experience across all device sizes from mobile phones to desktop browsers.

## ADDED Requirements

### Requirement: Mobile Hamburger Menu

The application SHALL provide a collapsible hamburger menu navigation pattern for viewports smaller than 768px width.

#### Scenario: User opens mobile menu on phone

**Given** the user is on a mobile device (viewport < 768px)
**And** the application is loaded
**When** the user taps the hamburger menu button
**Then** a navigation drawer SHALL slide in from the left side
**And** the drawer SHALL display all navigation links vertically
**And** the drawer SHALL cover 80% of the viewport width (max 320px)
**And** a semi-transparent backdrop SHALL appear behind the drawer
**And** the page content SHALL not scroll while the menu is open

#### Scenario: User closes mobile menu by tapping backdrop

**Given** the mobile menu is open
**When** the user taps the backdrop area
**Then** the menu drawer SHALL slide out to the left
**And** the backdrop SHALL fade out
**And** the page content SHALL become scrollable again
**And** focus SHALL return to the hamburger button

#### Scenario: User closes mobile menu by tapping a navigation link

**Given** the mobile menu is open
**When** the user taps any navigation link
**Then** the menu SHALL close automatically
**And** the user SHALL navigate to the selected page

### Requirement: Desktop Horizontal Navigation

The application SHALL provide a horizontal navigation bar for viewports equal to or larger than 768px width, preserving the current desktop experience.

#### Scenario: User views navigation on desktop

**Given** the user is on a desktop device (viewport ≥ 768px)
**And** the application is loaded
**Then** the navigation SHALL be displayed horizontally
**And** all navigation items SHALL be visible
**And** the full brand text "Shopping Manager" SHALL be displayed
**And** NO hamburger menu button SHALL be visible

#### Scenario: User clicks navigation link on desktop

**Given** the user is on desktop
**And** the navigation is displayed
**When** the user clicks any navigation link
**Then** the user SHALL navigate to the selected page
**And** the clicked link SHALL be highlighted as active
**And** NO menu closing animation SHALL occur

### Requirement: Responsive Brand/Logo

The application SHALL display an adaptive brand/logo that adjusts based on available viewport width.

#### Scenario: Brand display on mobile

**Given** the user is on a mobile device (viewport < 768px)
**Then** the navigation SHALL display ONLY the shopping cart icon
**And** the full "Shopping Manager" text SHALL be hidden
**And** the icon SHALL be 24x24 pixels (w-6 h-6)

#### Scenario: Brand display on desktop

**Given** the user is on a desktop device (viewport ≥ 768px)
**Then** the navigation SHALL display the shopping cart icon
**And** the full "Shopping Manager" text SHALL be visible
**And** the brand SHALL be clickable to navigate to home page

### Requirement: Touch-Friendly Mobile Navigation

The application SHALL provide touch-optimized navigation elements on mobile devices following iOS Human Interface Guidelines.

#### Scenario: Mobile menu items have adequate touch targets

**Given** the mobile menu is open
**Then** each navigation link SHALL have a minimum height of 56px (`min-h-touch-lg`)
**And** each link SHALL have horizontal padding of 24px (px-6)
**And** each link SHALL have vertical padding of 16px (py-4)
**And** each link SHALL display an icon and label with adequate spacing

#### Scenario: Hamburger button has adequate touch target

**Given** the user is on a mobile device
**Then** the hamburger button SHALL have a minimum height of 44px (`min-h-touch`)
**And** the button SHALL have adequate padding for easy tapping
**And** the button SHALL have a focus ring on keyboard focus

### Requirement: Smooth Navigation Animations

The application SHALL provide smooth, performant animations for mobile menu interactions.

#### Scenario: Mobile menu opens with animation

**Given** the mobile menu is closed
**When** the user taps the hamburger button
**Then** the drawer SHALL slide in from left using CSS transform
**And** the animation SHALL complete in 250 milliseconds
**And** the animation SHALL use ease-in-out timing function
**And** the backdrop SHALL fade in simultaneously

#### Scenario: Mobile menu closes with animation

**Given** the mobile menu is open
**When** the user closes the menu (any method)
**Then** the drawer SHALL slide out to left using CSS transform
**And** the animation SHALL complete in 250 milliseconds
**And** the animation SHALL use ease-in-out timing function
**And** the backdrop SHALL fade out simultaneously

### Requirement: Keyboard Navigation Support

The application SHALL support full keyboard navigation for accessibility in both mobile and desktop modes.

#### Scenario: User closes mobile menu with Escape key

**Given** the mobile menu is open
**When** the user presses the Escape key
**Then** the menu SHALL close
**And** focus SHALL return to the hamburger button

#### Scenario: User navigates menu with Tab key

**Given** the mobile menu is open
**When** the user presses Tab
**Then** focus SHALL move to the next focusable element within the menu
**And** focus SHALL NOT escape to page content behind the menu
**And** after the last menu item, focus SHALL cycle back to the first item

#### Scenario: User activates menu item with Enter key

**Given** the mobile menu is open
**And** a navigation link has keyboard focus
**When** the user presses Enter
**Then** the navigation link SHALL be activated
**And** the user SHALL navigate to the corresponding page

### Requirement: Accessible ARIA Attributes

The application SHALL provide proper ARIA attributes for screen reader compatibility and accessibility.

#### Scenario: Hamburger button has proper ARIA labels

**Given** the user is on a mobile device
**Then** the hamburger button SHALL have aria-label "Abrir menú de navegación"
**And** the button SHALL have aria-expanded="false" when menu is closed
**And** the button SHALL have aria-expanded="true" when menu is open
**And** the button SHALL have aria-controls="mobile-menu"

#### Scenario: Mobile menu has proper ARIA labels

**Given** the mobile menu is rendered
**Then** the menu SHALL have id="mobile-menu"
**And** the menu SHALL have role="navigation"
**And** the menu SHALL have aria-label="Navegación principal móvil"
**And** the menu SHALL have aria-hidden="true" when closed
**And** the menu SHALL have aria-hidden="false" when open

#### Scenario: Backdrop has proper ARIA attributes

**Given** the mobile menu is open
**Then** the backdrop element SHALL have aria-hidden="true"
**And** the backdrop SHALL NOT be announced by screen readers

### Requirement: Active Route Indication

The application SHALL visually indicate the currently active navigation route in both mobile and desktop modes.

#### Scenario: Active route is highlighted on desktop

**Given** the user is on the "Mi Despensa" page
**And** the user is on desktop
**Then** the "Mi Despensa" navigation link SHALL have primary background color
**And** the "Mi Despensa" link SHALL have white text color
**And** other navigation links SHALL have gray text color

#### Scenario: Active route is highlighted on mobile

**Given** the user is on the "Lista de Compras" page
**And** the mobile menu is open
**Then** the "Lista de Compras" navigation link SHALL have primary background color
**And** the "Lista de Compras" link SHALL have white text color
**And** other navigation links SHALL have default styling

### Requirement: Body Scroll Management

The application SHALL manage body scroll behavior when the mobile menu is open to prevent background scrolling.

#### Scenario: Body scroll is locked when menu opens

**Given** the mobile menu is closed
**And** the page content is scrollable
**When** the user opens the mobile menu
**Then** the page body SHALL have overflow: hidden style
**And** the page content SHALL NOT scroll when user attempts to scroll
**And** the menu content SHALL remain scrollable

#### Scenario: Body scroll is restored when menu closes

**Given** the mobile menu is open
**And** body scroll is locked
**When** the user closes the mobile menu
**Then** the page body SHALL have overflow: unset style
**And** the page content SHALL be scrollable again

### Requirement: Responsive Viewport Adaptation

The application SHALL adapt navigation layout automatically when viewport size changes (e.g., device rotation, browser resize).

#### Scenario: Navigation adapts from desktop to mobile

**Given** the user is on desktop (viewport ≥ 768px)
**And** horizontal navigation is displayed
**When** the viewport width is reduced below 768px
**Then** the horizontal navigation SHALL be hidden
**And** the hamburger button SHALL appear
**And** the brand text SHALL change to icon-only

#### Scenario: Navigation adapts from mobile to desktop

**Given** the user is on mobile (viewport < 768px)
**And** the hamburger menu button is displayed
**When** the viewport width is increased to 768px or more
**Then** the hamburger button SHALL be hidden
**And** the horizontal navigation SHALL appear
**And** the brand icon SHALL show full "Shopping Manager" text

## Cross-Cutting Concerns

### Performance
- All animations SHALL use CSS transforms for GPU acceleration
- Animation frame rate SHALL maintain 60fps on mid-range mobile devices
- Bundle size increase SHALL NOT exceed 5 KB (minified + gzipped)

### Browser Compatibility
- Mobile navigation SHALL work on iOS Safari (latest 2 versions)
- Mobile navigation SHALL work on Chrome Android (latest 2 versions)
- Desktop navigation SHALL work on Chrome, Firefox, Safari (latest 2 versions)

### Testing
- Unit tests SHALL verify mobile and desktop rendering
- Unit tests SHALL verify menu open/close functionality
- Unit tests SHALL verify keyboard navigation
- Unit tests SHALL verify ARIA attributes presence
- Manual testing SHALL be performed on real devices (iPhone, Android)

## Dependencies

- **Tailwind CSS**: `md:` breakpoint (768px) for responsive behavior
- **React**: `useState` hook for menu state management
- **React Router DOM**: `useLocation` hook for active route detection
- **Lucide React**: `Menu` and `X` icons for hamburger button

## Acceptance Criteria

- ✅ Mobile users (< 768px) see hamburger menu with slide-in drawer
- ✅ Desktop users (≥ 768px) see horizontal navigation (unchanged behavior)
- ✅ Brand/logo adapts to viewport size (icon-only on mobile, full text on desktop)
- ✅ Touch targets meet iOS Human Interface Guidelines (44px minimum, 56px recommended)
- ✅ Menu animations are smooth (250ms, ease-in-out, 60fps)
- ✅ Keyboard navigation works (Tab, Escape, Enter)
- ✅ ARIA attributes are properly set for screen readers
- ✅ Active route is visually indicated in both modes
- ✅ Body scroll is locked when mobile menu is open
- ✅ Navigation adapts automatically to viewport changes
- ✅ All unit tests pass
- ✅ Manual testing confirms functionality on real devices

## Out of Scope

The following are explicitly NOT part of this spec:

- Bottom navigation bar pattern (alternative mobile pattern)
- Swipe gestures to open/close menu
- Nested navigation menus or dropdowns
- Responsive typography beyond navigation component
- Global responsive breakpoint system
- Dark mode support for navigation
- Custom logo images or SVG graphics beyond existing icons

## Related Specs

- None (first spec in the project)

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-12-26 | Claude | Initial spec creation |