'use client';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { IconSearch, IconX } from '@tabler/icons-react';

import TopicFilterCards, { type CategoryOption, type DifficultyOption } from 'ui-component/topic-dashboard/TopicFilterCards';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChipGroup {
  label: string;
  options: { value: string; label: string }[];
  /** Active value belongs to the shared `category` field — chip groups are mutually exclusive with `categories`. */
  activeValue: string;
}

export interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;

  /** Difficulty section — omit to hide */
  difficulties?: DifficultyOption[];
  activeDifficulty?: string;

  /** Generic category section (chips) — omit to hide */
  categories?: CategoryOption[];
  activeCategory?: string;

  /** Extra category chip groups (e.g. "By Topic" / "By ES Version"). Share the `category` field. */
  chipGroups?: ChipGroup[];

  /** Search section — omit to hide */
  search?: string;
  searchPlaceholder?: string;

  /** Committed only when the user taps Apply */
  onApply: (next: { difficulty?: string; category?: string; search?: string }) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function MobileFilterDrawer({
  open,
  onClose,
  difficulties,
  activeDifficulty,
  categories,
  activeCategory,
  chipGroups,
  search,
  searchPlaceholder = 'Search…',
  onApply
}: MobileFilterDrawerProps) {
  const hasDifficulty = !!difficulties && difficulties.length > 0;
  const hasCategories = !!categories && categories.length > 0;
  const hasChipGroups = !!chipGroups && chipGroups.length > 0;
  const hasSearch = search !== undefined;

  // ── Staged state (re-synced from props each time the drawer opens) ──────────
  const [stagedDifficulty, setStagedDifficulty] = useState(activeDifficulty ?? 'all');
  const [stagedCategory, setStagedCategory] = useState(activeCategory ?? 'all');
  const [stagedSearch, setStagedSearch] = useState(search ?? '');

  useEffect(() => {
    if (open) {
      setStagedDifficulty(activeDifficulty ?? 'all');
      setStagedCategory(activeCategory ?? 'all');
      setStagedSearch(search ?? '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleClear = () => {
    setStagedDifficulty('all');
    setStagedCategory('all');
    setStagedSearch('');
  };

  const handleApply = () => {
    onApply({
      ...(hasDifficulty ? { difficulty: stagedDifficulty } : {}),
      ...(hasCategories || hasChipGroups ? { category: stagedCategory } : {}),
      ...(hasSearch ? { search: stagedSearch } : {})
    });
    onClose();
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { height: '100dvh', display: 'flex', flexDirection: 'column', borderRadius: 0 } }}
    >
      {/* ── Header ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          flexShrink: 0
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton size="small" onClick={onClose} edge="start">
            <IconX size={20} />
          </IconButton>
          <Typography variant="h4" fontWeight={700}>
            Filters
          </Typography>
        </Stack>
        <Button onClick={handleClear} size="small" color="inherit" sx={{ fontWeight: 600 }}>
          Clear
        </Button>
      </Box>

      {/* ── Scrollable body ── */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 2 }}>
        {hasSearch && (
          <Box mb={3}>
            <TextField
              size="small"
              fullWidth
              autoComplete="off"
              placeholder={searchPlaceholder}
              value={stagedSearch}
              onChange={(e) => setStagedSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size={16} />
                  </InputAdornment>
                )
              }}
            />
          </Box>
        )}

        {(hasDifficulty || hasCategories) && (
          <TopicFilterCards
            difficulties={difficulties ?? []}
            activeDifficulty={stagedDifficulty}
            onDifficultyChange={setStagedDifficulty}
            categories={categories}
            activeCategory={stagedCategory}
            onCategoryChange={setStagedCategory}
            vertical
            showDifficulty={hasDifficulty}
          />
        )}

        {hasChipGroups &&
          chipGroups!.map((group) => (
            <Box key={group.label}>
              <Divider sx={{ my: 2 }} />
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ display: 'block', mb: 1, letterSpacing: 1.5, fontSize: '0.68rem', fontWeight: 700 }}
              >
                {group.label}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                <Chip
                  label="All"
                  onClick={() => setStagedCategory('all')}
                  color={stagedCategory === 'all' ? 'primary' : 'default'}
                  variant={stagedCategory === 'all' ? 'filled' : 'outlined'}
                  size="small"
                />
                {group.options.map((opt) => (
                  <Chip
                    key={opt.value}
                    label={opt.label}
                    onClick={() => setStagedCategory(opt.value === stagedCategory ? 'all' : opt.value)}
                    color={stagedCategory === opt.value ? 'primary' : 'default'}
                    variant={stagedCategory === opt.value ? 'filled' : 'outlined'}
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          ))}
      </Box>

      {/* ── Sticky Apply ── */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
        <Button variant="contained" fullWidth size="large" onClick={handleApply} sx={{ fontWeight: 700 }}>
          Apply
        </Button>
      </Box>
    </Drawer>
  );
}
