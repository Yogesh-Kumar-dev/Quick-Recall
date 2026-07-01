import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { NextConfig } from 'next';
import withSerwistInit from '@serwist/next';

// Content hash of the self-hosted PDFium WASM (see scripts/copy-pdfium-wasm.mjs). Used as the
// precache revision so the service worker re-fetches the binary only when it actually changes
// (e.g. an EmbedPDF version bump). Falls back to a constant if the file isn't present yet.
function pdfiumWasmRevision(): string {
  try {
    const buf = readFileSync(path.join(__dirname, 'public', 'pdfium.wasm'));
    return crypto.createHash('sha1').update(buf).digest('hex').slice(0, 12);
  } catch {
    return 'pdfium-missing';
  }
}

// PWA: wire up the Serwist service worker. `swSrc` is our TypeScript worker source; `swDest` is
// the generated worker Next serves at /sw.js. `revision` busts the precached offline fallback on
// each deploy.
//
// The SW is DISABLED in `next dev`. With `next dev` Next compiles each route on-demand, so the
// "download for offline" flow (which fetches ~70 routes) would trigger a webpack recompile per
// request — tiny payloads taking seconds. The SW only ever runs in the production build
// (`next build && next start`), which is what gets deployed. This keeps local `npm run dev` fast
// while the PWA is fully active in production.
const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV === 'development',
  // Only the offline fallback is precached here. The entry-point documents ('/', '/dashboard')
  // are warmed in the SW `install` handler (src/app/sw.ts) instead — additionalPrecacheEntries
  // for route *documents* is unreliable (the Serwist maintainer's own guidance), so we cache them
  // through the runtime navigation strategy so a launch request actually matches. See sw.ts.
  // /~offline: the navigation fallback. /pdfium.wasm: the EmbedPDF engine, self-hosted and precached
  // so the PDF viewer initialises offline (it is fetched cross-origin from a CDN by default — see
  // scripts/copy-pdfium-wasm.mjs). Its revision is the file's content hash so it busts only on change.
  additionalPrecacheEntries: [
    { url: '/~offline', revision: process.env.VERCEL_GIT_COMMIT_SHA ?? Date.now().toString() },
    { url: '/pdfium.wasm', revision: pdfiumWasmRevision() }
  ]
});

const nextConfig: NextConfig = {
  // Pre-existing lint debt (e.g. react/no-unescaped-entities in some machine-coding
  // demo files) should not block production builds. Type-checking stays enforced.
  eslint: {
    ignoreDuringBuilds: true
  },
  transpilePackages: ['react-resizable-panels'],
  // todo: this need to set to true or remove it as default is true. set false as chart was giving error when first render
  // https://github.com/apexcharts/apexcharts.js/issues/3652
  reactStrictMode: false,
  // Eliminate barrel-file import cost for @tabler/icons-react: Next rewrites the named barrel
  // imports (used across ~80 files) to direct per-icon paths at build time, so we don't pull the
  // whole icon set into the graph. Faster cold starts + HMR, with no source changes needed.
  // (@mui/* is handled by modularizeImports below.)
  experimental: {
    // Barrel-file optimization: rewrite named imports to direct module paths at build time so
    // importing one member doesn't pull a package's whole surface into the graph. Critical for the
    // @leafygreen-ui set — the ui-component/leafygreen barrel re-exports 18 of them, so without this
    // a page that needs only <LGCode> was dragging in Modal/Drawer/Select/etc. (lodash-es likewise).
    optimizePackageImports: [
      '@tabler/icons-react',
      'lodash-es',
      '@leafygreen-ui/badge',
      '@leafygreen-ui/banner',
      '@leafygreen-ui/button',
      '@leafygreen-ui/callout',
      '@leafygreen-ui/card',
      '@leafygreen-ui/code',
      '@leafygreen-ui/confirmation-modal',
      '@leafygreen-ui/drawer',
      '@leafygreen-ui/empty-state',
      '@leafygreen-ui/expandable-card',
      '@leafygreen-ui/modal',
      '@leafygreen-ui/preview-card',
      '@leafygreen-ui/progress-bar',
      '@leafygreen-ui/select',
      '@leafygreen-ui/text-area',
      '@leafygreen-ui/text-input',
      '@leafygreen-ui/typography'
    ]
  },
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}'
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}'
    },
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}'
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'thesvg.org',
        pathname: '/icons/**'
      }
    ]
  },
  // React 19 removed ReactDOM.findDOMNode, but react-transition-group@4 (used transitively by
  // @leafygreen-ui, incl. LeafygreenProvider) still calls it and crashes. Alias the exact `react-dom`
  // specifier to a shim that re-exports react-dom + a working findDOMNode, so every importer gets it.
  // `react-dom$` is an exact match — subpaths like `react-dom/client` are untouched.
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // The shim imports the REAL react-dom via this sentinel (an absolute file path bypasses
      // react-dom's `exports` field, which blocks `react-dom/index.js`). Then `react-dom$` (exact,
      // bare specifier only) routes every other importer through the shim.
      'react-dom-original$': require.resolve('react-dom'),
      'react-dom$': path.resolve(__dirname, 'src/polyfills/react-dom-shim.js')
    };
    return config;
  }
};

export default withSerwist(nextConfig);
