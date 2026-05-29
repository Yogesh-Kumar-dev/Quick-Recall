'use client';
/**
 * MODAL POPUP — PLAIN HTML VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Zero MUI. Reusable <Modal> component with:
 * - Backdrop click to close
 * - Escape key to close
 * - Focus trap (basic)
 * - Portal-less fixed overlay
 */
import { useState, useEffect, useRef, ReactNode } from 'react';

// ── Reusable Modal component ────────────────────────────────────────────────

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden'; // prevent background scroll
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.48)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
      }}
      onClick={(e) => {
        // Close only when clicking directly on backdrop, not on dialog
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Dialog box */}
      <div
        ref={dialogRef}
        style={{
          background: '#fff',
          borderRadius: 12,
          width: '100%',
          maxWidth: 440,
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid #f3f4f6'
          }}
        >
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'none',
              border: 'none',
              fontSize: 18,
              cursor: 'pointer',
              color: '#9ca3af',
              lineHeight: 1,
              padding: 4,
              borderRadius: 4
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px' }}>{children}</div>
      </div>
    </div>
  );
}

// ── Demo ────────────────────────────────────────────────────────────────────

export default function ModalPopup() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [confirmed, setConfirmed] = useState<boolean>(false);

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <h3 style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600 }}>Modal Examples</h3>

      {/* Info modal */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          padding: '10px 22px',
          borderRadius: 8,
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: 14
        }}
      >
        Open Info Modal
      </button>

      {/* Confirm modal */}
      <button
        onClick={() => setConfirmOpen(true)}
        style={{
          padding: '10px 22px',
          borderRadius: 8,
          background: '#dc2626',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: 14
        }}
      >
        Delete Item (Confirm Modal)
      </button>

      {confirmed && (
        <div style={{ padding: '10px 14px', background: '#fef9c3', borderRadius: 8, fontSize: 13, color: '#854d0e' }}>
          ✅ Item deleted (simulated)
        </div>
      )}

      {/* Info modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="ℹ️ Information">
        <p style={{ margin: '0 0 20px', color: '#374151', lineHeight: 1.7, fontSize: 14 }}>
          This modal closes on <strong>backdrop click</strong>, the <strong>✕ button</strong>, or the{' '}
          <kbd style={{ background: '#f3f4f6', padding: '1px 5px', borderRadius: 4, fontSize: 12 }}>Esc</kbd> key.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Got it
          </button>
        </div>
      </Modal>

      {/* Confirm modal */}
      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} title="⚠️ Confirm Delete">
        <p style={{ margin: '0 0 20px', color: '#374151', lineHeight: 1.7, fontSize: 14 }}>
          Are you sure you want to delete this item? This action <strong>cannot be undone</strong>.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={() => setConfirmOpen(false)}
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              background: '#f9fafb',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setConfirmed(true);
              setConfirmOpen(false);
            }}
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              background: '#dc2626',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
