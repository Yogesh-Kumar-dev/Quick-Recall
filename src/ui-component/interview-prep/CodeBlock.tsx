'use client';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Register only the languages we actually use — keeps the bundle small.
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);

interface CodeBlockProps {
  code: string;
  /** Prism language id — defaults to tsx so JSX + TS snippets both highlight. */
  language?: 'jsx' | 'tsx' | 'javascript' | 'typescript';
  /** Bottom margin (theme spacing units). */
  mb?: number;
}

/**
 * Lightweight syntax-highlighted code block for inline use in note cards,
 * quick-recall sections, etc. Uses Prism (not Monaco) so it is cheap to render
 * many instances in a scrolling list, and always renders on a fixed dark
 * surface so it stays readable in both light and dark theme modes.
 */
export default function CodeBlock({ code, language = 'tsx', mb = 2 }: CodeBlockProps) {
  return (
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      wrapLongLines
      customStyle={{
        margin: 0,
        marginBottom: mb * 8,
        padding: 12,
        borderRadius: 6,
        fontSize: 12,
        lineHeight: 1.6,
        border: '1px solid #333',
        background: '#1e1e1e'
      }}
      codeTagProps={{
        style: {
          fontFamily: '"Fira Code", "Cascadia Code", Consolas, "Courier New", monospace'
        }
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
}
