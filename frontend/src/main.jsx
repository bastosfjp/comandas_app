import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Small safe console wrapper to avoid React DevTools installHook throwing
// when console.* is called with objects that cannot be converted to primitives.
function safeStringify(arg) {
  try {
    if (typeof arg === 'string') return arg;
    const seen = new WeakSet();
    return JSON.stringify(arg, function (k, v) {
      if (v && typeof v === 'object') {
        if (seen.has(v)) return '[Circular]';
        seen.add(v);
      }
      return v;
    }, 2);
  } catch (e) {
    try {
      return String(arg);
    } catch (e2) {
      return '[Unserializable]';
    }
  }
}

['error','warn','info','log','debug'].forEach((method) => {
  const original = console[method];
  console[method] = function (...args) {
    try {
      const safeArgs = args.map(a => (typeof a === 'object' ? safeStringify(a) : a));
      return original.apply(console, safeArgs);
    } catch (e) {
      try { return original.apply(console, ['[ConsoleError]', e]); } catch { /* ignore */ }
    }
  };
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
