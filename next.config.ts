import path from 'node:path';
import type { NextConfig } from 'next';
import withSerwistInit from '@serwist/next';

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
  additionalPrecacheEntries: [{ url: '/~offline', revision: process.env.VERCEL_GIT_COMMIT_SHA ?? Date.now().toString() }]
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
    optimizePackageImports: ['@tabler/icons-react']
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
      'react-dom$': path.resolve(__dirname, 'src/polyfills/react-dom-shim.js')
    };
    return config;
  }
};

export default withSerwist(nextConfig);
