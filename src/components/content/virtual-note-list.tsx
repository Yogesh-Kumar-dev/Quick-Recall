'use client';

import { Virtuoso } from 'react-virtuoso';
import type { Note } from '@/types/content';
import type { NoteLink } from '@/data/note-sources';
import NoteCard from './note-card';

// Virtualizes the window's scroll (not an inner fixed-height box) so the page keeps scrolling
// natively — only used above the VIRTUALIZE_THRESHOLD in notes-view.tsx, where rendering every
// card would otherwise mean hundreds of ExpandableCard/LeafyGreen instances mounted at once.
export default function VirtualNoteList({
  notes,
  openId,
  prereqLinks
}: {
  notes: Note[];
  openId?: string;
  prereqLinks?: Record<string, NoteLink[]>;
}) {
  // ?open=<id> deep link: jump the virtualized window to that note's index on mount, since
  // otherwise it may not be rendered at all (Virtuoso only mounts what's near the viewport).
  const initialIndex = openId ? notes.findIndex((n) => n.id === openId) : -1;

  return (
    <Virtuoso
      useWindowScroll
      data={notes}
      computeItemKey={(_, note) => note.id}
      itemContent={(_, note) => <NoteCard note={note} prereqs={prereqLinks?.[note.id]} />}
      initialTopMostItemIndex={initialIndex >= 0 ? initialIndex : undefined}
    />
  );
}
