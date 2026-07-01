'use client';
import Box from '@mui/material/Box';

import { monoFont } from 'config';
import { useLazyDefault } from 'utils/useLazyDefault';
import type { CodeLang } from './CodeBlockHighlighted';

interface CodeBlockProps {
  code: string;
  /** Language id — defaults to tsx so JSX + TS snippets both highlight. */
  language?: CodeLang;
  /** Bottom margin (theme spacing units). */
  mb?: number;
}

/**
 * Syntax-highlighted code block for note cards, quick-recall sections, etc.
 *
 * The LeafyGreen Code highlighter bundles highlight.js (hundreds of KB), so it's lazy-loaded to keep
 * it out of First-Load JS. Until the chunk arrives we render the raw code in a matching <pre>
 * (instant, readable, and present in SSR HTML), then swap to the highlighted version. The fallback
 * is sized like the real block so the upgrade doesn't shift layout. Same props as before, so call
 * sites are unchanged.
 */
export default function CodeBlock({ code, language = 'tsx', mb = 2 }: CodeBlockProps) {
  const Highlighted = useLazyDefault<CodeBlockProps>(() => import('./CodeBlockHighlighted'));

  if (Highlighted) return <Highlighted code={code} language={language} mb={mb} />;

  return (
    <Box
      component="pre"
      sx={{
        mt: 0,
        mb,
        p: 1.5,
        borderRadius: 1.5,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        overflowX: 'auto',
        fontFamily: monoFont,
        fontSize: 13,
        lineHeight: 1.5,
        whiteSpace: 'pre'
      }}
    >
      {code}
    </Box>
  );
}
