'use client';
/**
 * TOAST NOTIFICATIONS — JAVASCRIPT VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Key concepts: context as an app-wide API (useToast), a stack of timed items,
 * per-toast auto-dismiss with setTimeout, manual dismiss.
 *
 * Styling is intentionally minimal — the context + timer design is the interview.
 */
import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

const COLORS = { success: '#16a34a', error: '#dc2626', info: '#2563eb' };

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // The API the whole app calls: addToast('Saved!', 'success')
  const addToast = useCallback(
    (message, type = 'info') => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismiss(id), 3000); // auto-dismiss; id-based so no stale closure issues
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {/* The stack renders once here, above everything (position: absolute within the demo) */}
      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 10 }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 6,
              color: 'white',
              background: COLORS[t.type],
              minWidth: 220
            }}
          >
            <span style={{ flex: 1, fontSize: 14 }}>{t.message}</span>
            <button onClick={() => dismiss(t.id)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 16 }}>
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Consumer hook — throws early if used outside the provider
function useToast() {
  const addToast = useContext(ToastContext);
  if (!addToast) throw new Error('useToast must be used within ToastProvider');
  return addToast;
}

// ── Demo ─────────────────────────────────────────────────────────────────────

function DemoButtons() {
  const toast = useToast();
  return (
    <div style={{ display: 'flex', gap: 8, padding: 24, justifyContent: 'center' }}>
      <button onClick={() => toast('Profile saved!', 'success')} style={{ padding: '8px 16px', cursor: 'pointer' }}>
        Success
      </button>
      <button onClick={() => toast('Request failed.', 'error')} style={{ padding: '8px 16px', cursor: 'pointer' }}>
        Error
      </button>
      <button onClick={() => toast('New version available.', 'info')} style={{ padding: '8px 16px', cursor: 'pointer' }}>
        Info
      </button>
    </div>
  );
}

export default function ToastNotifications() {
  return (
    <div style={{ position: 'relative', minHeight: 260 }}>
      <ToastProvider>
        <DemoButtons />
      </ToastProvider>
    </div>
  );
}
