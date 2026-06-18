'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { OnMount } from '@monaco-editor/react';
import type { editor as MonacoEditor } from 'monaco-editor';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { IconCopy, IconCheck } from '@tabler/icons-react';

// Source Code Pro — the exact MongoDB LeafyGreen code typeface.
import { monoFont } from 'config';

// Lazy-load Monaco (~300KB+): it's only needed once a machine-coding page is open, so keep it out
// of the shared/initial chunk. ssr: false — Monaco is browser-only and the viewer is interactive.
const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <Box sx={{ height: '100%', bgcolor: '#1e1e1e' }} />
});

interface CodeViewerProps {
  code: string;
  filename?: string;
}

// Derive Monaco language from filename extension
function getLanguage(filename: string): string {
  if (filename.endsWith('.tsx')) return 'typescript';
  if (filename.endsWith('.ts')) return 'typescript';
  if (filename.endsWith('.jsx')) return 'javascript';
  if (filename.endsWith('.js')) return 'javascript';
  return 'typescript';
}

export default function CodeViewer({ code, filename = 'source.tsx' }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);

  // Re-collapse all blocks whenever the code (i.e. the selected version) changes
  useEffect(() => {
    editorRef.current?.getAction('editor.foldAll')?.run();
  }, [code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.getAction('editor.foldAll')?.run();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      {/* ── Header bar ── */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 0.75,
          bgcolor: '#1e1e1e',
          borderBottom: '1px solid #333',
          flexShrink: 0
        }}
      >
        <Typography variant="caption" sx={{ color: '#9cdcfe', fontFamily: monoFont, fontSize: 12 }}>
          📄 {filename}
        </Typography>
        <Tooltip title={copied ? 'Copied!' : 'Copy code'}>
          <IconButton size="small" onClick={handleCopy} sx={{ color: copied ? '#4ec9b0' : '#858585', '&:hover': { color: '#d4d4d4' } }}>
            {copied ? <IconCheck size={15} /> : <IconCopy size={15} />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* ── Monaco editor ── */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <Editor
          language={getLanguage(filename)}
          value={code}
          theme="vs-dark"
          onMount={handleMount}
          options={{
            readOnly: true,
            fontSize: 12.5,
            fontFamily: monoFont,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            folding: true,
            lineNumbers: 'on',
            renderLineHighlight: 'none',
            contextmenu: false,
            scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
            padding: { top: 8, bottom: 8 }
          }}
        />
      </Box>
    </Box>
  );
}
