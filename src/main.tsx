import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Polyfills for Azure SDK in browser
import { Buffer } from 'buffer';
import process from 'process';

// Make polyfills available globally
(window as any).global = window;
(window as any).Buffer = Buffer;
(window as any).process = process;

import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
