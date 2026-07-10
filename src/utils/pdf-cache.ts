// ==============================|| PDF CACHE (CacheFirst, forever) ||============================== //
//
// Client-side cache for PDF guides from Vercel Blob (see src/data/pdf-guides.ts). Fetched exactly
// once per device, ever, then read from the `pdf-cache` Cache Storage bucket — this is the egress
// protection, so there is deliberately NO "clear cache" button (it'd be a repeatable re-download
// trigger). EmbedPDF opens from in-memory bytes (`openDocumentBuffer`), hence ArrayBuffer not URL.

const PDF_CACHE = 'pdf-cache';

// Dedupe concurrent requests for the same URL so we don't fetch twice.
const inFlight = new Map<string, Promise<ArrayBuffer>>();

function cachesAvailable(): boolean {
  return typeof caches !== 'undefined';
}

/** Throws on a cache-miss fetch failure; caller shows a retry/open-in-new-tab fallback. */
export async function ensurePdfBuffer(url: string): Promise<ArrayBuffer> {
  const pending = inFlight.get(url);
  if (pending) return pending;

  const task = (async () => {
    if (!cachesAvailable()) {
      const res = await fetch(url, { mode: 'cors' });
      if (!res.ok) throw new Error(`PDF fetch failed: ${res.status}`);
      return res.arrayBuffer();
    }

    const cache = await caches.open(PDF_CACHE);
    const hit = await cache.match(url);
    if (hit) return hit.arrayBuffer();

    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) throw new Error(`PDF fetch failed: ${res.status}`);
    // Persist a clone; a Response body can only be read once.
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

/** Drops cached PDFs no longer referenced, bounding device storage without a clear button. */
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

/** Marks storage persistent so cached PDFs survive storage pressure. Best-effort and idempotent. */
export async function requestPersistentStorage(): Promise<void> {
  try {
    if (typeof navigator !== 'undefined' && navigator.storage?.persist && !(await navigator.storage.persisted())) {
      await navigator.storage.persist();
    }
  } catch {
    /* best-effort */
  }
}
