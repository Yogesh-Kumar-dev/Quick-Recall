'use client';

import Box from '@mui/material/Box';

// Real MongoDB LeafyGreen Code component, imported from the isolated leafygreen/code module so
// highlight.js only ships in this lazily-loaded chunk (not every barrel consumer's First-Load JS).
import { LGCode, LGCodeLanguage, LGCopyButtonAppearance } from 'ui-component/leafygreen/code';

// Derive LeafyGreen language from filename extension.
function getLanguage(filename: string): (typeof LGCodeLanguage)[keyof typeof LGCodeLanguage] {
  if (filename.endsWith('.tsx') || filename.endsWith('.ts')) return LGCodeLanguage.TypeScript;
  if (filename.endsWith('.jsx') || filename.endsWith('.js')) return LGCodeLanguage.JavaScript;
  return LGCodeLanguage.TypeScript;
}

export default function CodeViewerHighlighted({ code, filename = 'source.tsx' }: { code: string; filename?: string }) {
  return (
    <Box sx={{ height: '100%', overflow: 'auto', '& pre': { margin: 0 } }}>
      <LGCode language={getLanguage(filename)} showLineNumbers copyButtonAppearance={LGCopyButtonAppearance.Persist}>
        {code}
      </LGCode>
    </Box>
  );
}
