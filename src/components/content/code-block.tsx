'use client';

import { type ComponentType, useEffect, useState } from 'react';
import type { CodeLang } from './code-highlighted';

interface Props {
  code: string;
  /** Language id — defaults to tsx so JSX + TS snippets both highlight. */
  language?: CodeLang;
}

/**
 * Syntax-highlighted code block. Renders the raw code in a matching <pre> (SSR HTML, readable with no
 * JS), then lazily swaps in the LeafyGreen highlighter on mount — so highlight.js ships only in this
 * client-only chunk and never bloats First-Load JS.
 */
export default function CodeBlock({ code, language = 'tsx' }: Props) {
  const [Highlighted, setHighlighted] = useState<ComponentType<Props> | null>(null);

  useEffect(() => {
    import('./code-highlighted').then((m) => setHighlighted(() => m.default));
  }, []);

  if (Highlighted) return <Highlighted code={code} language={language} />;

  return (
    <pre className="overflow-x-auto rounded-md border border-border bg-background p-3 font-mono text-[13px] leading-relaxed whitespace-pre">
      {code}
    </pre>
  );
}
