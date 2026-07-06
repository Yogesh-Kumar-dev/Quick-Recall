'use client';

import { useEffect } from 'react';

// Deep-link support for NotesView: when the page loads with ?open=<id>, NoteCard already opens
// the matching card via the shared nuqs `open` state — this just brings it into view. A short
// delay covers the virtualized list case, where Virtuoso needs a tick to mount the item that
// `initialTopMostItemIndex` scrolled to before it exists in the DOM for getElementById to find.
export default function ScrollToNote({ id }: { id?: string }) {
  useEffect(() => {
    if (!id) return;
    const timer = setTimeout(() => {
      document.getElementById(`note-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    return () => clearTimeout(timer);
  }, [id]);

  return null;
}
