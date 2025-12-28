# UI Feedback Spec Delta

## ADDED Requirements

### Requirement: Consistent Page Layout Container

The application SHALL provide a consistent page layout container pattern for all main pages to ensure visual coherence and optimal reading experience across devices.

#### Scenario: Mobile viewport displays full-width content

**Given** the user is on a mobile device (viewport < 640px)
**When** the user navigates to any main page (Catalog, Shopping List, etc.)
**Then** the page content SHALL use full viewport width with horizontal padding
**And** the content SHALL be constrained by `container mx-auto px-4`
**And** NO max-width constraint SHALL be applied on mobile

#### Scenario: Desktop viewport displays centered content with optimal width

**Given** the user is on a desktop device (viewport ≥ 768px)
**When** the user navigates to any main page (Catalog, Shopping List, etc.)
**Then** the page content SHALL be centered horizontally
**And** the content SHALL be constrained to a maximum width of 896px (`max-w-4xl`)
**And** the content SHALL have consistent horizontal padding (`px-4`)

#### Scenario: Page header follows consistent structure

**Given** the user is on any main page
**Then** the page SHALL have a semantic `<header>` element
**And** the header SHALL have consistent bottom margin (`mb-8`, 32px)
**And** the header SHALL contain an H1 title with styling `text-3xl font-bold text-gray-800`
**And** the header MAY contain a subtitle with styling `text-gray-600 mt-2`
**And** the header MAY contain action buttons with consistent spacing

#### Scenario: Page content uses semantic main element

**Given** the user is on any main page
**Then** the page content SHALL be wrapped in a semantic `<main>` element
**And** the main element SHALL follow immediately after the header element
