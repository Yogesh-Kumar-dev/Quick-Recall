'use client';

import { IconChevronRight, IconCloudDownload, IconCloudOff } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { OFFLINE_SECTIONS } from '@/data/offline-content';
import useOfflineDownload from '@/hooks/useOfflineDownload';
import useOnlineStatus from '@/hooks/useOnlineStatus';
import { countCached, isCached, refreshCachedPathnames } from '@/utils/offline-cache';
import OfflineDownloadPanel from './offline-download-panel';

// Wraps app content. When the device is offline AND the current route isn't cached, it renders a
// friendly "this section isn't saved offline yet" panel (with links to the sections that ARE
// downloaded + a Download action) instead of the broken/blank page a failed offline navigation
// would otherwise produce. When online, or when the route is cached, it renders the children
// untouched.
//
// This catches the common client-side link-navigation case, which the SW's /~offline document
// fallback does not (that only fires for hard document navigations).

interface AvailableSection {
  id: string;
  label: string;
  // first cached URL in the section — a safe link target known to render offline
  href: string | null;
}

export default function OfflineSectionGuard({ children }: { children: React.ReactNode }) {
  const online = useOnlineStatus();
  const pathname = usePathname();
  const download = useOfflineDownload();

  // null = not yet determined (don't flash the fallback before the cache probe resolves)
  const [routeCached, setRouteCached] = useState<boolean | null>(null);
  const [available, setAvailable] = useState<AvailableSection[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);

  // Probe whether the current route is cached. Only meaningful offline; while online we always
  // render children, so skip the work.
  useEffect(() => {
    if (online) {
      setRouteCached(null);
      return;
    }
    let cancelled = false;

    void (async () => {
      refreshCachedPathnames(); // probe live cache state on each offline navigation
      const cached = pathname ? await isCached(pathname) : false;
      if (cancelled) return;
      setRouteCached(cached);

      // Only compute the "available sections" list when we're actually going to show the
      // fallback (offline + uncached route).
      if (!cached) {
        const results = await Promise.all(
          OFFLINE_SECTIONS.map(async (s) => {
            const count = await countCached(s.urls);
            if (count === 0) return null;
            // pick the first cached URL as the link target
            let href: string | null = null;
            for (const url of s.urls) {
              if (await isCached(url)) {
                href = url;
                break;
              }
            }
            return { id: s.id, label: s.label, href } as AvailableSection;
          })
        );
        if (!cancelled) setAvailable(results.filter((r): r is AvailableSection => r !== null));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [online, pathname]);

  // Render children when online, or while still probing, or when the route is cached.
  if (online || routeCached === null || routeCached) {
    return <>{children}</>;
  }

  // Offline + uncached route → friendly fallback.
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
      <IconCloudOff size={48} strokeWidth={1.5} className="text-[color:var(--chart-4)]" />
      <h1 className="mt-4 mb-1 font-heading text-2xl font-bold">This section isn&apos;t saved for offline use</h1>
      <p className="mb-6 max-w-md text-sm text-muted-foreground">
        You&apos;re offline and this page hasn&apos;t been downloaded yet. Reconnect to load it, or download it now for next time.
      </p>

      <Button className="mb-8" onClick={() => setPanelOpen(true)}>
        <IconCloudDownload size={18} />
        Download for offline
      </Button>

      {available.length > 0 && (
        <div className="w-full max-w-md">
          <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
            Available offline
          </div>
          <div className="space-y-2">
            {available.map(
              (s) =>
                s.href && (
                  <Link
                    key={s.id}
                    href={s.href}
                    className="flex items-center justify-between rounded-md border border-border px-4 py-2.5 text-foreground no-underline transition-colors hover:border-primary hover:bg-muted"
                  >
                    <span className="text-sm font-medium">{s.label}</span>
                    <IconChevronRight size={18} />
                  </Link>
                )
            )}
          </div>
        </div>
      )}

      <OfflineDownloadPanel open={panelOpen} onOpenChange={setPanelOpen} download={download} />
    </div>
  );
}
