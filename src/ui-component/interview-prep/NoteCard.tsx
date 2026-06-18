'use client';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import CodeBlock from 'ui-component/interview-prep/CodeBlock';
import BookmarkButton from 'ui-component/interview-prep/BookmarkButton';
import { LGCallout, LGCalloutVariant, LGExpandableCard } from 'ui-component/leafygreen';
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
  const isControlled = isOpen !== undefined;

  // The header title slot: title + difficulty/category chips + bookmark. The bookmark stops click
  // propagation so tapping the star doesn't also toggle the card (the rest of the header toggles).
  const title = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', width: '100%' }}>
      <Typography component="span" variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.3 }}>
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
      <Box
        component="span"
        sx={{ ml: 'auto', display: 'inline-flex' }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <BookmarkButton kind="note" refId={note.id} />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ mb: 1.5 }}>
      <LGExpandableCard
        title={title}
        description={note.summary}
        {...(isControlled ? { isOpen, onClick: onToggle } : { defaultOpen: defaultExpanded })}
      >
        {/* Key points */}
        <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase" letterSpacing={0.5}>
          Key Points
        </Typography>
        <Box component="ul" sx={{ mt: 0.5, mb: note.gotcha || note.codeSnippet || note.textbookDef || note.eli5 ? 2 : 0, pl: 2.5 }}>
          {note.keyPoints.map((point) => (
            <Box component="li" key={point} sx={{ mb: 0.25 }}>
              <Typography variant="body2" color="text.secondary">
                {point}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Textbook Definition — intermediate & advanced only */}
        {note.textbookDef && note.difficulty !== 'basic' && (
          <Box mb={2}>
            <LGCallout variant={LGCalloutVariant.Note} title="Textbook Definition">
              {note.textbookDef}
            </LGCallout>
          </Box>
        )}

        {/* ELI5 — intermediate & advanced only */}
        {note.eli5 && note.difficulty !== 'basic' && (
          <Box mb={2}>
            <LGCallout variant={LGCalloutVariant.Example} title="Explain Like I'm 5">
              <span style={{ whiteSpace: 'pre-line' }}>{note.eli5}</span>
            </LGCallout>
          </Box>
        )}

        {/* Code snippet */}
        {note.codeSnippet && <CodeBlock code={note.codeSnippet} />}

        {/* Gotcha / common mistake */}
        {note.gotcha && (
          <LGCallout variant={LGCalloutVariant.Warning} title="Gotcha">
            {note.gotcha}
          </LGCallout>
        )}
      </LGExpandableCard>
    </Box>
  );
}
