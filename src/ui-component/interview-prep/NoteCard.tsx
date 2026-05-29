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
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import type { Note } from 'types/content';

const DIFFICULTY_COLOR: Record<Note['difficulty'], 'success' | 'warning' | 'error'> = {
  basic: 'success',
  intermediate: 'warning',
  advanced: 'error'
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
          <IconButton size="small" onClick={handleToggle} sx={{ flexShrink: 0, mt: 0.25 }}>
            {expanded ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
          </IconButton>
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
          <Box
            component="ul"
            sx={{ mt: 0.5, mb: note.gotcha || note.codeSnippet || note.textbookDef || note.eli5 ? 2 : 0, pl: 2.5 }}
          >
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
            <Box sx={{ p: 1.5, mb: 2, bgcolor: '#e8eaf6', borderRadius: 1, border: '1px solid #9fa8da' }}>
              <Typography
                variant="caption"
                fontWeight={700}
                color="#3949ab"
                textTransform="uppercase"
                letterSpacing={0.5}
                display="block"
                mb={0.5}
              >
                Textbook Definition
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.7, color: '#1a237e' }}>
                {note.textbookDef}
              </Typography>
            </Box>
          )}

          {/* ELI5 — intermediate & advanced only */}
          {note.eli5 && note.difficulty !== 'basic' && (
            <Box sx={{ p: 1.5, mb: 2, bgcolor: '#e8f5e9', borderRadius: 1, border: '1px solid #a5d6a7' }}>
              <Typography
                variant="caption"
                fontWeight={700}
                color="#2e7d32"
                textTransform="uppercase"
                letterSpacing={0.5}
                display="block"
                mb={0.5}
              >
                Explain Like I&apos;m 5
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.8, color: '#1b5e20', whiteSpace: 'pre-line' }}>
                {note.eli5}
              </Typography>
            </Box>
          )}

          {/* Code snippet */}
          {note.codeSnippet && (
            <Box
              component="pre"
              sx={{
                mb: 2,
                p: 1.5,
                borderRadius: 1,
                bgcolor: '#1e1e1e',
                color: '#d4d4d4',
                fontSize: 12,
                fontFamily: 'monospace',
                overflowX: 'auto',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap'
              }}
            >
              {note.codeSnippet}
            </Box>
          )}

          {/* Gotcha / common mistake */}
          {note.gotcha && (
            <Box sx={{ p: 1.5, bgcolor: '#fff3e0', borderRadius: 1, border: '1px solid #ffcc80' }}>
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                ⚠️ <strong>Gotcha:</strong> {note.gotcha}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
}
