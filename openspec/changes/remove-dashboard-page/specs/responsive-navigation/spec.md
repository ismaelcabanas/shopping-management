# Responsive Navigation Spec Delta

## MODIFIED Requirements

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

#### Scenario: Active route is highlighted for home page

**Given** the user is on the "Inicio" (home) page
**And** the user is on desktop
**Then** the "Inicio" navigation link SHALL have primary background color
**And** the "Inicio" link SHALL have white text color
**And** other navigation links SHALL have gray text color
