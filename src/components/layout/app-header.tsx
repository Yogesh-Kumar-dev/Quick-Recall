'use client';

import { usePathname } from 'next/navigation';

import FullscreenButton from '@/components/layout/fullscreen-button';
import InstallButton from '@/components/pwa/install-button';
import OfflineDownloadButton from '@/components/pwa/offline-download-button';
import OfflineStatusChip from '@/components/pwa/offline-status-chip';
import HeaderSearch from '@/components/search/header-search';
import TourReplayButton from '@/components/layout/tour-replay-button';
import TimerSection from '@/components/timer/timer-section';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function AppHeader() {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
      <Tooltip>
        <TooltipTrigger render={<SidebarTrigger />} />
        <TooltipContent>Ctrl+B</TooltipContent>
      </Tooltip>
      <HeaderSearch />
      {/* breadcrumbs land here in a later phase */}
      <TimerSection />
      <div className="ml-auto flex items-center gap-2">
        <OfflineStatusChip />
        <InstallButton />
        <OfflineDownloadButton />
        <TourReplayButton />
        <FullscreenButton />
      </div>
    </header>
  );
}
