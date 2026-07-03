'use client';

import { IconFileText } from '@tabler/icons-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { PdfGuide } from '@/data/pdf-guides';
import PdfDrawer from './pdf-drawer';

// All-in-one, reusable entry point: drop this icon anywhere and pass an array of PDF guides. It owns
// its open/close state and renders the button + bottom sheet (which mounts the EmbedPDF viewer only
// while open). PDFs download once on first open and are served from cache thereafter (offline-friendly).

interface PdfLauncherProps {
  // PDF guides to show as tabs (each downloaded on demand when first opened).
  guides: PdfGuide[];
  // Drawer header title.
  title?: string;
  // Button tooltip + aria-label.
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
      <PdfDrawer open={open} onOpenChange={setOpen} guides={guides} title={title} />
    </>
  );
}
