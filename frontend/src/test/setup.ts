import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Cleanup after each test case
afterEach(() => {
  cleanup()
})

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  // uncomment to ignore a specific log level
  // log: vi.fn(),
  // debug: vi.fn(),
  // info: vi.fn(),
  // warn: vi.fn(),
  // error: vi.fn(),
}

// Fix for CI environment - ensure proper global setup
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Fix for ResizeObserver in tests
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Fix for IntersectionObserver in tests
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Essential polyfills for CI environment compatibility
if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = <T>(val: T): T => JSON.parse(JSON.stringify(val));
}

// Fix for webidl-conversions in CI environment - targeted polyfills
// Use type assertions to avoid TypeScript interface conflicts
if (typeof globalThis.DOMException === 'undefined') {
  // @ts-expect-error - Minimal DOMException polyfill for CI environment
  globalThis.DOMException = class extends Error {
    constructor(message?: string, name?: string) {
      super(message);
      this.name = name || 'DOMException';
    }
  };
}

// Ensure Node.js built-in URL/URLSearchParams are available globally
if (typeof globalThis.URL === 'undefined') {
  globalThis.URL = URL;
}

if (typeof globalThis.URLSearchParams === 'undefined') {
  globalThis.URLSearchParams = URLSearchParams;
}