import Fuse from 'fuse.js';

// data sources
import { jsProblems } from './javascript/js-problems';
import { reactMcProblems } from './react/react-mc-problems';
import { reactCustomHooks } from './react-custom-hooks';

// menu trees
import dashboard from 'menu-items/dashboard';
import javascript from 'menu-items/javascript';
import react from 'menu-items/react';
import htmlcss from 'menu-items/htmlcss';
import redux from 'menu-items/redux';
import nextjs from 'menu-items/nextjs';
import engineering from 'menu-items/engineering';
import about from 'menu-items/about';

import type { NavItemType } from 'types';

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
  url: `/machine-coding/${p.slug}`
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

// Recursively collect navigable leaf items (type === 'item' with a url) from a menu tree.
function collectNavItems(node: NavItemType, acc: SearchItem[]): void {
  if (node.type === 'item' && node.url) {
    acc.push({
      id: `nav-${node.id ?? node.url}`,
      label: node.title ?? node.url,
      description: node.caption,
      category: 'Navigation',
      section: 'Navigation',
      kind: 'Page',
      url: node.url
    });
  }
  node.children?.forEach((child) => collectNavItems(child, acc));
}

const navItems: SearchItem[] = [];
[dashboard, htmlcss, javascript, react, redux, nextjs, engineering, about].forEach((group) => collectNavItems(group, navItems));

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
