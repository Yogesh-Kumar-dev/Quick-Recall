'use client';
import { useRef, useState, useLayoutEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { AnimatePresence, motion } from 'framer-motion';
import Box from '@mui/material/Box';
import QuickRecallSection from './QuickRecallSection';
import type { QuickRecallSection as QRSection } from 'types/content';

interface VirtualQuickRecallListProps {
  sections: QRSection[];
  defaultExpanded: boolean;
}

const variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: 'easeIn' } }
};

export default function VirtualQuickRecallList({ sections, defaultExpanded }: VirtualQuickRecallListProps) {
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
        data={sections}
        itemContent={(_, section) => (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={section.title}
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ paddingBottom: 12 }}
            >
              <QuickRecallSection section={section} defaultExpanded={defaultExpanded} />
            </motion.div>
          </AnimatePresence>
        )}
      />
    </Box>
  );
}
