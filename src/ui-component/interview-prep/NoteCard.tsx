'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconAlertTriangle, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import CodeBlock from 'ui-component/interview-prep/CodeBlock';
import BookmarkButton from 'ui-component/interview-prep/BookmarkButton';
import type { Note } from 'types/content';

const DIFFICULTY_COLOR: Record<Note['difficulty'], 'success' | 'warning' | 'error'> = {
  basic: 'success',
  intermediate: 'warning',
  advanced: 'error'
};

const DIFFICULTY_BORDER: Record<Note['difficulty'], string> = {
  basic: 'success.main',
  intermediate: 'warning.main',
  advanced: 'error.main'
};

interface NoteCardProps {
  note: Note;
  defaultExpanded?: boolean;
  /** Controlled mode: pass isOpen + onToggle together to let the parent manage state */
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function NoteCard({ note, defaultExpanded = false, isOpen, onToggle }: NoteCardProps) {
  // Uncontrolled fallback (used when isOpen is not provided, e.g. standalone usage)
  const [localExpanded, setLocalExpanded] = useState(defaultExpanded);

  const isControlled = isOpen !== undefined;
  const expanded = isControlled ? isOpen : localExpanded;
  const handleToggle = () => {
    if (isControlled) {
      onToggle?.();
    } else {
      setLocalExpanded((v) => !v);
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        borderLeft: '3px solid',
        borderLeftColor: DIFFICULTY_BORDER[note.difficulty],
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 2 }
      }}
    >
      {/* ── Header (always visible) ── */}
      <CardContent sx={{ pb: expanded ? 0 : undefined }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" mb={0.5}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                {note.title}
              </Typography>
              <Chip
                label={note.difficulty}
                color={DIFFICULTY_COLOR[note.difficulty]}
                size="small"
                variant="outlined"
                sx={{ textTransform: 'capitalize' }}
              />
              <Chip label={note.category} size="small" variant="outlined" />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {note.summary}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, mt: 0.25 }}>
            <BookmarkButton kind="note" refId={note.id} />
            <IconButton size="small" onClick={handleToggle} aria-label={expanded ? 'Collapse note' : 'Expand note'}>
              {expanded ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
            </IconButton>
          </Box>
        </Box>
      </CardContent>

      {/* ── Expanded details ── */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <CardContent sx={{ pt: 1.5 }}>
          {/* Key points */}
          <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase" letterSpacing={0.5}>
            Key Points
          </Typography>
          <Box component="ul" sx={{ mt: 0.5, mb: note.gotcha || note.codeSnippet || note.textbookDef || note.eli5 ? 2 : 0, pl: 2.5 }}>
            {note.keyPoints.map((point, i) => (
              <Box component="li" key={i} sx={{ mb: 0.25 }}>
                <Typography variant="body2" color="text.secondary">
                  {point}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Textbook Definition — intermediate & advanced only */}
          {note.textbookDef && note.difficulty !== 'basic' && (
            <Box sx={{ p: 1.5, mb: 2, bgcolor: 'secondary.light', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
              <Typography
                variant="caption"
                fontWeight={700}
                color="secondary.dark"
                textTransform="uppercase"
                letterSpacing={0.5}
                display="block"
                mb={0.5}
              >
                Textbook Definition
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.7, color: 'secondary.dark' }}>
                {note.textbookDef}
              </Typography>
            </Box>
          )}

          {/* ELI5 — intermediate & advanced only */}
          {note.eli5 && note.difficulty !== 'basic' && (
            <Box sx={{ p: 1.5, mb: 2, bgcolor: 'success.light', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
              <Typography
                variant="caption"
                fontWeight={700}
                color="success.dark"
                textTransform="uppercase"
                letterSpacing={0.5}
                display="block"
                mb={0.5}
              >
                Explain Like I&apos;m 5
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.8, color: 'success.dark', whiteSpace: 'pre-line' }}>
                {note.eli5}
              </Typography>
            </Box>
          )}

          {/* Code snippet — Prism-highlighted, fixed dark surface (readable in both light & dark mode) */}
          {note.codeSnippet && <CodeBlock code={note.codeSnippet} />}

          {/* Gotcha / common mistake */}
          {note.gotcha && (
            <Box sx={{ p: 1.5, bgcolor: 'warning.light', borderRadius: 1, border: '1px solid', borderColor: 'warning.main' }}>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: 'warning.dark', display: 'flex', alignItems: 'flex-start', gap: 0.75 }}
              >
                <IconAlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>
                  <strong>Gotcha:</strong> {note.gotcha}
                </span>
              </Typography>
            </Box>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
}
