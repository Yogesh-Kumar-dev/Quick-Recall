// PWA service worker source (compiled by Serwist into /public/sw.js at build time).
//
// - precacheEntries: the build manifest Serwist injects (app shell + static chunks) plus the
//   `/~offline` entry from next.config.ts.
// - runtimeCaching (defaultCache): caches same-origin pages, _next/static chunks, fonts, etc.
//   on first request — this is what makes visited pages (and the "Download for offline" flow)
//   work without a network.
// - fallbacks: serve the precached /~offline page for navigations that miss the cache offline.
//
// The triple-slash reference pulls in Serwist's worker typings here (rather than via tsconfig
// `types`, which this project's parent-dir `typeRoots` setup doesn't resolve cleanly).
/// <reference types="@serwist/next/typings" />
import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist } from 'serwist';

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

const serwist = new Serwist({
  precacheEntries,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
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

serwist.addEventListeners();
