'use client';
import { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { IconBuildingFactory2, IconSearch } from '@tabler/icons-react';

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
import reduxReducer, { selectReduxToolkitNotes, selectReduxToolkitFlashcards } from 'store/slices/redux';
import type { Note } from 'types/content';

// ─── Static meta (no data dependency) ────────────────────────────────────────

const CATEGORY_EMOJI: Record<string, string> = {
  store: '🏪',
  slices: '🍕',
  immer: '🧊',
  utilities: '🛠️'
};

const DIFFICULTY_META: DifficultyOption[] = [
  { label: 'Basic', value: 'basic', count: 0, emoji: '🟢', color: 'success' },
  { label: 'Intermediate', value: 'intermediate', count: 0, emoji: '🟡', color: 'warning' },
  { label: 'Advanced', value: 'advanced', count: 0, emoji: '🔴', color: 'error' }
];

const PAGE_TITLE = '🛠️ Redux Toolkit';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReduxToolkitPage() {
  useInjectReducer('redux', reduxReducer);
  const reduxToolkitNotes = useSelector(selectReduxToolkitNotes);
  const reduxToolkitFlashcards = useSelector(selectReduxToolkitFlashcards);

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
        count: reduxToolkitNotes.filter((c) => c.difficulty === 'basic').length,
        emoji: '🟢',
        color: 'success',
        blurb: 'configureStore, createSlice, action creators'
      },
      {
        label: 'Intermediate',
        value: 'intermediate',
        count: reduxToolkitNotes.filter((c) => c.difficulty === 'intermediate').length,
        emoji: '🟡',
        color: 'warning',
        blurb: 'Immer, extraReducers, TypeScript setup'
      },
      {
        label: 'Advanced',
        value: 'advanced',
        count: reduxToolkitNotes.filter((c) => c.difficulty === 'advanced').length,
        emoji: '🔴',
        color: 'error',
        blurb: 'createEntityAdapter, normalized collections'
      }
    ],
    [reduxToolkitNotes]
  );

  const CATEGORY_LANDING = useMemo<LandingCategoryCard[]>(() => {
    const map = new Map<string, number>();
    reduxToolkitNotes.forEach((c) => map.set(c.category, (map.get(c.category) ?? 0) + 1));
    return Array.from(map.entries()).map(([val, count]) => ({
      value: val,
      label: val.charAt(0).toUpperCase() + val.slice(1),
      count,
      emoji: CATEGORY_EMOJI[val] ?? '📌'
    }));
  }, [reduxToolkitNotes]);

  const GOTCHA_COUNT = useMemo(() => reduxToolkitNotes.filter((c) => !!c.gotcha).length, [reduxToolkitNotes]);

  const difficulties: DifficultyOption[] = useMemo(
    () =>
      DIFFICULTY_META.map((d) => ({
        ...d,
        count: reduxToolkitNotes.filter((c) => c.difficulty === (d.value as Note['difficulty'])).length
      })),
    [reduxToolkitNotes]
  );

  const categories: CategoryOption[] = useMemo(() => {
    const base = difficulty === 'all' ? reduxToolkitNotes : reduxToolkitNotes.filter((c) => c.difficulty === difficulty);
    const catMap = new Map<string, number>();
    base.forEach((c) => catMap.set(c.category, (catMap.get(c.category) ?? 0) + 1));
    return Array.from(catMap.entries()).map(([val, count]) => ({
      label: val.charAt(0).toUpperCase() + val.slice(1),
      value: val,
      count
    }));
  }, [reduxToolkitNotes, difficulty]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return reduxToolkitNotes.filter((c) => {
      const matchSearch = !q || c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q);
      const matchCat = category === 'all' || c.category === category;
      const matchDiff = difficulty === 'all' || c.difficulty === difficulty;
      const matchGotcha = !showGotchaOnly || !!c.gotcha;
      return matchSearch && matchCat && matchDiff && matchGotcha;
    });
  }, [reduxToolkitNotes, search, category, difficulty, showGotchaOnly]);

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
          icon={<IconBuildingFactory2 size={28} />}
          title="Redux Toolkit APIs"
          description="The official, opinionated toolset for Redux development. Covers configureStore, createSlice, Immer integration, extraReducers, createEntityAdapter, and TypeScript patterns."
          totalCount={reduxToolkitNotes.length}
          difficultyCards={DIFFICULTY_LANDING}
          onEnter={enterWithDifficulty}
          categoryCards={CATEGORY_LANDING}
          onEnterCategory={enterWithCategory}
          gotchaCount={GOTCHA_COUNT}
          onGotchaOnly={enterGotchaOnly}
          flashcards={reduxToolkitFlashcards}
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
            {filtered.length} of {reduxToolkitNotes.length}
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
