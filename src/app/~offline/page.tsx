import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Offline | QuickRecall' };

// Offline fallback shown by the service worker when a navigation misses the cache while the
// device is offline (see the `fallbacks` config in src/app/sw.ts). Kept intentionally
// dependency-light — no theme provider, no data — so it precaches cleanly and always renders.
export default function OfflinePage() {
  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        background: '#ffffff',
        color: '#1a1a1a'
      }}
    >
      <div style={{ fontSize: '2.5rem', lineHeight: 1 }} aria-hidden>
        📡
      </div>
      <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>You&apos;re offline</h1>
      <p style={{ margin: 0, maxWidth: '28rem', color: '#555', lineHeight: 1.5 }}>
        This page hasn&apos;t been saved for offline use yet. Reconnect to load it, or open a page you&apos;ve already visited — those
        work offline. Tip: use <strong>Download for offline</strong> in the header to save everything ahead of time.
      </p>
      <a
        href="/"
        style={{
          marginTop: '0.5rem',
          display: 'inline-block',
          padding: '0.6rem 1.25rem',
          borderRadius: '0.5rem',
          background: '#2196f3',
          color: '#fff',
          textDecoration: 'none',
          fontWeight: 600
        }}
      >
        Go to home
      </a>
    </main>
  );
}
