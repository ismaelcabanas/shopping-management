# Mobile Installation Guide - Shopping Manager

This guide explains how to install Shopping Manager as a Progressive Web App (PWA) on your device for a native app-like experience.

## Benefits of Installing

✅ **Quick Access** - Launch directly from your home screen/desktop
✅ **Offline Mode** - Access your shopping list even without internet
✅ **Native Feel** - Fullscreen experience without browser UI
✅ **Auto Updates** - App updates automatically in the background
✅ **Faster Loading** - Cached assets load instantly

---

## Android Installation

### Chrome, Edge, or Samsung Internet

1. **Open the app** in your mobile browser
2. **Look for the install prompt** in one of these locations:
   - Address bar: Small install icon (⊕)
   - Bottom of screen: "Add to Home Screen" banner
3. **Tap "Install"** or "Add to Home Screen"
4. **Confirm** when prompted
5. **Done!** App icon appears on your home screen

**Alternative Method:**
1. Open the app in Chrome
2. Tap the **⋮** (menu) button
3. Select **"Install app"** or **"Add to Home Screen"**
4. Confirm installation

---

## iOS Installation

### Safari (iOS 13+)

⚠️ **Note:** iOS Safari requires manual installation (no automatic prompt)

1. **Open the app** in Safari
2. **Tap the Share button** (□↑) at the bottom center of the screen
3. **Scroll down** and select **"Add to Home Screen"**
4. **Customize the name** if desired (default: "Shopping")
5. **Tap "Add"** in the top right
6. **Done!** App icon appears on your home screen

**Limitations on iOS:**
- Must use Safari browser (Chrome/Firefox on iOS won't work)
- Some features like background sync not available
- Storage limits may be more restrictive

---

## Desktop Installation

### Windows, Mac, or Linux (Chrome/Edge)

1. **Open the app** in Chrome or Edge
2. **Look for the install icon** (⊕) in the address bar (right side)
3. **Click "Install"**
4. **Confirm** in the dialog
5. **Done!** App appears in:
   - **Windows:** Start Menu & Desktop
   - **Mac:** Applications folder & Launchpad
   - **Linux:** Applications menu

**Alternative Method:**
1. Click **⋮** (menu) → **"Install Shopping Manager..."**
2. Confirm installation

---

## Verifying Installation

After installing, verify the app works correctly:

✅ **Standalone Mode:**
   - App opens without browser address bar/tabs
   - Fullscreen experience

✅ **Offline Mode:**
   - Open the app
   - Turn on Airplane Mode
   - App should still load (shows cached data)
   - Shopping list and inventory accessible

✅ **Home Screen Icon:**
   - App icon visible with "Shopping" label
   - Tap icon launches the app directly

---

## Troubleshooting

### "Install" button not appearing (Android/Desktop)

**Possible causes:**
1. **Not served over HTTPS** - PWA requires secure connection
   - Solution: Ensure URL starts with `https://`
2. **Already installed** - Can't install twice
   - Solution: Check if app already on home screen/desktop
3. **Browser not supported** - Old browser version
   - Solution: Update Chrome/Edge to latest version
4. **Manifest issues** - Technical problem
   - Solution: Try clearing browser cache and reload

### App not working offline (iOS)

**Common issues:**
1. **First visit** - Service worker not yet cached
   - Solution: Visit all important pages once while online
2. **Safari limitations** - iOS has stricter caching
   - Solution: Reopen app periodically to keep cache fresh
3. **Storage quota exceeded** - iOS may clear cache
   - Solution: Reinstall app if needed

### App icon missing after installation

**Solutions:**
- **Android:** Check App Drawer (swipe up from home screen)
- **iOS:** Swipe right to last home screen page
- **Desktop:** Search for "Shopping" in Start Menu/Spotlight

### Updates not appearing

**How updates work:**
- Service worker checks for updates on app launch
- Updates download in background
- App uses new version on next launch

**If stuck on old version:**
1. Close app completely
2. Force-stop browser (Android: Settings → Apps)
3. Reopen app - should update automatically

---

## Uninstalling

### Android
1. Long-press app icon on home screen
2. Select "App info" or drag to "Uninstall"
3. Confirm uninstallation

### iOS
1. Long-press app icon on home screen
2. Select "Remove App"
3. Choose "Delete App"
4. Confirm deletion

### Desktop (Chrome/Edge)
1. Open the app
2. Click **⋮** (menu) → **"Uninstall Shopping Manager..."**
3. Confirm uninstallation

**Note:** Uninstalling removes the app but **NOT your data**. Shopping list and inventory remain in browser storage.

---

## FAQ

### What is a PWA?

A Progressive Web App is a website that can be installed like a native app. It combines the best of web and mobile apps:
- No app store required
- Small download size (compared to native apps)
- Auto-updates without user action
- Works offline with cached data

### Does it use storage on my device?

Yes, but very little:
- **App shell:** ~350 KB (HTML, JS, CSS)
- **User data:** Varies (shopping list, products)
- **Total:** Usually < 5 MB

### Will it drain my battery?

No. PWAs are more efficient than native apps because:
- No background processes (unless explicitly running)
- Lightweight compared to native apps
- Service worker only active when needed

### Do I need an internet connection?

**After first install:**
- ✅ **Shopping list** - Works offline (LocalStorage)
- ✅ **Inventory** - Works offline (LocalStorage)
- ✅ **Navigation** - Works offline (cached pages)
- ❌ **Ticket scanning** - Requires internet (Ollama API)
- ❌ **Initial load** - Requires internet (first visit)

### How do I know if I'm offline?

The app shows console messages:
- "Modo sin conexión activado" when going offline
- "Conexión restaurada" when back online

### Can I use it on multiple devices?

Yes, but each device has **independent data** (no sync):
- Install on phone → Data on phone only
- Install on tablet → Data on tablet only
- Changes don't sync between devices

---

## Need Help?

If you encounter issues not covered in this guide:
1. Check browser console for error messages
2. Try clearing browser cache and reinstalling
3. Report issues at: [GitHub Issues](https://github.com/your-repo/shopping-manager/issues)

---

**Last Updated:** 2025-12-23
**Version:** 1.0.0
