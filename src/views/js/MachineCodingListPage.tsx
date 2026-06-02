'use client';
import { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { IconCode } from '@tabler/icons-react';

import MainCard from 'ui-component/cards/MainCard';
import ProblemCard from 'ui-component/interview-prep/ProblemCard';
import FilterShell from 'ui-component/topic-dashboard/FilterShell';
import MobileFilterDrawer from 'ui-component/topic-dashboard/MobileFilterDrawer';
import SectionLanding, { type LandingCategoryCard, type LandingDifficultyCard } from 'ui-component/topic-dashboard/SectionLanding';
import TopicFilterCards, { type CategoryOption, type DifficultyOption } from 'ui-component/topic-dashboard/TopicFilterCards';
import { useSectionFilter } from 'hooks/useSectionFilter';
import { useSelector } from 'store';
import { selectJsProblems } from 'store/slices/javascript';
import type { ProblemDifficulty, ProblemCategory } from 'types/content';

// ─── Static meta (no data dependency) ────────────────────────────────────────

const CATEGORY_LABELS: Record<ProblemCategory, string> = {
  array: 'Array',
  object: 'Object',
  async: 'Async',
  string: 'String',
  functional: 'Functional',
  class: 'Class',
  dom: 'DOM'
};

const CATEGORY_EMOJI: Record<ProblemCategory, string> = {
  array: '📊',
  object: '📦',
  async: '⚡',
  string: '🔤',
  functional: '🔧',
  class: '🏛️',
  dom: '🌐'
};

const DIFFICULTY_META: DifficultyOption[] = [
  { label: 'Easy', value: 'easy', count: 0, emoji: '🟢', color: 'success' },
  { label: 'Medium', value: 'medium', count: 0, emoji: '🟡', color: 'warning' },
  { label: 'Hard', value: 'hard', count: 0, emoji: '🔴', color: 'error' }
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MachineCodingListPage() {
  const jsProblems = useSelector(selectJsProblems);

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
        count: jsProblems.filter((p) => p.difficulty === 'easy').length,
        emoji: '🟢',
        color: 'success',
        blurb: 'Array flattening, type checks, basic object utilities'
      },
      {
        label: 'Medium',
        value: 'medium',
        count: jsProblems.filter((p) => p.difficulty === 'medium').length,
        emoji: '🟡',
        color: 'warning',
        blurb: 'Debounce, throttle, curry, memoize, deep clone'
      },
      {
        label: 'Hard',
        value: 'hard',
        count: jsProblems.filter((p) => p.difficulty === 'hard').length,
        emoji: '🔴',
        color: 'error',
        blurb: 'Promise.all polyfill, event emitter, virtual DOM diff'
      }
    ],
    [jsProblems]
  );

  const CATEGORY_LANDING = useMemo<LandingCategoryCard[]>(() => {
    const map = new Map<ProblemCategory, number>();
    jsProblems.forEach((p) => map.set(p.category, (map.get(p.category) ?? 0) + 1));
    return Array.from(map.entries()).map(([val, count]) => ({
      value: val,
      label: CATEGORY_LABELS[val],
      count,
      emoji: CATEGORY_EMOJI[val]
    }));
  }, [jsProblems]);

  // ── Counts for list-view filter strip ────────────────────────────────────
  const difficulties: DifficultyOption[] = useMemo(
    () => DIFFICULTY_META.map((d) => ({ ...d, count: jsProblems.filter((p) => p.difficulty === (d.value as ProblemDifficulty)).length })),
    [jsProblems]
  );

  const categories: CategoryOption[] = useMemo(() => {
    const base = difficulty === 'all' ? jsProblems : jsProblems.filter((p) => p.difficulty === difficulty);
    const catMap = new Map<ProblemCategory, number>();
    base.forEach((p) => catMap.set(p.category, (catMap.get(p.category) ?? 0) + 1));
    return Array.from(catMap.entries()).map(([val, count]) => ({ label: CATEGORY_LABELS[val], value: val, count }));
  }, [jsProblems, difficulty]);

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = useMemo(
    () =>
      jsProblems.filter((p) => {
        const matchDiff = difficulty === 'all' || p.difficulty === difficulty;
        const matchCat = category === 'all' || p.category === category;
        return matchDiff && matchCat;
      }),
    [jsProblems, difficulty, category]
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
      <MainCard title="🔧 JS Machine Coding">
        <SectionLanding
          icon={<IconCode size={28} />}
          title="JS Machine Coding"
          description="Commonly asked problem-solving questions in JavaScript interviews. Each problem shows multiple approaches — from the straightforward brute-force to the optimised version — with time and space complexity analysis."
          totalCount={jsProblems.length}
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
      title="🔧 JS Machine Coding"
      secondary={
        <Typography variant="caption" color="text.secondary">
          {filtered.length} of {jsProblems.length}
        </Typography>
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
                categoryLabel={CATEGORY_LABELS[problem.category as ProblemCategory]}
                categoryEmoji={CATEGORY_EMOJI[problem.category as ProblemCategory]}
              />
            ))}
          </Box>
        )}
      </FilterShell>
    </MainCard>
  );
}
