'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { OFFLINE_SECTIONS, OFFLINE_TOTAL_URLS, type OfflineSection } from 'data/offline-content';
import { countCached } from 'utils/offline-cache';

// ==============================|| HOOKS - OFFLINE DOWNLOAD ||============================== //
//
// Owns the "download for offline" state: detecting what's already saved, and a sequential
// download queue so the user can pick individual sections (or all of them).
//
// Detection (on mount): asks the active service worker for its manifest version, probes the
// Cache Storage API to count which of each section's URLs are already cached, and compares
// against a persisted marker to classify each section as saved / partially saved / stale (a
// newer build is deployed than what was downloaded).
//
// Queue: `enqueueSection(id)` / `enqueueAll()` add sections to a FIFO queue drained one at a
// time. The "core" section is always pulled to the front (the app shell others depend on), and
// is auto-enqueued ahead of any non-core section the user picks if it isn't saved yet.
//
// Caveat: a route's HTML being cached doesn't guarantee every _next/static chunk it pulls is
// cached too — so "saved" is a strong signal, not an absolute guarantee. After a deploy, stale
// detection flips sections back to "update available" so the user re-pulls the new assets.

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

async function warmUrl(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { cache: 'reload', credentials: 'same-origin' });
    await res.text().catch(() => undefined); // drain so the SW fully stores the response
    return res.ok;
  } catch {
    return false;
  }
}

export default function useOfflineDownload(): UseOfflineDownload {
  const [sections, setSections] = useState<SectionProgress[]>(() => OFFLINE_SECTIONS.map(baseProgress));
  const [queue, setQueue] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isStale, setIsStale] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Latest version reported by the SW — captured during detection, reused when persisting marker.
  const versionRef = useRef<string | null>(null);
  // Guards the drain loop so only one section processes at a time across re-renders.
  const drainingRef = useRef(false);

  const isSupported = useMemo(() => typeof navigator !== 'undefined' && 'serviceWorker' in navigator, []);
  const isRunning = activeId !== null || queue.length > 0;

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
  const processSection = useCallback(
    async (section: OfflineSection, forceRefetch: boolean): Promise<void> => {
      setSections((prev) => prev.map((s) => (s.id === section.id ? { ...s, status: 'downloading' } : s)));

      let anyFailed = false;
      let completed = forceRefetch ? 0 : await countCached(section.urls);
      setSections((prev) => prev.map((s) => (s.id === section.id ? { ...s, completed } : s)));

      for (const url of section.urls) {
        if (!forceRefetch) {
          const already = await countCached([url]);
          if (already > 0) continue;
        }
        const ok = await warmUrl(url);
        if (!ok) anyFailed = true;
        completed = Math.min(completed + 1, section.urls.length);
        setSections((prev) => prev.map((s) => (s.id === section.id ? { ...s, completed } : s)));
      }

      setSections((prev) =>
        prev.map((s) => (s.id === section.id ? { ...s, completed: s.total, status: anyFailed ? 'error' : 'done' } : s))
      );
    },
    []
  );

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
      // a new explicit run clears stale-ness so skip-if-cached re-enables once refreshed
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
        setSections((cur) =>
          cur.map((s) => (additions.includes(s.id) && s.id !== activeId ? { ...s, status: 'queued' } : s))
        );

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

  return { sections, overallProgress, isRunning, isSupported, isStale, isChecking, enqueueSection, enqueueAll };
}
