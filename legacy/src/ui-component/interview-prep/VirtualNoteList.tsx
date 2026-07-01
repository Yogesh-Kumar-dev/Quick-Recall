'use client';
import { useRef, useState, useLayoutEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { AnimatePresence, motion } from 'framer-motion';
import Box from '@mui/material/Box';
import NoteCard from './NoteCard';
import type { Note } from 'types/content';

interface VirtualNoteListProps {
  notes: Note[];
  openId: string | null;
  onToggle: (id: string) => void;
}

const variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: 'easeIn' } }
};

export default function VirtualNoteList({ notes, openId, onToggle }: VirtualNoteListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(600);

  useLayoutEffect(() => {
    function measure() {
      if (!containerRef.current) return;
      const top = containerRef.current.getBoundingClientRect().top;
      setListHeight(window.innerHeight - top - 16);
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <Box ref={containerRef} sx={{ height: listHeight, overflow: 'hidden' }}>
      <Virtuoso
        style={{ height: '100%' }}
        data={notes}
        itemContent={(_, note) => (
          <AnimatePresence mode="popLayout">
            <motion.div key={note.id} variants={variants} initial="hidden" animate="visible" exit="exit" style={{ paddingBottom: 12 }}>
              <NoteCard note={note} isOpen={openId === note.id} onToggle={() => onToggle(note.id)} />
            </motion.div>
          </AnimatePresence>
        )}
      />
    </Box>
  );
}
