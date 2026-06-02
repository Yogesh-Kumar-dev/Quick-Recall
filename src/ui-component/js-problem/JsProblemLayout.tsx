'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Panel, Group, Separator } from 'react-resizable-panels';

import MainCard from 'ui-component/cards/MainCard';
import CodeViewer from 'ui-component/machine-coding/CodeViewer';
import JsProblemStatement from './JsProblemStatement';
import ApproachDetails from './ApproachDetails';
import type { ApproachData, JsProblemMeta } from 'types/content';

export type { JsProblemMeta, ApproachData };

interface JsProblemLayoutProps {
  problem: JsProblemMeta;
  approaches: ApproachData[];
}

export default function JsProblemLayout({ problem, approaches }: JsProblemLayoutProps) {
  const theme = useTheme();
  // On phones the side-by-side split is too cramped — stack the panels vertically.
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeIdx, setActiveIdx] = useState(0);
  const current = approaches[activeIdx];

  return (
    <MainCard title={problem.title} content={false}>
      <Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* ── Problem statement — full width, natural height ── */}
        <Box sx={{ flexShrink: 0, p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <JsProblemStatement
            description={problem.description}
            examples={problem.examples}
            constraints={problem.constraints}
            interviewTip={problem.interviewTip}
            tags={problem.tags}
          />
        </Box>

        {/* ── Approach tabs ── */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
          <Tabs
            value={activeIdx}
            onChange={(_, v) => setActiveIdx(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 2, minHeight: 44 }}
          >
            {approaches.map((a, i) => (
              <Tab key={i} label={a.label} sx={{ minHeight: 44, fontSize: 13, fontWeight: 600 }} />
            ))}
          </Tabs>
        </Box>

        {/* ── Resizable split: Approach Details | Code ──
            Desktop: side-by-side (horizontal). Mobile: stacked (vertical). ── */}
        <Box>
          <Group orientation={isMobile ? 'vertical' : 'horizontal'} style={{ height: isMobile ? '130vh' : '70vh' }}>
            {/* Approach details panel */}
            <Panel defaultSize={isMobile ? 45 : 38} minSize={20}>
              <Box sx={{ height: '100%', overflowY: 'auto' }}>
                <Box sx={{ px: 1, pt: 1 }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase" letterSpacing={0.5}>
                    Approach — {current.label}
                  </Typography>
                </Box>
                <ApproachDetails approach={current} />
              </Box>
            </Panel>

            {/* Drag handle — orientation-aware */}
            <Separator>
              <Box
                sx={{
                  ...(isMobile
                    ? { width: '100%', height: 12, cursor: 'row-resize', borderTop: '1px solid', borderBottom: '1px solid' }
                    : { width: 12, height: '100%', cursor: 'col-resize', borderLeft: '1px solid', borderRight: '1px solid' }),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.100',
                  borderColor: 'divider',
                  transition: 'background-color 0.15s',
                  '&:hover, &[data-dragging]': { bgcolor: 'primary.light' }
                }}
              >
                <Box sx={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 4px)' : 'repeat(2, 4px)', gap: '3px' }}>
                  {[...Array(6)].map((_, i) => (
                    <Box key={i} sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: 'text.disabled' }} />
                  ))}
                </Box>
              </Box>
            </Separator>

            {/* Code panel */}
            <Panel defaultSize={isMobile ? 55 : 62} minSize={30}>
              <Box sx={{ height: '100%', overflow: 'hidden' }}>
                <CodeViewer code={current.code} filename={current.filename} />
              </Box>
            </Panel>
          </Group>
        </Box>
      </Box>
    </MainCard>
  );
}
