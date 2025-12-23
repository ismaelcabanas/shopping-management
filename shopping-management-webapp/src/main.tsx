import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'

// Start MSW for E2E tests
// MSW is enabled when VITE_ENABLE_MSW environment variable is set to 'true'
async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MSW !== 'true') {
    return
  }

  const { worker } = await import('./mocks/browser')

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start({
    onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
    quiet: false // Log MSW activity for debugging
  })
}

// Register PWA Service Worker
// Only register if MSW is NOT active (avoid service worker conflicts)
function registerPWAServiceWorker() {
  if (import.meta.env.VITE_ENABLE_MSW === 'true') {
    console.log('PWA Service Worker registration skipped (MSW active)')
    return
  }

  const updateSW = registerSW({
    onNeedRefresh() {
      console.log('Nueva versión disponible. Actualizando...')
      // Note: With autoUpdate mode, the app will update automatically
      // The user will see the new version on next page load
    },
    onOfflineReady() {
      console.log('App lista para funcionar sin conexión')
    },
    onRegistered(registration: ServiceWorkerRegistration | undefined) {
      console.log('Service Worker registrado correctamente', registration)
    },
    onRegisterError(error: unknown) {
      console.error('Error al registrar Service Worker:', error)
    },
  })

  return updateSW
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )

  // Register PWA Service Worker after app renders
  registerPWAServiceWorker()
})
