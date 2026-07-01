'use client';
/**
 * TABS COMPONENT — JAVASCRIPT VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * React without TypeScript — plain JS syntax, no type annotations.
 * This is how you'd write it in a CodeSandbox or interview environment.
 */
import { useState, useRef } from 'react';

const TABS = [
  {
    label: 'Overview',
    badge: 0,
    content: () => (
      <div>
        <p style={{ fontWeight: 700, fontSize: 15, margin: '0 0 8px' }}>📊 Project Overview</p>
        <p style={{ fontSize: 14, color: '#666', margin: '0 0 12px' }}>
          This tab was rendered the first time you opened it and stays mounted after that. Switch tabs and back — it does not re-mount.
        </p>
        <span style={{ fontSize: 12, background: '#e3f2fd', color: '#1976d2', padding: '3px 10px', borderRadius: 10 }}>
          First rendered: {new Date().toLocaleTimeString()}
        </span>
      </div>
    )
  },
  {
    label: 'Activity',
    badge: 3,
    content: () => (
      <div>
        <p style={{ fontWeight: 700, fontSize: 15, margin: '0 0 10px' }}>🔔 Recent Activity</p>
        {['PR #42 merged by @alice', 'Issue #18 opened by @bob', 'Deployment to staging succeeded'].map((item) => (
          <div key={item} style={{ padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: 6, marginBottom: 6, fontSize: 14 }}>
            {item}
          </div>
        ))}
      </div>
    )
  },
  {
    label: 'Settings',
    badge: 0,
    content: () => (
      <div>
        <p style={{ fontWeight: 700, fontSize: 15, margin: '0 0 8px' }}>⚙️ Settings</p>
        <p style={{ fontSize: 14, color: '#666', margin: 0 }}>Lazy loaded — not rendered until you first clicked this tab.</p>
      </div>
    )
  },
  {
    label: 'Members',
    badge: 12,
    content: () => (
      <div>
        <p style={{ fontWeight: 700, fontSize: 15, margin: '0 0 10px' }}>👥 Team Members</p>
        {['Alice Chen', 'Bob Kumar', 'Carol Smith', 'Dan Lee'].map((name) => (
          <div key={name} style={{ padding: '6px 10px', background: '#f5f5f5', borderRadius: 4, marginBottom: 6, fontSize: 14 }}>
            {name}
          </div>
        ))}
      </div>
    )
  }
];

export default function Tabs() {
  const [activeTab, setActiveTab] = useState(0);
  const [mountedTabs, setMountedTabs] = useState(new Set([0]));
  const tabRefs = useRef([]);

  const activateTab = (index) => {
    setActiveTab(index);
    setMountedTabs((prev) => new Set(prev).add(index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (activeTab + 1) % TABS.length;
      activateTab(next);
      tabRefs.current[next]?.focus();
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (activeTab - 1 + TABS.length) % TABS.length;
      activateTab(prev);
      tabRefs.current[prev]?.focus();
    }
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <div role="tablist" onKeyDown={handleKeyDown} style={{ display: 'flex', borderBottom: '2px solid #e0e0e0' }}>
        {TABS.map((tab, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={activeTab === i}
            tabIndex={activeTab === i ? 0 : -1}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            onClick={() => activateTab(i)}
            style={{
              position: 'relative',
              padding: '10px 16px',
              border: 'none',
              borderBottom: activeTab === i ? '2px solid #1976d2' : '2px solid transparent',
              background: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: activeTab === i ? 700 : 400,
              color: activeTab === i ? '#1976d2' : '#555',
              marginBottom: -2,
              transition: 'color 0.15s'
            }}
          >
            {tab.label}
            {tab.badge > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  background: '#f44336',
                  color: '#fff',
                  borderRadius: '50%',
                  width: 16,
                  height: 16,
                  fontSize: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div style={{ border: '1px solid #e0e0e0', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: 20, minHeight: 160 }}>
        {TABS.map((tab, i) => (
          <div key={i} role="tabpanel" style={{ display: activeTab === i ? 'block' : 'none' }}>
            {mountedTabs.has(i) && <tab.content />}
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, color: '#999', marginTop: 10 }}>
        💡 Try: Switch tabs with ← → arrow keys. Tab content is preserved (lazy mount + keep-alive).
      </p>
    </div>
  );
}
