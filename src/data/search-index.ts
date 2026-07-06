import Fuse from 'fuse.js';

// data sources
import { jsProblems } from './javascript/js-problems';
import { reactMcProblems } from './react/react-mc-problems';
import { reactCustomHooks } from './react/react-custom-hooks';

// notes — every topic's notes array, paired with the page that renders it (see resolve-content.ts
// for the equivalent by-id lookup used by bookmarks/review; this is a separate by-page-url list
// since search needs to link to a specific topic page, not just resolve a bare note by id).
import type { Note } from '@/types/content';
import { jsNotes } from './javascript/js-notes';
import { tsNotes } from './javascript/ts-notes';
import { tsReactNotes } from './javascript/ts-react';
import { reactNotes } from './react/react-notes';
import { nextjsNotes } from './nextjs/nextjs-notes';
import { nextjsRenderingNotes } from './nextjs/nextjs-rendering';
import { reduxNotes } from './redux/redux-notes';
import { reduxToolkitNotes } from './redux/redux-toolkit-notes';
import { rtkQueryNotes } from './redux/rtk-query-notes';
import { asyncThunkNotes } from './redux/async-thunk-notes';
import { htmlNotes } from './htmlcss/html-notes';
import { cssNotes } from './htmlcss/css-notes';
import { engineeringNotes } from './engineering/engineering-notes';
import { nodejsNotes } from './nodejs/nodejs-notes';

// nav config
import { primaryNav, navSections } from '@/config/nav';

// ─── Unified search item ──────────────────────────────────────────────────────

export type SearchSection = 'JavaScript' | 'React' | 'Notes' | 'Navigation';
export type SearchKind = 'JS Problem' | 'React Problem' | 'Custom Hook' | 'Note' | 'Page';

export interface SearchItem {
  id: string;
  label: string; // primary match field
  description?: string; // secondary match (tagline / caption)
  keywords?: string[]; // tags for problems/hooks
  difficulty?: string; // surfaced as a chip when present
  category: string;
  section: SearchSection;
  kind: SearchKind;
  url: string;
}

// ─── Build the index from existing data (no content duplication) ──────────────

const jsProblemItems: SearchItem[] = jsProblems.map((p) => ({
  id: `js-problem-${p.id}`,
  label: p.title,
  description: p.tags.join(', '),
  keywords: p.tags,
  difficulty: p.difficulty,
  category: p.category,
  section: 'JavaScript',
  kind: 'JS Problem',
  url: `/js/machine-coding/${p.slug}`
}));

const reactProblemItems: SearchItem[] = reactMcProblems.map((p) => ({
  id: `react-problem-${p.id}`,
  label: p.title,
  description: p.tags.join(', '),
  keywords: p.tags,
  difficulty: p.difficulty,
  category: p.category,
  section: 'React',
  kind: 'React Problem',
  url: `/react/machine-coding/${p.slug}`
}));

const hookItems: SearchItem[] = reactCustomHooks.map((h) => ({
  id: `hook-${h.id}`,
  label: h.name,
  description: h.tagline,
  difficulty: h.difficulty,
  category: h.category,
  section: 'React',
  kind: 'Custom Hook',
  url: `/react/custom-hooks?open=${h.id}`
}));

// Every topic's notes, paired with the page that hosts them. Selecting a result deep-links via
// ?open=<note.id> — NotesView/NoteCard already opens and scrolls to the matching card on load.
const NOTE_SOURCES: { notes: Note[]; url: string; topic: string }[] = [
  { notes: jsNotes, url: '/js/notes', topic: 'JavaScript' },
  { notes: tsNotes, url: '/js/typescript', topic: 'TypeScript' },
  { notes: tsReactNotes, url: '/js/ts-for-react', topic: 'TS for React' },
  { notes: reactNotes, url: '/react/notes', topic: 'React' },
  { notes: nextjsNotes, url: '/nextjs/notes', topic: 'Next.js' },
  { notes: nextjsRenderingNotes, url: '/nextjs/rendering', topic: 'Next.js Rendering' },
  { notes: reduxNotes, url: '/redux/notes', topic: 'Redux' },
  { notes: reduxToolkitNotes, url: '/redux/toolkit', topic: 'Redux Toolkit' },
  { notes: rtkQueryNotes, url: '/redux/rtk-query', topic: 'RTK Query' },
  { notes: asyncThunkNotes, url: '/redux/async-thunk', topic: 'createAsyncThunk' },
  { notes: htmlNotes, url: '/html-css/html', topic: 'HTML' },
  { notes: cssNotes, url: '/html-css/css', topic: 'CSS' },
  { notes: engineeringNotes, url: '/engineering/notes', topic: 'Engineering' },
  { notes: nodejsNotes, url: '/nodejs/notes', topic: 'Node.js' }
];

const noteItems: SearchItem[] = NOTE_SOURCES.flatMap(({ notes, url, topic }) =>
  notes.map((n) => ({
    id: `note-${n.id}`,
    label: n.title,
    description: `${topic} — ${n.summary}`,
    difficulty: n.difficulty,
    category: n.category,
    section: 'Notes' as const,
    kind: 'Note' as const,
    url: `${url}?open=${n.id}`
  }))
);

// Flat nav config (src/config/nav.ts) — no tree to walk, unlike legacy's NavItemType recursion.
const navItems: SearchItem[] = [
  ...primaryNav.map((n) => ({
    id: `nav-${n.url}`,
    label: n.title,
    category: 'Navigation',
    section: 'Navigation' as const,
    kind: 'Page' as const,
    url: n.url
  })),
  ...navSections.flatMap((s) =>
    s.items.map((n) => ({
      id: `nav-${n.url}`,
      label: n.title,
      category: s.title,
      section: 'Navigation' as const,
      kind: 'Page' as const,
      url: n.url
    }))
  )
];

// Prefer the richer problem/hook/note entries: drop nav pages whose url is already
// represented by one of those (note urls carry a ?open= query, so a topic's own bare "/x/notes"
// nav link is untouched — only exact-url collisions, e.g. a hook's own page, are dropped).
const richUrls = new Set([...jsProblemItems, ...reactProblemItems, ...hookItems, ...noteItems].map((i) => i.url));
const dedupedNavItems = navItems.filter((i) => !richUrls.has(i.url));

export const searchIndex: SearchItem[] = [...jsProblemItems, ...reactProblemItems, ...hookItems, ...noteItems, ...dedupedNavItems];

// ─── Fuse factory ─────────────────────────────────────────────────────────────

export function createSearchFuse(): Fuse<SearchItem> {
  return new Fuse(searchIndex, {
    keys: [
      { name: 'label', weight: 0.6 },
      { name: 'keywords', weight: 0.25 },
      { name: 'description', weight: 0.15 }
    ],
    threshold: 0.4,
    ignoreLocation: true,
    minMatchCharLength: 2
  });
}
