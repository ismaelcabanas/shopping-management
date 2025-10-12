/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    // Integration tests configuration
    environment: 'jsdom', // Use jsdom for DOM testing
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    pool: 'forks',
    isolate: true, // Isolate integration tests for better reliability
    testTimeout: 60000, // Longer timeout for integration tests
    hookTimeout: 60000,
    // Include only integration tests
    include: [
      'tests/integration/**/*.{test,spec}.{js,ts,jsx,tsx}',
      '**/*.integration.{test,spec}.{js,ts,jsx,tsx}'
    ],
    // Exclude unit tests and e2e tests
    exclude: [
      'src/**/*.test.{js,ts,jsx,tsx}',
      'tests/e2e/**/*',
      '**/*.e2e.{test,spec}.{js,ts,jsx,tsx}',
      'node_modules/**/*'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: 'coverage/integration',
      exclude: [
        'node_modules/',
        'tests/e2e/',
        'tests/fixtures/',
        'tests/utils/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        '**/*.e2e.test.*'
      ]
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})