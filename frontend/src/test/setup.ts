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

// Fix for URL constructor issues in CI
if (typeof global.URL === 'undefined') {
  global.URL = URL;
}

// Comprehensive polyfills for webidl-conversions and whatwg-url compatibility
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = class TextEncoder {
    encode(input: string = ''): Uint8Array {
      const buf = Buffer.from(input, 'utf8');
      return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
    }
  };
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = class TextDecoder {
    decode(input?: BufferSource): string {
      if (!input) return '';
      if (input instanceof ArrayBuffer) {
        return Buffer.from(input).toString('utf8');
      }
      if (ArrayBuffer.isView(input)) {
        return Buffer.from(input.buffer, input.byteOffset, input.byteLength).toString('utf8');
      }
      return '';
    }
  };
}

// Fix for webidl-conversions module expecting browser globals
if (typeof globalThis.process === 'undefined') {
  // @ts-expect-error - Polyfill for test environment
  globalThis.process = process;
}

// Ensure proper global context for webidl-conversions
if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = <T>(val: T): T => JSON.parse(JSON.stringify(val));
}

// Additional browser API mocks for complete JSDOM compatibility
if (typeof global.crypto === 'undefined') {
  global.crypto = {
    getRandomValues: (arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
    // @ts-expect-error - Minimal crypto polyfill
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9)
  };
}