'use client';
import { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { IconRefresh, IconSearch } from '@tabler/icons-react';

import MainCard from 'ui-component/cards/MainCard';
import NoteCard from 'ui-component/interview-prep/NoteCard';
import ReduxDevToolsHint from 'ui-component/interview-prep/ReduxDevToolsHint';
import FilterShell from 'ui-component/topic-dashboard/FilterShell';
import MobileFilterDrawer from 'ui-component/topic-dashboard/MobileFilterDrawer';
import SectionLanding, { type LandingCategoryCard, type LandingDifficultyCard } from 'ui-component/topic-dashboard/SectionLanding';
import TopicFilterCards, { type CategoryOption, type DifficultyOption } from 'ui-component/topic-dashboard/TopicFilterCards';
import { useSectionFilter } from 'hooks/useSectionFilter';
import { useSelector } from 'store';
import useInjectReducer from 'store/useInjectReducer';
import reduxReducer, { selectAsyncThunkNotes, selectAsyncThunkFlashcards } from 'store/slices/redux';
import type { Note } from 'types/content';

// ─── Static meta (no data dependency) ────────────────────────────────────────

const CATEGORY_EMOJI: Record<string, string> = {
  lifecycle: '🔄',
  errors: '⚠️',
  advanced: '🚀'
};

const DIFFICULTY_META: DifficultyOption[] = [
  { label: 'Basic', value: 'basic', count: 0, emoji: '🟢', color: 'success' },
  { label: 'Intermediate', value: 'intermediate', count: 0, emoji: '🟡', color: 'warning' },
  { label: 'Advanced', value: 'advanced', count: 0, emoji: '🔴', color: 'error' }
];

const PAGE_TITLE = '🔄 createAsyncThunk';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AsyncThunkPage() {
  useInjectReducer('redux', reduxReducer);
  const asyncThunkNotes = useSelector(selectAsyncThunkNotes);
  const asyncThunkFlashcards = useSelector(selectAsyncThunkFlashcards);

  const {
    isLanding,
    difficulty,
    category,
    showGotchaOnly,
    search,
    openId,
    enterWithDifficulty,
    enterWithCategory,
    enterGotchaOnly,
    exitToLanding,
    handleDifficultyChange,
    handleCategoryChange,
    handleGotchaToggle,
    handleSearchChange,
    handleToggle,
    applyFilters
  } = useSectionFilter();

  // ── Derived landing cards (depend on data) ────────────────────────────────
  const DIFFICULTY_LANDING = useMemo<LandingDifficultyCard[]>(
    () => [
      {
        label: 'Basic',
        value: 'basic',
        count: asyncThunkNotes.filter((c) => c.difficulty === 'basic').length,
        emoji: '🟢',
        color: 'success',
        blurb: 'createAsyncThunk, pending / fulfilled / rejected lifecycle'
      },
      {
        label: 'Intermediate',
        value: 'intermediate',
        count: asyncThunkNotes.filter((c) => c.difficulty === 'intermediate').length,
        emoji: '🟡',
        color: 'warning',
        blurb: 'thunkAPI, rejectWithValue, unwrap()'
      },
      {
        label: 'Advanced',
        value: 'advanced',
        count: asyncThunkNotes.filter((c) => c.difficulty === 'advanced').length,
        emoji: '🔴',
        color: 'error',
        blurb: 'Cancellation, AbortSignal, condition option'
      }
    ],
    [asyncThunkNotes]
  );

  const CATEGORY_LANDING = useMemo<LandingCategoryCard[]>(() => {
    const map = new Map<string, number>();
    asyncThunkNotes.forEach((c) => map.set(c.category, (map.get(c.category) ?? 0) + 1));
    return Array.from(map.entries()).map(([val, count]) => ({
      value: val,
      label: val.charAt(0).toUpperCase() + val.slice(1),
      count,
      emoji: CATEGORY_EMOJI[val] ?? '📌'
    }));
  }, [asyncThunkNotes]);

  const GOTCHA_COUNT = useMemo(() => asyncThunkNotes.filter((c) => !!c.gotcha).length, [asyncThunkNotes]);

  const difficulties: DifficultyOption[] = useMemo(
    () =>
      DIFFICULTY_META.map((d) => ({
        ...d,
        count: asyncThunkNotes.filter((c) => c.difficulty === (d.value as Note['difficulty'])).length
      })),
    [asyncThunkNotes]
  );

  const categories: CategoryOption[] = useMemo(() => {
    const base = difficulty === 'all' ? asyncThunkNotes : asyncThunkNotes.filter((c) => c.difficulty === difficulty);
    const catMap = new Map<string, number>();
    base.forEach((c) => catMap.set(c.category, (catMap.get(c.category) ?? 0) + 1));
    return Array.from(catMap.entries()).map(([val, count]) => ({
      label: val.charAt(0).toUpperCase() + val.slice(1),
      value: val,
      count
    }));
  }, [asyncThunkNotes, difficulty]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return asyncThunkNotes.filter((c) => {
      const matchSearch = !q || c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q);
      const matchCat = category === 'all' || c.category === category;
      const matchDiff = difficulty === 'all' || c.difficulty === difficulty;
      const matchGotcha = !showGotchaOnly || !!c.gotcha;
      return matchSearch && matchCat && matchDiff && matchGotcha;
    });
  }, [asyncThunkNotes, search, category, difficulty, showGotchaOnly]);

  useEffect(() => {
    if (!isLanding && filtered.length === 0 && !search && !showGotchaOnly) {
      exitToLanding();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length, isLanding, search, showGotchaOnly]);

  if (isLanding) {
    return (
      <MainCard title={PAGE_TITLE} secondary={<ReduxDevToolsHint />}>
        <SectionLanding
          icon={<IconRefresh size={28} />}
          title="createAsyncThunk"
          description="The standard way to handle async operations in Redux Toolkit. Covers the pending/fulfilled/rejected lifecycle, thunkAPI utilities, structured error handling with rejectWithValue, and request cancellation."
          totalCount={asyncThunkNotes.length}
          difficultyCards={DIFFICULTY_LANDING}
          onEnter={enterWithDifficulty}
          categoryCards={CATEGORY_LANDING}
          onEnterCategory={enterWithCategory}
          gotchaCount={GOTCHA_COUNT}
          onGotchaOnly={enterGotchaOnly}
          flashcards={asyncThunkFlashcards}
        />
      </MainCard>
    );
  }

  return (
    <MainCard
      title={PAGE_TITLE}
      secondary={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {filtered.length} of {asyncThunkNotes.length}
          </Typography>
          <ReduxDevToolsHint />
        </Box>
      }
    >
      <FilterShell
        activeFilterCount={(difficulty !== 'all' ? 1 : 0) + (category !== 'all' ? 1 : 0) + (search ? 1 : 0)}
        renderDrawer={(open, onClose) => (
          <MobileFilterDrawer
            open={open}
            onClose={onClose}
            difficulties={difficulties}
            activeDifficulty={difficulty}
            categories={categories}
            activeCategory={category}
            search={search}
            searchPlaceholder="Search notes…"
            onApply={applyFilters}
          />
        )}
        sidebar={
          <Box sx={{ width: 240, flexShrink: 0, position: 'sticky', top: 88 }}>
            <Box mb={2}>
              <TextField
                size="small"
                fullWidth
                placeholder="Search notes…"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value || null)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconSearch size={16} />
                    </InputAdornment>
                  )
                }}
              />
            </Box>
            <TopicFilterCards
              difficulties={difficulties}
              activeDifficulty={difficulty}
              onDifficultyChange={handleDifficultyChange}
              categories={categories}
              activeCategory={category}
              onCategoryChange={handleCategoryChange}
              vertical
            />
          </Box>
        }
      >
        {showGotchaOnly && (
          <Box mb={1.5}>
            <Chip label="⚠️ Gotchas Only" color="warning" onDelete={handleGotchaToggle} size="small" />
          </Box>
        )}
        {filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography color="text.secondary">No notes match your filters.</Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {filtered.map((note) => (
              <NoteCard key={note.id} note={note} isOpen={openId === note.id} onToggle={() => handleToggle(note.id)} />
            ))}
          </Stack>
        )}
      </FilterShell>
    </MainCard>
  );
}
