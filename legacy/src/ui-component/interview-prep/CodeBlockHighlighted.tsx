'use client';
import Box from '@mui/material/Box';

// Real MongoDB LeafyGreen Code component (inherits dark mode via LeafyGreenBridge). Imported from
// the isolated leafygreen/code module so highlight.js only ships in this lazily-loaded chunk.
import { LGCode, LGCodeLanguage, LGCopyButtonAppearance } from 'ui-component/leafygreen/code';

export type CodeLang = 'jsx' | 'tsx' | 'javascript' | 'typescript';

// LeafyGreen Code understands typescript/javascript; map our jsx/tsx onto those (it highlights
// JSX/TSX fine under the ts/js grammars).
const LANGUAGE_MAP: Record<CodeLang, (typeof LGCodeLanguage)[keyof typeof LGCodeLanguage]> = {
  jsx: LGCodeLanguage.JavaScript,
  tsx: LGCodeLanguage.TypeScript,
  javascript: LGCodeLanguage.JavaScript,
  typescript: LGCodeLanguage.TypeScript
};

export default function CodeBlockHighlighted({ code, language = 'tsx', mb = 2 }: { code: string; language?: CodeLang; mb?: number }) {
  return (
    <Box sx={{ mb }}>
      <LGCode language={LANGUAGE_MAP[language]} copyButtonAppearance={LGCopyButtonAppearance.Hover}>
        {code}
      </LGCode>
    </Box>
  );
}
