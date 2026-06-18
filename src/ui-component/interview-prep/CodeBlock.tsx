'use client';
import Box from '@mui/material/Box';

// Real MongoDB LeafyGreen Code component (inherits dark mode via LeafyGreenBridge).
import { LGCode, LGCodeLanguage, LGCopyButtonAppearance } from 'ui-component/leafygreen';

interface CodeBlockProps {
  code: string;
  /** Language id — defaults to tsx so JSX + TS snippets both highlight. */
  language?: 'jsx' | 'tsx' | 'javascript' | 'typescript';
  /** Bottom margin (theme spacing units). */
  mb?: number;
}

// LeafyGreen Code understands typescript/javascript; map our jsx/tsx onto those (LeafyGreen
// highlights JSX/TSX fine under the ts/js grammars).
const LANGUAGE_MAP: Record<NonNullable<CodeBlockProps['language']>, (typeof LGCodeLanguage)[keyof typeof LGCodeLanguage]> = {
  jsx: LGCodeLanguage.JavaScript,
  tsx: LGCodeLanguage.TypeScript,
  javascript: LGCodeLanguage.JavaScript,
  typescript: LGCodeLanguage.TypeScript
};

/**
 * Lightweight syntax-highlighted code block for inline use in note cards, quick-recall
 * sections, etc. Renders via the LeafyGreen Code component so it matches MongoDB's code styling
 * and gets a copy button for free. Same props as before so call sites are unchanged.
 */
export default function CodeBlock({ code, language = 'tsx', mb = 2 }: CodeBlockProps) {
  return (
    <Box sx={{ mb }}>
      <LGCode language={LANGUAGE_MAP[language]} copyButtonAppearance={LGCopyButtonAppearance.Hover}>
        {code}
      </LGCode>
    </Box>
  );
}
