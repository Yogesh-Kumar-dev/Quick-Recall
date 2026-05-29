'use client';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconArrowRight } from '@tabler/icons-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LandingDifficultyCard {
  label: string;
  value: string;
  count: number;
  emoji: string;
  color: 'success' | 'warning' | 'error' | 'primary' | 'default';
  /** Short hint shown under the label, e.g. "Closures, this, async/await" */
  blurb?: string;
}

export interface LandingCategoryCard {
  label: string;
  value: string;
  count: number;
  emoji: string;
}

export interface SectionLandingProps {
  /** Icon shown beside the title (Tabler icon element at ~28px) */
  icon: ReactNode;
  title: string;
  /** One-paragraph description of what this section covers */
  description: string;
  totalCount: number;
  /** One card per difficulty tier */
  difficultyCards: LandingDifficultyCard[];
  onEnter: (difficulty: string) => void;
  /** Optional category section */
  categoryCards?: LandingCategoryCard[];
  onEnterCategory?: (category: string) => void;
  /** If provided, renders a "Gotchas Only" quick-action button (concepts pages) */
  gotchaCount?: number;
  onGotchaOnly?: () => void;
}

// ─── Colour tokens ────────────────────────────────────────────────────────────

const DIFF_BG: Record<string, string> = {
  success: '#e8f5e9',
  warning: '#fff8e1',
  error: '#ffebee',
  primary: '#e3f2fd',
  default: '#f5f5f5'
};

const DIFF_BORDER: Record<string, string> = {
  success: '#4caf50',
  warning: '#ffc107',
  error: '#f44336',
  primary: '#2196f3',
  default: '#bdbdbd'
};

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
  onGotchaOnly
}: SectionLandingProps) {
  const showCategories = categoryCards && categoryCards.length > 0 && onEnterCategory;

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

      {/* ── Quick-action row: Browse All + optional Gotcha shortcut ── */}
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
            sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}
          >
            ⚠️ Gotchas Only &mdash; {gotchaCount} {gotchaCount === 1 ? 'item' : 'items'}
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
                transition: 'box-shadow 0.18s ease, transform 0.18s ease',
                '&:hover': { boxShadow: 4, transform: 'translateY(-3px)' }
              }}
            >
              <CardActionArea onClick={() => onEnter(card.value)} sx={{ p: 2.5 }}>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Typography fontSize={28} lineHeight={1}>
                      {card.emoji}
                    </Typography>
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
              </CardActionArea>
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
                  border: '2px solid #e3f2fd',
                  bgcolor: '#f0f7ff',
                  borderRadius: 2,
                  transition: 'box-shadow 0.18s ease, transform 0.18s ease',
                  '&:hover': { boxShadow: 3, transform: 'translateY(-2px)', borderColor: '#2196f3' }
                }}
              >
                <CardActionArea onClick={() => onEnterCategory!(cat.value)} sx={{ px: 2, py: 1.5 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography fontSize={20} lineHeight={1}>
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
    </Box>
  );
}
