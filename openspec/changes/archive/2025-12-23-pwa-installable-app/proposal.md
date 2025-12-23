# Change: PWA Installable App

## Why

Currently, the Shopping Manager web application requires users to open a browser and navigate to the URL every time they want to use it. While the app is mobile-responsive and works well in mobile browsers, it lacks the native app experience that users expect from mobile applications.

**Current State:**
- PWA infrastructure partially configured (`vite-plugin-pwa` installed, basic manifest exists)
- Icons and screenshots already available in `public/` directory
- Service Worker generated during build but **not registered** in the app
- No offline capability - app fails completely without internet
- No "Add to Home Screen" prompt or installation flow
- Users must bookmark or remember URL to access app

**User Pain Points:**
1. **Access friction**: Opening browser → typing/finding URL → waiting for load
2. **No offline access**: Shopping list unavailable in poor connectivity (e.g., inside supermarkets)
3. **No native feel**: Looks like a website, not an installed app
4. **Missing from home screen**: Can't access like native apps

**Business Value:**
- ✅ Increase user engagement (easier access = more frequent use)
- ✅ Better mobile UX (fullscreen, splash screen, app-like experience)
- ✅ Offline functionality (critical for shopping list usage in stores)
- ✅ Foundation for future features (push notifications, background sync)

## What Changes

Enable full PWA functionality by completing the missing pieces:

### 1. Service Worker Registration
- Register the auto-generated service worker in `main.tsx`
- Handle service worker lifecycle (install, activate, update)
- Add update notification when new version available
- Ensure MSW (Mock Service Worker for tests) doesn't conflict with PWA SW

### 2. Offline Capability
- Configure workbox caching strategies in `vite.config.ts`:
  - **Cache-first** for static assets (JS, CSS, images, fonts)
  - **Network-first** for API calls (with fallback to cache)
  - **Stale-while-revalidate** for product data
- Add offline fallback page/message
- Persist LocalStorage data (already works offline)

### 3. Install Prompt
- Add "Install App" button/banner in UI (optional but recommended)
- Handle `beforeinstallprompt` event
- Track installation analytics (optional)
- Show install instructions for iOS (no native prompt support)

### 4. Enhanced Manifest
- Review and optimize existing `manifest.webmanifest`
- Ensure all required fields present
- Add categories and shortcuts (optional enhancements)

### 5. Documentation
- Create mobile installation guide at `docs/user-guides/mobile-installation.md`:
  - Android Chrome installation steps
  - iOS Safari installation steps
  - Desktop Chrome/Edge installation steps
- Add troubleshooting section
- Include screenshots of installation flow

### 6. Testing & Validation
- Test installation flow on real devices (Android, iOS)
- Verify offline functionality
- Run Lighthouse PWA audit (target score > 90)
- Test service worker update flow

## Impact

**Affected specs:**
- NEW: `pwa` spec - Define PWA installability, offline behavior, service worker lifecycle

**Affected code:**
- Modified: `shopping-management-webapp/src/main.tsx` - Register service worker
- Modified: `shopping-management-webapp/vite.config.ts` - Enhanced PWA config with workbox strategies
- Created: `shopping-management-webapp/src/components/InstallPrompt.tsx` (optional)
- Created: `docs/user-guides/mobile-installation.md` - User guide

**Benefits:**
- ✅ **Installable on all platforms**: Android, iOS, Windows, macOS, Linux
- ✅ **Works offline**: Critical data (shopping list, inventory) accessible without internet
- ✅ **Native app experience**: Fullscreen, splash screen, home screen icon
- ✅ **Auto-updates**: Service worker updates app in background
- ✅ **Better performance**: Cached assets load instantly
- ✅ **Reduced bounce rate**: Easier access = higher retention

**Breaking changes:**
- None (purely additive feature)

**User flow (Android/Desktop):**
1. User visits app in Chrome/Edge
2. Browser shows "Install App" prompt in address bar
3. User clicks "Install"
4. App appears on home screen / desktop
5. User can launch app like native app
6. App works even when offline (with cached data)

**User flow (iOS Safari):**
1. User visits app in Safari
2. User taps Share button → "Add to Home Screen"
3. App appears on home screen
4. User can launch app like native app
5. App works even when offline (with cached data)

**Non-goals:**
- Push notifications (future enhancement, separate user story)
- Background sync (future enhancement)
- Advanced offline conflict resolution (LocalStorage is simple key-value, no conflicts)
- Native app features (camera, contacts, etc.) - already using standard Web APIs