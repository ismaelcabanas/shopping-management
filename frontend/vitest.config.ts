/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    // Unit tests configuration
    environment: 'node', // Default to node environment (no jsdom/webidl-conversions)
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    // Fix for CI environment issues with browser APIs
    pool: 'forks',
    isolate: false,
    // Additional environment configuration for CI stability
    testTimeout: 30000,
    hookTimeout: 30000,
    // Include only unit tests (co-located in src)
    include: [
      'src/**/*.{test,spec}.{js,ts,jsx,tsx}'
    ],
    // Exclude integration and e2e tests
    exclude: [
      'tests/**/*',
      '**/*.integration.{test,spec}.{js,ts,jsx,tsx}',
      '**/*.e2e.{test,spec}.{js,ts,jsx,tsx}',
      'node_modules/**/*'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/', // Exclude integration/e2e tests from coverage
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        '**/*.integration.test.*',
        '**/*.e2e.test.*'
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