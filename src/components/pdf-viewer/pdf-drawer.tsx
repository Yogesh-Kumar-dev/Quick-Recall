'use client';

import { IconFileText } from '@tabler/icons-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { PdfGuide } from '@/data/pdf-guides';
import PdfViewerPanel from './pdf-viewer-panel';

// Bottom sheet that hosts the PDF viewer. The viewer is mounted ONLY while the sheet is open, so
// closing it tears down the PDFium engine/worker (no background work). Mirrors PlaylistDrawer.

interface PdfDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guides: PdfGuide[];
  title?: string;
}

export default function PdfDrawer({ open, onOpenChange, guides, title = 'PDF Guides' }: PdfDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="flex h-[100dvh] flex-col gap-0 rounded-none p-0 data-[side=bottom]:h-[100dvh]">
        <SheetHeader className="flex-row items-center justify-between border-b border-border py-3">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <IconFileText size={22} className="text-primary" />
            {title}
          </SheetTitle>
        </SheetHeader>
        <div className="min-h-0 flex-1">{open && <PdfViewerPanel guides={guides} />}</div>
      </SheetContent>
    </Sheet>
  );
}
