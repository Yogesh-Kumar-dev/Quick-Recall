'use client';
import { type ReactNode, useState } from 'react';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import MainCard from 'ui-component/cards/MainCard';
import CodeViewer from './CodeViewer';
import ProblemStatement from './ProblemStatement';
import { segmentedControlSx } from './segmentedControlSx';
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

type ViewMode = 'preview' | 'code';

interface ProblemLayoutProps {
  problem: ProblemMeta;
  versions: ProblemVersions;
}

export default function ProblemLayout({ problem, versions }: ProblemLayoutProps) {
  const [active, setActive] = useState(0);
  const [view, setView] = useState<ViewMode>('preview');

  const versionList = VERSION_CONFIG.map(({ key, label, filename }) => ({
    label,
    filename,
    ...versions[key]
  }));
  const current = versionList[active];

  return (
    <MainCard title={problem.title} content={false}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* ── Problem statement — full width, natural height ── */}
        <Box sx={{ flexShrink: 0, p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <ProblemStatement
            description={problem.description}
            requirements={problem.requirements}
            keyPatterns={problem.keyPatterns}
            interviewTip={problem.interviewTip}
          />
        </Box>

        {/* ── Toolbar: Preview|Code toggle (left) + version picker (right) ── */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5,
            px: 2,
            py: 1,
            borderBottom: 1,
            borderColor: 'divider',
            flexShrink: 0,
            bgcolor: 'background.paper'
          }}
        >
          {/* Segmented Preview | Code control */}
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(_, next: ViewMode | null) => next && setView(next)}
            size="small"
            sx={segmentedControlSx}
          >
            <ToggleButton value="preview">Preview</ToggleButton>
            <ToggleButton value="code">Code</ToggleButton>
          </ToggleButtonGroup>

          {/* Version selector — same segmented-pill style; controls both preview output and source */}
          <ToggleButtonGroup
            value={active}
            exclusive
            onChange={(_, next: number | null) => next !== null && setActive(next)}
            size="small"
            sx={[segmentedControlSx, { overflowX: 'auto' }]}
          >
            {versionList.map((v, i) => (
              <ToggleButton key={v.label} value={i} sx={{ whiteSpace: 'nowrap' }}>
                {v.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {/* ── Active view — one at a time, full width ── */}
        <Box sx={{ height: '80vh' }}>
          {view === 'preview' ? (
            // Demos render on the normal (dark) app surface. Some demos use hardcoded light-theme
            // inline styles, so their cards stay light — acceptable per the "dark panel, demos
            // as-is" decision; the MUI-version demos render dark-native via the app theme.
            <Box sx={{ height: '100%', overflowY: 'auto', p: 2 }}>{current.component}</Box>
          ) : (
            <CodeViewer code={current.code} filename={current.filename} />
          )}
        </Box>
      </Box>
    </MainCard>
  );
}
