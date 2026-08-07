'use client';

import type { Virtualizer } from '@tanstack/react-virtual';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import type { NoteLink } from '@/data/note-sources';
import type { Note } from '@/types/content';
import NoteCard from './note-card';

export const OVERSCAN = 4;
const ESTIMATED_HEIGHT = 200;

export const VirtualizerContext = createContext<Virtualizer<Window, Element> | null>(null);

export function useVirtualizer() {
  return useContext(VirtualizerContext);
}

export default function VirtualNoteList({
  notes,
  openId,
  prereqLinks,
  header
}: Readonly<{
  notes: Note[];
  openId?: string;
  prereqLinks?: Record<string, NoteLink[]>;
  header?: React.ReactNode;
}>) {
  const initialIndex = openId ? notes.findIndex((n) => n.id === openId) : -1;

  const virtualizer = useWindowVirtualizer({
    count: notes.length,
    estimateSize: () => ESTIMATED_HEIGHT,
    overscan: OVERSCAN,
    getItemKey: (index) => notes[index].id
  });

  const scrolledRef = useRef(false);
  useEffect(() => {
    if (!scrolledRef.current && initialIndex >= 0) {
      virtualizer.scrollToIndex(initialIndex, { align: 'start' });
      scrolledRef.current = true;
    }
  }, [initialIndex, virtualizer]);

  const measureRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        requestAnimationFrame(() => {
          virtualizer.measureElement(node);
        });
      }
    },
    [virtualizer]
  );

  const items = virtualizer.getVirtualItems();

  return (
    <VirtualizerContext.Provider value={virtualizer}>
      {header}
      <div
        key="virtual-list"
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        {items.map((virtualRow) => {
          const note = notes[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={measureRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`
              }}
            >
              <NoteCard note={note} prereqs={prereqLinks?.[note.id]} />
            </div>
          );
        })}
      </div>
    </VirtualizerContext.Provider>
  );
}
