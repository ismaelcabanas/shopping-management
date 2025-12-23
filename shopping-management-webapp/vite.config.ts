import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'icon-192x192.png', 'icon-512x512.png'],
      manifest: {
        name: 'Shopping Manager',
        short_name: 'Shopping',
        description: 'Gestión inteligente de inventario y compras',
        theme_color: '#10b981',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        screenshots: [
          {
            src: 'screenshot-mobile.png',
            sizes: '512x512',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Vista móvil de Shopping Manager'
          },
          {
            src: 'screenshot-wide.png',
            sizes: '512x512',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Vista principal de Shopping Manager'
          }
        ],
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            // Cache static assets (JS, CSS, fonts, images) - Cache First strategy
            urlPattern: /^https?:\/\/.*\.(js|css|woff2?|png|jpg|jpeg|svg|ico|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200], // Cache successful responses
              },
            },
          },
          {
            // HTML pages - Network First with cache fallback
            urlPattern: /^https?:\/\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
              networkTimeoutSeconds: 3, // Fallback to cache after 3s
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    })
  ],
})
