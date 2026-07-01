'use client';

import { useState } from 'react';

import type { PdfGuide } from 'data/pdf-guides';
import PdfButton from './PdfButton';
import PdfDrawer from './PdfDrawer';

// All-in-one, reusable entry point — same ergonomics as PlaylistLauncher: drop this icon anywhere and
// pass an array of PDF guides. It owns its open/close state and renders the button + bottom drawer
// (which mounts the EmbedPDF viewer only while open). PDFs download once on first open and are served
// from cache thereafter (offline-friendly). For finer control, compose PdfButton + PdfDrawer yourself.

interface PdfLauncherProps {
  // PDF guides to show as tabs (each downloaded on demand when first opened).
  guides: PdfGuide[];
  // Drawer header title.
  title?: string;
  // Button tooltip + aria-label.
  buttonLabel?: string;
  // Icon size in px.
  iconSize?: number;
}

export default function PdfLauncher({ guides, title, buttonLabel, iconSize }: PdfLauncherProps) {
  const [open, setOpen] = useState(false);

  if (guides.length === 0) return null;

  return (
    <>
      <PdfButton onOpen={() => setOpen(true)} label={buttonLabel} size={iconSize} />
      <PdfDrawer open={open} onClose={() => setOpen(false)} guides={guides} title={title} />
    </>
  );
}
