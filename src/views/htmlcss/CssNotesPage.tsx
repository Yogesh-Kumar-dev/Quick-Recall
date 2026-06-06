'use client';
import { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { IconBrandCss3, IconSearch } from '@tabler/icons-react';

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
import htmlcssReducer, { selectCssNotes, selectCssFlashcards } from 'store/slices/htmlcss';
import type { Note } from 'types/content';

// ─── Static meta (no data dependency) ────────────────────────────────────────

const CATEGORY_EMOJI: Record<string, string> = {
  'box-model': '📦',
  layout: '🧱',
  positioning: '📐',
  selectors: '🎯',
  responsive: '📱',
  visual: '🎨',
  architecture: '🏛️'
};

const CATEGORY_LABELS: Record<string, string> = {
  'box-model': 'Box Model',
  layout: 'Layout',
  positioning: 'Positioning',
  selectors: 'Selectors',
  responsive: 'Responsive',
  visual: 'Visual',
  architecture: 'Architecture'
};

const DIFFICULTY_META: DifficultyOption[] = [
  { label: 'Basic', value: 'basic', count: 0, emoji: '🟢', color: 'success' },
  { label: 'Intermediate', value: 'intermediate', count: 0, emoji: '🟡', color: 'warning' },
  { label: 'Advanced', value: 'advanced', count: 0, emoji: '🔴', color: 'error' }
];

const PAGE_TITLE = '🎨 CSS Notes';

const labelFor = (val: string) => CATEGORY_LABELS[val] ?? val.charAt(0).toUpperCase() + val.slice(1);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CssNotesPage() {
  useInjectReducer('htmlcss', htmlcssReducer);
  const cssNotes = useSelector(selectCssNotes);
  const cssFlashcards = useSelector(selectCssFlashcards);

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
        count: cssNotes.filter((c) => c.difficulty === 'basic').length,
        emoji: '🟢',
        color: 'success',
        blurb: 'Box model, units, selectors, pseudo-classes'
      },
      {
        label: 'Intermediate',
        value: 'intermediate',
        count: cssNotes.filter((c) => c.difficulty === 'intermediate').length,
        emoji: '🟡',
        color: 'warning',
        blurb: 'Flexbox, Grid, positioning, specificity, variables, animation'
      },
      {
        label: 'Advanced',
        value: 'advanced',
        count: cssNotes.filter((c) => c.difficulty === 'advanced').length,
        emoji: '🔴',
        color: 'error',
        blurb: 'Stacking contexts and tricky cascade edge cases'
      }
    ],
    [cssNotes]
  );

  const CATEGORY_LANDING = useMemo<LandingCategoryCard[]>(() => {
    const map = new Map<string, number>();
    cssNotes.forEach((c) => map.set(c.category, (map.get(c.category) ?? 0) + 1));
    return Array.from(map.entries()).map(([val, count]) => ({
      value: val,
      label: labelFor(val),
      count,
      emoji: CATEGORY_EMOJI[val] ?? '📌'
    }));
  }, [cssNotes]);

  const GOTCHA_COUNT = useMemo(() => cssNotes.filter((c) => !!c.gotcha).length, [cssNotes]);

  const difficulties: DifficultyOption[] = useMemo(
    () =>
      DIFFICULTY_META.map((d) => ({
        ...d,
        count: cssNotes.filter((c) => c.difficulty === (d.value as Note['difficulty'])).length
      })),
    [cssNotes]
  );

  const categories: CategoryOption[] = useMemo(() => {
    const base = difficulty === 'all' ? cssNotes : cssNotes.filter((c) => c.difficulty === difficulty);
    const catMap = new Map<string, number>();
    base.forEach((c) => catMap.set(c.category, (catMap.get(c.category) ?? 0) + 1));
    return Array.from(catMap.entries()).map(([val, count]) => ({ label: labelFor(val), value: val, count }));
  }, [cssNotes, difficulty]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return cssNotes.filter((c) => {
      const matchSearch = !q || c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q);
      const matchCat = category === 'all' || c.category === category;
      const matchDiff = difficulty === 'all' || c.difficulty === difficulty;
      const matchGotcha = !showGotchaOnly || !!c.gotcha;
      return matchSearch && matchCat && matchDiff && matchGotcha;
    });
  }, [cssNotes, search, category, difficulty, showGotchaOnly]);

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
          icon={<IconBrandCss3 size={28} />}
          title="CSS"
          description="Core CSS notes for front-end interviews. Covers the box model, selectors & specificity, Flexbox and Grid layout, positioning and stacking, responsive design, custom properties, animation, and CSS architecture."
          totalCount={cssNotes.length}
          difficultyCards={DIFFICULTY_LANDING}
          onEnter={enterWithDifficulty}
          categoryCards={CATEGORY_LANDING}
          onEnterCategory={enterWithCategory}
          gotchaCount={GOTCHA_COUNT}
          onGotchaOnly={enterGotchaOnly}
          flashcards={cssFlashcards}
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
            {filtered.length} of {cssNotes.length}
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
            searchPlaceholder="Search CSS notes…"
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
                placeholder="Search CSS notes…"
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
