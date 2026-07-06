'use client';

import { IconCloudDownload } from '@tabler/icons-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import useOfflineDownload from '@/hooks/useOfflineDownload';
import OfflineDownloadPanel from './offline-download-panel';

// Header icon button that opens the offline-download dialog. Owns the download state (via the
// hook) so progress keeps advancing even while the dialog is closed; a badge dot indicates an
// active download.
export default function OfflineDownloadButton() {
  const [open, setOpen] = useState(false);
  const download = useOfflineDownload();

  // Hidden entirely where service workers aren't available — offline download is meaningless.
  if (!download.isSupported) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setOpen(true)}
        aria-label="Download for offline"
        title="Download for offline"
        className="relative"
      >
        <IconCloudDownload size={20} />
        {download.isRunning && <span className="absolute top-1 right-1 size-1.5 rounded-full bg-primary" aria-hidden />}
      </Button>

      <OfflineDownloadPanel open={open} onOpenChange={setOpen} download={download} />
    </>
  );
}
