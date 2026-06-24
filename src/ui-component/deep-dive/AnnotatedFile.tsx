'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import CodeViewer from 'ui-component/machine-coding/CodeViewer';
import type { Annotation } from 'types/content';

interface AnnotatedFileProps {
  code: string;
  filename: string;
  annotations: Annotation[];
}

// Formats a line range as "L12" or "L12–18" for the annotation header.
function rangeLabel([from, to]: [number, number]): string {
  return from === to ? `L${from}` : `L${from}–${to}`;
}

// Displays a source file (via the shared CodeViewer) next to a column of
// teaching callouts. Each annotation points at a line range of the code so the
// reader can map the explanation back to the implementation. On narrow screens
// the two stack vertically (notes under the code).
export default function AnnotatedFile({ code, filename, annotations }: AnnotatedFileProps) {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} sx={{ height: '100%', minHeight: 0 }}>
      {/* Code — fills the left/top, scrolls within its bounds */}
      <Box sx={{ flex: { xs: 'none', md: 1.6 }, minWidth: 0, minHeight: { xs: 360, md: 0 }, borderRight: { md: 1 }, borderColor: { md: 'divider' } }}>
        <CodeViewer code={code} filename={filename} />
      </Box>

      {/* Annotations — scrollable column of callouts keyed to line ranges */}
      <Box sx={{ flex: { xs: 'none', md: 1 }, minWidth: 0, overflowY: 'auto', p: 2, bgcolor: 'background.default' }}>
        <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase" letterSpacing={0.5} display="block" mb={1.5}>
          Walkthrough
        </Typography>
        <Stack spacing={1.5}>
          {annotations.map((a) => (
            <Box
              key={`${a.lines[0]}-${a.title}`}
              sx={{ p: 1.5, borderRadius: 1, border: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
            >
              <Stack direction="row" spacing={1} alignItems="baseline" mb={0.5}>
                <Box
                  component="span"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'primary.main',
                    bgcolor: 'primary.light',
                    px: 0.75,
                    py: 0.25,
                    borderRadius: 0.5,
                    flexShrink: 0
                  }}
                >
                  {rangeLabel(a.lines)}
                </Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  {a.title}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {a.body}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}
