'use client';

import { IconFileText } from '@tabler/icons-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { PdfGuide } from '@/data/pdf-guides';

// PdfDrawer hosts the PDF viewer - lazy-load it so the sheet + viewer deps only download on first open.
const PdfDrawer = dynamic(() => import('./pdf-drawer'), { ssr: false });

// PDFs download once on first open and are served from cache thereafter (offline-friendly).

interface PdfLauncherProps {
  guides: PdfGuide[];
  title?: string;
  buttonLabel?: string;
}

export default function PdfLauncher({ guides, title, buttonLabel = 'Open PDF guides' }: PdfLauncherProps) {
  const [open, setOpen] = useState(false);

  if (guides.length === 0) return null;

  return (
    <>
      <Button variant="ghost" size="icon-sm" onClick={() => setOpen(true)} aria-label={buttonLabel} title={buttonLabel}>
        <IconFileText size={20} />
      </Button>
      {open && <PdfDrawer open={open} onOpenChange={setOpen} guides={guides} title={title} />}
    </>
  );
}
