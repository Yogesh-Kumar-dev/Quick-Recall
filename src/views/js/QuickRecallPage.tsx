'use client';
import { useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import MainCard from 'ui-component/cards/MainCard';
import QuickRecallSectionComponent from 'ui-component/interview-prep/QuickRecallSection';
import { useSelector } from 'store';
import { selectJsQuickRecall, selectTsQuickRecall } from 'store/slices/javascript';

export default function QuickRecallPage() {
  const jsQuickRecall = useSelector(selectJsQuickRecall);
  const tsQuickRecall = useSelector(selectTsQuickRecall);
  const allSections = useMemo(() => [...jsQuickRecall, ...tsQuickRecall], [jsQuickRecall, tsQuickRecall]);

  const [allExpanded, setAllExpanded] = useState(true);
  const [expandKey, setExpandKey] = useState(0);

  const toggleAll = (expand: boolean) => {
    setAllExpanded(expand);
    setExpandKey((k) => k + 1);
  };

  return (
    <MainCard
      title="⚡ JS & TypeScript Quick Recall"
      secondary={
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" onClick={() => toggleAll(true)}>
            Expand All
          </Button>
          <Button size="small" variant="outlined" onClick={() => toggleAll(false)}>
            Collapse All
          </Button>
        </Stack>
      }
    >
      <Typography variant="body2" color="text.secondary" mb={3} sx={{ lineHeight: 1.7 }}>
        Last-minute cheatsheet — scan in 5–10 minutes before your interview. All key concepts, gotchas, and code snippets.
      </Typography>

      <Stack spacing={0} key={expandKey}>
        {allSections.map((section, i) => (
          <QuickRecallSectionComponent key={i} section={section} defaultExpanded={allExpanded} />
        ))}
      </Stack>
    </MainCard>
  );
}
