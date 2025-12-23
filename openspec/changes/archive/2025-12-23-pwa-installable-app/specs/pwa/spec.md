# pwa Specification

## Purpose
Define the Progressive Web App (PWA) capabilities that enable Shopping Manager to be installed on user devices and work offline, providing a native app-like experience across mobile and desktop platforms.

## ADDED Requirements

### Requirement: Service Worker Registration and Lifecycle
The application SHALL register a service worker that manages app caching, offline functionality, and automatic updates.

#### Scenario: Service worker registers successfully on first visit
- **GIVEN** user visits the Shopping Manager app for the first time
- **AND** browser supports service workers
- **WHEN** app loads
- **THEN** service worker is registered
- **AND** service worker enters "installing" state
- **AND** app shell assets (HTML, JS, CSS) are precached
- **AND** service worker enters "activated" state
- **AND** subsequent page loads use the service worker

#### Scenario: Service worker updates when new version deployed
- **GIVEN** user has app installed with service worker v1
- **AND** new version v2 is deployed to server
- **WHEN** user opens app
- **THEN** service worker detects new version
- **AND** new service worker downloads in background
- **AND** app shows toast notification "Actualizando a nueva versión..."
- **AND** app updates automatically (autoUpdate mode)
- **AND** app reloads with new version

#### Scenario: Service worker does not conflict with MSW in tests
- **GIVEN** E2E test environment with `VITE_ENABLE_MSW=true`
- **WHEN** app initializes
- **THEN** MSW (Mock Service Worker) registers for test mocking
- **AND** PWA service worker does NOT register
- **AND** tests run without service worker conflicts

### Requirement: Offline Functionality
The application SHALL provide core functionality when offline by caching essential assets and leveraging LocalStorage for data persistence.

#### Scenario: App loads when offline after first visit
- **GIVEN** user has visited app at least once while online
- **AND** service worker has cached app shell
- **AND** user goes offline (no network connection)
- **WHEN** user opens app from home screen or browser
- **THEN** app loads successfully from cache
- **AND** navigation between pages works
- **AND** LocalStorage data (products, inventory, shopping list) is accessible
- **AND** app shows offline indicator (optional)

#### Scenario: Static assets load from cache when offline
- **GIVEN** user is offline
- **AND** service worker has cached assets
- **WHEN** app requests JS, CSS, images, fonts, or icons
- **THEN** assets load from cache (Cache-First strategy)
- **AND** page renders correctly without network requests

#### Scenario: User notified when app goes offline
- **GIVEN** user has app open and online
- **WHEN** network connection lost
- **THEN** app detects offline state
- **AND** toast notification shows "Modo sin conexión activado"
- **AND** app continues to function with cached data

#### Scenario: User notified when app goes back online
- **GIVEN** user has app open and offline
- **WHEN** network connection restored
- **THEN** app detects online state
- **AND** toast notification shows "Conexión restaurada"
- **AND** service worker checks for updates

### Requirement: App Installation
The application SHALL be installable on user devices (mobile and desktop) following PWA installation standards.

#### Scenario: App meets PWA installability criteria
- **GIVEN** app is deployed and served over HTTPS
- **AND** manifest.webmanifest file is valid
- **AND** service worker is registered
- **AND** app has required icons (192x192, 512x512)
- **WHEN** user visits app in PWA-compatible browser
- **THEN** browser shows install prompt (Chrome, Edge, Samsung Internet)
- **AND** app can be installed to home screen / desktop

#### Scenario: User installs app on Android Chrome
- **GIVEN** user visits app on Android device with Chrome
- **AND** install criteria are met
- **WHEN** user taps "Install" in address bar prompt
- **OR** user selects "Add to Home Screen" from menu
- **THEN** app installs to device home screen
- **AND** app icon appears with name "Shopping"
- **AND** tapping icon launches app in standalone mode (fullscreen, no browser UI)

#### Scenario: User installs app on iOS Safari
- **GIVEN** user visits app on iOS device with Safari
- **WHEN** user taps Share button
- **AND** user selects "Add to Home Screen"
- **AND** user confirms installation
- **THEN** app appears on iOS home screen
- **AND** tapping icon launches app in standalone mode
- **AND** splash screen shows during app launch

#### Scenario: User installs app on desktop
- **GIVEN** user visits app on Windows/Mac/Linux with Chrome or Edge
- **AND** install criteria are met
- **WHEN** user clicks install icon in address bar
- **OR** user selects "Install Shopping Manager" from menu
- **THEN** app installs to operating system
- **AND** app appears in Start Menu / Applications / Launchpad
- **AND** app can be launched like native desktop app

### Requirement: App Manifest Configuration
The application SHALL provide a valid Web App Manifest that defines app metadata, appearance, and behavior.

#### Scenario: Manifest contains required metadata
- **GIVEN** user visits app
- **WHEN** browser requests `/manifest.webmanifest`
- **THEN** manifest file is served with correct MIME type (`application/manifest+json`)
- **AND** manifest contains required fields:
  - `name`: "Shopping Manager"
  - `short_name`: "Shopping"
  - `description`: "Gestión inteligente de inventario y compras"
  - `start_url`: "/"
  - `display`: "standalone"
  - `theme_color`: "#10b981" (green)
  - `background_color`: "#ffffff"
  - `icons`: array with 192x192 and 512x512 PNG icons

#### Scenario: App displays correctly in standalone mode
- **GIVEN** user has installed app
- **WHEN** user launches app from home screen
- **THEN** app opens in standalone mode (fullscreen)
- **AND** browser UI (address bar, tabs) is hidden
- **AND** app theme color (#10b981 green) applied to status bar
- **AND** app name "Shopping" shown in task switcher

#### Scenario: Splash screen displays during launch
- **GIVEN** user has installed app on mobile device
- **WHEN** user taps app icon to launch
- **THEN** splash screen appears while app loads
- **AND** splash screen shows app icon (512x512)
- **AND** splash screen shows app name "Shopping Manager"
- **AND** splash screen uses background color (#ffffff)
- **AND** app content appears after splash screen dismisses

### Requirement: Caching Strategy
The application SHALL implement intelligent caching strategies to optimize performance and enable offline functionality.

#### Scenario: App shell precached on service worker install
- **GIVEN** service worker is installing for first time
- **WHEN** install event fires
- **THEN** service worker precaches core app shell:
  - `index.html`
  - Main JS bundle
  - Main CSS bundle
  - Favicon and app icons
- **AND** precache completes before service worker activates

#### Scenario: Static assets cached on first request (Cache-First)
- **GIVEN** user navigates to page requiring asset (JS, CSS, image, font)
- **AND** asset not in cache
- **WHEN** app requests asset
- **THEN** service worker fetches from network
- **AND** stores asset in `assets-cache`
- **AND** serves from cache on subsequent requests
- **AND** cached assets expire after 30 days

#### Scenario: HTML pages use Network-First with cache fallback
- **GIVEN** user navigates to app page
- **WHEN** service worker intercepts page request
- **THEN** service worker tries network first
- **AND** if network succeeds, serves fresh page and updates cache
- **AND** if network fails (offline), serves cached page
- **AND** cached pages expire after 7 days

### Requirement: Browser Compatibility
The application SHALL work correctly across all major browsers with graceful degradation for unsupported features.

#### Scenario: Full PWA support in compatible browsers
- **GIVEN** user visits app in Chrome, Edge, Samsung Internet, or Opera
- **WHEN** app loads
- **THEN** service worker registers
- **AND** install prompt available
- **AND** app can be installed
- **AND** offline functionality works

#### Scenario: Limited PWA support in Safari
- **GIVEN** user visits app in Safari (iOS or macOS)
- **WHEN** app loads
- **THEN** service worker registers (limited functionality)
- **AND** app can be added to home screen manually
- **AND** basic offline caching works
- **AND** no automatic install prompt (Safari limitation)

#### Scenario: Graceful degradation in unsupported browsers
- **GIVEN** user visits app in browser without service worker support
- **WHEN** app loads
- **THEN** app functions normally as web application
- **AND** no errors thrown
- **AND** install prompt does not appear
- **AND** no offline functionality (requires network)

### Requirement: Update Notifications
The application SHALL notify users when app updates are available and apply updates automatically.

#### Scenario: User notified when update available
- **GIVEN** user has app open
- **AND** new version deployed to server
- **WHEN** service worker detects update
- **THEN** toast notification shows "Actualizando a nueva versión..."
- **AND** new service worker downloads in background
- **AND** update completes automatically
- **AND** app reloads with new version

#### Scenario: User notified when offline-ready
- **GIVEN** user visits app for first time
- **WHEN** service worker finishes precaching
- **AND** app is ready to work offline
- **THEN** toast notification shows "App lista para funcionar sin conexión"