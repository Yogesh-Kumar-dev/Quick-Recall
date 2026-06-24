'use client';

import { type ReactNode, useState } from 'react';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import MainCard from 'ui-component/cards/MainCard';
import { segmentedControlSx } from 'ui-component/machine-coding/segmentedControlSx';
import AnnotatedFile from './AnnotatedFile';
import type { WalkthroughVariant } from 'types/content';

// One variant plus the live demo node for it. The demo is supplied as a node
// (not part of WalkthroughVariant) because it's a live React tree, not data.
export interface WalkthroughItem extends WalkthroughVariant {
  demo: ReactNode;
}

interface WalkthroughLayoutProps {
  title: string;
  // Short intro shown above the toggle — what this walkthrough compares.
  intro?: ReactNode;
  items: WalkthroughItem[];
  // Shared comparison strip, rendered once below the per-variant content.
  comparison?: ReactNode;
}

// Reusable shell for a "Deep Dive" library walkthrough. A pill toggle (same
// segmented-control styling as the machine-coding pages) swaps the WHOLE body
// between variants: each variant shows its live demo on top and an annotated
// implementation file below. Built to host future comparisons (Redux Toolkit
// vs Zustand, etc.) by passing different `items`.
export default function WalkthroughLayout({ title, intro, items, comparison }: WalkthroughLayoutProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = items[activeIdx];

  return (
    <MainCard title={title} content={false}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* ── Intro + pill toggle ── */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
          {intro && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
              {intro}
            </Typography>
          )}
          <ToggleButtonGroup
            value={activeIdx}
            exclusive
            onChange={(_, next: number | null) => next !== null && setActiveIdx(next)}
            size="small"
            sx={segmentedControlSx}
          >
            {items.map((item, i) => (
              <ToggleButton key={item.label} value={i} sx={{ whiteSpace: 'nowrap' }}>
                {item.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {/* ── Live demo for the active variant ── */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', flexShrink: 0, bgcolor: 'background.default' }}>
          <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase" letterSpacing={0.5} display="block" mb={1.5}>
            Live demo — {current.label}
          </Typography>
          {current.demo}
        </Box>

        {/* ── Annotated implementation file for the active variant ── */}
        <Box sx={{ height: '70vh', minHeight: 0 }}>
          <AnnotatedFile code={current.code} filename={current.filename} annotations={current.annotations} />
        </Box>

        {/* ── Shared comparison strip (rendered once, not per variant) ── */}
        {comparison && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', flexShrink: 0 }}>{comparison}</Box>
        )}
      </Box>
    </MainCard>
  );
}
