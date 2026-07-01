// ==============================|| OFFLINE CACHE UTILITIES ||============================== //
//
// Helpers for probing the service worker's Cache Storage. Used by both the offline download hook
// (to detect what's already saved) and the offline section guard (to decide whether the current
// route can render offline / which sections are available).
//
// IMPORTANT: we do NOT use `caches.match(url)` for detection. Across Workbox's page caches
// (`pages`, `pages-rsc`, `pages-rsc-prefetch`) a naked `caches.match` from the page context
// frequently misses entries the SW's own fetch handler would resolve — because the stored request
// keys carry RSC headers / vary data that a plain string match doesn't reproduce. That caused
// false "not saved" reports (guard firing on a working page; the panel undercounting downloads).
//
// Instead we enumerate the real stored requests via `cache.keys()` and compare by **pathname**.
// That's ground truth: if a request for that pathname is in any cache, the route is saved.
//
// Caveat: a route's document being cached doesn't guarantee every _next/static chunk it pulls is
// cached too — but those chunks are content-hashed and precached/runtime-cached aggressively, so
// pathname presence is a reliable signal in practice.

let cachedPathnamesPromise: Promise<Set<string>> | null = null;

// Build a set of every pathname currently present across all caches. Cached briefly so a burst of
// probes (e.g. the panel checking every section on open) doesn't re-enumerate repeatedly.
async function readCachedPathnames(): Promise<Set<string>> {
  if (typeof caches === 'undefined') return new Set();
  const out = new Set<string>();
  try {
    const names = await caches.keys();
    await Promise.all(
      names.map(async (name) => {
        const cache = await caches.open(name);
        const requests = await cache.keys();
        for (const req of requests) {
          try {
            out.add(new URL(req.url).pathname);
          } catch {
            /* ignore unparseable */
          }
        }
      })
    );
  } catch {
    /* return whatever we gathered */
  }
  return out;
}

/**
 * Snapshot the set of cached pathnames. Memoised for a short window so repeated probes in the same
 * tick share one enumeration; call `refreshCachedPathnames()` after a download to invalidate.
 */
export async function getCachedPathnames(): Promise<Set<string>> {
  if (!cachedPathnamesPromise) {
    cachedPathnamesPromise = readCachedPathnames();
    // auto-expire the snapshot so later probes see fresh state
    cachedPathnamesPromise.finally(() => {
      setTimeout(() => {
        cachedPathnamesPromise = null;
      }, 1500);
    });
  }
  return cachedPathnamesPromise;
}

/** Force the next probe to re-enumerate (call after warming/downloading routes). */
export function refreshCachedPathnames(): void {
  cachedPathnamesPromise = null;
}

/** True if `url`'s pathname is present in any cache. */
export async function isCached(url: string): Promise<boolean> {
  const pathname = toPathname(url);
  if (pathname === null) return false;
  const set = await getCachedPathnames();
  return set.has(pathname);
}

/** How many of `urls` have their pathname present in any cache. */
export async function countCached(urls: string[]): Promise<number> {
  const set = await getCachedPathnames();
  return urls.reduce((sum, url) => {
    const pathname = toPathname(url);
    return sum + (pathname !== null && set.has(pathname) ? 1 : 0);
  }, 0);
}

function toPathname(url: string): string | null {
  try {
    // resolve relative paths against the current origin
    return new URL(url, typeof location !== 'undefined' ? location.origin : 'http://localhost').pathname;
  } catch {
    return null;
  }
}
