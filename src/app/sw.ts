// PWA service worker source (compiled by Serwist into /public/sw.js at build time).
//
// - precacheEntries: the build manifest Serwist injects (app shell + static chunks) plus the
//   `/~offline` entry from next.config.ts.
// - runtimeCaching (defaultCache): caches same-origin pages, _next/static chunks, fonts, etc.
//   on first request — this is what makes visited pages (and the "Download for offline" flow)
//   work without a network.
// - fallbacks: serve the precached /~offline page for navigations that miss the cache offline.
//
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

// A deploy-stable version signature derived from the precache manifest. Every deploy changes
// chunk revisions (and the /~offline revision from next.config.ts), so this string changes
// exactly when the deployed assets change — without needing to inject a build constant into the
// worker. The offline-download UI compares this against the version it saved with a completed
// download to decide whether a re-download is needed after a new deploy.
function computeManifestVersion(entries: (PrecacheEntry | string)[] | undefined): string {
  if (!entries || entries.length === 0) return 'none';
  let hash = 0;
  for (const entry of entries) {
    const token = typeof entry === 'string' ? entry : `${entry.url}@${entry.revision ?? ''}`;
    for (let i = 0; i < token.length; i++) {
      hash = (hash * 31 + token.charCodeAt(i)) | 0; // 32-bit rolling hash
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

// Dedicated, high-capacity page caches for "the whole app, offline". Serwist's defaultCache page
// caches are capped at 32 entries (LRU) and its HTML rule matches on the *request* Content-Type
// header (which a plain fetch never sends), so bulk-downloading ~55 routes can't reliably persist
// there. These custom rules — prepended to defaultCache so they win for page requests — use our
// own cacheNames with a high maxEntries and `ignoreSearch: true`. ignoreSearch is essential: notes
// pages carry nuqs filter state in the query (`?difficulty=…&q=…&open=…`) and RSC payloads carry a
// build-specific `?_rsc=…` token — one cached entry per route must serve all of those.
//
// Documents and RSC payloads are split into TWO caches (rather than one keyed by pathname) so we
// can also set `ignoreVary: true`. Real requests for the same pathname show up with inconsistent
// header combinations offline — a hard navigation, a client <Link> prefetch, and our own warming
// fetch all send different Accept/RSC/Next-Router-Prefetch headers — and Next's document responses
// carry a `Vary` header that makes Chrome's default (Vary-respecting) cache.match() miss on those
// differences even though the pathname is genuinely cached. `ignoreVary: true` fixes that, but if
// both variants shared one cache, a document navigation could then match the *RSC* entry for the
// same pathname and render raw RSC flight-stream text instead of the page — hence two caches: one
// per representation, matched separately, each safe to fully ignore Vary on.
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

// Warm EVERY offline route at install so the whole app is available offline immediately — even
// before the user opens the download panel. Routes come from OFFLINE_SECTIONS (the same source of
// truth the download UI uses). We warm two representations per route through serwist.handleRequest
// so both navigation modes resolve offline: the document (hard load / app launch) lands in
// OFFLINE_DOCS_CACHE, the RSC payload (client-side <Link> navigation) lands in OFFLINE_RSC_CACHE.
// This is the Serwist maintainer's recommended pattern (handleRequest at install).
const ALL_ROUTES = [...new Set(OFFLINE_SECTIONS.flatMap((s) => s.urls))];

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all(
      ALL_ROUTES.flatMap((url) => [
        serwist.handleRequest({ request: new Request(url, { headers: { Accept: 'text/html' } }), event }),
        serwist.handleRequest({ request: new Request(url, { headers: { RSC: '1' } }), event })
      ])
    ).catch(() => undefined) // best-effort: a failed warm must not block SW install
  );
});

serwist.addEventListeners();
