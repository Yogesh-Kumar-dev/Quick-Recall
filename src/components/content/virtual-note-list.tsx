'use client';

import { Virtuoso } from 'react-virtuoso';
import type { Note } from '@/types/content';
import NoteCard from './note-card';

// Virtualizes the window's scroll (not an inner fixed-height box) so the page keeps scrolling
// natively — only used above the VIRTUALIZE_THRESHOLD in notes-view.tsx, where rendering every
// card would otherwise mean hundreds of ExpandableCard/LeafyGreen instances mounted at once.
export default function VirtualNoteList({ notes }: { notes: Note[] }) {
  return (
    <Virtuoso useWindowScroll data={notes} computeItemKey={(_, note) => note.id} itemContent={(_, note) => <NoteCard note={note} />} />
  );
}
