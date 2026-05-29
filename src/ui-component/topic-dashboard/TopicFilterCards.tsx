'use client';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DifficultyOption {
  label: string;
  value: string;
  count: number;
  emoji: string;
  /** MUI palette colour key – default: 'default' */
  color?: 'success' | 'warning' | 'error' | 'primary' | 'default';
}

export interface CategoryOption {
  label: string;
  value: string;
  count: number;
}

export interface TopicFilterCardsProps {
  difficulties: DifficultyOption[];
  activeDifficulty: string;
  onDifficultyChange: (v: string) => void;

  categories?: CategoryOption[];
  activeCategory: string;
  onCategoryChange: (v: string) => void;

  /** Renders as a vertical sidebar panel (HackerRank-style). Default: false */
  vertical?: boolean;
  /** Hide the difficulty section entirely. Default: true */
  showDifficulty?: boolean;
}

// ─── Colour maps ─────────────────────────────────────────────────────────────

const PALETTE_BG: Record<string, string> = {
  success: '#e8f5e9',
  warning: '#fff8e1',
  error: '#ffebee',
  primary: '#e3f2fd',
  default: '#f5f5f5'
};
const PALETTE_BORDER: Record<string, string> = {
  success: '#4caf50',
  warning: '#ffc107',
  error: '#f44336',
  primary: '#2196f3',
  default: '#bdbdbd'
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function TopicFilterCards({
  difficulties,
  activeDifficulty,
  onDifficultyChange,
  categories,
  activeCategory,
  onCategoryChange,
  vertical = false,
  showDifficulty = true
}: TopicFilterCardsProps) {
  const theme = useTheme();
  const allCount = difficulties.reduce((s, d) => s + d.count, 0);
  const allOption: DifficultyOption = { label: 'All', value: 'all', count: allCount, emoji: '📋' };

  // ── Vertical sidebar layout ───────────────────────────────────────────────
  if (vertical) {
    return (
      <Box>
        {showDifficulty && (
          <>
            <SectionLabel>Difficulty</SectionLabel>
            <Stack direction="column" spacing={0.75}>
              <DifficultyCard
                option={allOption}
                active={activeDifficulty === 'all'}
                onClick={() => onDifficultyChange('all')}
                theme={theme}
                fullWidth
              />
              {difficulties.map((d) => (
                <DifficultyCard
                  key={d.value}
                  option={d}
                  active={activeDifficulty === d.value}
                  onClick={() => onDifficultyChange(d.value)}
                  theme={theme}
                  fullWidth
                />
              ))}
            </Stack>
          </>
        )}

        {categories && categories.length > 0 && (
          <>
            {showDifficulty && <Divider sx={{ my: 2 }} />}
            <SectionLabel>Category</SectionLabel>
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
              <Chip
                label={`All (${categories.reduce((s, c) => s + c.count, 0)})`}
                onClick={() => onCategoryChange('all')}
                variant={activeCategory === 'all' ? 'filled' : 'outlined'}
                color={activeCategory === 'all' ? 'primary' : 'default'}
                size="small"
                sx={{ cursor: 'pointer' }}
              />
              {categories.map((cat) => (
                <Chip
                  key={cat.value}
                  label={`${cat.label} (${cat.count})`}
                  onClick={() => onCategoryChange(cat.value)}
                  variant={activeCategory === cat.value ? 'filled' : 'outlined'}
                  color={activeCategory === cat.value ? 'primary' : 'default'}
                  size="small"
                  sx={{ cursor: 'pointer', textTransform: 'capitalize' }}
                />
              ))}
            </Stack>
          </>
        )}
      </Box>
    );
  }

  // ── Horizontal layout (original) ──────────────────────────────────────────
  return (
    <Box mb={3}>
      <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap mb={categories && categories.length > 0 ? 1.5 : 0}>
        <DifficultyCard
          option={allOption}
          active={activeDifficulty === 'all'}
          onClick={() => onDifficultyChange('all')}
          theme={theme}
        />
        {difficulties.map((d) => (
          <DifficultyCard
            key={d.value}
            option={d}
            active={activeDifficulty === d.value}
            onClick={() => onDifficultyChange(d.value)}
            theme={theme}
          />
        ))}
      </Stack>

      {categories && categories.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            label={`All categories (${categories.reduce((s, c) => s + c.count, 0)})`}
            onClick={() => onCategoryChange('all')}
            variant={activeCategory === 'all' ? 'filled' : 'outlined'}
            color={activeCategory === 'all' ? 'primary' : 'default'}
            size="small"
            sx={{ textTransform: 'capitalize', cursor: 'pointer' }}
          />
          {categories.map((cat) => (
            <Chip
              key={cat.value}
              label={`${cat.label} (${cat.count})`}
              onClick={() => onCategoryChange(cat.value)}
              variant={activeCategory === cat.value ? 'filled' : 'outlined'}
              color={activeCategory === cat.value ? 'primary' : 'default'}
              size="small"
              sx={{ textTransform: 'capitalize', cursor: 'pointer' }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="overline"
      color="text.secondary"
      sx={{ display: 'block', mb: 1, letterSpacing: 1.5, fontSize: '0.68rem', fontWeight: 700 }}
    >
      {children}
    </Typography>
  );
}

interface DifficultyCardProps {
  option: DifficultyOption;
  active: boolean;
  onClick: () => void;
  theme: ReturnType<typeof useTheme>;
  fullWidth?: boolean;
}

function DifficultyCard({ option, active, onClick, fullWidth }: DifficultyCardProps) {
  const colorKey = option.color ?? 'default';
  const bg = active ? PALETTE_BG[colorKey] : 'transparent';
  const borderColor = active ? PALETTE_BORDER[colorKey] : '#e0e0e0';

  return (
    <Card
      variant="outlined"
      sx={{
        ...(fullWidth ? { width: '100%' } : { minWidth: 100 }),
        border: `2px solid ${borderColor}`,
        bgcolor: bg,
        borderRadius: 2,
        transition: 'all 0.18s ease',
        '&:hover': {
          borderColor: PALETTE_BORDER[colorKey],
          bgcolor: PALETTE_BG[colorKey],
          boxShadow: 2
        }
      }}
    >
      <CardActionArea onClick={onClick} sx={{ px: 2, py: 1.25 }}>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Typography fontSize={18} lineHeight={1}>
            {option.emoji}
          </Typography>
          <Box>
            <Typography variant="body2" fontWeight={active ? 700 : 500} sx={{ textTransform: 'capitalize', lineHeight: 1.2 }}>
              {option.label}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {option.count} {option.count === 1 ? 'problem' : 'problems'}
            </Typography>
          </Box>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
