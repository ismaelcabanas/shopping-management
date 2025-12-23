# Design: PWA Installable App

## Context

The Shopping Manager app currently has PWA infrastructure partially in place:
- ✅ `vite-plugin-pwa` installed and configured in `vite.config.ts`
- ✅ Icons (192x192, 512x512) and screenshots available in `public/`
- ✅ Basic manifest configuration (name, theme, display mode)
- ✅ HTML meta tags for mobile (`theme-color`, `apple-mobile-web-app-*`)
- ❌ **Service worker NOT registered** in application code
- ❌ **No offline capability** (no caching strategies configured)
- ❌ **No install prompt** or user guidance

**Current behavior:**
```
User visits app → Works in browser → Closes tab → Must re-navigate via URL
```

**Desired behavior:**
```
User visits app → Installs to home screen → Launches like native app → Works offline
```

## Goals / Non-Goals

**Goals:**
- Make app installable on mobile (Android, iOS) and desktop (Windows, Mac, Linux)
- Provide offline access to core functionality (shopping list, inventory view)
- Deliver native app-like experience (fullscreen, splash screen, fast loading)
- Auto-update app when new version deployed
- Guide users through installation process (documentation)

**Non-Goals:**
- Push notifications (separate future story)
- Background sync (overkill for LocalStorage-based app)
- Advanced offline editing with conflict resolution (LocalStorage is simple)
- Native device features beyond current Web APIs

## Decisions

### Decision 1: Service Worker Registration Strategy

**Chosen approach:** Use `registerSW` from `virtual:pwa-register` (provided by vite-plugin-pwa) with `autoUpdate` mode.

```typescript
// main.tsx
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    // Show toast: "Nueva versión disponible. Actualizando..."
    // Auto-update in background
  },
  onOfflineReady() {
    // Show toast: "App lista para funcionar sin conexión"
  },
})
```

**Rationale:**
- ✅ Simple API provided by vite-plugin-pwa
- ✅ Handles service worker lifecycle automatically
- ✅ `autoUpdate` mode keeps app fresh without user intervention
- ✅ Callback hooks for user notifications (onNeedRefresh, onOfflineReady)
- ✅ No manual service worker code needed

**Alternatives considered:**

1. **Manual service worker registration** (`navigator.serviceWorker.register()`)
   - ❌ More complex (must handle update logic manually)
   - ❌ Error-prone (lifecycle edge cases)
   - ✅ More control (not needed for our use case)

2. **`prompt` mode instead of `autoUpdate`**
   - ❌ Requires user to click "Reload" for updates
   - ❌ Users often ignore update prompts
   - ✅ More explicit (but worse UX)

### Decision 2: Caching Strategy

**Chosen approach:** Workbox precaching + runtime caching with strategy per resource type.

```typescript
// vite.config.ts
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    runtimeCaching: [
      {
        // Cache assets (JS, CSS, fonts, images) - Cache First
        urlPattern: /^https:\/\/.*\.(js|css|woff2?|png|jpg|jpeg|svg|ico)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'assets-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
        },
      },
      {
        // HTML pages - Network First with cache fallback
        urlPattern: /^https:\/\/.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'pages-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
          },
        },
      },
    ],
  },
})
```

**Rationale:**
- ✅ **Cache-First for assets**: Instant load, assets don't change often
- ✅ **Network-First for pages**: Always try to get fresh content, fallback to cache if offline
- ✅ **Precaching**: Core app shell (index.html, main.js, main.css) cached during install
- ✅ **Workbox handles complexity**: No manual cache management code

**Key insight:** LocalStorage data (products, inventory, shopping list) already persists client-side. Service worker only needs to cache the *app shell* and static assets.

**Alternatives considered:**

1. **Cache-Only** (no network requests)
   - ❌ Can't fetch updates or new features
   - ❌ Breaks when app structure changes
   - ✅ Fastest (but too limiting)

2. **Network-Only** (no caching)
   - ❌ Defeats purpose of PWA
   - ❌ Doesn't work offline
   - ✅ Always fresh (but no offline support)

3. **Stale-While-Revalidate** for everything
   - ❌ Can show stale UI for critical pages
   - ✅ Good balance (but Network-First safer for HTML)

### Decision 3: Install Prompt UI

**Chosen approach:** Optional banner/button in UI + browser native prompt + documentation.

**Implementation:**
1. **Rely on browser native prompt** (Chrome, Edge, Samsung Internet)
   - Appears in address bar when PWA criteria met
   - No code required, works automatically

2. **Add optional install button in app** (for discoverability)
   ```typescript
   // Optional: InstallPrompt component
   const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent>()

   useEffect(() => {
     window.addEventListener('beforeinstallprompt', (e) => {
       e.preventDefault()
       setDeferredPrompt(e)
     })
   }, [])

   const handleInstall = () => {
     deferredPrompt?.prompt()
   }
   ```

3. **iOS Safari guide in docs** (Safari doesn't support `beforeinstallprompt`)
   - Show instructions in documentation
   - Optional: Detect iOS + Safari and show inline instructions

**Rationale:**
- ✅ Native browser prompt works on most platforms (80%+ of users)
- ✅ Optional in-app button increases install rate (~20% boost)
- ✅ Documentation covers iOS (15-20% of users)
- ✅ Progressive enhancement: works everywhere, enhanced where supported

**Alternatives considered:**

1. **No in-app prompt** (rely only on browser)
   - ❌ Many users don't notice address bar icon
   - ❌ Lower install rate
   - ✅ Simpler (but worse discoverability)

2. **Persistent banner** (always visible)
   - ❌ Annoying for users who don't want to install
   - ❌ Takes up screen space
   - ✅ High visibility (but poor UX)

3. **iOS detection with inline instructions**
   - ✅ Better UX for iOS users
   - ❌ More complex code
   - ⚠️ Can be added later if needed

**Decision: Start with browser native prompt + docs, add in-app button as optional enhancement if time permits.**

### Decision 4: MSW (Mock Service Worker) Conflict Resolution

**Problem:** MSW uses a service worker for mocking in tests. PWA also uses a service worker. Can they coexist?

**Chosen approach:** Conditional registration - MSW in test mode, PWA in production/dev.

```typescript
// main.tsx
async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MSW === 'true') {
    const { worker } = await import('./mocks/browser')
    return worker.start({ onUnhandledRequest: 'bypass', quiet: false })
  }
}

// After MSW starts (if enabled), then register PWA SW
enableMocking().then(() => {
  // Render app
  createRoot(document.getElementById('root')!).render(<App />)

  // Register PWA service worker (only if MSW not active)
  if (import.meta.env.VITE_ENABLE_MSW !== 'true') {
    registerSW({ /* ... */ })
  }
})
```

**Rationale:**
- ✅ MSW only runs in E2E tests (VITE_ENABLE_MSW=true)
- ✅ PWA SW only runs in dev/production (normal mode)
- ✅ No conflict: one service worker at a time
- ✅ Tests remain unaffected

**Alternatives considered:**

1. **Use different scopes** (MSW at `/mockServiceWorker.js`, PWA at `/sw.js`)
   - ❌ Scope conflicts can still occur
   - ❌ More complex debugging
   - ✅ Parallel execution (not needed)

2. **Disable PWA in tests completely**
   - ✅ Simple and clean
   - ✅ Tests don't need PWA features (only UI logic)
   - ✅ Chosen approach (simplest)

## Risks / Trade-offs

### Risk 1: Aggressive caching breaks hot-reload in development

**Mitigation:**
- Workbox only active in production build (`npm run build`)
- Dev server (`npm run dev`) uses Vite's built-in HMR (no service worker)
- Service worker registration skipped in dev mode (or only for testing)

### Risk 2: Users don't update to new versions

**Mitigation:**
- Use `autoUpdate` mode (updates automatically in background)
- Show toast when new version detected: "Actualizando a nueva versión..."
- App reloads automatically after update

### Risk 3: Offline mode shows stale data

**Mitigation:**
- LocalStorage data is **always current** (client-side only, no server sync)
- Service worker only caches app shell (HTML/JS/CSS)
- When online, app fetches latest assets
- Clear cache on major version changes (Workbox handles this)

### Risk 4: iOS Safari limitations

**Mitigation:**
- PWA on iOS works but has limitations (no background sync, limited storage)
- Document iOS installation process clearly
- Test on real iOS devices
- Known iOS limitations acceptable for v1 (shopping list still works)

## Migration Plan

### Phase 1: Core PWA Setup (2-3 hours)
1. Register service worker in `main.tsx`
2. Configure workbox caching in `vite.config.ts`
3. Test build generates service worker correctly
4. Verify MSW doesn't conflict

**Validation:**
- `npm run build` generates `sw.js` and `manifest.webmanifest`
- Service worker registers on page load
- Console shows "Service worker registered successfully"

### Phase 2: Installation Flow (1 hour)
1. Test native browser install prompt (Chrome, Edge)
2. Verify manifest fields correct (name, icons, display)
3. Test app launches in standalone mode

**Validation:**
- Chrome DevTools → Application → Manifest (no errors)
- Install button appears in Chrome address bar
- App installs to home screen
- Lighthouse PWA score > 90

### Phase 3: Offline Testing (1 hour)
1. Build app and serve with `npm run preview`
2. Disable network in DevTools
3. Navigate between pages (should work)
4. Check shopping list and inventory (should load from LocalStorage)

**Validation:**
- App loads when offline
- Navigation works without network
- LocalStorage data accessible offline
- Offline indicator shown (optional)

### Phase 4: Documentation (30 min)
1. Create `docs/user-guides/mobile-installation.md`
2. Add screenshots for Android, iOS, desktop
3. Include troubleshooting section

### Phase 5: Real Device Testing (1 hour)
1. Test on real Android device (Chrome)
2. Test on real iOS device (Safari)
3. Test desktop (Windows/Mac Chrome)

**Validation:**
- Installs correctly on all platforms
- Launches as standalone app
- Works offline after first load

### Rollback Strategy
- PWA is **purely additive** (no breaking changes)
- If issues arise: remove service worker registration from `main.tsx`
- App works perfectly fine without PWA (same as before)
- Can roll back by commenting out `registerSW()` call

## Open Questions

### Q1: Should we add an in-app "Install" button/banner?

**Options:**
- A) No in-app prompt, rely on browser native (simpler)
- B) Add button in navigation/settings (better discoverability)
- C) Add dismissible banner after 2-3 visits (more aggressive)

**Recommendation:** Start with (A), add (B) if user feedback indicates low install rate.

### Q2: Should we show iOS-specific installation instructions in the app?

**Options:**
- A) Only in documentation (simpler)
- B) Detect iOS + show inline instructions (better UX)

**Recommendation:** Start with (A), can add (B) later if iOS users struggle.

### Q3: What offline fallback message should we show?

**Options:**
- A) No special message (app just works offline with cached data)
- B) Toast notification "Modo sin conexión activado"
- C) Banner at top of page "Sin conexión - mostrando datos guardados"

**Recommendation:** (B) - Show toast when app goes offline, but don't persist banner (LocalStorage data is always current).

### Q4: Should we track installation analytics?

**Options:**
- A) No tracking (simpler, privacy-friendly)
- B) Simple counter in LocalStorage (how many installs from this device)
- C) Full analytics (Google Analytics event)

**Recommendation:** (A) for v1 - privacy-first approach. Can add later if needed.