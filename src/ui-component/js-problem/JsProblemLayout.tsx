'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import MainCard from 'ui-component/cards/MainCard';
import CodeViewer from 'ui-component/machine-coding/CodeViewer';
import { segmentedControlSx } from 'ui-component/machine-coding/segmentedControlSx';
import JsProblemStatement from './JsProblemStatement';
import ApproachDetails from './ApproachDetails';
import type { ApproachData, JsProblemMeta } from 'types/content';

export type { JsProblemMeta, ApproachData };

type ViewMode = 'details' | 'code';

interface JsProblemLayoutProps {
  problem: JsProblemMeta;
  approaches: ApproachData[];
}

export default function JsProblemLayout({ problem, approaches }: JsProblemLayoutProps) {
  const [view, setView] = useState<ViewMode>('details');
  const [activeIdx, setActiveIdx] = useState(0);
  const current = approaches[activeIdx];

  return (
    <MainCard title={problem.title} content={false}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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

        {/* ── Toolbar: Details | Code toggle ── */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 1,
            borderBottom: 1,
            borderColor: 'divider',
            flexShrink: 0,
            bgcolor: 'background.paper'
          }}
        >
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(_, next: ViewMode | null) => next && setView(next)}
            size="small"
            sx={segmentedControlSx}
          >
            <ToggleButton value="details">Details</ToggleButton>
            <ToggleButton value="code">Code</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* ── Active view — one at a time, full width ── */}
        <Box sx={{ height: '75vh', display: 'flex', flexDirection: 'column' }}>
          {view === 'details' ? (
            <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
              <Box sx={{ px: 1, pt: 1 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase" letterSpacing={0.5}>
                  Approach — {current.label}
                </Typography>
              </Box>
              <ApproachDetails approach={current} />
            </Box>
          ) : (
            <>
              {/* Approach selector — same segmented-pill style, scrolls if many approaches */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  py: 1,
                  borderBottom: 1,
                  borderColor: 'divider',
                  flexShrink: 0,
                  overflowX: 'auto'
                }}
              >
                <ToggleButtonGroup
                  value={activeIdx}
                  exclusive
                  onChange={(_, next: number | null) => next !== null && setActiveIdx(next)}
                  size="small"
                  sx={segmentedControlSx}
                >
                  {approaches.map((a, i) => (
                    <ToggleButton key={a.label} value={i} sx={{ whiteSpace: 'nowrap' }}>
                      {a.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>

              {/* Code viewer — fills remaining height */}
              <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                <CodeViewer code={current.code} filename={current.filename} />
              </Box>
            </>
          )}
        </Box>
      </Box>
    </MainCard>
  );
}
