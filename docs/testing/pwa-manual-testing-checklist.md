# PWA Manual Testing Checklist

This document provides a comprehensive checklist for manually testing the PWA functionality of Shopping Manager.

**Test Date:** _____________________
**Tester:** _____________________
**Environment:** _____________________
**Build Version:** _____________________

---

## Pre-Testing Setup

### 1. Build and Start Preview Server

```bash
# Navigate to webapp directory
cd shopping-management-webapp

# Build production version
npm run build

# Start preview server
npm run preview

# Server should start at: http://localhost:4173
```

**✅ Checklist:**
- [ ] Build completes without errors
- [ ] Preview server starts successfully
- [ ] Can access app at http://localhost:4173
- [ ] No console errors on initial load

---

## Test 1: Service Worker Registration

**Objective:** Verify service worker registers correctly on first visit

### Steps:
1. Open Chrome/Edge browser
2. Navigate to http://localhost:4173
3. Open DevTools (F12 or Cmd+Option+I on Mac)
4. Go to **Application** tab → **Service Workers**

### Expected Results:
- [ ] Service worker is listed with status "activated and is running"
- [ ] Console shows: `"Service Worker registrado correctamente"`
- [ ] No registration errors in console
- [ ] Service worker scope is "/" (root)

### Screenshots:
_Attach screenshot of DevTools → Application → Service Workers panel_

**Status:** ⬜ Pass / ⬜ Fail
**Notes:** _______________________________________________

---

## Test 2: Cache Verification

**Objective:** Verify assets are cached correctly

### Steps:
1. With app open, go to DevTools → **Application** tab
2. Expand **Cache Storage** in left sidebar
3. Inspect the caches created

### Expected Results:
- [ ] "workbox-precache" cache exists
- [ ] Contains core app files (index.html, main JS, main CSS)
- [ ] "assets-cache" may exist (after navigating)
- [ ] "pages-cache" may exist (after navigating)
- [ ] No cache errors in console

### Cache Contents Check:
- [ ] `index.html` is cached
- [ ] Main JavaScript bundle is cached (`.js` file)
- [ ] Main CSS bundle is cached (`.css` file)
- [ ] Icons are precached (192x192, 512x512)

**Status:** ⬜ Pass / ⬜ Fail
**Notes:** _______________________________________________

---

## Test 3: Offline Functionality

**Objective:** Verify app works when offline

### Steps:
1. With app open and service worker activated
2. Navigate to different pages (Home, Products, Inventory, Shopping List)
3. Open DevTools → **Network** tab
4. Check **"Offline"** checkbox (or throttling dropdown → Offline)
5. Reload the page (Cmd+R / Ctrl+R)
6. Try navigating between pages

### Expected Results:
- [ ] Page reloads successfully while offline
- [ ] All pages load from cache
- [ ] Navigation between routes works
- [ ] LocalStorage data is accessible (products, inventory, shopping list)
- [ ] Console shows: `"Modo sin conexión activado"` (optional - depends on implementation)
- [ ] UI displays correctly (no broken images/styles)

### Offline Navigation Test:
- [ ] Home page loads offline
- [ ] Products catalog loads offline
- [ ] Inventory page loads offline
- [ ] Shopping list page loads offline
- [ ] Clicking links navigates correctly

### Going Back Online:
1. Uncheck "Offline" in DevTools
2. Reload page

- [ ] App fetches fresh content when back online
- [ ] Console shows: `"Conexión restaurada"` (optional)
- [ ] No errors when reconnecting

**Status:** ⬜ Pass / ⬜ Fail
**Notes:** _______________________________________________

---

## Test 4: Desktop Installation (Chrome/Edge)

**Objective:** Verify app can be installed on desktop

### Steps:
1. Open app in Chrome or Edge browser
2. Look for install icon (⊕) in address bar (right side)
3. Click the install icon
4. Review the install prompt dialog
5. Click "Install"

### Expected Results:
- [ ] Install icon appears in address bar
- [ ] Install dialog shows:
  - App name: "Shopping Manager"
  - App icon (green cart icon)
  - Install button
- [ ] After clicking Install:
  - [ ] App window opens in standalone mode (no browser UI)
  - [ ] App appears in:
    - **Windows:** Start Menu and Desktop
    - **Mac:** Applications folder and Launchpad
    - **Linux:** Applications menu
  - [ ] Window title shows "Shopping Manager" or "Shopping"
  - [ ] Theme color (#10b981 green) applied to window frame

### Standalone Mode Verification:
- [ ] No browser address bar visible
- [ ] No browser tabs visible
- [ ] No browser bookmarks bar
- [ ] App has its own window controls (minimize, maximize, close)
- [ ] App appears in system task switcher as separate app

### Post-Installation:
1. Close the installed app
2. Launch it again from desktop/start menu

- [ ] App launches in standalone mode again
- [ ] All functionality works as before
- [ ] Data persists (LocalStorage intact)

**Status:** ⬜ Pass / ⬜ Fail
**Notes:** _______________________________________________

---

## Test 5: Manifest Verification

**Objective:** Verify web app manifest is correct

### Steps:
1. Open DevTools → **Application** tab
2. Click **Manifest** in left sidebar
3. Review manifest properties

### Expected Results:
- [ ] Manifest URL: `http://localhost:4173/manifest.webmanifest`
- [ ] **Name:** "Shopping Manager"
- [ ] **Short name:** "Shopping"
- [ ] **Description:** "Gestión inteligente de inventario y compras"
- [ ] **Start URL:** "/"
- [ ] **Display mode:** "standalone"
- [ ] **Theme color:** #10b981 (green)
- [ ] **Background color:** #ffffff (white)
- [ ] **Icons:**
  - [ ] 192x192 icon present
  - [ ] 512x512 icon present with "maskable" purpose
- [ ] No manifest errors or warnings

### Identity Section:
- [ ] All identity fields populated correctly
- [ ] Icon preview shows green cart icon

### Presentation Section:
- [ ] Display mode is "standalone"
- [ ] Orientation is not locked (or appropriate value)

**Status:** ⬜ Pass / ⬜ Fail
**Notes:** _______________________________________________

---

## Test 6: Lighthouse PWA Audit

**Objective:** Verify app passes PWA best practices

### Steps:
1. Open app in Chrome
2. Open DevTools (F12)
3. Go to **Lighthouse** tab
4. Select **"Progressive Web App"** category only
5. Select **"Desktop"** or **"Mobile"** device
6. Click **"Analyze page load"**
7. Wait for audit to complete

### Expected Results:
- [ ] **PWA Score:** ≥ 90 (target: 100)
- [ ] **Installable:** ✅ Pass
- [ ] **PWA Optimized:** ✅ Pass
- [ ] **Fast and reliable:** ✅ Pass
- [ ] **Service worker:** ✅ Registered
- [ ] **Offline capable:** ✅ Pass
- [ ] **Page load fast on mobile:** ✅ Pass (< 3s)

### Core PWA Checklist Items:
- [ ] Registers a service worker that controls page and start_url
- [ ] Web app manifest meets installability requirements
- [ ] Configured for a custom splash screen
- [ ] Sets a theme color for the address bar
- [ ] Content is sized correctly for the viewport
- [ ] Has a `<meta name="viewport">` tag with width or initial-scale
- [ ] Provides a valid apple-touch-icon
- [ ] Provides valid icons for installability

### Failed Checks (if any):
_Document any failed checks and reasons:_

**Status:** ⬜ Pass / ⬜ Fail
**PWA Score:** _____/100
**Notes:** _______________________________________________

---

## Test 7: Service Worker Update Flow

**Objective:** Verify app updates when new version deployed

### Steps:
1. Note current service worker version in DevTools
2. Make a small visible change in code (e.g., change a text string in HomePage)
3. Run `npm run build` again
4. Keep preview server running (or restart with `npm run preview`)
5. With old version still open in browser, reload page

### Expected Results:
- [ ] Console shows: `"Nueva versión disponible. Actualizando..."`
- [ ] New service worker downloads in background
- [ ] Page reloads automatically (autoUpdate mode)
- [ ] New content/changes are visible after reload
- [ ] Old service worker is replaced by new one in DevTools

### Verification:
1. Check DevTools → Application → Service Workers
- [ ] Only one service worker active (new version)
- [ ] No "waiting" service worker stuck

**Status:** ⬜ Pass / ⬜ Fail
**Notes:** _______________________________________________

---

## Test 8: Cross-Browser Compatibility

**Objective:** Verify PWA works across different browsers

### Chrome/Edge (Chromium):
- [ ] Service worker registers ✅
- [ ] Install prompt available ✅
- [ ] Offline mode works ✅
- [ ] Standalone mode works ✅

### Safari (macOS):
- [ ] Service worker registers ✅
- [ ] Basic caching works ✅
- [ ] Manual "Add to Home Screen" option available ✅
- [ ] Standalone mode works (limited) ✅
- **Known limitations:** No automatic install prompt

### Firefox:
- [ ] Service worker registers ✅
- [ ] Offline mode works ✅
- [ ] Install capability (if supported) ✅

**Status:** ⬜ Pass / ⬜ Fail
**Notes:** _______________________________________________

---

## Test 9: Mobile Device Testing (Optional)

**Objective:** Test on real mobile devices

### Required Setup:
To test on mobile, you need to expose the preview server:

```bash
# Option 1: Use ngrok (recommended)
ngrok http 4173

# Option 2: Use preview server with --host flag
npm run preview -- --host
```

### Android Device (Chrome):
- [ ] App accessible via HTTPS URL
- [ ] Install banner appears at bottom of screen
- [ ] "Add to Home Screen" option in Chrome menu
- [ ] App installs to home screen with correct icon
- [ ] Splash screen appears on launch
- [ ] App opens in fullscreen (no browser UI)
- [ ] Offline mode works
- [ ] Theme color applied to status bar

### iOS Device (Safari):
- [ ] App accessible via HTTPS URL
- [ ] Share button → "Add to Home Screen" option available
- [ ] App icon appears on home screen
- [ ] App launches in standalone mode
- [ ] Basic offline functionality works

**Note:** Mobile testing requires HTTPS. Use ngrok or deploy to staging environment.

**Status:** ⬜ Pass / ⬜ Fail / ⬜ Skipped
**Notes:** _______________________________________________

---

## Test 10: MSW Compatibility (Regression Test)

**Objective:** Verify PWA doesn't break E2E tests with MSW

### Steps:
```bash
# Run E2E tests
npm run test:e2e
```

### Expected Results:
- [ ] All 25 E2E tests pass
- [ ] No service worker conflicts
- [ ] Console shows: `"PWA Service Worker registration skipped (MSW active)"`
- [ ] MSW service worker intercepts requests correctly
- [ ] No cache interference with MSW mocking

**Status:** ⬜ Pass / ⬜ Fail
**Test Results:** _____/25 passed
**Notes:** _______________________________________________

---

## Overall Test Summary

### Test Results:
- Total Tests: 10
- Passed: _____
- Failed: _____
- Skipped: _____

### Critical Issues Found:
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

### Non-Critical Issues:
1. _______________________________________________
2. _______________________________________________

### Recommendations:
- _______________________________________________
- _______________________________________________

### Sign-Off:
- [ ] All critical tests passed
- [ ] Ready for production deployment
- [ ] Ready to archive OpenSpec change

**Tester Signature:** _____________________
**Date:** _____________________

---

## Appendix: Useful DevTools Commands

### Clear Service Worker and Caches:
```javascript
// In browser console:

// Unregister all service workers
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(r => r.unregister())
})

// Clear all caches
caches.keys().then(keys => {
  keys.forEach(key => caches.delete(key))
})
```

### Check Service Worker Status:
```javascript
// In browser console:
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('Service Worker:', reg)
  console.log('Active:', reg?.active?.state)
  console.log('Waiting:', reg?.waiting?.state)
})
```

### Force Service Worker Update:
```javascript
// In browser console:
navigator.serviceWorker.getRegistration().then(reg => {
  reg?.update()
})
```

---

**Document Version:** 1.0
**Last Updated:** 2025-12-23
**OpenSpec Change:** pwa-installable-app