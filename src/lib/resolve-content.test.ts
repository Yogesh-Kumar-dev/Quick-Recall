import { describe, expect, it } from 'vitest';

import { flashcardByKey } from '@/data/flashcards-index';
import { jsProblems } from '@/data/javascript/js-problems';
import { jsNotes } from '@/data/javascript/js-notes';
import { reactMcProblems } from '@/data/react/react-mc-problems';
import { resolveContent } from './resolve-content';

// We pull sample ids/slugs FROM the real content at test time rather than hardcoding strings,
// so these tests keep passing as content is added or renamed — they assert the resolver's
// behaviour, not the current catalogue.

describe('resolveContent', () => {
  it('resolves a note by id', () => {
    const note = jsNotes[0];
    const resolved = resolveContent('note', note.id);
    expect(resolved).toEqual({ kind: 'note', refId: note.id, note });
  });

  it('resolves a flashcard by its namespaced key', () => {
    const [key, indexed] = [...flashcardByKey.entries()][0];
    const resolved = resolveContent('flashcard', key);
    expect(resolved).toEqual({ kind: 'flashcard', refId: key, card: indexed.card });
  });

  it('resolves a JS problem to a /js/machine-coding/ url', () => {
    const slug = jsProblems[0].slug;
    const resolved = resolveContent('problem', slug);
    expect(resolved?.kind).toBe('problem');
    expect(resolved && 'url' in resolved && resolved.url).toBe(`/js/machine-coding/${slug}`);
  });

  it('resolves a React problem to a /react/machine-coding/ url', () => {
    const slug = reactMcProblems[0].slug;
    const resolved = resolveContent('problem', slug);
    expect(resolved && 'url' in resolved && resolved.url).toBe(`/react/machine-coding/${slug}`);
  });

  it.each(['note', 'flashcard', 'problem'] as const)('returns null for an unknown %s refId', (kind) => {
    expect(resolveContent(kind, 'definitely-not-a-real-ref-id')).toBeNull();
  });
});
