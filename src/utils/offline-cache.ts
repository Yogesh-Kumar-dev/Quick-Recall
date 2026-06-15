// ==============================|| OFFLINE CACHE UTILITIES ||============================== //
//
// Small shared helpers for probing the service worker's Cache Storage. Used by both the offline
// download hook (to detect what's already saved) and the offline section guard (to decide whether
// the current route can render offline / which sections are available).
//
// Caveat: a route's HTML being cached doesn't guarantee every _next/static chunk it pulls is
// cached too — so these checks are a strong signal, not an absolute guarantee.

/** True if `url` is present in any cache (precache or runtime). */
export async function isCached(url: string): Promise<boolean> {
  if (typeof caches === 'undefined') return false;
  try {
    const res = await caches.match(url, { ignoreSearch: true, ignoreVary: true });
    return !!res;
  } catch {
    return false;
  }
}

/** How many of `urls` are present in any cache. */
export async function countCached(urls: string[]): Promise<number> {
  if (typeof caches === 'undefined') return 0;
  const hits = await Promise.all(urls.map((url) => isCached(url).then((hit) => (hit ? 1 : 0))));
  return hits.reduce<number>((sum, n) => sum + n, 0);
}
