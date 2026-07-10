'use client';

import { IconCloudDownload } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import useOfflineDownload from '@/hooks/useOfflineDownload';
import OfflineDownloadPanel from './offline-download-panel';

// owns the download state so progress keeps advancing even while the dialog is closed
export default function OfflineDownloadButton() {
  const [open, setOpen] = useState(false);
  const download = useOfflineDownload();

  if (!download.isSupported) return null;

  const handleOpen = () => {
    if (download.isStale) toast.info('New content available, download now');
    setOpen(true);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleOpen}
        aria-label="Download for offline"
        title="Download for offline"
        className="relative"
      >
        <IconCloudDownload size={20} />
        {download.isRunning && <span className="absolute top-1 right-1 size-1.5 rounded-full bg-primary" aria-hidden />}
        {!download.isRunning && download.isStale && (
          <span className="absolute top-1 right-1 size-1.5 rounded-full bg-[color:var(--chart-4)]" aria-hidden />
        )}
      </Button>

      <OfflineDownloadPanel open={open} onOpenChange={setOpen} download={download} />
    </>
  );
}
