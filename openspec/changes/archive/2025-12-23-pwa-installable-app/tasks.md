# Tasks: PWA Installable App

## 1. Service Worker Registration

### 1.1 Register PWA Service Worker in main.tsx
- [ ] 1.1.1 Import `registerSW` from `virtual:pwa-register`
- [ ] 1.1.2 Add service worker registration after MSW initialization
- [ ] 1.1.3 Add condition to skip PWA SW when `VITE_ENABLE_MSW=true`
- [ ] 1.1.4 Implement `onNeedRefresh` callback with toast notification
- [ ] 1.1.5 Implement `onOfflineReady` callback with toast notification
- [ ] 1.1.6 Handle registration errors gracefully
- [ ] 1.1.7 Test service worker registers in browser console

### 1.2 Configure Workbox Caching in vite.config.ts
- [ ] 1.2.1 Add `workbox` configuration to `VitePWA` plugin options
- [ ] 1.2.2 Configure `runtimeCaching` with Cache-First for static assets (JS, CSS, images, fonts)
- [ ] 1.2.3 Configure Network-First for HTML pages with cache fallback
- [ ] 1.2.4 Set cache expiration policies (30 days for assets, 7 days for pages)
- [ ] 1.2.5 Set `maxEntries` limits for cache sizes
- [ ] 1.2.6 Verify `registerType: 'autoUpdate'` is set

## 2. Manifest Configuration

### 2.1 Review and Enhance Manifest
- [ ] 2.1.1 Review existing manifest in `vite.config.ts`
- [ ] 2.1.2 Verify all required fields present (name, short_name, icons, display, theme_color)
- [ ] 2.1.3 Ensure `start_url` is set to "/"
- [ ] 2.1.4 Verify icons array includes 192x192 and 512x512 (already done)
- [ ] 2.1.5 Add `purpose: "any maskable"` to 512x512 icon for better Android compatibility
- [ ] 2.1.6 Verify screenshots referenced in manifest exist in `public/`
- [ ] 2.1.7 Optional: Add `categories` field (e.g., ["lifestyle", "shopping"])
- [ ] 2.1.8 Optional: Add `shortcuts` for quick actions from home screen

### 2.2 Verify HTML Meta Tags
- [ ] 2.2.1 Confirm `theme-color` meta tag matches manifest (#10b981)
- [ ] 2.2.2 Confirm `apple-mobile-web-app-*` tags present for iOS
- [ ] 2.2.3 Confirm `apple-touch-icon` link present
- [ ] 2.2.4 Verify viewport meta tag correct for mobile

## 3. Build and Test Infrastructure

### 3.1 Verify Build Generates PWA Assets
- [ ] 3.1.1 Run `npm run build`
- [ ] 3.1.2 Verify `dist/manifest.webmanifest` generated
- [ ] 3.1.3 Verify `dist/sw.js` (service worker) generated
- [ ] 3.1.4 Verify `dist/workbox-*.js` generated
- [ ] 3.1.5 Verify all icons copied to `dist/`
- [ ] 3.1.6 Inspect manifest.webmanifest content (valid JSON, correct paths)

### 3.2 Test Service Worker in Preview Mode
- [ ] 3.2.1 Build app: `npm run build`
- [ ] 3.2.2 Start preview server: `npm run preview`
- [ ] 3.2.3 Open browser DevTools → Application → Service Workers
- [ ] 3.2.4 Verify service worker registered and activated
- [ ] 3.2.5 Check console for service worker messages
- [ ] 3.2.6 Inspect Cache Storage - verify caches created

### 3.3 Test Offline Functionality
- [ ] 3.3.1 Load app in preview mode
- [ ] 3.3.2 Open DevTools → Network → Enable "Offline"
- [ ] 3.3.3 Reload page - should load from cache
- [ ] 3.3.4 Navigate between routes - should work offline
- [ ] 3.3.5 Verify LocalStorage data accessible (products, inventory, shopping list)
- [ ] 3.3.6 Verify toast shows "Modo sin conexión activado" when going offline
- [ ] 3.3.7 Re-enable network - verify toast shows "Conexión restaurada"

## 4. Installation Testing

### 4.1 Test Installation on Desktop (Chrome/Edge)
- [ ] 4.1.1 Open app in Chrome/Edge (production or preview build)
- [ ] 4.1.2 Look for install icon in address bar
- [ ] 4.1.3 Click install icon → Install app
- [ ] 4.1.4 Verify app appears in Start Menu / Applications
- [ ] 4.1.5 Launch installed app - verify standalone mode (no browser UI)
- [ ] 4.1.6 Verify theme color applied (#10b981)
- [ ] 4.1.7 Close and reopen - verify app state persists

### 4.2 Test Installation on Android (Chrome)
- [ ] 4.2.1 Deploy app to HTTPS URL (required for PWA) or use ngrok for local testing
- [ ] 4.2.2 Open app in Android Chrome
- [ ] 4.2.3 Look for install banner or address bar prompt
- [ ] 4.2.4 Tap "Install" or "Add to Home Screen"
- [ ] 4.2.5 Verify app icon added to home screen
- [ ] 4.2.6 Launch app from home screen - verify splash screen appears
- [ ] 4.2.7 Verify app opens in fullscreen (standalone mode)
- [ ] 4.2.8 Test offline: enable airplane mode → reopen app → verify works

### 4.3 Test Installation on iOS (Safari)
- [ ] 4.3.1 Deploy app to HTTPS URL
- [ ] 4.3.2 Open app in iOS Safari
- [ ] 4.3.3 Tap Share button
- [ ] 4.3.4 Select "Add to Home Screen"
- [ ] 4.3.5 Confirm installation
- [ ] 4.3.6 Verify app icon on home screen
- [ ] 4.3.7 Launch app - verify splash screen (if supported)
- [ ] 4.3.8 Verify app opens in standalone mode
- [ ] 4.3.9 Test offline functionality (note: iOS has more limitations)

## 5. Lighthouse PWA Audit

### 5.1 Run Lighthouse Audit
- [ ] 5.1.1 Open app in Chrome
- [ ] 5.1.2 Open DevTools → Lighthouse tab
- [ ] 5.1.3 Select "Progressive Web App" category
- [ ] 5.1.4 Run audit (Mobile or Desktop)
- [ ] 5.1.5 Review results - target score > 90
- [ ] 5.1.6 Address any failing checks
- [ ] 5.1.7 Re-run audit until passing

### 5.2 Verify PWA Checklist
- [ ] 5.2.1 ✅ Fast load times (< 3s on 3G)
- [ ] 5.2.2 ✅ Works offline
- [ ] 5.2.3 ✅ Installable (install prompt available)
- [ ] 5.2.4 ✅ Configured for custom splash screen
- [ ] 5.2.5 ✅ Sets theme color for address bar
- [ ] 5.2.6 ✅ Content sized correctly for viewport
- [ ] 5.2.7 ✅ Provides valid manifest
- [ ] 5.2.8 ✅ Served over HTTPS (in production)

## 6. Update Flow Testing

### 6.1 Test Service Worker Update
- [ ] 6.1.1 Deploy initial version of app
- [ ] 6.1.2 Install and open app (service worker v1 active)
- [ ] 6.1.3 Make small code change (e.g., update text)
- [ ] 6.1.4 Rebuild and redeploy (service worker v2)
- [ ] 6.1.5 Open app again (with v1 still active)
- [ ] 6.1.6 Verify toast shows "Actualizando a nueva versión..."
- [ ] 6.1.7 Verify app updates automatically (autoUpdate mode)
- [ ] 6.1.8 Verify new content appears after update

## 7. Documentation

### 7.1 Create Mobile Installation Guide
- [ ] 7.1.1 Create `docs/user-guides/mobile-installation.md`
- [ ] 7.1.2 Add section: "Installing on Android (Chrome, Edge, Samsung Internet)"
- [ ] 7.1.3 Add section: "Installing on iOS (Safari)"
- [ ] 7.1.4 Add section: "Installing on Desktop (Windows, Mac, Linux)"
- [ ] 7.1.5 Include step-by-step instructions with numbered steps
- [ ] 7.1.6 Add screenshots for each platform (optional but recommended)
- [ ] 7.1.7 Add troubleshooting section (common issues)
- [ ] 7.1.8 Add FAQ section (What is PWA? Why install? Storage requirements?)

### 7.2 Update Main README
- [ ] 7.2.1 Add "Installation" section to `shopping-management-webapp/README.md`
- [ ] 7.2.2 Mention PWA installability in Features section
- [ ] 7.2.3 Link to detailed installation guide
- [ ] 7.2.4 Add badge/note about offline functionality

## 8. Optional Enhancements (If Time Permits)

### 8.1 In-App Install Prompt (Optional)
- [ ] 8.1.1 Create `InstallPrompt.tsx` component
- [ ] 8.1.2 Listen for `beforeinstallprompt` event
- [ ] 8.1.3 Store deferred prompt in state
- [ ] 8.1.4 Show "Install App" button in navigation or settings
- [ ] 8.1.5 Trigger `prompt()` when user clicks button
- [ ] 8.1.6 Hide button after installation or dismissal
- [ ] 8.1.7 Add unit tests for InstallPrompt component

### 8.2 iOS Installation Instructions Modal (Optional)
- [ ] 8.2.1 Create component to detect iOS + Safari
- [ ] 8.2.2 Show inline instructions if iOS detected and not installed
- [ ] 8.2.3 Include visual guide (Share → Add to Home Screen)
- [ ] 8.2.4 Allow user to dismiss instructions (save preference in LocalStorage)

### 8.3 Offline Indicator Banner (Optional)
- [ ] 8.3.1 Create `OfflineIndicator.tsx` component
- [ ] 8.3.2 Listen to `online`/`offline` events
- [ ] 8.3.3 Show banner at top when offline: "Sin conexión - mostrando datos guardados"
- [ ] 8.3.4 Hide banner when back online
- [ ] 8.3.5 Style banner to be non-intrusive (small, dismissible)

## 9. Validation

### 9.1 Manual Testing Checklist
- [ ] 9.1.1 App installs on Android device
- [ ] 9.1.2 App installs on iOS device
- [ ] 9.1.3 App installs on desktop (Windows/Mac/Linux)
- [ ] 9.1.4 App works offline after first visit
- [ ] 9.1.5 Service worker updates automatically when new version deployed
- [ ] 9.1.6 Toast notifications appear for updates and offline mode
- [ ] 9.1.7 Splash screen shows on mobile launch
- [ ] 9.1.8 App opens in standalone mode (fullscreen, no browser UI)
- [ ] 9.1.9 Theme color applied to status bar
- [ ] 9.1.10 All features work the same as web version

### 9.2 Run OpenSpec Validation
- [ ] 9.2.1 Run `openspec validate pwa-installable-app --strict`
- [ ] 9.2.2 Resolve any validation errors
- [ ] 9.2.3 Verify all scenarios in spec are covered
- [ ] 9.2.4 Verify tasks align with spec requirements

### 9.3 E2E Test Compatibility Check
- [ ] 9.3.1 Run E2E tests with PWA enabled: `npm run test:e2e`
- [ ] 9.3.2 Verify MSW and PWA service workers don't conflict
- [ ] 9.3.3 Ensure all E2E tests still pass (25 tests expected)
- [ ] 9.3.4 Check for console errors during E2E test runs

## Notes

### Dependencies
- Tasks 1.1-1.2 (service worker setup) must complete before installation testing (4.1-4.3)
- Task 3.1 (build verification) required before all testing tasks
- Documentation (7.1-7.2) can be done in parallel with development

### Testing Strategy
- Unit tests: Not needed (PWA is infrastructure, tested via integration)
- Integration tests: Manual installation and offline testing on real devices
- E2E tests: Verify no conflicts with MSW, existing tests still pass
- Lighthouse audit: Automated PWA compliance check

### Key Implementation Notes
- Service worker only registers in production build (`npm run build` + `npm run preview`)
- Dev mode (`npm run dev`) uses Vite HMR, no service worker
- MSW and PWA service workers are mutually exclusive (conditional registration)
- LocalStorage data persistence is unchanged (already works offline)
- Service worker only caches app shell (HTML/JS/CSS), not data

### Rollback Plan
If issues arise:
1. Service worker is additive, doesn't break existing functionality
2. Can disable by commenting out `registerSW()` in `main.tsx`
3. App continues to work as standard web app without PWA features
4. No data loss (LocalStorage unaffected)

### Time Estimates
- **Core PWA Setup**: 2-3 hours (tasks 1.1-1.2, 2.1-2.2)
- **Build & Infrastructure**: 1 hour (tasks 3.1-3.3)
- **Installation Testing**: 2-3 hours (tasks 4.1-4.3, real devices)
- **Lighthouse & Validation**: 1 hour (tasks 5.1-5.2)
- **Update Flow Testing**: 30 min (task 6.1)
- **Documentation**: 1 hour (tasks 7.1-7.2)
- **Optional Enhancements**: 2-3 hours (task 8, if included)

**Total Estimated Time**: 8-11 hours (6-8 hours without optional enhancements)