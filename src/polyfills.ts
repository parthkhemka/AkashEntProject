// polyfills.ts - Browser polyfills for Node.js modules needed by Azure SDK

import { Buffer } from 'buffer';

// Create a minimal process polyfill
const processPolyfill = {
  env: {},
  nextTick: (fn: Function) => setTimeout(fn, 0),
  browser: true,
  version: '',
  versions: {},
} as any;

// Polyfill global
if (typeof globalThis === 'undefined') {
  (window as any).globalThis = window;
}

// Polyfill Buffer
if (typeof (globalThis as any).Buffer === 'undefined') {
  (globalThis as any).Buffer = Buffer;
}

// Polyfill process
if (typeof (globalThis as any).process === 'undefined') {
  (globalThis as any).process = processPolyfill;
}

// Polyfill global for legacy code
if (typeof (globalThis as any).global === 'undefined') {
  (globalThis as any).global = globalThis;
}

// Also ensure they're available on window for compatibility
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
  (window as any).process = processPolyfill;
  (window as any).global = globalThis;
}

console.log('✅ Polyfills loaded successfully');
console.log('Buffer available:', typeof Buffer);
console.log('process available:', typeof processPolyfill);
console.log('global available:', typeof (globalThis as any).global);
