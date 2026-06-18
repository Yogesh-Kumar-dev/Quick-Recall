'use client';

import Box from '@mui/material/Box';

// Real MongoDB LeafyGreen Code component (inherits dark mode via LeafyGreenBridge). Replaces the
// previous Monaco editor — we lose code-folding, but gain MongoDB-native styling, a copy button,
// and line numbers. The Preview/Code + version tabs live in ProblemLayout (our own chrome).
import { LGCode, LGCodeLanguage, LGCopyButtonAppearance } from 'ui-component/leafygreen';

interface CodeViewerProps {
  code: string;
  filename?: string;
}

// Derive LeafyGreen language from filename extension.
function getLanguage(filename: string): (typeof LGCodeLanguage)[keyof typeof LGCodeLanguage] {
  if (filename.endsWith('.tsx') || filename.endsWith('.ts')) return LGCodeLanguage.TypeScript;
  if (filename.endsWith('.jsx') || filename.endsWith('.js')) return LGCodeLanguage.JavaScript;
  return LGCodeLanguage.TypeScript;
}

export default function CodeViewer({ code, filename = 'source.tsx' }: CodeViewerProps) {
  return (
    // The parent (ProblemLayout) gives this a bounded height; we scroll within it. LeafyGreen
    // Code sizes to its content, so the scroll lives on this wrapper — long files get a vertical
    // scrollbar instead of overflowing the panel.
    <Box sx={{ height: '100%', overflow: 'auto', '& pre': { margin: 0 } }}>
      <LGCode language={getLanguage(filename)} showLineNumbers copyButtonAppearance={LGCopyButtonAppearance.Persist}>
        {code}
      </LGCode>
    </Box>
  );
}
