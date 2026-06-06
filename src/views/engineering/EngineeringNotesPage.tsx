'use client';
import { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { IconCpu, IconSearch } from '@tabler/icons-react';

import MainCard from 'ui-component/cards/MainCard';
import VirtualNoteList from 'ui-component/interview-prep/VirtualNoteList';
import ReduxDevToolsHint from 'ui-component/interview-prep/ReduxDevToolsHint';
import FilterShell from 'ui-component/topic-dashboard/FilterShell';
import MobileFilterDrawer from 'ui-component/topic-dashboard/MobileFilterDrawer';
import SectionLanding, { type LandingCategoryCard, type LandingDifficultyCard } from 'ui-component/topic-dashboard/SectionLanding';
import TopicFilterCards, { type CategoryOption, type DifficultyOption } from 'ui-component/topic-dashboard/TopicFilterCards';
import { useSectionFilter } from 'hooks/useSectionFilter';
import { useSelector } from 'store';
import useInjectReducer from 'store/useInjectReducer';
import engineeringReducer, { selectEngineeringNotes, selectEngineeringFlashcards } from 'store/slices/engineering';
import type { Note } from 'types/content';

// ─── Static meta (no data dependency) ────────────────────────────────────────

const CATEGORY_EMOJI: Record<string, string> = {
  fundamentals: '🧮',
  oop: '🧱',
  apis: '🔌',
  databases: '🗄️',
  'system-design': '🏗️',
  architecture: '🏛️',
  practices: '✨',
  'version-control': '🌿',
  'testing-types': '🧪',
  'testing-automation': '🤖'
};

const CATEGORY_LABELS: Record<string, string> = {
  fundamentals: 'Fundamentals',
  oop: 'OOP',
  apis: 'APIs',
  databases: 'Databases',
  'system-design': 'System Design',
  architecture: 'Architecture',
  practices: 'Practices',
  'version-control': 'Version Control',
  'testing-types': 'Testing Types',
  'testing-automation': 'Test Automation'
};

const DIFFICULTY_META: DifficultyOption[] = [
  { label: 'Basic', value: 'basic', count: 0, emoji: '🟢', color: 'success' },
  { label: 'Intermediate', value: 'intermediate', count: 0, emoji: '🟡', color: 'warning' },
  { label: 'Advanced', value: 'advanced', count: 0, emoji: '🔴', color: 'error' }
];

const PAGE_TITLE = '⚙️ Engineering Essentials';

const labelFor = (val: string) => CATEGORY_LABELS[val] ?? val.charAt(0).toUpperCase() + val.slice(1);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EngineeringNotesPage() {
  useInjectReducer('engineering', engineeringReducer);
  const engineeringNotes = useSelector(selectEngineeringNotes);
  const engineeringFlashcards = useSelector(selectEngineeringFlashcards);

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

  const DIFFICULTY_LANDING = useMemo<LandingDifficultyCard[]>(
    () => [
      {
        label: 'Basic',
        value: 'basic',
        count: engineeringNotes.filter((c) => c.difficulty === 'basic').length,
        emoji: '🟢',
        color: 'success',
        blurb: 'Compilers, OOP pillars, REST, Git, the testing pyramid'
      },
      {
        label: 'Intermediate',
        value: 'intermediate',
        count: engineeringNotes.filter((c) => c.difficulty === 'intermediate').length,
        emoji: '🟡',
        color: 'warning',
        blurb: 'Big-O, SOLID, SQL vs NoSQL, caching, scaling, CI/CD, TDD'
      },
      {
        label: 'Advanced',
        value: 'advanced',
        count: engineeringNotes.filter((c) => c.difficulty === 'advanced').length,
        emoji: '🔴',
        color: 'error',
        blurb: 'Distributed systems & microservices trade-offs'
      }
    ],
    [engineeringNotes]
  );

  const CATEGORY_LANDING = useMemo<LandingCategoryCard[]>(() => {
    const map = new Map<string, number>();
    engineeringNotes.forEach((c) => map.set(c.category, (map.get(c.category) ?? 0) + 1));
    return Array.from(map.entries()).map(([val, count]) => ({
      value: val,
      label: labelFor(val),
      count,
      emoji: CATEGORY_EMOJI[val] ?? '📌'
    }));
  }, [engineeringNotes]);

  const GOTCHA_COUNT = useMemo(() => engineeringNotes.filter((c) => !!c.gotcha).length, [engineeringNotes]);

  const difficulties: DifficultyOption[] = useMemo(
    () =>
      DIFFICULTY_META.map((d) => ({
        ...d,
        count: engineeringNotes.filter((c) => c.difficulty === (d.value as Note['difficulty'])).length
      })),
    [engineeringNotes]
  );

  const categories: CategoryOption[] = useMemo(() => {
    const base = difficulty === 'all' ? engineeringNotes : engineeringNotes.filter((c) => c.difficulty === difficulty);
    const catMap = new Map<string, number>();
    base.forEach((c) => catMap.set(c.category, (catMap.get(c.category) ?? 0) + 1));
    return Array.from(catMap.entries()).map(([val, count]) => ({ label: labelFor(val), value: val, count }));
  }, [engineeringNotes, difficulty]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return engineeringNotes.filter((c) => {
      const matchSearch = !q || c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q);
      const matchCat = category === 'all' || c.category === category;
      const matchDiff = difficulty === 'all' || c.difficulty === difficulty;
      const matchGotcha = !showGotchaOnly || !!c.gotcha;
      return matchSearch && matchCat && matchDiff && matchGotcha;
    });
  }, [engineeringNotes, search, category, difficulty, showGotchaOnly]);

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
          icon={<IconCpu size={28} />}
          title="Engineering Essentials"
          description="Tech-agnostic fundamentals that show up in engineering interviews — data structures & Big-O, OOP & SOLID, REST APIs, databases, system design (caching, scaling, microservices), Git, clean code, CI/CD, and the full testing lifecycle."
          totalCount={engineeringNotes.length}
          difficultyCards={DIFFICULTY_LANDING}
          onEnter={enterWithDifficulty}
          categoryCards={CATEGORY_LANDING}
          onEnterCategory={enterWithCategory}
          gotchaCount={GOTCHA_COUNT}
          onGotchaOnly={enterGotchaOnly}
          flashcards={engineeringFlashcards}
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
            {filtered.length} of {engineeringNotes.length}
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
          <Box
            sx={{
              width: 240,
              flexShrink: 0,
              position: 'sticky',
              top: 88,
              alignSelf: 'flex-start',
              maxHeight: 'calc(100vh - 104px)',
              overflowY: 'auto',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' }
            }}
          >
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
          <VirtualNoteList notes={filtered} openId={openId} onToggle={handleToggle} />
        )}
      </FilterShell>
    </MainCard>
  );
}
