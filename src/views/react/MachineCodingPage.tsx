'use client';
import { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconBrandReact } from '@tabler/icons-react';

import MainCard from 'ui-component/cards/MainCard';
import { PlaylistLauncher } from 'ui-component/playlist-player';
import { REACT_MACHINE_CODING_PLAYLISTS } from 'data/video-playlists';
import ProblemCard from 'ui-component/interview-prep/ProblemCard';
import FilterShell from 'ui-component/topic-dashboard/FilterShell';
import MobileFilterDrawer from 'ui-component/topic-dashboard/MobileFilterDrawer';
import SectionLanding, { type LandingCategoryCard, type LandingDifficultyCard } from 'ui-component/topic-dashboard/SectionLanding';
import TopicFilterCards, { type CategoryOption, type DifficultyOption } from 'ui-component/topic-dashboard/TopicFilterCards';
import SuggestProblemBanner from 'ui-component/SuggestProblemBanner';
import { useSectionFilter } from 'hooks/useSectionFilter';
import { useSelector } from 'store';
import useInjectReducer from 'store/useInjectReducer';
import reactReducer, { selectReactMcProblems } from 'store/slices/react';
import type { ProblemDifficulty, ReactMcCategory } from 'types/content';

// ─── Static meta (no data dependency) ────────────────────────────────────────

const CATEGORY_LABELS: Record<ReactMcCategory, string> = {
  'ui-state': 'UI & State',
  forms: 'Forms',
  'data-fetching': 'Data Fetching',
  layout: 'Layout',
  performance: 'Performance',
  'advanced-ui': 'Advanced UI'
};

const CATEGORY_EMOJI: Record<ReactMcCategory, string> = {
  'ui-state': '🎯',
  forms: '📝',
  'data-fetching': '🌐',
  layout: '📐',
  performance: '🚀',
  'advanced-ui': '🎨'
};

const DIFFICULTY_META: DifficultyOption[] = [
  { label: 'Easy', value: 'easy', count: 0, emoji: '🟢', color: 'success' },
  { label: 'Medium', value: 'medium', count: 0, emoji: '🟡', color: 'warning' },
  { label: 'Hard', value: 'hard', count: 0, emoji: '🔴', color: 'error' }
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReactMachineCodingPage() {
  useInjectReducer('react', reactReducer);
  const reactMcProblems = useSelector(selectReactMcProblems);

  const {
    isLanding,
    difficulty,
    category,
    enterWithDifficulty,
    enterWithCategory,
    exitToLanding,
    handleDifficultyChange,
    handleCategoryChange,
    applyFilters
  } = useSectionFilter();

  // ── Derived landing cards (depend on data) ────────────────────────────────
  const DIFFICULTY_LANDING = useMemo<LandingDifficultyCard[]>(
    () => [
      {
        label: 'Easy',
        value: 'easy',
        count: reactMcProblems.filter((p) => p.difficulty === 'easy').length,
        emoji: '🟢',
        color: 'success',
        blurb: 'Counter, star rating, modal, accordion, dropdown'
      },
      {
        label: 'Medium',
        value: 'medium',
        count: reactMcProblems.filter((p) => p.difficulty === 'medium').length,
        emoji: '🟡',
        color: 'warning',
        blurb: 'Debounced search, pagination, multi-step form, shopping cart'
      },
      {
        label: 'Hard',
        value: 'hard',
        count: reactMcProblems.filter((p) => p.difficulty === 'hard').length,
        emoji: '🔴',
        color: 'error',
        blurb: 'File tree, drag-and-drop, infinite scroll, virtual list'
      }
    ],
    [reactMcProblems]
  );

  const CATEGORY_LANDING = useMemo<LandingCategoryCard[]>(() => {
    const map = new Map<ReactMcCategory, number>();
    reactMcProblems.forEach((p) => map.set(p.category, (map.get(p.category) ?? 0) + 1));
    return Array.from(map.entries()).map(([val, count]) => ({
      value: val,
      label: CATEGORY_LABELS[val],
      count,
      emoji: CATEGORY_EMOJI[val]
    }));
  }, [reactMcProblems]);

  // ── Counts for list-view filter strip ────────────────────────────────────
  const difficulties: DifficultyOption[] = useMemo(
    () =>
      DIFFICULTY_META.map((d) => ({ ...d, count: reactMcProblems.filter((p) => p.difficulty === (d.value as ProblemDifficulty)).length })),
    [reactMcProblems]
  );

  const categories: CategoryOption[] = useMemo(() => {
    const base = difficulty === 'all' ? reactMcProblems : reactMcProblems.filter((p) => p.difficulty === difficulty);
    const catMap = new Map<ReactMcCategory, number>();
    base.forEach((p) => catMap.set(p.category, (catMap.get(p.category) ?? 0) + 1));
    return Array.from(catMap.entries()).map(([val, count]) => ({ label: CATEGORY_LABELS[val], value: val, count }));
  }, [reactMcProblems, difficulty]);

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = useMemo(
    () =>
      reactMcProblems.filter((p) => {
        const matchDiff = difficulty === 'all' || p.difficulty === difficulty;
        const matchCat = category === 'all' || p.category === category;
        return matchDiff && matchCat;
      }),
    [reactMcProblems, difficulty, category]
  );

  // ── Guard: invalid URL params → back to section landing ──────────────────
  useEffect(() => {
    if (!isLanding && filtered.length === 0) {
      exitToLanding();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length, isLanding]);

  // ── Landing ───────────────────────────────────────────────────────────────
  if (isLanding) {
    return (
      <MainCard title="⚛️ React Machine Coding" secondary={<PlaylistLauncher playlists={REACT_MACHINE_CODING_PLAYLISTS} />}>
        <SectionLanding
          icon={<IconBrandReact size={28} />}
          title="React Machine Coding"
          description="Hands-on React UI problems commonly asked in frontend interviews. Each problem includes JSX, TSX and MUI implementations shown side-by-side with the working output — ideal for practising component design patterns."
          totalCount={reactMcProblems.length}
          difficultyCards={DIFFICULTY_LANDING}
          onEnter={enterWithDifficulty}
          categoryCards={CATEGORY_LANDING}
          onEnterCategory={enterWithCategory}
        />
      </MainCard>
    );
  }

  // ── List view ─────────────────────────────────────────────────────────────
  return (
    <MainCard
      title="⚛️ React Machine Coding"
      secondary={
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="caption" color="text.secondary">
            {filtered.length} of {reactMcProblems.length}
          </Typography>
          <PlaylistLauncher playlists={REACT_MACHINE_CODING_PLAYLISTS} />
        </Stack>
      }
    >
      <FilterShell
        activeFilterCount={(difficulty !== 'all' ? 1 : 0) + (category !== 'all' ? 1 : 0)}
        renderDrawer={(open, onClose) => (
          <MobileFilterDrawer
            open={open}
            onClose={onClose}
            difficulties={difficulties}
            activeDifficulty={difficulty}
            categories={categories}
            activeCategory={category}
            onApply={applyFilters}
          />
        )}
        sidebar={
          <Box sx={{ width: 240, flexShrink: 0, position: 'sticky', top: 88 }}>
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
        {filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography color="text.secondary">No problems match the selected filters.</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1.5 }}>
            {filtered.map((problem) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                basePath="/machine-coding"
                categoryLabel={CATEGORY_LABELS[problem.category as ReactMcCategory]}
                categoryEmoji={CATEGORY_EMOJI[problem.category as ReactMcCategory]}
              />
            ))}
          </Box>
        )}
      </FilterShell>

      <SuggestProblemBanner sx={{ mt: 3 }} />
    </MainCard>
  );
}
