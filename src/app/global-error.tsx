'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

// Root-level error boundary: catches errors thrown in the root layout itself, so it must render its
// own <html>/<body> and can't rely on globals.css (the root layout is what failed). Styles are
// inlined against the LeafyGreen dark palette. Segment errors are handled by (app)/error.tsx.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          padding: 24,
          textAlign: 'center',
          background: '#001e2b',
          color: '#e8edeb',
          fontFamily: 'system-ui, sans-serif'
        }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>Something went wrong</h1>
        <p style={{ maxWidth: 420, fontSize: 14, color: '#c1c7c6', margin: 0 }}>
          A critical error occurred while loading the app. Try again, and reach out if it keeps happening.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            border: 0,
            borderRadius: 8,
            padding: '10px 20px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            background: '#00ed64',
            color: '#001e2b'
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
