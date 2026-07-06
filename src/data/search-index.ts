import Fuse from 'fuse.js';

// data sources
import { jsProblems } from './javascript/js-problems';
import { reactMcProblems } from './react/react-mc-problems';
import { reactCustomHooks } from './react/react-custom-hooks';

// nav config
import { primaryNav, navSections } from '@/config/nav';

// ─── Unified search item ──────────────────────────────────────────────────────

export type SearchSection = 'JavaScript' | 'React' | 'Navigation';
export type SearchKind = 'JS Problem' | 'React Problem' | 'Custom Hook' | 'Page';

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

// Prefer the richer problem/hook entries: drop nav pages whose url is already
// represented by a problem/hook entry.
const richUrls = new Set([...jsProblemItems, ...reactProblemItems, ...hookItems].map((i) => i.url));
const dedupedNavItems = navItems.filter((i) => !richUrls.has(i.url));

export const searchIndex: SearchItem[] = [...jsProblemItems, ...reactProblemItems, ...hookItems, ...dedupedNavItems];

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
