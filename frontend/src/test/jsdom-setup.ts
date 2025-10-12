// JSDOM-specific setup for webidl-conversions compatibility
// This file runs BEFORE jsdom loads webidl-conversions

// Essential polyfills for webidl-conversions in CI environment
if (typeof globalThis.DOMException === 'undefined') {
  // @ts-expect-error - Polyfill for CI jsdom environment
  globalThis.DOMException = class extends Error {
    constructor(message?: string, name?: string) {
      super(message);
      this.name = name || 'DOMException';
    }
  };
}

// Ensure Node.js built-in APIs are available globally
if (typeof globalThis.URL === 'undefined') {
  globalThis.URL = URL;
}

if (typeof globalThis.URLSearchParams === 'undefined') {
  globalThis.URLSearchParams = URLSearchParams;
}

// Additional error constructors that webidl-conversions might expect
if (typeof globalThis.TypeError === 'undefined') {
  globalThis.TypeError = TypeError;
}

if (typeof globalThis.RangeError === 'undefined') {
  globalThis.RangeError = RangeError;
}

// Polyfills loaded successfully for webidl-conversions compatibility