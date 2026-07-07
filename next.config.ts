import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';
import { withSerwist } from '@serwist/turbopack';

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
