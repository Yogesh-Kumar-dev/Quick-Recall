import Fuse from 'fuse.js';

// data sources
import { jsProblems } from './javascript/js-problems';
import { reactMcProblems } from './react/react-mc-problems';
import { reactCustomHooks } from './react/react-custom-hooks';

// notes — every topic's notes array, paired with the page that renders it (see resolve-content.ts
// for the equivalent by-id lookup used by bookmarks/review; this is a separate by-page-url list
// since search needs to link to a specific topic page, not just resolve a bare note by id).
import { NOTE_SOURCES } from './note-sources';

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

// Every topic's notes, paired with the page that hosts them (NOTE_SOURCES, shared with the
// prerequisites resolver in note-sources.ts). Selecting a result deep-links via ?open=<note.id> —
// NotesView/NoteCard already opens and scrolls to the matching card on load.
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
