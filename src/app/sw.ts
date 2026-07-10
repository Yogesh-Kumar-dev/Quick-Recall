// PWA service worker source (compiled by Serwist into /public/sw.js at build time).
import { defaultCache } from '@serwist/turbopack/worker';
import type { PrecacheEntry, RuntimeCaching, SerwistGlobalConfig } from 'serwist';
import { CacheableResponsePlugin, ExpirationPlugin, NetworkFirst, Serwist } from 'serwist';

import { OFFLINE_SECTIONS } from '../data/offline-content';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const precacheEntries = self.__SW_MANIFEST;

// Deploy-stable signature derived from the precache manifest; changes exactly when deployed
// assets change, without needing a build constant. The offline-download UI diffs against this
// to decide whether a re-download is needed after a new deploy.
function computeManifestVersion(entries: (PrecacheEntry | string)[] | undefined): string {
  if (!entries || entries.length === 0) return 'none';
  let hash = 0;
  for (const entry of entries) {
    const token = typeof entry === 'string' ? entry : `${entry.url}@${entry.revision ?? ''}`;
    for (let i = 0; i < token.length; i++) {
      hash = (hash * 31 + token.charCodeAt(i)) | 0;
    }
  }
  return `${entries.length}-${(hash >>> 0).toString(36)}`;
}

const MANIFEST_VERSION = computeManifestVersion(precacheEntries);

// Reply to a version query from the page so clients can detect post-deploy staleness.
self.addEventListener('message', (event) => {
  if (event.data?.type === 'GET_VERSION') {
    event.ports[0]?.postMessage({ type: 'VERSION', version: MANIFEST_VERSION });
  }
});

// Dedicated, high-capacity page caches: Serwist's defaultCache page caches are capped at 32
// entries and match on the request Content-Type header (which a plain fetch never sends), so
// bulk-downloading ~55 routes can't reliably persist there. `ignoreSearch: true` is needed
// because notes pages carry nuqs filter state (`?difficulty=…&open=…`) and RSC payloads carry a
// build `?_rsc=…` token — one cached entry per route must serve all variants.
//
// Documents and RSC payloads need separate caches so each can safely set `ignoreVary: true`:
// Next's `Vary` header makes Chrome's cache.match() miss real same-pathname requests that differ
// only by Accept/RSC headers (hard nav vs <Link> prefetch vs our warm-up fetch). Sharing one
// cache with ignoreVary on would let a document navigation match the RSC entry instead and
// render raw flight-stream text.
const OFFLINE_DOCS_CACHE = 'offline-pages-doc';
const OFFLINE_RSC_CACHE = 'offline-pages-rsc';

const offlineExpirationPlugins = [
  new ExpirationPlugin({ maxEntries: 300, maxAgeSeconds: 30 * 24 * 60 * 60 }),
  new CacheableResponsePlugin({ statuses: [0, 200] })
];

const offlineDocuments: RuntimeCaching = {
  matcher: ({ request, url: { pathname }, sameOrigin }) =>
    sameOrigin &&
    !pathname.startsWith('/api/') &&
    request.headers.get('RSC') !== '1' &&
    (request.mode === 'navigate' || request.destination === 'document' || (request.headers.get('Accept')?.includes('text/html') ?? false)),
  handler: new NetworkFirst({
    cacheName: OFFLINE_DOCS_CACHE,
    matchOptions: { ignoreSearch: true, ignoreVary: true },
    plugins: offlineExpirationPlugins
  })
};

const offlineRsc: RuntimeCaching = {
  matcher: ({ request, url: { pathname }, sameOrigin }) =>
    sameOrigin && !pathname.startsWith('/api/') && request.headers.get('RSC') === '1',
  handler: new NetworkFirst({
    cacheName: OFFLINE_RSC_CACHE,
    matchOptions: { ignoreSearch: true, ignoreVary: true },
    plugins: offlineExpirationPlugins
  })
};

const serwist = new Serwist({
  precacheEntries,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  // Custom page caches MUST come before defaultCache or defaultCache's page rules match first.
  runtimeCaching: [offlineDocuments, offlineRsc, ...defaultCache],
  fallbacks: {
    entries: [
      {
        url: '/~offline',
        matcher({ request }) {
          return request.destination === 'document';
        }
      }
    ]
  }
});

// Warm every offline route (from OFFLINE_SECTIONS) at install, both as document and RSC
// requests, so both navigation modes resolve offline before the user opens the download panel.
const ALL_ROUTES = [...new Set(OFFLINE_SECTIONS.flatMap((s) => s.urls))];

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all(
      ALL_ROUTES.flatMap((url) => [
        serwist.handleRequest({ request: new Request(url, { headers: { Accept: 'text/html' } }), event }),
        serwist.handleRequest({ request: new Request(url, { headers: { RSC: '1' } }), event })
      ])
    ).catch(() => undefined) // best-effort: don't block SW install on a failed warm
  );
});

serwist.addEventListeners();
