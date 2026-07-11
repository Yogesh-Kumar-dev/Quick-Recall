'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { OFFLINE_SECTIONS, OFFLINE_TOTAL_URLS, type OfflineSection } from '@/data/offline-content';
import { countCached, getCachedPathnames, refreshCachedPathnames } from '@/utils/offline-cache';

// ==============================|| HOOKS - OFFLINE DOWNLOAD ||============================== //
//
// Owns "download for offline" state: cache detection (via SW manifest version + Cache Storage
// probing) plus a FIFO download queue, with "core" (the app shell others depend on) always
// pulled to the front. A route's HTML being cached doesn't guarantee every chunk it pulls is
// cached too, so "saved" is a strong signal, not a guarantee.

const MARKER_KEY = 'quickrecall:offline-download';
const CORE_ID = 'core';

export type SectionStatus = 'idle' | 'partial' | 'queued' | 'downloading' | 'done' | 'error' | 'stale';

export interface SectionProgress {
  id: string;
  label: string;
  total: number;
  completed: number;
  status: SectionStatus;
}

interface DownloadMarker {
  version: string;
  completedAt: number;
}

export interface UseOfflineDownload {
  sections: SectionProgress[];
  /** 0–100 across all sections */
  overallProgress: number;
  /** a section is currently downloading or queued */
  isRunning: boolean;
  /** service worker present — downloads are pointless without it */
  isSupported: boolean;
  /** a newer build is deployed than the last completed download → re-download recommended */
  isStale: boolean;
  /** still probing caches / SW version on mount */
  isChecking: boolean;
  /** a download run just finished this session → show the "up to date" confirmation */
  justCompleted: boolean;
  /** queue a single section (auto-prepends core if needed) */
  enqueueSection: (id: string) => void;
  /** queue every section (core first) */
  enqueueAll: () => void;
}

const baseProgress = (s: OfflineSection): SectionProgress => ({
  id: s.id,
  label: s.label,
  total: s.urls.length,
  completed: 0,
  status: 'idle'
});

function getServiceWorkerVersion(timeoutMs = 1500): Promise<string | null> {
  return new Promise((resolve) => {
    const sw = navigator.serviceWorker?.controller;
    if (!sw) return resolve(null);
    const channel = new MessageChannel();
    const timer = setTimeout(() => resolve(null), timeoutMs);
    channel.port1.onmessage = (e) => {
      clearTimeout(timer);
      resolve(e.data?.type === 'VERSION' ? (e.data.version as string) : null);
    };
    sw.postMessage({ type: 'GET_VERSION' }, [channel.port2]);
  });
}

function readMarker(): DownloadMarker | null {
  try {
    const raw = localStorage.getItem(MARKER_KEY);
    return raw ? (JSON.parse(raw) as DownloadMarker) : null;
  } catch {
    return null;
  }
}

// Warms a route with both a document request (hard load) and an RSC request (client <Link> nav)
// so in-app navigation to a never-prefetched route still resolves offline (see src/app/sw.ts).
async function warmUrl(url: string): Promise<boolean> {
  const rscUrl = `${url}${url.includes('?') ? '&' : '?'}_rsc=offline`;

  // Accept: text/html is required — a plain fetch() sends `Accept: */*`, which matches none of
  // the SW's offlinePages matcher conditions, silently skipping the cache entirely.
  const docReq = fetch(url, { cache: 'reload', credentials: 'same-origin', headers: { Accept: 'text/html' } })
    .then((res) =>
      res
        .text()
        .then(() => res.ok)
        .catch(() => res.ok)
    )
    .catch(() => false);

  const rscReq = fetch(rscUrl, { cache: 'reload', credentials: 'same-origin', headers: { RSC: '1' } })
    .then((res) =>
      res
        .text()
        .then(() => res.ok)
        .catch(() => res.ok)
    )
    .catch(() => false);

  const [docOk, rscOk] = await Promise.all([docReq, rscReq]);
  // Either representation caching is enough — the probe matches by pathname across all caches.
  return docOk || rscOk;
}

export default function useOfflineDownload(): UseOfflineDownload {
  const [sections, setSections] = useState<SectionProgress[]>(() => OFFLINE_SECTIONS.map(baseProgress));
  const [queue, setQueue] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isStale, setIsStale] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  // True once a download run finishes — drives the "you're up to date" confirmation. Set on the
  // running→idle transition; cleared when a new run starts.
  const [justCompleted, setJustCompleted] = useState(false);

  // Latest version reported by the SW — captured during detection, reused when persisting marker.
  const versionRef = useRef<string | null>(null);
  // Guards the drain loop so only one section processes at a time across re-renders.
  const drainingRef = useRef(false);
  // Tracks the previous isRunning value so we can detect the moment a run finishes.
  const wasRunningRef = useRef(false);

  // Starts false to match SSR (no `navigator`), then flips after mount — computing it
  // synchronously would mismatch the server-rendered output and cause a hydration error.
  const [isSupported, setIsSupported] = useState(false);
  useEffect(() => {
    setIsSupported(typeof navigator !== 'undefined' && 'serviceWorker' in navigator);
  }, []);

  const isRunning = activeId !== null || queue.length > 0;

  // Detect the running→idle transition: the marker was just refreshed to the current SW version
  // by the drain effect, so clear the stale banner and surface the "up to date" confirmation.
  useEffect(() => {
    if (wasRunningRef.current && !isRunning) {
      setIsStale(false);
      setJustCompleted(true);
    }
    wasRunningRef.current = isRunning;
  }, [isRunning]);

  // On mount: detect what's already saved and whether it's from the current build.
  useEffect(() => {
    if (!isSupported) {
      setIsChecking(false);
      return;
    }
    let cancelled = false;

    void (async () => {
      try {
        await navigator.serviceWorker.ready;
      } catch {
        /* continue; cache probing still works */
      }
      refreshCachedPathnames(); // ensure a fresh enumeration on (re)open
      const [version, counts] = await Promise.all([
        getServiceWorkerVersion(),
        Promise.all(OFFLINE_SECTIONS.map((s) => countCached(s.urls)))
      ]);
      if (cancelled) return;

      versionRef.current = version;
      const marker = readMarker();
      const stale = !!marker && !!version && marker.version !== version;
      setIsStale(stale);

      setSections(
        OFFLINE_SECTIONS.map((s, i) => {
          const cached = counts[i];
          let status: SectionStatus = 'idle';
          if (cached > 0 && cached >= s.urls.length) status = stale ? 'stale' : 'done';
          else if (cached > 0) status = stale ? 'stale' : 'partial';
          return { id: s.id, label: s.label, total: s.urls.length, completed: cached, status };
        })
      );
      setIsChecking(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [isSupported]);

  // Process one section: warm its URLs (skipping already-cached unless stale/forced), updating
  // progress. Returns whether all URLs succeeded.
  const processSection = useCallback(async (section: OfflineSection, forceRefetch: boolean): Promise<void> => {
    setSections((prev) => prev.map((s) => (s.id === section.id ? { ...s, status: 'downloading' } : s)));

    // Snapshot once so the per-URL skip is a cheap set lookup, not a re-enumeration each iteration.
    // Always the real snapshot even when stale — the progress bar starts from what's genuinely
    // cached rather than dropping to 0 while a re-download refreshes it in place.
    const cachedSet = await getCachedPathnames();
    const pathOf = (url: string) => {
      try {
        return new URL(url, location.origin).pathname;
      } catch {
        return url;
      }
    };

    let anyFailed = false;
    let completed = section.urls.filter((u) => cachedSet.has(pathOf(u))).length;
    setSections((prev) => prev.map((s) => (s.id === section.id ? { ...s, completed } : s)));

    for (const url of section.urls) {
      const alreadyCached = cachedSet.has(pathOf(url));
      if (!forceRefetch && alreadyCached) continue;
      const ok = await warmUrl(url);
      if (!ok) anyFailed = true;
      // A forced refetch of an already-cached URL replaces it in place — not new progress.
      if (!alreadyCached) completed = Math.min(completed + 1, section.urls.length);
      setSections((prev) => prev.map((s) => (s.id === section.id ? { ...s, completed } : s)));
    }

    // We just changed Cache Storage — invalidate the snapshot so detection elsewhere is fresh.
    refreshCachedPathnames();

    setSections((prev) => prev.map((s) => (s.id === section.id ? { ...s, completed: s.total, status: anyFailed ? 'error' : 'done' } : s)));
  }, []);

  // Drain loop: whenever the queue has items and nothing is active, pull the next id and process
  // it. Runs one section at a time (drainingRef guard) and is re-triggered by queue/activeId.
  useEffect(() => {
    if (drainingRef.current || activeId !== null || queue.length === 0) return;

    drainingRef.current = true;
    const [nextId, ...rest] = queue;
    setActiveId(nextId);
    setQueue(rest);

    const section = OFFLINE_SECTIONS.find((s) => s.id === nextId);

    void (async () => {
      if (section) {
        try {
          await navigator.serviceWorker.ready;
        } catch {
          /* proceed; per-URL failures handled */
        }
        await processSection(section, isStale);
      }

      // Persist marker after each completed section so detection stays accurate mid-progress.
      try {
        const version = versionRef.current ?? (await getServiceWorkerVersion());
        if (version) localStorage.setItem(MARKER_KEY, JSON.stringify({ version, completedAt: Date.now() } as DownloadMarker));
      } catch {
        /* localStorage may be unavailable; non-fatal */
      }

      setActiveId(null);
      drainingRef.current = false;
    })();
  }, [queue, activeId, isStale, processSection]);

  // Add ids to the queue (de-duped against queue + active + already-done sections). Core is
  // always ordered before non-core entries.
  const enqueue = useCallback(
    (ids: string[]) => {
      if (!isSupported) return;
      setJustCompleted(false); // a new run starts — clear the previous "up to date" confirmation
      setQueue((prev) => {
        const present = new Set([...prev, ...(activeId ? [activeId] : [])]);
        const additions = ids.filter((id) => !present.has(id));

        // If any non-core section is being added and core isn't saved/queued/active, prepend core.
        const coreSection = sections.find((s) => s.id === CORE_ID);
        const coreNeedsFetch = coreSection ? coreSection.status !== 'done' : false;
        const addsNonCore = additions.some((id) => id !== CORE_ID);
        const coreAlreadyHandled = present.has(CORE_ID) || additions.includes(CORE_ID);
        if (addsNonCore && coreNeedsFetch && !coreAlreadyHandled) {
          additions.unshift(CORE_ID);
        }

        if (additions.length === 0) return prev;

        // mark newly queued sections
        setSections((cur) => cur.map((s) => (additions.includes(s.id) && s.id !== activeId ? { ...s, status: 'queued' } : s)));

        // keep core ahead of everything else in the resulting queue
        const merged = [...prev, ...additions];
        return merged.sort((a, b) => (a === CORE_ID ? -1 : b === CORE_ID ? 1 : 0));
      });
    },
    [isSupported, activeId, sections]
  );

  const enqueueSection = useCallback((id: string) => enqueue([id]), [enqueue]);
  const enqueueAll = useCallback(() => enqueue(OFFLINE_SECTIONS.map((s) => s.id)), [enqueue]);

  const overallProgress = useMemo(() => {
    if (OFFLINE_TOTAL_URLS === 0) return 0;
    const done = sections.reduce((sum, s) => sum + s.completed, 0);
    return Math.round((done / OFFLINE_TOTAL_URLS) * 100);
  }, [sections]);

  return { sections, overallProgress, isRunning, isSupported, isStale, isChecking, justCompleted, enqueueSection, enqueueAll };
}
