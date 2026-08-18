'use client';

// Real MongoDB LeafyGreen Code highlighter. Loaded ONLY via the lazy import in code-block.tsx so
// highlight.js (hundreds of KB) stays out of First-Load JS and never runs on the server.
import { Code, CopyButtonAppearance, Language } from '@leafygreen-ui/code';

export type CodeLang = 'jsx' | 'tsx' | 'javascript' | 'typescript' | 'bash' | 'markdown';

// LeafyGreen understands typescript/javascript; JSX/TSX highlight fine under those grammars.
// 'bash' highlights shell commands; 'markdown' highlights ASCII diagrams and plain text.
const LANGUAGE_MAP: Record<CodeLang, Language> = {
  jsx: Language.JavaScript,
  tsx: Language.TypeScript,
  javascript: Language.JavaScript,
  typescript: Language.TypeScript,
  bash: Language.Bash,
  markdown: Language.Markdown
};

export default function CodeHighlighted({ code, language = 'tsx' }: { code: string; language?: CodeLang }) {
  return (
    <Code language={LANGUAGE_MAP[language]} copyButtonAppearance={CopyButtonAppearance.Hover}>
      {code}
    </Code>
  );
}
