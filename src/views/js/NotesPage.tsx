'use client';
import { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { IconBrandJavascript, IconSearch } from '@tabler/icons-react';

import MainCard from 'ui-component/cards/MainCard';
import { PlaylistLauncher } from 'ui-component/playlist-player';
import { InstagramLauncher } from 'ui-component/instagram-launcher';
import { JS_NOTES_PLAYLISTS, JS_NOTES_INSTAGRAM } from 'data/video-playlists';
import VirtualNoteList from 'ui-component/interview-prep/VirtualNoteList';
import FilterShell from 'ui-component/topic-dashboard/FilterShell';
import MobileFilterDrawer from 'ui-component/topic-dashboard/MobileFilterDrawer';
import SectionLanding, { type LandingCategoryCard, type LandingDifficultyCard } from 'ui-component/topic-dashboard/SectionLanding';
import TopicFilterCards, { type DifficultyOption } from 'ui-component/topic-dashboard/TopicFilterCards';
import { useSectionFilter } from 'hooks/useSectionFilter';
import { useSelector } from 'store';
import useInjectReducer from 'store/useInjectReducer';
import javascriptReducer, { selectJsNotes, selectJsFlashcards } from 'store/slices/javascript';
import type { Note } from 'types/content';

// ─── Static meta (no data dependency) ────────────────────────────────────────

const TOPIC_META: { value: string; label: string; emoji: string; blurb: string }[] = [
  {
    value: 'core-concepts',
    label: 'Core Concepts',
    emoji: '🧠',
    blurb: 'hoisting, scope, closures, ==/===, data types, coercion, strict mode'
  },
  {
    value: 'functions-this',
    label: 'Functions & this',
    emoji: '🎯',
    blurb: 'this binding, call/apply/bind, higher-order functions, currying, partial application'
  },
  {
    value: 'oop-prototypes',
    label: 'OOP & Prototypes',
    emoji: '🧬',
    blurb: 'prototypal inheritance, prototype chain, new, classes vs constructors, static members'
  },
  { value: 'string-methods', label: 'String Methods', emoji: '🔤', blurb: 'slice, split, includes, trim, replace, padStart and more' },
  { value: 'array-methods', label: 'Array Methods', emoji: '📦', blurb: 'map, filter, reduce, sort, splice, flat and more' },
  { value: 'collections', label: 'Collections', emoji: '🗂️', blurb: 'Map, Set, WeakMap, WeakSet, Map vs object, equality checks' },
  { value: 'dom', label: 'DOM Manipulation', emoji: '🌐', blurb: 'querySelector, addEventListener, classList, createElement' },
  { value: 'error-handling', label: 'Error Handling', emoji: '⚠️', blurb: 'try/catch, error types, custom errors, async errors' },
  { value: 'async-js', label: 'Async JS', emoji: '⏳', blurb: 'setTimeout, callbacks, event loop, promises, async/await' },
  { value: 'web-apis', label: 'Web APIs', emoji: '🌍', blurb: 'fetch, localStorage, URL, History, IntersectionObserver' },
  { value: 'modules', label: 'Modules', emoji: '📦', blurb: 'ES modules vs CommonJS, tree shaking, bundlers, import/export' },
  {
    value: 'design-patterns',
    label: 'Design Patterns',
    emoji: '🧩',
    blurb: 'Singleton, Factory, Observer, Module, Strategy, Decorator, Command'
  },
  { value: 'security', label: 'Security', emoji: '🔒', blurb: 'XSS, CSRF, CSP, same-origin policy, security headers, input validation' },
  { value: 'es2026', label: 'ECMAScript 2026', emoji: '✨', blurb: 'Temporal API, using/await using, Error.isError, RegExp.escape' }
];

const VERSION_META: { value: string; label: string; year: string; emoji: string; blurb: string }[] = [
  {
    value: 'es6',
    label: 'ES6',
    year: '2015',
    emoji: '⭐',
    blurb:
      'let/const, arrow functions, classes, modules, Promises, destructuring, spread, template literals, Map/Set, Symbol, Generators, Proxy'
  },
  { value: 'es7', label: 'ES7', year: '2016', emoji: '🔢', blurb: 'Array.includes(), exponentiation operator (**)' },
  {
    value: 'es8',
    label: 'ES8',
    year: '2017',
    emoji: '⏳',
    blurb: 'async/await, Object.values/entries, String.padStart/padEnd, Object.getOwnPropertyDescriptors'
  },
  {
    value: 'es9',
    label: 'ES9',
    year: '2018',
    emoji: '🔀',
    blurb: 'Object rest/spread, Promise.finally, async iteration (for await...of), regex named groups'
  },
  {
    value: 'es10',
    label: 'ES10',
    year: '2019',
    emoji: '🔄',
    blurb: 'Array.flat/flatMap, Object.fromEntries, String.trimStart/trimEnd, optional catch binding'
  },
  {
    value: 'es11',
    label: 'ES11',
    year: '2020',
    emoji: '🔗',
    blurb: 'Optional chaining (?.), nullish coalescing (??), BigInt, Promise.allSettled, dynamic import(), globalThis'
  },
  {
    value: 'es12',
    label: 'ES12',
    year: '2021',
    emoji: '🔧',
    blurb: 'String.replaceAll, Promise.any, logical assignment (&&=, ||=, ??=), WeakRef, FinalizationRegistry'
  },
  {
    value: 'es13',
    label: 'ES13',
    year: '2022',
    emoji: '🔐',
    blurb: 'Class fields & private members (#), Array.at(), Object.hasOwn(), top-level await, Error.cause'
  },
  {
    value: 'es14',
    label: 'ES14',
    year: '2023',
    emoji: '🧊',
    blurb: 'Array toSorted/toReversed/toSpliced/with, findLast/findLastIndex, Symbols as WeakMap keys'
  },
  {
    value: 'es2024',
    label: 'ES2024',
    year: '2024',
    emoji: '✨',
    blurb: 'Promise.withResolvers, Object.groupBy, Map.groupBy, ArrayBuffer.transfer, RegExp /v flag'
  }
];

const DIFFICULTY_META: DifficultyOption[] = [
  { label: 'Basic', value: 'basic', count: 0, emoji: '🟢', color: 'success' },
  { label: 'Intermediate', value: 'intermediate', count: 0, emoji: '🟡', color: 'warning' },
  { label: 'Advanced', value: 'advanced', count: 0, emoji: '🔴', color: 'error' }
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotesPage() {
  useInjectReducer('javascript', javascriptReducer);
  const jsNotes = useSelector(selectJsNotes);
  const jsFlashcards = useSelector(selectJsFlashcards);

  const {
    isLanding,
    difficulty,
    category,
    search,
    openId,
    enterWithDifficulty,
    enterWithCategory,
    exitToLanding,
    handleDifficultyChange,
    handleCategoryChange,
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
        count: jsNotes.filter((c) => c.difficulty === 'basic').length,
        emoji: '🟢',
        color: 'success',
        blurb: 'let/const, arrow functions, template literals, destructuring, spread/rest'
      },
      {
        label: 'Intermediate',
        value: 'intermediate',
        count: jsNotes.filter((c) => c.difficulty === 'intermediate').length,
        emoji: '🟡',
        color: 'warning',
        blurb: 'Promises, async/await, generators, Proxy, optional chaining'
      },
      {
        label: 'Advanced',
        value: 'advanced',
        count: jsNotes.filter((c) => c.difficulty === 'advanced').length,
        emoji: '🔴',
        color: 'error',
        blurb: 'Symbols, iterators, Reflect, async iteration, advanced patterns'
      }
    ],
    [jsNotes]
  );

  const topicCards = useMemo<LandingCategoryCard[]>(
    () =>
      TOPIC_META.map(({ value, label, emoji }) => ({
        value,
        label,
        count: jsNotes.filter((c) => c.category === value).length,
        emoji
      })).filter((t) => t.count > 0),
    [jsNotes]
  );

  const versionCards = useMemo<LandingCategoryCard[]>(
    () =>
      VERSION_META.map(({ value, label, year, emoji }) => ({
        value,
        label: `${label} (${year})`,
        count: jsNotes.filter((c) => c.category === value).length,
        emoji
      })).filter((v) => v.count > 0),
    [jsNotes]
  );

  const allCategoryCards = useMemo<LandingCategoryCard[]>(() => [...topicCards, ...versionCards], [topicCards, versionCards]);

  const activeVersion = VERSION_META.find((v) => v.value === category);
  const activeTopic = TOPIC_META.find((t) => t.value === category);

  // ── Counts for list-view difficulty strip ─────────────────────────────────
  const difficulties: DifficultyOption[] = useMemo(
    () => DIFFICULTY_META.map((d) => ({ ...d, count: jsNotes.filter((c) => c.difficulty === (d.value as Note['difficulty'])).length })),
    [jsNotes]
  );

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return jsNotes.filter((c) => {
      const matchSearch = !q || c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q);
      const matchCategory = category === 'all' || c.category === category;
      const matchDiff = difficulty === 'all' || c.difficulty === difficulty;
      return matchSearch && matchCategory && matchDiff;
    });
  }, [jsNotes, search, category, difficulty]);

  // ── Guard: invalid params → back to landing ───────────────────────────────
  useEffect(() => {
    if (!isLanding && filtered.length === 0 && !search) {
      exitToLanding();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length, isLanding, search]);

  // ── Landing ───────────────────────────────────────────────────────────────
  if (isLanding) {
    return (
      <MainCard
        title="📗 JS Notes"
        secondary={
          <Stack direction="row" spacing={0.5} alignItems="center">
            <PlaylistLauncher playlists={JS_NOTES_PLAYLISTS} />
            <InstagramLauncher links={JS_NOTES_INSTAGRAM} />
          </Stack>
        }
      >
        <SectionLanding
          icon={<IconBrandJavascript size={28} />}
          title="JavaScript Notes"
          description="Topic-based reference covering String Methods, Array Methods, DOM, Async JS, Error Handling, Web APIs, and ES2026 — plus a full ES6→ES2024 version guide. Each entry covers key points, a code example, and gotchas for interviews."
          totalCount={jsNotes.length}
          difficultyCards={DIFFICULTY_LANDING}
          onEnter={enterWithDifficulty}
          categoryCards={allCategoryCards}
          onEnterCategory={enterWithCategory}
          flashcards={jsFlashcards}
          flashcardSource="js"
        />
      </MainCard>
    );
  }

  // ── List view ─────────────────────────────────────────────────────────────
  const cardTitle = activeTopic
    ? `📗 ${activeTopic.emoji} ${activeTopic.label}`
    : activeVersion
      ? `📗 ${activeVersion.label} (${activeVersion.year})`
      : '📗 JS Notes';

  return (
    <MainCard
      title={cardTitle}
      secondary={
        <Typography variant="caption" color="text.secondary">
          {filtered.length} of {jsNotes.length}
        </Typography>
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
            activeCategory={category}
            chipGroups={[
              {
                label: 'By Topic',
                activeValue: category,
                options: TOPIC_META.map((t) => ({ value: t.value, label: `${t.emoji} ${t.label}` }))
              },
              {
                label: 'By ES Version',
                activeValue: category,
                options: versionCards.map((v) => ({ value: v.value, label: `${v.emoji} ${v.label}` }))
              }
            ]}
            search={search}
            searchPlaceholder="Search features…"
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
                placeholder="Search features…"
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
              activeCategory="all"
              onCategoryChange={() => {}}
              vertical
            />

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ display: 'block', mb: 1, letterSpacing: 1.5, fontSize: '0.68rem', fontWeight: 700 }}
            >
              By Topic
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {TOPIC_META.map((t) => (
                <Chip
                  key={t.value}
                  label={`${t.emoji} ${t.label}`}
                  onClick={() => handleCategoryChange(t.value === category ? 'all' : t.value)}
                  color={category === t.value ? 'primary' : 'default'}
                  variant={category === t.value ? 'filled' : 'outlined'}
                  size="small"
                />
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ display: 'block', mb: 1, letterSpacing: 1.5, fontSize: '0.68rem', fontWeight: 700 }}
            >
              By ES Version
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              <Chip
                label="All"
                onClick={() => handleCategoryChange('all')}
                color={category === 'all' ? 'primary' : 'default'}
                variant={category === 'all' ? 'filled' : 'outlined'}
                size="small"
              />
              {versionCards.map((v) => (
                <Chip
                  key={v.value}
                  label={`${v.emoji} ${v.label}`}
                  onClick={() => handleCategoryChange(v.value === category ? 'all' : v.value)}
                  color={category === v.value ? 'primary' : 'default'}
                  variant={category === v.value ? 'filled' : 'outlined'}
                  size="small"
                />
              ))}
            </Box>
          </Box>
        }
      >
        {(activeVersion || activeTopic) && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
            {activeVersion?.blurb ?? activeTopic?.blurb}
          </Typography>
        )}

        {filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography color="text.secondary">No features match your filters.</Typography>
          </Box>
        ) : (
          <VirtualNoteList notes={filtered} openId={openId} onToggle={handleToggle} />
        )}
      </FilterShell>
    </MainCard>
  );
}
