// ==============================|| QUICK RECALL DERIVATION (Note[] → sections) ||============================== //

// Quick-recall sheets for every topic are derived from the existing Note[] data — a Note already
// carries everything a cheatsheet item needs (title/keyPoints/gotcha/codeSnippet), so new topics
// get a sheet for free when notes are added. Hand-written sections join the same shape via
// withItemIds() in src/data/quick-recall-registry.ts.

import type { Note, QuickRecallItem, QuickRecallSection } from '@/types/content';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface DeriveOptions {
  /** Base URL of the notes page these notes render on — items deep-link back via `?open=<id>`. */
  notesUrl?: string;
  /** Prefix for section titles when one sheet merges several note sources (e.g. "Jest: mocks"). */
  sectionLabel?: string;
}

/**
 * Derives quick-recall sections from notes, grouped by `category` (first-seen order preserved).
 */
export function deriveQuickRecallSections(notes: Note[], options?: DeriveOptions): QuickRecallSection[] {
  const { notesUrl, sectionLabel } = options ?? {};
  const byCategory = new Map<string, QuickRecallItem[]>();
  for (const note of notes) {
    let items = byCategory.get(note.category);
    if (!items) {
      items = [];
      byCategory.set(note.category, items);
    }
    items.push({
      id: note.id,
      href: notesUrl ? `${notesUrl}?open=${note.id}` : undefined,
      concept: note.title,
      bullets: note.keyPoints,
      codeSnippet: note.codeSnippet,
      warning: note.gotcha
    });
  }
  return [...byCategory].map(([category, items]) => ({
    title: sectionLabel ? `${sectionLabel}: ${category}` : category,
    items
  }));
}

/** Assigns a deterministic id to any item missing one (hand-written sheets) — section title + concept slug. */
export function withItemIds(sections: QuickRecallSection[]): QuickRecallSection[] {
  return sections.map((section) => ({
    ...section,
    items: section.items.map((item) => ({ ...item, id: item.id ?? `${slugify(section.title)}-${slugify(item.concept)}` }))
  }));
}
