// ==============================|| OFFLINE CACHE UTILITIES ||============================== //
//
// Helpers for probing the service worker's Cache Storage, used by the offline download hook and
// the offline section guard.
//
// IMPORTANT: we do NOT use `caches.match(url)`. Across Workbox's page caches, a naked
// `caches.match` from the page context frequently misses entries the SW's fetch handler would
// resolve, because stored request keys carry RSC headers/vary data a plain string match can't
// reproduce (caused false "not saved" reports). Instead we enumerate `cache.keys()` and compare
// by pathname — ground truth, and a reliable signal since chunks are content-hashed and
// aggressively precached even though they aren't individually verified here.

let cachedPathnamesPromise: Promise<Set<string>> | null = null;

// Cached briefly so a burst of probes (e.g. panel checking every section on open) doesn't re-enumerate.
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
    return new URL(url, typeof location !== 'undefined' ? location.origin : 'http://localhost').pathname;
  } catch {
    return null;
  }
}
