'use client';

import Box from '@mui/material/Box';

import { monoFont } from 'config';
import { useLazyDefault } from 'utils/useLazyDefault';

interface CodeViewerProps {
  code: string;
  filename?: string;
}

// LeafyGreen Code (which replaced the Monaco editor here — we lose code-folding but gain
// MongoDB-native styling, a copy button, and line numbers) bundles highlight.js, so it's
// lazy-loaded to keep it out of First-Load JS. Until the chunk arrives we show the raw source in a
// matching <pre>; then swap to the highlighted, line-numbered viewer. The Preview/Code + version
// tabs live in ProblemLayout (our own chrome).
export default function CodeViewer({ code, filename = 'source.tsx' }: CodeViewerProps) {
  const Highlighted = useLazyDefault<CodeViewerProps>(() => import('./CodeViewerHighlighted'));

  if (Highlighted) return <Highlighted code={code} filename={filename} />;

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <Box component="pre" sx={{ m: 0, p: 1.5, fontFamily: monoFont, fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre' }}>
        {code}
      </Box>
    </Box>
  );
}
