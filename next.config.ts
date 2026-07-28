import { withSentryConfig } from '@sentry/nextjs';
import { withSerwist } from '@serwist/turbopack';
import type { NextConfig } from 'next';

// PWA: this project builds with Turbopack, and @serwist/next's webpack-based compilation is
// incompatible with it — @serwist/turbopack works around the lack of a Turbopack plugin API by
// compiling the service worker via a Route Handler instead (src/app/serwist/[path]/route.ts).
// `withSerwist` here only adds the esbuild/esbuild-wasm packages to serverExternalPackages so
// that route handler can bundle in a Node runtime.
const nextConfig: NextConfig = {
  // Machine-coding pages read their raw source files via readFileSync at render time to show the
  // code alongside the live demo. Under the `force-dynamic` (dashboard) segment that read runs inside
  // the serverless function, but Next's output file tracer only bundles *compiled* modules — the raw
  // source (even the imported .tsx/.jsx demos) is never traced, so the Lambda hits ENOENT and the page
  // 500s / falls into the error boundary. Explicitly trace the raw sources into each function bundle.
  outputFileTracingIncludes: {
    '/js/machine-coding/[slug]': ['./src/views/js-machine-coding/**/*.js'],
    '/machine-coding/**': ['./src/views/machine-coding/**/*.{tsx,jsx}']
  },
  // Eliminate barrel-file import cost for @tabler/icons-react and the @leafygreen-ui packages we
  // use: Next rewrites the named barrel imports to direct per-icon/per-component paths at build
  // time, so we don't pull the whole package surface into the graph.
  experimental: {
    optimizePackageImports: ['@tabler/icons-react', '@leafygreen-ui/callout', '@leafygreen-ui/code', '@leafygreen-ui/expandable-card']
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thesvg.org',
        pathname: '/icons/**'
      }
    ]
  },
  async headers() {
    // Static CSP (no nonce/middleware): 'unsafe-inline' is required for Next's hydration
    // bootstrap scripts and for Emotion's runtime-injected styles (LeafyGreen/EmotionRegistry).
    // connect-src lists the only third parties this app actually talks to from the browser:
    // Sentry error/replay ingest and Firebase Cloud Messaging (push notifications).
    // Turbopack's dev-mode HMR relies on eval() for fast refresh, which a strict script-src blocks —
    // scope 'unsafe-eval' to development only so production stays locked down.
    // gstatic.com: public/firebase-messaging-sw.js importScripts() the firebase compat SDK from
    // there — a worker inherits the CSP of its own response, so without this the SW fails to
    // install and pushes fall back to Chrome's generic "site updated in the background" notice.
    const scriptSrc = `script-src 'self' 'unsafe-inline' https://www.gstatic.com${process.env.NODE_ENV === 'production' ? '' : " 'unsafe-eval'"}`;

    const csp = [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://thesvg.org",
      "font-src 'self' data:",
      "connect-src 'self' https://*.sentry.io https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://firebaseinstallations.googleapis.com https://fcmregistrations.googleapis.com https://firebasemessaging.googleapis.com https://fcm.googleapis.com",
      "worker-src 'self'",
      "manifest-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'"
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' }
        ]
      }
    ];
  }
};

export default withSentryConfig(withSerwist(nextConfig), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'personal-0lg',

  project: 'javascript-nextjs',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Note: the wizard's default `webpack: { treeshake, automaticVercelMonitors }` options are
  // omitted here — this project builds with Turbopack, and those options only take effect
  // under webpack (see the @serwist/turbopack comment above for the same constraint).
});
