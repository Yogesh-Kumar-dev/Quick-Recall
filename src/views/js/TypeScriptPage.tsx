'use client';
import { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { IconBrandTypescript, IconSearch } from '@tabler/icons-react';

import MainCard from 'ui-component/cards/MainCard';
import NoteCard from 'ui-component/interview-prep/NoteCard';
import SectionLanding, { type LandingCategoryCard, type LandingDifficultyCard } from 'ui-component/topic-dashboard/SectionLanding';
import TopicFilterCards, { type CategoryOption, type DifficultyOption } from 'ui-component/topic-dashboard/TopicFilterCards';
import { useSectionFilter } from 'hooks/useSectionFilter';
import { useSelector } from 'store';
import { selectTsNotes } from 'store/slices/javascript';
import type { Note } from 'types/content';

// ─── Static meta (no data dependency) ────────────────────────────────────────

const CATEGORY_EMOJI: Record<string, string> = {
  types: '🏷️',
  generics: '🧬',
  'utility-types': '🛠️',
  advanced: '⚡'
};

const CATEGORY_LABEL: Record<string, string> = {
  types: 'Types',
  generics: 'Generics',
  'utility-types': 'Utility Types',
  advanced: 'Advanced'
};

const DIFFICULTY_META: DifficultyOption[] = [
  { label: 'Basic', value: 'basic', count: 0, emoji: '🟢', color: 'success' },
  { label: 'Intermediate', value: 'intermediate', count: 0, emoji: '🟡', color: 'warning' },
  { label: 'Advanced', value: 'advanced', count: 0, emoji: '🔴', color: 'error' }
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TypeScriptPage() {
  const tsNotes = useSelector(selectTsNotes);

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
    handleToggle
  } = useSectionFilter();

  // ── Derived landing cards (depend on data) ────────────────────────────────
  const DIFFICULTY_LANDING = useMemo<LandingDifficultyCard[]>(
    () => [
      { label: 'Basic', value: 'basic', count: tsNotes.filter((c) => c.difficulty === 'basic').length, emoji: '🟢', color: 'success', blurb: 'type vs interface, union & intersection types, enums' },
      { label: 'Intermediate', value: 'intermediate', count: tsNotes.filter((c) => c.difficulty === 'intermediate').length, emoji: '🟡', color: 'warning', blurb: 'Generics, utility types, type guards, keyof & typeof' },
      { label: 'Advanced', value: 'advanced', count: tsNotes.filter((c) => c.difficulty === 'advanced').length, emoji: '🔴', color: 'error', blurb: 'Mapped types, conditional types, template literal types' }
    ],
    [tsNotes]
  );

  const CATEGORY_LANDING = useMemo<LandingCategoryCard[]>(() => {
    const map = new Map<string, number>();
    tsNotes.forEach((c) => map.set(c.category, (map.get(c.category) ?? 0) + 1));
    return Array.from(map.entries()).map(([val, count]) => ({
      value: val,
      label: CATEGORY_LABEL[val] ?? val.charAt(0).toUpperCase() + val.slice(1),
      count,
      emoji: CATEGORY_EMOJI[val] ?? '📌'
    }));
  }, [tsNotes]);

  const GOTCHA_COUNT = useMemo(() => tsNotes.filter((c) => !!c.gotcha).length, [tsNotes]);

  // ── Counts for list-view filter strip ────────────────────────────────────
  const difficulties: DifficultyOption[] = useMemo(
    () =>
      DIFFICULTY_META.map((d) => ({
        ...d,
        count: tsNotes.filter((c) => c.difficulty === (d.value as Note['difficulty'])).length
      })),
    [tsNotes]
  );

  const categories: CategoryOption[] = useMemo(() => {
    const base = difficulty === 'all' ? tsNotes : tsNotes.filter((c) => c.difficulty === difficulty);
    const catMap = new Map<string, number>();
    base.forEach((c) => catMap.set(c.category, (catMap.get(c.category) ?? 0) + 1));
    return Array.from(catMap.entries()).map(([val, count]) => ({
      label: CATEGORY_LABEL[val] ?? val.charAt(0).toUpperCase() + val.slice(1),
      value: val,
      count
    }));
  }, [tsNotes, difficulty]);

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tsNotes.filter((c) => {
      const matchSearch = !q || c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q);
      const matchCat = category === 'all' || c.category === category;
      const matchDiff = difficulty === 'all' || c.difficulty === difficulty;
      const matchGotcha = !showGotchaOnly || !!c.gotcha;
      return matchSearch && matchCat && matchDiff && matchGotcha;
    });
  }, [tsNotes, search, category, difficulty, showGotchaOnly]);

  // ── Guard: invalid URL params → back to section landing ──────────────────
  useEffect(() => {
    if (!isLanding && filtered.length === 0 && !search && !showGotchaOnly) {
      exitToLanding();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length, isLanding, search, showGotchaOnly]);

  // ── Landing ───────────────────────────────────────────────────────────────
  if (isLanding) {
    return (
      <MainCard title="📘 TypeScript Notes">
        <SectionLanding
          icon={<IconBrandTypescript size={28} />}
          title="TypeScript Notes"
          description="Practical TypeScript for interviews. From basic type annotations to advanced mapped and conditional types — each note covers key points, a code example, and the gotchas interviewers look for."
          totalCount={tsNotes.length}
          difficultyCards={DIFFICULTY_LANDING}
          onEnter={enterWithDifficulty}
          categoryCards={CATEGORY_LANDING}
          onEnterCategory={enterWithCategory}
          gotchaCount={GOTCHA_COUNT}
          onGotchaOnly={enterGotchaOnly}
        />
      </MainCard>
    );
  }

  // ── List view ─────────────────────────────────────────────────────────────
  return (
    <MainCard
      title="📘 TypeScript Notes"
      secondary={
        <Typography variant="caption" color="text.secondary">
          {filtered.length} of {tsNotes.length}
        </Typography>
      }
    >
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
        {/* ── Left: content ── */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
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
                <NoteCard
                  key={note.id}
                  note={note}
                  isOpen={openId === note.id}
                  onToggle={() => handleToggle(note.id)}
                />
              ))}
            </Stack>
          )}
        </Box>

        {/* ── Right: sticky filter panel ── */}
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
      </Box>
    </MainCard>
  );
}
