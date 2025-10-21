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
            purpose: 'any'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
})
