'use client';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconBookmark, IconCards, IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';

import NoteCard from 'ui-component/interview-prep/NoteCard';
import BookmarkButton from 'ui-component/interview-prep/BookmarkButton';
import FlashcardDialog from 'ui-component/interview-prep/FlashcardDialog';

import useBookmarks from './useBookmarks';
import { resolveContent, type ResolvedContent } from 'utils/resolveContent';
import type { Flashcard } from 'types/content';

// ==============================|| SAVED (BOOKMARKS) VIEW ||============================== //

// Lists everything the user has starred, grouped by kind, each linking back to its source.
// Content is resolved from the namespaced refId via `resolveContent`; refIds that no longer
// resolve (content removed since saving) are skipped silently.

export default function BookmarksPage() {
  const { bookmarks, loading } = useBookmarks();
  const [flashcardsOpen, setFlashcardsOpen] = useState(false);

  // Resolve each bookmark (newest-first order preserved from the repository) and bucket by kind.
  const { notes, flashcards, problems } = useMemo(() => {
    const notesAcc: Extract<ResolvedContent, { kind: 'note' }>[] = [];
    const flashcardsAcc: Extract<ResolvedContent, { kind: 'flashcard' }>[] = [];
    const problemsAcc: Extract<ResolvedContent, { kind: 'problem' }>[] = [];
    for (const b of bookmarks) {
      const resolved = resolveContent(b.kind, b.refId);
      if (!resolved) continue;
      if (resolved.kind === 'note') notesAcc.push(resolved);
      else if (resolved.kind === 'flashcard') flashcardsAcc.push(resolved);
      else problemsAcc.push(resolved);
    }
    return { notes: notesAcc, flashcards: flashcardsAcc, problems: problemsAcc };
  }, [bookmarks]);

  // Cards for the flashcard review dialog + a key resolver so its save/SRS actions keep working.
  const flashcardCards: Flashcard[] = flashcards.map((f) => f.card);
  const flashcardKeyByCardId = useMemo(() => {
    const map = new Map<string, string>();
    flashcards.forEach((f) => map.set(f.card.id, f.refId));
    return map;
  }, [flashcards]);

  const total = notes.length + flashcards.length + problems.length;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Saved
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Everything you&apos;ve starred for review — notes, flashcards, and problems in one place. Saved flashcards are also added to your
          Review deck, where they resurface for practice over time.
        </Typography>
      </Box>

      {loading ? null : total === 0 ? (
        <EmptyState />
      ) : (
        <Stack spacing={4}>
          {/* Flashcards */}
          {flashcards.length > 0 && (
            <Box>
              <SectionHeader title="Flashcards" count={flashcards.length} />
              <Button variant="outlined" startIcon={<IconCards size={18} />} onClick={() => setFlashcardsOpen(true)} sx={{ mb: 1 }}>
                Review {flashcards.length} saved {flashcards.length === 1 ? 'card' : 'cards'}
              </Button>
              <Stack spacing={1}>
                {flashcards.map((f) => (
                  <Card key={f.refId} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Stack direction="row" alignItems="center" sx={{ px: 2, py: 1 }} spacing={1}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle2" fontWeight={600} noWrap>
                          {f.card.front}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {f.card.back}
                        </Typography>
                      </Box>
                      <BookmarkButton kind="flashcard" refId={f.refId} />
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Box>
          )}

          {/* Notes */}
          {notes.length > 0 && (
            <Box>
              <SectionHeader title="Notes" count={notes.length} />
              <Stack spacing={1.5}>
                {notes.map((n) => (
                  <NoteCard key={n.refId} note={n.note} />
                ))}
              </Stack>
            </Box>
          )}

          {/* Problems */}
          {problems.length > 0 && (
            <Box>
              <SectionHeader title="Problems" count={problems.length} />
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1.5 }}>
                {problems.map((p) => (
                  <SavedProblemCard key={p.refId} url={p.url} title={p.problem.title} difficulty={p.problem.difficulty} slug={p.refId} />
                ))}
              </Box>
            </Box>
          )}
        </Stack>
      )}

      {flashcardCards.length > 0 && (
        <FlashcardDialog
          open={flashcardsOpen}
          onClose={() => setFlashcardsOpen(false)}
          cards={flashcardCards}
          title="Saved"
          getKey={(c) => flashcardKeyByCardId.get(c.id) ?? ''}
        />
      )}
    </Box>
  );
}

// ProblemCard expects a full BaseProblemEntry; bookmarks only store the slug, so for the
// problems grid we render a lightweight link card with its own star instead of reconstructing
// a synthetic problem object.
function SavedProblemCard({ url, title, difficulty, slug }: { url: string; title: string; difficulty: string; slug: string }) {
  const accent: Record<string, string> = { easy: 'success.main', medium: 'warning.main', hard: 'error.main' };
  return (
    <Card variant="outlined" sx={{ borderRadius: 2, borderLeft: '4px solid', borderLeftColor: accent[difficulty] ?? 'grey.400' }}>
      <Stack direction="row" alignItems="center">
        <CardActionArea component={Link} href={url} sx={{ px: 2, py: 1.25 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ flex: 1 }} noWrap>
              {title}
            </Typography>
            <Chip label={difficulty} size="small" variant="outlined" sx={{ textTransform: 'capitalize', fontSize: 11 }} />
            <IconChevronRight size={16} style={{ opacity: 0.4 }} />
          </Stack>
        </CardActionArea>
        <Box sx={{ pr: 1 }}>
          <BookmarkButton kind="problem" refId={slug} />
        </Box>
      </Stack>
    </Card>
  );
}

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
      <Typography variant="h5" fontWeight={700}>
        {title}
      </Typography>
      <Chip label={count} size="small" color="primary" variant="outlined" />
    </Stack>
  );
}

function EmptyState() {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3, p: 6, textAlign: 'center', borderStyle: 'dashed' }}>
      <IconBookmark size={48} style={{ opacity: 0.3 }} />
      <Typography variant="h5" fontWeight={700} sx={{ mt: 2 }}>
        Nothing saved yet
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 420, mx: 'auto' }}>
        Tap the bookmark star on any note, flashcard, or problem to save it here for review. Saved flashcards also join your Review deck for
        spaced practice over time.
      </Typography>
    </Card>
  );
}
