'use client';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import MainCard from 'ui-component/cards/MainCard';
import VirtualQuickRecallList from 'ui-component/interview-prep/VirtualQuickRecallList';
import { PdfLauncher } from 'ui-component/pdf-viewer';
import { REACT_QUICK_RECALL_PDFS } from 'data/pdf-guides';
import { useSelector } from 'store';
import useInjectReducer from 'store/useInjectReducer';
import reactReducer, { selectReactQuickRecall } from 'store/slices/react';

export default function ReactQuickRecallPage() {
  useInjectReducer('react', reactReducer);
  const reactQuickRecall = useSelector(selectReactQuickRecall);

  const [allExpanded, setAllExpanded] = useState(true);
  const [expandKey, setExpandKey] = useState(0);

  const toggleAll = (expand: boolean) => {
    setAllExpanded(expand);
    setExpandKey((k) => k + 1);
  };

  return (
    <MainCard
      title="⚡ React Quick Recall"
      secondary={
        <Stack direction="row" spacing={1} alignItems="center">
          <Button size="small" variant="outlined" onClick={() => toggleAll(true)}>
            Expand All
          </Button>
          <Button size="small" variant="outlined" onClick={() => toggleAll(false)}>
            Collapse All
          </Button>
          <PdfLauncher guides={REACT_QUICK_RECALL_PDFS} title="React Interview PDFs" buttonLabel="React interview PDFs" />
        </Stack>
      }
    >
      <Typography variant="body2" color="text.secondary" mb={3} sx={{ lineHeight: 1.7 }}>
        React hooks cheatsheet, rendering concepts, performance patterns, and common gotchas — scan in 5–10 minutes before your interview.
      </Typography>

      <VirtualQuickRecallList key={expandKey} sections={reactQuickRecall} defaultExpanded={allExpanded} />
    </MainCard>
  );
}
