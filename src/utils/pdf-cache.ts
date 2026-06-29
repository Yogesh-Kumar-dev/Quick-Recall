// ==============================|| PDF CACHE (CacheFirst, forever) ||============================== //
//
// Client-side cache for the PDF guides served from Vercel Blob (see src/data/pdf-guides.ts). A guide
// is fetched from Blob storage **exactly once per device, ever**, stored in a dedicated `pdf-cache`
// Cache Storage bucket, and read from cache on every later open — including offline (the Cache API is
// read directly here; no service worker involvement). This is the egress protection: normal use = one
// download per device per PDF. There is deliberately NO "clear cache" button — it would be the only
// thing that hands a user a repeatable re-download trigger.
//
// EmbedPDF opens a tab from in-memory bytes (`openDocumentBuffer({ buffer })`), so we hand back an
// ArrayBuffer rather than a URL — keeping the fetch/caching entirely under our control.

const PDF_CACHE = 'pdf-cache';

// Dedupe concurrent requests for the same URL (e.g. double-click) so we don't fetch twice.
const inFlight = new Map<string, Promise<ArrayBuffer>>();

function cachesAvailable(): boolean {
  return typeof caches !== 'undefined';
}

/**
 * Return the bytes for `url`, fetching + caching on first request and reading from `pdf-cache`
 * thereafter. Throws if the network fetch fails on a cache miss (caller shows a retry / open-in-new-tab
 * fallback). Reading the body requires CORS on the blob — Vercel public blobs send permissive CORS.
 */
export async function ensurePdfBuffer(url: string): Promise<ArrayBuffer> {
  const pending = inFlight.get(url);
  if (pending) return pending;

  const task = (async () => {
    if (!cachesAvailable()) {
      // No Cache Storage (very old browser / non-secure context) — fetch without persisting.
      const res = await fetch(url, { mode: 'cors' });
      if (!res.ok) throw new Error(`PDF fetch failed: ${res.status}`);
      return res.arrayBuffer();
    }

    const cache = await caches.open(PDF_CACHE);
    const hit = await cache.match(url);
    if (hit) return hit.arrayBuffer();

    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) throw new Error(`PDF fetch failed: ${res.status}`);
    // Persist a clone, then read the original into bytes (a Response body can only be read once).
    await cache.put(url, res.clone());
    return res.arrayBuffer();
  })();

  inFlight.set(url, task);
  try {
    return await task;
  } finally {
    inFlight.delete(url);
  }
}

/** True if `url` is already cached (no network). Lets the UI label a guide "Saved". */
export async function isPdfCached(url: string): Promise<boolean> {
  if (!cachesAvailable()) return false;
  try {
    const cache = await caches.open(PDF_CACHE);
    return (await cache.match(url)) !== undefined;
  } catch {
    return false;
  }
}

/**
 * Drop cached PDFs that are no longer referenced by the current guide list — bounds device storage
 * without any user-facing clear button. Call with every URL still in use (across all pages' arrays).
 */
export async function prunePdfCache(currentUrls: string[]): Promise<void> {
  if (!cachesAvailable()) return;
  try {
    const keep = new Set(currentUrls);
    const cache = await caches.open(PDF_CACHE);
    const requests = await cache.keys();
    await Promise.all(requests.filter((req) => !keep.has(req.url)).map((req) => cache.delete(req)));
  } catch {
    /* best-effort */
  }
}

/**
 * Ask the browser to mark this origin's storage as persistent so the cached PDFs (and the rest of the
 * PWA's offline data) aren't evicted under storage pressure → "cached forever until the PWA is
 * uninstalled". Best-effort and idempotent; auto-granted for installed PWAs.
 */
export async function requestPersistentStorage(): Promise<void> {
  try {
    if (typeof navigator !== 'undefined' && navigator.storage?.persist && !(await navigator.storage.persisted())) {
      await navigator.storage.persist();
    }
  } catch {
    /* best-effort */
  }
}
