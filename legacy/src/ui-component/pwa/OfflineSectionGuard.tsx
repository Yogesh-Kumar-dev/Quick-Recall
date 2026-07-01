'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';

// assets
import { IconCloudOff, IconCloudDownload, IconChevronRight } from '@tabler/icons-react';

// project imports
import useOnlineStatus from 'hooks/useOnlineStatus';
import useOfflineDownload from 'hooks/useOfflineDownload';
import { OFFLINE_SECTIONS } from 'data/offline-content';
import { isCached, countCached, refreshCachedPathnames } from 'utils/offline-cache';
import OfflineDownloadPanel from './OfflineDownloadPanel';

// ==============================|| PWA - OFFLINE SECTION GUARD ||============================== //
//
// Wraps dashboard content. When the device is offline AND the current route isn't cached, it
// renders a friendly "this section isn't saved offline yet" panel (with links to the sections
// that ARE downloaded + a Download action) instead of the broken/blank page a failed offline
// navigation would otherwise produce. When online, or when the route is cached, it renders the
// children untouched.
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
    <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 2,
        py: 6
      }}
    >
      <IconCloudOff size={48} stroke={1.5} color="#ed6c02" />
      <Typography variant="h3" sx={{ mt: 2, mb: 1 }}>
        This section isn&apos;t saved for offline use
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 460, mb: 3 }}>
        You&apos;re offline and this page hasn&apos;t been downloaded yet. Reconnect to load it, or download it now for next time.
      </Typography>

      <Button variant="contained" startIcon={<IconCloudDownload size={18} />} onClick={() => setPanelOpen(true)} sx={{ mb: 4 }}>
        Download for offline
      </Button>

      {available.length > 0 && (
        <Box sx={{ width: '100%', maxWidth: 460 }}>
          <Divider sx={{ mb: 2 }}>
            <Typography variant="overline" color="text.secondary">
              Available offline
            </Typography>
          </Divider>
          <Stack spacing={1}>
            {available.map((s) =>
              s.href ? (
                <Link
                  key={s.id}
                  component={NextLink}
                  href={s.href}
                  underline="none"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 1.25,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    color: 'text.primary',
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' }
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {s.label}
                  </Typography>
                  <IconChevronRight size={18} />
                </Link>
              ) : null
            )}
          </Stack>
        </Box>
      )}

      <OfflineDownloadPanel open={panelOpen} onClose={() => setPanelOpen(false)} download={download} />
    </Box>
  );
}
