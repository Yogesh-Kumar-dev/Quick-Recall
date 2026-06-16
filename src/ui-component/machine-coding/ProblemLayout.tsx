'use client';
import { type ReactNode, useState } from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Panel, Group, Separator } from 'react-resizable-panels';

import MainCard from 'ui-component/cards/MainCard';
import CodeViewer from './CodeViewer';
import ProblemStatement from './ProblemStatement';
import type { ProblemMeta } from './ProblemStatement';

export type { ProblemMeta };

interface VersionData {
  component: ReactNode;
  code: string;
}

interface ProblemVersions {
  jsx: VersionData;
  tsx: VersionData;
  mui: VersionData;
}

const VERSION_CONFIG = [
  { key: 'jsx' as const, label: 'JSX', filename: 'JsxVersion.jsx' },
  { key: 'tsx' as const, label: 'TSX', filename: 'TsxVersion.tsx' },
  { key: 'mui' as const, label: 'MUI + TSX', filename: 'MuiVersion.tsx' }
];

interface ProblemLayoutProps {
  problem: ProblemMeta;
  versions: ProblemVersions;
}

export default function ProblemLayout({ problem, versions }: ProblemLayoutProps) {
  const theme = useTheme();
  // On phones the side-by-side split is too cramped — stack the panels vertically.
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [active, setActive] = useState(0);
  const versionList = VERSION_CONFIG.map(({ key, label, filename }) => ({
    label,
    filename,
    ...versions[key]
  }));
  const current = versionList[active];

  return (
    <MainCard title={problem.title} content={false}>
      <Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* ── Problem statement — full width, natural height ── */}
        <Box sx={{ flexShrink: 0, p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <ProblemStatement
            description={problem.description}
            requirements={problem.requirements}
            keyPatterns={problem.keyPatterns}
            interviewTip={problem.interviewTip}
          />
        </Box>

        {/* ── Resizable split: Output | Code ──
            Desktop: side-by-side (horizontal). Mobile: stacked (vertical). ── */}
        <Box>
          <Group orientation={isMobile ? 'vertical' : 'horizontal'} style={{ height: isMobile ? '140vh' : '80vh' }}>
            {/* Output panel — wider/taller by default */}
            <Panel defaultSize={isMobile ? 50 : 60} minSize={20}>
              <Box sx={{ height: '100%', overflowY: 'auto', p: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} mb={1.5} color="text.secondary">
                  Output — {current.label}
                </Typography>
                {current.component}
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
                {/* Six-dot grip icon — rows flip with orientation */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? 'repeat(3, 4px)' : 'repeat(2, 4px)',
                    gap: '3px'
                  }}
                >
                  {[...Array(6)].map((_, i) => (
                    <Box key={i} sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: 'text.disabled' }} />
                  ))}
                </Box>
              </Box>
            </Separator>

            {/* Code panel */}
            <Panel defaultSize={isMobile ? 50 : 40} minSize={20}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Version picker toolbar */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 2,
                    py: 0.75,
                    borderBottom: 1,
                    borderColor: 'divider',
                    flexShrink: 0,
                    bgcolor: 'background.paper'
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, whiteSpace: 'nowrap', ml: 'auto' }}>
                    Version:
                  </Typography>
                  <Select
                    value={active}
                    onChange={(e) => setActive(e.target.value as number)}
                    size="small"
                    sx={{
                      fontSize: 13,
                      height: 30,
                      minWidth: 160,
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' }
                    }}
                  >
                    {versionList.map((v, i) => (
                      <MenuItem key={i} value={i} sx={{ fontSize: 13 }}>
                        {v.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>

                {/* Code viewer — fills remaining height */}
                <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                  <CodeViewer code={current.code} filename={current.filename} />
                </Box>
              </Box>
            </Panel>
          </Group>
        </Box>
      </Box>
    </MainCard>
  );
}
