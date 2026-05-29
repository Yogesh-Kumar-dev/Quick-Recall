'use client';
/**
 * DROPDOWN — PLAIN HTML VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Custom dropdown built with zero libraries.
 * Key patterns: click-outside handler (useRef + document listener),
 * controlled open/selected state, keyboard accessibility.
 */
import { useState, useRef, useEffect } from 'react';

const OPTIONS = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape', 'Honeydew', 'Kiwi', 'Lemon'];

export default function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  function handleSelect(option: string) {
    setSelected(option);
    setIsOpen(false);
  }

  return (
    <div style={{ padding: 24 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, letterSpacing: 0.5 }}>
        SELECT A FRUIT
      </label>

      <div ref={containerRef} style={{ position: 'relative', width: 260 }}>
        {/* Trigger button */}
        <button
          onClick={() => setIsOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          style={{
            width: '100%',
            padding: '10px 14px',
            fontSize: 14,
            borderRadius: 8,
            border: `1px solid ${isOpen ? '#2563eb' : '#d1d5db'}`,
            background: '#fff',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: isOpen ? '0 0 0 3px rgba(37,99,235,0.15)' : 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s'
          }}
        >
          <span style={{ color: selected ? '#111827' : '#9ca3af' }}>{selected ?? 'Choose an option…'}</span>
          <span
            style={{
              fontSize: 10,
              color: '#6b7280',
              transition: 'transform 0.2s',
              transform: isOpen ? 'rotate(180deg)' : 'none'
            }}
          >
            ▼
          </span>
        </button>

        {/* Dropdown list */}
        {isOpen && (
          <ul
            role="listbox"
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              zIndex: 200,
              margin: 0,
              padding: '4px 0',
              listStyle: 'none',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              background: '#fff',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              maxHeight: 240,
              overflowY: 'auto'
            }}
          >
            {OPTIONS.map((opt) => (
              <li
                key={opt}
                role="option"
                aria-selected={selected === opt}
                onClick={() => handleSelect(opt)}
                style={{
                  padding: '9px 14px',
                  cursor: 'pointer',
                  fontSize: 14,
                  background: selected === opt ? '#eff6ff' : 'transparent',
                  color: selected === opt ? '#1d4ed8' : '#111827',
                  fontWeight: selected === opt ? 600 : 400,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => {
                  if (selected !== opt) (e.currentTarget as HTMLElement).style.background = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = selected === opt ? '#eff6ff' : 'transparent';
                }}
              >
                {opt}
                {selected === opt && <span style={{ fontSize: 12 }}>✓</span>}
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected && (
        <p style={{ marginTop: 16, fontSize: 14, color: '#374151' }}>
          You selected: <strong style={{ color: '#2563eb' }}>{selected}</strong>
          <button
            onClick={() => setSelected(null)}
            style={{
              marginLeft: 10,
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              fontSize: 12
            }}
          >
            Clear
          </button>
        </p>
      )}
    </div>
  );
}
