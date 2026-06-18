'use client';
import { useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconAlertTriangle, IconArrowRight, IconCards } from '@tabler/icons-react';

import FlashcardDialog from 'ui-component/interview-prep/FlashcardDialog';
import { flashcardKey, type FlashcardSource } from 'data/flashcards-index';
import type { Flashcard } from 'types/content';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LandingDifficultyCard {
  label: string;
  value: string;
  count: number;
  emoji: string;
  color: 'success' | 'warning' | 'error' | 'primary' | 'default';
  blurb?: string;
}

export interface LandingCategoryCard {
  label: string;
  value: string;
  count: number;
  emoji: string;
}

export interface SectionLandingProps {
  icon: ReactNode;
  title: string;
  description: string;
  totalCount: number;
  difficultyCards: LandingDifficultyCard[];
  onEnter: (difficulty: string) => void;
  categoryCards?: LandingCategoryCard[];
  onEnterCategory?: (category: string) => void;
  gotchaCount?: number;
  onGotchaOnly?: () => void;
  flashcards?: Flashcard[];
  /** Namespace for this section's flashcards — enables save/SRS actions in the dialog. */
  flashcardSource?: FlashcardSource;
}

// ─── Dark-mode colour tokens ──────────────────────────────────────────────────

// MongoDB LeafyGreen tints: green.dark1, yellow.base, red.base, blue.base
const DIFF_BG: Record<string, string> = {
  success: 'rgba(0, 163, 92, 0.1)',
  warning: 'rgba(255, 192, 16, 0.1)',
  error: 'rgba(219, 48, 48, 0.1)',
  primary: 'rgba(1, 107, 248, 0.1)',
  default: 'rgba(255, 255, 255, 0.04)'
};

const DIFF_BG_HOVER: Record<string, string> = {
  success: 'rgba(0, 163, 92, 0.2)',
  warning: 'rgba(255, 192, 16, 0.2)',
  error: 'rgba(219, 48, 48, 0.2)',
  primary: 'rgba(1, 107, 248, 0.2)',
  default: 'rgba(255, 255, 255, 0.1)'
};

// MongoDB LeafyGreen: green.dark1, yellow.base, red.base, blue.base
const DIFF_BORDER: Record<string, string> = {
  success: '#00a35c',
  warning: '#ffc010',
  error: '#db3030',
  primary: '#016bf8',
  default: 'rgba(255,255,255,0.18)'
};

const DIFF_DOT: Record<string, string> = DIFF_BORDER;

// ─── Component ───────────────────────────────────────────────────────────────

export default function SectionLanding({
  icon,
  title,
  description,
  totalCount,
  difficultyCards,
  onEnter,
  categoryCards,
  onEnterCategory,
  gotchaCount,
  onGotchaOnly,
  flashcards,
  flashcardSource
}: SectionLandingProps) {
  const showCategories = categoryCards && categoryCards.length > 0 && onEnterCategory;
  const hasFlashcards = !!flashcards && flashcards.length > 0;
  const [flashcardsOpen, setFlashcardsOpen] = useState(false);

  return (
    <Box>
      {/* ── Hero header ── */}
      <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
        <Box sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>{icon}</Box>
        <Typography variant="h4" fontWeight={700}>
          {title}
        </Typography>
      </Stack>

      <Typography variant="body1" color="text.secondary" mb={3} sx={{ lineHeight: 1.8, maxWidth: 680 }}>
        {description}
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {/* ── Quick-action row ── */}
      <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap mb={3}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => onEnter('all')}
          endIcon={<IconArrowRight size={18} />}
          sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}
        >
          Browse All &mdash; {totalCount} {totalCount === 1 ? 'item' : 'items'}
        </Button>

        {gotchaCount !== undefined && onGotchaOnly && (
          <Button
            variant="outlined"
            color="warning"
            size="large"
            onClick={onGotchaOnly}
            startIcon={<IconAlertTriangle size={18} />}
            sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}
          >
            Gotchas Only &mdash; {gotchaCount} {gotchaCount === 1 ? 'item' : 'items'}
          </Button>
        )}

        {hasFlashcards && (
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={() => setFlashcardsOpen(true)}
            startIcon={<IconCards size={18} />}
            sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}
          >
            Flashcards &mdash; {flashcards!.length}
          </Button>
        )}
      </Stack>

      {/* ── Difficulty cards ── */}
      <Typography variant="overline" color="text.secondary" letterSpacing={1.5} display="block" mb={1.5}>
        By Difficulty
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: `repeat(${Math.min(difficultyCards.length, 3)}, 1fr)` },
          gap: 2,
          mb: showCategories ? 3 : 0
        }}
      >
        {difficultyCards.map((card) => {
          const ck = card.color ?? 'default';
          return (
            <Card
              key={card.value}
              variant="outlined"
              sx={{
                border: `2px solid ${DIFF_BORDER[ck]}`,
                bgcolor: DIFF_BG[ck],
                borderRadius: 2.5,
                transition: 'background-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease',
                '&:hover': { bgcolor: DIFF_BG_HOVER[ck], boxShadow: 4, transform: 'translateY(-3px)' }
              }}
            >
              <Box
                role="button"
                tabIndex={0}
                onClick={() => onEnter(card.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onEnter(card.value);
                  }
                }}
                sx={{ p: 2.5, cursor: 'pointer', outline: 'none' }}
              >
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    {/* Colored dot replaces emoji */}
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: DIFF_DOT[ck],
                        flexShrink: 0,
                        boxShadow: `0 0 6px ${DIFF_DOT[ck]}60`
                      }}
                    />
                    <Box>
                      <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                        {card.label}
                      </Typography>
                      <Chip
                        label={`${card.count} ${card.count === 1 ? 'item' : 'items'}`}
                        size="small"
                        color={card.color === 'default' ? 'default' : card.color}
                        variant="outlined"
                        sx={{ height: 18, fontSize: 11, mt: 0.25 }}
                      />
                    </Box>
                  </Stack>
                  {card.blurb && (
                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {card.blurb}
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Card>
          );
        })}
      </Box>

      {/* ── Category cards ── */}
      {showCategories && (
        <>
          <Typography variant="overline" color="text.secondary" letterSpacing={1.5} display="block" mb={1.5}>
            By Topic
          </Typography>

          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
            {categoryCards!.map((cat) => (
              <Card
                key={cat.value}
                variant="outlined"
                sx={{
                  minWidth: 110,
                  border: '1px solid',
                  borderColor: 'rgba(33, 150, 243, 0.25)',
                  bgcolor: 'rgba(33, 150, 243, 0.06)',
                  borderRadius: 2,
                  transition: 'box-shadow 0.18s ease, transform 0.18s ease, border-color 0.18s',
                  '&:hover': { boxShadow: 3, transform: 'translateY(-2px)', borderColor: 'primary.main' }
                }}
              >
                <CardActionArea onClick={() => onEnterCategory!(cat.value)} sx={{ px: 2, py: 1.5 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography fontSize={18} lineHeight={1}>
                      {cat.emoji}
                    </Typography>
                    <Box>
                      <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                        {cat.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {cat.count} {cat.count === 1 ? 'item' : 'items'}
                      </Typography>
                    </Box>
                  </Stack>
                </CardActionArea>
              </Card>
            ))}
          </Stack>
        </>
      )}

      {hasFlashcards && flashcardsOpen && (
        <FlashcardDialog
          open={flashcardsOpen}
          onClose={() => setFlashcardsOpen(false)}
          cards={flashcards!}
          title={title}
          getKey={flashcardSource ? (c) => flashcardKey(flashcardSource, c.id) : undefined}
        />
      )}
    </Box>
  );
}
