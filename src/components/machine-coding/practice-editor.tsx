'use client';

import { CodeEditor } from '@leafygreen-ui/code-editor';
import { autocompletion, closeBrackets, closeBracketsKeymap, completeFromList, completionKeymap, ifNotIn } from '@codemirror/autocomplete';
import { localCompletionSource, snippets } from '@codemirror/lang-javascript';
import { keymap } from '@codemirror/view';
import type { ComponentRef, Ref } from 'react';

// The editor's own autocomplete wiring doesn't activate in @leafygreen-ui/code-editor 1.0.6
// (language-data completion sources never surface), so supply completion explicitly with an
// override: in-scope variables/functions + the standard JS snippets, as you type or Ctrl+Space.
// Plus auto-closing brackets/quotes for a VS Code-ish feel.
const DONT_COMPLETE_IN = ['LineComment', 'BlockComment', 'String', 'TemplateString'];
const EDITOR_EXTENSIONS = [
  autocompletion({ override: [localCompletionSource, ifNotIn(DONT_COMPLETE_IN, completeFromList(snippets))] }),
  closeBrackets(),
  keymap.of([...completionKeymap, ...closeBracketsKeymap])
];

// Rendered only inside an active practice session, and only ever via React.lazy —
// this file is the code-split boundary that keeps CodeMirror/prettier out of the
// problem-page bundle. Don't import it statically (types are fine).

export type PracticeEditorHandle = ComponentRef<typeof CodeEditor>;

interface Props {
  ref: Ref<PracticeEditorHandle>;
  defaultValue: string;
  language: 'javascript' | 'jsx';
  onCopy: () => void;
}

export default function PracticeEditor({ ref, defaultValue, language, onCopy }: Props) {
  return (
    <CodeEditor
      ref={ref}
      defaultValue={defaultValue}
      language={language}
      extensions={EDITOR_EXTENSIONS}
      minHeight="320px"
      maxHeight="60vh"
      darkMode
    >
      {/* Panel supplies the IDE-ish header: copy, prettier format, undo/redo/download menu */}
      <CodeEditor.Panel title="Your solution" showCopyButton showFormatButton showSecondaryMenuButton onCopyClick={onCopy} />
    </CodeEditor>
  );
}
