/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    // Fix for CI environment issues with browser APIs
    pool: 'forks',
    isolate: false,
    // Additional environment configuration for CI stability
    testTimeout: 30000,
    hookTimeout: 30000,
    // Enhanced JSDOM configuration for webidl-conversions compatibility
    environmentOptions: {
      jsdom: {
        url: 'http://localhost',
        pretendToBeVisual: true,
        resources: 'usable'
      }
    },
    // Server configuration to handle module resolution issues
    server: {
      deps: {
        // Force pre-bundling of problematic dependencies
        include: ['webidl-conversions', 'whatwg-url']
      }
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})